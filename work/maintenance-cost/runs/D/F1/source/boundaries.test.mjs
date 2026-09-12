import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from './entry.mjs';
const actor = { id: ' ', role: 'requester' };
const input = { id: ' ', item: '\t desk\n', quantity: 1, requestedYen: 1, reason: '\n work\t' };

test('IDs are literal nonempty strings and extra input fields are excluded', () => {
  const app = createApp();
  const row = app.submit({ ...input, actualYen: 999, status: 'purchased', nested: {} }, actor, 0);
  assert.equal(row.id, ' ');
  assert.equal(row.requesterId, ' ');
  assert.equal(row.item, 'desk');
  assert.equal(row.reason, 'work');
  assert.equal(row.status, 'submitted');
  assert.equal('actualYen' in row, false);
  assert.equal('nested' in row, false);
});

test('malformed input and unknown roles do not reserve IDs', () => {
  const app = createApp();
  for (const value of [null, undefined, {}, 3, 'x']) {
    assert.throws(() => app.submit(value, actor, 0), Error);
    assert.deepEqual(app.list(), []);
  }
  assert.throws(() => app.submit(input, { id: 'r', role: 'admin' }, 0), Error);
  assert.equal(app.submit(input, actor, 0).status, 'submitted');
});

test('failed duplicate and unknown commands preserve every existing record', () => {
  const app = createApp();
  app.submit(input, actor, 0);
  const before = app.list();
  assert.throws(() => app.submit({ ...input, item: 'replacement' }, actor, 0));
  assert.throws(() => app.approve(undefined, { id: 'a', role: 'approver' }, 0));
  assert.deepEqual(app.list(), before);
  app.approve(' ', { id: 'a', role: 'approver' }, 100);
  assert.equal(app.purchase(' ', 2, { id: 'b', role: 'buyer' }, 0).purchasedAt, 0);
});
