# Experiment 2 results: provider boundary change

**Completed exploratory experiment, 2026-09-12.** All four arms passed S0 and S1. B's local foresight and D's Clean Architecture boundary visibly isolated the existing Alpha implementation from the new provider. However, this benefit did not repay their initial source-change proxy difference against A. A added Beta through small local branches without extracting a new module or interface. No overall maintenance-cost winner is established.

This is an independent addition requested by [PR #46](https://github.com/mk3008/alder/pull/46#issuecomment-5643502093). The first experiment's results, inputs, measurements and conclusions remain frozen, with exact file/hash preservation verified. See the new [Issue #45 synthesis](../maintenance-cost-synthesis.md) for the combined assessment.

## What ran

One shipment-booking fixture, four fresh `gpt-6-astra` / `low` implementation contexts, initial S0 and one subsequent S1 task each. Settings are the explicit runner requests; effective backend settings are not independently attested. See [plan](plan.md), [execution and replay](execution.md), [delivered prompts](../../work/maintenance-boundary/prompts) and [raw records](../../work/maintenance-boundary/records).

S0 supports booking and cancellation with Alpha over real loopback HTTP. S1 adds Beta with different authentication, payloads, units, response fields, HTTP success status, cancellation verb/path and business rejection semantics. Bookings select a provider and retain it so later cancellation uses the original provider. Tests include mixed-provider history, duplicate IDs, default Alpha, invalid provider/input, unsuccessful remote responses, malformed JSON, broken connections, defensive copies and unchanged local state on failure.

| Arm | Initial instruction and observed structure | S1 response |
| --- | --- | --- |
| A | Current requirements only; one file with validation, state and HTTP | Local provider branches in booking/cancellation; common response normalization; no extraction |
| B | Same requirements plus concrete expectation of future providers; application and Alpha client | Adds Beta client with the existing two operations and a provider map; Alpha file unchanged |
| C | Same current requirements plus VSA; entry and book/cancel/detail slices | Provider branches inside book/cancel slices; extra config forwarded through entry; detail unchanged |
| D | Same current requirements plus Clean Architecture; application, Alpha adapter, memory store and composition | Adds Beta adapter, passes provider-indexed services; Alpha adapter and memory store unchanged |

A was not forced flat. B was not told to create an interface, port or adapter. C/D were not given B's forecast. B versus C/D thus compares instruction packages, not a pure style effect with information held constant. Structure review accepted C's feature ownership and D's inward dependency direction; neither was graded by folder count. [Import inventory and rationale](../../work/maintenance-boundary/records/structure-review.json) accompany all eight snapshots.

## Requirement Gate and execution cost

| Arm | S0 common tests passed | S1 common tests passed | Agent checks | Failed checks / correction rounds |
| --- | ---: | ---: | ---: | --- |
| A | 5 | 11 | 2 | 0 / 0 |
| B | 5 | 11 | 2 | 0 / 0 |
| C | 5 | 11 | 2 | 0 / 0 |
| D | 5 | 11 | 2 | 0 / 0 |

Each case contains multiple assertions. Syntax checks passed. None added optional tests, so optional-test churn is zero for every arm; this is not a claim of exhaustive coverage. The common gates were prepared before dispatch. The S1 provider field changes the expected record shape; still-valid Alpha assertions are retained in the expanded suite. All agents self-reported no failures outside recorded checks and no outside-context exposure.

Execution used **4 fresh agents + 4 continuations**, 8 unique agent check invocations, 8 separate evaluator snapshot checks, and 8 final snapshot replay checks. Full replay passed **8/8**, including input/source integrity, recomputed measurements, complete classification coverage and unchanged first-experiment files. Saved [reproduction output](../../work/maintenance-boundary/records/reproduction.json) includes commands, outputs and exit codes. Shared evaluator preparation/reporting is not charged to any arm. Tokens, money, implementation time and comprehension cost were not measured. No extra language, model, seed, commercial provider or package dependency was used.

## Source-change observations

Churn is added plus deleted physical production lines, including comments and blank lines; a replacement counts twice. Initial creation is included. This reuses the first experiment's algorithm, **not a labor-cost estimator**. All gates pass before comparison.

| Arm | S0 raw | S1 raw | Cumulative raw | S0 filtered | S1 filtered | Cumulative filtered |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| A | 57 | 41 | 98 | 51 | 41 | 92 |
| B | 69 | 50 | 119 | 65 | 48 | 113 |
| C | 67 | 88 | 155 | 64 | 88 | 152 |
| D | 87 | 55 | 142 | 83 | 50 | 133 |

Filtered means omitting blank lines and standalone `//` comments, as prespecified; indentation remains significant. [Raw measurements](../../work/maintenance-boundary/records/measurements.json) and [patches/numstats](../../work/maintenance-boundary/diffs) are directly reviewable.

| Arm | Production files at S0 → S1 | S1 changed files | S1 new / deleted files | Exact-content file moves |
| --- | --- | ---: | --- | ---: |
| A | 1 → 1 | 1 | 0 / 0 | 0 |
| B | 2 → 3 | 2 | 1 / 0 | 0 |
| C | 4 → 4 | 3 | 0 / 0 | 0 |
| D | 4 → 5 | 3 | 1 / 0 | 0 |

B/D each add a 34-line Beta module, while A reuses existing fetch/validation scaffolding with conditional expressions. These different choices explain why an unchanged Alpha module does not necessarily produce lower total line churn. Do not interpret B's extra 12 initial raw lines or D's extra 30 as the isolated price of architecture: independently generated implementations also differ in validation, formatting and helpers.

**Post-hoc indentation diagnostic:** C wraps existing Alpha blocks in branches and indents them. After observing that patch, a separate diagnostic strips leading/trailing whitespace as well as blank/standalone-comment lines before the same diff algorithm. It is explicitly post hoc and does not replace the main metric or count semantic changes.

| Arm | S0 normalized | S1 normalized | Cumulative normalized |
| --- | ---: | ---: | ---: |
| A | 51 | 41 | 92 |
| B | 65 | 48 | 113 |
| C | 64 | 46 | 110 |
| D | 83 | 50 | 133 |

C's S1 drops from 88 to 46 and moves below B/D. Hence “VSA has the largest change cost” is not robust even on these line proxies. A remains smallest in all three views, and no other arm's cumulative proxy crosses A. This does not measure readability or prove that A's growing branches will remain cheaper after further operational changes. The diagnostic script and [saved output](../../work/maintenance-boundary/records/indent-sensitivity.json) make the sensitivity reproducible without another model run.

## Requirement, boundary maintenance and deferred design

Every production hunk has one R/M/D/X classification with rationale and alternative readings in the [ledger](../../work/maintenance-boundary/records/classification.json). S0 remains wholly X because no counterfactual isolates required behavior from initial structure. For S1:

| Arm | R: requirement | M: boundary maintenance | D: isolated deferred design | X: inseparable/uncertain |
| --- | ---: | ---: | ---: | ---: |
| A | 36 | 0 | 0 | 5 |
| B | 8 | 1 | 0 | 41 |
| C | 6 | 6 | 0 | 76 |
| D | 10 | 0 | 0 | 45 |

This table is **not a ranking of business versus architecture effort**. Its broad X values reflect coarse new-file/replacement hunks, not missing functional work. Examples:

- A's five-line response-normalization hunk combines new Beta semantics with local restructuring. It could be R or D. No distinct module extraction or pure reorganization was necessary.
- B's new Beta module combines required transport behavior with packaging behind the existing boundary. The provider map combines new routing with generalization of its original single-client composition. Only the isolated import is M, with R a plausible alternative.
- C's two large replacement hunks combine provider branching, required Beta behavior and reindentation of existing Alpha code. Configuration propagation through context/slice signatures is six M lines, alternatively R. The feature boundaries themselves do not move.
- D's Alpha and storage modules remain unchanged, but the injected dependency changes from one service to provider-indexed services. This is not a zero-change application boundary. Composition hunks mix requirement wiring and deferred generalization; the application comment change is X.

There is no unambiguously D-only hunk; that does not establish zero deferred effort. Assigning all S1 X to R produces R totals A/B/C/D **41/49/82/55**. Assigning all X to M instead gives M **5/42/82/45**; assigning all X to D gives D **5/41/76/45**. Initial X and ambiguous M→R are additional uncertainty. These ranges prevent reliable architecture-only cost attribution; they do not change raw cumulative churn.

## What the boundary bought, and what it did not

**Observed benefit:** B and D each kept their Alpha source byte-identical while integrating Beta. Their initial operation boundary matched the eventual change well enough to reuse. D also kept storage unchanged. This is concrete evidence of isolation, unlike the first experiment's purely local threshold edits.

**Recovery not observed:** B/D still need the required Beta wire logic, configuration, provider validation, routing and stored identity. Neither has lower S1 production churn than A, nor a cumulative crossover, in any reported view. C's feature partition keeps detail untouched but spreads this provider change across both mutating slices and composition. A's 41 changed lines suffice with no new artifact or failed check. The anticipated expensive deferred extraction simply did not become necessary in this bounded requirement set.

The experiment therefore distinguishes **a boundary functioning as designed** from **its investment being recovered on measured changes**. It demonstrates the former for B/D; it does not establish the latter or an overall maintenance-cost victory for A.

## H1–H5 and limits

| Hypothesis | This experiment's assessment |
| --- | --- |
| H1: no-foresight lowest initial cost | Supported for the initial source proxies in this realization; labor/comprehension and general tendency unknown. |
| H2: local foresight provides lower-cost architecture benefit | B obtains Alpha isolation with fewer initial/cumulative lines than D. Partial observation compatible with the hypothesis; B does not reduce S1 or cumulative churn against A. Single-run causation remains unknown. |
| H3: styles recover initial investment | Isolation observed for D, but cumulative recovery not observed for C or D after this provider addition. Future recovery is unknown. |
| H4: missed foresight leaves unrecovered investment | Not tested here: the sole future change hits B's concern. |
| H5: no universally best style | Unknown as a universal proposition. Isolation, file count and line proxies prefer different properties; C/B ordering is whitespace-sensitive. |

The real HTTP boundary is exercised, but both providers still fit the same application-level book/cancel semantics. There is no delayed callback workflow, durable migration, reconciliation, transaction boundary, multi-team ownership change, security assessment or measured human review. Providers are local emulators, not production APIs. Connection failure tests prove preservation of local state, not remote rollback or distributed consistency. Public API behavior is specified for fair tests and thus provides an existing outer boundary to all arms.

One fixture and one realization per instruction package cannot estimate variability or universal style effects. The evaluator is unblinded and shared-workspace isolation is instructional. Source hashes verify saved artifacts, not backend internals or an absence of every possible leak. Avoid extending the sequence to force a crossover. If a concrete future decision requires stronger evidence, the priority would be a change in application-level completion/consistency semantics, such as delayed completion with durable reconciliation; that is outside this completed addition and has not been run.
