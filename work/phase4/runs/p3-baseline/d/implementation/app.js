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

  const purchaseRequest = { id, requesterId, amount, status: "draft" };
  purchaseRequests.set(id, purchaseRequest);
  return purchaseRequest;
}

function getDraftPurchaseRequest(id) {
  const purchaseRequest = purchaseRequests.get(id);
  if (!purchaseRequest || purchaseRequest.status !== "draft") {
    throw new Error("purchase request must be a draft");
  }

  return purchaseRequest;
}

export function approvePurchaseRequest({ id }) {
  const purchaseRequest = getDraftPurchaseRequest(id);
  purchaseRequest.status = "approved";
  return purchaseRequest;
}

export function rejectPurchaseRequest({ id, reason }) {
  const purchaseRequest = getDraftPurchaseRequest(id);
  purchaseRequest.status = "rejected";
  purchaseRequest.reason = reason;
  return purchaseRequest;
}

export function getPurchaseRequest(id) {
  return purchaseRequests.get(id);
}

export function submitExpenseClaim({ id, employeeId, amount, receiptCount }) {
  const expenseClaim = {
    id,
    employeeId,
    amount,
    receiptCount,
    status: "submitted",
  };
  expenseClaims.set(id, expenseClaim);
  return expenseClaim;
}

function getSubmittedExpenseClaim(id) {
  const expenseClaim = expenseClaims.get(id);
  if (!expenseClaim || expenseClaim.status !== "submitted") {
    throw new Error("expense claim must be submitted");
  }

  return expenseClaim;
}

export function approveExpenseClaim({ id }) {
  const expenseClaim = getSubmittedExpenseClaim(id);
  expenseClaim.status = "approved";
  return expenseClaim;
}

export function getExpenseClaim(id) {
  return expenseClaims.get(id);
}
