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
