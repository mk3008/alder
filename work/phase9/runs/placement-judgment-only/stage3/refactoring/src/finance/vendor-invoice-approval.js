const taxClearedVendors = new Set();

export function recordVendorTaxClearance(vendorId) {
  taxClearedVendors.add(vendorId);
}

export function resetVendorTaxClearances() {
  taxClearedVendors.clear();
}

export function approveVendorInvoice(
  { id },
  loadInvoiceRecord,
  saveInvoiceRecord,
  deliverPaymentNotice,
) {
  const invoice = loadInvoiceRecord(id);
  if (invoice.status !== "submitted") throw new Error("invoice is not submitted");
  if (!taxClearedVendors.has(invoice.vendorId)) {
    throw new Error("vendor tax clearance is required");
  }
  saveInvoiceRecord({ ...invoice, status: "approved" });
  deliverPaymentNotice(invoice.id);
}
