# Pilot decisions and amendments

## HD-WV-001 — description whitespace validation

Date: 2026-09-05. This resolves HB-WV-S1-01 without deleting its historical
record.

A fault description containing the empty string or only whitespace is invalid.
The implementation worker is delegated to choose a standard available
whitespace predicate, record its function/version/locale scope, and prove at
least ASCII space, tab, newline, ideographic (full-width) space, and mixtures
are rejected. This is input validation only: it must not judge prose meaning,
remove invisible characters generally, or normalize storage. Any description
containing a non-whitespace character is stored exactly as supplied, including
leading/trailing whitespace.

This is an external clarification of business intent plus delegated technical
mechanism selection. It is not evidence that the original candidate procedure
automatically resolved the ambiguity.

## HD-WV-002 — completion timestamp and early completion

Date: 2026-09-05. This is an external business-policy selection resolving
HB-WV-S2-01; it was not derived by the candidate procedure.

An authorized technician's successful completion operation establishes the
business completion. `completed_at` is the trusted database clock value adopted
by that same operation and is used consistently for its chronology decision and
stored fact. Caller/technician supplied time is not authoritative. This does
not claim that the database detects physical work completion; offline, later
reported, and external completion feeds are out of scope.

`scheduled_for` is a plan, not a lower bound: a scheduled request may complete
before it. Existing open/scheduled/completed and actor conditions remain active.
The new Stage 2 rule is `completed_at >= reported_at`; if the DB time cannot
satisfy it, completion is rejected with no request mutation. The concrete time
retrieval, locking, and test technique remain delegated implementation choices.
Stage 1 report time storage is unchanged.

## HD-WV-003 — retain open requests on safety closure

Date: 2026-09-10. Authority: [Human Decision](https://github.com/mk3008/alder/pull/3#issuecomment-5616372481).
This resolves HB-WV-S3-01 prospectively, preserving its historical record.

When safety closure is recorded for equipment with an existing open maintenance
request, retain that request unchanged as `open`. Reject scheduling while the
equipment is `safety_closed`. Do not add cancellation, a dedicated blocked
state, or a closure-specific workflow for this case.

The request and equipment safety state express separate Business facts: the
reported fault remains outstanding while equipment state determines scheduling
eligibility. This is an external Human Decision, not a logical consequence
proved by the earlier implementation or the contradictory frozen S3-02.

Impact: safety closure, coordinator scheduling, equipment/request state and
S3-02 acceptance. Existing DDL represents both facts without amendment. This
does not decide closure of scheduled requests or other future lifecycle policy.
