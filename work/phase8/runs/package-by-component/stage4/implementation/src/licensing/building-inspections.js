import { getPermit, replacePermit } from "./permit-records.js";
import { hasLicensingClearance } from "./licensing-board.js";

export function scheduleBuildingInspection({ permitId, inspectorId }) {
  const permit = getPermit(permitId);
  if (!inspectorId) throw new Error("inspector is required");
  if (!hasLicensingClearance(permit.contractorId)) {
    throw new Error("contractor licensing clearance is required for inspections");
  }
  replacePermit({ ...permit, inspection: { inspectorId, status: "scheduled" } });
  sendInspectionBooking(permitId, inspectorId);
}

export function inspectionStatus(permitId) {
  return getPermit(permitId).inspection?.status ?? "not-scheduled";
}

function sendInspectionBooking() {}
