# Scope-First Design: Phase 1 Research Synthesis

## Question and scope

This research asks whether a small repository contract can help coding agents keep implementation local to a meaningful business scope, and promote code to shared scope only when present evidence warrants it. It does **not** propose a new architecture or assert priority over established design approaches.

The research unit is an AI-assisted business-application repository. “Scope” is intentionally broader than a folder: it can be a subsystem, feature, endpoint, use case, or a nested grouping. It is not automatically a deployable service, a DDD bounded context, a package, or a security boundary.

## Repository evidence reviewed

At Phase 1 start, this repository was empty apart from generated `work/` and `outputs/` directories. No repository-local instructions, design documents, Raw SQL Rules materials, contracts, default requirements, or evidence artifacts were present. A web search for the named Raw SQL Rules phrases did not identify an authoritative source that could be safely treated as evidence. Therefore, this phase uses the supplied description only as a methodological analogy: make claims testable, distinguish defaults from contracts, and subtract unsupported requirements. It does not attribute unverified details to Raw SQL Rules.

## Established concepts and overlap

| Concept | What the source supports | Overlap with Scope-First | Boundary / non-equivalence |
| --- | --- | --- | --- |
| Information hiding / modularity | Parnas frames decomposition around hiding design decisions likely to change, rather than merely a functional flow. | Default encapsulation and limiting the blast radius of a change are direct descendants. | It does not prescribe feature folders, promotion criteria, or coding-agent instructions. |
| Package by Feature / Component | Feature packaging co-locates code relevant to a feature rather than collecting technical roles globally. | “Define meaningful scope first” and scope-local structure strongly overlap. | A packaging choice alone does not say when to share or whether a local repository/service/interface is justified. |
| Screaming Architecture | A project’s high-level organization should reveal its business purpose/use cases rather than its frameworks. | Business-named top-level scopes are compatible. | It is an architectural legibility principle, not a local-first sharing policy. |
| Vertical Slice Architecture | Bogard advocates coupling on the axis of change, keeping cross-slice sharing minimal, and choosing patterns per request. | This is the closest established expression of scope-local implementation and delayed abstractions. | A vertical slice is usually request/use-case oriented and often discussed with CQRS; Scope-First permits broader/nested scopes and does not require CQRS. |
| Clean Architecture | The Dependency Rule protects policy from details through dependency direction; it explicitly accommodates multiple organizational shapes. | Scope-local layers can satisfy dependency direction; no conflict is inherent. | Clean Architecture does not itself require root-level `Domain`/`Application`/`Infrastructure` packages, nor does it establish a share-only-when-earned trigger. |
| DDD modules / bounded contexts / domain layer | DDD uses bounded contexts to make a model valid within a boundary; tactical patterns can be applied when complexity warrants them. | A semantic boundary and local consistency are aligned; domain requirements need not imply global reuse. | A Scope is not necessarily a bounded context, and the DDD Domain Layer is a modeling approach, not a universal directory requirement. |

## What is already sufficiently established

The following broad claims are already well represented by prior concepts and do not require a new empirical experiment merely to establish them:

1. Hiding change-prone decisions behind a boundary is a modularity principle.
2. Feature/use-case-oriented organization can improve discoverability and reduce horizontal technical coupling.
3. Technical layers are not the only valid organizational axis.
4. DDD boundaries constrain the validity of models; they do not require one global model.
5. Clean Architecture’s dependency direction can coexist with local structure.

These are not new Scope-First findings. The unresolved question is narrower: does a terse, neutral candidate contract cause coding agents to make measurably more local, non-speculative changes than an otherwise identical prompt without it?

## Honest novelty assessment

No architectural novelty is established. “Scope first,” local encapsulation, feature organization, evolutionary structure, and cautious reuse substantially overlap with information hiding, package-by-feature, Screaming Architecture, Vertical Slice Architecture, evolutionary design, and DDD boundary thinking.

The only potentially distinct contribution is operational and compositional: a small, architecture-neutral repository instruction for coding agents that (a) names a scope before selecting layers, (b) permits nested and evolving scopes, and (c) requires present, observed semantic/contract need before promotion. That contribution is not yet validated and may prove to be a clearer restatement of existing concepts rather than a separately useful contract.

## Risks and counterarguments

- “Scope” can be vague. Without task fixtures that name a scope and define observable boundaries, results may measure interpretation skill rather than the candidate text.
- Locality is not always desirable. Security, transactions, observability, compatibility, platform integrations, and genuinely shared business invariants may require a wider boundary.
- Duplication is not automatically waste. Conversely, delayed promotion can allow harmful divergence. The treatment must not reward blind duplication.
- A prompt may improve conformance while harming design quality, readability, or correctness. Functional and regression gates must be primary.
- Repository layout is not a reliable proxy for modularity. Dependency direction, export visibility, and touched-file evidence must be collected too.

## Research conclusion

Existing research/concepts are sufficient for the underlying human design principles, but not for the target population and operational intervention: contemporary coding agents responding to a small repository contract. A bounded preregistered comparison is justified only for that unresolved implementation-behavior question. It should not be framed as a test of whether Vertical Slice, Clean Architecture, or DDD is “better.”
