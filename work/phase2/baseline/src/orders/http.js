export function existingOrderResponse(order) {
  return { id: order.id, status: order.status };
}
