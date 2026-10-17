# Cumulative Stage 1 + Stage 2 acceptance instrument contract — maintenance request lifecycle

Status: executable business-acceptance contract for the accepted Stage 1 and
Stage 2 horizon.  This contract incorporates, without amendment, the complete
Stage 1 acceptance instrument contract v3 (`stage1-acceptance-v3.md`),
including S1-01 through S1-11, its fixture, retained evidence, all SQL gates,
HD-WV-001, pass rule, and limits.  The Stage 2 cases below are additional
requirements, not replacements.  Consequently a cumulative run passes only
when every incorporated Stage 1 case and every Stage 2 case passes.

Sources are the current candidate workflow, HD-WV-001, the frozen initial
DDL, the Stage 1 packet, Stage 1 acceptance v3, and the Stage 2 packet.  It
asserts observable business outcomes only.  It requires no endpoint shape,
SQL write technique, module, class, folder, or implementation layout.

Execution requested: fresh Terra / medium.  Actual model, effort, runtime,
session identity, and execution result are **unverified**.  This is a design
contract, not evidence that an implementation has passed it.

## Cumulative business rules under test

The following rules are active together:

1. A fault report has an existing equipment record, a description that meets
   Stage 1 and HD-WV-001 validation, and begins `open`; all Stage 1 retention
   and duplicate-report rules continue to apply exactly as in v3.
2. An authorized maintenance coordinator may schedule an **open** request for
   a future time.  A successful scheduling changes that request to
   `scheduled` and retains the scheduled time.
3. An authorized technician may complete a **scheduled** request at a
   completion time.  A successful completion changes that request to
   `completed`, retains its scheduled time, and records a non-null completion
   time.
4. An open request cannot be completed.  A completed request cannot be
   rescheduled.
5. A reporter is neither coordinator nor technician authority.  Reporter
   evidence used by the Stage 1 reporting operation must not by itself grant
   either Stage 2 authority.

The DDL permits some combinations that these business rules forbid (for
example, an `open` row with a schedule).  Passing requires the business
outcomes below, regardless of whether the implementation uses application
validation, database constraints, or another mechanism.

## Invocation boundary and evidence

Use any raw-SQL-capable adapter to invoke three business operations:

- **report equipment fault**, with the Stage 1 v3 inputs and actor evidence;
- **schedule maintenance**, identifying an existing request and a requested
  `scheduled_for` `timestamptz`, under an actor evidenced as an authorized
  maintenance coordinator; and
- **complete maintenance**, identifying an existing request under an actor
  evidenced as an authorized technician.

If the completion operation accepts a completion timestamp, retain that exact
input as `completion_time`; otherwise retain the operation start/end instants
from the test clock and the returned/observed completion timestamp.  A test
adapter must record how its actor evidence maps to the application's
authorization context.  Merely attaching the strings `coordinator`,
`technician`, or `reporter` to a request is not proof of authorization.

For every call retain: case id; database/schema identity; all supplied inputs
and correlation/request id; actor evidence and authorization-fixture identity;
outcome (`accepted` or `rejected`); invocation start/end instants; observed
rows; and every asserted count.  For rejected calls retain the attempted
request id.  No rejection wording, SQLSTATE, HTTP status, or protocol encoding
is asserted.

An accepted call for which the affected request cannot be identified, outcome
cannot be observed, a required SQL gate is absent, a required authorization
fixture is not demonstrably available, or setup fails is **inconclusive**, not
a pass.

## Fixture and clock convention

Run `ddl.sql` in a fresh isolated PostgreSQL database/schema.  Each standalone
case begins with the Stage 1 v3 equipment fixture, and creates its prerequisite
request through a successful Stage 1 report unless the case explicitly says
otherwise.  The canonical prerequisite is:

```text
request_id: req-stage2-base
equipment_id: eq-stage1-known
reported_by: reporter-stage1
reported_at: 2030-01-15T10:30:00Z
description: Hydraulic pressure warning observed
```

It must first be accepted and observed as exactly:

```text
req-stage2-base | eq-stage1-known | reporter-stage1 | 2030-01-15T10:30:00Z |
Hydraulic pressure warning observed | open | NULL | NULL
```

For scheduling tests, capture `schedule_call_start` immediately before the
call.  Choose `future_schedule_time` at least 24 hours after that instant and
`past_schedule_time` at least 24 hours before it, each represented as a UTC
`timestamptz` literal retained in the evidence.  This deliberately avoids a
near-now boundary; `future` means strictly later than the authoritative time
at which scheduling is evaluated, not later merely than `reported_at`.

For completion tests, create a successfully scheduled prerequisite with
`scheduled_for = 2030-02-01T09:00:00Z` only when that value is unambiguously
future for the execution clock.  If it is not, replace it with the retained
`future_schedule_time`; all expected-row assertions use that retained literal.

## Required SQL gates

For every accepted Stage 2 call, retain the selected row and execute an
assertion proving exactly one row matches every field that the applicable case
states, plus the stated total request count.  For every rejected call, prove
the full pre-call row is unchanged and the stated count is unchanged.  Printing
a row alone is not an assertion.

The examples use this selection:

```sql
SELECT request_id, equipment_id, reported_by, reported_at, description, status,
       scheduled_for, completed_at
FROM maintenance_request
WHERE request_id = 'req-stage2-base';
```

An equivalent SQL gate is permitted only if it asserts the same row fields and
count.  Timestamptz comparisons are by instant, independent of display time
zone.

## Stage 2 cases and assertions

### S2-01 — authorized coordinator schedules an open request for a future time

Create the canonical prerequisite.  Invoke **schedule maintenance** as the
authorization-fixture actor evidenced as an authorized maintenance coordinator,
with `request_id: req-stage2-base` and the retained
`future_schedule_time`.  The call must be accepted.

Assert exactly one row with every retained Stage 1 base field, `status =
'scheduled'`, `scheduled_for = future_schedule_time`, and `completed_at IS
NULL`; assert total `maintenance_request` count `1`.  This proves that the
schedule was stored, not merely that a status changed.

### S2-02 — authorized technician completes a scheduled request

Create the canonical prerequisite, then successfully perform S2-01's
scheduling prerequisite.  Invoke **complete maintenance** as an authorized
technician.

The call must be accepted.  Assert exactly one row with every retained base
field, `status = 'completed'`, the exact retained scheduled time, and a
non-null `completed_at`; assert total count `1`.  If the operation accepts a
completion timestamp, additionally assert `completed_at = completion_time`.
If it does not, retain the operation timing bracket and observed value; the
unresolved time-authority limitation below prevents that bracket from proving
the precise semantic source of the timestamp.

### S2-03 — reject completion of an open request without mutation

Create the canonical `open` prerequisite.  Invoke **complete maintenance** as
an authorized technician.  The call must be rejected.

Assert exactly one unchanged canonical base row: `status = 'open'`,
`scheduled_for IS NULL`, and `completed_at IS NULL`; assert total count `1`.
No completion attempt may create another request or populate either lifecycle
timestamp.

### S2-04 — reject rescheduling a completed request without mutation

Create the canonical prerequisite, successfully schedule it as in S2-01, and
successfully complete it as in S2-02.  Retain the resulting `completed_at` as
`completed_time_observed`.  Attempt **schedule maintenance** as an authorized
coordinator with a different retained future time.

The call must be rejected.  Assert exactly one unchanged row with every base
field, `status = 'completed'`, the original scheduled time, and
`completed_at = completed_time_observed`; assert total count `1`.

### S2-05 — reject a non-future schedule for an open request without mutation

Create the canonical `open` prerequisite.  Invoke **schedule maintenance** as
an authorized coordinator with `past_schedule_time`.  The call must be
rejected.

Assert exactly one unchanged canonical base row (`open`, both lifecycle times
`NULL`) and total count `1`.  This is an intentionally far-past probe; it does
not choose a policy for a near-now boundary beyond the stated rule that the
time be future.

### S2-06 — reporter authority cannot schedule

Create the canonical `open` prerequisite.  Invoke **schedule maintenance**
using only the Stage 1 reporter authorization context/evidence
(`reporter-stage1`), with `future_schedule_time`.  The call must be rejected.

Assert exactly one unchanged canonical base row (`open`, both lifecycle times
`NULL`) and total count `1`.  This does not require a particular authentication
protocol; it proves that Stage 1 reporter evidence is insufficient for
coordinator authority.

### S2-07 — reporter authority cannot complete

Create the canonical prerequisite and successfully schedule it as in S2-01.
Invoke **complete maintenance** using only the Stage 1 reporter authorization
context/evidence (`reporter-stage1`).  The call must be rejected.

Assert exactly one unchanged scheduled row with every base field,
`status = 'scheduled'`, the original retained scheduled time, and
`completed_at IS NULL`; assert total count `1`.

### S2-08 — a nonexistent request cannot be scheduled or created implicitly

With only the two equipment fixture rows and no maintenance request, invoke
**schedule maintenance** as an authorized coordinator with
`request_id: req-stage2-missing` and `future_schedule_time`.  The call must be
rejected.

Assert `count(*) WHERE request_id = 'req-stage2-missing' = 0` and total
`maintenance_request` count `0`.  A missing request is not open, so it cannot
satisfy the stated scheduling precondition.

### S2-09 — a nonexistent request cannot be completed or created implicitly

With only the two equipment fixture rows and no maintenance request, invoke
**complete maintenance** as an authorized technician with
`request_id: req-stage2-missing`.  The call must be rejected.

Assert `count(*) WHERE request_id = 'req-stage2-missing' = 0` and total
`maintenance_request` count `0`.  A missing request is not scheduled, so it
cannot satisfy the stated completion precondition.

## Pass rule

The cumulative instrument passes only when all incorporated S1-01 through
S1-11 cases and S2-01 through S2-09 have their required outcome, all required
evidence is retained, every accepted-case and rejection non-mutation SQL gate
passes, and every required authorization fixture is demonstrably used.  One
inconclusive case is not a pass.

## Unspecified policy and deliberately unasserted behavior

The following are genuine missing business-policy decisions.  This contract
does not invent outcomes for them; they require a grouped human decision before
an acceptance case can claim them:

1. **Authority model beyond the stated minimum.** The packet names authorized
   coordinators and technicians and excludes the reporter, but does not define
   credentials, identity enrollment, role assignment, role revocation, or
   whether a coordinator may complete, a technician may schedule, or one
   identity may hold both authorities.  S2-06/S2-07 test only the explicit
   reporter exclusion; positive cases require a demonstrable authorized test
   fixture.
2. **Completion-time authority.** The packet says completion is "at completion
   time" but does not decide whether that time is supplied by a technician,
   captured by the application/database, or taken from another authoritative
   clock, nor whether a supplied value may be past/future.  S2-02 therefore
   proves a non-null recorded completion time, and exact equality only where
   the operation explicitly accepts the time.  It cannot prove the intended
   time source without that decision.
3. **Already-scheduled and repeat-completion behavior.** The packet forbids
   rescheduling a completed request but does not state whether a scheduled
   request may be rescheduled, whether a completed request may be completed
   again, or whether either action is idempotent.
4. **Equipment-state interaction.** The packet gives no policy for scheduling
   or completing a request whose equipment later becomes `safety_closed`.
5. **Other omitted lifecycle policies.** Cancellation, unscheduling, schedule
   horizon/lead time, time-zone/business-calendar rules, concurrency, retries,
   audit/history, notification, and duplicate request id behavior are not
   asserted.

The contract also does not assert rejection encoding, SQLSTATE, transport,
implementation structure, description prose quality beyond HD-WV-001, or any
Stage 3/later behavior.
