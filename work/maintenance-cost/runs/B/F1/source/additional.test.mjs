import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from './entry.mjs';

const requester = { id: 'r', role: 'requester' };
const approver = { id: 'r', role: 'approver' };
const input = (id, requestedYen = 1) => ({ id, item: 'desk', quantity: 1, requestedYen, reason: 'work' });

test('approval authority uses the total, including maximum quantity and total', () => {
  const app = createApp();
  for (const [amount, role, deniedRole] of [
    [1, 'approver', 'seniorApprover'],
    [99999, 'approver', 'seniorApprover'],
    [100000, 'seniorApprover', 'approver'],
    [Number.MAX_SAFE_INTEGER, 'seniorApprover', 'approver'],
  ]) {
    const id = String(amount);
    const initial = app.submit({ ...input(id, amount), quantity: Number.MAX_SAFE_INTEGER }, requester, Number.MAX_SAFE_INTEGER);
    assert.throws(() => app.approve(id, { id: 'denied', role: deniedRole }, 0), Error);
    assert.deepEqual(app.detail(id), initial);
    const approved = app.approve(id, { id: requester.id, role }, 0);
    assert.deepEqual(approved, { ...initial, status: 'approved', approvedAt: 0, approvedBy: requester.id });
  }
});

test('senior approval validates actor and timestamp before writing and preserves its event', () => {
  const app = createApp();
  const initial = app.submit({ ...input('p', 100000), note: 'private' }, requester, 10);
  const senior = { id: 'senior', role: 'seniorApprover' };
  for (const actor of [{ ...senior, id: '' }, { ...senior, id: 1 }]) {
    assert.throws(() => app.approve('p', actor, 0), Error);
    assert.deepEqual(app.detail('p'), initial);
  }
  for (const now of [-1, 0.5, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => app.approve('p', senior, now), Error);
    assert.deepEqual(app.detail('p'), initial);
  }
  const approved = app.approve('p', senior, 0);
  senior.id = 'changed';
  assert.deepEqual(app.detail('p'), approved);
  const purchased = app.purchase('p', 1, { id: 'buyer', role: 'buyer' }, 0);
  assert.deepEqual(purchased, { ...approved, status: 'purchased', purchasedAt: 0, purchasedBy: 'buyer', actualYen: 1 });
  assert.throws(() => app.approve('p', senior, 0), Error);
  assert.deepEqual(app.detail('p'), purchased);
  assert.ok(!Object.hasOwn(app.list({ itemContains: 'desk' })[0], 'note'));
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

test('note validation is atomic and counts mixed UTF-16 code units', () => {
  const app = createApp();
  const note = '😀'.repeat(139) + ' x';
  app.submit({ ...input('kept'), note }, requester, 0);
  const before = app.detail('kept');
  for (const invalid of [undefined, {}, [], new String('text'), note + 'x']) {
    assert.throws(() => app.submit({ ...input('retry'), note: invalid }, requester, 0), Error);
    assert.deepEqual(app.detail('kept'), before);
    assert.throws(() => app.detail('retry'), Error);
  }
  assert.equal(app.submit({ ...input('retry'), note: '' }, requester, 0).note, '');
});

test('note copies and list omission survive every event', () => {
  const app = createApp();
  const request = { ...input('p'), note: ' \nprivate\t ' };
  const note = request.note;
  const submitted = app.submit(request, requester, 0);
  request.note = 'changed';
  submitted.note = 'changed';
  app.detail('p').note = 'changed';
  function verify() {
    const detail = app.detail('p');
    assert.equal(detail.note, note);
    const { note: omitted, ...expected } = detail;
    assert.deepEqual(app.list(), [expected]);
    app.list()[0].note = 'injected';
    assert.equal(app.detail('p').note, note);
  }
  verify();
  app.approve('p', approver, 0).note = 'changed';
  verify();
  app.purchase('p', 2, { id: 'b', role: 'buyer' }, 0).note = 'changed';
  verify();
  app.submit({ ...input('r'), note }, requester, 0);
  app.reject('r', 'no', approver, 0).note = 'changed';
  assert.equal(app.detail('r').note, note);
  assert.ok(app.list().every(row => !Object.hasOwn(row, 'note')));
});

test('filters validate even on empty state and retain no query state', () => {
  const app = createApp();
  for (const value of [undefined, {}, /desk/, new String('desk')]) {
    assert.throws(() => app.list({ itemContains: value }), Error);
    assert.deepEqual(app.list(), []);
  }
  app.submit({ ...input('p'), item: '  Desk [Blue]  ', note: 'secret' }, requester, 0);
  const before = app.detail('p');
  const filter = { itemContains: '[Blue]' };
  const rows = app.list(filter);
  assert.equal(rows.length, 1);
  assert.ok(!Object.hasOwn(rows[0], 'note'));
  rows[0].item = 'changed';
  rows[0].note = 'injected';
  rows.length = 0;
  filter.itemContains = ' Desk';
  assert.deepEqual(app.list(filter), []);
  assert.equal(app.list({ itemContains: 'k [' }).length, 1);
  assert.deepEqual(app.list({ itemContains: '.*' }), []);
  assert.deepEqual(app.list({ itemContains: 'secret' }), []);
  assert.deepEqual(app.detail('p'), before);
  assert.equal(app.list().length, 1);
  assert.deepEqual(app.list(undefined), app.list());
});
