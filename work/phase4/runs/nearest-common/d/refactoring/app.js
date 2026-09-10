const purchaseRequests = new Map();
const expenseClaims = new Map();

export function reset() {
  purchaseRequests.clear();
  expenseClaims.clear();
}

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

export function submitExpenseClaim({ id, employeeId, amount, receiptCount }) {
  const claim = { id, employeeId, amount, receiptCount, status: "submitted" };
  expenseClaims.set(id, claim);
  return claim;
}

export function approveExpenseClaim({ id }) {
  const claim = expenseClaims.get(id);
  if (!claim) {
    throw new Error("expense claim not found");
  }
  if (claim.status !== "submitted") {
    throw new Error("only submitted expense claims can be approved");
  }

  claim.status = "approved";
  return claim;
}

export function getExpenseClaim(id) {
  return expenseClaims.get(id);
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
