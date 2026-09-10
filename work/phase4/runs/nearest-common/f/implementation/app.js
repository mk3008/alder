const purchaseRequests = new Map();
const expenseClaims = new Map();
let annualBudget;

export function reset() {
  purchaseRequests.clear();
  expenseClaims.clear();
  annualBudget = undefined;
}

export function setAnnualBudget(amount) {
  if (!Number.isInteger(amount) || amount < 0) {
    throw new Error("annual budget must be a non-negative integer");
  }

  annualBudget = amount;
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

  ensureWithinAnnualBudget(request.amount);
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

export function purchaseApprovalMessage(id) {
  const request = purchaseRequests.get(id);
  if (!request) {
    throw new Error("purchase request not found");
  }
  if (request.status !== "approved") {
    throw new Error("purchase request must be approved");
  }

  return `Purchase ${id} for requester ${request.requesterId} approved`;
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

  ensureWithinAnnualBudget(claim.amount);
  claim.status = "approved";
  return claim;
}

export function getExpenseClaim(id) {
  return expenseClaims.get(id);
}

export function expenseApprovalMessage(id) {
  const claim = expenseClaims.get(id);
  if (!claim) {
    throw new Error("expense claim not found");
  }
  if (claim.status !== "approved") {
    throw new Error("expense claim must be approved");
  }

  return `Expense ${id} for employee ${claim.employeeId} approved with ${claim.receiptCount} receipts`;
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

function ensureWithinAnnualBudget(amount) {
  if (annualBudget === undefined) {
    return;
  }

  if (getApprovedAmount() + amount > annualBudget) {
    throw new Error("annual budget exceeded");
  }
}

function getApprovedAmount() {
  let total = 0;

  for (const request of purchaseRequests.values()) {
    if (request.status === "approved") {
      total += request.amount;
    }
  }

  for (const claim of expenseClaims.values()) {
    if (claim.status === "approved") {
      total += claim.amount;
    }
  }

  return total;
}
