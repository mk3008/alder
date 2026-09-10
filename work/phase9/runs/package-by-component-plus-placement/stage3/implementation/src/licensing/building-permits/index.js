export {
  buildingPermitStatus,
  issueBuildingPermit,
} from "./permit-issuance.js";

export { inspectionStatus, scheduleBuildingInspection } from "./inspections.js";
export { recordLicensingClearance } from "./licensing-board.js";

import { resetLicensingBoard } from "./licensing-board.js";
import { resetPermitRecords } from "./permit-records.js";

export function resetLicensing() {
  resetPermitRecords();
  resetLicensingBoard();
}
