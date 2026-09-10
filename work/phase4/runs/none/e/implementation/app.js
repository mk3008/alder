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

export function approvePurchaseRequest({ id }) {
  const purchaseRequest = getDraftPurchaseRequest(id, "approved");

  purchaseRequest.status = "approved";
  return purchaseRequest;
}

export function rejectPurchaseRequest({ id, reason }) {
  const purchaseRequest = getDraftPurchaseRequest(id, "rejected");

  purchaseRequest.status = "rejected";
  purchaseRequest.reason = reason;
  return purchaseRequest;
}

export function getPurchaseRequest(id) {
  return purchaseRequests.get(id);
}

export function purchaseApprovalMessage(id) {
  const purchaseRequest = getApprovedPurchaseRequest(id);

  return `Purchase ${purchaseRequest.id} for requester ${purchaseRequest.requesterId} approved`;
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

export function approveExpenseClaim({ id }) {
  const expenseClaim = getSubmittedExpenseClaim(id);

  expenseClaim.status = "approved";
  return expenseClaim;
}

export function getExpenseClaim(id) {
  return expenseClaims.get(id);
}

export function expenseApprovalMessage(id) {
  const expenseClaim = getApprovedExpenseClaim(id);

  return `Expense ${expenseClaim.id} for employee ${expenseClaim.employeeId} approved with ${expenseClaim.receiptCount} receipts`;
}

function getDraftPurchaseRequest(id, action) {
  const purchaseRequest = getPurchaseRequest(id);

  if (!purchaseRequest) {
    throw new Error("purchase request not found");
  }

  if (purchaseRequest.status !== "draft") {
    throw new Error(`only draft purchase requests can be ${action}`);
  }

  return purchaseRequest;
}

function getSubmittedExpenseClaim(id) {
  const expenseClaim = getExpenseClaim(id);

  if (!expenseClaim) {
    throw new Error("expense claim not found");
  }

  if (expenseClaim.status !== "submitted") {
    throw new Error("only submitted expense claims can be approved");
  }

  return expenseClaim;
}

function getApprovedPurchaseRequest(id) {
  const purchaseRequest = getPurchaseRequest(id);

  if (!purchaseRequest) {
    throw new Error("purchase request not found");
  }

  if (purchaseRequest.status !== "approved") {
    throw new Error("only approved purchase requests can have approval messages");
  }

  return purchaseRequest;
}

function getApprovedExpenseClaim(id) {
  const expenseClaim = getExpenseClaim(id);

  if (!expenseClaim) {
    throw new Error("expense claim not found");
  }

  if (expenseClaim.status !== "approved") {
    throw new Error("only approved expense claims can have approval messages");
  }

  return expenseClaim;
}
