import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createService } from '../src/service.mjs';
import { createReceiptReader, receiptHeading } from '../src/receipt.mjs';

test('receipt rebuilds mirror and reflects authoritative current names', () => {
  const directory = mkdtempSync(new URL('../receipt-test-', import.meta.url));
  try {
    const service = createService(() => 100);
    const booking = service.reserve('a', 200, 300, 'user');
    const mirrorDirectory = join(directory, 'mirror');
    const path = join(mirrorDirectory, 'rooms.json');
    const receipt = createReceiptReader(service, mirrorDirectory);
    assert.equal(receiptHeading, 'Reservation');
    assert.throws(() => receipt('unknown'), /booking/);
    assert.deepEqual(receipt(booking.id), { id: booking.id, roomName: 'North' });
    assert.deepEqual(JSON.parse(readFileSync(path, 'utf8')), service.rooms());
    service.renameRoom('a', 'South');
    assert.equal(receipt(booking.id).roomName, 'South');
    writeFileSync(path, '{broken');
    assert.equal(receipt(booking.id).roomName, 'South');
    writeFileSync(path, JSON.stringify([{ id: 'a', name: 'forged' }]));
    assert.equal(receipt(booking.id).roomName, 'South');
    rmSync(path);
    assert.equal(receipt(booking.id).roomName, 'South');
    assert.equal(service.room('a').name, 'South');
    assert.deepEqual(service.booking(booking.id), booking);
    const blocked = join(directory, 'file');
    writeFileSync(blocked, 'not a directory');
    assert.throws(() => createReceiptReader(service, blocked)(booking.id));
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
