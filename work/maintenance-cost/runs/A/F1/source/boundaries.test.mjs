import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from './entry.mjs';

const actor = role => ({ id: ' ', role });
const input = id => ({ id, item: '\t Desk\n', reason: '\n Work\t', quantity: 1, requestedYen: 1 });

test('IDs retain whitespace and use UTF-16 string ordering', () => {
  const app = createApp();
  const ids = [' ', 'x ', 'x', '\u{10000}', '\uE000'];
  for (const id of ids) app.submit(input(id), actor('requester'), 0);
  assert.deepEqual(app.list().map(row => row.id), [' ', 'x', 'x ', '\u{10000}', '\uE000']);
  assert.equal(app.detail(' ').requesterId, ' ');
  assert.equal(app.detail(' ').item, 'Desk');
});

test('malformed input and unknown roles fail atomically', () => {
  const app = createApp();
  for (const invalid of [undefined, null, 1, 'text']) {
    assert.throws(() => app.submit(invalid, actor('requester'), 0), Error);
    assert.deepEqual(app.list(), []);
  }
  for (const role of [undefined, 'admin', 'Requester']) {
    assert.throws(() => app.submit(input('x'), actor(role), 0), Error);
    assert.deepEqual(app.list(), []);
  }
});

test('valid decreasing timestamps apply to rejection and purchase as well', () => {
  const app = createApp();
  app.submit(input('reject'), actor('requester'), Number.MAX_SAFE_INTEGER);
  assert.equal(app.reject('reject', ' no ', actor('approver'), 0).rejectedAt, 0);
  app.submit(input('buy'), actor('requester'), Number.MAX_SAFE_INTEGER);
  app.approve('buy', actor('approver'), 2);
  assert.equal(app.purchase('buy', 1, actor('buyer'), 0).purchasedAt, 0);
});
