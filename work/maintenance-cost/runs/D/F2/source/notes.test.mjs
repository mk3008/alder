import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from './entry.mjs';
import { createWorkflow } from './application.mjs';
import { createMemoryRepository } from './memory.mjs';
const requester = { id: 'r', role: 'requester' };
const approver = { id: 'a', role: 'approver' };
const input = { id: 'p', item: 'Desk', quantity: 1, requestedYen: 1, reason: 'work' };

test('supplied undefined note fails atomically and does not reserve ID', () => {
  const app = createApp();
  assert.throws(() => app.submit({ ...input, note: undefined }, requester, 0), Error);
  assert.deepEqual(app.list(), []);
  assert.equal(app.submit(input, requester, 0).note, '');
});

test('legacy records read with empty note and transitions retain it', () => {
  const repository = createMemoryRepository();
  const legacy = { ...input, requesterId: 'r', submittedAt: 0, status: 'submitted' };
  repository.save(legacy);
  const app = createWorkflow(repository);
  assert.deepEqual(app.detail('p'), { ...legacy, note: '' });
  assert.deepEqual(app.list(), [legacy]);
  assert.deepEqual(repository.get('p'), legacy);
  assert.equal(app.approve('p', approver, 1).note, '');
  assert.equal(app.detail('p').note, '');
  assert.equal(Object.hasOwn(app.list()[0], 'note'), false);
});

test('note is isolated in results and never appears in serialized lists', () => {
  const app = createApp();
  const submitted = app.submit({ ...input, note: ' private\n' }, requester, 0);
  submitted.note = 'changed';
  app.detail('p').note = 'changed';
  assert.equal(app.detail('p').note, ' private\n');
  assert.equal(JSON.stringify(app.list()).includes('note'), false);
  app.list()[0].note = 'injected';
  assert.equal(app.approve('p', approver, 1).note, ' private\n');
});
