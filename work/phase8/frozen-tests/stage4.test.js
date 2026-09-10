import test from "node:test";
import assert from "node:assert/strict";
import { reset, setCityEmergencyHold, issueBuildingPermit, submitVendorInvoice, approveVendorInvoice, recordVendorTaxClearance } from "../src/municipal.js";
test("stage 4 applies City Operations emergency hold across Licensing and Finance decisions", () => {
  reset();
  setCityEmergencyHold(true);
  assert.throws(() => issueBuildingPermit({ id: "p1", contractorId: "c1", riskLevel: "low" }), /emergency hold/i);
  submitVendorInvoice({ id: "v1", vendorId: "vendor-1", amount: 10 });
  recordVendorTaxClearance("vendor-1");
  assert.throws(() => approveVendorInvoice({ id: "v1" }), /emergency hold/i);
});
