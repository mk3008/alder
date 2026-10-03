# Cumulative Stage 1 + Stage 2 acceptance instrument contract v4 — maintenance request lifecycle

Status: executable business-acceptance contract. This supersedes
`stage2-acceptance-v3.md`. It retains every active requirement, case, gate,
evidence obligation, pass condition, limit, and historical qualification from
the Stage 1 v3 and Stage 2 v2/v3 contracts, except for the instrument-only
replacement of S2-10 below. It is not a new Business Rule or a business-policy
amendment.

## Frozen source references

| Source | SHA-256 |
| --- | --- |
| `stage1-acceptance-v3.md` | `caedb7a2f76966d30a9fc5e1ba180b601ca124b3c63142dac8468d1fc92e8241` |
| `stage2-acceptance-v2.md` | `10feafad2e7221ee38f6e503f77a6275aca1fcae61cf960043f88c7095dd9671` |
| `stage2-acceptance-v3.md` | `45a12e9312d80819363929d3603a5e5f0fa2c77dd67523e9a091d64c44f198a1` |
| `stage2-packet.md` | `4dc03d2565ababd6c46b4d54aac3aaaa719b07af25715307598f492dd8d2f687` |
| `ddl.sql` | `7183953f7455cb7f9d2d4249bcf80639551d459aa59631e520509ada595a0bc7` |
| `DECISIONS.md` (including HD-WV-002) | `200b10c1ee1fe0a2a519072267366e01a69a646ef1c4bcee1b3bb220ed476caa` |

The Stage 1 v3 contract is incorporated unchanged. Stage 2 v2 supplies the
complete S2-01 through S2-11 contract. Stage 2 v3's separate lifecycle
prerequisite replaces v2's canonical prerequisite only for S2-01 through
S2-07. Its explicit historical qualification remains: fixed Stage 1 report
timestamps are never altered or rebased and are not ordinary positive
completion fixtures.

HD-WV-002 remains the sole authority for this contract's completion-time
meaning: a successful authorized completion adopts one trusted database-clock
instant for both the chronology decision and `completed_at`; it must satisfy
`completed_at >= reported_at`. `scheduled_for` remains a plan, not a
completion lower bound. No caller completion time is authoritative.

Execution requested: fresh Terra / medium. Actual model, effort, runtime,
session identity, and execution result are **unverified**. This document is a
frozen acceptance instrument, not evidence of implementation success.

## Amendment reason — v3 S2-10 fixture conflict

V3 correctly separated S2-01 through S2-07 from Stage 1's deliberately fixed
future report timestamp. It retained S2-10 verbatim, however. That retained
case reported a new request at `report_clock_before + interval '24 hours'` and
then required an immediate, accepted completion bounded by the current DB
clock. Under HD-WV-002, an immediate DB-clock completion before that future
`reported_at` must be rejected. Thus that positive early-completion setup is
internally contradictory. The defect is in the acceptance fixture only; it
does not change the requirement, the DDL, Stage 1 timestamp storage, or any
business policy.

Replace **only S2-10** with the following. S2-11 remains a distinct negative
chronology probe exactly as retained by v2/v3.

## Replacement S2-10 — scheduled work may complete early

This case creates a separate Stage 2 request and does not execute or modify
any Stage 1 fixed-timestamp case. On the same database connection/session that
will perform the report, obtain and retain:

```sql
SELECT clock_timestamp() AS early_report_db_before;
```

Set the report operation's supplied `reported_at` exactly to the retained
`early_report_db_before` instant. Invoke a valid report with:

```text
request_id: req-stage2-early
equipment_id: eq-stage1-known
reported_by: reporter-stage1
reported_at: early_report_db_before
description: Hydraulic pressure warning observed
```

The report must be accepted. Retain the sample, exact input, outcome, row, and
count; gate exactly one `open` row with all those report fields,
`scheduled_for IS NULL`, `completed_at IS NULL`, and total request count 1.
This is fixture provenance, not an added reporting-time rule.

Immediately before scheduling, obtain `schedule_db_before` on that operation
session. Choose and retain `scheduled_for` at least 24 hours after
`schedule_db_before`, and prove it is after the retained `schedule_db_after`.
Schedule `req-stage2-early` under demonstrable authorized-coordinator evidence.
It must be accepted. Retain the ordinary v2 clock bracket, inputs,
authorization evidence, post-row, and count; assert the full exact report row,
`status='scheduled'`, the exact retained `scheduled_for`, `completed_at IS
NULL`, and count 1.

Immediately complete that scheduled request under demonstrable
authorized-technician evidence. Retain the v2 same-session completion
`db_before`/`db_after` bracket, null pre-state, operation outcome, post-row,
and count. Require the completion operation's `db_after < scheduled_for`; if
the guard cannot be met, recreate the fixture. The call must be accepted.

Assert exactly one row retaining the exact report fields, `status='completed'`,
the exact schedule, and non-null `completed_at=completion_db_value`, with
total count 1. Assert all of:

```sql
db_before <= completion_db_value
AND completion_db_value <= db_after
AND completion_db_value >= early_report_db_before
AND completion_db_value < scheduled_for
```

This proves both that the accepted completion meets HD-WV-002 chronology and
that completion before the future planned `scheduled_for` is allowed. It does
not assert any different reporting, schedule-horizon, locking, or completion
policy.

## Retained S2-11 — reject DB-clock completion before `reported_at`

S2-11 remains unchanged from v2/v3. It supplies a distinct future
`reported_at`, proves the pre-completion DB sample is before it, requires
rejection, and applies the complete-row non-mutation gate. It is the negative
proof of `completed_at >= reported_at`; it must not be conflated with S2-10's
positive early-completion proof.

## Pass rule and limits

Pass only when every incorporated Stage 1 v3 condition; every retained Stage 2
v2/v3 condition; the v3 separate lifecycle prerequisite for S2-01 through
S2-07; and this replacement S2-10 condition pass with all required rows,
counts, actor evidence, clock samples/brackets, and SQL gates retained. Any
missing provenance, temporal guard, observation, gate, or setup is
inconclusive, not a pass.

The limits from the incorporated contracts remain unchanged, including no
claim that the database detects physical work, no offline/later-reported or
external completion feed, and no additional authority, scheduling,
concurrency, retry, audit, history, or lifecycle policy.
