import { addStock, readOrder, saveOrder } from "./store.js";

export function existingOrderResponse(order) {
  return { id: order.id, status: order.status };
}

const CANCELLATION_WINDOW_MS = 30 * 60 * 1000;

export function cancelOrder({ orderId, now }) {
  const order = readOrder(orderId);
  if (!order) throw new Error("order not found");
  if (order.status !== "placed") throw new Error("order cannot be cancelled");
  if (now - order.placedAt > CANCELLATION_WINDOW_MS) {
    throw new Error("cancellation window has expired");
  }

  const cancelledOrder = { ...order, status: "cancelled" };
  saveOrder(cancelledOrder);
  addStock(order.sku, order.quantity);
  return existingOrderResponse(cancelledOrder);
}
