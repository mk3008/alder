# Availability, booking, and receipt review

Reviewed the supplied working-tree scope using Alder review knowledge v0.3, Q1–Q3 through P1/P2 and S. Business Design and accepted decisions precede implementation as authority. No implementation, context, decisions, or existing tests were modified.

## Definite mismatch: required booking facts are omitted

**Evidence:** Business Design Activity 2 requires utilization purpose as input and recording the booking registration time; Business Data also lists both. `src/service.mjs` `reserve(roomId, start, end, actor)` has no purpose input, accepts a booking without it, and stores only `{ id, roomId, start, end, actor, state }`. `clock()` checks admission but its value is not retained. Neither omission is waived by `decisions/accepted.md`. The existing test establishes a reservation without purpose and does not inspect registration time.

**Concrete effect:** A caller can successfully register a booking while bypassing a mandatory business input. The stored booking returned to subsequent work cannot communicate the intended use or when registration occurred; the required Activity 2 output is incomplete. The room-name receipt itself does not require these facts, so this is a booking finding rather than a demand to enlarge the receipt.

**Classification:** Definite mismatch (Q1/Q3, traced back through P2).

**Minimal decision / owner:** No new business decision is needed to implement the stated requirements. The booking implementation owner should capture the required purpose and registration time. If omission is intentional, the product owner must explicitly revise the Business Design; the test and fixture scope alone are not approval. No particular field naming, UI, or architecture is prescribed.

## Sufficient behavior

| Reviewed behavior | Evidence and business effect | Classification / decision |
| --- | --- | --- |
| Availability and booking time differ | `available` checks interval order, room state, and overlap; `reserve` additionally requires a future start. The product owner explicitly defines availability as a query-time state/overlap match, with no past-interval admission promise. | Sufficient under the accepted output meaning; no confirmation or future-only search change needed. |
| Overlap and adjacency | `overlaps` uses strict endpoint comparisons and only `reserved` bookings. Reservation checks and insertion execute synchronously without a yield in the accepted in-process Map environment. A conflicting second call is rejected; an adjacent interval remains available. | Sufficient for the supplied environment; no demand for a database or distributed locking. |
| Actor and reservation identity | Trusted actor is stored; generated ID retrieves a copied stored booking. Authentication has an accepted external owner. | Sufficient at this boundary; no new identity decision. |
| Receipt identity and current name | `src/receipt.mjs` looks up the stored booking, rebuilds the mirror from `service.rooms()`, and returns its room's current name with the requested stored ID. Rename probe returns the new name. | Sufficient for the explicitly accepted receipt semantics; no historical-name requirement. |
| Receipt failure and continuation | File-system errors propagate after lookup, without mutating bookings. A forced directory failure preserved the original booking; retry with the retained ID succeeded. Caller retention of the ID and absence of a stronger delivery guarantee are explicit accepted conditions. | Sufficient under that external responsibility; no fallback, recovery service, or idempotency demand. |
| Disk mirror support burden | Operations estimates four additional staff-hours/month versus direct local lookup. Accepted decisions explicitly acknowledge and accept that cost for the serialization exercise and intentional rebuild behavior. | Settled feasible means choice, not an unresolved Business confirmation or requested technical change. No new contrary evidence was found. |

Other Activities and room administration were not reviewed as implementation gaps: their ownership and exclusion are explicit. No DDL is supplied; Maps are the accepted environment. No hypothetical integrations or delivery guarantees were inferred.

## Verification and limits

- `node --test test/existing.test.mjs`: 1 test passed, 0 failed.
- Temporary inline assertions passed for past availability with booking rejection, conflicting booking rejection, exact stored booking keys, current-name receipt after rename, receipt I/O failure preserving the booking, and successful retry.
- Temporary receipt files were cleaned up. Existing tests were unchanged. The checks demonstrate supplied local behavior, not deployed or cross-process guarantees.
- P1 scenarios were simulated walkthroughs from the user/caller perspective, not observations of real staff. The supplied accepted external contracts were used without claiming independent operational validation.

The remaining action is correction of the specified booking facts by the implementation owner. No unresolved business decision remains on the supplied availability or mirror/receipt semantics.
