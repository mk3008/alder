export {
  buildingPermitStatus,
  issueBuildingPermit,
} from "./permit-issuance.js";

export { inspectionStatus, scheduleBuildingInspection } from "./inspections.js";
export { recordLicensingClearance } from "../licensing-clearance/index.js";

import { resetLicensingClearance } from "../licensing-clearance/index.js";
import { resetPermitRecords } from "./permit-records.js";

export function resetLicensing() {
  resetPermitRecords();
  resetLicensingClearance();
}
