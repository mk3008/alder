import { hasVendorTaxClearance, resetFinanceOffice } from "./finance-office.js";

const invoices = new Map();

export function resetFinance() {
  invoices.clear();
  resetFinanceOffice();
}

export function submitVendorInvoice({ id, vendorId, amount }) {
  if (!id || !vendorId || amount <= 0) throw new Error("valid invoice is required");
  saveInvoiceRecord({ id, vendorId, amount, status: "submitted" });
}

export function approveVendorInvoice({ id }) {
  const invoice = loadInvoiceRecord(id);
  if (invoice.status !== "submitted") throw new Error("invoice is not submitted");
  if (!hasVendorTaxClearance(invoice.vendorId)) {
    throw new Error("vendor lacks current Finance tax clearance");
  }
  saveInvoiceRecord({ ...invoice, status: "approved" });
  deliverPaymentNotice(invoice.id);
}

export function vendorInvoiceStatus(id) {
  return loadInvoiceRecord(id).status;
}

export { recordVendorTaxClearance } from "./finance-office.js";

function loadInvoiceRecord(id) {
  const invoice = invoices.get(id);
  if (!invoice) throw new Error("unknown invoice");
  return invoice;
}

function saveInvoiceRecord(invoice) { invoices.set(invoice.id, invoice); }
function deliverPaymentNotice() {}
