// This query slice exposes only the information needed to follow up on
// currently open loans whose due timestamp has already passed.
export function listOverdue({ now }, { loans }) {
  return [...loans.values()]
    .filter((loan) => loan.status === "open" && loan.dueAt < now)
    .map(({ id: loanId, bookId, memberId }) => ({ loanId, bookId, memberId }));
}
