import { Pool } from 'pg';

class SalesStore {
  constructor(pool) { this.pool = pool; }
  requireIdentifier(value, name) { if (typeof value !== 'string' || value.trim() === '') throw new Error(`${name} must be a nonblank identifier`); }
  validateLines(lines, label) {
    if (!Array.isArray(lines) || lines.length === 0) throw new Error(`A ${label} requires at least one line`);
    for (const line of lines) {
      const { productId, quantity, unitPrice } = line ?? {};
      this.requireIdentifier(productId, 'productId');
      if (quantity === undefined || unitPrice === undefined || Number.isNaN(quantity) || Number.isNaN(unitPrice)) throw new Error('Each line requires non-NaN quantity and unitPrice');
    }
  }
  async inTransaction(work, options = '') {
    const client = await this.pool.connect();
    try { await client.query(`BEGIN ${options}`); const result = await work(client); await client.query('COMMIT'); return result; }
    catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
  }
  async createQuotation({ customerId, expiresAt, lines } = {}) {
    this.requireIdentifier(customerId, 'customerId'); this.validateLines(lines, 'quotation');
    return this.inTransaction(async (client) => {
      const created = await client.query(`INSERT INTO quotation (customer_id, expires_at) SELECT $1, $2::timestamptz WHERE $2::timestamptz > statement_timestamp() RETURNING quotation_id`, [customerId, expiresAt]);
      if (created.rowCount !== 1) throw new Error('expiresAt must be strictly later than now');
      const quotationId = created.rows[0].quotation_id;
      await this.insertQuotationLines(client, quotationId, lines);
      return this.readQuotation(client, quotationId);
    });
  }
  async reviseQuotation(quotationId, changes = {}) {
    return this.inTransaction(async (client) => {
      const quotation = await this.lockRevisableQuotation(client, quotationId);
      const customerId = changes.customerId ?? quotation.customer_id;
      const expiresAt = changes.expiresAt ?? quotation.expires_at;
      this.requireIdentifier(customerId, 'customerId');
      if (changes.lines !== undefined) this.validateLines(changes.lines, 'quotation');
      const validExpiry = await client.query('SELECT $1::timestamptz > statement_timestamp() AS valid', [expiresAt]);
      if (!validExpiry.rows[0].valid) throw new Error('expiresAt must be strictly later than now');
      await client.query('UPDATE quotation SET customer_id = $2, expires_at = $3 WHERE quotation_id = $1', [quotationId, customerId, expiresAt]);
      if (changes.lines !== undefined) { await client.query('DELETE FROM quotation_line WHERE quotation_id = $1', [quotationId]); await this.insertQuotationLines(client, quotationId, changes.lines); }
      return this.readQuotation(client, quotationId);
    });
  }
  async createDirectOrder({ customerId, lines } = {}) {
    this.requireIdentifier(customerId, 'customerId'); this.validateLines(lines, 'order');
    return this.inTransaction((client) => this.createOrder(client, { customerId, quotationId: null, lines }));
  }
  async createOrderFromQuotation(quotationId) {
    return this.inTransaction(async (client) => {
      const quotation = await this.lockRevisableQuotation(client, quotationId);
      const lines = await client.query(`SELECT product_id AS "productId", quantity, unit_price AS "unitPrice" FROM quotation_line WHERE quotation_id = $1 ORDER BY quotation_line_id`, [quotationId]);
      if (lines.rowCount === 0) throw new Error('A sourced order requires at least one quotation line');
      const order = await this.createOrder(client, { customerId: quotation.customer_id, quotationId, lines: lines.rows });
      await client.query("UPDATE quotation SET status = 'ordered' WHERE quotation_id = $1", [quotationId]);
      return order;
    });
  }
  async lockRevisableQuotation(client, quotationId) {
    const result = await client.query('SELECT quotation_id, customer_id, expires_at, status FROM quotation WHERE quotation_id = $1 FOR UPDATE', [quotationId]);
    if (result.rowCount !== 1) throw new Error('Quotation not found');
    const quotation = result.rows[0];
    const association = await client.query('SELECT 1 FROM customer_order WHERE quotation_id = $1', [quotationId]);
    const unexpired = await client.query('SELECT $1::timestamptz > statement_timestamp() AS valid', [quotation.expires_at]);
    if (quotation.status !== 'open' || association.rowCount !== 0 || !unexpired.rows[0].valid) throw new Error('Quotation must be open, unexpired, and unassociated');
    return quotation;
  }
  async createOrder(client, { customerId, quotationId, lines }) {
    const created = await client.query(`INSERT INTO customer_order (customer_id, quotation_id, status, total_amount) VALUES ($1, $2, 'draft', 0) RETURNING order_id`, [customerId, quotationId]);
    const orderId = created.rows[0].order_id;
    for (const { productId, quantity, unitPrice } of lines) await client.query('INSERT INTO order_line (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)', [orderId, productId, quantity, unitPrice]);
    await client.query('UPDATE customer_order SET total_amount = (SELECT COALESCE(SUM(quantity * unit_price), 0) FROM order_line WHERE order_id = $1) WHERE order_id = $1', [orderId]);
    return this.readOrder(client, orderId);
  }
  async insertQuotationLines(client, quotationId, lines) { for (const { productId, quantity, unitPrice } of lines) await client.query('INSERT INTO quotation_line (quotation_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)', [quotationId, productId, quantity, unitPrice]); }
  async searchQuotations(criteria = {}) {
    const { quotationId, customerId, productId } = criteria;
    if (customerId !== undefined) this.requireIdentifier(customerId, 'customerId'); if (productId !== undefined) this.requireIdentifier(productId, 'productId');
    return this.inTransaction(async (client) => {
      const selected = await client.query(`SELECT q.quotation_id FROM quotation q WHERE ($1::bigint IS NULL OR q.quotation_id = $1) AND ($2::text IS NULL OR q.customer_id = $2) AND ($3::text IS NULL OR EXISTS (SELECT 1 FROM quotation_line l WHERE l.quotation_id = q.quotation_id AND l.product_id = $3)) ORDER BY q.quotation_id`, [quotationId ?? null, customerId ?? null, productId ?? null]);
      return Promise.all(selected.rows.map(({ quotation_id }) => this.readQuotation(client, quotation_id)));
    }, 'ISOLATION LEVEL REPEATABLE READ READ ONLY');
  }
  async getOrder(orderId) { return this.inTransaction((client) => this.readOrder(client, orderId), 'ISOLATION LEVEL REPEATABLE READ READ ONLY'); }
  async readQuotation(client, quotationId) {
    const header = await client.query(`SELECT q.quotation_id AS "quotationId", q.customer_id AS "customerId", q.expires_at AS "expiresAt", CASE WHEN o.order_id IS NOT NULL THEN 'ordered' WHEN q.expires_at <= statement_timestamp() THEN 'expired' ELSE 'open' END AS status FROM quotation q LEFT JOIN customer_order o ON o.quotation_id = q.quotation_id WHERE q.quotation_id = $1`, [quotationId]);
    if (header.rowCount !== 1) throw new Error('Quotation not found');
    const lines = await client.query(`SELECT quotation_line_id AS "quotationLineId", product_id AS "productId", quantity, unit_price AS "unitPrice" FROM quotation_line WHERE quotation_id = $1 ORDER BY quotation_line_id`, [quotationId]);
    return { ...header.rows[0], lines: lines.rows };
  }
  async readOrder(client, orderId) {
    const header = await client.query(`SELECT order_id AS "orderId", customer_id AS "customerId", quotation_id AS "quotationId", status, total_amount AS "totalAmount" FROM customer_order WHERE order_id = $1`, [orderId]);
    if (header.rowCount !== 1) throw new Error('Order not found');
    const lines = await client.query(`SELECT order_line_id AS "orderLineId", product_id AS "productId", quantity, unit_price AS "unitPrice" FROM order_line WHERE order_id = $1 ORDER BY order_line_id`, [orderId]);
    return { ...header.rows[0], lines: lines.rows };
  }
}

export function createApplication({ connectionString = process.env.DATABASE_URL } = {}) {
  if (!connectionString) throw new Error('DATABASE_URL is required');
  const sales = new SalesStore(new Pool({ connectionString, allowExitOnIdle: true }));
  return { createQuotation: (input) => sales.createQuotation(input), searchQuotations: (criteria) => sales.searchQuotations(criteria), reviseQuotation: (quotationId, changes) => sales.reviseQuotation(quotationId, changes), createDirectOrder: (input) => sales.createDirectOrder(input), createOrderFromQuotation: (quotationId) => sales.createOrderFromQuotation(quotationId), getOrder: (orderId) => sales.getOrder(orderId) };
}
