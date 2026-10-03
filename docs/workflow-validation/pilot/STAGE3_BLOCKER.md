# HB-WV-S3-01 — effect of safety closure on an existing open request

Status: **OPEN — HUMAN DECISION REQUIRED**. Stage 3 implementation and its
recorded cumulative pass are not adopted. This record preserves the frozen
Stage 3 packet, contract, implementation snapshot, and review unchanged.

## Decision needed

When safety closure is recorded for equipment that already has an `open`
maintenance request, what is the business result for that request?

## Why the active requirements do not decide it

The Stage 3 packet requires that a request for safety-closed equipment cannot
be scheduled. The Stage 3 S3-02 fixture creates an `open` request while the
equipment is available, closes the equipment, and then requires scheduling to
be rejected with the request still `open`, unscheduled, and uncompleted.

The same frozen acceptance contract explicitly reserves the effect of closure
on existing `open` or `scheduled` requests as unresolved. S3-02 has therefore
selected, by its post-closure no-mutation assertion, that closure does not
change an existing `open` request. This is a business lifecycle choice, not an
ordinary reversible implementation detail.

## Recommendation and alternative

Recommendation: explicitly retain the open request unchanged and reject its
scheduling while the equipment remains safety-closed. This matches the
currently implemented and recorded S3-02 behavior, retains the reported fault
for later business handling, and requires no additional status/data meaning.

Important alternatives include cancelling/withdrawing the request, moving it
to a distinct blocked state, or applying a closure-specific workflow. These
may require a newly decided request state, performer, reopening condition,
notification, or audit/data representation; none is inferred here.

## Impact and minimum answer

Affected Activity/Data: safety closure; coordinator scheduling; existing
`maintenance_request` rows associated through `equipment_id`; acceptance
S3-02; and any DDL sufficiency assessment for the selected outcome.

Minimum answer: state the required post-closure outcome for an existing open
request. If it is not retained open, state the resulting business state and
whether the current DDL can express it. No answer about unknown equipment,
reclosure, scheduled requests, reversal, history, or notification is needed
unless it is required by the selected outcome.

## Related non-policy defects

The independent review also found two acceptance-instrument defects, not
additional human decisions: S3-02 lacks the post-scheduling DB-clock future
gate; S3-03 lacks the complete Stage 2 positive-fixture and exact
non-retroactivity gates. They must be repaired only after the business decision
above, because Stage 3’s current adoption remains blocked on it.
