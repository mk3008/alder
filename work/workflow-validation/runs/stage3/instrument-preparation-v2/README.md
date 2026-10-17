# Stage 3 instrument repair preparation v2

Status: **PREPARED / NOT EXECUTED / NOT FROZEN / STAGE 3 NOT ADOPTED**.
See `docs/workflow-validation/pilot/ASTRA_RESUME.md` for current authority.
Baseline: `7eb00231c30956ac84ac3ccfa0926ac4edb85435`.

These fragments prepare the two defects identified in `../sol-review-v1.md`.
They are not wired into a runner and emit no cumulative pass marker. The
original `implementation-v1` and frozen acceptance remain historical evidence.
There is deliberately no executable replacement S3-02 retain-open case here.

| Fragment | Existing requirement and intended integration |
| --- | --- |
| `s302-after-schedule.sql` | Stage 2 v2 same-session future-time discipline: insert immediately after the schedule attempt and before its outcome output. Retain the after sample and both clock observations; fail unless the supplied schedule remains future. |
| `s303-completed-preservation.sql` | Replace the S3-03 section in a new acceptance snapshot. Retain all original gates, add full report/scheduled row and total-count gates, null completion pre-state, both early-completion temporal guards, and an exact full-row snapshot/equality gate across closure. |

S3-03 is independent of the open-request outcome because closure happens only
after successful completion. Its requirements come from the Stage 3 packet
and S3-03 contract plus the incorporated Stage 2 v2/v3/v4 positive fixture.
The temporary table exists only in this case's transaction. `EXCEPT` compares
all eight frozen columns with null-aware set semantics; counts enforce the
single-row fixture, so a timestamp change within the old bracket is detected.

The S3-02 fragment makes no assertion about the request's post-closure state.
Do not infer acceptance of retain-open from this preparation. After the human
answer, first record the decision and freeze the revised contract. If the
outcome differs from retain-open, redesign S3-02 accordingly; do not blindly
reuse the historical case. Integrate these fragments into a new run snapshot,
preserve Stage 1 v3 and Stage 2 v4, then run cumulative acceptance against the
current candidate in an isolated PostgreSQL schema with retained observations
and cleanup. Do not execute them against an existing business database.

Verification in this resume: source comparison and static gate/fragment
inspection; historical frozen and snapshot files unchanged. PostgreSQL and
psql are unavailable, so SQL syntax/runtime, mutation sensitivity and the new
cumulative acceptance remain unverified. This preparation is not a pass.
