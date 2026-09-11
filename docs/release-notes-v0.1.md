<!-- Release preparation only: supersedes the draft in Issue #39. Do not publish a release or tag from this PR. After merge, create v0.1 separately and pin artifact links to that tag before publication. -->

# Alder v0.1 — first research checkpoint

**Find gaps in your specification through implementation.**

Alder starts from a lightweight description of business operations: who performs the work, what triggers it, what it receives, what it does, and what it produces. We refer to this operational description as Business Design. This checkpoint combines established requirements validation, implementation, and review practices. It brings together research on using implementation primarily by AI agents and review by a separate agent or fresh context to expose gaps, differences in meaning, and unresolved requirements, then return questions to people for a decision.

## Highlights

- Added practical adoption guidance and copyable implementation, separate review, and human-decision follow-up prompts.
- Kept English and Japanese READMEs as short entry points, with detailed adoption, philosophy, and validation documentation in English.
- Explored the loop **Describe the work → Implement → Review → Human Decision → Update**. It does not assume every requirement must be fully settled before implementation begins.
- Carried out implementation and fresh reviews on three operational benchmarks: facilities maintenance, purchase requests, and meeting-room reservation.
- Saved review knowledge v0.3 as a research candidate: three questions (Q1/Q2/Q3), two procedures (P1/P2), and one classification condition (S).
- Combined established software engineering practices: requirements validation, walkthroughs, reviews, bidirectional traceability, records of assumptions and rationale, and human judgment. Alder proposes no new design theory or architecture.

Alder v0.1 is the release version; the included review knowledge retains its research version v0.3. You do not have to choose an architecture up front when there is no strong requirement. Introduce structure where concrete needs justify it; this checkpoint does not establish architecture or maintainability benefits.

## What we learned

Implementation turns ambiguity in Business Design into concrete choices about data, state, units of work, authority, and guarantees. In the existing cases, tracing those choices back to the operational description exposed meanings that could not simply be treated as already approved and returned them for Human Decision.

Within this fixed set, retaining the concrete work or Output affected, the conditions for it to hold, and the responsibility for deciding proved useful without prescribing a solution first. A request for operational clarification is not automatically an implementation change request. If an external procedure or existing contract supplies the required meaning, the question can be closed after confirming it. Decision Records and tests establish intent and behavior, not approval by the people responsible for the work.

In the meeting-room case, the review retained a question about what a list labeled “available for reservation” guarantees, while accepting legitimate rechecks later and avoiding a prescribed solution such as restricting searches to future times.

## Validation limits

- This is a research candidate. Generalization and a causal improvement in detection rates remain unproven; completeness is not guaranteed.
- The same finding is not deterministically reproduced in every fresh run. Responsibility for reconciling a saved reservation when result delivery is interrupted and the reservation ID is lost was identified in #34, but did not reappear as a main finding in #36.
- Facilities maintenance (#32) and purchase requests (#33) evaluated the revision from #31; meeting-room reservation (#36) evaluated the Q3 Boundary revision from #35. All three cases were not rerun after that final revision.
- Regression checks prioritize reuse of the existing three benchmarks as a fixed set. Local changes trigger reruns of affected cases only. Reproducing every past finding is not a pass condition.

## Included artifacts

- [Practical adoption guide](https://github.com/mk3008/alder/blob/main/docs/adoption.md) / [Philosophy](https://github.com/mk3008/alder/blob/main/docs/philosophy.md) / [Validation overview](https://github.com/mk3008/alder/blob/main/docs/validation.md)
- Business Design examples: [Facilities maintenance](https://github.com/mk3008/alder/blob/main/business-design/facilities-maintenance/README.md) / [Purchase requests](https://github.com/mk3008/alder/blob/main/business-design/purchase-request/README.md) / [Meeting-room reservation](https://github.com/mk3008/alder/blob/main/business-design/meeting-room/README.md). The current recommended format is 5W1H with How expressed as Input → Procedure → Output, not a mandatory input specification.
- [Review knowledge v0.3, validation evidence, and limits](https://github.com/mk3008/alder/blob/main/docs/phase2/review-knowledge-v0.3.md)
- Fresh regression review records: [Facilities maintenance #32](https://github.com/mk3008/alder/issues/32#issuecomment-5630178622) / [Purchase requests #33](https://github.com/mk3008/alder/issues/33#issuecomment-5630314919) / [Meeting-room reservation #36](https://github.com/mk3008/alder/issues/36#issuecomment-5633135941)
- [Evaluation operating policy](https://github.com/mk3008/alder/blob/main/docs/evaluation-plan.md#review-knowledge-benchmark-operation-2026-09-11)

The examples, review knowledge, and recent review records are in Japanese. Earlier Scope-First research and pilot results remain available as historical records. Alder prescribes neither an architecture style nor code placement and is not offered as a framework, package, or CLI.

## Next

- Clarify the respective roles of pre-implementation and post-implementation review.
- Evaluate the documented adoption workflow and AGENTS.md routing in product use.
- Establish low-cost regression checks when review knowledge changes.
