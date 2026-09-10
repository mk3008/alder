const permits = new Map();

export function createPermit(permit) {
  permits.set(permit.id, permit);
}

export function getPermit(id) {
  const permit = permits.get(id);
  if (!permit) throw new Error("unknown permit");
  return permit;
}

export function replacePermit(permit) {
  permits.set(permit.id, permit);
}

export function resetPermitRecords() {
  permits.clear();
}
