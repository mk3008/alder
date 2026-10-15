const products = new Map();

export function existingProduct(sku) { return products.get(sku); }
export function resetCatalog() { products.clear(); }

export function importCatalog(csv) {
  const rows = csv.split(/\r?\n/);
  const errors = [];
  const seenSkus = new Set();
  const imports = [];

  for (let index = 1; index < rows.length; index += 1) {
    if (rows[index] === "") continue;
    const [sku, priceText] = rows[index].split(",");
    const row = index + 1;
    const price = Number(priceText);

    if (seenSkus.has(sku)) errors.push({ row, message: "duplicate SKU" });
    else seenSkus.add(sku);

    if (!Number.isInteger(price) || price <= 0) {
      errors.push({ row, message: "price must be a positive integer" });
    }
    imports.push({ sku, price });
  }

  if (errors.length > 0) return { imported: 0, errors };
  for (const product of imports) products.set(product.sku, product);
  return { imported: imports.length, errors: [] };
}
