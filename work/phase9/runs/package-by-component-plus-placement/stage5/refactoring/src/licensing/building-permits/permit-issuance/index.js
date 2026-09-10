import { loadPermitRecord, savePermitRecord } from "../permit-records.js";
import { hasLicensingClearance } from "./licensing-clearance.js";
import { isCityEmergencyHoldActive } from "../../../city-operations/index.js";

export function issueBuildingPermit({ id, contractorId, riskLevel }) {
  if (isCityEmergencyHoldActive()) {
    throw new Error("building-permit issuance is unavailable during the city emergency hold");
  }
  if (!id || !contractorId) throw new Error("permit identity is required");
  if (riskLevel === "high" && !hasLicensingClearance(contractorId)) {
    throw new Error("contractor lacks licensing clearance");
  }
  savePermitRecord({ id, contractorId, riskLevel, status: "issued", inspection: null });
}

export function buildingPermitStatus(id) {
  return loadPermitRecord(id).status;
}
