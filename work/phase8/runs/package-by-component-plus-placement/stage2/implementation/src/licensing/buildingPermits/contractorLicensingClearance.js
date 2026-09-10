const clearedContractors = new Set();

export function resetContractorLicensingClearance() {
  clearedContractors.clear();
}

export function recordLicensingClearance(contractorId) {
  clearedContractors.add(contractorId);
}

export function hasCurrentLicensingClearance(contractorId) {
  return clearedContractors.has(contractorId);
}
