import test from "node:test";
import assert from "node:assert/strict";
import { issueInvoice, invoiceDetail, invoiceList, resetInvoices } from "../src/invoices/index.js";
import { existingRefundLabel } from "../src/refunds/index.js";
import { existingOrderResponse } from "../src/orders/http.js";

test("existing invoice behavior", () => {
  resetInvoices(); issueInvoice({ id: "i1", customer: "A", cents: 500, currency: "USD" });
  assert.equal(invoiceDetail("i1").customer, "A");
  assert.deepEqual(invoiceList(), [{ id: "i1", customer: "A", cents: 500, currency: "USD" }]);
});
test("existing shared money contract", () => assert.equal(existingRefundLabel({ cents: 1234, currency: "USD" }), "Refund $12.34"));
test("existing response", () => assert.deepEqual(existingOrderResponse({ id: "o1", status: "placed" }), { id: "o1", status: "placed" }));
