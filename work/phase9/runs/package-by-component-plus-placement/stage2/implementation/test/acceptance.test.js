import test from "node:test";
import assert from "node:assert/strict";
import { reset, issueBuildingPermit, scheduleBuildingInspection, inspectionStatus, recordLicensingClearance } from "../src/municipal.js";
test("stage 2 applies the same Licensing Board clearance authority to high-risk inspections", () => {
  reset();
  issueBuildingPermit({ id: "p1", contractorId: "c1", riskLevel: "low" });
  assert.throws(() => scheduleBuildingInspection({ permitId: "p1", inspectorId: "i1" }), /clearance/i);
  recordLicensingClearance("c1");
  scheduleBuildingInspection({ permitId: "p1", inspectorId: "i1" });
  assert.equal(inspectionStatus("p1"), "scheduled");
});
