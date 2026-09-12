# Availability and booking review

Scope: supplied `src/service.mjs` availability and booking path, compared with `context/business-design.md` and `decisions/accepted.md`, using supplied Alder review knowledge v0.3. Review only; implementation and existing tests are unchanged. These are code walkthroughs and executable reproductions, not observations of actual users.

## Findings

### 1. Overlapping reservations can both become established — definite mismatch

Evidence: Activity 2 procedure 4 requires rejecting overlapping reserved bookings; Business Rules 2 and 7 prohibit multiple overlapping reservations even for concurrent requests. `src/service.mjs:5–6` defines overlap detection and `:14` uses it for availability, but `reserve` at `:16–20` never checks overlap before storing a reservation. Accepted decisions explicitly require booking to check overlap again.

Reproduction with clock fixed at 100: reserve room `a` for `[200,300)` as `user`, then `[210,220)` as `other`. Both return distinct IDs, and both remain stored with state `reserved`. This fails even sequentially, without requiring a concurrency mechanism.

Business effect (Q1/Q2/Q3): two users receive established bookings for the same room at overlapping times. An earlier availability query cannot guarantee that another user has not since booked; hiding occupied rooms from later queries does not protect booking admission.

Minimal action/owner: implementation owner must enforce the already-decided overlap condition when establishing a booking. No new business decision or architecture choice is needed. A focused regression test should demonstrate refusal of the second overlapping reservation while preserving the first and permitting adjacency.

### 2. Booking omits required purpose and registration time — definite mismatch

Evidence: Business Data requires utilization purpose and booking registration datetime. Activity 2 requires purpose as input and recording registration datetime in procedure 6. `reserve(roomId, start, end, actor)` (`src/service.mjs:16`) has no purpose input, and the stored object at `:18` contains neither purpose nor registration datetime. The reproduction's returned and subsequently fetched reservations confirm both omissions. The accepted scope does not exempt booking from these requirements.

Business effect (Q3): the registered booking handed back to the user and available for subsequent retrieval lacks the stated reason for use and when registration occurred. The code cannot preserve a user's purpose or supply the defined booking facts. This finding does not require a change-history or audit subsystem.

Minimal action/owner: implementation owner should accept/preserve the required purpose and record the registration datetime. No business decision is needed for those explicit requirements; storage format is a technical choice.

## Sufficiency and stopping conditions

- Availability validates start before end and filters by current available state and reserved overlap (`:12–14`). Its strict overlap comparisons (`:5–6`) allow an ending time equal to another booking's start, as Business Rule 3 requires.
- Past intervals can appear in availability, while booking rejects them (`:17`). The product owner has explicitly accepted query-time room-state/overlap meaning in `decisions/accepted.md`. This is sufficient; no renewed Business confirmation or mandatory future-only search is warranted.
- Booking checks actor presence, available room state, and a strictly future, correctly ordered interval. The supplied authentication boundary owns actor identity. The in-memory dictionaries are explicitly accepted. No new authentication, database, or distributed-concurrency requirements are raised.
- Returned room and booking objects are copies. The existing test demonstrates room-copy isolation and correct adjacent availability.
- Room administration, other Activities, and receipt implementation are outside this requested availability/booking review. The operations note about a disk mirror does not authorize changing implementation or challenging an unrelated implementation means here.

## Verification and remaining decisions

`node --test test/existing.test.mjs`: 1 test passed. Its overlap coverage exercises availability only; it never attempts a second conflicting reservation or verifies purpose/registration datetime. Passing it therefore does not establish booking compliance.

A separate in-memory Node reproduction confirmed two conflicting stored bookings, missing booking fields, and accepted past-time availability. No files were added to or changed in the test suite. No DDL is supplied, and none is assumed.

No unresolved business decision is needed for the two findings: the current Business Design already decides them. Business meaning established by accepted decisions is closed rather than reopened.
