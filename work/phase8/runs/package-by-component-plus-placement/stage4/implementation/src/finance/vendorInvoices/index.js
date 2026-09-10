import {
  hasCurrentVendorTaxClearance,
  resetVendorTaxClearance,
} from "./vendorTaxClearance.js";
import { assertCityEmergencyHoldAllows } from "../../cityOperations/emergencyHold.js";

const invoices = new Map();

export function reset() {
  invoices.clear();
  resetVendorTaxClearance();
}

export function submitVendorInvoice({ id, vendorId, amount }) {
  if (!id || !vendorId || amount <= 0) throw new Error("valid invoice is required");
  saveInvoiceRecord({ id, vendorId, amount, status: "submitted" });
}

export function approveVendorInvoice({ id }) {
  assertCityEmergencyHoldAllows("vendor invoice approval");
  const invoice = loadInvoiceRecord(id);
  if (invoice.status !== "submitted") throw new Error("invoice is not submitted");
  if (!hasCurrentVendorTaxClearance(invoice.vendorId)) {
    throw new Error("vendor tax clearance is required for invoice approval");
  }
  saveInvoiceRecord({ ...invoice, status: "approved" });
  deliverPaymentNotice(invoice.id);
}

export function vendorInvoiceStatus(id) {
  return loadInvoiceRecord(id).status;
}

function loadInvoiceRecord(id) {
  const invoice = invoices.get(id);
  if (!invoice) throw new Error("unknown invoice");
  return invoice;
}

function saveInvoiceRecord(invoice) { invoices.set(invoice.id, invoice); }
function deliverPaymentNotice() {}
