export class ListOverdueLoans {
  constructor({ loans }) {
    this.loans = loans;
  }

  execute({ now }) {
    return this.loans.findOverdueAt(now).map((loan) => ({
      loanId: loan.id,
      bookId: loan.bookId,
      memberId: loan.memberId,
    }));
  }
}
