import { getPermit, replacePermit } from "./permit-records.js";

export function scheduleBuildingInspection({ permitId, inspectorId }) {
  const permit = getPermit(permitId);
  if (!inspectorId) throw new Error("inspector is required");
  replacePermit({ ...permit, inspection: { inspectorId, status: "scheduled" } });
  sendInspectionBooking(permitId, inspectorId);
}

export function inspectionStatus(permitId) {
  return getPermit(permitId).inspection?.status ?? "not-scheduled";
}

function sendInspectionBooking() {}
