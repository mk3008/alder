# Candidate workflow — one-case validation

Status: candidate procedure; not normative rules or a comparative result.

1. Describe the next Business Activity by performer, time, purpose, Business
   Data, and currently known rules. Maintain only the current horizon; do not
   wait for every future feature.
2. Check the activity against earlier activities, rules, and relational DDL.
   Repair implementation defects and logical consequences with verification.
   In pre-release work, amend DDL when a decided meaning cannot be represented.
3. If a required outcome, authority, allowed state, or data meaning is not
   determined, stop the dependent work and return one grouped Human Decision:
   uncertainty, recommendation and trade-off, alternatives, impact, and the
   smallest answer needed. Do not invent policy.

When an existing business requirement establishes the intent, specify the
ordinary reversible validation, representation, or implementation mechanism
needed to realize it using repository conventions or standard available
facilities; record and verify consequential choices. Missing detail or multiple
implementation techniques alone are not reasons to stop. Escalate only a
concrete business-policy choice outside that delegation and its impact; this
does not delegate authority, business limits, rounding, or lifecycle policy.
4. Implement the current accepted horizon, then run all active acceptance
   conditions against the current code.
5. Reassess physical structure after the consistency check. Place a decision at
   the narrowest meaningful semantic boundary owning it and containing current
   required consumers. Keep implementation details as internal as the language
   and topology reasonably permit; folders express intended range, while
   enforcement is separate. Add, move, combine, or remove structure only when
   current ownership/consumers justify it; technical role alone is insufficient.
6. Record inputs, decisions, DDL/behavior changes, tests, review, adopted
   snapshot, and remaining limits. Code reuse is optional; a shared business
   invariant may require one authority without requiring a shared model/service.

This orders established business-process analysis, relational integrity,
information hiding/encapsulation, cohesion/common closure, deferred design,
refactoring, and regression verification. Their prior support does not prove
that this ordering works in the present pilot.

## Worker instruction

Follow the current Business Activities, accepted Business Rules, DDL, and
acceptance conditions. Implement only the current horizon. Resolve defects and
logical consequences with verification; do not invent business policy. After
consistency review, reassess physical placement: choose the narrowest meaningful
semantic boundary that owns each decision and contains its current required
consumers. Do not preserve or add structure merely by habit; do not change
observable behavior during refactoring.

Where stated business intent needs an ordinary reversible validation or
representation detail, select a repository convention or standard available
facility, then record and verify it. Do not stop merely because details or
implementation techniques differ; escalate only business-policy choices outside
that delegation, never by silently changing authority, limits, rounding, or
lifecycle meaning.
