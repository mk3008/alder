import { hasLicensingClearance } from "./licensing-board.js";
import { assertCityEmergencyHoldAllows } from "../city-operations/emergency-hold.js";

export function issueBuildingPermit({ id, contractorId, riskLevel }, savePermitRecord) {
  assertCityEmergencyHoldAllows("building-permit issuance");
  if (!id || !contractorId) throw new Error("permit identity is required");
  if (riskLevel === "high" && !hasLicensingClearance(contractorId)) {
    throw new Error("contractor licensing clearance is required");
  }
  savePermitRecord({ id, contractorId, riskLevel, status: "issued", inspection: null });
}
