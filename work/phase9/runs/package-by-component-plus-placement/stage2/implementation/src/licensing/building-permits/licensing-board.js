const clearedContractors = new Set();

export function resetLicensingBoard() {
  clearedContractors.clear();
}

export function recordLicensingClearance(contractorId) {
  if (!contractorId) throw new Error("contractor identity is required");
  clearedContractors.add(contractorId);
}

export function hasLicensingClearance(contractorId) {
  return clearedContractors.has(contractorId);
}
