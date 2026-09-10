import { hasLicensingClearance } from "./licensing-board.js";

export function scheduleBuildingInspection(
  { permitId, inspectorId },
  loadPermitRecord,
  savePermitRecord,
  sendInspectionBooking,
) {
  const permit = loadPermitRecord(permitId);
  if (!inspectorId) throw new Error("inspector is required");
  if (!hasLicensingClearance(permit.contractorId)) {
    throw new Error("contractor licensing clearance is required");
  }
  savePermitRecord({ ...permit, inspection: { inspectorId, status: "scheduled" } });
  sendInspectionBooking(permitId, inspectorId);
}
