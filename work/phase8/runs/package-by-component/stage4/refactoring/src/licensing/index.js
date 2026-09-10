export { recordLicensingClearance } from "./licensing-board.js";
export { issueBuildingPermit, buildingPermitStatus } from "./building-permits.js";
export { scheduleBuildingInspection, inspectionStatus } from "./building-inspections.js";

import { resetLicensingBoard } from "./licensing-board.js";
import { resetBuildingPermits } from "./building-permits.js";

export function resetLicensing() {
  resetLicensingBoard();
  resetBuildingPermits();
}
