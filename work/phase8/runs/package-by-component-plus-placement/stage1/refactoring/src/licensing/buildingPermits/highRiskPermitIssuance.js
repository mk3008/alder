import { savePermitRecord } from "./permitRecords.js";

const clearedContractors = new Set();

export function resetHighRiskPermitIssuance() {
  clearedContractors.clear();
}

export function recordLicensingClearance(contractorId) {
  clearedContractors.add(contractorId);
}

export function issueBuildingPermit({ id, contractorId, riskLevel }) {
  if (!id || !contractorId) throw new Error("permit identity is required");
  if (riskLevel === "high" && !clearedContractors.has(contractorId)) {
    throw new Error("contractor licensing clearance is required for high-risk permits");
  }
  savePermitRecord({ id, contractorId, riskLevel, status: "issued", inspection: null });
}
