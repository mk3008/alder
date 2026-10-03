import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { Client } from 'pg';

const root = process.env.STUDY_ROOT;
const applicationRoot = process.env.APP_ROOT;
if (!root || !applicationRoot) throw new Error('STUDY_ROOT and APP_ROOT are required');
const { createApplication } = await import(pathToFileURL(resolve(applicationRoot, 'src/app.js')).href);
const connectionString = process.env.DATABASE_URL ?? 'postgres://dogfood:dogfood@localhost:55432/dogfood';

async function freshApplication() {
  const client = new Client({ connectionString });
  await client.connect();
  await client.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
  await client.query(await readFile(resolve(root, 'docs/business-process-dogfood/ddl.sql'), 'utf8'));
  return [createApplication({ connectionString }), client];
}

function future() { return '2030-01-01T00:00:00Z'; }
function line(productId = 'p', quantity = 2, unitPrice = 50) { return { productId, quantity, unitPrice }; }

test('Stage 1 active conditions: create, line cardinality, identifiers, numbers, expiry, and deterministic search', async () => {
  const [app, client] = await freshApplication();
  const quotation = await app.createQuotation({ customerId: 'c1', expiresAt: future(), lines: [line('duplicate'), line('duplicate')] });
  assert.equal(quotation.lines.length, 2);
  assert.equal((await app.searchQuotations({ customerId: 'c1' }))[0].quotationId, quotation.quotationId);
  assert.deepEqual((await app.searchQuotations({ productId: 'duplicate' })).map((q) => q.quotationId), [quotation.quotationId]);
  await assert.rejects(() => app.createQuotation({ customerId: ' ', expiresAt: future(), lines: [line()] }));
  await assert.rejects(() => app.createQuotation({ customerId: 'c2', expiresAt: future(), lines: [line(' ')] }));
  await assert.rejects(() => app.createQuotation({ customerId: 'c2', expiresAt: future(), lines: [line('p', Number.NaN, 1)] }));
  await assert.rejects(() => app.createQuotation({ customerId: 'c2', expiresAt: '2000-01-01T00:00:00Z', lines: [line()] }));
  await client.query("INSERT INTO quotation (customer_id, expires_at) VALUES ('expired', statement_timestamp() - interval '1 second')");
  const expired = await app.searchQuotations({ customerId: 'expired' });
  assert.equal(expired.length, 1);
  assert.equal(expired[0].status, 'expired');
  await client.end();
});

test('Stage 2 active conditions: eligible revision and conversion create an immutable Order snapshot', async () => {
  const [app, client] = await freshApplication();
  const quotation = await app.createQuotation({ customerId: 'before', expiresAt: future(), lines: [line('p', 2, 50)] });
  await app.reviseQuotation(quotation.quotationId, { customerId: 'after', expiresAt: '2031-01-01T00:00:00Z', lines: [line('p', 9, 50)] });
  const order = await app.createOrderFromQuotation(quotation.quotationId);
  assert.equal(order.customerId, 'after');
  assert.equal(order.quotationId, quotation.quotationId);
  assert.equal(order.totalAmount, '450.00');
  assert.equal(order.lines.length, 1);
  assert.equal((await app.getOrder(order.orderId)).totalAmount, '450.00');
  await assert.rejects(() => app.reviseQuotation(quotation.quotationId, { lines: [line()] }));
  await assert.rejects(() => app.createOrderFromQuotation(quotation.quotationId));
  const readOnlySource = await app.searchQuotations({ quotationId: quotation.quotationId });
  assert.equal(readOnlySource[0].status, 'ordered');
  const direct = await app.createDirectOrder({ customerId: 'direct', lines: [line('x', 1, 5)] });
  assert.equal(direct.quotationId, null);
  await assert.rejects(() => app.createDirectOrder({ customerId: 'direct', lines: [] }));
  await client.end();
});
