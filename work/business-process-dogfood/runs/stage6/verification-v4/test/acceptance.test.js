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
  await assert.rejects(() => app.createQuotation({ customerId: 'c', expiresAt: future(), lines: [line('p', 'NaN', '1.00')] }));
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
  assert.equal(below.totalAmount, '999.99'); assert.equal(below.status, 'draft');
  await assert.rejects(() => app.confirmOrder(below.orderId, { actor: actor('manager-one', 'manager') }));
  await app.confirmOrder(below.orderId, { actor: actor('sales-below', 'sales') });
  const equal = await app.createDirectOrder({ customerId: 'equal', actor: actor('sales-equal', 'sales'), lines: [line('p', '1.00', '1000.00')] });
  assert.equal(equal.totalAmount, '1000.00'); assert.equal(equal.status, 'pending_approval');
  const above = await app.createDirectOrder({ customerId: 'above', actor: actor('sales-above', 'sales'), lines: [line('p', '1.00', '1000.01')] });
  assert.equal(above.status, 'pending_approval');
  const rounded = await app.createDirectOrder({ customerId: 'rounded', actor: actor('sales-rounded', 'sales'), lines: [line('round', '0.33', '3.03')] });
  assert.equal(rounded.totalAmount, '1.00');
  const roundAfterSum = await app.createDirectOrder({ customerId: 'round-after-sum', actor: actor('sales-round', 'sales'), lines: [line('fraction-a', '0.01', '0.50'), line('fraction-b', '0.01', '0.50')] });
  assert.equal(roundAfterSum.totalAmount, '0.01');
  await assert.rejects(() => app.createDirectOrder({ customerId: 'nan', actor: actor('sales-nan', 'sales'), lines: [line('nan', 'NaN', '1.00')] }));
  const sourcedQuote = await app.createQuotation({ customerId: 'source', expiresAt: future(), lines: [line('p', '2.00', '600.00')] });
  const sourced = await app.createOrderFromQuotation(sourcedQuote.quotationId, { actor: actor('sales-sourced', 'sales') });
  assert.equal(sourced.status, 'pending_approval'); assert.equal(sourced.createdBy, 'sales-sourced');
  const sourcedLowQuote = await app.createQuotation({ customerId: 'source-low', expiresAt: future(), lines: [line('p', '1.00', '10.00')] });
  const sourcedLow = await app.createOrderFromQuotation(sourcedLowQuote.quotationId, { actor: actor('sales-source-low', 'sales') });
  assert.equal(sourcedLow.status, 'draft');
  const duplicateLines = await app.createDirectOrder({ customerId: 'duplicates', actor: actor('sales-duplicates', 'sales'), lines: [line('same', '1.00', '1.00'), line('same', '1.00', '1.00')] });
  assert.equal(duplicateLines.lines.length, 2);
  const waiting = await app.searchOrdersAwaitingApproval({ actor: actor('manager-one', 'manager') });
  assert.deepEqual(waiting.map((o) => o.orderId), [equal.orderId, above.orderId, sourced.orderId]);
  assert.ok(waiting.every((o) => o.status === 'pending_approval'));
  await assert.rejects(() => app.confirmOrder(equal.orderId, { actor: actor('sales-equal', 'sales') }));
  await assert.rejects(() => app.decideOrderApproval({ orderId: equal.orderId, decision: 'approved', actor: actor('sales-equal', 'manager') }));
  await app.decideOrderApproval({ orderId: equal.orderId, decision: 'approved', actor: actor('manager-two', 'manager') });
  assert.ok((await app.searchOrdersAwaitingApproval({ actor: actor('manager-one', 'manager') })).every((o) => o.status === 'pending_approval'));
  const decision = await client.query('SELECT manager_id, decision FROM order_approval WHERE order_id = $1', [equal.orderId]);
  assert.deepEqual(decision.rows, [{ manager_id: 'manager-two', decision: 'approved' }]);
  await app.confirmOrder(equal.orderId, { actor: actor('sales-other', 'sales') });
  await app.decideOrderApproval({ orderId: above.orderId, decision: 'rejected', actor: actor('manager-three', 'manager') });
  await assert.rejects(() => app.confirmOrder(above.orderId, { actor: actor('sales-other', 'sales') }));
  const large = await app.createDirectOrder({ customerId: 'large', actor: actor('sales-large', 'sales'), lines: [line('a', '1.00', '999999999999.99'), line('b', '1.00', '999999999999.99')] });
  assert.equal(large.totalAmount, '1999999999999.98'); assert.equal(large.status, 'pending_approval');
  await client.end();
});

test('Stage 4 effective approved-Order revision invalidates approval and re-evaluates threshold', async () => {
  const [app, client] = await freshApplication();
  const creator = actor('sales-revise', 'sales');
  const high = await app.createDirectOrder({ customerId: 'r1', actor: creator, lines: [line('p', '2.00', '600.00')] });
  await app.decideOrderApproval({ orderId: high.orderId, decision: 'approved', actor: actor('manager-one', 'manager') });
  const revisedHigh = await app.reviseOrder(high.orderId, { actor: creator, lines: [line('p', '3.00', '600.00')] });
  assert.equal(revisedHigh.status, 'pending_approval'); assert.equal(revisedHigh.totalAmount, '1800.00');
  await assert.rejects(() => app.confirmOrder(high.orderId, { actor: creator }));
  assert.equal((await client.query('SELECT 1 FROM order_approval WHERE order_id = $1', [high.orderId])).rowCount, 0);
  await app.decideOrderApproval({ orderId: high.orderId, decision: 'approved', actor: actor('manager-two', 'manager') });
  await app.confirmOrder(high.orderId, { actor: creator });
  const low = await app.createDirectOrder({ customerId: 'r2', actor: creator, lines: [line('a', '2.00', '600.00')] });
  await app.decideOrderApproval({ orderId: low.orderId, decision: 'approved', actor: actor('manager-three', 'manager') });
  const revisedLow = await app.reviseOrder(low.orderId, { actor: creator, lines: [line('a', '1.00', '999.99')] });
  assert.equal(revisedLow.status, 'draft'); await app.confirmOrder(low.orderId, { actor: creator });
  const equal = await app.createDirectOrder({ customerId: 'r3', actor: creator, lines: [line('a', '2.00', '600.00')] });
  await app.decideOrderApproval({ orderId: equal.orderId, decision: 'approved', actor: actor('manager-four', 'manager') });
  assert.equal((await app.reviseOrder(equal.orderId, { actor: creator, lines: [line('b', '1.00', '1000.00')] })).status, 'pending_approval');
  const sameTotal = await app.createDirectOrder({ customerId: 'r4', actor: creator, lines: [line('a', '2.00', '600.00')] });
  await app.decideOrderApproval({ orderId: sameTotal.orderId, decision: 'approved', actor: actor('manager-five', 'manager') });
  const sameTotalRevised = await app.reviseOrder(sameTotal.orderId, { actor: creator, lines: [line('b', '1.00', '1200.00')] });
  assert.equal(sameTotalRevised.totalAmount, '1200.00'); assert.equal(sameTotalRevised.status, 'pending_approval');
  assert.equal((await client.query('SELECT 1 FROM order_approval WHERE order_id = $1', [sameTotal.orderId])).rowCount, 0);
  const source = await app.createQuotation({ customerId: 'source-unchanged', expiresAt: future(), lines: [line('source-product', '2.00', '600.00')] });
  const sourced = await app.createOrderFromQuotation(source.quotationId, { actor: actor('sales-source-4', 'sales') });
  await app.decideOrderApproval({ orderId: sourced.orderId, decision: 'approved', actor: actor('manager-six', 'manager') });
  const beforeSource = await app.searchQuotations({ quotationId: source.quotationId });
  await app.reviseOrder(sourced.orderId, { actor: actor('sales-source-4', 'sales'), lines: [line('order-only', '1.00', '1200.00')] });
  assert.deepEqual(await app.searchQuotations({ quotationId: source.quotationId }), beforeSource);
  await assert.rejects(() => app.reviseOrder(high.orderId, { actor: creator, lines: [line('p', '1.00', '1.00')] }));
  await client.end();
});

test('Stage 5 confirmation creates one requested reservation and trusted results retain commercial confirmation', async () => {
  const [app, client] = await freshApplication();
  const sales = actor('sales-stage5', 'sales');
  const low = await app.createDirectOrder({ customerId: 'low-reserve', actor: sales, lines: [line('p', '1.00', '10.00')] });
  await app.confirmOrder(low.orderId, { actor: sales });
  let reservation = await client.query('SELECT status FROM inventory_reservation WHERE order_id = $1', [low.orderId]);
  assert.deepEqual(reservation.rows, [{ status: 'requested' }]);
  await assert.rejects(() => app.recordReservationResult({ orderId: low.orderId, status: 'reserved', actor: sales }));
  await app.recordReservationResult({ orderId: low.orderId, status: 'reserved', actor: actor('inventory-boundary', 'inventory') });
  assert.equal((await app.getOrder(low.orderId)).status, 'confirmed');
  assert.deepEqual((await client.query('SELECT status FROM inventory_reservation WHERE order_id = $1', [low.orderId])).rows, [{ status: 'reserved' }]);
  await assert.rejects(() => app.recordReservationResult({ orderId: low.orderId, status: 'failed', actor: actor('inventory-boundary', 'inventory') }));
  const high = await app.createDirectOrder({ customerId: 'high-reserve', actor: sales, lines: [line('p', '2.00', '600.00')] });
  await app.decideOrderApproval({ orderId: high.orderId, decision: 'approved', actor: actor('manager-stage5', 'manager') });
  await app.confirmOrder(high.orderId, { actor: sales });
  await app.recordReservationResult({ orderId: high.orderId, status: 'failed', actor: actor('inventory-boundary', 'inventory') });
  assert.equal((await app.getOrder(high.orderId)).status, 'confirmed');
  assert.deepEqual((await client.query('SELECT status FROM inventory_reservation WHERE order_id = $1', [high.orderId])).rows, [{ status: 'failed' }]);
  await client.end();
});

class InventoryAuthorityFake {
  constructor() { this.held = new Set(); }
  reservationSucceeded(orderId) { this.held.add(orderId); }
  releaseSucceeded(orderId) { this.held.delete(orderId); }
  holds(orderId) { return this.held.has(orderId); }
}

test('Stage 6 cancellation retains cleanup obligation and converges with independent inventory authority', async () => {
  const [app, client] = await freshApplication();
  const sales = actor('sales-cancel', 'sales'); const inventory = actor('inventory-boundary', 'inventory');
  const fake = new InventoryAuthorityFake();
  const authority = await app.createDirectOrder({ customerId: 'authority', actor: sales, lines: [line('p', '1', '10')] });
  await app.confirmOrder(authority.orderId, { actor: sales });
  await assert.rejects(() => app.cancelOrder(authority.orderId, { actor: actor('manager-cancel', 'manager') }));
  assert.equal((await app.getOrder(authority.orderId)).status, 'confirmed');
  const draft = await app.createDirectOrder({ customerId: 'draft', actor: sales, lines: [line('p', '1', '10')] });
  await assert.rejects(() => app.cancelOrder(draft.orderId, { actor: sales }));
  assert.equal((await app.getOrder(draft.orderId)).status, 'draft');
  const failed = await app.createDirectOrder({ customerId: 'failed', actor: sales, lines: [line('p', '1', '10')] });
  await app.confirmOrder(failed.orderId, { actor: sales });
  await app.recordReservationResult({ orderId: failed.orderId, status: 'failed', actor: inventory });
  await app.cancelOrder(failed.orderId, { actor: sales });
  assert.equal((await app.getOrder(failed.orderId)).status, 'cancelled');
  assert.deepEqual((await client.query('SELECT status FROM inventory_reservation WHERE order_id=$1', [failed.orderId])).rows, [{ status: 'failed' }]); assert.equal(fake.holds(failed.orderId), false);
  const reserved = await app.createDirectOrder({ customerId: 'reserved', actor: sales, lines: [line('p', '1', '10')] });
  await app.confirmOrder(reserved.orderId, { actor: sales }); fake.reservationSucceeded(reserved.orderId);
  await app.recordReservationResult({ orderId: reserved.orderId, status: 'reserved', actor: inventory });
  await app.cancelOrder(reserved.orderId, { actor: sales });
  assert.deepEqual((await client.query('SELECT status FROM inventory_reservation WHERE order_id=$1', [reserved.orderId])).rows, [{ status: 'release_requested' }]); assert.equal(fake.holds(reserved.orderId), true);
  await assert.rejects(() => app.recordReleaseCompletion({ orderId: reserved.orderId, actor: sales }));
  assert.deepEqual((await client.query('SELECT status FROM inventory_reservation WHERE order_id=$1', [reserved.orderId])).rows, [{ status: 'release_requested' }]);
  fake.releaseSucceeded(reserved.orderId); await app.recordReleaseCompletion({ orderId: reserved.orderId, actor: inventory });
  assert.equal((await app.getOrder(reserved.orderId)).status, 'cancelled'); assert.equal(fake.holds(reserved.orderId), false);
  const late = await app.createDirectOrder({ customerId: 'late', actor: sales, lines: [line('p', '1', '10')] });
  await app.confirmOrder(late.orderId, { actor: sales }); await app.cancelOrder(late.orderId, { actor: sales });
  fake.reservationSucceeded(late.orderId); await app.recordReservationResult({ orderId: late.orderId, status: 'reserved', actor: inventory });
  assert.equal((await app.getOrder(late.orderId)).status, 'cancelled');
  assert.deepEqual((await client.query('SELECT status FROM inventory_reservation WHERE order_id=$1', [late.orderId])).rows, [{ status: 'release_requested' }]);
  fake.releaseSucceeded(late.orderId); await app.recordReleaseCompletion({ orderId: late.orderId, actor: inventory });
  assert.equal((await app.getOrder(late.orderId)).status, 'cancelled');
  assert.deepEqual((await client.query('SELECT status FROM inventory_reservation WHERE order_id=$1', [late.orderId])).rows, [{ status: 'released' }]); assert.equal(fake.holds(late.orderId), false);
  const lateFailed = await app.createDirectOrder({ customerId: 'late-failed', actor: sales, lines: [line('p', '1', '10')] });
  await app.confirmOrder(lateFailed.orderId, { actor: sales }); await app.cancelOrder(lateFailed.orderId, { actor: sales });
  assert.equal((await app.getOrder(lateFailed.orderId)).status, 'cancelled');
  await app.recordReservationResult({ orderId: lateFailed.orderId, status: 'failed', actor: inventory });
  assert.deepEqual((await client.query('SELECT status FROM inventory_reservation WHERE order_id=$1', [lateFailed.orderId])).rows, [{ status: 'failed' }]); assert.equal(fake.holds(lateFailed.orderId), false);
  const shipped = await app.createDirectOrder({ customerId: 'shipped', actor: sales, lines: [line('p', '1', '10')] });
  await app.confirmOrder(shipped.orderId, { actor: sales });
  await client.query('UPDATE customer_order SET shipment_at = statement_timestamp() WHERE order_id = $1', [shipped.orderId]);
  await assert.rejects(() => app.cancelOrder(shipped.orderId, { actor: sales }));
  assert.equal((await app.getOrder(shipped.orderId)).status, 'confirmed');
  await client.end();
});
