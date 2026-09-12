import test from 'node:test';
import assert from 'node:assert/strict';
import { createService } from '../src/service.mjs';
test('availability, booking, and independent copies', () => {
  const s = createService(() => 100);
  assert.deepEqual(s.available(200, 300).map(r => r.id), ['a']);
  const b = s.reserve('a', 200, 300, 'user');
  assert.equal(s.booking(b.id).actor, 'user');
  assert.deepEqual(s.available(210, 220), []);
  assert.deepEqual(s.available(300, 400).map(r => r.id), ['a']);
  s.room('a').name = 'mutated';
  assert.equal(s.room('a').name, 'North');
  assert.throws(() => s.reserve('a', 50, 60, 'user'));
});
