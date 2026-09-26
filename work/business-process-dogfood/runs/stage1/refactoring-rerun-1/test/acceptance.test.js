import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { Client } from 'pg';
import { createApplication } from '../src/app.js';
const connectionString = process.env.DATABASE_URL ?? 'postgres://dogfood:dogfood@localhost:55432/dogfood';
async function app() { const c=new Client({connectionString}); await c.connect(); await c.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;'); await c.query(await readFile(new URL('../../../../../../docs/business-process-dogfood/ddl.sql', import.meta.url),'utf8')); return [createApplication({connectionString}),c]; }
test('creates quotations with duplicate product lines and searches exact identifiers deterministically', async () => {
  const [a, c] = await app();
  try {
    const first = await a.createQuotation({ customerId: 'customer-1', expiresAt: '2030-01-01T00:00:00Z', lines: [{ productId: 'product-1', quantity: 2, unitPrice: 50 }, { productId: 'product-1', quantity: 1, unitPrice: 25 }] });
    const second = await a.createQuotation({ customerId: 'customer-1', expiresAt: '2030-01-02T00:00:00Z', lines: [{ productId: 'product-2', quantity: 1, unitPrice: 1 }] });
    assert.equal(first.status, 'open');
    assert.equal(first.lines.length, 2);
    assert.deepEqual((await a.searchQuotations({ customerId: 'customer-1' })).map(({ quotationId }) => quotationId), [first.quotationId, second.quotationId]);
    assert.deepEqual((await a.searchQuotations({ productId: 'product-1' })).map(({ quotationId }) => quotationId), [first.quotationId]);
    assert.deepEqual((await a.searchQuotations({ quotationId: second.quotationId })).map(({ quotationId }) => quotationId), [second.quotationId]);
  } finally { await c.end(); }
});

test('rejects invalid inputs and makes business-expired quotations readable', async () => {
  const [a, c] = await app();
  try {
    await assert.rejects(() => a.createQuotation({ customerId: ' ', expiresAt: '2030-01-01T00:00:00Z', lines: [{ productId: 'p', quantity: 1, unitPrice: 1 }] }));
    await assert.rejects(() => a.createQuotation({ customerId: 'c', expiresAt: '2030-01-01T00:00:00Z', lines: [] }));
    await assert.rejects(() => a.createQuotation({ customerId: 'c', expiresAt: '2000-01-01T00:00:00Z', lines: [{ productId: 'p', quantity: 1, unitPrice: 1 }] }), /strictly later/);
    await assert.rejects(() => a.createQuotation({ customerId: 'c', expiresAt: '2030-01-01T00:00:00Z', lines: [{ productId: '\t', quantity: 1, unitPrice: 1 }] }));
    await c.query("INSERT INTO quotation (customer_id, expires_at) VALUES ('c', CURRENT_TIMESTAMP - INTERVAL '1 second')");
    const expired = (await a.searchQuotations({ customerId: 'c' }))[0];
    assert.equal(expired.status, 'expired');
    assert.equal(expired.customerId, 'c');
  } finally { await c.end(); }
});
