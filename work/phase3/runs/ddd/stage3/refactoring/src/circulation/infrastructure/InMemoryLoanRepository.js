export class InMemoryLoanRepository {
  #items = new Map();
  #nextId = 1;

  nextId() { return `loan-${this.#nextId++}`; }
  findById(id) { return this.#items.get(id); }
  save(loan) { this.#items.set(loan.id, loan); }
  clear() { this.#items.clear(); this.#nextId = 1; }
}
