# Current accepted Business Rules — Stage 4

Use all Stage 3 rules in `stage3-current-accepted-rules-v3.md`, plus this active rule. No Stage 5+ material is included.

13. Sales may effectively revise lines of an approved, unconfirmed Order. Revision atomically replaces permitted content, recomputes exact rounded total, removes the current approval, and sets `pending_approval` when total is at least 1000.00 or `draft` below it. Approval is content-specific, so equal total does not preserve it. Creator/manager separation applies to reapproval. Revision never changes the source Quotation or Quotation Lines. No approval history/version data is required.
