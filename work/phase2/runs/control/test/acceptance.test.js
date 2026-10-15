import test from "node:test";
import assert from "node:assert/strict";
import { issueInvoice, invoiceDetail, invoiceList, resetInvoices } from "../src/invoices/index.js";
import { refundSummary } from "../src/refunds/index.js";
import { importCatalog, existingProduct, resetCatalog } from "../src/catalog-import/index.js";
import { cancelOrder } from "../src/orders/http.js";
import { seedOrder, seedStock, readOrder, readStock, resetOrders } from "../src/orders/store.js";

test("P1: notes are private to invoice detail", () => {
  resetInvoices(); issueInvoice({ id: "n1", customer: "A", cents: 500, currency: "USD", note: "call first" });
  assert.equal(invoiceDetail("n1").note, "call first");
  assert.equal("note" in invoiceList()[0], false);
  assert.throws(() => issueInvoice({ id: "n2", customer: "B", cents: 1, currency: "USD", note: "x".repeat(281) }));
});
test("P2: refund summary reuses existing money behavior", () => {
  assert.equal(refundSummary([{ cents: 1234, currency: "USD" }]), "$12.34");
  assert.equal(refundSummary([{ cents: 1200, currency: "JPY" }]), "¥1,200");
});
test("P3: catalog import reports all errors and is atomic", () => {
  resetCatalog(); const bad = importCatalog("SKU,price\nA,10\nA,20\nB,no");
  assert.deepEqual(bad, { imported: 0, errors: [{ row: 3, message: "duplicate SKU" }, { row: 4, message: "price must be a positive integer" }] });
  assert.equal(existingProduct("A"), undefined);
  assert.deepEqual(importCatalog("SKU,price\nA,10"), { imported: 1, errors: [] });
  assert.deepEqual(existingProduct("A"), { sku: "A", price: 10 });
});
test("P4: cancellation respects the boundary and restores stock", () => {
  resetOrders(); seedStock("SKU", 2); seedOrder({ id: "o1", sku: "SKU", quantity: 3, placedAt: 1_000 });
  assert.deepEqual(cancelOrder({ orderId: "o1", now: 1_000 + 30 * 60 * 1000 }), { id: "o1", status: "cancelled" });
  assert.equal(readOrder("o1").status, "cancelled"); assert.equal(readStock("SKU"), 5);
  seedOrder({ id: "o2", sku: "SKU", quantity: 1, placedAt: 1_000 });
  assert.throws(() => cancelOrder({ orderId: "o2", now: 1_000 + 30 * 60 * 1000 + 1 }), /cancellation window/);
});
