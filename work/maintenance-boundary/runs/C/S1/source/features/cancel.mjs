export async function cancelShipment({ records, alphaUrl, alphaToken, betaUrl, betaToken }, id) {
  const record = records.get(id);
  if (!record) throw new Error('Unknown shipment');
  if (record.status === 'cancelled') throw new Error('Shipment is already cancelled');

  if (record.provider === 'alpha') {
    const response = await fetch(alphaUrl + '/shipments/' + encodeURIComponent(record.trackingId), {
      method: 'DELETE',
      redirect: 'manual',
      headers: { Authorization: 'Bearer ' + alphaToken },
    });
    if (response.status !== 204) throw new Error('Cancellation was not accepted');
  } else {
    const response = await fetch(betaUrl + '/v2/void', {
      method: 'POST',
      redirect: 'manual',
      headers: { 'Content-Type': 'application/json', 'X-Api-Key': betaToken },
      body: JSON.stringify({ job_code: record.trackingId }),
    });
    if (response.status !== 200) throw new Error('Cancellation was not accepted');
    const payload = await response.json();
    if (payload === null || typeof payload !== 'object' || Array.isArray(payload) || payload.ok !== true) {
      throw new Error('Invalid cancellation response');
    }
  }
  record.status = 'cancelled';
  return { ...record };
}
