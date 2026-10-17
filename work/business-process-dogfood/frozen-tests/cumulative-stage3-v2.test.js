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
const future = () => new Date(Date.now() + 86_400_000).toISOString();
const actor = (id, role) => ({ id, role });
const line = (productId, quantity, unitPrice) => ({ productId, quantity, unitPrice });

async function freshApplication() {
  const client = new Client({ connectionString });
  await client.connect();
  await client.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
  await client.query(await readFile(resolve(root, 'docs/business-process-dogfood/ddl.sql'), 'utf8'));
  return [createApplication({ connectionString }), client];
}

test('Stage 1 quotation conditions: validation, lines, expiry, readability, and deterministic search', async () => {
  const [app, client] = await freshApplication();
  const q1 = await app.createQuotation({ customerId: 'c1', expiresAt: future(), lines: [line('same', 1, 1), line('same', 2, 2)] });
  const q2 = await app.createQuotation({ customerId: 'c1', expiresAt: future(), lines: [line('other', 1, 1)] });
  assert.deepEqual((await app.searchQuotations({ customerId: 'c1' })).map((q) => q.quotationId), [q1.quotationId, q2.quotationId]);
  assert.deepEqual((await app.searchQuotations({ productId: 'same' })).map((q) => q.quotationId), [q1.quotationId]);
  await assert.rejects(() => app.createQuotation({ customerId: ' ', expiresAt: future(), lines: [line('p', 1, 1)] }));
  await assert.rejects(() => app.createQuotation({ customerId: 'c', expiresAt: future(), lines: [line(' ', 1, 1)] }));
  await assert.rejects(() => app.createQuotation({ customerId: 'c', expiresAt: future(), lines: [] }));
  await assert.rejects(() => app.createQuotation({ customerId: 'c', expiresAt: future(), lines: [line('p', Number.NaN, 1)] }));
  await assert.rejects(() => app.createQuotation({ customerId: 'c', expiresAt: new Date(Date.now() - 1_000).toISOString(), lines: [line('p', 1, 1)] }));
  await client.query("INSERT INTO quotation (customer_id, expires_at) VALUES ('expired', statement_timestamp() - interval '1 second')");
  assert.equal((await app.searchQuotations({ customerId: 'expired' }))[0].status, 'expired');
  await client.end();
});

test('Stage 2 conditions: coherent eligible revision, complete snapshot, association, and conversion immutability', async () => {
  const [app, client] = await freshApplication();
  const q = await app.createQuotation({ customerId: 'before', expiresAt: future(), lines: [line('old', 1, 1)] });
  const revisedExpiry = new Date(Date.now() + 172_800_000).toISOString();
  await app.reviseQuotation(q.quotationId, { customerId: 'after', expiresAt: revisedExpiry, lines: [line('new', 3, 12.34), line('new2', 2, 0.01)] });
  const order = await app.createOrderFromQuotation(q.quotationId, { actor: actor('sales-source', 'sales') });
  assert.equal(order.customerId, 'after'); assert.equal(order.quotationId, q.quotationId); assert.equal(order.createdBy, 'sales-source');
  assert.equal(order.totalAmount, '37.04');
  assert.deepEqual(order.lines.map(({ productId, quantity, unitPrice }) => ({ productId, quantity, unitPrice })), [{ productId: 'new', quantity: '3.00', unitPrice: '12.34' }, { productId: 'new2', quantity: '2.00', unitPrice: '0.01' }]);
  assert.equal((await app.searchQuotations({ quotationId: q.quotationId }))[0].status, 'ordered');
  await assert.rejects(() => app.reviseQuotation(q.quotationId, { lines: [line('x', 1, 1)] }));
  await assert.rejects(() => app.createOrderFromQuotation(q.quotationId, { actor: actor('sales-source', 'sales') }));
  const expired = await app.createQuotation({ customerId: 'exp', expiresAt: future(), lines: [line('p', 1, 1)] });
  await client.query("UPDATE quotation SET expires_at = statement_timestamp() - interval '1 second' WHERE quotation_id = $1", [expired.quotationId]);
  await assert.rejects(() => app.reviseQuotation(expired.quotationId, { lines: [line('p', 1, 1)] }));
  await assert.rejects(() => app.createOrderFromQuotation(expired.quotationId, { actor: actor('sales-exp', 'sales') }));
  await assert.rejects(() => app.createDirectOrder({ customerId: 'direct', actor: actor('sales-direct', 'sales'), lines: [] }));
  await client.end();
});

test('Stage 3 approval lifecycle, exact totals, and amended large total representation', async () => {
  const [app, client] = await freshApplication();
  const below = await app.createDirectOrder({ customerId: 'below', actor: actor('sales-below', 'sales'), lines: [line('p', '1.00', '999.99')] });
  assert.equal(below.totalAmount, '999.99'); assert.equal(below.status, 'draft'); await app.confirmOrder(below.orderId, { actor: actor('sales-below', 'sales') });
  const equal = await app.createDirectOrder({ customerId: 'equal', actor: actor('sales-equal', 'sales'), lines: [line('p', '1.00', '1000.00')] });
  assert.equal(equal.totalAmount, '1000.00'); assert.equal(equal.status, 'pending_approval');
  const above = await app.createDirectOrder({ customerId: 'above', actor: actor('sales-above', 'sales'), lines: [line('p', '1.00', '1000.01')] });
  assert.equal(above.status, 'pending_approval');
  const rounded = await app.createDirectOrder({ customerId: 'rounded', actor: actor('sales-rounded', 'sales'), lines: [line('round', '0.33', '3.03')] });
  assert.equal(rounded.totalAmount, '1.00');
  const sourcedQuote = await app.createQuotation({ customerId: 'source', expiresAt: future(), lines: [line('p', '2.00', '600.00')] });
  const sourced = await app.createOrderFromQuotation(sourcedQuote.quotationId, { actor: actor('sales-sourced', 'sales') });
  assert.equal(sourced.status, 'pending_approval'); assert.equal(sourced.createdBy, 'sales-sourced');
  const waiting = await app.searchOrdersAwaitingApproval({ actor: actor('manager-one', 'manager') });
  assert.deepEqual(waiting.map((o) => o.orderId), [equal.orderId, above.orderId, sourced.orderId]);
  await assert.rejects(() => app.confirmOrder(equal.orderId, { actor: actor('sales-equal', 'sales') }));
  await assert.rejects(() => app.decideOrderApproval({ orderId: equal.orderId, decision: 'approved', actor: actor('sales-equal', 'manager') }));
  await app.decideOrderApproval({ orderId: equal.orderId, decision: 'approved', actor: actor('manager-two', 'manager') });
  await app.confirmOrder(equal.orderId, { actor: actor('sales-other', 'sales') });
  await app.decideOrderApproval({ orderId: above.orderId, decision: 'rejected', actor: actor('manager-three', 'manager') });
  await assert.rejects(() => app.confirmOrder(above.orderId, { actor: actor('sales-other', 'sales') }));
  const large = await app.createDirectOrder({ customerId: 'large', actor: actor('sales-large', 'sales'), lines: [line('a', '1.00', '999999999999.99'), line('b', '1.00', '999999999999.99')] });
  assert.equal(large.totalAmount, '1999999999999.98'); assert.equal(large.status, 'pending_approval');
  await client.end();
});
