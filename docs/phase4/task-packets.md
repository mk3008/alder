# Frozen Phase 4 Business Packets

Common implementation prompt: work only in the assigned run directory; implement the current business behavior; preserve prior behavior; do not edit frozen tests or research documents; run `npm test`; report changed files and verification. No arm gets any additional hint.

| Stage | Requirement and structural pressure |
| --- | --- |
| A | `submitPurchaseRequest({id, requesterId, amount})` creates a `draft` procurement request. A positive integer amount is required. It is intentionally small and locally satisfiable. |
| B | `approvePurchaseRequest({id})` adds a sibling procurement workflow and changes a draft request to `approved`. |
| C | `rejectPurchaseRequest({id, reason})` rejects only drafts and `getPurchaseRequest(id)` returns current state. Approval and rejection now require the same procurement lifecycle contract; nothing requires that contract outside procurement. |
| D | Add a separate expense workflow: `submitExpenseClaim({id, employeeId, amount})`, `approveExpenseClaim({id})`, and `getExpenseClaim(id)`. Expense claims have their own `submitted`/`approved` lifecycle. |
| E | Add `purchaseApprovalMessage(id)` and `expenseApprovalMessage(id)`. Both produce text after approval, but purchase messages identify requester and expense messages identify employee and receipt count; their business contracts differ. |
| F | Add `setAnnualBudget(limit)` and make both approval workflows reject an approval that would make the combined approved purchase-plus-expense amount exceed the limit. This is one business invariant across both areas. No representation is required. |

Tests assert observable behavior only and never assert folders, classes, modules, layers, or shared locations.
