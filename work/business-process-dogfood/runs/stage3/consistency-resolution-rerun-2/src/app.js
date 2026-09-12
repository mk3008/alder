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
    const { rows } = await this.pool.query(
      `SELECT q.quotation_id FROM quotation q
        WHERE ($1::bigint IS NULL OR q.quotation_id = $1)
          AND ($2::text IS NULL OR q.customer_id = $2)
          AND ($3::text IS NULL OR EXISTS (
            SELECT 1 FROM quotation_line l WHERE l.quotation_id = q.quotation_id AND l.product_id = $3
          ))
        ORDER BY q.quotation_id`,
      [quotationId ?? null, customerId ?? null, productId ?? null],
    );
    return Promise.all(rows.map(({ quotation_id }) => this.readQuotation(this.pool, quotation_id)));
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
      await this.setTotal(client, orderId);
      await this.setInitialStatus(client, orderId);
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
      for (const { productId, quantity, unitPrice } of lines) {
        await client.query(
          `INSERT INTO order_line (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)`,
          [orderId, productId, quantity, unitPrice],
        );
      }
      await this.setTotal(client, orderId);
      await this.setInitialStatus(client, orderId);
      await client.query('COMMIT');
      return this.readOrder(client, orderId);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally { client.release(); }
  }

  async setTotal(client, orderId) {
    await client.query(
      `UPDATE customer_order
          SET total_amount = (
            SELECT ROUND(COALESCE(SUM(quantity * unit_price), 0), 2) FROM order_line WHERE order_id = $1
          )
        WHERE order_id = $1`,
      [orderId],
    );
  }

  async setInitialStatus(client, orderId) {
    await client.query(
      `UPDATE customer_order
          SET status = CASE WHEN total_amount >= 1000.00 THEN 'pending_approval' ELSE 'draft' END
        WHERE order_id = $1`, [orderId],
    );
  }

  async awaitingApproval({ actor } = {}) {
    requireActor(actor, 'manager');
    const { rows } = await this.pool.query(
      `SELECT order_id FROM customer_order WHERE status = 'pending_approval' ORDER BY order_id`,
    );
    return Promise.all(rows.map(({ order_id }) => this.readOrder(this.pool, order_id)));
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
    const updated = await this.pool.query(
      `UPDATE customer_order
          SET status = 'confirmed'
        WHERE order_id = $1
          AND ((total_amount < 1000.00 AND status = 'draft') OR (total_amount >= 1000.00 AND status = 'approved'))
        RETURNING order_id`, [orderId],
    );
    if (updated.rowCount !== 1) throw new Error('Order is not eligible for confirmation');
    return this.readOrder(this.pool, orderId);
  }

  async get(orderId) { return this.readOrder(this.pool, orderId); }

  async readOrder(queryable, orderId) {
    const order = await queryable.query(
      `SELECT order_id AS "orderId", customer_id AS "customerId", quotation_id AS "quotationId",
              created_by AS "createdBy", status, total_amount AS "totalAmount", shipment_at AS "shipmentAt"
         FROM customer_order WHERE order_id = $1`,
      [orderId],
    );
    const lines = await queryable.query(
      `SELECT order_line_id AS "orderLineId", product_id AS "productId", quantity, unit_price AS "unitPrice"
         FROM order_line WHERE order_id = $1 ORDER BY order_line_id`,
      [orderId],
    );
    return { ...order.rows[0], lines: lines.rows };
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
    getOrder: (orderId) => orders.get(orderId),
    searchOrdersAwaitingApproval: (input) => orders.awaitingApproval(input),
    decideOrderApproval: (input) => orders.decideApproval(input),
    confirmOrder: (orderId, input) => orders.confirm(orderId, input),
  };
}
