// The loan query stays separate from commands so callers can observe state
// without participating in the return workflow.
export function getLoan(id, { loans }) {
  return loans.get(id);
}
