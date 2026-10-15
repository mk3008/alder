# Maintenance cost pilot packets

Evaluator copy. Do not give this complete file to an implementer: it contains future changes. Extract only the common packet, that arm's instruction, and later the single next stage. These are experimental decisions for this pilot, not amendments to the purchase-request Business Design.

## Common current packet — S0

Implement a small internal equipment purchase workflow in JavaScript using Node built-ins only. Implement the stated current requirements; choose the internal design yourself. Provide `entry.mjs` exporting `createApp()`. Every call creates independent in-memory state. Its returned object exposes `submit(input, actor, now)`, `approve(id, actor, now)`, `reject(id, reason, actor, now)`, `purchase(id, actualYen, actor, now)`, `detail(id)` and `list()`. Commands return the resulting record. Queries and returned records must not expose mutable internal state.

Actors are trusted test inputs `{ id, role }`, with nonempty string IDs and role `requester`, `approver`, or `buyer`. Authentication is outside this fixture. `now` is supplied as a nonnegative safe-integer Unix millisecond timestamp. Reject invalid actor/timestamp inputs before mutation. Queries are available to all callers in this internal fixture; no query authorization is required. Commands require the relevant role below; role assignments are test-provided, not managed by the application.

- `submit`: requester only. Input `{ id, item, quantity, requestedYen, reason }`; ID is a unique nonempty string. Item and reason are nonempty after trimming; store trimmed values. Quantity and total requested yen are positive safe integers. Store `{ id, requesterId, item, quantity, requestedYen, reason, submittedAt: now, status: 'submitted' }`. Requested yen is the total, not unit price. Do not add approval/purchase fields before their event.
- `approve`: approver only, submitted records only. Add `approvedAt: now`, `approvedBy: actor.id`; set status `approved`. Self-approval is permitted in this experimental scope if the actor has the required role.
- `reject`: approver only, submitted records only. Reason must be nonempty after trimming. Add `rejectedAt: now`, `rejectedBy: actor.id`, `rejectionReason` with trimmed input; set status `rejected`.
- `purchase`: buyer only, approved records only. Actual yen is a positive safe integer; it may exceed requested yen. Add `purchasedAt: now`, `purchasedBy: actor.id`, `actualYen`; set status `purchased`. This records an already completed purchase; it does not call an external supplier/payment service.
- `detail`: return the record; unknown IDs fail. `list`: return all records sorted by ID using JavaScript string comparison, with the same fields as detail at this stage.
- Duplicate IDs, wrong role, invalid data, unknown command target and invalid state transitions throw an Error and leave all state unchanged. Error wording is not part of the contract. No cancellation, reopening, notification or durable storage is required. Timestamp ordering beyond validity is not enforced in this bounded fixture.

Before each stage is finalized, run syntax checks and the supplied acceptance tests plus your own relevant tests. Do not modify supplied tests. Record your concrete design decisions and current requirement justifications, commands/results and failed attempts. Edit only your assigned workspace. Do not inspect other arms or evaluator material. Stop and report unclear requirements without adding new business rules.

## Additional initial instruction — B only

The business owner expects approval authority to change according to the requested purchase amount, and expects those amount-based rules to be revised repeatedly. The exact rule and timing are not decided. Account for this concern as you judge appropriate; it does not change today's approval behavior.

## Additional initial instruction — C only

Implement and maintain this product using Vertical Slice Architecture. Choose a natural implementation for this stack; no folder tree or class inventory is prescribed.

## Additional initial instruction — D only

Implement and maintain this product using Clean Architecture. Choose a natural implementation for this stack; no folder tree or class inventory is prescribed.

## U1 — disclose after S0 is frozen

Requesters may supply an optional `note` when submitting. Absent note is stored as an empty string. Supplied note must be a string of at most 280 JavaScript UTF-16 code units; preserve whitespace. Detail and command results include note; list must omit the field entirely. Existing records created before this change read as empty note. Invalid note must not create a record. Preserve other behavior and your existing instructions.

Gate additions: absent/empty/280/281/non-string note; detail/command round-trip; list non-disclosure; invalid-write atomicity; reading a pre-change record if the implementation maintains a migration path. State is intentionally ephemeral, so cross-process persistence migration is not required.

## U2 — disclose after U1 is frozen

`list(filter = {})` accepts optional `{ itemContains }`. If supplied, it must be a string. Match using `item.includes(itemContains)`, case-sensitive, without trimming; empty string matches all. Preserve ID sorting, note omission and all other behavior. A non-string filter value throws and changes no state. Existing `list()` remains valid.

Gate additions: matching/nonmatching, case-sensitive substring, empty string, default call, non-string value, sorted results and continued note omission.

## F1 — disclose after U2 is frozen

Add trusted actor role `seniorApprover`. For `approve` only: requests with total `requestedYen >= 100000` require `seniorApprover`; smaller requests require `approver`. These roles are exclusive for this command: senior approvers cannot approve below-threshold requests. Store the actual approving actor as before. `reject` still requires `approver` at every amount. All previously approved/purchased records retain their state and data. Submission and purchase roles are unchanged. Preserve other behavior.

Gate additions: 99,999 and 100,000 yen; both approval roles at both boundaries; unauthorized attempts preserve state; rejection at either amount; purchase after valid senior approval; historical record data preserved.

## F2 — disclose after F1 is frozen

Change the approval threshold from 100,000 to 50,000 yen. Apply the new rule to subsequent approval commands, including pending requests submitted before this change. Already approved/purchased records remain valid and unchanged. Preserve all other behavior.

Gate additions: 49,999/50,000/99,999/100,000 and exclusive roles; pending requests; historical approvals; wrong-role atomicity. Replace the superseded threshold expectations in evaluator-owned tests, while retaining all still-valid regression cases. Record that test amendment as a requirements change, not weakening tests to pass.
