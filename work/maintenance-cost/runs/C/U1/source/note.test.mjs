import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from './entry.mjs';
import { detail } from './slices/detail.mjs';
import { list } from './slices/list.mjs';
import { approve } from './slices/approve.mjs';
import { reject } from './slices/reject.mjs';
import { purchase } from './slices/purchase.mjs';
const requester = { id: 'r', role: 'requester' };
const approver = { id: 'a', role: 'approver' };
const buyer = { id: 'b', role: 'buyer' };
const input = id => ({ id, item: 'Desk', quantity: 1, requestedYen: 10, reason: 'Work' });

test('supplied non-string notes are rejected atomically, including undefined', () => {
  const app = createApp();
  const initial = app.submit({ ...input('existing'), note: 'private' }, requester, 0);
  for (const note of [undefined, {}, [], new String('text'), 0n, Symbol('note')]) {
    assert.throws(() => app.submit({ ...input('new'), note }, requester, 0), Error);
    assert.deepEqual(app.list().map(row => app.detail(row.id)), [initial]);
  }
});

test('note snapshots and list omission hold after every event', () => {
  const app = createApp();
  const note = ' \n' + '😀'.repeat(139);
  const source = { ...input('p'), note };
  const submitted = app.submit(source, requester, 0);
  source.note = 'changed';
  submitted.note = 'changed';
  assert.equal(app.detail('p').note, note);
  for (const result of [app.approve('p', approver, 1), app.purchase('p', 1, buyer, 2)]) {
    assert.equal(result.note, note);
    result.note = 'changed';
    assert.equal(app.detail('p').note, note);
    const rows = app.list();
    assert.equal('note' in rows[0], false);
    rows[0].note = 'injected';
    assert.equal(app.detail('p').note, note);
  }
  app.submit({ ...input('r'), note }, requester, 0);
  assert.equal(app.reject('r', 'no', approver, 0).note, note);
  assert.ok(app.list().every(row => !('note' in row)));
});

test('legacy records normalize on read and transition without mutating queries', () => {
  const legacy = { ...input('old'), requesterId: 'r', submittedAt: 0, status: 'submitted' };
  const records = new Map([['old', legacy]]);
  assert.deepEqual(detail(records, 'old'), { ...legacy, note: '' });
  assert.equal('note' in legacy, false);
  assert.deepEqual(list(records), [legacy]);
  assert.equal(approve(records, 'old', approver, 0).note, '');
  assert.equal(purchase(records, 'old', 1, buyer, 0).note, '');
  records.set('old', legacy);
  assert.equal(reject(records, 'old', 'no', approver, 0).note, '');
});
