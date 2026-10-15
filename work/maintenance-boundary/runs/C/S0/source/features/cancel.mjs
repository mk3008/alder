export async function cancelShipment({ records, alphaUrl, alphaToken }, id) {
  const record = records.get(id);
  if (!record) throw new Error('Unknown shipment');
  if (record.status === 'cancelled') throw new Error('Shipment is already cancelled');

  const response = await fetch(alphaUrl + '/shipments/' + encodeURIComponent(record.trackingId), {
    method: 'DELETE',
    redirect: 'manual',
    headers: { Authorization: 'Bearer ' + alphaToken },
  });
  if (response.status !== 204) throw new Error('Cancellation was not accepted');
  record.status = 'cancelled';
  return { ...record };
}
