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

function actor(id, role) { return { id, role }; }
function line(productId = 'p', quantity = 2, unitPrice = 50) { return { productId, quantity, unitPrice }; }

test('Stage 1 and Stage 2 active acceptance conditions remain satisfied', async () => {
  const [app, client] = await freshApplication();
  const q = await app.createQuotation({ customerId: 'c1', expiresAt: '2030-01-01T00:00:00Z', lines: [line('duplicate'), line('duplicate')] });
  assert.equal((await app.searchQuotations({ customerId: 'c1' }))[0].quotationId, q.quotationId);
  await assert.rejects(() => app.createQuotation({ customerId: ' ', expiresAt: '2030-01-01T00:00:00Z', lines: [line()] }));
  await assert.rejects(() => app.createQuotation({ customerId: 'c2', expiresAt: '2030-01-01T00:00:00Z', lines: [line(' ')] }));
  await assert.rejects(() => app.createQuotation({ customerId: 'c2', expiresAt: '2030-01-01T00:00:00Z', lines: [line('p', Number.NaN, 1)] }));
  await assert.rejects(() => app.createQuotation({ customerId: 'c2', expiresAt: '2000-01-01T00:00:00Z', lines: [line()] }));
  await client.query("INSERT INTO quotation (customer_id, expires_at) VALUES ('expired', statement_timestamp() - interval '1 second')");
  assert.equal((await app.searchQuotations({ customerId: 'expired' }))[0].status, 'expired');
  await app.reviseQuotation(q.quotationId, { customerId: 'c1-revised', expiresAt: '2031-01-01T00:00:00Z', lines: [line('p', 9, 50)] });
  const sourced = await app.createOrderFromQuotation(q.quotationId, { actor: actor('sales-source', 'sales') });
  assert.equal(sourced.customerId, 'c1-revised');
  assert.equal(sourced.totalAmount, '450.00');
  assert.equal(sourced.quotationId, q.quotationId);
  await assert.rejects(() => app.reviseQuotation(q.quotationId, { lines: [line()] }));
  await assert.rejects(() => app.createOrderFromQuotation(q.quotationId, { actor: actor('sales-source', 'sales') }));
  const direct = await app.createDirectOrder({ customerId: 'direct', actor: actor('sales-direct', 'sales'), lines: [line('x', 1, 5)] });
  assert.equal(direct.quotationId, null);
  await assert.rejects(() => app.createDirectOrder({ customerId: 'direct', actor: actor('sales-direct', 'sales'), lines: [] }));
  await client.end();
});

test('Stage 3 threshold, approval, separation-of-duties, and Sales confirmation conditions hold', async () => {
  const [app, client] = await freshApplication();
  const creator = actor('person-both-roles', 'sales');
  const high = await app.createDirectOrder({ customerId: 'high', actor: creator, lines: [line('p', 2, 600)] });
  assert.equal(high.createdBy, 'person-both-roles');
  await assert.rejects(() => app.confirmOrder(high.orderId, { actor: creator }));
  await assert.rejects(() => app.decideOrderApproval({ orderId: high.orderId, decision: 'approved', actor: actor('person-both-roles', 'manager') }));
  await app.decideOrderApproval({ orderId: high.orderId, decision: 'approved', actor: actor('manager-two', 'manager') });
  await app.confirmOrder(high.orderId, { actor: actor('sales-confirmer', 'sales') });
  const rejected = await app.createDirectOrder({ customerId: 'rejected', actor: actor('sales-three', 'sales'), lines: [line('p', 2, 600)] });
  await app.decideOrderApproval({ orderId: rejected.orderId, decision: 'rejected', actor: actor('manager-three', 'manager') });
  await assert.rejects(() => app.confirmOrder(rejected.orderId, { actor: actor('sales-four', 'sales') }));
  const low = await app.createDirectOrder({ customerId: 'low', actor: actor('sales-low', 'sales'), lines: [line('x', 1, 10)] });
  await app.confirmOrder(low.orderId, { actor: actor('sales-low', 'sales') });
  const columns = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'customer_order' AND column_name = 'confirmed_by'");
  assert.equal(columns.rowCount, 0);
  await client.end();
});
