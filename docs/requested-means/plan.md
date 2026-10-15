# Requested implementation means: bounded qualitative investigation

Research only for [Issue #47](https://github.com/mk3008/alder/issues/47).
Baseline: `af5e2232e367a3784a3fbb25d16d7e69fc89d715`, inspected on 2026-09-12 UTC.
No applicable AGENTS.md was present in the checkout or its ancestor directories.

## Question and method

Does explicitly comparing requested means with stated ends add a useful decision to Alder, and what separates that decision from needless intervention?

Use a document comparison and evaluator-authored counterexample analysis. This is **not a fresh-agent experiment**, a preregistered behavioral comparison, or a measurement of improvement. The investigator sees the requester's hypothesis. Scenarios and interpretation are authored together; they are not independent evidence of agent behavior.

Compare three readings:

- **C — current:** philosophy, adoption §3–4, and review knowledge v0.3.
- **U — unbounded:** C plus an instruction to seek better means for the stated goal, without an explicit intervention/termination boundary. This deliberately incomplete formulation is a diagnostic foil, not the full Issue proposal and not a fair estimate of its expected behavior.
- **B — bounded candidate:** C plus the research-only decision boundary in [results](results.md#candidate-decision-boundary).

For each case identify the stated goal, requested means, decisive evidence or constraint, justified action, harmful alternative, and whether C already covers it. Change a decisive fact between paired cases to test whether the boundary can preserve a reasonable user choice as well as challenge an unsuitable one. Analyze implementation and review separately.

## Sources and reuse

Read [philosophy](../philosophy.md), [adoption](../adoption.md), [review knowledge](../phase2/review-knowledge-v0.3.md), [evaluation policy](../evaluation-plan.md), [validation](../validation.md), [initial research](../research.md), [pilot results](../phase2/results.md), and [architecture synthesis](../maintenance-cost-synthesis.md), including [boundary results](../maintenance-boundary/results.md) and [risk review](../maintenance-risk-review/results.md).

Reuse the existing [meeting-room](../../business-design/meeting-room/README.md), [purchase-request](../../business-design/purchase-request/README.md), and [facilities-maintenance](../../business-design/facilities-maintenance/README.md) domains. The added task requests, deployment facts, measurements, and decisions in [scenarios](scenarios.md) are **stipulated hypothetical inputs**, not discoveries about those implementations. No existing Business Design is amended.

The existing fixed review benchmarks establish useful material for semantic failures and sufficient behavior. They do not supply matched tasks that vary whether a requested technical means is optional, costly, or explicitly confirmed. Therefore use small paper scenarios rather than treating historical review findings as a treatment comparison. Add no permanent benchmark or new product.

The 480-run Scope-First protocol in evaluation-plan.md addresses a different intervention. Its gates and outcomes remain untouched. No review knowledge is changed here, so no local-change regression gate is triggered.

## Evidence and stopping rules

- Document contents and already reported observations are source evidence; cite their exact sections.
- Candidate actions and failure mechanisms are analytical judgments conditional on scenario facts.
- Actual clarification frequency, implementation quality, reviewer churn, and causal benefit remain unmeasured.
- Do not infer total costs from line counts or infer user intent from an architecture name.
- Stop after an overlap map, paired counterexamples, placement recommendation, and uncertainty assessment. Do not expand into runtime benchmarking merely to obtain an adoption verdict.
- If behavior evidence is needed to promote the rule, conclude **revise and retest / insufficient evidence for adoption**. Do not implement the recommendation.

Deliver only this directory. Verify local links, baseline integrity, and the final diff; no production tests are modified or claimed as new behavioral evidence.
