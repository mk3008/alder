const LOAN_DURATION_MS = 14 * 24 * 60 * 60 * 1000;

// This slice owns the checkout business rule; the app supplies its in-memory
// catalog and member registry at the boundary.
export function checkout({ bookId, memberId, now }, { books, members, loans, createLoanId }) {
  const book = books.get(bookId);
  if (!book || book.copies <= 0) {
    throw new Error("Book is unavailable");
  }

  const member = members.get(memberId);
  if (!member || !member.active) {
    throw new Error("Member is inactive");
  }

  book.copies -= 1;
  const loan = {
    id: createLoanId(),
    bookId,
    memberId,
    dueAt: now + LOAN_DURATION_MS,
    status: "open",
  };
  loans.set(loan.id, loan);
  return loan;
}
