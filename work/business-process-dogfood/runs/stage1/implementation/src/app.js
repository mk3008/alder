import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';

const quotationTables = ['quotations', 'quotation'];
const quotationLineTables = ['quotation_lines', 'quotation_line'];

/**
 * Owns the physical representation of quotations.  Keeping table-name
 * compatibility here lets the application activity remain about quotations,
 * rather than about a particular pluralisation of the frozen schema.
 */
class QuotationStore {
  constructor(pool) {
    this.pool = pool;
    this.tables = undefined;
  }

  async getTables(client) {
    if (this.tables) return this.tables;

    const findTable = async (candidates) => {
      for (const table of candidates) {
        const { rows } = await client.query('SELECT to_regclass($1) AS name', [`public.${table}`]);
        if (rows[0].name) return table;
      }
      throw new Error(`Frozen quotation schema is missing one of: ${candidates.join(', ')}`);
    };

    this.tables = {
      quotation: await findTable(quotationTables),
      line: await findTable(quotationLineTables),
    };
    return this.tables;
  }

  async create({ customerId, expiresAt, lines }) {
    if (!Array.isArray(lines) || lines.length === 0) {
      throw new Error('A quotation requires at least one line');
    }

    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const { quotation, line } = await this.getTables(client);
      const quotationId = randomUUID();
      await client.query(
        `INSERT INTO ${quotation} (quotation_id, customer_id, expires_at) VALUES ($1, $2, $3)`,
        [quotationId, customerId, expiresAt],
      );

      const savedLines = [];
      for (const input of lines) {
        const quotationLineId = randomUUID();
        await client.query(
          `INSERT INTO ${line} (quotation_line_id, quotation_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4, $5)`,
          [quotationLineId, quotationId, input.productId, input.quantity, input.unitPrice],
        );
        savedLines.push({ quotationLineId, ...input });
      }
      await client.query('COMMIT');
      return { quotationId, customerId, expiresAt, lines: savedLines };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async search({ customerId } = {}) {
    const client = await this.pool.connect();
    try {
      const { quotation, line } = await this.getTables(client);
      const where = customerId === undefined ? '' : ' WHERE customer_id = $1';
      const values = customerId === undefined ? [] : [customerId];
      const { rows: quotations } = await client.query(
        `SELECT quotation_id, customer_id, expires_at FROM ${quotation}${where} ORDER BY quotation_id`,
        values,
      );
      if (quotations.length === 0) return [];

      const ids = quotations.map(({ quotation_id }) => quotation_id);
      const { rows: lines } = await client.query(
        `SELECT quotation_line_id, quotation_id, product_id, quantity, unit_price FROM ${line} WHERE quotation_id = ANY($1) ORDER BY quotation_line_id`,
        [ids],
      );
      const linesByQuotation = new Map(ids.map((id) => [id, []]));
      for (const row of lines) {
        linesByQuotation.get(row.quotation_id).push({
          quotationLineId: row.quotation_line_id,
          productId: row.product_id,
          quantity: row.quantity,
          unitPrice: row.unit_price,
        });
      }
      return quotations.map((row) => ({
        quotationId: row.quotation_id,
        customerId: row.customer_id,
        expiresAt: row.expires_at,
        lines: linesByQuotation.get(row.quotation_id),
      }));
    } finally {
      client.release();
    }
  }
}

// The fixed public entry point.
export function createApplication({ connectionString } = {}) {
  const pool = new Pool({ connectionString });
  const quotations = new QuotationStore(pool);
  return {
    createQuotation: (input) => quotations.create(input),
    searchQuotations: (criteria) => quotations.search(criteria),
  };
}
