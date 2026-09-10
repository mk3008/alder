const clearedContractors = new Set();

export function recordLicensingClearance(contractorId) {
  clearedContractors.add(contractorId);
}

export function hasLicensingClearance(contractorId) {
  return clearedContractors.has(contractorId);
}

export function resetLicensingClearances() {
  clearedContractors.clear();
}
