import test from "node:test";
import assert from "node:assert/strict";
import { reset, issueBuildingPermit, buildingPermitStatus, recordLicensingClearance } from "../src/municipal.js";
test("stage 1 enforces licensing clearance only for high-risk permit issuance", () => {
  reset();
  assert.throws(() => issueBuildingPermit({ id: "p1", contractorId: "c1", riskLevel: "high" }), /clearance/i);
  recordLicensingClearance("c1");
  issueBuildingPermit({ id: "p1", contractorId: "c1", riskLevel: "high" });
  assert.equal(buildingPermitStatus("p1"), "issued");
});
