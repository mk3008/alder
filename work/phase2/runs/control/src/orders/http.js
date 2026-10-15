import { addStock, readOrder, saveOrder } from "./store.js";

export function existingOrderResponse(order) {
  return { id: order.id, status: order.status };
}

export function cancelOrder({ orderId, now }) {
  const order = readOrder(orderId);
  if (!order) throw new Error("order not found");

  const elapsed = now - order.placedAt;
  if (elapsed < 0 || elapsed > 30 * 60 * 1000) {
    throw new Error("cancellation window has closed");
  }
  if (order.status !== "placed") throw new Error("order cannot be cancelled");

  const cancelledOrder = { ...order, status: "cancelled" };
  saveOrder(cancelledOrder);
  addStock(cancelledOrder.sku, cancelledOrder.quantity);
  return existingOrderResponse(cancelledOrder);
}
