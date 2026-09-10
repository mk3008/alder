const taxClearedVendors = new Set();

export function recordVendorTaxClearance(vendorId) {
  taxClearedVendors.add(vendorId);
}

export function hasVendorTaxClearance(vendorId) {
  return taxClearedVendors.has(vendorId);
}

export function resetVendorTaxClearances() {
  taxClearedVendors.clear();
}
