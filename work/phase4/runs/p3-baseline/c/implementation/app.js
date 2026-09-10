const purchaseRequests = new Map();

export function reset() { purchaseRequests.clear(); }

export function submitPurchaseRequest({ id, requesterId, amount }) {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error("amount must be a positive integer");
  }

  const purchaseRequest = { id, requesterId, amount, status: "draft" };
  purchaseRequests.set(id, purchaseRequest);
  return purchaseRequest;
}

export function approvePurchaseRequest({ id }) {
  const purchaseRequest = purchaseRequests.get(id);
  if (!purchaseRequest || purchaseRequest.status !== "draft") {
    throw new Error("purchase request must be a draft");
  }

  purchaseRequest.status = "approved";
  return purchaseRequest;
}

export function rejectPurchaseRequest({ id, reason }) {
  const purchaseRequest = purchaseRequests.get(id);
  if (!purchaseRequest || purchaseRequest.status !== "draft") {
    throw new Error("purchase request must be a draft");
  }

  purchaseRequest.status = "rejected";
  purchaseRequest.reason = reason;
  return purchaseRequest;
}

export function getPurchaseRequest(id) {
  return purchaseRequests.get(id);
}
