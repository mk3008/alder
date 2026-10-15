// Application rules depend only on a record store and a shipment service.
export function createBookingService({records, shipments}) {
  function detail(id) {
    const record = records.get(id);
    if (!record) throw new Error('Unknown booking');
    return record;
  }

  return {
    detail,
    async book(input) {
      if (!input || typeof input.id !== 'string' || !input.id.trim() ||
          typeof input.address !== 'string' || !input.address.trim() ||
          !Number.isSafeInteger(input.grams) || input.grams <= 0) {
        throw new Error('Invalid booking input');
      }
      const {grams} = input;
      const id = input.id.trim();
      const address = input.address.trim();
      if (records.get(id)) throw new Error('Booking already exists');
      const trackingId = await shipments.book({id, address, grams});
      const record = {id, address, grams, trackingId, status: 'booked'};
      records.put(record);
      return {...record};
    },
    async cancel(id) {
      const record = detail(id);
      if (record.status === 'cancelled') throw new Error('Booking already cancelled');
      await shipments.cancel(record.trackingId);
      const cancelled = {...record, status: 'cancelled'};
      records.put(cancelled);
      return {...cancelled};
    },
  };
}
