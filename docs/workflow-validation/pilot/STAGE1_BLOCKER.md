# HB-WV-S1-01 — meaning of nonblank description

Status: **RESOLVED BY HD-WV-001**. Stage 2 and later had not started at the
time of the blocker.

## Decision needed

Does a whitespace-only equipment-fault description count as nonblank?

## Why existing requirements do not decide it

The packet says `nonblank`; the frozen acceptance design deliberately leaves
the whitespace definition undecided. The current operation rejects only the
zero-length string. No existing Business Activity, rule, or DDL constraint
selects a whitespace policy.

## Recommendation

Reject whitespace-only descriptions after a documented trim/whitespace rule:
a fault report containing no visible operational description has no useful
maintenance purpose. Cost: the rule must name its whitespace/normalization
boundary and can reject legacy-looking input.

## Alternative

Treat only the empty string as blank. This is simpler and preserves all other
text exactly, but permits reports with no visible description.

## Impact and minimum answer

Affected: Stage 1 reporting, DDL validation if desired, operation predicate,
and Stage 1 acceptance amendment. The minimum answer is: whether whitespace-
only is rejected and, if so, the intended trim/whitespace rule.

## Independent review observations

The Sol review also found an acceptance-instrument defect: S1-04 checks only
that two observation times differ, not that each request retains its supplied
time; it should be amended mechanically after the Human Decision. The supplied
runtime run reached `STAGE1_ACCEPTANCE_PASS` in a disposable schema, but did
not retain every per-case observation required by the frozen evidence contract.
This is evidence/instrument repair, not a new Business policy.

## Resolution provenance

The original review supplied a recommendation and alternative. The whitespace
detail was genuinely escalated. Human clarification then selected rejection of
whitespace-only input and delegated the predicate choice under the amended
candidate workflow. The original frozen contract had not specified whitespace
cases; a new acceptance version is required before implementation repair.
