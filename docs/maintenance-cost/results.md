# Maintenance cost pilot results — Issue #45

**Completed exploratory pilot, 2026-09-12.** All four arms passed the common Requirement Gate at all five stages. This small change sequence did not establish a maintenance-cost winner. Initial source ranking and the first foresight-change ranking are sensitive to counting comments/blank lines. No tested arm required a large deferred redesign.

## Comparison and execution

The existing purchase-request business scenario was reused with the explicit experimental decisions in [packets.md](packets.md). Four fresh implementation contexts used **requested model `gpt-6-astra`, requested reasoning effort `low`**, per the user's instruction. Each continued through the same five tasks: S0 current workflow, U1 detail-only note, U2 item substring filter, F1 amount-dependent approval at 100,000 yen, F2 threshold reduction to 50,000 yen. No additional arms, seeds, fixtures, models or evaluator implementation were added.

| Arm | Instruction package | Observed initial design |
| --- | --- | --- |
| A | Current requirements only | One file; shared validation and generic transition helper selected naturally |
| B | Same requirements plus expected repeated amount-based approval changes | One file; explicit local approval-authority function, without a future threshold |
| C | Same requirements plus VSA | Six use-case slices, shared current validation, composition entry; eight production files |
| D | Same requirements plus Clean Architecture | Pure domain, application using an injected repository, memory adapter, composition entry; four production files |

A was not instructed to be flat or avoid architecture. B received a risk statement, not an interface/layer prescription. The remaining three arms were not given this forecast. Consequently B versus C/D compares instruction packages, not architecture while holding foresight constant. Structure inspection passed at every stage; the actual import inventory and rationale are in `records/structure-review.json`.

Exact runner arguments and returned task identities, provider-metadata limits, hashes, prompts, test output and replay commands are described in [execution.md](execution.md). Direct evidence: [snapshots](../../work/maintenance-cost/runs), [delivered packets](../../work/maintenance-cost/prompts), [raw measurements](../../work/maintenance-cost/records/measurements.json), [classification ledger](../../work/maintenance-cost/records/classification.json), [reviewable patches](../../work/maintenance-cost/diffs), [replay results](../../work/maintenance-cost/records/reproduction.json). Runtime observed: Node `v24.19.0`. The explicit model/effort request is recorded; backend attestation, evaluator runtime identity, temperature, seed and token/currency cost are unavailable. They are not inferred from the model's prose.

## Requirement Gate

| Arm | S0 tests passed | U1 | U2 | F1 | F2 | Failed current-stage checks / correction rounds |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| A | 15 | 18 | 22 | 27 | 28 | 0 / 0 |
| B | 15 | 18 | 20 | 24 | 25 | 0 / 0 |
| C | 15 | 19 | 23 | 29 | 31 | 0 / 0 |
| D | 15 | 19 | 22 | 27 | 29 | 0 / 0 |

These are common plus arm-authored tests at each stage, not independent observations or comparable coverage scores. The common suite has 12/13/14/17/17 test cases across S0/U1/U2/F1/F2; each case contains multiple assertions. Syntax checks passed too. There is no JavaScript typecheck/build claim. The evaluator separately verified all 20 snapshots, then replayed all 20 from temporary directories with input/source hash checks: **20/20 passed**.

Four prior-stage audit files were also present in the F2 workspaces. Each is byte-identical to that arm's archived F1 check, with an F1 timestamp. They are preserved, but `measure.py` excludes previously seen hashes from current-stage attempt counts. Each F2 report correctly identifies one new check (`check-002.json`). The cause of the duplicate files is not established; they are not extra F2 attempts or failures. The complete raw records allow this accounting to be independently checked.

The common Gate does not test a live cross-version memory upgrade. C and D additionally used their existing slice/repository seams to test seeded historical records; A and B tested current-process history through the public API. Those optional tests demonstrate different test access, not matched evidence of superior migration behavior. The limitation applies to the research conclusion even when an individual report describes historical preservation more broadly.

## Raw physical-line observations

Churn means added **plus** deleted physical production lines, including whitespace and comments. A replaced line counts as two. S0 counts all initial production lines. This is an auditable source-change proxy, **not labor time, comprehension cost or total maintenance cost**. Agent tests are separate below; shared evaluator work is excluded.

| Arm | S0 | U1 | U2 | F1 | F2 | Cumulative through S0 → U1 → U2 → F1 → F2 |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| A | 90 | 11 | 7 | 5 | 2 | 90 → 101 → 108 → 113 → 115 |
| B | 100 | 20 | 7 | 7 | 2 | 100 → 120 → 127 → 134 → 136 |
| C | 97 | 8 | 9 | 6 | 2 | 97 → 105 → 114 → 120 → 122 |
| D | 100 | 9 | 8 | 8 | 2 | 100 → 109 → 117 → 125 → 127 |

| Arm | Production files changed at S0 / U1 / U2 / F1 / F2 | Agent-test churn at S0 / U1 / U2 / F1 / F2 | Cumulative agent-test churn |
| --- | --- | --- | ---: |
| A | 1 / 1 / 1 / 1 / 1 | 36 / 46 / 50 / 45 / 22 | 199 |
| B | 1 / 1 / 1 / 1 / 1 | 36 / 40 / 25 / 38 / 26 | 165 |
| C | 8 / 3 / 2 / 1 / 1 | 35 / 55 / 41 / 52 / 39 | 222 |
| D | 4 / 2 / 1 / 2 / 1 | 38 / 39 / 30 / 40 / 44 | 191 |

No production file was added, deleted or renamed after S0 in any arm. All final policy-threshold changes were one production-line replacement in one file. Source and optional-test churn cannot be combined into a coverage-neutral overall ranking: test scope/format differs by author. In fact, simply adding both totals would put B below A (301 versus 314), despite the opposite production-only order. This is why the study retains the separate measures and claims no overall winner.

## Counting sensitivity, explicitly post hoc

Inspection found a comment-only replacement in B/F1. To avoid turning comment formatting into an architecture conclusion, an additional sensitivity view excludes blank lines and standalone `//` comments. This was added **after observing the patches**; it does not replace the original raw metric or parse JavaScript semantics. Braces, line wrapping and other formatting still matter.

| Arm | S0 filtered | F1 filtered | Final cumulative filtered production churn |
| --- | ---: | ---: | ---: |
| A | 83 | 5 | 108 |
| B | 82 | 4 | 113 |
| C | 91 | 6 | 115 |
| D | 93 | 8 | 120 |

The initial A/B ranking reverses (raw 90/100, filtered 83/82). B/F1 also changes from more churn than A (7/5) to less (4/5); three raw changed lines were policy comments. Therefore neither “A has the smallest initial implementation cost” nor “B reduced first-change cost” is a robust result. B's final cumulative production proxy remains above A in both views, but by only five filtered changed lines; that is not evidence of meaningful labor savings or loss.

## Requirement / structure / deferred design classification

Every production hunk in `records/measurements.json` has exactly one classification and rationale in `records/classification.json`. R = requirement change; M = structure maintenance; D = deferred design; X = inseparable/uncertain. Initial new-file hunks combine behavior and its chosen structure and are conservatively all X. This does **not** mean the initial work lacked required behavior; it means its marginal architecture component cannot be isolated from a nonexistent before-state.

| Arm | S0 X | Later R | Later M | Later D | Later X |
| --- | ---: | ---: | ---: | ---: | ---: |
| A | 90 | 25 | 0 | 0 | 0 |
| B | 100 | 19 | 0 | 0 | 17 |
| C | 97 | 23 | 2 | 0 | 0 |
| D | 100 | 19 | 2 | 0 | 6 |

Concrete examples, not style-based penalties:

- **R:** note validation/projection, substring filtering, and the threshold comparison change.
- **M:** C/U2 changes entry forwarding as well as the list slice (two changed lines in the entry). D/F1 retains `approvedBy` by switching from the prior actor-ID argument to the actor object's ID (two changed lines). Both admit a broader R interpretation, recorded in the ledger.
- **Potential deferred work, X:** B/U1 extracts a detail-record helper while implementing note defaults, mixing new behavior with reuse of an existing projection (14 changed lines across three hunks). D/F1 moves authorization into the amount-aware domain operation while changing its actor argument (six changed lines across two hunks); requirement work, boundary upkeep and deferred reorganization overlap.
- B/F1's three comment-only changed lines are X, not assigned automatically to either business or architecture maintenance.

There is **no isolated, unambiguously D-only hunk**. This is not a claim of zero deferred design cost. Assigning all later X to R gives later R totals A/B/C/D = 25/36/23/25; assigning all X to M gives later M = 0/17/2/8. Assigning X to D instead gives later D = 0/17/0/6. These deliberately broad bounds can reverse any claim about which arm has more *architecture-specific* upkeep. Total raw churn stays unchanged. Hence the classification supports concrete examples and uncertainty, not a reliable aggregate structure-cost ranking. The initial X amounts are additional uncertainty and are not included in those later-change bounds.

## Prepayment and hypotheses H1–H5

B visibly introduced a local authority helper: five physical lines for its two comments and three-line function, within the same file. It later localized the F1 policy edit. That local seam is observable, but its net incremental cost cannot be identified by subtracting two independently generated files that also differ in validation, whitespace and helpers.

C and D had less U1 source churn than A (8/9 versus 11), a marginal advantage on that change. It did not recover their initial production-proxy deficit: neither overtook A cumulatively in either raw or filtered counts. B also did not break even against A on the raw proxy; in the filtered view B started one line smaller, so a positive initial deficit cannot even be assumed. All four converged to the same tiny F2 production edit.

| Hypothesis | Assessment | Evidence and boundary |
| --- | --- | --- |
| H1 — no-foresight lowest initial cost | **Unknown; metric-sensitive** | A lowest in raw lines, B slightly lower after blank/comment filtering; A/B both one file. No time/comprehension measurement. |
| H2 — local foresight gives lower-cost benefits | **Unknown; no robust recovery observed** | B's seam localized F1; marginal A/B ordering flips under filtering. B does not improve cumulative production churn. Overall costs remain unmeasured. |
| H3 — styles can recover prepayment | **Unknown generally; recovery not observed in this sequence** | C/D have an U1 marginal advantage, but no cumulative production crossover. Two policy changes are too weak to rule out later recovery. |
| H4 — wrong foresight leaves unrecovered investment | **Unknown; compatible with the U2 prefix** | B retains its unused future-oriented seam until F1. The prefix has no forecast hit; no permanently wrong-forecast trajectory was executed, and net prepayment is metric-sensitive. |
| H5 — no style always best | **Limited support for task-dependent proxy rankings; general claim unknown** | C has least U1 churn, A least raw F1 churn, B least filtered F1 churn, F2 ties. This does not prove any universal claim or that concrete concerns generally replace styles. |

## Cost, integrity limits and next step

Actual implementation cost in countable operations: **4 fresh agents, 16 continuations, 20 unique recorded agent check invocations, no failed checks or correction rounds**. There were additionally 20 evaluator snapshot checks, 20 final replay checks, and the pre-dispatch harness smoke check. A repeat Node invocation verifies the same evidence; it is not another agent sample. No package installation, paid external API, or extra fixture/model sweep was used. Tokens, currency and implementation time are unknown. Shared preparation/measurement/reporting is not charged to an individual arm.

Single fixture, one agent realization per arm, in-memory storage, an already prescribed public API, and a very small change sequence limit inference. The product API gives every arm a present boundary already. No real I/O replacement, transaction/persistence migration, multi-team coordination or human-review speed was measured. The evaluator is unblinded; input/workspace boundaries are instruction-based and self-reported. Hashes and replay verify saved artifacts, not inaccessible provider internals or absence of every possible context leak. Failed-check outputs would be retained, but intermediate source states between checks are not captured; no failed check occurred here.

**Do not increase repetitions to resolve these differences.** If the question remains whether a boundary repays itself, the highest-value next experiment is one genuinely boundary-crossing operational change with matched observability/acceptance requirements, chosen and hidden before a new initial implementation. Adding it now to these contexts would not repair the original forecast contrast. It would require a separate bounded experiment, not expansion of this Issue. This pilot is sufficient to show the proposed small threshold sequence does not distinguish substantial maintenance savings.

The original `docs/evaluation-plan.md`, Phase 2 results, and Business Designs remain unchanged. The full comparison is saved here as a separate research result, without adopting an architecture recommendation.
