import { savePermitRecord } from "./permitRecords.js";
import { assertCityEmergencyHoldAllows } from "../../cityOperations/emergencyHold/index.js";
import {
  hasCurrentLicensingClearance,
  resetContractorLicensingClearance,
} from "./contractorLicensingClearance.js";

export function resetHighRiskPermitIssuance() {
  resetContractorLicensingClearance();
}

export function issueBuildingPermit({ id, contractorId, riskLevel }) {
  assertCityEmergencyHoldAllows("building permit issuance");
  if (!id || !contractorId) throw new Error("permit identity is required");
  if (riskLevel === "high" && !hasCurrentLicensingClearance(contractorId)) {
    throw new Error("contractor licensing clearance is required for high-risk permits");
  }
  savePermitRecord({ id, contractorId, riskLevel, status: "issued", inspection: null });
}
