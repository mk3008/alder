import { isOverdueLoan } from "../domain/isOverdueLoan.js";

export function listOverdueLoans({ now }, { loanRepository }) {
  return loanRepository
    .findAll()
    .filter((loan) => isOverdueLoan(loan, now))
    .map(({ id, bookId, memberId }) => ({ loanId: id, bookId, memberId }));
}
