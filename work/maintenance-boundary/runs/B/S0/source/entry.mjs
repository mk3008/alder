import {createAlphaClient} from './alpha.mjs';

export function createApp({alphaUrl, alphaToken}) {
  const provider = createAlphaClient({alphaUrl, alphaToken});
  const records = new Map();

  function requireRecord(id) {
    const record = records.get(id);
    if (!record) throw new Error('Unknown shipment');
    return record;
  }

  return {
    async book(input) {
      if (input === null || typeof input !== 'object' ||
          typeof input.id !== 'string' || input.id.trim() === '' ||
          typeof input.address !== 'string' || input.address.trim() === '' ||
          !Number.isSafeInteger(input.grams) || input.grams <= 0) {
        throw new Error('Invalid booking input');
      }
      const shipment = {id: input.id.trim(), address: input.address.trim(), grams: input.grams};
      if (records.has(shipment.id)) throw new Error('Duplicate shipment id');
      const trackingId = await provider.book(shipment);
      const record = {...shipment, trackingId, status: 'booked'};
      records.set(record.id, record);
      return {...record};
    },
    async cancel(id) {
      const record = requireRecord(id);
      if (record.status === 'cancelled') throw new Error('Shipment already cancelled');
      await provider.cancel(record.trackingId);
      record.status = 'cancelled';
      return {...record};
    },
    detail(id) {
      return {...requireRecord(id)};
    },
  };
}
