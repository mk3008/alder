# F2 stage report

Lowered the exclusive senior approval threshold to 50000 yen.

## Files read

Read the current `REQUEST.md`, `acceptance.test.mjs`, `entry.mjs`, and `approval.test.mjs`. Executed the supplied `check.py` runner. No outside-context files, external sources, or other task material were inspected. No accidental outside-context exposure occurred.

## Changes and requirement decisions

- Changed the approval comparison in `entry.mjs` from 100000 to 50000. Amounts below 50000 require approver; amounts at or above it require seniorApprover. All other behavior remains unchanged.
- Authority is derived from the stored requested total on each approval call, without storing a submission-time policy decision. Pending requests therefore use the current threshold regardless of submittedAt.
- Queries and purchase do not revalidate historical approval authority or rewrite prior approval fields. Existing approved and purchased records remain valid. The private ephemeral state has no persistence, import, or live code-update interface; cross-version in-memory record injection is not exposed. Added public-API coverage checks pending requests and preservation of earlier event records within a running instance, without claiming to simulate a live upgrade.
- The supplied acceptance tests already amend both allowed and denied role expectations from 100000 to 50000 and retain all four boundary amounts. This is the requested requirements change, not test weakening. I left evaluator-owned files unchanged as explicitly instructed.
- Updated the own-test low amount in `approval.test.mjs` from 99999 to 49999, keeping the large quantity and exact approval assertions. The previous low-amount expectation was superseded by F2; the quantity-independence regression remains covered. The acceptance tests retain 99999 with its newly required senior role.
- Added an own-test scenario with pending 50000 and 99999 requests, rejected regular-approver attempts with unchanged state, successful senior approvals, unchanged earlier approved/purchased records, and purchase preserving approval event fields.
- Replaced this report. No supplied evaluator files were edited.

## Verification and failures

Invoked `python3 check.py` once during this implementation turn. It returned passed=true and saved this attempt as `.audit/check-002.json`; no audit records were removed or overwritten by me. Syntax checks for `acceptance.test.mjs`, `approval.test.mjs`, `boundaries.test.mjs`, `entry.mjs`, `filter.test.mjs`, and `notes.test.mjs` all passed. The runner executed `node --test --test-reporter=tap acceptance.test.mjs approval.test.mjs boundaries.test.mjs filter.test.mjs notes.test.mjs`; all 28 tests passed with exit 0.

No verification failures or correction rounds occurred in this implementation turn. The stale own-test threshold was identified and amended before verification, rather than discovered through a failed run. There were no known untested intermediate failures. No agents were spawned; no commits, pushes, or publication occurred.
