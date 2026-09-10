import { hasLicensingClearance } from "./licensing-board.js";
import { createPermit, getPermit, resetPermitRecords } from "./permit-records.js";
import { isCityEmergencyHoldActive } from "../city-operations/index.js";

export function issueBuildingPermit({ id, contractorId, riskLevel }) {
  if (!id || !contractorId) throw new Error("permit identity is required");
  if (isCityEmergencyHoldActive()) {
    throw new Error("permit issuance is unavailable during the city emergency hold");
  }
  if (riskLevel === "high" && !hasLicensingClearance(contractorId)) {
    throw new Error("contractor licensing clearance is required for high-risk permits");
  }
  createPermit({ id, contractorId, riskLevel, status: "issued", inspection: null });
}

export function buildingPermitStatus(id) {
  return getPermit(id).status;
}

export function resetBuildingPermits() {
  resetPermitRecords();
}
