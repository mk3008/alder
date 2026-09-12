# HB-WV-S2-01 — completion time and schedule relation

Status: **RESOLVED BY HD-WV-002**. Stage 2 implementation remains unadopted;
Stage 3 and later had not started at the blocker.

## Decision needed

1. Is completion time supplied by a technician/external authority, or recorded
   from the trusted application/database clock?
2. May maintenance complete before its scheduled time (`completed_at <
   scheduled_for`)?

## Why existing requirements do not decide it

Stage 2 says a technician completes a scheduled request “at completion time”
and scheduling is for a future time. It supplies neither the time authority nor
the relation between completion and scheduled time. The frozen contract itself
identified completion-time authority as unselected, yet the implementation used
`clock_timestamp()` and its evidence shows completion before both scheduled and
reported times. This is not a reversible implementation detail.

## Recommendation

Use a trusted application/database clock for `completed_at`; require at least
`completed_at >= reported_at`; explicitly decide whether early completion is
permitted. A conservative alternative is to reject early completion. It makes
the scheduled time a lower bound but may not fit work completed ahead of plan.

## Alternative

Accept a supplied or external-authoritative completion time. This supports
offline/external reporting but additionally requires its trusted source and
past/future validation policy.

## Impact and work not adopted

Affected: Stage 2 completion operation, cumulative acceptance S2-02/S2-04,
time/chronology gates, and possibly optional DDL protections. The minimum answer
is the two decisions above. Stage 1 and the unadopted open→scheduled evidence
are preserved; the committed Stage 2 `PASS` is not accepted because its
case-evidence and non-mutation gates were also incomplete.

## Resolution provenance

The original review supplied a recommendation and alternative. Human selected
trusted DB time, permitted early completion, and added the `completed_at >=
reported_at` condition. Repeated notifications of this unchanged blocker are
not separate discoveries or execution/review runs. Dependent work resumes once
under a new acceptance version; prior snapshots remain historical.
