import { loadPermitRecord, savePermitRecord } from "./permitRecords.js";

export function scheduleBuildingInspection({ permitId, inspectorId }) {
  const permit = loadPermitRecord(permitId);
  if (!inspectorId) throw new Error("inspector is required");
  savePermitRecord({ ...permit, inspection: { inspectorId, status: "scheduled" } });
  sendInspectionBooking(permitId, inspectorId);
}

export function inspectionStatus(permitId) {
  return loadPermitRecord(permitId).inspection?.status ?? "not-scheduled";
}

function sendInspectionBooking() {}
