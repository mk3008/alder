import test from "node:test";
import assert from "node:assert/strict";
import { reset, issueBuildingPermit, scheduleBuildingInspection, inspectionStatus, recordLicensingClearance } from "../src/municipal.js";
test("stage 5 removes inspection scheduling from the Licensing clearance policy while issuance remains protected", () => {
  reset();
  issueBuildingPermit({ id: "p1", contractorId: "c1", riskLevel: "low" });
  scheduleBuildingInspection({ permitId: "p1", inspectorId: "i1" });
  assert.equal(inspectionStatus("p1"), "scheduled");
  assert.throws(() => issueBuildingPermit({ id: "p2", contractorId: "c2", riskLevel: "high" }), /clearance/i);
  recordLicensingClearance("c2");
  issueBuildingPermit({ id: "p2", contractorId: "c2", riskLevel: "high" });
});
