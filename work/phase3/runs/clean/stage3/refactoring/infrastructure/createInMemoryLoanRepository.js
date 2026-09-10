export function createInMemoryLoanRepository(loans) {
  return {
    findById(id) { return loans.get(id); },
    save(loan) { loans.set(loan.id, loan); },
  };
}
