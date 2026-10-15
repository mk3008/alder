import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
export const receiptHeading = 'Reservation';
export function createReceiptReader(service, directory) {
  return id => {
    const booking = service.booking(id);
    if (!booking) throw Error('booking');
    mkdirSync(directory, { recursive: true });
    const file = join(directory, 'rooms.json');
    writeFileSync(file, JSON.stringify(service.rooms()));
    const rooms = JSON.parse(readFileSync(file, 'utf8'));
    return { id, roomName: rooms.find(r => r.id === booking.roomId).name };
  };
}
