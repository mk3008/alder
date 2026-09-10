const clearedVendors = new Set();

export function recordVendorTaxClearance(vendorId) {
  if (!vendorId) throw new Error("vendor is required");
  clearedVendors.add(vendorId);
}

export function hasCurrentVendorTaxClearance(vendorId) {
  return clearedVendors.has(vendorId);
}

export function resetVendorTaxClearances() {
  clearedVendors.clear();
}
