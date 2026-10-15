import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createService } from '../src/service.mjs';
import { createReceiptReader, receiptHeading } from '../src/receipt.mjs';

test('receipts rebuild JSON mirrors and use current names without changing source data', () => {
  const temporary = mkdtempSync(new URL('../receipt-test-', import.meta.url));
  try {
    const directory = join(temporary, 'mirror');
    const mirrorPath = join(directory, 'rooms.json');
    const service = createService(() => 100);
    const booking = service.reserve('a', 200, 300, 'user');
    const reader = createReceiptReader(service, directory);
    assert.equal(receiptHeading, 'Reservation');
    assert.throws(() => reader('unknown'), /booking/);
    assert.deepEqual(reader(booking.id), { id: booking.id, roomName: 'North' });
    assert.deepEqual(JSON.parse(readFileSync(mirrorPath, 'utf8')), service.rooms());

    const name = 'South "room"\n会議室';
    service.renameRoom('a', name);
    assert.deepEqual(reader(booking.id), { id: booking.id, roomName: name });
    writeFileSync(mirrorPath, '{corrupt');
    assert.equal(reader(booking.id).roomName, name);
    writeFileSync(mirrorPath, JSON.stringify([{ id: 'a', name: 'tampered' }]));
    assert.equal(reader(booking.id).roomName, name);
    rmSync(mirrorPath);
    assert.equal(reader(booking.id).roomName, name);
    assert.equal(service.room('a').name, name);
    assert.deepEqual(service.booking(booking.id), booking);

    rmSync(directory, { recursive: true });
    writeFileSync(directory, 'not a directory');
    assert.throws(() => reader(booking.id));
    assert.equal(service.room('a').name, name);
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
});
