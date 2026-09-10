export {
  buildingPermitStatus,
  issueBuildingPermit,
  recordLicensingClearance,
  resetPermitIssuance,
} from "./permit-issuance.js";

export { inspectionStatus, scheduleBuildingInspection } from "./inspections.js";

import { resetPermitIssuance } from "./permit-issuance.js";
import { resetPermitRecords } from "./permit-records.js";

export function resetLicensing() {
  resetPermitRecords();
  resetPermitIssuance();
}
