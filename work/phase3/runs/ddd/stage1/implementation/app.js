const books = new Map();
const members = new Map();
const loans = new Map();

const LOAN_PERIOD_MS = 14 * 24 * 60 * 60 * 1000;

class Book {
  constructor({ id, copies }) {
    this.id = id;
    this.copies = copies;
  }

  loanOneCopy() {
    if (this.copies <= 0) {
      throw new Error("Book is unavailable");
    }
    this.copies -= 1;
  }
}

class Member {
  constructor({ id, active }) {
    this.id = id;
    this.active = active;
  }

  ensureActive() {
    if (!this.active) {
      throw new Error("Member is inactive");
    }
  }
}

class Loan {
  constructor({ bookId, memberId, now }) {
    this.bookId = bookId;
    this.memberId = memberId;
    this.dueAt = now + LOAN_PERIOD_MS;
  }
}

export function reset() { books.clear(); members.clear(); loans.clear(); }
export function addBook({ id, copies }) { books.set(id, new Book({ id, copies })); }
export function addMember({ id, active = true }) { members.set(id, new Member({ id, active })); }

export function checkout({ bookId, memberId, now }) {
  const book = books.get(bookId);
  const member = members.get(memberId);

  if (!book) {
    throw new Error("Book not found");
  }
  if (!member) {
    throw new Error("Member not found");
  }

  member.ensureActive();
  book.loanOneCopy();

  const loan = new Loan({ bookId, memberId, now });
  loans.set(`${bookId}:${memberId}`, loan);
  return loan;
}
