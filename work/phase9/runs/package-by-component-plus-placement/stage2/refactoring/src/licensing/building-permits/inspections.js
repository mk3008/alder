import { loadPermitRecord, savePermitRecord } from "./permit-records.js";
import { hasLicensingClearance } from "./licensing-board.js";

export function scheduleBuildingInspection({ permitId, inspectorId }) {
  const permit = loadPermitRecord(permitId);
  if (!inspectorId) throw new Error("inspector is required");
  if (!hasLicensingClearance(permit.contractorId)) {
    throw new Error("contractor lacks licensing clearance");
  }
  savePermitRecord({ ...permit, inspection: { inspectorId, status: "scheduled" } });
  sendInspectionBooking(permitId, inspectorId);
}

export function inspectionStatus(permitId) {
  return loadPermitRecord(permitId).inspection?.status ?? "not-scheduled";
}

function sendInspectionBooking() {}
