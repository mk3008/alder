import { Pool } from 'pg';

class QuotationStore {
  constructor(pool) { this.pool = pool; }

  async create(input) {
    const { customerId, expiresAt, lines } = input ?? {};
    this.requireIdentifier(customerId, 'customerId');
    if (!Array.isArray(lines) || lines.length === 0) throw new Error('A quotation requires at least one line');
    for (const line of lines) this.validateLine(line);

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
    if (customerId !== undefined) this.requireIdentifier(customerId, 'customerId');
    if (productId !== undefined) this.requireIdentifier(productId, 'productId');
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

  async revise(quotationId, changes = {}) {
    this.requireDatabaseId(quotationId, 'quotationId');
    const { customerId, expiresAt, lines } = changes ?? {};
    if (customerId !== undefined) this.requireIdentifier(customerId, 'customerId');
    if (lines !== undefined) {
      if (!Array.isArray(lines) || lines.length === 0) throw new Error('A quotation requires at least one line');
      for (const line of lines) this.validateLine(line);
    }

    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const current = await client.query(
        `SELECT quotation_id FROM quotation WHERE quotation_id = $1 FOR UPDATE`, [quotationId],
      );
      if (current.rowCount !== 1) throw new Error('Quotation not found');
      if (customerId !== undefined || expiresAt !== undefined) {
        const updated = await client.query(
          `UPDATE quotation
              SET customer_id = COALESCE($2::text, customer_id),
                  expires_at = COALESCE($3::timestamptz, expires_at)
            WHERE quotation_id = $1
          RETURNING quotation_id`,
          [quotationId, customerId ?? null, expiresAt ?? null],
        );
        if (updated.rowCount !== 1) throw new Error('Quotation not found');
      }
      if (lines !== undefined) {
        await client.query('DELETE FROM quotation_line WHERE quotation_id = $1', [quotationId]);
        for (const { productId, quantity, unitPrice } of lines) {
          await client.query(
            `INSERT INTO quotation_line (quotation_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)`,
            [quotationId, productId, quantity, unitPrice],
          );
        }
      }
      await client.query('COMMIT');
      return this.readQuotation(client, quotationId);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally { client.release(); }
  }

  requireIdentifier(value, name) {
    if (typeof value !== 'string' || value.trim() === '') throw new Error(`${name} must be a nonblank identifier`);
  }

  validateLine(line) {
    const { productId, quantity, unitPrice } = line ?? {};
    this.requireIdentifier(productId, 'productId');
    if (quantity === undefined || unitPrice === undefined) throw new Error('Each quotation line requires quantity and unitPrice');
    if (Number.isNaN(quantity) || Number.isNaN(unitPrice)) throw new Error('quantity and unitPrice must not be NaN');
  }

  requireDatabaseId(value, name) {
    if (!(Number.isInteger(value) && value >= 0) && !(typeof value === 'string' && /^\d+$/.test(value))) {
      throw new Error(`${name} must be an integer`);
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
  constructor(pool) { this.pool = pool; }

  async createFromQuotation(quotationId) {
    this.requireDatabaseId(quotationId, 'quotationId');
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const quotation = await client.query(
        `SELECT customer_id FROM quotation WHERE quotation_id = $1 FOR SHARE`, [quotationId],
      );
      if (quotation.rowCount !== 1) throw new Error('Quotation not found');
      const order = await client.query(
        `INSERT INTO customer_order (customer_id, quotation_id, total_amount)
         SELECT $2, $1, COALESCE(SUM(quantity * unit_price), 0)
           FROM quotation_line WHERE quotation_id = $1
         RETURNING order_id`,
        [quotationId, quotation.rows[0].customer_id],
      );
      const orderId = order.rows[0].order_id;
      await client.query(
        `INSERT INTO order_line (order_id, product_id, quantity, unit_price)
         SELECT $2, product_id, quantity, unit_price
           FROM quotation_line WHERE quotation_id = $1`,
        [quotationId, orderId],
      );
      await client.query('COMMIT');
      return this.get(client, orderId);
    } catch (error) {
      await client.query('ROLLBACK');
      if (error?.code === '23505') throw new Error('Quotation already has an order');
      throw error;
    } finally { client.release(); }
  }

  async createDirect(input) {
    const { customerId, lines } = input ?? {};
    this.requireIdentifier(customerId, 'customerId');
    if (!Array.isArray(lines)) throw new Error('lines must be an array');
    for (const line of lines) this.validateLine(line);
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const order = await client.query(
        `INSERT INTO customer_order (customer_id, total_amount)
         VALUES ($1, 0) RETURNING order_id`,
        [customerId],
      );
      const orderId = order.rows[0].order_id;
      for (const { productId, quantity, unitPrice } of lines) {
        await client.query(
          `INSERT INTO order_line (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)`,
          [orderId, productId, quantity, unitPrice],
        );
      }
      await client.query(
        `UPDATE customer_order
            SET total_amount = COALESCE((
              SELECT SUM(quantity * unit_price) FROM order_line WHERE order_id = $1
            ), 0)
          WHERE order_id = $1`,
        [orderId],
      );
      await client.query('COMMIT');
      return this.get(client, orderId);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally { client.release(); }
  }

  async get(queryable, orderId) {
    const order = await queryable.query(
      `SELECT order_id AS "orderId", customer_id AS "customerId", quotation_id AS "quotationId",
              status, total_amount AS "totalAmount"
         FROM customer_order WHERE order_id = $1`, [orderId],
    );
    if (order.rowCount !== 1) throw new Error('Order not found');
    const lines = await queryable.query(
      `SELECT order_line_id AS "orderLineId", product_id AS "productId", quantity, unit_price AS "unitPrice"
         FROM order_line WHERE order_id = $1 ORDER BY order_line_id`, [orderId],
    );
    return { ...order.rows[0], lines: lines.rows };
  }

  requireIdentifier(value, name) {
    if (typeof value !== 'string' || value.trim() === '') throw new Error(`${name} must be a nonblank identifier`);
  }

  validateLine(line) {
    const { productId, quantity, unitPrice } = line ?? {};
    this.requireIdentifier(productId, 'productId');
    if (quantity === undefined || unitPrice === undefined) throw new Error('Each order line requires quantity and unitPrice');
    if (Number.isNaN(quantity) || Number.isNaN(unitPrice)) throw new Error('quantity and unitPrice must not be NaN');
  }

  requireDatabaseId(value, name) {
    if (!(Number.isInteger(value) && value >= 0) && !(typeof value === 'string' && /^\d+$/.test(value))) {
      throw new Error(`${name} must be an integer`);
    }
  }
}

export function createApplication({ connectionString = process.env.DATABASE_URL } = {}) {
  if (!connectionString) throw new Error('DATABASE_URL is required');
  const pool = new Pool({ connectionString, allowExitOnIdle: true });
  const quotations = new QuotationStore(pool);
  const orders = new OrderStore(pool);
  return {
    createQuotation: (input) => quotations.create(input),
    searchQuotations: (criteria) => quotations.search(criteria),
    reviseQuotation: (quotationId, changes) => quotations.revise(quotationId, changes),
    createOrderFromQuotation: (quotationId) => orders.createFromQuotation(quotationId),
    createDirectOrder: (input) => orders.createDirect(input),
    getOrder: (orderId) => orders.get(pool, orderId),
  };
}
