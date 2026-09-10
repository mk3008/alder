import { createLoan } from "../domain/createLoan.js";

export function checkoutBook(
  { bookId, memberId, now },
  { bookRepository, memberRepository, loanRepository },
) {
  const book = bookRepository.findById(bookId);
  if (!book || book.copies <= 0) {
    throw new Error("Book is unavailable");
  }

  const member = memberRepository.findById(memberId);
  if (!member || !member.active) {
    throw new Error("Member is inactive");
  }

  const loan = createLoan({ bookId, memberId, now });
  bookRepository.save({ ...book, copies: book.copies - 1 });
  loanRepository.save(loan);
  return loan;
}
