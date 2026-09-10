const clearedContractors = new Set();

export function recordLicensingClearance(contractorId) {
  if (!contractorId) throw new Error("contractor is required");
  clearedContractors.add(contractorId);
}

export function hasLicensingClearance(contractorId) {
  return clearedContractors.has(contractorId);
}

export function resetLicensingBoard() {
  clearedContractors.clear();
}
