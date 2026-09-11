# Preregistered Evaluation Plan: Scope-First Candidate Text

## Registration status and confirmatory question

Status: planned; no tasks have been run and no results exist. This document freezes the intended confirmatory comparison before execution. Amendments require a dated addendum that preserves this version.

Primary question: compared with an identical repository/task prompt without the candidate text, does adding the Scope-First candidate text reduce unnecessary promotion and speculative structure while preserving functional correctness?

## Intervention and experimental unit

The experimental unit is one independent coding-agent run on one prepared task repository.

**Control prompt:** task brief, fixture repository, acceptance tests, existing explicit instructions, tool budget, model settings, and output format. It contains no Scope-First candidate text and no paraphrase of it.

**Treatment prompt:** byte-for-byte the same Control prompt plus the candidate text in `proposal.md` under a clearly delimited “additional repository guidance” heading.

No other prompt text, system/tool access, time budget, reviewer instruction, seeded repository state, or test command may differ. The treatment does not receive a preferred folder tree, illustrative implementation, or extra architecture explanation.

## Fixtures

Prepare six small, language-diverse business-application fixtures (two TypeScript, two Python, one Java/Kotlin, one C# or Go), each with reproducible build/test commands and a pre-change baseline commit. Every fixture has two independently specified change tasks: one requires local feature behavior and one has a real, explicit shared semantic contract. This yields 12 tasks.

Task families must cover:

| Family | Required signal | Expected legitimate outcome |
| --- | --- | --- |
| Local endpoint/feature | One scope needs validation/query/workflow logic. | Scope-local code; no global technical layer merely for form. |
| Existing-architecture coexistence | Fixture states a Clean-Architecture-style dependency rule but has no required root package layout. | Dependency rule obeyed; local structure may be introduced inside the scope. |
| Genuine shared invariant | Two current scopes require identical business meaning and compatibility behavior. | Minimal common scope or explicitly shared contract, with both consumers. |
| Framework-required boundary | Framework requires a controller/handler/registration artifact. | Required artifact, without extra speculative Repository/Service/Interface layers. |

Fixtures must include hidden tests for behavior and at least one task where refusing to share causes a failing cross-scope invariant. This makes “never share” a losing strategy.

## Models, sampling, and randomization

Use two predeclared model strata:

- **Strong:** a current high-capability coding model available at execution time.
- **Cost-oriented:** a materially lower-cost general coding model intended for ordinary use.

Before execution, record exact model identifiers, provider, price/reasoning configuration, temperature, context/tool configuration, and availability date. Do not replace a model after examining outcomes; if unavailable, record the stratum as not executed and do not pool it.

For each model × task cell, run 10 independent seeds/replicates per arm (Control/Treatment): 2 × 12 × 10 × 2 = 480 planned runs. Randomize arm order within each model-task block using a recorded seed. Start every run from a clean fixture clone. No agent receives prior-run output.

## Outcomes and coding protocol

Functional gates are evaluated before structure scores:

1. Build/lint/typecheck command exits successfully where applicable.
2. Visible and hidden tests pass.
3. Task-specific acceptance behavior passes.

If a run fails any functional gate, it is counted as functionally failing and cannot be claimed as an architectural improvement. It remains in intention-to-treat analysis.

Two blinded reviewers independently inspect an anonymized patch, changed-file list, dependency/export graph, and test output. They use a written rubric and may not infer arm from prompt content. Disagreements are adjudicated by a third blinded reviewer; report raw agreement and Cohen’s kappa for categorical measures.

| Measure | Operational definition | Direction |
| --- | --- | --- |
| Unnecessary application-wide promotion (primary) | New application-wide technical layer or shared package/module introduced for code whose only evidenced consumer is one scope, or without recorded current shared semantic/contract need. | Lower is better. |
| Root-level package-by-layer selection | New root-level technical-role package (`domain`, `application`, `infrastructure`, `repositories`, `services`, etc.) introduced when the fixture required no such root layout and local placement could satisfy stated constraints. | Lower is better. |
| Speculative artifact creation | New Repository, Service, Interface/Port, or `common` abstraction without framework requirement or evidence-model justification. Count artifact types and runs with ≥1. | Lower is better. |
| Change locality | Number of pre-existing scopes modified plus number of unrelated root technical packages modified, normalized by task’s expected scopes. | Lower is better, subject to correctness. |
| Encapsulation | New public/exported symbols or cross-scope imports not required by the task’s specified consumers/contract. | Lower is better. |
| Justified sharing recall | In genuine-shared-invariant tasks, proportion of runs that create/use a correct shared contract or common scope and pass hidden invariant tests. | Higher is better. |
| Human reviewability | Blinded 1–5 rubric: a reviewer can locate task behavior and its dependencies from the change. Exploratory only. | Higher is better. |

“Application-wide” is fixture-defined before runs (for example, a root `src/services/`, `src/repositories/`, or exported `common/` used as a general technical destination). It never means simply “a file at repository root.”

## Hypotheses and decision rules

All estimates are Treatment minus Control with 95% confidence intervals, stratified by model and pooled only with a model-stratum interaction reported. Use mixed-effects regression with random intercepts for fixture/task and replicate block; binary outcomes use logistic mixed models. Report raw rates as the primary readable evidence. No p-value alone determines adoption.

| ID | Confirmatory hypothesis | Support criterion |
| --- | --- | --- |
| H1 | Treatment lowers unnecessary application-wide promotion. | Lower primary outcome in each executed model stratum, with pooled absolute reduction ≥10 percentage points and CI excluding zero. |
| H2 | Under a Clean-style dependency fixture, Treatment lowers unjustified root package-by-layer selection without increasing dependency-rule violations. | Lower layout outcome and non-inferior violation rate (margin +2 percentage points). |
| H3 | Treatment lowers speculative Repository/Service/Interface/common creation. | Absolute reduction ≥10 points in runs with ≥1 artifact, CI excluding zero. |
| H4 | Treatment improves locality/encapsulation without harming behavior. | Locality and/or encapsulation improves, while functional-pass rate is non-inferior within −3 points and no hidden invariant regression occurs. |
| H5 | The direction of H1 and H4 is present in the cost-oriented stratum. | Same directional effect; functional non-inferiority holds. This is not powered to prove equal effect size to Strong. |

H1–H5 are rejected or inconclusive if a required fixture family cannot be executed as registered. Exploratory analyses may inspect token use, time, diff size, duplication, and prompt adherence, but cannot rescue a failed confirmatory criterion.

## Exclusions, failures, and integrity

- Exclude only infrastructure failures occurring before the agent can inspect the repository; retain and report them separately with logs.
- Do not exclude a run for an unattractive architecture, excessive duration, or test failure.
- A tool/provider outage after work begins is an outcome of operational feasibility; report it separately and retain it in an availability sensitivity analysis.
- Lock fixture commits, prompts, reviewer rubric, test images/dependency versions, and randomization seed before the first run. Publish the full run manifest, patches, commands, outputs, scoring sheet, and deviations (redacting credentials only).
- Reviewers score from artifacts only. The experiment operator does not alter patches or provide mid-run feedback.

## Interpretation and next gate

Proceed toward a draft normative contract only if H1 and H4 are supported, no correctness/invariant safety signal is worse than its non-inferiority bound, and H5 is directionally supported. Otherwise choose **REVISION_REQUIRED** when ambiguity is diagnosable, **DO_NOT_PROCEED** when harm/no effect is credible, or **EXISTING_CONCEPTS_ARE_SUFFICIENT** when the candidate adds no measurable operational value beyond the control’s existing guidance.

This evaluation does not establish that a style is globally superior. It only tests whether a minimal instruction changes observable agent behavior under the registered fixtures.

## Review knowledge benchmark operation (2026-09-11)

This dated addendum concerns the [review knowledge v0.3 research candidate](phase2/review-knowledge-v0.3.md), separately from the preregistered Scope-First comparison above. It does not amend that comparison's frozen protocol or reinterpret its results.

- Prioritize reuse of the existing three benchmarks as a fixed set: facilities maintenance, purchase request, and meeting-room reservation.
- For a local review knowledge change, rerun only the affected existing benchmark(s).
- Do not require reproduction of every past finding to pass. Assess the capability targeted by the change and whether excessive requirements are introduced.
- Consider a new benchmark only when a clearly identified property cannot be evaluated with the existing three cases.
- Do not treat increasing the benchmark count itself as an accuracy improvement strategy.

No new benchmarks are added by this addendum.
