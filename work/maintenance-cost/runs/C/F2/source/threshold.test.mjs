import test from 'node:test';
import assert from 'node:assert/strict';
import { approve } from './slices/approve.mjs';
import { purchase } from './slices/purchase.mjs';
import { detail } from './slices/detail.mjs';
const approver = { id: 'a', role: 'approver' };
const senior = { id: 's', role: 'seniorApprover' };
const buyer = { id: 'b', role: 'buyer' };
const pending = (id, amount) => ({ id, requestedYen: amount, quantity: 2, item: 'Desk', reason: 'Work', note: 'private', requesterId: 'r', submittedAt: 0, status: 'submitted' });

test('pre-change pending requests use current exclusive roles at every boundary', () => {
  const records = new Map([49999, 50000, 99999, 100000].map(amount => [String(amount), pending(String(amount), amount)]));
  for (const amount of [49999, 50000, 99999, 100000]) {
    const id = String(amount);
    const before = [...records.values()].map(row => ({ ...row }));
    const allowed = amount >= 50000 ? senior : approver;
    const denied = amount >= 50000 ? approver : senior;
    assert.throws(() => approve(records, id, denied, 10), Error);
    assert.deepEqual([...records.values()], before);
    assert.deepEqual(approve(records, id, allowed, 11), { ...pending(id, amount), status: 'approved', approvedAt: 11, approvedBy: allowed.id });
  }
});

test('approvals in the changed band retain historical authority and remain purchasable', () => {
  for (const amount of [50000, 99999]) {
    const old = { ...pending('old', amount), status: 'approved', approvedAt: 1, approvedBy: 'ordinary-under-100000-rule' };
    const bought = { ...old, id: 'bought', status: 'purchased', purchasedAt: 2, purchasedBy: 'b', actualYen: amount + 1 };
    const records = new Map([['old', old], ['bought', bought], ['pending', pending('pending', amount)]]);
    approve(records, 'pending', senior, 3);
    assert.deepEqual(detail(records, 'old'), old);
    assert.deepEqual(detail(records, 'bought'), bought);
    for (const actor of [approver, senior]) assert.throws(() => approve(records, 'old', actor, 4), Error);
    assert.deepEqual(detail(records, 'old'), old);
    assert.deepEqual(purchase(records, 'old', amount + 2, buyer, 4), { ...old, status: 'purchased', purchasedAt: 4, purchasedBy: 'b', actualYen: amount + 2 });
    assert.deepEqual(detail(records, 'bought'), bought);
  }
});
