# U1 stage report

Implemented optional submission notes in `entry.mjs` and extended `additional.test.mjs`. Evaluator files remain unchanged.

## Decisions and changes

- Absent own `note` property becomes an empty string. A supplied value must be a primitive string of at most 280 JavaScript UTF-16 code units, measured with `.length`. Whitespace is preserved. Explicit `undefined` is rejected as a supplied non-string value.
- Validation occurs while constructing the submission record, before the Map write, preserving atomic failures.
- Detail and command outputs use a shared copy projection that defaults a missing stored note to an empty string. Existing event transitions preserve notes through record spreading.
- List uses a separate copy projection that removes the note property entirely while retaining the remaining fields and ID ordering.
- Storage remains private and ephemeral. There is no record import or hot-upgrade path through which this application can acquire a pre-change record, so no cross-process migration or test-only state injection was added. The missing-note projection fallback is present but has not been exercised against an actual pre-change stored record.
- Approval policy and all other workflow rules are unchanged.

## Actual files read

`REQUEST.md`, `acceptance.test.mjs`, `entry.mjs`, `additional.test.mjs`, `check.py`, and `.audit/check-001.json` (command results and test summary).

## Verification

Ran `python3 check.py` once for this stage, exit 0, with evidence in `.audit/check-001.json`. It ran syntax checks for `acceptance.test.mjs`, `additional.test.mjs`, and `entry.mjs`, then `node --test --test-reporter=tap acceptance.test.mjs additional.test.mjs`. All syntax checks passed; all 18 tests passed (13 supplied, 5 own).

New own tests cover mixed surrogate/BMP code-unit boundaries, explicit undefined and other non-string rejection, retry after invalid writes, note output isolation through transitions, and exact list projection with note omitted.

No verification failures, correction rounds, or known untested intermediate failures occurred. The legacy-record fallback limitation is documented above.

## Context boundaries

All reads and writes remained in the assigned workspace. No accidental outside-context exposure, external lookup, agents, skills, commits, pushes, or publication occurred.
