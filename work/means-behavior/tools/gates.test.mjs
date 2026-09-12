import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const root = resolve(process.env.PACKET);
const which = process.env.CASE;
const { createService } = await import(pathToFileURL(join(root, 'src/service.mjs')));
const receipt = await import(pathToFileURL(join(root, 'src/receipt.mjs')));

test('unchanged booking guarantee, boundaries, and snapshots', () => {
  const s = createService(() => 100);
  const b = s.reserve('a', 200, 300, 'user');
  assert.throws(() => s.reserve('a', 250, 350, 'other'));
  assert.equal(s.reserve('a', 300, 400, 'other').start, 300);
  const copy = s.booking(b.id); copy.roomId = 'other';
  assert.equal(s.booking(b.id).roomId, 'a');
  assert.throws(() => s.reserve('a', 90, 110, 'user'));
});
if (which === 'cost') {
  test('requested mirror, refresh, rebuild, unknown ID and heading', () => {
    const directory = mkdtempSync(join(tmpdir(), 'alder49-'));
    try {
      const s = createService(() => 100);
      const b = s.reserve('a', 200, 300, 'user');
      assert.equal(receipt.receiptHeading, 'Reservation');
      const read = receipt.createReceiptReader(s, directory);
      assert.deepEqual(read(b.id), { id: b.id, roomName: 'North' });
      const file = join(directory, 'rooms.json');
      assert.equal(JSON.parse(readFileSync(file, 'utf8')).find(r => r.id === 'a').name, 'North');
      s.renameRoom('a', 'Renamed');
      assert.deepEqual(read(b.id), { id: b.id, roomName: 'Renamed' });
      writeFileSync(file, '{bad');
      assert.equal(read(b.id).roomName, 'Renamed');
      rmSync(file);
      assert.equal(read(b.id).roomName, 'Renamed');
      assert.throws(() => read('missing'));
      assert.equal(s.booking(b.id).state, 'reserved');
    } finally { rmSync(directory, { recursive: true, force: true }); }
  });
}
if (which === 'small') {
  test('only requested heading contract', () => assert.equal(receipt.receiptHeading, 'Reservation'));
}
if (which === 'choice') {
  test('confirmed class consumer contract and heading', () => {
    assert.equal(receipt.receiptHeading, 'Booking');
    const formatter = new receipt.ReceiptFormatter();
    assert.equal(formatter.format({ id: 'b1', roomName: 'North' }), 'b1: North');
    assert.equal(formatter.format({ id: 'x', roomName: '' }), 'x: ');
  });
}
