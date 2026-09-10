import test from "node:test";
import assert from "node:assert/strict";
import { reset, submitVendorInvoice, approveVendorInvoice, vendorInvoiceStatus, recordVendorTaxClearance } from "../src/municipal.js";
test("stage 3 keeps Finance tax clearance distinct from Licensing clearance", () => {
  reset();
  submitVendorInvoice({ id: "v1", vendorId: "vendor-1", amount: 10 });
  assert.throws(() => approveVendorInvoice({ id: "v1" }), /tax clearance/i);
  recordVendorTaxClearance("vendor-1");
  approveVendorInvoice({ id: "v1" });
  assert.equal(vendorInvoiceStatus("v1"), "approved");
});
