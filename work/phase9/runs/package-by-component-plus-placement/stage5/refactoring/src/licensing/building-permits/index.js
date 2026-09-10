export {
  buildingPermitStatus,
  issueBuildingPermit,
} from "./permit-issuance/index.js";

export { inspectionStatus, scheduleBuildingInspection } from "./inspections.js";
export { recordLicensingClearance } from "./permit-issuance/licensing-clearance.js";

import { resetLicensingClearance } from "./permit-issuance/licensing-clearance.js";
import { resetPermitRecords } from "./permit-records.js";

export function resetLicensing() {
  resetPermitRecords();
  resetLicensingClearance();
}
