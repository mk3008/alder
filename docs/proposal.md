# Scope-First Candidate Proposal (Non-Normative)

## Status

This is a candidate intervention text for evaluation. It is **not** an adopted repository contract, default requirement, or normative rule.

## Candidate text

> Start by naming the smallest meaningful scope for the requested change (for example, subsystem, feature, endpoint, or use case). Scopes may be nested and may later be split, merged, added, or removed.
>
> Keep code used only by that scope inside it by default. Add internal structure—such as domain, application, repository, service, port, or adapter—only when the scope’s present problem needs it. Do not require those structures in advance.
>
> Do not promote code to an application-wide technical layer, shared package, repository, service, interface, or common abstraction solely for anticipated reuse. Promote the smallest common scope only when multiple current scopes need the same meaning and contract. Record the concrete consumers and the contract being shared.
>
> Treat domain requirements as business meanings and constraints that must remain consistent across relevant functionality. They do not by themselves require a universal Domain Layer or a prescribed directory layout.
>
> Preserve existing explicit architecture, security, framework, public-API, and testing requirements. When they conflict, follow the explicit requirement and explain the trade-off.

The final paragraph is a containment clause, not an attempt to override a repository’s existing contract.

## Classification of the core hypothesis

| Item | Durable human/product value | Merely coding-agent operational advice? | Already expressed by existing concepts? | Value as a normative contract? | Phase 1 disposition |
| --- | --- | --- | --- | --- | --- |
| Scope first | Yes: aligns organization with business/change boundaries. | Partly: asking an agent to name a scope is operational. | Yes: feature packaging, Screaming Architecture, VSA, bounded contexts. | Conditional: only if it improves agent decisions beyond existing instructions. | Evaluate. |
| Encapsulate by default | Yes: information hiding is durable. | Partly: default wording guides implementation. | Yes: directly rooted in information hiding/modularity. | Conditional: use only if visibility/boundary evidence improves without regressions. | Evaluate. |
| Structure as needed | Yes: avoids accidental complexity and preserves adaptability. | Partly: it constrains agent scaffolding behavior. | Largely: evolutionary design/YAGNI and VSA’s per-slice pattern choice. | Conditional: a contract must define exceptions and cannot ban useful structure. | Evaluate. |
| Share only when earned | Yes: prevents inappropriate coupling and protects local evolution. | Partly: an agent needs an observable promotion trigger. | Largely: information hiding, VSA’s minimal sharing, DDD shared-kernel caution. | Conditional: strongest candidate, but “earned” must be operationalized as current semantic/contract need, not duplicate count alone. | Evaluate. |
| Domain is not necessarily a layer | Yes: prevents model/implementation conflation. | Less so; mainly a clarification against a common architectural assumption. | Yes: DDD strategic boundaries and models do not entail one directory template. | Low to conditional: likely explanatory guidance rather than a standalone must/shall. | Include only as a clarification in treatment. |

## Candidate contract boundary

The candidate is intentionally limited to four decisions: first scope, default placement, optional local structure, and promotion to a shared scope. It does not specify programming language, framework, folder names, architectural topology, CQRS, eventing, ORM, database access, dependency injection, or testing style.

It must not be read as:

- a ban on shared code, abstractions, repositories, services, interfaces, or layers;
- a claim that every endpoint is its own module or bounded context;
- permission to violate an existing dependency rule or security boundary;
- a claim that repeated syntax alone proves semantic sameness; or
- a substitute for domain analysis where business complexity requires it.

## Promotion evidence model (for measurement, not a rule)

A proposed promotion has positive evidence when the change record identifies all of the following:

1. At least two *current* consuming scopes.
2. The shared meaning and behavior/compatibility contract.
3. Why a narrower common parent is insufficient or is the selected target.
4. The intended visibility/export boundary.

This does not make “two consumers” a universal design law. It prevents an evaluator from counting a mere helper name match as justified sharing.

## Phase 1 decision

**Decision: PROCEED_TO_PREREGISTERED_EVALUATION.**

Rationale: the human architectural principles are not novel and should not be re-proven. However, the tightly scoped causal claim—whether this wording changes coding-agent structure decisions while preserving correctness—remains unresolved and is observable with controlled fixtures. The candidate must be evaluated as guidance, not promoted to a normative contract beforehand.

Unresolved before adoption:

- Does the term “scope” yield stable agent interpretations across languages and task shapes?
- Are the proposed metrics reliable across independent reviewers?
- Does the treatment still help under an explicit Clean-Architecture-style dependency constraint?
- Does it help a lower-cost model, rather than only a stronger model?
- What failure threshold (for example, domain-invariant divergence) makes delayed sharing unacceptable?

The minimum next phase is the preregistered evaluation in `docs/evaluation-plan.md`, followed by a revision or no-go decision—not publication of rules.
