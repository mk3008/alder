const products = new Map();

export function existingProduct(sku) { return products.get(sku); }
export function resetCatalog() { products.clear(); }
