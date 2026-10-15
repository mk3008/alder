# F1 stage report

Implemented exclusive amount-based approval authority in the approval vertical slice.

## Files read

Read the current REQUEST.md and acceptance.test.mjs, then slices/approve.mjs, slices/purchase.mjs, slices/reject.mjs and validation.mjs. Executed the supplied check.py. No other existing files were inspected during this stage. REQUEST.md, acceptance.test.mjs and check.py remain unchanged.

## Changes and decisions

- slices/approve.mjs now looks up the submitted record and selects exactly one required role: seniorApprover for requestedYen >= 100000, otherwise approver. The condition uses the stored total directly, without quantity multiplication.
- The existing commandContext helper validates the selected role, actor ID and timestamp before the single state write. Target lookup is read-only; an invalid actor, timestamp, role, target or transition still leaves all state unchanged. Error precedence is unspecified, so checking the target before the actor adds no business rule.
- Approval continues to record the actual actor ID and supplied timestamp and preserve other record fields, including note. Self-approval and non-monotonic valid timestamps remain permitted.
- No global role hierarchy or approval-policy migration was introduced. Existing rejection, submission and purchase slices retain their exact required roles. Existing approved/purchased records are not reclassified, invalidated or rewritten. Purchase relies on approved state, preserving usability of historical approvals.
- Added approval.test.mjs for total-versus-quantity semantics, maximum-safe-integer amount, senior self-approval, invalid senior actors/timestamps, repeated approval atomicity, and historical high-value records approved under the earlier policy. Existing own tests were preserved unchanged.

## Verification and failures

Ran `python3 check.py` once for F1. The supplied script ran syntax checks for all thirteen .mjs files and `node --test --test-reporter=tap acceptance.test.mjs additional.test.mjs approval.test.mjs filter.test.mjs note.test.mjs`. All syntax checks and all 29 tests passed. Full commands, output and exit codes are preserved in .audit/check-001.json.

No failed verification attempts, correction rounds, or observed untested intermediate failures occurred. Evaluator files were not changed and no tests were weakened.

## Scope and exposure

All work remained in /workspace/scratch/532ba6a0b129/pilot-c. No accidental outside-context exposure occurred during this stage. No skills, external sources, sub-agents, commits, pushes or publication were used. No unclear requirements remain for F1.
