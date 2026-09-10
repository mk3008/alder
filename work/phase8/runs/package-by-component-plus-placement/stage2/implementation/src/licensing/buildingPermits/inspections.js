import { loadPermitRecord, savePermitRecord } from "./permitRecords.js";
import { hasCurrentLicensingClearance } from "./contractorLicensingClearance.js";

export function scheduleBuildingInspection({ permitId, inspectorId }) {
  const permit = loadPermitRecord(permitId);
  if (!inspectorId) throw new Error("inspector is required");
  if (!hasCurrentLicensingClearance(permit.contractorId)) {
    throw new Error("contractor licensing clearance is required for inspections");
  }
  savePermitRecord({ ...permit, inspection: { inspectorId, status: "scheduled" } });
  sendInspectionBooking(permitId, inspectorId);
}

export function inspectionStatus(permitId) {
  return loadPermitRecord(permitId).inspection?.status ?? "not-scheduled";
}

function sendInspectionBooking() {}
