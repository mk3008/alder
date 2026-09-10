import { createLoan } from "../domain/createLoan.js";

export function checkoutBook({ bookId, memberId, now }, { bookRepository, memberRepository }) {
  const book = bookRepository.findById(bookId);
  if (!book || book.copies <= 0) {
    throw new Error("Book is unavailable");
  }

  const member = memberRepository.findById(memberId);
  if (!member || !member.active) {
    throw new Error("Member is inactive");
  }

  bookRepository.save({ ...book, copies: book.copies - 1 });
  return createLoan({ bookId, memberId, now });
}
