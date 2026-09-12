import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from './entry.mjs';
import { createWorkflow } from './application.mjs';
import { createMemoryRepository } from './memory.mjs';
const requester = { id: 'r', role: 'requester' };
const senior = { id: 'r', role: 'seniorApprover' };
const buyer = { id: 'b', role: 'buyer' };
const input = { id: 'p', item: 'Desk', quantity: 2, requestedYen: 100000, reason: 'work', note: 'private' };

test('senior approval validates actor and time, permits self-approval, and uses total', () => {
  const app = createApp();
  const before = app.submit(input, requester, 10);
  for (const [actor, time] of [[null, 1], [{ id: '', role: 'seniorApprover' }, 1], [senior, -1], [senior, 0.5]]) {
    assert.throws(() => app.approve('p', actor, time), Error);
    assert.deepEqual(app.detail('p'), before);
  }
  const approved = app.approve('p', senior, 0);
  assert.equal(approved.approvedBy, requester.id);
  assert.equal(approved.approvedAt, 0);
  assert.equal(approved.note, 'private');
  assert.equal(app.purchase('p', 200000, buyer, 0).actualYen, 200000);
});

test('pre-rule high-value approvals and purchases are retained without reauthorization', () => {
  const repository = createMemoryRepository();
  const oldApproved = { ...input, requesterId: 'r', submittedAt: 0, status: 'approved', approvedAt: 1, approvedBy: 'ordinary-old-approver' };
  const oldPurchased = { ...oldApproved, id: 'bought', status: 'purchased', actualYen: 150000, purchasedAt: 2, purchasedBy: 'historical-buyer' };
  repository.save(oldApproved);
  repository.save(oldPurchased);
  const app = createWorkflow(repository);
  assert.deepEqual(app.detail('p'), oldApproved);
  assert.deepEqual(app.detail('bought'), oldPurchased);
  const result = app.purchase('p', 120000, buyer, 3);
  assert.equal(result.approvedBy, oldApproved.approvedBy);
  assert.equal(result.approvedAt, oldApproved.approvedAt);
  assert.deepEqual(app.detail('bought'), oldPurchased);
  assert.throws(() => app.approve('bought', senior, 4), Error);
  assert.deepEqual(app.detail('bought'), oldPurchased);
});
