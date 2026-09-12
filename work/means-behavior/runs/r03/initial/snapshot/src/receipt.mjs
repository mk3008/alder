import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export const receiptHeading = 'Reservation';

export function createReceiptReader(service, directory) {
  const mirrorPath = join(directory, 'rooms.json');
  return id => {
    const booking = service.booking(id);
    if (!booking) throw Error('booking');

    mkdirSync(directory, { recursive: true });
    writeFileSync(mirrorPath, JSON.stringify(service.rooms()), 'utf8');
    const rooms = JSON.parse(readFileSync(mirrorPath, 'utf8'));
    const room = rooms.find(room => room.id === booking.roomId);
    if (!room) throw Error('room');
    return { id: booking.id, roomName: room.name };
  };
}
