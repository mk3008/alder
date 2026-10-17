# Cumulative Stage 1 + Stage 2 acceptance instrument contract v3 — maintenance request lifecycle

Status: executable business-acceptance contract. This supersedes
`stage2-acceptance-v2.md`. Except for the explicitly identified fixture repair
below, v3 incorporates v2 without amendment: its Stage 1 v3 incorporation,
S1-01 through S1-11, S2-01 through S2-11, rules, required evidence, SQL
observation/gates, pass rule, and limits remain verbatim and mandatory.

Sources remain the Stage 1 v3 contract, Stage 2 v2 contract, HD-WV-002,
frozen `ddl.sql`, and the Stage 2 packet. This amendment is an
**acceptance-instrument defect repair**, not a business-policy change and not
a new rule.

## Instrument defect and repair

Stage 2 v2 reused the Stage 1 canonical report fixture as the prerequisite for
ordinary Stage 2 lifecycle cases. That fixture deliberately preserves the
Stage 1 supplied timestamp `2030-01-15T10:30:00Z`. The same contract also
requires an accepted completion's `completed_at` to be the current trusted
database-clock value and to satisfy `completed_at >= reported_at`. Therefore,
when the database clock precedes that fixed future Stage 1 timestamp, an
ordinary positive lifecycle completion cannot pass. This is a contradictory
test fixture, not a change to the lifecycle rule.

S1-01 through S1-11 are unchanged. In particular, their supplied timestamps,
including S1-01's `2030-01-15T10:30:00Z`, remain exact Stage 1 assertions and
must not be altered, rebased, or used as the ordinary positive-completion
fixture.

Replace only v2's definition and use of the **canonical prerequisite** in
S2-01 through S2-07 with the following separate **Stage 2 lifecycle
prerequisite**. All references in those cases to creating the canonical
prerequisite (including the open prerequisite) mean this fixture. S2-08 and
S2-09 remain request-free. S2-10 and S2-11 retain their explicitly stated
chronological fixtures unchanged.

## Stage 2 lifecycle prerequisite (replacement fixture for S2-01 through S2-07)

Run the ordinary Stage 1 report operation in the isolated case fixture, but do
not treat it as execution of S1-01. On the same database session used to make
the report, immediately obtain and retain:

```sql
SELECT clock_timestamp() AS lifecycle_report_db_before;
```

Set the supplied report input `reported_at` to the retained instant
`lifecycle_report_db_before`, then invoke the report operation with:

```text
request_id: req-stage2-base
equipment_id: eq-stage1-known
reported_by: reporter-stage1
reported_at: lifecycle_report_db_before
description: Hydraulic pressure warning observed
```

The report must be accepted. Retain the database-clock sample, exact input,
outcome, row, and count, and assert exactly one open row with every stated
field, including `reported_at = lifecycle_report_db_before`,
`scheduled_for IS NULL`, and `completed_at IS NULL`, with total request count
1. This is a fixture provenance gate; it does not add a reporting-time rule.

Because every later completion in S2-02, S2-04, and the relevant scheduled
path of S2-07 occurs after this retained pre-report database-clock sample, the
existing v2 completion gate `completed_at >= reported_at` is satisfiable. The
v2 same-session completion bracket, null pre-state, exact-row assertions, and
DB-clock proof remain required without relaxation. No caller completion time
is accepted as a substitute.

## Retained chronology probes

S2-10 remains the early-completion proof: it retains its future
`reported_at`, its DB-clock brackets, and assertions that accepted
`completed_at >= reported_at` and `completed_at < scheduled_for`. It continues
to prove that `scheduled_for` is not a completion lower bound.

S2-11 remains the before-reported-at non-mutation proof: it retains its future
`reported_at`, requires a pre-completion DB sample strictly before that value,
requires rejection, and runs the v2 complete-row non-mutation gate. It
continues to assert no outcome at or after the boundary.

## Pass rule

Apply v2's pass rule unchanged, with its ordinary S2-01 through S2-07
prerequisite interpreted as the Stage 2 lifecycle prerequisite above. A run
passes only if all retained v2 requirements and this replacement fixture gate
pass. Missing clock provenance, an inability to establish the stated temporal
ordering, or any otherwise incomplete evidence is inconclusive, not a pass.

This repair neither changes the requirement that completion use the trusted
database clock nor broadens authority, scheduling, reporting, or lifecycle
policy.
