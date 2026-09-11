# Validation and research status

[Back to Alder](../README.md)

The current status is **research candidate**. Review knowledge v0.3 is not a universal, normative rule set.

## What has been validated

Implementation and fresh reviews were carried out on three existing operational benchmarks. In fresh regression reviews, agents reviewed fixed implementations without consulting earlier review results.

| Benchmark | Operational scope | Fresh regression review |
| --- | --- | --- |
| Facilities maintenance | Fault reporting, scheduling, completion, safety closure and reopening | [#32](https://github.com/mk3008/alder/issues/32#issuecomment-5630178622) |
| Purchase requests | Submission, approval or rejection, purchase completion | [#33](https://github.com/mk3008/alder/issues/33#issuecomment-5630314919) |
| Meeting-room reservation | Availability checks, booking, changes, cancellation, availability management | [#36](https://github.com/mk3008/alder/issues/36#issuecomment-5633135941) |

Within this fixed set, reviews identified unresolved operational questions and retained them as candidates for Human Decision without prescribing particular implementation solutions. In the meeting-room case, for example, the review retained a question about what a list labeled “available for reservation” guarantees, while accepting legitimate rechecks at booking time and avoiding a prescribed solution such as restricting searches to future times.

**Validation limits:**

- Not every defect will necessarily be detected; completeness is not guaranteed.
- The same findings do not recur in every fresh run. Responsibility for reconciling a saved reservation when result delivery is interrupted and the reservation ID is lost was identified in #34, but did not reappear as a main finding in #36.
- A causal improvement in detection rates and generalization remain unproven.
- #32 / #33 evaluated the revision from #31; #36 evaluated the Q3 Boundary revision from #35. All three cases were not rerun after that final revision.

The [review knowledge validation record](phase2/review-knowledge-v0.3.md) links the evidence and documents the finding that did not recur.

## Next questions

The optimal division between pre-implementation and post-implementation review, workflow integration, and low-cost regression checks remain research questions. Architecture effects and long-term maintainability have not been validated.

The [evaluation operating policy](evaluation-plan.md#review-knowledge-benchmark-operation-2026-09-11) prioritizes the existing three benchmarks. Rerun affected cases for local changes; reproducing every past finding is not a pass condition.

## Historical / earlier research — Scope-First

The initial Scope-First research explored a small repository contract for AI-assisted development. It proceeded from Phase 1 to preregistered evaluation. After an authentication failure in the initial execution environment, a four-pair pilot comparison was completed using fresh agents. Its result was **NO_PRACTICAL_SEPARATION_OBSERVED**, and the candidate was not promoted to normative rules. Read this separately from the current review knowledge research.

- [Research synthesis](research.md) / [Candidate proposal](proposal.md) / [Sources and evidence boundary](sources.md)
- [Preregistered evaluation plan](evaluation-plan.md) (with the current evaluation operating policy appended)
- [Freeze record](phase2/freeze-record.md) / [Frozen candidate](phase2/candidate-contract.txt) / [Matched task packets](phase2/task-packets.md)
- [Run record and invalidity log](phase2/run-record.md) / [Pilot results](phase2/results.md)
