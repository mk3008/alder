const LOAN_PERIOD_MS = 14 * 24 * 60 * 60 * 1000;

export function createLoan({ bookId, memberId, now }) {
  return { bookId, memberId, dueAt: now + LOAN_PERIOD_MS };
}
