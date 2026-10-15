const products = new Map();

export function existingProduct(sku) { return products.get(sku); }
export function resetCatalog() { products.clear(); }

export function importCatalog(csv) {
  const rows = csv.split(/\r?\n/).slice(1);
  const errors = [];
  const seenSkus = new Set();
  const productsToImport = [];

  rows.forEach((row, index) => {
    if (row === "") return;

    const [sku, priceText] = row.split(",");
    const rowNumber = index + 2;
    if (seenSkus.has(sku)) errors.push({ row: rowNumber, message: "duplicate SKU" });
    seenSkus.add(sku);

    const price = Number(priceText);
    if (!Number.isInteger(price) || price <= 0) {
      errors.push({ row: rowNumber, message: "price must be a positive integer" });
      return;
    }
    productsToImport.push({ sku, price });
  });

  if (errors.length > 0) return { imported: 0, errors };

  for (const product of productsToImport) products.set(product.sku, product);
  return { imported: productsToImport.length, errors: [] };
}
