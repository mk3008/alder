const purchaseRequests = new Map();
const expenseClaims = new Map();

export function reset() { purchaseRequests.clear(); expenseClaims.clear(); }

export function submitPurchaseRequest({ id, requesterId, amount }) {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error("amount must be a positive integer");
  }

  const purchaseRequest = { id, requesterId, amount, status: "draft" };
  purchaseRequests.set(id, purchaseRequest);
  return purchaseRequest;
}
