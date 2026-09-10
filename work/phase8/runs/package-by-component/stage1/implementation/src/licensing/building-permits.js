import { hasLicensingClearance } from "./licensing-board.js";

const permits = new Map();

export function issueBuildingPermit({ id, contractorId, riskLevel }) {
  if (!id || !contractorId) throw new Error("permit identity is required");
  if (riskLevel === "high" && !hasLicensingClearance(contractorId)) {
    throw new Error("contractor licensing clearance is required for high-risk permits");
  }
  savePermitRecord({ id, contractorId, riskLevel, status: "issued", inspection: null });
}

export function scheduleBuildingInspection({ permitId, inspectorId }) {
  const permit = loadPermitRecord(permitId);
  if (!inspectorId) throw new Error("inspector is required");
  savePermitRecord({ ...permit, inspection: { inspectorId, status: "scheduled" } });
  sendInspectionBooking(permitId, inspectorId);
}

export function buildingPermitStatus(id) {
  return loadPermitRecord(id).status;
}

export function inspectionStatus(permitId) {
  return loadPermitRecord(permitId).inspection?.status ?? "not-scheduled";
}

export function resetBuildingPermits() {
  permits.clear();
}

function loadPermitRecord(id) {
  const permit = permits.get(id);
  if (!permit) throw new Error("unknown permit");
  return permit;
}

function savePermitRecord(permit) { permits.set(permit.id, permit); }
function sendInspectionBooking() {}
