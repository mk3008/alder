export function createApp({alphaUrl, alphaToken, betaUrl, betaToken}) {
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
    const provider = Object.hasOwn(input, 'provider') ? input.provider : 'alpha';
    if (provider !== 'alpha' && provider !== 'beta') throw new Error('Invalid provider');
    if (records.has(id)) throw new Error('Shipment id already exists');

    const isAlpha = provider === 'alpha';
    const response = await fetch(isAlpha ? `${alphaUrl}/shipments` : `${betaUrl}/v2/jobs`, {
      method: 'POST',
      redirect: 'manual',
      headers: isAlpha
        ? {'Content-Type': 'application/json', Authorization: authorization}
        : {'Content-Type': 'application/json', 'X-Api-Key': betaToken},
      body: JSON.stringify(isAlpha
        ? {reference: id, destination: address, weightGrams: grams}
        : {client_ref: id, parcel: {destination: address, mass_kg: grams / 1000}}),
    });
    if (response.status !== (isAlpha ? 201 : 200)) throw new Error('Booking request failed');
    const result = await response.json();
    const trackingId = isAlpha ? result?.shipmentId : result?.job?.code;
    const accepted = isAlpha ? result?.accepted : result?.ok;
    if (typeof trackingId !== 'string' || trackingId.length === 0 || accepted !== true) {
      throw new Error('Invalid booking response');
    }
    const record = {id, address, grams, trackingId, status: 'booked', provider};
    records.set(id, record);
    return {...record};
  }

  async function cancel(id) {
    const record = find(id);
    if (record.status === 'cancelled') throw new Error('Shipment already cancelled');
    const isAlpha = record.provider === 'alpha';
    const response = await fetch(isAlpha
      ? `${alphaUrl}/shipments/${encodeURIComponent(record.trackingId)}`
      : `${betaUrl}/v2/void`, {
      method: isAlpha ? 'DELETE' : 'POST',
      redirect: 'manual',
      headers: isAlpha
        ? {Authorization: authorization}
        : {'Content-Type': 'application/json', 'X-Api-Key': betaToken},
      ...(isAlpha ? {} : {body: JSON.stringify({job_code: record.trackingId})}),
    });
    if (response.status !== (isAlpha ? 204 : 200)) throw new Error('Cancellation request failed');
    if (!isAlpha && (await response.json())?.ok !== true) {
      throw new Error('Invalid cancellation response');
    }
    record.status = 'cancelled';
    return {...record};
  }

  function detail(id) {
    return {...find(id)};
  }

  return {book, cancel, detail};
}
