// This query slice exposes only outstanding loans that are past their due date.
export function listOverdue({ now }, { loans }) {
  return Array.from(loans.values(), (loan) => loan)
    .filter((loan) => loan.status === "open" && loan.dueAt < now)
    .map(({ id, bookId, memberId }) => ({ loanId: id, bookId, memberId }));
}
