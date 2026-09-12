# Maintenance cost pilot — Issue #45

Status: **DESIGN_READY / EXECUTION_BLOCKED** (2026-09-12). No implementation arm has run. This is a separate exploratory experiment, not an amendment to `docs/evaluation-plan.md` or a completed comparison.

## Repository inspection and reuse

Base: `d4e6395ebf02c5c1fed7334d2dde73ae5d2255b2` (`main`). The recursive tree contains no `AGENTS.md`.

- `docs/philosophy.md`: Alder does not require an architecture or a flat layout; implementation provides evidence for requirements review.
- `docs/research.md` and `docs/sources.md`: existing conceptual distinctions for VSA and Clean Architecture. Use their dependency/change-axis interpretation, not a mandatory folder/class count.
- `work/phase2/baseline`: reusable zero-dependency Node test approach, but not a neutral initial implementation. Its feature folders, existing shared money contract, and request/database boundary are already imposed. Copying that code would confound initial structure selection.
- `business-design/purchase-request/README.md`: reuse this business scenario. Its approval-by-amount policy is explicitly undecided, making it a suitable *experimental* future change. The pilot's concrete decisions are in `packets.md`; they do not change or complete the source Business Design.
- `business-design/meeting-room/README.md`: not selected; overlap/concurrency guarantees add execution cost unrelated to the first question.
- `docs/phase2/run-record.md` and `alternative-execution.md`: the earlier study explicitly distinguished contaminated evaluator-authored patches from fresh-agent runs. Its past user authorization is historical evidence, not authorization for this session.

No new business benchmark, language matrix, external service, or package dependency is needed. Prepare a small JavaScript implementation of the existing purchase scenario using Node's built-in test runner. Do not copy the Phase 2 implementation or its architecture contract.

## Four arms, one sequence

| Arm | Additional initial instruction |
| --- | --- |
| A | None; current requirements only. |
| B | The concrete foresight sentence in `packets.md`. |
| C | Implement and maintain this product using Vertical Slice Architecture; choose a natural implementation for this stack. |
| D | Implement and maintain this product using Clean Architecture; choose a natural implementation for this stack. |

All receive identical current business requirements, runtime, public behavior contract, test suite, and tool restrictions. A/B are requirements-led Alder conditions, not implementations of a new style. Do not provide the old Scope-First candidate, a preferred tree, or a flatness instruction. A may naturally choose boundaries; B may reasonably decide no extra structure is warranted. Preserve either outcome.

Keep the four arms. Adding C/D with foresight would separate style/foresight interactions, but doubles two arms without being necessary for this first observation. Therefore B versus C/D compares *instruction packages*, not a causal effect of architecture independent of extra knowledge. A versus B isolates the supplied foresight only to the extent allowed by a single run per arm.

| Stage | Change disclosed at that stage | Purpose |
| --- | --- | --- |
| S0 | Current purchase workflow | Initial investment |
| U1 | Detail-only requester note | Unrelated data change |
| U2 | List filter by item-name substring | Second unrelated change |
| F1 | Senior approval at 100,000 yen | Forecast-related change |
| F2 | Threshold becomes 50,000 yen | Repeated forecast-related change |

Every arm follows S0 → U1 → U2 → F1 → F2. Freeze each stage's source, tests, rationale and results before revealing the next packet. The U2 prefix represents an observed period in which foresight has not paid off. It is **not** evidence of a permanently wrong forecast or a long unrelated-only trajectory. This ordering avoids a second branch/extra implementation sessions; report that limitation for H4.

## Context isolation and bounded execution

Use four fresh implementation contexts with the same inherited model/settings, one per arm, each continuing through five stages. The evaluator retains future packets and other arms' results. Deliver only the common current packet and arm-specific instruction initially, and only the next change at each continuation. Do not expose this plan, Issue #45, the repository's full research history, future tests, other arms, or comparative findings to implementers. Keep arm workspaces separate; fresh prompts alone do not prevent filesystem leakage. Record what files each implementer was permitted to inspect and any accidental exposure.

Before S0, prepare and freeze stage-specific acceptance tests. Only the current/cumulative suite is delivered at a stage. Implementers may add their own tests but cannot edit evaluator tests. Do not accept evaluator-written replacements as arm output. Record model identity/settings as actually exposed by the runner; unknown settings remain unknown.

Maximum planned workload: four initial contexts and sixteen continuation tasks, one realization per arm, no model/seed sweep. Retain all failed attempts and fixes. Limit each stage to one initial attempt and two correction rounds; if still failing, mark that arm/stage failed and do not report it as cheaper. Pause the comparison if failures prevent matched stages. No automatic extra replicates to obtain a preferred result.

## Gates before cost comparison

Use syntax checking plus `node --test` on the cumulative common tests and any arm tests. JavaScript has no compile/typecheck gate here; do not label syntax checking as type safety. Tests exercise each instance through its public entry point, including unsuccessful commands and unchanged state. This is in-process workflow coverage, not deployed HTTP/database E2E.

The common suite must cover the acceptance cases in `packets.md`, roles, invalid states, numeric/text boundaries, distinct instances, duplicate/missing identifiers and defensive result copies. Freeze test hashes before implementation. Validate test sensitivity with intentionally failing behavior probes before dispatch; report harness failures separately from arm failures.

After each stage, also inspect instruction adherence: C organizes behavior around use cases/change axes without mandated layers; D keeps business policy independent of concrete storage/transport details, allowing multiple layouts. Report ambiguous adherence instead of silently relabeling an arm. For B, record the implementer's response to the risk; the foresight sentence is uncertainty, not a requirement to create an interface or implement future behavior. Its current functional Gate is identical to A's.

## Measurements and minimal rubric

Keep total physical source lines added/deleted, changed/new/deleted files, and cumulative totals per stage. Count production code and arm-added tests separately. Report shared evaluator-test and orchestration effort separately; never multiply them into four arm costs. Count renames/moves explicitly so relocation is not mistaken for newly invented business logic. Preserve per-file diff/numstat and stage snapshots so raw totals are reproducible. Initial source creation counts in cumulative totals.

Classify each changed hunk once, retaining path and rationale:

| Class | Operational interpretation |
| --- | --- |
| R — requirement | Adds/changes current validation, state, data, result or workflow behavior. |
| M — structure maintenance | Maintains the selected boundary/style with no additional current business behavior, e.g. forwarding, port signature propagation or wiring. |
| D — deferred design | Restructures pre-existing behavior to enable the new requirement, e.g. extraction/move before the feature edit. |
| X — inseparable/uncertain | Business and structure changes cannot be separated without an arbitrary allocation. |

Do not classify a domain object, file name, interface or every Clean Architecture line as M automatically. A boundary may serve a current requirement. Record alternative plausible classifications for disputed hunks. Raw total churn is invariant to this classification; show whether any conclusion changes when X is assigned to R versus M/D. If it does, that conclusion is unknown. Do not create a weighted overall score.

At each stage report Gate, source churn, test churn, file changes, R/M/D/X, correction rounds, and cumulative source churn since S0. Time/token/read-volume are optional only when reliable runner evidence exists; do not reconstruct them from memory or equate lines with labor. Report elapsed task duration separately from waiting/tool overhead if measured.

For a comparison against A, prepayment is an observed S0 difference, not an assumed positive cost. Recovery on this proxy occurs only when a Gate-passing arm's cumulative churn is no greater than A's after starting greater; equality is break-even. Also report per-change differences, since lower marginal cost need not recover initial investment. F1/F2 may be too small to cause recovery; do not extend the sequence merely to manufacture it.

## Hypothesis interpretation

| Hypothesis | Evidence sought | Required restraint |
| --- | --- | --- |
| H1 | S0 investment of A versus B/C/D | A is not forced flat; ties are possible. |
| H2 | B's F1/F2 marginal and cumulative cost versus A/C/D | One fixture and knowledge/style confounding prevent a general causal claim. |
| H3 | Initial overhead and subsequent break-even/crossover | No crossover means not observed within this horizon, not that recovery is impossible. |
| H4 | B's investment retained through U2 | Only a no-hit prefix; if B invests nothing, the prepayment premise is absent. |
| H5 | Rankings across stages/changes | Constant ranking in one small fixture does not establish universal dominance. |

Report support/contradiction/unknown for the observed case separately from general hypotheses. All are currently **unknown: not run**. A small memory-backed workflow may underexercise Clean Architecture's I/O isolation and VSA's multi-feature locality; retain this limitation even if differences are clear.

## Deliverables and next decision

Save actual runs under `work/maintenance-cost/` and results alongside this plan only after a valid runner is available. Store exact delivered prompts, stage hashes/snapshots, commands/output, failures, diffs and the classification ledger. Keep the old evaluation and Phase 2 artifacts unchanged.

The next action is enabling fresh implementation contexts, then freezing tests and executing this matrix. Do not add a second fixture or model now. See `run-record.md` for the actual blocker and work completed; this design-only PR must remain Draft and must not close #45.
