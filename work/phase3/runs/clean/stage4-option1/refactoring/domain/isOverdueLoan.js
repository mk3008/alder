export function isOverdueLoan(loan, now) {
  return loan.status === "open" && loan.dueAt < now;
}
