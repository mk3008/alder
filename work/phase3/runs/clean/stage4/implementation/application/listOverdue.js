export function listOverdue({ now }, { loanRepository }) {
  return loanRepository.findOpenDueBefore(now).map((loan) => ({
    loanId: loan.id,
    bookId: loan.bookId,
    memberId: loan.memberId,
  }));
}
