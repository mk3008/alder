export { recordLicensingClearance } from "./licensing-board.js";
export { issueBuildingPermit, scheduleBuildingInspection, buildingPermitStatus, inspectionStatus } from "./building-permits.js";

import { resetLicensingBoard } from "./licensing-board.js";
import { resetBuildingPermits } from "./building-permits.js";

export function resetLicensing() {
  resetLicensingBoard();
  resetBuildingPermits();
}
