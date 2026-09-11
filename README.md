# Alder

English | [日本語](README.ja.md)

**Find gaps in your specification through implementation.**

Alder starts from a lightweight description of business operations: who performs the work, what triggers it, what it receives, what it does, and what it produces. We refer to this description of operational work as **Business Design**.
Alder studies a loop in which AI or developers implement that description, then AI reviews the implementation to narrow down gaps, differences in meaning, and unresolved requirements into questions people can decide.
By tracing the meanings, units of work, constraints, and guarantees made concrete in code back to the specification, the loop does not require every requirement to be fully settled before coding begins.

It combines **established software engineering practices**: requirements description, implementation, walkthroughs, reviews, bidirectional traceability, Decision Records for assumptions and rationale, and human judgment. It proposes no new design theory or architecture and prescribes no code layout.

**Describe the work → Implement → Review → Human Decision → Update**

## Question the requirements you think are already decided

Can your specification actually support the work?

It is natural for Business Design to leave questions open. Implementation turns that ambiguity into concrete choices about data, state, authority, units of work, and guarantees. For example, tracing an approval through the subsequent purchasing work can reveal questions about exactly what “approved” authorizes.

A reasonable interpretation chosen by a developer or AI is not necessarily an approved operational decision. The review traces implementation choices back to the specification and returns questions to people where another reasonable interpretation would change the current work or its guarantees. Decision Records and tests are evidence of intent and behavior, not substitutes for approval by the people responsible for the work.

Does this require a new method? Alder uses established practices such as requirements validation and review. The current research focuses on using them as a development loop that AI can execute repeatedly.

## Development loop — Design the work. Verify it through implementation.

1. **Business Design** — Describe the current work and how it connects to preceding and subsequent work.
2. **Implementation** — AI or developers implement it and record the assumptions and decisions they make.
3. **Review** — AI compares the operational description, implementation, DDL, Decision Records, and tests. It walks through the work from each participant’s perspective and traces meanings made concrete by the implementation back to the description.
4. **Human Decision** — For unresolved questions with concrete effects on the current work, present the conditions, evidence, and decision responsibility so that the people responsible for the operations can decide.
5. **Update** — Reflect those decisions in the specification and implementation, then continue the loop.

The review distinguishes definite requirements mismatches, questions requiring operational clarification, technical improvement candidates, and confirmation that the existing behavior is sufficient. **A request for operational clarification (“Business確認” in the research records) is not automatically an implementation change request.** If an external procedure or an existing contract supplies the required meaning, the question can be closed after confirming that basis.

## Recommended Business Design format

The current research recommends **5W1H, with How written as Input → Procedure → Output**, to make relationships between activities traceable. This is the current reference format used by the evaluated cases, not a mandatory input specification. Equivalent review behavior has not been established for arbitrary specification formats.

| Field | What to describe |
| --- | --- |
| What | The name of the work. We consider it necessary to identify the activity. |
| Why | Its purpose, stated briefly enough to help explain decisions and constraints. Deep purpose analysis is not required. |
| When | Its trigger. Prefer work that starts in response to a preceding result, external event, or state change. |
| Who | Who performs the work, makes the judgment, or bears responsibility. |
| Where | A site, location, or channel when it affects operational decisions or procedures. Otherwise, “not specified” is sufficient. |
| How | Input: what is received from preceding work, users, or external sources → Procedure: what is decided or processed → Output: what is passed to subsequent work as an established fact. |

The point is not to fill every field mechanically. It is to **identify the activity through What and trace relationships between activities through Who / When / Input / Output**.

A When such as “whenever the person feels like doing it” makes timing depend on individual initiative. If human discretion itself is the operational trigger, state that discretion explicitly. This recommendation helps describe work consistently; it is not an additional rule in the review knowledge.

Examples (Japanese): [Facilities maintenance](business-design/facilities-maintenance/README.md) / [Purchase requests](business-design/purchase-request/README.md) / [Meeting-room reservation](business-design/meeting-room/README.md)

## Review knowledge v0.3

The current [review knowledge v0.3](docs/phase2/review-knowledge-v0.3.md) is a research candidate with three questions, two procedures, and one classification condition.

| Item | Question or procedure |
| --- | --- |
| Q1 | Can the work continue while preserving the facts? |
| Q2 | Can the causes of constraints and their remaining effects be explained? |
| Q3 | Do meaning, conditions, and guarantees connect across preceding and subsequent work? |
| P1 | Walk through the work from each participant’s perspective. |
| P2 | Trace back from the meanings chosen by the implementation. |
| S | Confirm the meaning, then stop unnecessary requirements. |

Use Business Design to establish the scope and check that the work flows forward. Apply Q1–Q3 through P1 / P2, examine the concrete effects and dependencies of any differences found, and finally classify them with S. See the linked document for the full scope, stopping conditions, and classifications.

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

The [review knowledge validation record](docs/phase2/review-knowledge-v0.3.md) links the evidence and documents the finding that did not recur.

## What Alder does not prescribe

- Architecture style, code placement, or layers.
- A new domain modeling method or a proprietary modeling language.
- Turning every undocumented detail into a feature requirement.

Alder is not offered as a framework, package, or CLI. Experimental implementations in this repository are evaluation material. Its responsibility does not extend beyond the operational dependencies under review into general architecture guidance or external-boundary reviews as a whole.

## Current status and next questions

The current status is **research candidate**. Review knowledge v0.3 is saved for reference; it has not been established as a universal, normative rule set.

Next questions concern the respective roles of pre-implementation and post-implementation review, integration into development workflows and AGENTS.md, and low-cost regression checks when review knowledge changes.

The [evaluation operating policy](docs/evaluation-plan.md#review-knowledge-benchmark-operation-2026-09-11) prioritizes reuse of the existing three benchmarks as a fixed set. For a local change, rerun only affected cases. Reproducing every past finding is not a pass condition; assess the capability targeted by the change and whether excessive requirements are introduced.

## Repository map

| What to read | Reference |
| --- | --- |
| Examples of operational descriptions | [Facilities maintenance](business-design/facilities-maintenance/README.md) / [Purchase requests](business-design/purchase-request/README.md) / [Meeting-room reservation](business-design/meeting-room/README.md) |
| Review questions, procedures, boundaries, and validation evidence | [Review knowledge v0.3](docs/phase2/review-knowledge-v0.3.md) |
| Benchmark reuse and local reruns | [Evaluation operating policy addendum](docs/evaluation-plan.md#review-knowledge-benchmark-operation-2026-09-11) |

The Business Design examples, review knowledge, and recent review records are in Japanese.

### Historical / earlier research — Scope-First

The initial Scope-First research explored a small repository contract for AI-assisted development. It proceeded from Phase 1 to preregistered evaluation. After an authentication failure in the initial execution environment, a four-pair pilot comparison was completed using fresh agents. Its result was **NO_PRACTICAL_SEPARATION_OBSERVED**, and the candidate was not promoted to normative rules. Read this separately from the current review knowledge research.

- [Research synthesis](docs/research.md) / [Candidate proposal](docs/proposal.md) / [Sources and evidence boundary](docs/sources.md)
- [Preregistered evaluation plan](docs/evaluation-plan.md) (with the current evaluation operating policy appended)
- [Freeze record](docs/phase2/freeze-record.md) / [Frozen candidate](docs/phase2/candidate-contract.txt) / [Matched task packets](docs/phase2/task-packets.md)
- [Run record and invalidity log](docs/phase2/run-record.md) / [Pilot results](docs/phase2/results.md)
