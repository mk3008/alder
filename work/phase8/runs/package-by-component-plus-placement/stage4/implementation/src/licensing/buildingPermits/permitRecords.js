const permits = new Map();

export function resetPermitRecords() {
  permits.clear();
}

export function loadPermitRecord(id) {
  const permit = permits.get(id);
  if (!permit) throw new Error("unknown permit");
  return permit;
}

export function savePermitRecord(permit) {
  permits.set(permit.id, permit);
}
