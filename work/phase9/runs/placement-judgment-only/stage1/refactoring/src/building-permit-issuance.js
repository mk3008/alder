import { hasLicensingClearance } from "./licensing-board.js";

export function issueBuildingPermit({ id, contractorId, riskLevel }, savePermitRecord) {
  if (!id || !contractorId) throw new Error("permit identity is required");
  if (riskLevel === "high" && !hasLicensingClearance(contractorId)) {
    throw new Error("contractor licensing clearance is required");
  }
  savePermitRecord({ id, contractorId, riskLevel, status: "issued", inspection: null });
}
