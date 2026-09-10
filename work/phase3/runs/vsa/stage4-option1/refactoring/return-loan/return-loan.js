// This slice owns the rule that only an open loan can be returned.
export function returnLoan({ loanId, now }, { books, loans }) {
  const loan = loans.get(loanId);
  if (!loan || loan.status !== "open") {
    throw new Error("Loan is not open");
  }

  const book = books.get(loan.bookId);
  if (!book) {
    throw new Error("Book is unavailable");
  }

  book.copies += 1;
  loan.status = "returned";
  loan.returnedAt = now;
  return loan;
}
