# Issue #51: inference, validation order and evaluation budget

**Decision: add a bounded clarification to implementation/adoption guidance, with a short philosophy link. Keep review knowledge v0.3 unchanged.** Existing guidance permits reasoning and bounds business review, but does not explicitly rank technical experiments by decision value or bound their cost. This is a document-based judgment responding to [Issue #51](https://github.com/mk3008/alder/issues/51), not evidence of improved agent behavior.

## Scope and evidence

Alder baseline: `1a92a521568d3731a352f24e31036169e8efdc55`, including merged #48/#50. Velvet sources were inspected at PR #22 head `d0c971ad282e25c3b55a6bff6ce084ed1332792d` and PR #24 head `8e8a419c28d2947a499b96447fade6e41aa3b8fd`. Later changes to those PRs are outside this analysis. No Velvet implementation is changed here.

| Primary source | What it establishes |
| --- | --- |
| [Velvet #20](https://github.com/mk3008/velvet/issues/20), [PR #22 owner clarification](https://github.com/mk3008/velvet/pull/22#issuecomment-5653125860) and [response](https://github.com/mk3008/velvet/pull/22#issuecomment-5653152814) | Serverless and shared-DB constraints prompted an explicit reassessment; metadata batching remained the first experiment, not production adoption. |
| [Decision 0009](https://github.com/mk3008/velvet/blob/d0c971ad282e25c3b55a6bff6ce084ed1332792d/docs/decisions/0009-scalable-execution-evaluation.md) | Measured route costs, ownership/ordering reasons, predicted residual calls and conditional progression to bulk/materialization. |
| [#20 recorded evaluation](https://github.com/mk3008/velvet/blob/d0c971ad282e25c3b55a6bff6ce084ed1332792d/experiments/issue-20/README.md) | Full executor and reduced transport kernel have different semantics and measurement boundaries. |
| [Velvet #23](https://github.com/mk3008/velvet/issues/23) | AI-owned means, preserved semantics, finite runtime, ongoing arrivals, backlog recovery, shared-resource costs; no fixed provider budget. |
| [Decision 0010](https://github.com/mk3008/velvet/blob/8e8a419c28d2947a499b96447fade6e41aa3b8fd/docs/decisions/0010-bounded-execution-candidate.md) | Sequential metadata routines preserve visibility across trusted SQL; bounded admission retains a complete source snapshot per Run. |
| [#24 results](https://github.com/mk3008/velvet/blob/8e8a419c28d2947a499b96447fade6e41aa3b8fd/experiments/issue-23/results.md), [evaluation method](https://github.com/mk3008/velvet/blob/8e8a419c28d2947a499b96447fade6e41aa3b8fd/experiments/issue-23/README.md) | Residual calls, two observations per matrix cell, controlled recovery, instrumentation limits and unresolved production fitness. |
| [#24 owner follow-up](https://github.com/mk3008/velvet/pull/24#issuecomment-5653711139) | The objection targets evaluation order, not bounded execution itself or a mandated TEMP solution. |

These are repository records and reported measurements, not new benchmark executions or independently reproduced timings. The written rationale supports explaining the sequence; it does not expose the implementer's internal reasoning or prove Alder caused that sequence.

## What existing Alder covers

| Existing location | Coverage | Remaining gap |
| --- | --- | --- |
| [Philosophy](philosophy.md), baseline opening and architecture sections | Implementation exposes decisions; concrete risks guide technical choices; architecture neutrality. | No explicit comparison of expected effects or experiment information value. “Use implementation as evidence” can be read too mechanically. |
| [Adoption §3](adoption.md#3-let-the-ai-implement-without-inventing-business-policy), baseline implementation prompt | Requirements, risks, conventions, material Decision Records, relevant verification, delegated reversible decisions. | Does not say which candidate to test first, how long to investigate, or when to stop optional evaluation. The implementation prompt is embedded here, not a separate template file. |
| [Review knowledge P1/P2/S](phase2/review-knowledge-v0.3.md) and adoption §4 | Representative scenes, concrete consequences, sufficient meaning closes review; technical differences alone are not unresolved business meaning. | This stops business-review expansion, not technical experiment spending. |
| [#47/#48 results](requested-means/results.md) | Bounded requested-means challenge was plausible; no demonstrated incremental utility, no permanent addition. | Concerns a human-requested means, unlike choosing among delegated candidates. |
| [#49/#50 results](means-behavior/results.md) | 18 fresh contexts plus four continuations: earlier disclosure, one extra pause, no reliable incremental utility; purported globally sufficient fixture was defective. No permanent addition recommended. | Supports caution about new approval gates. It did not test inference-led candidate ranking or evaluation budgets. |

Current principles can support the better decision; they do not forbid it. The narrower instruction gap is making that reasoning govern the **next experiment**, rather than only documenting limitations after implementation. #49's historical recommendation remains intact. Adopting this scoped clarification is a normative response to the documented gap, not a reversal claiming that the rejected means-challenge candidate worked.

## Why the Velvet sequence was understandable, and where it fell short

1. **#20 identified a real cost center.** At 10,000 rows × 3 links, the executor recorded 150,012 no-op, 180,012 initial and 360,012 correction calls. Source evaluation in the no-op sample was about 49 ms, while Active/Work/Processing accumulated about 37.23 s. Targeting owned metadata rather than assuming the source scan dominated was reasonable.
2. **Conservatism protected actual contracts.** Decision 0009 recognized arbitrary trusted row SQL, allocation, key validation, cross-link ordering and atomic history. Decision 0010 chose sequential routines between stored-SQL calls to preserve metadata visibility. A bulk rewrite cannot simply assume independence. A short feasibility experiment on owned SQL was defensible, especially because #23 itself suggested it while leaving means delegated.
3. **The comparison needed a structural ceiling before a detailed matrix.** Decision 0009 already predicted tens of thousands of residual calls, even with more batching than the eventual routine implemented. The kernel's 143.32 ms memory / 25.95 ms eager TEMP / 22.94 ms deferred TEMP result at 10,000 × 3 / 1% changed was a reason to investigate relation-shaped transport, not proof that TEMP would win in the full executor. Both memory bulk and DB materialization could address call cardinality. A list of their disadvantages should have become a short feasibility question about contracts/visibility and shared-resource cost, rather than automatically placing them after metadata optimization.
4. **#23 added a time dimension that should change ranking.** Bounded admission addresses durable progress within finite Runs. It does not remove repeated complete-source evaluation or aggregate row-sized calls. The backlog requirement increased the decision value of testing whether a cardinality-changing contract was possible.
5. **#24 produced useful but limited evidence.** Initial/no-op still used 120,012 calls and correction 240,012 at 10,000 × 3. All remain proportional to keys × links. The routine was slower in that low-latency matrix: initial 93.025 versus 70.492 s, no-op 81.439 versus 58.412 s, correction 124.483 versus 109.931 s. Independent runners and two observations per cell do not establish a general causal slowdown. Controlled 600-key recovery with roughly 2 keys/s continuing intake did succeed; this is useful evidence for bounded recovery, not large-backlog production fitness.

The weak point is **deepening the constant-factor candidate before resolving whether its ceiling can meet the task and whether a structural alternative preserves the necessary contracts**. Correctness/rollback tests and the recovery experiment are not waste merely because the candidate is incomplete. Existing sources do not quantify evaluator time or show how quickly a full bulk contract could have been built, so no amount of avoidable time or proven optimal alternative is claimed.

Nor does “O(keys × links)” alone reject a candidate: a constant-factor improvement can cross a real acceptance threshold. If it does, and retained complexity/risk is lower, it may be the right answer. Here production thresholds were missing and the recorded residual traffic was already a material concern. That warranted conditional estimates and a focused feasibility probe before broad performance characterization, not an invented declaration that all row execution is unacceptable.

## Reasoning that changes the next experiment

For the inspected successful routes, let N be eligible distinct keys, L links, c route calls per pair and k fixed calls. Client calls are `C = k + cNL`. Grouping sequential metadata changes c; it does not remove N. Client-call complexity is distinct from total database work: a bulk call may still process N rows and consume more DB resources.

At an **assumed additional** 5 ms per serial call, 120,012/240,012 calls add about 600/1,200 seconds of waiting. This is arithmetic sensitivity, not measured remote RTT or a total-runtime prediction. If a known deadline is already below a defensible lower bound, more timing precision cannot rescue that route. If RTT or acceptance limits are unknown, retain the conditional conclusion and resolve the value that can change the decision.

For backlog B and an admission cap b, at least `ceil(B/b)` successful Runs are needed without new arrivals, assuming each admitted record completes. With B = 10,000 and b = 100 that is 100 Runs. If each evaluates S source rows, the model repeats approximately `S × ceil(B/b)` source-row evaluations, plus per-pair processing. This is aggregate scan/allocation work, not 100 simultaneously resident snapshots or a guarantee that smaller Runs reduce peak memory.

Let λ be ongoing arrivals and μ **durably completed** records per second under the actual recovery load. Under a constant-rate approximation, backlog drains only if μ > λ; catch-up time is approximately `B/(μ−λ)`. Failed attempts that roll back add cost without durable service. Retry/concurrency can lower effective μ through contention, so isolated successful-run speed is insufficient. These equations select meaningful measurements; they do not certify a real queue with variable load, tail latency and failures.

The next structural probe should therefore ask: can an explicit bulk contract preserve required ordering/visibility, exact keys, single evaluation, atomic rollback and ambiguous-COMMIT handling while reducing client-call cardinality? If not, reject or bound that candidate without a full performance matrix. If yes, compare its consequential memory/shared-resource costs at representative load. Do not automatically rewrite arbitrary SQL or assume a contract change is already authorized when it changes business guarantees.

## Roles, budget and human decisions

| Element | Role in the decision | Does not establish |
| --- | --- | --- |
| Inference | Eliminate impossible routes conditionally, compare effect scale/failure modes, identify the decisive uncertainty. | Production fitness from asymptotic complexity or a kernel alone. |
| Existing evidence and targeted measurement | Check assumptions, semantics, actual environment costs and shared-resource impact that can change selection. | Approval of business meaning or a reason to test every measurable variable. |
| Evaluation budget | Bound time spent acquiring evidence; set the experiment scope/count or elapsed-time cap before substantial evaluation. | Permission to skip mandatory regression gates or declare an unresolved requirement satisfied. |
| Stopping condition | Accept sufficiently supported requirements; reject a candidate on decisive contrary evidence; stop optional work with low decision value. | Proof of global optimality or permission to hide remaining uncertainty. |

For Velvet, the stated target is a viable deployment strategy, not a globally fastest executor. No generic “do you want optimal?” question is necessary. Missing actual duration/memory, arrival/recovery and shared-resource limits can matter to adoption; #23 explicitly permits comparative evidence with assumptions. Continue that authorized work, label an illustrative envelope, and ask for the concrete missing limits only when they prevent the consequential choice. Do not require reapproval of the already authorized PoC.

The owner's clarification after the initial PR makes the default explicit: product concepts and requirements should identify differentiators, effort priorities and non-negotiable properties. An explicit speed or memory priority deserves focused evaluation even without numbers; supplied numeric targets remain binding. Otherwise, try the most promising candidates and stop at an adequately supported reasonable solution. Relative evidence combined with intended workload, costs and risks can support that judgment without an advance numeric cutoff. Record its evidence, assumptions, tradeoffs, limits and stopping rationale for review, rather than presenting it as an agreed requirement. Being relatively better alone is insufficient. Ask only when unresolved priorities, unacceptable tradeoffs or consequential unknowns prevent a defensible delegated decision, not merely because numbers or a request for further optimization are absent. Business meaning or guarantee changes still need the responsible Business Decision.

A useful stopping sequence is: reject an infeasible route as soon as decisive evidence supports rejection; otherwise check the consequential unknowns and required gates; accept when the actual task has sufficient support and the next optional experiment is unlikely to change selection. If the budget expires first, stop with evidence and an unresolved boundary. Stopping a research iteration is not completing an unmet deployment requirement.

## Bounded thought regression

These are authored analytical cases applied to the final wording, not independent agent trials or measured behavioral improvements.

| Case | Expected application of the guidance | Boundary checked |
| --- | --- | --- |
| Velvet residual calls exceed a stated latency allowance under supported assumptions | Stop refining that route's timing; investigate the bulk contract's decisive semantic/resource uncertainty. | Smallest change does not determine validation order. |
| The smaller routine meets the actual complete envelope; a wider rewrite has only speculative benefit | Complete relevant gates and stop optional comparison. | Neither order-of-growth nor TEMP is a universal winner. |
| Bulk kernel is fast but trusted SQL observes prior per-key writes | Check that contract first; reject incompatible reordering or seek a concrete guarantee decision. | Inference does not bypass semantic equivalence or authorize substitution. |
| Small Runs pass individually but arrivals exceed durable service, or all attempts time out | Keep recoverability unresolved; examine aggregate progress, retries and shared load. | Per-Run duration and total recovery are distinct. |
| No numeric targets or optimization differentiator; comparative evidence supports suitability for expected use | Record adequacy, evidence, limits and stopping rationale; stop after relevant gates without asking for targets. | A reviewable technical judgment can establish a sufficiently good result. |
| Speed or low memory is an explicit qualitative differentiator | Focus comparison and evaluation effort on that property; record why the result serves the concept. Honor supplied numbers if present. | A qualitative priority matters without implying unlimited search. |
| Priorities conflict and choosing speed would sacrifice a potentially non-negotiable memory property | Present the concrete tradeoff for human decision; continue independent work. | Clarification concerns unresolved priorities, not missing numbers alone. |
| A reversible documentation fix or an already accepted feasible tradeoff | Proceed directly with relevant checks, without an alternatives study or renewed approval. | No universal pre-implementation gate; preserves #49's caution. |
| Budget ends before a material fitness question is answered | Report what is known and the blocked adoption decision; do not silently extend or claim success. | Finite research does not waive acceptance. |
| Ordinary Alder review finds a faster alternative but established business meaning is sufficient | Close meaning; classify a scoped technical suggestion separately. Still report a demonstrated guarantee violation. | Post-review does not become an optimization contest. |

## Placement, verification and stop decision

The permanent addition lives in [adoption §3](adoption.md#prioritize-and-bound-technical-evaluation), with a short implementation-prompt route to that versioned text and a short philosophy explanation. It does not add a DB architecture rule, change Business Design, extend Q1–Q3/P1/P2/S, or copy performance checks into the review prompt. Post-implementation review already handles concrete current/downstream effects and sufficiency; only implementation/evaluation needs the new prioritization and budget language.

The initial investigation's budget was one source-based case analysis, one guidance revision and seven contrasting thought cases, followed by document integrity/link checks. The owner's clarification prompted this bounded wording correction and three additional thought cases about missing numbers, qualitative differentiators and conflicting priorities. No new benchmark matrix, model trial, production experiment or application-test replay was needed: this change makes an instruction gap explicit, and those executions would not establish its general behavioral effect within the authorized small study. Historical research and review knowledge remain unchanged. The numeric source examples and conditional arithmetic were checked; relative document targets and explicit heading anchors were checked before submission.

Stop here because the requested case, existing coverage, missing instruction and boundaries are inspectable. The same author selected and assessed the cases; no causal effect, reliability, saved time, optimal candidate order or production fitness is established. A future behavior study is a separate decision if an actual adoption concern makes its information worth the cost, not a prerequisite silently added to this Issue.
