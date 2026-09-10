export class InMemoryLoanRepository {
  #items = new Map();
  #nextId = 1;

  nextId() { return `loan-${this.#nextId++}`; }
  findById(id) { return this.#items.get(id); }
  findOverdueAt(now) { return [...this.#items.values()].filter((loan) => loan.isOverdueAt(now)); }
  save(loan) { this.#items.set(loan.id, loan); }
  clear() { this.#items.clear(); this.#nextId = 1; }
}
