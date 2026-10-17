import { Pool } from 'pg';

function requireIdentifier(value, name) {
  if (typeof value !== 'string' || value.trim() === '') throw new Error(`${name} must be a nonblank identifier`);
}

function isFiniteDecimal(value) {
  if (typeof value === 'number') return Number.isFinite(value);
  return typeof value === 'string'
    && /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(value);
}

function validateLine(line) {
  const { productId, quantity, unitPrice } = line ?? {};
  requireIdentifier(productId, 'productId');
  if (quantity === undefined || unitPrice === undefined) throw new Error('Each quotation line requires quantity and unitPrice');
  if (!isFiniteDecimal(quantity) || !isFiniteDecimal(unitPrice)) {
    throw new Error('quantity and unitPrice must be finite numeric values');
  }
}

function requireActor(actor, role) {
  if (!actor || actor.role !== role) throw new Error(`A trusted ${role} actor is required`);
  requireIdentifier(actor.id, 'actor.id');
  return actor.id;
}

class QuotationStore {
  constructor(pool) { this.pool = pool; }

  async create(input) {
    const { customerId, expiresAt, lines } = input ?? {};
    requireIdentifier(customerId, 'customerId');
    if (!Array.isArray(lines) || lines.length === 0) throw new Error('A quotation requires at least one line');
    for (const line of lines) validateLine(line);

    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      // The quotation boundary owns the table split and enforces expiry at the write.
      const created = await client.query(
        `INSERT INTO quotation (customer_id, expires_at)
         SELECT $1, $2::timestamptz WHERE $2::timestamptz > statement_timestamp()
         RETURNING quotation_id`,
        [customerId, expiresAt],
      );
      if (created.rowCount !== 1) throw new Error('expiresAt must be strictly later than now');
      const quotationId = created.rows[0].quotation_id;
      for (const { productId, quantity, unitPrice } of lines) {
        await client.query(
          `INSERT INTO quotation_line (quotation_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)`,
          [quotationId, productId, quantity, unitPrice],
        );
      }
      await client.query('COMMIT');
      return this.readQuotation(client, quotationId);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally { client.release(); }
  }

  async search(criteria = {}) {
    const { quotationId, customerId, productId } = criteria ?? {};
    if (customerId !== undefined) requireIdentifier(customerId, 'customerId');
    if (productId !== undefined) requireIdentifier(productId, 'productId');
    const client = await this.pool.connect();
    try {
      // Keep headers and lines in one database snapshot while revisions replace lines.
      await client.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
      const { rows } = await client.query(
        `SELECT q.quotation_id FROM quotation q
          WHERE ($1::bigint IS NULL OR q.quotation_id = $1)
            AND ($2::text IS NULL OR q.customer_id = $2)
            AND ($3::text IS NULL OR EXISTS (
              SELECT 1 FROM quotation_line l WHERE l.quotation_id = q.quotation_id AND l.product_id = $3
            ))
          ORDER BY q.quotation_id`,
        [quotationId ?? null, customerId ?? null, productId ?? null],
      );
      const quotations = [];
      for (const { quotation_id } of rows) quotations.push(await this.readQuotation(client, quotation_id));
      await client.query('COMMIT');
      return quotations;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally { client.release(); }
  }

  async revise(quotationId, input) {
    const { customerId, expiresAt, lines } = input ?? {};
    if (!Array.isArray(lines) || lines.length === 0) throw new Error('A quotation requires at least one line');
    for (const line of lines) validateLine(line);
    if (customerId !== undefined) requireIdentifier(customerId, 'customerId');

    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await this.lockEligibleQuotation(client, quotationId);
      const revised = await client.query(
        `UPDATE quotation
            SET customer_id = CASE WHEN $2 THEN $3 ELSE customer_id END,
                expires_at = CASE WHEN $4 THEN $5::timestamptz ELSE expires_at END
          WHERE quotation_id = $1
            AND (NOT $4 OR $5::timestamptz > statement_timestamp())
          RETURNING quotation_id`,
        [quotationId, customerId !== undefined, customerId ?? null, expiresAt !== undefined, expiresAt ?? null],
      );
      if (revised.rowCount !== 1) throw new Error('expiresAt must be strictly later than now');
      await client.query('DELETE FROM quotation_line WHERE quotation_id = $1', [quotationId]);
      for (const { productId, quantity, unitPrice } of lines) {
        await client.query(
          `INSERT INTO quotation_line (quotation_id, product_id, quantity, unit_price)
           VALUES ($1, $2, $3, $4)`,
          [quotationId, productId, quantity, unitPrice],
        );
      }
      await client.query('COMMIT');
      return this.readQuotation(client, quotationId);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally { client.release(); }
  }

  async lockEligibleQuotation(client, quotationId) {
    const eligible = await client.query(
      `SELECT quotation_id
         FROM quotation q
        WHERE q.quotation_id = $1
          AND q.status = 'open'
          AND q.expires_at > statement_timestamp()
          AND NOT EXISTS (
            SELECT 1 FROM customer_order o WHERE o.quotation_id = q.quotation_id
          )
        FOR UPDATE`,
      [quotationId],
    );
    if (eligible.rowCount !== 1) {
      throw new Error('Quotation must be open, unexpired, and unassociated with an order');
    }
  }

  async readQuotation(queryable, quotationId) {
    const quotation = await queryable.query(
      `SELECT quotation_id AS "quotationId", customer_id AS "customerId", expires_at AS "expiresAt",
              CASE WHEN status = 'open' AND expires_at <= CURRENT_TIMESTAMP THEN 'expired' ELSE status END AS status
         FROM quotation WHERE quotation_id = $1`, [quotationId],
    );
    const lines = await queryable.query(
      `SELECT quotation_line_id AS "quotationLineId", product_id AS "productId", quantity, unit_price AS "unitPrice"
         FROM quotation_line WHERE quotation_id = $1 ORDER BY quotation_line_id`, [quotationId],
    );
    return { ...quotation.rows[0], lines: lines.rows };
  }
}

class OrderStore {
  constructor(pool, quotations) {
    this.pool = pool;
    this.quotations = quotations;
  }

  async createFromQuotation(quotationId, { actor } = {}) {
    const createdBy = requireActor(actor, 'sales');
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      // The quotation row lock serializes conversion and revision of one quotation.
      await this.quotations.lockEligibleQuotation(client, quotationId);
      const created = await client.query(
        `INSERT INTO customer_order (customer_id, created_by, quotation_id)
         SELECT customer_id, $2, quotation_id FROM quotation WHERE quotation_id = $1
         RETURNING order_id AS "orderId"`,
        [quotationId, createdBy],
      );
      const orderId = created.rows[0].orderId;
      const copied = await client.query(
        `INSERT INTO order_line (order_id, product_id, quantity, unit_price)
         SELECT $1, product_id, quantity, unit_price
           FROM quotation_line
          WHERE quotation_id = $2
          ORDER BY quotation_line_id`,
        [orderId, quotationId],
      );
      if (copied.rowCount < 1) throw new Error('An order requires at least one line');
      await this.initializeOrder(client, orderId);
      const ordered = await client.query(
        `UPDATE quotation SET status = 'ordered'
          WHERE quotation_id = $1 AND status = 'open' AND expires_at > statement_timestamp()
          RETURNING quotation_id`,
        [quotationId],
      );
      if (ordered.rowCount !== 1) throw new Error('Quotation is no longer eligible for conversion');
      await client.query('COMMIT');
      return this.readOrder(client, orderId);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally { client.release(); }
  }

  async createDirect(input) {
    const { customerId, lines, actor } = input ?? {};
    const createdBy = requireActor(actor, 'sales');
    requireIdentifier(customerId, 'customerId');
    if (!Array.isArray(lines) || lines.length === 0) throw new Error('An order requires at least one line');
    for (const line of lines) validateLine(line);

    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const created = await client.query(
        `INSERT INTO customer_order (customer_id, created_by, quotation_id) VALUES ($1, $2, NULL)
         RETURNING order_id AS "orderId"`,
        [customerId, createdBy],
      );
      const orderId = created.rows[0].orderId;
      await this.writeOrderLines(client, orderId, lines);
      await this.initializeOrder(client, orderId);
      await client.query('COMMIT');
      return this.readOrder(client, orderId);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally { client.release(); }
  }

  async revise(orderId, { actor, lines } = {}) {
    requireActor(actor, 'sales');
    if (!Array.isArray(lines) || lines.length === 0) throw new Error('An order requires at least one line');
    for (const line of lines) validateLine(line);

    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      // Locking the approved header makes the line replacement, approval removal, and
      // threshold re-evaluation one content transition.
      const eligible = await client.query(
        `SELECT order_id
           FROM customer_order
          WHERE order_id = $1 AND status = 'approved'
          FOR UPDATE`,
        [orderId],
      );
      if (eligible.rowCount !== 1) {
        throw new Error('Only an approved, unconfirmed order may be revised');
      }

      await client.query('DELETE FROM order_line WHERE order_id = $1', [orderId]);
      await this.writeOrderLines(client, orderId, lines);
      await client.query('DELETE FROM order_approval WHERE order_id = $1', [orderId]);
      await this.initializeOrder(client, orderId);
      // Read before committing, on the same transaction snapshot as the content
      // replacement.  A subsequent revision therefore cannot interleave between
      // the header and line reads that form this returned Order.
      const revised = await this.readOrder(client, orderId);
      await client.query('COMMIT');
      return revised;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally { client.release(); }
  }

  async writeOrderLines(client, orderId, lines) {
    for (const { productId, quantity, unitPrice } of lines) {
      await client.query(
        `INSERT INTO order_line (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)`,
        [orderId, productId, quantity, unitPrice],
      );
    }
  }

  async initializeOrder(client, orderId) {
    await client.query(
      `UPDATE customer_order AS o
          SET total_amount = totals.amount,
              status = CASE WHEN totals.amount >= 1000.00 THEN 'pending_approval' ELSE 'draft' END
         FROM (
           SELECT ROUND(COALESCE(SUM(quantity * unit_price), 0), 2) AS amount
             FROM order_line
            WHERE order_id = $1
         ) AS totals
        WHERE o.order_id = $1`,
      [orderId],
    );
  }

  async awaitingApproval({ actor } = {}) {
    requireActor(actor, 'manager');
    const client = await this.pool.connect();
    try {
      // The pending predicate and returned order details must describe one snapshot.
      await client.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
      const { rows } = await client.query(
        `SELECT order_id FROM customer_order WHERE status = 'pending_approval' ORDER BY order_id`,
      );
      const orders = [];
      for (const { order_id } of rows) orders.push(await this.readOrder(client, order_id));
      await client.query('COMMIT');
      return orders;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally { client.release(); }
  }

  async decideApproval({ orderId, decision, actor } = {}) {
    const managerId = requireActor(actor, 'manager');
    if (decision !== 'approved' && decision !== 'rejected') throw new Error('decision must be approved or rejected');
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const updated = await client.query(
        `UPDATE customer_order
            SET status = $2
          WHERE order_id = $1 AND status = 'pending_approval' AND created_by <> $3
          RETURNING order_id`, [orderId, decision, managerId],
      );
      if (updated.rowCount !== 1) throw new Error('Only another manager may decide a pending approval');
      await client.query(
        `INSERT INTO order_approval (order_id, manager_id, decision) VALUES ($1, $2, $3)`,
        [orderId, managerId, decision],
      );
      await client.query('COMMIT');
      return this.readOrder(client, orderId);
    } catch (error) {
      await client.query('ROLLBACK'); throw error;
    } finally { client.release(); }
  }

  async confirm(orderId, { actor } = {}) {
    requireActor(actor, 'sales');
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const updated = await client.query(
        `UPDATE customer_order
            SET status = 'confirmed'
          WHERE order_id = $1
            AND ((total_amount < 1000.00 AND status = 'draft') OR (total_amount >= 1000.00 AND status = 'approved'))
          RETURNING order_id`, [orderId],
      );
      if (updated.rowCount !== 1) throw new Error('Order is not eligible for confirmation');
      await client.query(
        `INSERT INTO inventory_reservation (order_id, status) VALUES ($1, 'requested')`,
        [orderId],
      );
      const order = await this.readOrder(client, orderId);
      await client.query('COMMIT');
      return order;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally { client.release(); }
  }

  async recordReservationResult({ orderId, status, actor } = {}) {
    requireActor(actor, 'inventory');
    if (status !== 'reserved' && status !== 'failed') {
      throw new Error('status must be reserved or failed');
    }
    const updated = await this.pool.query(
      `UPDATE inventory_reservation
          SET status = $2
        WHERE order_id = $1 AND status = 'requested'
        RETURNING order_id`,
      [orderId, status],
    );
    if (updated.rowCount !== 1) {
      throw new Error('Only a requested reservation may receive a result');
    }
  }

  async get(orderId) {
    const client = await this.pool.connect();
    try {
      // readOrder issues separate header and line queries, so pin both to one
      // committed snapshot while another transaction may revise the Order.
      await client.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
      const order = await this.readOrder(client, orderId);
      await client.query('COMMIT');
      return order;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally { client.release(); }
  }

  async readOrder(queryable, orderId) {
    // One statement gives the header and all lines a single database snapshot,
    // including when this helper is called outside an explicit transaction.
    const { rows } = await queryable.query(
      `SELECT o.order_id AS "orderId", o.customer_id AS "customerId", o.quotation_id AS "quotationId",
              o.created_by AS "createdBy", o.status, o.total_amount AS "totalAmount", o.shipment_at AS "shipmentAt",
              l.order_line_id AS "orderLineId", l.product_id AS "productId", l.quantity, l.unit_price AS "unitPrice"
         FROM customer_order o
         LEFT JOIN order_line l ON l.order_id = o.order_id
        WHERE o.order_id = $1
        ORDER BY l.order_line_id`,
      [orderId],
    );
    if (rows.length === 0) return { lines: [] };
    const [{ orderLineId: _firstOrderLineId, productId: _firstProductId, quantity: _firstQuantity,
      unitPrice: _firstUnitPrice, ...order }] = rows;
    return {
      ...order,
      lines: rows
        .filter(({ orderLineId }) => orderLineId !== null)
        .map(({ orderLineId, productId, quantity, unitPrice }) => ({ orderLineId, productId, quantity, unitPrice })),
    };
  }
}

export function createApplication({ connectionString = process.env.DATABASE_URL } = {}) {
  if (!connectionString) throw new Error('DATABASE_URL is required');
  const pool = new Pool({ connectionString, allowExitOnIdle: true });
  const quotations = new QuotationStore(pool);
  const orders = new OrderStore(pool, quotations);
  return {
    createQuotation: (input) => quotations.create(input),
    searchQuotations: (criteria) => quotations.search(criteria),
    reviseQuotation: (quotationId, input) => quotations.revise(quotationId, input),
    createOrderFromQuotation: (quotationId, input) => orders.createFromQuotation(quotationId, input),
    createDirectOrder: (input) => orders.createDirect(input),
    reviseOrder: (orderId, input) => orders.revise(orderId, input),
    getOrder: (orderId) => orders.get(orderId),
    searchOrdersAwaitingApproval: (input) => orders.awaitingApproval(input),
    decideOrderApproval: (input) => orders.decideApproval(input),
    confirmOrder: (orderId, input) => orders.confirm(orderId, input),
    recordReservationResult: (input) => orders.recordReservationResult(input),
  };
}
