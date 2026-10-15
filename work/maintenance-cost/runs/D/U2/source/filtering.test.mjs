import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from './entry.mjs';
const requester = { id: 'r', role: 'requester' };

test('filter validation applies to empty stores and supplied undefined', () => {
  const app = createApp();
  for (const itemContains of [undefined, {}, /desk/, Symbol('desk')]) {
    assert.throws(() => app.list({ itemContains }), Error);
    assert.deepEqual(app.list(), []);
  }
  assert.deepEqual(app.list(undefined), []);
});

test('literal substring filtering preserves whitespace and result isolation', () => {
  const app = createApp();
  for (const [id, item] of [['z', 'Blue  Desk'], ['A', 'Blue Desk'], ['a', 'Desk [x]']]) {
    app.submit({ id, item, quantity: 1, requestedYen: 1, reason: 'work', note: 'private' }, requester, 0);
  }
  assert.deepEqual(app.list({ itemContains: '  ' }).map(row => row.id), ['z']);
  assert.deepEqual(app.list({ itemContains: '[x]' }).map(row => row.id), ['a']);
  assert.deepEqual(app.list({ itemContains: 'desk' }), []);
  const results = app.list({ itemContains: 'Desk' });
  assert.deepEqual(results.map(row => row.id), ['A', 'a', 'z']);
  assert.ok(results.every(row => !Object.hasOwn(row, 'note')));
  results[0].item = 'changed';
  results.length = 0;
  assert.equal(app.detail('A').item, 'Blue Desk');
  assert.equal(app.detail('A').note, 'private');
});
