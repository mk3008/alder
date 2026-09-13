# Alder v0.2 — reasoning directs validation

Alder v0.2 adds guidance for **AI-owned technical evaluation** while keeping the Business Design / implementation / separate-review workflow and review knowledge v0.3 unchanged.

The main change is simple: validation should not replace reasoning. When several technical candidates are possible, the implementation agent should use requirements, risks, scale, runtime behavior, resource ownership, and existing evidence to identify which uncertainties can actually change the decision. Experiments then target those uncertainties instead of treating every candidate or measurable variable equally.

## Highlights

- Prioritize technical candidates by expected effect, information value, evaluation cost, change risk, and reversibility.
- Use theoretical and structural evidence—such as call cardinality, complexity, backlog growth, retries, and runtime constraints—to choose what is worth measuring next.
- Give optional evaluation a task-proportionate budget and stopping condition. More measurements being possible is not, by itself, a reason to continue.
- If the product names speed, memory use, or another property as a differentiator, focus evaluation on it even when no numeric target is supplied.
- Otherwise, prefer a **sufficiently good solution**: try the most promising candidates and stop when relevant verification supports a reasonable result. Do not search for a global optimum by default.
- Missing numeric targets alone do not require Human Decision. Ask only when unresolved priorities, unacceptable tradeoffs, or consequential unknowns prevent a defensible decision within delegated authority.
- Record material adequacy judgments, evidence, assumptions, tradeoffs, remaining limits, and the reason for stopping in the relevant Decision Record.
- Keep ordinary Alder review bounded to business meaning and guarantees. A faster alternative alone does not reopen an accepted business decision; a separately requested performance audit follows its own acceptance conditions and evaluation budget.

## Why this is v0.2

The permanent review knowledge remains **v0.3**. This release does not add a new review question, prescribe an architecture, or change who owns business decisions.

The change is instead to Alder's implementation guidance: it now says more explicitly how an AI should choose among technical alternatives, how much evidence to acquire, and when to stop. That is a material change in expected implementation behavior even though the documentation diff is small, so it is released as v0.2 rather than a patch-level documentation update.

## Evidence and limits

The guidance was derived from the concrete Velvet #20 → #23 / PR #24 sequence documented in [Issue #51](https://github.com/mk3008/alder/issues/51) and the source-pinned [case analysis](https://github.com/mk3008/alder/blob/v0.2/docs/inference-validation.md). The final wording was checked against ten authored thought cases.

This is not evidence that the guidance improves agent behavior in a controlled comparison. No new performance benchmark, production experiment, or application-test replay was run for this release. The source measurements retain their original limitations, and the documented reasoning does not establish production fitness or a globally optimal candidate order.

## Included artifacts

- [Practical adoption guide](https://github.com/mk3008/alder/blob/v0.2/docs/adoption.md)
- [Philosophy](https://github.com/mk3008/alder/blob/v0.2/docs/philosophy.md)
- [Inference, validation order, and evaluation-budget analysis](https://github.com/mk3008/alder/blob/v0.2/docs/inference-validation.md)
- [Review knowledge v0.3](https://github.com/mk3008/alder/blob/v0.2/docs/phase2/review-knowledge-v0.3.md) — unchanged in this release
- [Validation overview](https://github.com/mk3008/alder/blob/v0.2/docs/validation.md)

Alder remains a research candidate. It requires no framework, CLI, or runtime package.
