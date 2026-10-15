import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from './entry.mjs';

const requester = { id: 'r', role: 'requester' };
const approver = { id: 'r', role: 'approver' };
const input = (id, requestedYen = 1) => ({ id, item: 'desk', quantity: 1, requestedYen, reason: 'work' });

test('approval authority is unchanged across amounts, including the maximum total', () => {
  const app = createApp();
  for (const amount of [1, 100000, Number.MAX_SAFE_INTEGER]) {
    const id = String(amount);
    app.submit(input(id, amount), requester, Number.MAX_SAFE_INTEGER);
    assert.equal(app.approve(id, approver, 0).status, 'approved');
  }
});

test('IDs are preserved exactly and sort by UTF-16 string comparison', () => {
  const app = createApp();
  const ids = ['constructor', ' ', 'a ', 'a', '\u{10000}', '\uE000'];
  for (const id of ids) app.submit(input(id), requester, 0);
  assert.deepEqual(app.list().map(row => row.id), [' ', 'a', 'a ', 'constructor', '\u{10000}', '\uE000']);
});

test('missing inputs and unrecognized actor roles fail without altering existing records', () => {
  const app = createApp();
  app.submit(input('existing'), requester, 0);
  const before = app.list();
  for (const value of [null, undefined, {}, []]) {
    assert.throws(() => app.submit(value, requester, 0), Error);
  }
  for (const role of ['', 'admin', undefined]) {
    assert.throws(() => app.approve('existing', { id: 'a', role }, 0), Error);
  }
  assert.deepEqual(app.list(), before);
});
