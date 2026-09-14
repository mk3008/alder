import { Pool } from 'pg';

/**
 * The quotation boundary owns both the quotation and its lines.  Keeping the
 * write and the read assembly here means its current consumers do not need to
 * know about the physical table split.
 */
export function createApplication({ connectionString = process.env.DATABASE_URL } = {}) {
  if (!connectionString) {
    throw new Error('DATABASE_URL is required');
  }

  const pool = new Pool({ connectionString, allowExitOnIdle: true });

  return {
    async createQuotation(input) {
      const { customerId, expiresAt, lines } = input ?? {};
      if (customerId === undefined || expiresAt === undefined || !Array.isArray(lines) || lines.length === 0) {
        throw new Error('A quotation requires customerId, expiresAt, and at least one line');
      }

      const client = await pool.connect();
      try {
        await client.query('BEGIN');

        const created = await client.query(
          `INSERT INTO quotation (customer_id, expires_at)
           VALUES ($1, $2)
           RETURNING quotation_id`,
          [customerId, expiresAt],
        );
        const quotationId = created.rows[0].quotation_id;

        for (const line of lines) {
          const { productId, quantity, unitPrice } = line ?? {};
          if (productId === undefined || quantity === undefined || unitPrice === undefined) {
            throw new Error('Each quotation line requires productId, quantity, and unitPrice');
          }
          await client.query(
            `INSERT INTO quotation_line
              (quotation_id, product_id, quantity, unit_price)
             VALUES ($1, $2, $3, $4)`,
            [quotationId, productId, quantity, unitPrice],
          );
        }

        await client.query('COMMIT');
        return readQuotation(client, quotationId);
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    },

    async searchQuotations({ customerId } = {}) {
      const result = await pool.query(
        `SELECT quotation_id
           FROM quotation
          WHERE ($1::text IS NULL OR customer_id = $1)
          ORDER BY quotation_id`,
        [customerId ?? null],
      );
      return Promise.all(result.rows.map(({ quotation_id: quotationId }) => readQuotation(pool, quotationId)));
    },
  };
}

async function readQuotation(queryable, quotationId) {
  const quotation = await queryable.query(
    `SELECT quotation_id AS "quotationId", customer_id AS "customerId",
            expires_at AS "expiresAt", status
       FROM quotation WHERE quotation_id = $1`,
    [quotationId],
  );
  const lines = await queryable.query(
    `SELECT quotation_line_id AS "quotationLineId", product_id AS "productId",
            quantity, unit_price AS "unitPrice"
       FROM quotation_line WHERE quotation_id = $1 ORDER BY quotation_line_id`,
    [quotationId],
  );
  return { ...quotation.rows[0], lines: lines.rows };
}
