const LOAN_PERIOD_MS = 14 * 24 * 60 * 60 * 1000;

export class Loan {
  constructor({ bookId, memberId, now }) {
    this.bookId = bookId;
    this.memberId = memberId;
    this.dueAt = now + LOAN_PERIOD_MS;
  }
}
