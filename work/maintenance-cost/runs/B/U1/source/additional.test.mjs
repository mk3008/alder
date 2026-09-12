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
