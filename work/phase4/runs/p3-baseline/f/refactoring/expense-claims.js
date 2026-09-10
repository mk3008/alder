import {
  releaseApprovedAmount,
  reserveApprovedAmount,
} from "./annual-budget.js";

const expenseClaims = new Map();

export function resetExpenseClaims() {
  expenseClaims.clear();
}

export function submitExpenseClaim({ id, employeeId, amount, receiptCount }) {
  const previousExpenseClaim = expenseClaims.get(id);
  if (previousExpenseClaim?.status === "approved") {
    releaseApprovedAmount(previousExpenseClaim.amount);
  }

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
  reserveApprovedAmount(expenseClaim.amount);
  expenseClaim.status = "approved";
  return expenseClaim;
}

export function getExpenseClaim(id) {
  return expenseClaims.get(id);
}

export function expenseApprovalMessage(id) {
  const expenseClaim = expenseClaims.get(id);
  if (!expenseClaim || expenseClaim.status !== "approved") {
    throw new Error("expense claim must be approved");
  }

  return `Expense ${id} for employee ${expenseClaim.employeeId} approved with ${expenseClaim.receiptCount} receipts`;
}
