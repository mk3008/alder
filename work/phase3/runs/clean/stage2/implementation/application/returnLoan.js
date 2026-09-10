export function returnLoan({ loanId, now }, { bookRepository, loanRepository }) {
  const loan = loanRepository.findById(loanId);
  if (!loan || loan.status !== "open") {
    throw new Error("Loan cannot be returned");
  }

  const book = bookRepository.findById(loan.bookId);
  if (!book) {
    throw new Error("Book not found");
  }

  const returnedLoan = { ...loan, status: "returned", returnedAt: now };
  bookRepository.save({ ...book, copies: book.copies + 1 });
  loanRepository.save(returnedLoan);
  return returnedLoan;
}
