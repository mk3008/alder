const expenseClaims = new Map();

export function resetExpenseClaims() {
  expenseClaims.clear();
}

export function submitExpenseClaim({ id, employeeId, amount, receiptCount }) {
  const claim = { id, employeeId, amount, receiptCount, status: "submitted" };
  expenseClaims.set(id, claim);
  return claim;
}

export function approveExpenseClaim({ id }) {
  const claim = expenseClaims.get(id);

  if (!claim || claim.status !== "submitted") {
    throw new Error("only submitted expense claims can be approved");
  }

  claim.status = "approved";
  return claim;
}

export function getExpenseClaim(id) {
  return expenseClaims.get(id);
}

export function expenseApprovalMessage(id) {
  const claim = expenseClaims.get(id);

  if (!claim || claim.status !== "approved") {
    throw new Error("only approved expense claims can have approval messages");
  }

  return `Expense ${claim.id} for employee ${claim.employeeId} approved with ${claim.receiptCount} receipts`;
}
