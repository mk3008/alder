export async function bookShipment({ records, alphaUrl, alphaToken, betaUrl, betaToken }, input) {
  if (typeof input?.id !== 'string' || !input.id.trim()) {
    throw new Error('id must be a nonempty string');
  }
  if (typeof input.address !== 'string' || !input.address.trim()) {
    throw new Error('address must be a nonempty string');
  }
  if (!Number.isSafeInteger(input.grams) || input.grams <= 0) {
    throw new Error('grams must be a positive safe integer');
  }
  const provider = Object.hasOwn(input, 'provider') ? input.provider : 'alpha';
  if (provider !== 'alpha' && provider !== 'beta') throw new Error('Invalid provider');
  const id = input.id.trim();
  const address = input.address.trim();
  const grams = input.grams;
  if (records.has(id)) throw new Error('Shipment id already exists');

  let trackingId;
  if (provider === 'alpha') {
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
    trackingId = payload.shipmentId;
  } else {
    const response = await fetch(betaUrl + '/v2/jobs', {
      method: 'POST',
      redirect: 'manual',
      headers: { 'Content-Type': 'application/json', 'X-Api-Key': betaToken },
      body: JSON.stringify({ client_ref: id, parcel: { destination: address, mass_kg: grams / 1000 } }),
    });
    if (response.status !== 200) throw new Error('Booking was not accepted');
    const payload = await response.json();
    if (payload === null || typeof payload !== 'object' || Array.isArray(payload)
        || payload.ok !== true || payload.job === null || typeof payload.job !== 'object'
        || Array.isArray(payload.job) || typeof payload.job.code !== 'string'
        || payload.job.code.length === 0) {
      throw new Error('Invalid booking response');
    }
    trackingId = payload.job.code;
  }
  const record = { id, address, grams, trackingId, status: 'booked', provider };
  records.set(id, record);
  return { ...record };
}
