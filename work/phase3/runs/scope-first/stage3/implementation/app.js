const books = new Map();
const members = new Map();
const loans = new Map();
let nextLoanId = 1;

export function reset() {
  books.clear();
  members.clear();
  loans.clear();
  nextLoanId = 1;
}
export function addBook({ id, copies }) { books.set(id, { id, copies }); }
export function addMember({ id, active = true }) { members.set(id, { id, active }); }

export function suspendMember({ memberId }) {
  const member = members.get(memberId);

  if (!member) {
    throw new Error("Member not found");
  }

  member.active = false;
  return { ...member };
}

export function checkout({ bookId, memberId, now }) {
  const book = books.get(bookId);
  const member = members.get(memberId);

  if (!book || book.copies <= 0) {
    throw new Error("Book is unavailable");
  }
  if (!member || !member.active) {
    throw new Error("Member is inactive");
  }

  book.copies -= 1;
  const loan = {
    id: `loan-${nextLoanId++}`,
    bookId,
    memberId,
    dueAt: now + 14 * 24 * 60 * 60 * 1000,
    status: "open",
  };
  loans.set(loan.id, loan);
  return { ...loan };
}

export function returnLoan({ loanId, now }) {
  const loan = loans.get(loanId);

  if (!loan || loan.status !== "open") {
    throw new Error("Loan is not open");
  }

  loan.status = "returned";
  loan.returnedAt = now;
  books.get(loan.bookId).copies += 1;
  return { ...loan };
}

export function getLoan(id) {
  const loan = loans.get(id);
  return loan && { ...loan };
}
