# F1 stage report

Implemented exclusive amount-based approval authority.

## Files read

Read the current `REQUEST.md`, `acceptance.test.mjs`, and `entry.mjs`. Executed the supplied `check.py` runner, which reads all JavaScript modules and tests for verification. No outside-context files, external sources, or other task material were inspected; no accidental outside-context exposure occurred.

## Changes and requirement decisions

- Updated `approve` in `entry.mjs` to select the required role from the stored requestedYen: seniorApprover at or above 100000, otherwise approver. The existing exact-role validator enforces exclusivity in both directions.
- The threshold uses total requested yen directly, without multiplying by quantity. Approval continues to store the actual actor ID and supplied timestamp, and self-approval remains permitted with the required role.
- Record lookup precedes role selection because authorization depends on the stored amount. All validation still completes before mutation; unknown IDs fail without mutation.
- Rejection retains its approver requirement at every amount. Submission and purchase role checks remain unchanged. Approval changes only the target record and does not reauthorize, migrate, or rewrite previous approval or purchase data.
- Added `approval.test.mjs` covering quantity-independent authority, maximum-safe requested total, senior self-approval, decreasing timestamps, purchase with a smaller actual amount, note preservation and copy isolation, invalid senior actors/timestamps, and repeat approval atomicity. Existing tests were retained unchanged.
- Replaced this report. Supplied evaluator files were left unchanged.

## Verification and failures

Ran `python3 check.py` once. Evidence is preserved in `.audit/check-001.json`. Syntax checks for `acceptance.test.mjs`, `approval.test.mjs`, `boundaries.test.mjs`, `entry.mjs`, `filter.test.mjs`, and `notes.test.mjs` all exited 0. The runner then executed `node --test --test-reporter=tap acceptance.test.mjs approval.test.mjs boundaries.test.mjs filter.test.mjs notes.test.mjs`; it exited 0 with all 27 tests passing.

No failed verification attempts, correction rounds, or known untested intermediate failures occurred. No agents were spawned; no commits, pushes, or publication occurred.
