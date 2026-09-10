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

export function approvePurchaseRequest({ id }) {
  const request = getDraftPurchaseRequest(id, "approved");

  request.status = "approved";
  return request;
}

export function rejectPurchaseRequest({ id, reason }) {
  const request = getDraftPurchaseRequest(id, "rejected");

  request.status = "rejected";
  request.reason = reason;
  return request;
}

export function getPurchaseRequest(id) {
  return purchaseRequests.get(id);
}

function getDraftPurchaseRequest(id, outcome) {
  const request = purchaseRequests.get(id);
  if (!request) {
    throw new Error("purchase request not found");
  }
  if (request.status !== "draft") {
    throw new Error(`only draft purchase requests can be ${outcome}`);
  }

  return request;
}
