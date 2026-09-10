export { issueBuildingPermit } from "./highRiskPermitIssuance.js";
export { recordLicensingClearance } from "./contractorLicensingClearance.js";
export { inspectionStatus, scheduleBuildingInspection } from "./inspections.js";
export { loadPermitRecord } from "./permitRecords.js";

import { resetContractorLicensingClearance } from "./contractorLicensingClearance.js";
import { loadPermitRecord, resetPermitRecords } from "./permitRecords.js";

export function reset() {
  resetContractorLicensingClearance();
  resetPermitRecords();
}

export function buildingPermitStatus(id) {
  return loadPermitRecord(id).status;
}
