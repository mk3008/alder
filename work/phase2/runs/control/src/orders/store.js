const orders = new Map();
const stock = new Map();

export function seedOrder(order) { orders.set(order.id, { ...order, status: "placed" }); }
export function seedStock(sku, count) { stock.set(sku, count); }
export function readOrder(id) { return orders.get(id); }
export function saveOrder(order) { orders.set(order.id, order); }
export function addStock(sku, count) { stock.set(sku, (stock.get(sku) ?? 0) + count); }
export function readStock(sku) { return stock.get(sku) ?? 0; }
export function resetOrders() { orders.clear(); stock.clear(); }
