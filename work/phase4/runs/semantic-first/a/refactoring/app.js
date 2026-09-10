const purchaseRequests = new Map();

export function reset() { purchaseRequests.clear(); }

export function submitPurchaseRequest({ id, requesterId, amount }) {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error("amount must be a positive integer");
  }

  const request = { id, requesterId, amount, status: "draft" };
  purchaseRequests.set(id, request);
  return request;
}
