export function listOverdueLoans({ now }, { loanRepository }) {
  return loanRepository.findOpenDueBefore(now).map(({ id, bookId, memberId }) => ({
    loanId: id,
    bookId,
    memberId,
  }));
}
