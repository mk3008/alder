const clearedVendors = new Set();

export function resetVendorTaxClearance() {
  clearedVendors.clear();
}

export function recordVendorTaxClearance(vendorId) {
  clearedVendors.add(vendorId);
}

export function hasCurrentVendorTaxClearance(vendorId) {
  return clearedVendors.has(vendorId);
}
