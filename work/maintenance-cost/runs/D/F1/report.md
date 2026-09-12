# F1 stage report

Implemented exclusive amount-dependent approval roles.

## Files read

Read current REQUEST.md and acceptance.test.mjs, plus domain.mjs and application.mjs during editing. Prior-stage context included the existing adapter, composition root, tests, and check.py. The unchanged verification runner read all JavaScript modules and tests. Supplied evaluator files were not edited.

## Changes and design decisions

- domain.mjs approval now accepts the actor and invokes existing actor/timestamp authorization with seniorApprover for requestedYen >= 100000, otherwise approver. This keeps the amount-dependent policy in the domain and stores the actual actor ID.
- application.mjs passes the actor through to this domain transition instead of imposing the old fixed approval role. The record lookup is read-only; all validations still occur before any repository mutation. Error precedence is not contractual.
- Rejection, submission, and purchase retain their previous role checks. No retroactive policy validation or data rewrite occurs during queries or purchase.
- senior.test.mjs covers malformed senior actors, invalid timestamps, total rather than unit price, permitted senior self-approval, non-monotonic time, note retention, and purchases exceeding the requested total.
- The new tests also seed historical high-value approved/purchased records through the existing repository port, verifying exact preservation and purchase without retroactive approval-role enforcement.

Clean Architecture is retained: the domain owns the approval policy, the application orchestrates the port and domain transition, and the adapter remains independent of approval business rules. No new persistence, role hierarchy, or unrelated behavior was introduced.

## Verification and failures

Ran `python3 check.py` once this stage. All nine .mjs syntax checks and 27 tests passed. The runner executed node --check on each module/test and `node --test --test-reporter=tap acceptance.test.mjs boundaries.test.mjs filtering.test.mjs notes.test.mjs senior.test.mjs`.

Exact commands, output, and exit codes are recorded in .audit/check-001.json. There were no failed attempts, untested intermediate failures, or correction rounds. Existing tests were unchanged.

## Scope and exposure

All actions remained inside the assigned workspace. No accidental outside-context exposure occurred. No agents, skills, external sources, commits, pushes, or publishing were used. No unclear requirements blocked this stage.
