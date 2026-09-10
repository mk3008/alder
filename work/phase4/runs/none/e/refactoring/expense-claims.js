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
  const expenseClaim = getExpenseClaim(id);

  if (!expenseClaim) {
    throw new Error("expense claim not found");
  }

  if (expenseClaim.status !== "submitted") {
    throw new Error("only submitted expense claims can be approved");
  }

  return expenseClaim;
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
