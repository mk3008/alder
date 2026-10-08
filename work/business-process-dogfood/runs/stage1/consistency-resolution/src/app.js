import { Pool } from 'pg';

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
      return readQuotation(client, quotationId);
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
    return Promise.all(rows.map(({ quotation_id }) => readQuotation(this.pool, quotation_id)));
  }
}

export function createApplication({ connectionString = process.env.DATABASE_URL } = {}) {
  if (!connectionString) throw new Error('DATABASE_URL is required');
  const quotations = new QuotationStore(new Pool({ connectionString, allowExitOnIdle: true }));
  return { createQuotation: (input) => quotations.create(input), searchQuotations: (criteria) => quotations.search(criteria) };
}

function requireIdentifier(value, name) {
  if (typeof value !== 'string' || value.trim() === '') throw new Error(`${name} must be a nonblank identifier`);
}

function validateLine(line) {
  const { productId, quantity, unitPrice } = line ?? {};
  requireIdentifier(productId, 'productId');
  if (quantity === undefined || unitPrice === undefined) throw new Error('Each quotation line requires quantity and unitPrice');
  if (Number.isNaN(quantity) || Number.isNaN(unitPrice)) throw new Error('quantity and unitPrice must not be NaN');
}

async function readQuotation(queryable, quotationId) {
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
