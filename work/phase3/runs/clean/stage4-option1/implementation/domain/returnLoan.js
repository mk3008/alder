export function returnLoan(loan, now) {
  if (!loan || loan.status !== "open") {
    throw new Error("Loan cannot be returned");
  }

  return { ...loan, status: "returned", returnedAt: now };
}
