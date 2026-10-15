import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { createService } from '../src/service.mjs';
import { createReceiptReader, receiptHeading } from '../src/receipt.mjs';

function fixture(t) {
  const root = mkdtempSync(new URL('../receipt-test-', import.meta.url));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const service = createService(() => 100);
  const booking = service.reserve('a', 200, 300, 'user');
  const directory = join(root, 'mirror');
  return { root, service, booking, directory };
}

test('receipt rebuilds missing, corrupt, stale, and deleted mirrors with current names', t => {
  const { service, booking, directory } = fixture(t);
  const reader = createReceiptReader(service, directory);
  const mirror = join(directory, 'rooms.json');
  assert.deepEqual(reader(booking.id), { id: booking.id, roomName: 'North' });
  assert.deepEqual(JSON.parse(readFileSync(mirror, 'utf8')), service.rooms());
  writeFileSync(mirror, '{broken');
  assert.equal(reader(booking.id).roomName, 'North');
  writeFileSync(mirror, JSON.stringify([{ id: 'a', name: 'Forged' }]));
  assert.equal(reader(booking.id).roomName, 'North');
  assert.equal(service.room('a').name, 'North');
  service.renameRoom('a', 'South');
  assert.equal(reader(booking.id).roomName, 'South');
  rmSync(mirror);
  assert.equal(reader(booking.id).roomName, 'South');
  assert.deepEqual(service.booking(booking.id), booking);
});

test('unknown bookings fail and disk errors propagate', t => {
  const { service, booking, root, directory } = fixture(t);
  assert.throws(() => createReceiptReader(service, directory)('unknown'), /booking/);
  const blocked = join(root, 'file');
  writeFileSync(blocked, 'occupied');
  assert.throws(() => createReceiptReader(service, blocked)(booking.id), { code: 'EEXIST' });
  assert.deepEqual(service.booking(booking.id), booking);
  assert.equal(service.room('a').name, 'North');
});

test('receipt heading is Reservation', () => {
  assert.equal(receiptHeading, 'Reservation');
});
