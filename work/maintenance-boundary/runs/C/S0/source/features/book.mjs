export async function bookShipment({ records, alphaUrl, alphaToken }, input) {
  if (typeof input?.id !== 'string' || !input.id.trim()) {
    throw new Error('id must be a nonempty string');
  }
  if (typeof input.address !== 'string' || !input.address.trim()) {
    throw new Error('address must be a nonempty string');
  }
  if (!Number.isSafeInteger(input.grams) || input.grams <= 0) {
    throw new Error('grams must be a positive safe integer');
  }
  const id = input.id.trim();
  const address = input.address.trim();
  const grams = input.grams;
  if (records.has(id)) throw new Error('Shipment id already exists');

  const response = await fetch(alphaUrl + '/shipments', {
    method: 'POST',
    redirect: 'manual',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + alphaToken,
    },
    body: JSON.stringify({ reference: id, destination: address, weightGrams: grams }),
  });
  if (response.status !== 201) throw new Error('Booking was not accepted');
  const payload = await response.json();
  if (payload === null || typeof payload !== 'object' || Array.isArray(payload)
      || payload.accepted !== true || typeof payload.shipmentId !== 'string'
      || payload.shipmentId.length === 0) {
    throw new Error('Invalid booking response');
  }
  const record = { id, address, grams, trackingId: payload.shipmentId, status: 'booked' };
  records.set(id, record);
  return { ...record };
}
