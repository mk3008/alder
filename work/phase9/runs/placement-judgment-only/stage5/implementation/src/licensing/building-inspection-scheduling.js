export function scheduleBuildingInspection(
  { permitId, inspectorId },
  loadPermitRecord,
  savePermitRecord,
  sendInspectionBooking,
) {
  const permit = loadPermitRecord(permitId);
  if (!inspectorId) throw new Error("inspector is required");
  savePermitRecord({ ...permit, inspection: { inspectorId, status: "scheduled" } });
  sendInspectionBooking(permitId, inspectorId);
}
