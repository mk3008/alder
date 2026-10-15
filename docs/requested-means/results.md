# Issue #47: when to challenge requested means

**Recommendation: revise and retest before adoption.** A bounded comparison of requested means with stated ends is a plausible implementation-task aid. Most authority and review safeguards already exist in Alder. This investigation does not establish incremental agent benefit, so it supports no permanent rule or Review knowledge change.

The useful candidate is narrower than “question the goal”: notice an evidenced, material disadvantage in a requested means relative to the **stated** goal and full constraints, then act within delegated authority. Do not discover an imagined true request. Review should still surface actual violations and unresolved business meaning, including when the approach was explicitly chosen.

Research for [Issue #47](https://github.com/mk3008/alder/issues/47), using baseline `af5e2232e367a3784a3fbb25d16d7e69fc89d715`. Read the [method](plan.md) and [conditional scenarios](scenarios.md). This is a document-based qualitative investigation, not an agent behavior experiment.

## Evidence ledger: what already exists

All repository references below are to the inspected baseline. The links remain in the same repository so readers can follow the full text; the recorded SHA fixes the investigated versions.

| Source / location | Observed document content or previously reported result | Implication for the proposal |
| --- | --- | --- |
| [Philosophy: Why not settle every decision before implementing?](../philosophy.md#why-not-settle-every-decision-before-implementing) | Permits a light check for obvious contradictions/blockers; implementation makes assumptions concrete; optimum pre/post division is unverified. | The proposal does not introduce pre-implementation reasoning itself. It must not turn that light check into exhaustive goal discovery. |
| [Philosophy: AI coding and architecture](../philosophy.md#ai-coding-and-architecture) | Neither recommends nor prohibits styles or when structure is introduced; explicit constraints, risks and desired properties are inputs. | A named architecture cannot itself trigger an objection. Structure can be justified by a requirement even when a smaller design exists. |
| [Adoption §3](../adoption.md#3-let-the-ai-implement-without-inventing-business-policy) | Requires relevant Business Design, existing conventions, material Decision Records, focused Human Decisions for unresolved business choices, and continued independent work. Routine reversible choices do not require Human Decision. | Already supplies most scope, authority and clarification protection. It does not explicitly distinguish a merely suggested means from a materially disadvantageous but otherwise valid explicit means. |
| [Adoption §4](../adoption.md#4-run-a-separate-alder-review-after-implementation) | Review only; no prescribed architecture/UI/model when multiple means satisfy business meaning; an external contract can establish sufficiency. | Review is not a general implementation-optimization contest. |
| [Review knowledge P2 and S](../phase2/review-knowledge-v0.3.md) | Technical differences alone do not create undecided business meaning; tests/Decision Records do not replace approval; sufficient meaning and responsibility close the question. | Existing boundaries already address the feared table flip. “Approved approach” does not prove all its consequences are decided or correct. |
| [Historical Scope-First pilot](../phase2/results.md) | Reported no practical separation in its small comparison despite plausible guidance. | A coherent candidate may add no operational value. This is an analogy about evaluation, not evidence against this candidate. |
| [Architecture follow-up](../maintenance-risk-review/results.md) | Reported provider isolation and an additional injected test seam without cumulative line-proxy recovery; cost and capability axes differ. | A claim that an alternative is cheaper must retain desired properties and relevant costs. Fewer layers/files/lines are insufficient. This experiment did not test objections to requested means. |
| [Validation and limits](../validation.md) | Existing fixed-set reviews retained business questions without fixed solutions; findings vary by run; causal detection improvement remains unproven. | These records motivate preserving the review boundary, but do not establish the frequency of table flips under a new instruction. |

## What would actually change in the instruction

The candidate adds a **trigger to communicate a tradeoff before committing to an otherwise feasible requested means**. For example, in hypothetical P1 the new service could meet the approval requirement, yet a supported estimate identifies avoidable deployment/ownership burden. This need not be a Business Design defect. Existing Alder permits sensible implementation judgment but does not explicitly require this comparison or say how a confirmed choice ends the discussion.

That is an instruction-level difference, not an observed agent-level change. Current agents may already make the same comparison under normal task instructions; extra text could improve salience, do nothing, or increase friction. F1/M5 are not evidence of new capability: current Alder already handles those concrete requirement conflicts.

## Candidate decision boundary

The following is an analytical candidate, **not recommended prompt text or an adopted Alder rule**:

1. Establish the stated goal, acceptance conditions, current Business Design, explicit constraints, and actual delegation. A suggested means permits more discretion than an explicit requirement. A clear reasonable instruction needs no routine confirmation of its status.
2. Intervene only with a concrete contradiction or a material, supported disadvantage affecting effectiveness, feasibility, risk, or lifecycle cost. Explain the affected property and evidence. An architecture name, undocumented preference, hypothetical future, or shorter alternative is insufficient.
3. For an otherwise valid means, compare a smallest useful alternative that preserves all stated requirements. Include switching cost and lost capabilities. Prefer existing evidence or ordinary bounded verification; do not block a harmless reversible task to exhaust the design space.
4. Where technical choice was delegated, choose within that delegation. Where the requested means is explicit, make a concise recommendation and seek only the decision necessary before substituting it. Do not implement a competing means while waiting. Continue independent authorized work. A conflict with current Business Design needs its responsible decision owner, not a fabricated approval record.
5. Stop when the choice is reasonable and no material evidence warrants objection; or when the responsible user has considered the tradeoff and confirmed a feasible choice. Record material rationale where appropriate. Reopen only for materially new evidence or an unresolved concrete conflict; repeated advocacy based on unchanged evidence is not helpful.

“Material” is task-relative: a tiny trial and an irreversible migration do not justify the same interruption. Evidence should connect the consequence to the user's acceptance conditions or actual constraints. A universal percentage, mandatory alternatives list, or fixed clarification quota would be unsupported by this investigation. One focused decision can need follow-up if the answer leaves a real contradiction; “ask once” must not become permission to guess.

## Where it helps and where it overreaches

The [contrast analysis](scenarios.md) identifies a plausible useful niche in M1/P1: evidence-backed, avoidable burden before commitment. M2/F2 show why ordinary reversible work should continue. M3/P2/P3 demonstrate that confirmed experiments, ownership requirements and reasonable explicit style choices cannot be optimized away.

The unbounded reading creates a path to asking for reasons behind every choice, ignoring a confirmed experiment, adding speculative architecture, or converting a feasible solution into a review blocker. These are **analytical failure mechanisms**, not observed model failures. The full Issue proposal already recognizes many of these dangers; the unbounded foil is not a substitute for testing that proposal fairly.

The bounded candidate has its own residual risks: “material” can invite exaggerated cost estimates; “confirmed intent” can cause unnecessary confirmation; agents may call an explicit instruction merely a suggestion; preserving a choice may become excessive deference. M2, M3, P3 and F3 expose these risks. The candidate is not proven safe merely because its wording names them.

## Implementation versus review

The requester's directional hypothesis is plausible but needs qualification. **Evidence and the authorized task matter more than timing alone.**

| Situation | Implementation time | Post-implementation Alder review |
| --- | --- | --- |
| Material alternative, current means still satisfies requirements | A brief comparison may prevent avoidable work before commitment. Respect explicit authority. | Do not reopen satisfied business meaning merely because another approach is attractive. A concrete technical improvement can be classified as such within review scope, without promoting it to Business confirmation. |
| Demonstrated requirement/guarantee violation | Surface it before committing; fix within scope or retain the unresolved decision. | Still surface it. Approved means and passing tests do not suppress M5/F3. |
| Unresolved business meaning fixed by the implementation | Focus the Human Decision on its consequence and owner. | P2/Q3/S already apply, as in M6; no new “challenge means” principle is needed. |
| Reasonable explicit choice with no material contrary evidence | Proceed without demanding justification. | Recognize sufficiency; do not prescribe a competing architecture. |

Therefore a blanket “development may challenge, review must not challenge” rule would be wrong. Conversely, copying an implementation optimization instruction into Review knowledge would broaden its purpose without demonstrated benefit. A separately requested architecture/cost audit can compare alternatives after implementation, but should include remaining benefits and migration cost and use that audit's own acceptance conditions.

## Placement and recommendation

| Option | Assessment |
| --- | --- |
| Add to philosophy | No new philosophical principle established; current intent/architecture neutrality already covers the core position. |
| Add to Review knowledge | Not supported. Existing P2/S and Q1–Q3 cover the legitimate review findings; no demonstrated missing capability. Preserve them. |
| Add to general AGENTS.md | Premature and broad: it would apply to harmless tasks and reviews as well as implementation. |
| Optional implementation/adoption task guidance | Best candidate location **if incremental utility is later observed**: near §3's decision/delegation boundary, without injecting full review knowledge into implementation. |
| Add nowhere | Appropriate if the existing control already takes the useful action. This remains a live outcome. |

Choose **revise and retest**, with **insufficient behavioral evidence for adoption**. Retesting is a possible later decision, not unfinished execution of this qualitative research. No permanent text, release documents, prompts, Business Design, tests, or past research records are changed here.

If a later adoption decision warrants a behavioral check, the smallest useful comparison would hold the current Alder packet constant and add only the bounded candidate. Contrast a supported costly-but-feasible request with a confirmed choice and a harmless reversible edit, plus a valid review defect and a sufficient implementation. Preserve requests, exact baseline sources, all responses and deviations. Assess useful intervention, unauthorized substitution, unnecessary clarification, continued progress and missed valid findings separately. An unbounded arm is optional; it must not be the only control. Use independent contexts without the requester's expected answer or this answer key. The current investigation specifies no model, sample size, numerical pass threshold, or claim of preregistration for such a later study.

## Uncertainty, execution and stop decision

- No agent treatment runs, implementation trials, human-user observations, performance measurements, or new application test executions were performed. The 13 scenarios are authored analytical cases, not independent observations.
- The same investigator selected cases, defined candidate actions and interpreted them. This supports inspectable counterexamples, not inter-rater reliability or causal inference.
- Stipulated profiles/cost estimates favor identifying clear decisions; the practical effort and reliability of acquiring such evidence are unmeasured.
- Whether the candidate improves ordinary agents, how often clarification is excessive, and whether behavior transfers across models/domains remain unknown. The hypothesis about harmful review behavior is not empirically confirmed.
- Existing benchmark results are cited as historical records, not rerun results. No existing acceptance criterion has been changed to favor the candidate.

The investigation stops because it has isolated the potential addition and its necessary boundaries, while identifying the exact evidence missing for adoption. More paper scenarios cannot establish behavioral effectiveness. The appropriate reviewable outcome is this research recommendation, not a permanent Alder change.

Artifact verification: Git blob hashes matched all 456 baseline files, and all 28 relative document links (including explicit heading anchors) resolved. These checks establish unchanged source material and navigable research documents, not correctness of the candidate's behavioral predictions.
