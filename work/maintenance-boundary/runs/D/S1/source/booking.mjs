// Application rules depend only on a record store and provider-indexed shipment services.
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
      const provider = 'provider' in input ? input.provider : 'alpha';
      if (provider !== 'alpha' && provider !== 'beta') {
        throw new Error('Invalid provider');
      }
      const {grams} = input;
      const id = input.id.trim();
      const address = input.address.trim();
      if (records.get(id)) throw new Error('Booking already exists');
      const trackingId = await shipments[provider].book({id, address, grams});
      const record = {id, address, grams, trackingId, status: 'booked', provider};
      records.put(record);
      return {...record};
    },
    async cancel(id) {
      const record = detail(id);
      if (record.status === 'cancelled') throw new Error('Booking already cancelled');
      await shipments[record.provider].cancel(record.trackingId);
      const cancelled = {...record, status: 'cancelled'};
      records.put(cancelled);
      return {...cancelled};
    },
  };
}
