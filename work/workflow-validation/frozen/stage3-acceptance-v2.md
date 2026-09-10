# Cumulative Stage 1–3 acceptance v2 — after HD-WV-003

Frozen prospectively on 2026-09-10, after the Human Decision at
https://github.com/mk3008/alder/pull/3#issuecomment-5616372481 and before the
dependent resolution snapshot is created/executed/adopted.

This incorporates `stage3-acceptance.md` with the amendments below. All Stage
1 v3 and Stage 2 v4 requirements (including incorporated v2/v3), S3-01,
S3-03, authority-negative coverage, evidence obligations and limits remain
mandatory. Execution follows `docs/workflow-validation/pilot/ASTRA_RESUME.md`,
not the historical Terra/Sol requested orchestration. This is not a pass.

## Policy amendment: S3-02

HD-WV-003 explicitly selects the historical case's retain-open outcome. Safety
closure retains every field of an existing open request unchanged, and attempts
to schedule it while equipment is safety_closed are rejected without request
mutation. Remove only the existing-open-request outcome from the original
contract's unresolved list. Scheduled requests and other unneeded policies
remain untested; Stage 4's packet is not adopted by this amendment.

Keep the full original S3-02 fixture, report-row gate and final postconditions.
Additionally capture and retain the full request immediately before closure,
prove full equality immediately after closure, then prove full equality again
after the rejected schedule. Retain equipment status and total request count 1
at these boundaries. This distinguishes closure preservation from rejection
preservation rather than allowing the second operation to hide a first mutation.

## Mechanical repairs: required executable evidence

- S3-02: retain same-session schedule `db_before` and `db_after`, the supplied
  future time, and an executable `scheduled_for > db_after` gate. The existing
  +48-hour fixture also satisfies Stage 2's at-least-24-hour margin. A failed
  temporal guard is inconclusive and requires a fresh fixture, not acceptance.
- S3-03: gate and retain the complete accepted report row and total count 1;
  the complete accepted scheduled row and count 1 (including null completion);
  schedule clock bracket/future guard; completion bracket and full completed
  row/count; report/completion chronology; and positive early-completion guards
  before/after completion, as in Stage 2 v4. Capture the exact full completed
  row before closure and prove equality afterward, including the exact
  non-null completed_at. Merely remaining in the same clock bracket is insufficient.

The prepared fragments supply these two repairs; integration must retain the
surrounding contract, actor evidence and fixture setup. Do not weaken a gate
to accommodate an implementation or environment failure.

## Adoption gate

Run every active Stage 1–3 case against one current candidate in one fresh
disposable PostgreSQL schema, retain source/contract hashes, runtime/locale,
session identity, exact observations/outcomes, and cleanup count 0. Pass markers
alone do not replace review of required evidence. Structural reassessment follows
consistency verification. Historical v1 acceptance/snapshots remain unchanged.
