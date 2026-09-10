import { loadPermitRecord, savePermitRecord } from "./permit-records.js";

const clearedContractors = new Set();

export function resetPermitIssuance() {
  clearedContractors.clear();
}

export function recordLicensingClearance(contractorId) {
  if (!contractorId) throw new Error("contractor identity is required");
  clearedContractors.add(contractorId);
}

export function issueBuildingPermit({ id, contractorId, riskLevel }) {
  if (!id || !contractorId) throw new Error("permit identity is required");
  if (riskLevel === "high" && !clearedContractors.has(contractorId)) {
    throw new Error("contractor lacks licensing clearance");
  }
  savePermitRecord({ id, contractorId, riskLevel, status: "issued", inspection: null });
}

export function buildingPermitStatus(id) {
  return loadPermitRecord(id).status;
}
