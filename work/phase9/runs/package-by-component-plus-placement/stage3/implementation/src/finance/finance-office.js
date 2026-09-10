const taxClearedVendors = new Set();

export function resetFinanceOffice() {
  taxClearedVendors.clear();
}

export function recordVendorTaxClearance(vendorId) {
  if (!vendorId) throw new Error("vendor identity is required");
  taxClearedVendors.add(vendorId);
}

export function hasVendorTaxClearance(vendorId) {
  return taxClearedVendors.has(vendorId);
}
