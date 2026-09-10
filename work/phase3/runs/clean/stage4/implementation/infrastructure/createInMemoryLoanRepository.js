export function createInMemoryLoanRepository(loans) {
  return {
    findById(id) { return loans.get(id); },
    findOpenDueBefore(now) {
      return [...loans.values()].filter(
        (loan) => loan.status === "open" && loan.dueAt < now,
      );
    },
    save(loan) { loans.set(loan.id, loan); },
  };
}
