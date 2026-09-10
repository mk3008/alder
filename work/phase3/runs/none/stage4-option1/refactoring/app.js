const books = new Map();
const members = new Map();
const loans = new Map();
const LOAN_PERIOD_MS = 14 * 24 * 60 * 60 * 1000;
const OPEN = "open";
const RETURNED = "returned";
let nextLoanId = 1;

function copyLoan(loan) {
  return { ...loan };
}

function createLoan({ bookId, memberId, now }) {
  return {
    id: `loan-${nextLoanId++}`,
    bookId,
    memberId,
    dueAt: now + LOAN_PERIOD_MS,
    status: OPEN,
  };
}

function isOpenOverdue(loan, now) {
  return loan.status === OPEN && loan.dueAt < now;
}

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
}

export function checkout({ bookId, memberId, now }) {
  const book = books.get(bookId);
  if (!book || book.copies <= 0) {
    throw new Error("Book is unavailable");
  }

  const member = members.get(memberId);
  if (!member || !member.active) {
    throw new Error("Member is inactive");
  }

  book.copies -= 1;
  const loan = createLoan({ bookId, memberId, now });
  loans.set(loan.id, loan);
  return copyLoan(loan);
}

export function returnLoan({ loanId, now }) {
  const loan = loans.get(loanId);
  if (!loan) {
    throw new Error("Loan not found");
  }
  if (loan.status !== OPEN) {
    throw new Error("Loan has already been returned");
  }

  loan.status = RETURNED;
  loan.returnedAt = now;
  books.get(loan.bookId).copies += 1;
  return copyLoan(loan);
}

export function getLoan(id) {
  const loan = loans.get(id);
  return loan && copyLoan(loan);
}

export function listOverdue({ now }) {
  return [...loans.values()]
    .filter((loan) => isOpenOverdue(loan, now))
    .map(({ id: loanId, bookId, memberId }) => ({ loanId, bookId, memberId }));
}
