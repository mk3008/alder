export function shipmentDetail(records, id) {
  const record = records.get(id);
  if (!record) throw new Error('Unknown shipment');
  return { ...record };
}
