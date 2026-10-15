import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from './entry.mjs';
const requester = { id: 'r', role: 'requester' };
const input = id => ({ id, item: 'Monitor', quantity: 3, requestedYen: 1, reason: 'Work' });

test('IDs retain whitespace; totals are not multiplied by quantity', () => {
  const app = createApp();
  assert.equal(app.submit(input(' '), requester, 0).id, ' ');
  assert.equal(app.detail(' ').requestedYen, 1);
});

test('missing input, unsupported role, and malformed query IDs fail without changing state', () => {
  const app = createApp();
  for (const value of [undefined, null, 1, 'text']) assert.throws(() => app.submit(value, requester, 0), Error);
  assert.throws(() => app.submit(input('x'), { id: 'r', role: 'admin' }, 0), Error);
  assert.deepEqual(app.list(), []);
  app.submit(input('x'), requester, 0);
  const before = app.list();
  for (const id of [null, undefined, {}, 1]) assert.throws(() => app.detail(id), Error);
  assert.deepEqual(app.list(), before);
});

test('previous snapshots and another application remain independent through transitions', () => {
  const first = createApp();
  const second = createApp();
  const submitted = first.submit(input('x'), requester, 100);
  second.submit(input('x'), requester, 100);
  const approved = first.approve('x', { id: 'r', role: 'approver' }, 0);
  first.purchase('x', 2, { id: 'b', role: 'buyer' }, 0);
  assert.equal(submitted.status, 'submitted');
  assert.equal(approved.status, 'approved');
  assert.equal(second.detail('x').status, 'submitted');
  assert.equal('approvedAt' in submitted, false);
});
