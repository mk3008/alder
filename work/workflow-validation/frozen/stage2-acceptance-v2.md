# Cumulative Stage 1 + Stage 2 acceptance instrument contract v2 — maintenance request lifecycle

Status: executable business-acceptance contract for the accepted Stage 1 and
Stage 2 horizon. This supersedes `stage2-acceptance.md`. It incorporates,
without amendment, the complete Stage 1 v3 instrument
(`stage1-acceptance-v3.md`): S1-01 through S1-11, fixture, inputs, actor
evidence, observed rows/counts, SQL gates, HD-WV-001, pass rule, and limits.
The cases below are cumulative additions, not replacements. A run passes only
when all incorporated Stage 1 cases and S2-01 through S2-11 pass.

Sources: current candidate workflow, HD-WV-001, HD-WV-002, frozen `ddl.sql`,
Stage 1 packet and v3 contract, Stage 2 packet, and the original Stage 2
acceptance contract. This asserts observable business outcomes, never an
endpoint, write technique, module, class, folder, or implementation layout.

Execution requested: fresh Terra / medium. Actual model, effort, runtime,
session identity, and execution result are **unverified**. This is a design
contract, not evidence that an implementation has passed it.

## Active cumulative rules

All Stage 1 rules remain active. An authorized coordinator may schedule an
`open` request for a future time, producing `scheduled` and retaining that
time. An authorized technician may complete a `scheduled` request. Completion
produces `completed`, retains the schedule, and records the trusted database
clock value adopted by that *same completion operation*. Caller/technician
time is not authoritative. `scheduled_for` is a plan, not a lower bound, so
completion before it is allowed. A completion is valid only when its adopted
database-clock `completed_at >= reported_at`; otherwise it is rejected without
mutation. Open requests cannot be completed, completed requests cannot be
rescheduled, and Stage 1 reporter evidence alone grants neither authority.

The DDL permits some forbidden combinations. Passing requires these business
outcomes regardless of the enforcement mechanism.

## Invocation boundary, fixture, and retained evidence

Use a raw-SQL-capable adapter for **report equipment fault**, **schedule
maintenance**, and **complete maintenance**. The report inputs and reporter
evidence are those in Stage 1 v3. Schedule identifies a request and a UTC
`scheduled_for` literal under demonstrable coordinator authorization. Complete
identifies a request under demonstrable technician authorization; it must not
take a caller time as the authoritative completion fact.

For every call retain case id; database/schema and adapter/session identity;
all exact inputs and correlation/request id; actor evidence and the
authorization-fixture identity plus its mapping to the application's
authorization context; `accepted`/`rejected` outcome; invocation start/end;
each selected row; each database-clock sample; and every asserted count. For a
rejection retain the attempted request id. Labels such as `coordinator`,
`technician`, or `reporter` alone are not authorization evidence. Rejection
wording, SQLSTATE, HTTP status, and protocol encoding are not asserted.

Run `ddl.sql` in a fresh isolated PostgreSQL database/schema. Each standalone
case starts with the Stage 1 v3 equipment fixture and zero requests, unless
the case states otherwise. Create its canonical prerequisite by an accepted
Stage 1 report:

```text
request_id: req-stage2-base
equipment_id: eq-stage1-known
reported_by: reporter-stage1
reported_at: 2030-01-15T10:30:00Z
description: Hydraulic pressure warning observed
```

Retain and gate the resulting exact open row and total count 1 as required by
Stage 1 v3. For the chronological probes S2-10 and S2-11, the case supplies a
different, retained `reported_at` as explicitly stated. Timestamptz comparisons
are by instant, independent of display time zone.

### Database-clock convention

Immediately before and immediately after every schedule or completion call,
on the same database connection/session used for that operation, execute and
retain:

```sql
SELECT clock_timestamp() AS db_before; -- immediately before
SELECT clock_timestamp() AS db_after;  -- immediately after
```

For a schedule, choose and retain `future_schedule_time` at least 24 hours
after `db_before`, and prove `future_schedule_time > db_after`; otherwise the
fixture is inconclusive and must be recreated. For a past probe choose
`past_schedule_time` at least 24 hours before `db_before`. This is a safe
test margin, not a new schedule-horizon policy.

For each accepted completion, the pre-call row must have `completed_at IS
NULL`; retain the post-call `completed_at` as `completion_db_value` and prove
`db_before <= completion_db_value AND completion_db_value <= db_after`. The
same-session bracket, null pre-state, identified affected row, and immediate
post-state prove that the stored completion fact is a database-clock value
adopted by that completion operation, rather than a caller time or an earlier
event. A result lacking any element is inconclusive, not a pass.

## SQL observation and gates

For every request row retain this query's result before and after each
state-changing or rejected Stage 2 call, as applicable:

```sql
SELECT request_id, equipment_id, reported_by, reported_at, description, status,
       scheduled_for, completed_at
FROM maintenance_request WHERE request_id = '<case request id>';
SELECT count(*) AS request_count FROM maintenance_request;
```

For every rejected call against an existing request, materialize the complete
pre-call row in a transaction-local relation, retain its contents, then gate
full equality after the call. This is required for every field, including
`completed_at`, not merely lifecycle fields:

```sql
DROP TABLE IF EXISTS s2_pre_call;
CREATE TEMP TABLE s2_pre_call ON COMMIT DROP AS
SELECT request_id, equipment_id, reported_by, reported_at, description, status,
       scheduled_for, completed_at
FROM maintenance_request WHERE request_id = '<case request id>';

DO $$ BEGIN
  IF (SELECT count(*) FROM s2_pre_call) <> 1
     OR (SELECT count(*) FROM maintenance_request) <> 1
     OR (SELECT count(*) FROM maintenance_request m JOIN s2_pre_call p
          ON m.request_id IS NOT DISTINCT FROM p.request_id
         AND m.equipment_id IS NOT DISTINCT FROM p.equipment_id
         AND m.reported_by IS NOT DISTINCT FROM p.reported_by
         AND m.reported_at IS NOT DISTINCT FROM p.reported_at
         AND m.description IS NOT DISTINCT FROM p.description
         AND m.status IS NOT DISTINCT FROM p.status
         AND m.scheduled_for IS NOT DISTINCT FROM p.scheduled_for
         AND m.completed_at IS NOT DISTINCT FROM p.completed_at) <> 1 THEN
    RAISE EXCEPTION 'rejected call mutated request';
  END IF;
END $$;
```

The case gates below additionally assert every stated postcondition. An
equivalent is allowed only when it proves the same full row, count, and
clock/bracket facts. Selecting/printing is not an assertion.

## Stage 2 cases

### S2-01 — coordinator schedules an open request for a future time

Create the canonical prerequisite. With demonstrable authorized-coordinator
evidence, invoke schedule for `req-stage2-base` with the retained
`future_schedule_time`. Retain inputs, actor evidence, outcome, clock bracket,
row, and count. It must be accepted. Assert exactly one row with all canonical
base fields, `status='scheduled'`, `scheduled_for=future_schedule_time`, and
`completed_at IS NULL`, plus total count 1.

### S2-02 — technician completes a scheduled request with the DB clock

Create the canonical prerequisite and successfully perform S2-01. Under
demonstrable authorized-technician evidence invoke complete for
`req-stage2-base`; retain all call evidence and completion DB bracket. It must
be accepted. Assert exactly one row with all base fields, `status='completed'`,
the exact retained schedule, and `completed_at=completion_db_value` non-null;
assert count 1 and the required DB-bracket predicate. No supplied completion
timestamp is an accepted substitute for this proof.

### S2-03 — reject completion of an open request without mutation

Create the canonical open prerequisite. Under authorized-technician evidence,
snapshot the complete row, invoke complete, and retain all evidence. It must
be rejected. Run the full-row non-mutation gate above and retain count 1.

### S2-04 — reject rescheduling a completed request with full pre-call equality

Create the canonical prerequisite, successfully schedule and complete it under
the corresponding authorized fixtures, and retain the full completed row and
`completion_db_value`. Under authorized-coordinator evidence, snapshot that
*entire* row, then attempt schedule with a different retained
`future_schedule_time`. It must be rejected. Run the full-row non-mutation
gate above: it proves equality of request id, equipment id, reporter,
reported-at, description, status, scheduled-for, and completed-at (including
the exact pre-call `completion_db_value`), with total count 1.

### S2-05 — reject a non-future schedule without mutation

Create the canonical open prerequisite. Under authorized-coordinator evidence,
snapshot it and invoke schedule with retained `past_schedule_time`. It must be
rejected. Run the full-row non-mutation gate and retain count 1. This far-past
probe creates no near-now policy.

### S2-06 — reporter authority cannot schedule

Create the canonical open prerequisite. Using only Stage 1 reporter context
and evidence (`reporter-stage1`), snapshot it and invoke schedule with
`future_schedule_time`. It must be rejected. Run the full-row non-mutation
gate and retain count 1.

### S2-07 — reporter authority cannot complete

Create the canonical prerequisite and successfully schedule it as S2-01.
Using only Stage 1 reporter context/evidence (`reporter-stage1`), snapshot the
full scheduled row and invoke complete. It must be rejected. Run the full-row
non-mutation gate and retain count 1.

### S2-08 — a missing request cannot be scheduled or created implicitly

With only the two equipment fixture rows and no request, invoke schedule as an
authorized coordinator with `request_id: req-stage2-missing` and
`future_schedule_time`. Retain all inputs, authorization evidence, outcome,
clock bracket, and both counts. It must be rejected. Assert
`count(*) WHERE request_id='req-stage2-missing' = 0` and total count 0.

### S2-09 — a missing request cannot be completed or created implicitly

With only the two equipment fixture rows and no request, invoke complete as an
authorized technician with `request_id: req-stage2-missing`. Retain all
inputs, authorization evidence, outcome, clock bracket, and both counts. It
must be rejected. Assert attempted-id count 0 and total count 0.

### S2-10 — scheduled work may complete early

Sample `report_clock_before`, then report a valid request with retained
`reported_at = report_clock_before + interval '24 hours'`. Before scheduling,
sample `schedule_db_before` and choose a retained `scheduled_for` that is at
least 24 hours after both `reported_at` and `schedule_db_before`; prove it is
also after `schedule_db_after`. Schedule successfully under coordinator
evidence. Immediately complete it under technician evidence while completion
`db_after < scheduled_for`; if either guard cannot be met, recreate the
fixture. The completion must be accepted. Retain all report/schedule/complete
inputs, outcomes, fixtures, DB brackets, rows, and counts. Assert one row
retaining its exact report fields, `status='completed'`, the exact schedule,
and `completed_at=completion_db_value`, count 1, the completion DB bracket,
`completed_at >= reported_at`, and `completed_at < scheduled_for`. This proves
the schedule is not a completion lower bound.

### S2-11 — reject completion whose DB time would precede `reported_at`

Sample `report_clock_before` on the operation session. Report a valid Stage 1
request using retained `reported_at = report_clock_before + interval '24
hours'`. Before scheduling, sample `schedule_db_before` and choose a retained
schedule at least 24 hours after both that `reported_at` and
`schedule_db_before`, satisfying the schedule DB-bracket guard. Before
completion, prove with a DB sample that `db_before < reported_at`; snapshot the
entire scheduled row, then invoke complete under authorized technician
evidence. Retain every report/schedule/complete input, outcome, authorization
fixture, DB sample/bracket, row, and count. The call must be rejected. Run the
full-row non-mutation gate and retain count 1. If the clock advances to
`reported_at` before invocation, recreate the fixture; this case asserts no
outcome at or after that boundary.

## Pass rule and limits

Pass only when S1-01 through S1-11 and S2-01 through S2-11 have the required
outcomes; all exact inputs, authorization evidence, rows, clock samples, and
counts are retained; each accepted-row, full non-mutation, and clock gate
passes; and each required authorization fixture is demonstrably used. An
inconclusive case is not a pass.

This contract does not decide authority enrollment or role management, whether
coordinators may complete or technicians may schedule, rescheduling a scheduled
request, repeat completion, safety-closure interactions, cancellation,
unscheduling, calendar/time-zone policy, retries, concurrency, audit/history,
or rejection encoding. It does not claim the DB clock detects physical work
completion, or cover offline/later-reported/external completion feeds. Those
are unprovided policy, not acceptance requirements.
