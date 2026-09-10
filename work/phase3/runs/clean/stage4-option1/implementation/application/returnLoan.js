import { returnLoan as returnLoanEntity } from "../domain/returnLoan.js";

export function returnLoan({ loanId, now }, { bookRepository, loanRepository }) {
  const loan = loanRepository.findById(loanId);
  const returnedLoan = returnLoanEntity(loan, now);
  const book = bookRepository.findById(loan.bookId);
  if (!book) {
    throw new Error("Book not found");
  }

  bookRepository.save({ ...book, copies: book.copies + 1 });
  loanRepository.save(returnedLoan);
  return returnedLoan;
}
