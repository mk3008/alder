export function createInMemoryLoanRepository(loans) {
  return {
    findById(id) { return loans.get(id); },
    findAll() { return [...loans.values()]; },
    save(loan) { loans.set(loan.id, loan); },
  };
}
