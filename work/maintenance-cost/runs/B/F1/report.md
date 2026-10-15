# F1 stage report

Implemented the requested amount-based approval authority in `entry.mjs` and updated `additional.test.mjs`. Supplied evaluator files remain unchanged.

## Decisions and changes

- Added `seniorApprover` to recognized trusted actor roles.
- Updated the existing isolated `requireApprovalAuthority(record, actor)` function to require `seniorApprover` for requested totals at least 100000 yen and `approver` below that threshold. Exact role equality makes these permissions exclusive.
- The decision uses total requested yen directly, independent of quantity and actual purchase cost. No new policy configuration or stored policy fields are needed for this fixed rule.
- Approval still validates actor, timestamp and submitted status before writing, and records the actual actor ID.
- Rejection retains its separate approver-only check at every amount. Submission and purchase permissions are unchanged.
- No existing records are reclassified or rewritten by the rule change. Queries and purchase do not re-evaluate approval authority. Existing event data, notes, filtering, and list note omission are preserved. The application has no cross-process record migration path.
- Revised the earlier own test asserting approver authority at every amount because F1 explicitly supersedes that behavior. Replaced it with stronger positive and negative boundary/maximum-total assertions; no supplied tests were modified or assertions disabled.

## Actual files read

`REQUEST.md`, `acceptance.test.mjs`, `entry.mjs`, `additional.test.mjs`, `check.py`, and `.audit/check-001.json` (commands and test summary).

## Verification and failures

Ran `python3 check.py` once this stage, exit 0. Evidence is in `.audit/check-001.json`. It ran `node --check` for `acceptance.test.mjs`, `additional.test.mjs`, and `entry.mjs`, followed by `node --test --test-reporter=tap acceptance.test.mjs additional.test.mjs`. All syntax checks and 24 tests passed (17 supplied, 7 own).

Own coverage includes both exclusive approval roles at boundaries and maximum total, independence from quantity, senior self-approval with decreasing valid timestamps, senior actor/timestamp validation with unchanged state, actual approving ID preservation, purchase below the requested total after senior approval, repeat-transition rejection, and continued note omission.

No failed verification attempts or correction rounds occurred. The superseded own assertion was identified and updated before verification; it was not run as a failing intermediate version. No other known untested intermediate failures occurred.

## Context boundaries

All reads and writes remained inside the assigned workspace. No accidental outside-context exposure, external lookup, agent use, skills, commits, pushes, or publication occurred.
