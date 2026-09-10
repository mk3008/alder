export class InMemoryLoanRepository {
  #items = new Map();

  save(loan) { this.#items.set(`${loan.bookId}:${loan.memberId}`, loan); }
  clear() { this.#items.clear(); }
}
