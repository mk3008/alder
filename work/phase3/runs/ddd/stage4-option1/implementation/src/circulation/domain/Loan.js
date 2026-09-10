const LOAN_PERIOD_MS = 14 * 24 * 60 * 60 * 1000;

export class Loan {
  constructor({ id, bookId, memberId, now }) {
    this.id = id;
    this.bookId = bookId;
    this.memberId = memberId;
    this.dueAt = now + LOAN_PERIOD_MS;
    this.status = "open";
    this.returnedAt = undefined;
  }

  returnAt(now) {
    if (this.status !== "open") throw new Error("Loan has already been returned");

    this.status = "returned";
    this.returnedAt = now;
  }

  isOverdueAt(now) {
    return this.status === "open" && this.dueAt < now;
  }
}
