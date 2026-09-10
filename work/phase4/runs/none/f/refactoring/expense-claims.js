import { approveWithinAnnualBudget } from "./annual-budget.js";

const expenseClaims = new Map();

export function resetExpenseClaims() {
  expenseClaims.clear();
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

  approveWithinAnnualBudget(expenseClaim.amount);
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

function getSubmittedExpenseClaim(id) {
  return requireExpenseClaim(
    id,
    "submitted",
    "only submitted expense claims can be approved",
  );
}

function getApprovedExpenseClaim(id) {
  return requireExpenseClaim(
    id,
    "approved",
    "only approved expense claims can have approval messages",
  );
}

function requireExpenseClaim(id, status, statusError) {
  const expenseClaim = getExpenseClaim(id);

  if (!expenseClaim) {
    throw new Error("expense claim not found");
  }

  if (expenseClaim.status !== status) {
    throw new Error(statusError);
  }

  return expenseClaim;
}
