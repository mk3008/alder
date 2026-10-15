# U2 stage report

Implemented optional case-sensitive item substring filtering in `list(filter = {})`.

## Files read

Read the current `REQUEST.md`, `acceptance.test.mjs`, `entry.mjs`, `notes.test.mjs`, and `boundaries.test.mjs`. Executed the supplied `check.py` runner. No outside-context files, external sources, or other task material were inspected. No accidental outside-context exposure occurred.

## Changes and requirement decisions

- Updated only the list method in `entry.mjs`. An absent itemContains defaults to an empty string, preserving list(), list(undefined), and list({}) behavior. A supplied value must be a primitive string; explicitly supplied undefined is rejected as non-string.
- Matching calls the stored item string's includes method without trimming or changing case. Empty string matches all records. Matching therefore uses the item text normalized at submission, while retaining meaningful internal whitespace.
- Existing JavaScript string ID sorting and fresh result objects excluding note remain in place. Validation and filtering perform no state writes.
- Added `filter.test.mjs` with three tests covering literal internal whitespace and Unicode, invalid values on empty and populated apps, default undefined invocation, filtered result isolation, sorting, and full non-note field preservation after approval. Existing tests were retained unchanged.
- Replaced this report for the current stage. The supplied evaluator files were not modified.

## Verification and failures

Ran `python3 check.py` once. Evidence is preserved in `.audit/check-001.json`. The runner executed syntax checks for `acceptance.test.mjs`, `boundaries.test.mjs`, `entry.mjs`, `filter.test.mjs`, and `notes.test.mjs`; each exited 0. It then ran `node --test --test-reporter=tap acceptance.test.mjs boundaries.test.mjs filter.test.mjs notes.test.mjs`, which exited 0 with all 22 tests passing.

There were no failed verification attempts, correction rounds, or known untested intermediate failures. No agents were spawned; no commits, pushes, or publication occurred.
