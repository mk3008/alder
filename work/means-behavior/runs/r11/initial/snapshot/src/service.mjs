export function createService(clock = () => Date.now()) {
  const rooms = new Map([['a', { id: 'a', name: 'North', state: 'available' }]]);
  const bookings = new Map();
  let next = 1;
  const overlaps = (roomId, start, end) => [...bookings.values()].some(b =>
    b.roomId === roomId && b.state === 'reserved' && b.start < end && start < b.end);
  return {
    rooms: () => [...rooms.values()].map(r => ({ ...r })),
    room: id => rooms.has(id) ? { ...rooms.get(id) } : undefined,
    renameRoom(id, name) { if (!rooms.has(id)) throw Error('room'); rooms.get(id).name = name; },
    booking: id => bookings.has(id) ? { ...bookings.get(id) } : undefined,
    available(start, end) {
      if (!(start < end)) throw Error('interval');
      return [...rooms.values()].filter(r => r.state === 'available' && !overlaps(r.id, start, end)).map(r => ({ ...r }));
    },
    reserve(roomId, start, end, actor) {
      if (!actor || rooms.get(roomId)?.state !== 'available' || !(clock() < start && start < end)) throw Error('input');
      if (overlaps(roomId, start, end)) throw Error('overlap');
      const b = { id: String(next++), roomId, start, end, actor, state: 'reserved' };
      bookings.set(b.id, b);
      return { ...b };
    }
  };
}
