import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from './entry.mjs';

const actor = role => ({ id: role, role });
const input = (id, note) => ({ id, item: 'Desk', quantity: 1, requestedYen: 1, reason: 'Work', note });

test('supplied undefined and nonprimitive strings reject without reserving IDs', () => {
  const app = createApp();
  app.submit(input('existing', 'keep'), actor('requester'), 0);
  const before = app.detail('existing');
  for (const note of [undefined, new String('text'), [], {}, Symbol('note')]) {
    assert.throws(() => app.submit(input('new', note), actor('requester'), 0), Error);
    assert.deepEqual(app.detail('existing'), before);
    assert.deepEqual(app.list().map(row => row.id), ['existing']);
  }
  assert.equal(app.submit(input('new', 'valid'), actor('requester'), 0).note, 'valid');
});

test('note copies and list omission hold in every state', () => {
  const app = createApp();
  const note = '\t\n' + '😀'.repeat(139);
  const request = input('buy', note);
  app.submit(request, actor('requester'), 0).note = 'changed';
  request.note = 'changed';
  const check = id => {
    assert.equal(app.detail(id).note, note);
    app.detail(id).note = 'changed';
    const rows = app.list();
    for (const row of rows) {
      assert.equal('note' in row, false);
      const { note: omitted, ...expected } = app.detail(row.id);
      assert.deepEqual(row, expected);
      row.note = 'injected';
    }
    assert.equal(app.detail(id).note, note);
  };
  check('buy');
  app.approve('buy', actor('approver'), 0).note = 'changed';
  check('buy');
  app.purchase('buy', 1, actor('buyer'), 0).note = 'changed';
  check('buy');
  app.submit(input('reject', note), actor('requester'), 0);
  app.reject('reject', 'no', actor('approver'), 0).note = 'changed';
  check('reject');
});
