import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createService } from '../src/service.mjs';
import { createReceiptReader, receiptHeading } from '../src/receipt.mjs';

test('receipts rebuild mirrors, show current names, and preserve the source', t => {
  const root = mkdtempSync(join(import.meta.dirname, 'receipt-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const directory = join(root, 'mirror');
  const path = join(directory, 'rooms.json');
  const service = createService(() => 100);
  const booking = service.reserve('a', 200, 300, 'user');
  const receipt = createReceiptReader(service, directory);
  assert.equal(receiptHeading, 'Reservation');
  assert.throws(() => receipt('unknown'), /booking/);
  assert.deepEqual(receipt(booking.id), { id: booking.id, roomName: 'North' });
  assert.deepEqual(JSON.parse(readFileSync(path, 'utf8')), service.rooms());
  service.renameRoom('a', 'South');
  assert.equal(receipt(booking.id).roomName, 'South');
  writeFileSync(path, '{corrupt');
  assert.equal(receipt(booking.id).roomName, 'South');
  writeFileSync(path, JSON.stringify([{ id: 'a', name: 'Untrusted' }]));
  assert.equal(receipt(booking.id).roomName, 'South');
  rmSync(path);
  assert.equal(receipt(booking.id).roomName, 'South');
  assert.equal(service.room('a').name, 'South');
  assert.deepEqual(service.booking(booking.id), booking);
});

test('disk failures propagate', t => {
  const root = mkdtempSync(join(import.meta.dirname, 'receipt-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const directory = join(root, 'file');
  writeFileSync(directory, 'not a directory');
  const service = createService(() => 100);
  const booking = service.reserve('a', 200, 300, 'user');
  assert.throws(() => createReceiptReader(service, directory)(booking.id));
  assert.equal(service.room('a').name, 'North');
});
