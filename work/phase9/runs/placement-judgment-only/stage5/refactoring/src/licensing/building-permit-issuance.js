import { assertCityEmergencyHoldAllows } from "../city-operations/emergency-hold.js";

const clearedContractors = new Set();

export function recordLicensingClearance(contractorId) {
  clearedContractors.add(contractorId);
}

export function resetLicensingClearances() {
  clearedContractors.clear();
}

export function issueBuildingPermit({ id, contractorId, riskLevel }, savePermitRecord) {
  assertCityEmergencyHoldAllows("building-permit issuance");
  if (!id || !contractorId) throw new Error("permit identity is required");
  if (riskLevel === "high" && !clearedContractors.has(contractorId)) {
    throw new Error("contractor licensing clearance is required");
  }
  savePermitRecord({ id, contractorId, riskLevel, status: "issued", inspection: null });
}
