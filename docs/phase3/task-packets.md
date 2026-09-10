# Frozen Business Task Packets

Common implementation prompt: “Work only in the assigned run directory. Implement the current business requirement. Preserve all prior behavior. Do not edit acceptance tests or task records. Run `npm test`; return changed files, the test output, and a concise explanation of every new or wider-visible component.”

| Stage | Business requirement |
| --- | --- |
| 1 — checkout | Add `checkout({ bookId, memberId, now })`. A book with available copies can be loaned to an active member; it receives a 14-day due timestamp. Reject unavailable books and inactive members. This is intentionally small. |
| 2 — return | Add `returnLoan({ loanId, now })`. It returns an open loan, restores one book copy, and rejects a repeated return. Add a query that returns a loan’s current state. This adds a sibling workflow in the same business area. |
| 3 — membership constraint | Add `suspendMember({ memberId })`. A suspended member may not check out, including after a previously returned loan. The checkout/return/member state must remain consistent across the workflows. No particular domain representation is required. |
| 4 — circulation alert | Add `listOverdue({ now })`, returning open loans whose due timestamp is before `now`, with member and book identifiers. This adds a distinct circulation-alert capability over the existing lending state. |

Acceptance test files are frozen separately in `work/phase3/frozen-tests`. They verify behavior only.
