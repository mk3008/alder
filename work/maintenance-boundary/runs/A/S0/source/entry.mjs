export function createApp({alphaUrl, alphaToken}) {
  const records = new Map();
  const authorization = `Bearer ${alphaToken}`;

  function find(id) {
    const record = records.get(id);
    if (!record) throw new Error('Unknown shipment');
    return record;
  }

  async function book(input) {
    if (!input || typeof input.id !== 'string' || !input.id.trim() ||
        typeof input.address !== 'string' || !input.address.trim() ||
        !Number.isSafeInteger(input.grams) || input.grams <= 0) {
      throw new Error('Invalid booking input');
    }
    const id = input.id.trim();
    const address = input.address.trim();
    const grams = input.grams;
    if (records.has(id)) throw new Error('Shipment id already exists');

    const response = await fetch(`${alphaUrl}/shipments`, {
      method: 'POST',
      redirect: 'manual',
      headers: {'Content-Type': 'application/json', Authorization: authorization},
      body: JSON.stringify({reference: id, destination: address, weightGrams: grams}),
    });
    if (response.status !== 201) throw new Error('Booking request failed');
    const result = await response.json();
    if (!result || typeof result.shipmentId !== 'string' ||
        result.shipmentId.length === 0 || result.accepted !== true) {
      throw new Error('Invalid booking response');
    }
    const record = {id, address, grams, trackingId: result.shipmentId, status: 'booked'};
    records.set(id, record);
    return {...record};
  }

  async function cancel(id) {
    const record = find(id);
    if (record.status === 'cancelled') throw new Error('Shipment already cancelled');
    const response = await fetch(`${alphaUrl}/shipments/${encodeURIComponent(record.trackingId)}`, {
      method: 'DELETE',
      redirect: 'manual',
      headers: {Authorization: authorization},
    });
    if (response.status !== 204) throw new Error('Cancellation request failed');
    record.status = 'cancelled';
    return {...record};
  }

  function detail(id) {
    return {...find(id)};
  }

  return {book, cancel, detail};
}
