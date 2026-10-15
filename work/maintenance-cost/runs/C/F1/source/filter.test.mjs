import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from './entry.mjs';
const requester = { id: 'r', role: 'requester' };
const submit = (app, id, item) => app.submit({ id, item, quantity: 1, requestedYen: 10, reason: 'Work', note: 'private' }, requester, 0);

test('invalid supplied filters reject even without records', () => {
  const app = createApp();
  for (const itemContains of [undefined, {}, Symbol('x'), 1n, new String('Desk')]) {
    assert.throws(() => app.list({ itemContains }), Error);
    assert.deepEqual(app.list(), []);
  }
  assert.deepEqual(app.list(undefined), []);
});

test('matching is literal, preserves spaces, and uses normalized stored item', () => {
  const app = createApp();
  submit(app, 'z', '  Desk [Blue]  ');
  submit(app, 'A', 'Desk [Blue] Plus');
  submit(app, 'a', 'DeskXBlue');
  assert.deepEqual(app.list({ itemContains: '[Blue]' }).map(row => row.id), ['A', 'z']);
  assert.deepEqual(app.list({ itemContains: 'Desk ' }).map(row => row.id), ['A', 'z']);
  assert.deepEqual(app.list({ itemContains: '  Desk' }), []);
  assert.deepEqual(app.list({ itemContains: 'desk' }), []);
});

test('filtered rows preserve event fields and cannot change stored data', () => {
  const app = createApp();
  submit(app, 'p', 'Desk');
  app.approve('p', { id: 'a', role: 'approver' }, 1);
  const purchased = app.purchase('p', 20, { id: 'b', role: 'buyer' }, 2);
  const { note, ...expected } = purchased;
  const filter = Object.freeze({ itemContains: 'esk' });
  const rows = app.list(filter);
  assert.deepEqual(rows, [expected]);
  rows[0].actualYen = 999;
  rows[0].note = 'injected';
  rows.length = 0;
  assert.deepEqual(app.detail('p'), purchased);
  assert.deepEqual(app.list(filter), [expected]);
});
