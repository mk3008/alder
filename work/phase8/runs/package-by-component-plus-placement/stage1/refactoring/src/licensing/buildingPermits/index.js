export { issueBuildingPermit, recordLicensingClearance } from "./highRiskPermitIssuance.js";
export { inspectionStatus, scheduleBuildingInspection } from "./inspections.js";
export { loadPermitRecord } from "./permitRecords.js";

import { resetHighRiskPermitIssuance } from "./highRiskPermitIssuance.js";
import { loadPermitRecord, resetPermitRecords } from "./permitRecords.js";

export function reset() {
  resetHighRiskPermitIssuance();
  resetPermitRecords();
}

export function buildingPermitStatus(id) {
  return loadPermitRecord(id).status;
}
