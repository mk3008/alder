import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from './entry.mjs';

const requester = { id: 'r', role: 'requester' };
const senior = { id: 'r', role: 'seniorApprover' };
const approver = { id: 'a', role: 'approver' };
const buyer = { id: 'b', role: 'buyer' };
const input = (id, requestedYen, quantity = 1) => ({
  id, requestedYen, quantity, item: 'Desk', reason: 'Work', note: ' preserved ',
});

test('authority uses requested total without multiplying by quantity', () => {
  const app = createApp();
  app.submit(input('low', 99999, Number.MAX_SAFE_INTEGER), requester, 10);
  assert.equal(app.approve('low', approver, 0).approvedBy, 'a');
  app.submit(input('high', Number.MAX_SAFE_INTEGER), requester, 10);
  const approved = app.approve('high', senior, 0);
  assert.equal(approved.approvedBy, requester.id);
  assert.equal(approved.approvedAt, 0);
  assert.equal(approved.note, ' preserved ');
  const purchased = app.purchase('high', 1, buyer, 0);
  assert.equal(purchased.actualYen, 1);
  assert.equal(purchased.approvedBy, requester.id);
  approved.approvedBy = 'changed';
  assert.equal(app.detail('high').approvedBy, requester.id);
});

test('senior approval validates actor and time before mutation', () => {
  const app = createApp();
  const original = app.submit(input('high', 100000), requester, 0);
  for (const actor of [null, {}, { id: '', role: 'seniorApprover' }, { id: 1, role: 'seniorApprover' }, buyer, requester]) {
    assert.throws(() => app.approve('high', actor, 0), Error);
    assert.deepEqual(app.detail('high'), original);
  }
  for (const now of [-1, 0.1, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1, '0', null]) {
    assert.throws(() => app.approve('high', senior, now), Error);
    assert.deepEqual(app.detail('high'), original);
  }
  const approved = app.approve('high', senior, 0);
  for (const actor of [senior, approver]) {
    assert.throws(() => app.approve('high', actor, 0), Error);
    assert.deepEqual(app.detail('high'), approved);
  }
});
