# Cumulative Stage 1–4 acceptance — clear safety closure

Frozen on 2026-09-10 after Stage 3 adoption, before Stage 4 implementation.
Sources: `stage4-packet.md`, Stage 4 of `acceptance-design.md`, HD-WV-001/002/003,
and cumulative `stage3-acceptance-v2.md` including all its prior contracts.
No additional Human Decision is needed for the cases below. All earlier cases,
full-row/count gates, authority evidence, temporal discipline and limits remain
mandatory against the current Stage 4 candidate. This freeze is not a pass.

## Fixture/evidence discipline

Run the frozen DDL and current business operations in one fresh isolated schema.
Retain source hashes, actual database version/locale/session/schema, exact inputs,
actor-to-role fixture mappings, accepted/rejected outcomes, complete before/after
rows and total counts. Error encoding and operation interface are not prescribed.
Each case starts with available known equipment and zero requests. Establish
closure through an authorized operation and gate safety_closed before clearing.

## S4-01 — inspector clears an existing closure

With known equipment closed and no requests, an authorized safety inspector
clears closure. Accept, assert exactly one equipment row retaining its id and
status available, and assert zero requests. This proves the existing closure
transition only, not repeat clearing or unknown-equipment behavior.

## S4-02 — the retained open request becomes schedulable again

Report a valid request for available equipment with reported_at equal to a
retained same-session DB sample, then gate/retain every report field, open,
null scheduled_for/completed_at and total count 1. Close equipment as inspector;
gate safety_closed and full request equality under HD-WV-003.

As coordinator, attempt a schedule at db_before + 48 hours; reject. Retain
both clock samples and prove supplied time > db_after; gate complete request
equality and count 1. Then clear closure as authorized inspector; accept,
assert equipment available and preserve the exact open row/count. Clearing
equipment is not a coordinator scheduling operation.

As reporter (no coordinator authority), attempt another future schedule; reject
with the same temporal and complete-row/count gates. As authorized coordinator,
schedule at a newly retained db_before + 48 hours; accept. Retain before/after
samples and assert supplied time > db_after, all original report fields,
status scheduled, exact schedule, null completed_at and total count 1. This
connects clearing to scheduling without relaxing Stage 2 admission conditions.

## S4-03 — a non-inspector cannot clear closure

Prepare one valid open request, close equipment as inspector, and retain the
complete open row. A demonstrably unauthorized coordinator attempts clearing;
reject. Assert equipment remains safety_closed, request unchanged and total
count 1. A subsequent authorized coordinator schedule attempt with a properly
bracketed future time must still reject, preserving that row/count. This proves
rejected clearing cannot lift the scheduling safety restriction.

## Pass/limits

Require every Stage 1–3 active case plus S4-01/02/03 with all observations and
executable gates; retain cleanup count 0. Missing evidence/failed temporal
fixtures are inconclusive, not pass. Follow consistency verification with
structural reassessment and the planned independent final review.

No new outcome is asserted for unknown equipment, already-available clearing,
scheduled requests at closure, reporting on closed equipment, repeated closure,
audit/history/notifications, concurrency, authentication enrollment or production
authorization. These unused gaps do not block the current decided horizon.
