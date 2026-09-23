# Validation and research status

[Back to Alder](../README.md)

The current status is **research candidate**. Review knowledge v0.3 is not a universal, normative rule set.

For candidate-level adoption, rejection and deferral decisions, consult the [Research Decision Index](research-decisions.md). This page summarizes validation scope; the index helps find prior decisions and their original evidence.

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

Separately, [Check Item traceability](check-item-traceability.md) was applied to Velvet's `execute-transfer` slice in Issue #43 / PR #44. The human reviewer reported that the Functional Interface + Check Item presentation was substantially easier to review than the earlier compound Check rows. Bounded AI probes then traced representative Checks forward to Business/Decision evidence, tests and code, and traced a multi-destination test backward to its Check and Decision. The same exercise distinguished missing direct test evidence from missing implementation, exposed a meaning conflict for human review, and used a meaning-preservation audit to recover guarantees that had disappeared during a formatting change.

This is one real-product slice with one human reviewer and bounded AI probes. It does not establish lower review time, higher detection rate, completeness, general applicability, or optimal title wording. Business Design remained the SSOT; reverse tracing was used diagnostically rather than to promote existing implementation behavior into business meaning.

Separately, [small exploratory architecture comparisons and follow-up evaluation](maintenance-risk-review/results.md) in Issue #45 observed isolation from boundaries suited to the tested risk. Adding a concrete future risk to current requirements also produced a local boundary without specifying an architecture style or solution. These observations do not establish long-term recovery of a comprehensive architecture's initial investment or superiority in total maintenance cost, and neither universally recommend nor reject any architecture style.

Separately, [Issue #71](behavior-derivation/issue-71.md) distinguishes check derivation from discovering undocumented conditions. Its [known-context trial](behavior-derivation/issue-71-discovery.md) and [current-version Fresh trial](behavior-derivation/issue-71-fresh-velvet.md) did not establish the adoption criterion. The subsequent [historical backtest](behavior-derivation/issue-71-historical.md) ran two agents without conversation history on frozen earlier Velvet inputs: four candidates comprised one later-decided failure boundary, one conditional unresolved question, and two already settled questions. The concrete Red-success/Black-failure boundary was not fixed by the inspected earlier design and later received explicit human/Decision treatment. This meets the bounded practical criterion for an optional discovery step. It is not evidence of general detection rates or causal prompt improvement: selection used hindsight, one historical review had unrelated open items, runtime attestation and OS input isolation were absent, and no no-prompt control ran. Raw inputs/outputs, trial prompt, read logs, evidence and missed targets are preserved. c3 and review knowledge remain unchanged.


## Optimization Review

Alder v0.6 adopts [Optimization Review](optimization-review.md) as a Problem-driven workflow capability. The review starts from an explicitly recorded operational Problem and Pain level, proposes a small set of alternative business designs, evaluates Scope and business-change Difficulty, preserves current Business meaning unless people decide to change it, and returns the adoption decision to people.

The current evidence reuses the purchase-request Business Design rather than adding a new benchmark:

- [Issue #81 initial PoC](optimization-review/issue-81.md): the reviewer stayed centered on the stated purchasing burden and produced bounded alternatives without silently changing approval or purchase-completion meaning.
- [Problem / Pain / Scope follow-up](optimization-review/issue-82-followup.md): changing the Problem moved the review focus to approval waiting and purchase-result reconciliation; Narrow, Keep and Expand were each used with stated Problem-related reasons.
- [Pain isolation](optimization-review/issue-82-pain-isolation.md): with a neutral fixed Problem, two High and two Low Fresh runs differed consistently in exploration breadth. Both High runs retained higher-difficulty investigation candidates; both Low runs stayed with narrower, lower-impact changes and explicitly stopped broader external coordination as disproportionate to the stated Pain.

The same evaluations also exposed useful stopping behavior: a restatement of the current Business Design was not counted as a new candidate, overlapping automation/delegation benefits were not treated as additive evidence, and a proposal that could delay state visibility retained that downside instead of being counted as automatically useful.

**Validation limits:**

- one Business Design and a small number of qualitative Fresh runs
- no measured operational time, error reduction, cost saving, or candidate implementation
- no proof of optimal candidate count, completeness, or universal Pain behavior
- requested model/effort and instruction-based file isolation were recorded, but independently attested runtime/model isolation was not available
- the evidence supports the adopted review behavior and its stopping boundaries; it does not establish that any generated candidate is feasible or worth adopting in a particular organization

These are evidence boundaries for the adopted workflow, not a beta/candidate status. Candidate feasibility and Business changes still require human evidence and approval.


## Next questions

The optimal division between pre-implementation and post-implementation review, workflow integration, and low-cost regression checks remain research questions. Long-term maintainability, comprehension costs, and generalization of the architecture observations remain unvalidated.

The [evaluation operating policy](evaluation-plan.md#review-knowledge-benchmark-operation-2026-09-11) prioritizes the existing three benchmarks. Rerun affected cases for local changes; reproducing every past finding is not a pass condition.

## Historical / earlier research — Scope-First

The initial Scope-First research explored a small repository contract for AI-assisted development. It proceeded from Phase 1 to preregistered evaluation. After an authentication failure in the initial execution environment, a four-pair pilot comparison was completed using fresh agents. Its result was **NO_PRACTICAL_SEPARATION_OBSERVED**, and the candidate was not promoted to normative rules. Read this separately from the current review knowledge research.

- [Research synthesis](research.md) / [Candidate proposal](proposal.md) / [Sources and evidence boundary](sources.md)
- [Preregistered evaluation plan](evaluation-plan.md) (with the current evaluation operating policy appended)
- [Freeze record](phase2/freeze-record.md) / [Frozen candidate](phase2/candidate-contract.txt) / [Matched task packets](phase2/task-packets.md)
- [Run record and invalidity log](phase2/run-record.md) / [Pilot results](phase2/results.md)
