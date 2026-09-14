# Sources and Evidence Boundary

Selected conceptual references for Alder; see the [foundation mapping](research-decisions.md#established-foundations) for current application and Alder evidence. External sources do not validate Alder's exact wording or effectiveness for coding agents. The original Phase 1 references and historical boundary remain below.

## Current Alder foundations

Added 2026-09-14 for [Issue #60](https://github.com/mk3008/alder/issues/60). These are representative foundations, not claims of historical derivation or standards compliance. Newly added web references were read on that date; the Parnas reference reuses the existing Phase 1 source and synthesis.

### Requirements validation and operational scenarios

NASA, [Systems Engineering Handbook, §4.0 System Design Processes](https://www.nasa.gov/reference/4-0-system-design-processes/), especially §4.1.1.2.4 (concept of operations), §4.2.1.2.2 (functional and interface requirements), and §4.2.1.2.4 (requirements validation). This authoritative systems-engineering reference connects intended operation, stakeholder expectations and requirement consistency. It is a basis for scenario-based checking, not a prescription for Alder's participant walkthrough or formal walkthrough compliance. Alder does not import NASA's lifecycle, approval gates or exhaustive coverage expectations.

### Bidirectional traceability

NASA, [Systems Engineering Handbook, §4.2.1.2.4](https://www.nasa.gov/reference/4-0-system-design-processes/), checks traceability between requirements and stakeholder expectations. This supports tracing intent in both directions. Alder's P2 extends that idea to implementation-selected business meaning; a link or passing test alone does not settle whether that meaning was approved.

### Decision rationale and status

Michael Nygard, [Documenting Architecture Decisions](https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions), 2011. The original ADR proposal records context, decision, status and consequences, retaining superseded decisions so their reasons remain understandable. It supports lightweight decision memory. Alder uses that practice for material implementation choices and research navigation without requiring Nygard's template or equating technical acceptance with business approval. The reference does not demonstrate reduced anchoring in Alder reviews.

### Proportionate decision analysis

NASA, [Systems Engineering Handbook, §6.8 Decision Analysis](https://www.nasa.gov/reference/6-8-decision-analysis/), especially §6.8.1.2 and §6.8.1.2.1. Analysis effort should match decision consequences; criteria have priorities, and decisions can use qualitative and quantitative evidence plus engineering judgment. Alder's promising-first search, explicit evaluation budget and adequacy-based stopping operationalize a narrower policy. The source does not prove that policy optimal, specify Alder's benchmark set, or waive required verification.

### Error prevention

Jakob Nielsen, [10 Usability Heuristics for User Interface Design, #5 Error Prevention](https://www.nngroup.com/articles/ten-usability-heuristics/), originally 1994, current online explanation. Preventing error-prone conditions, with useful constraints and defaults, is an established interaction-design principle. Extending it to cheap structural operational choices is Alder's bounded judgment, not evidence that a UI heuristic establishes safe behavior for all deployment, retry or handoff mechanisms.

### Information hiding and concrete change risk

David L. Parnas, *On the Criteria To Be Used in Decomposing Systems into Modules* (1972), source 1 below. Decomposition around change-prone design decisions supports considering concrete change risk when choosing boundaries. The [existing Phase 1 comparison](research.md#established-concepts-and-overlap) records this relationship. It does not mandate a named architecture, determine when abstraction pays, or establish maintenance savings in Alder's experiments.

## Primary or authoritative sources

Original Phase 1 architecture references, accessed 2026-09-04:

1. David L. Parnas, [On the Criteria To Be Used in Decomposing Systems into Modules](https://dl.acm.org/doi/10.1145/361598.361623), *Communications of the ACM*, 1972. The foundational information-hiding framing.
2. Robert C. Martin, [Screaming Architecture](https://blog.cleancoder.com/uncle-bob/2011/09/30/Screaming-Architecture.html), 2011. Business/use-case legibility of architecture.
3. Robert C. Martin, [The Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html), 2012. Dependency-rule framing.
4. Jimmy Bogard, [Vertical Slice Architecture](https://www.jimmybogard.com/vertical-slice-architecture/), 2018. Coupling on an axis of change, minimal cross-slice sharing, and per-slice choices.
5. Philipp Hauer, [Package by Feature](https://phauer.com/2020/package-by-feature/), 2020/2022. Feature packaging contrast with technical-layer packaging.
6. Microsoft Learn, [Use domain analysis to model microservices](https://learn.microsoft.com/en-nz/azure/architecture/microservices/model/domain-analysis), accessed 2026-09-04. Bounded contexts, iterative boundaries, and model scope.
7. Microsoft Learn, [Use tactical DDD to design microservices](https://learn.microsoft.com/en-ca/azure/architecture/microservices/model/tactical-ddd), accessed 2026-09-04. Tactical patterns are applied within bounded contexts rather than mandated as one global package layout.
8. Eric Evans, *Domain-Driven Design: Tackling Complexity in the Heart of Software*, Addison-Wesley, 2003. Canonical book reference for bounded context/modules/domain modeling; not quoted here because no authoritative freely accessible full text was used.

## Methodological boundary

Historical Phase 1 boundary (2026-09-04): the requested “Raw SQL Rules” Contracts / Default Requirements / evidence-driven subtraction material was not present locally, and searches did not yield a clearly authoritative public source. This repository therefore does not claim to have reviewed or derived any specific rule from it. Its only methodological stance is explicit in the documents: do not publish a rule before evidence; remove unsupported structure; and separate an evaluable candidate from a normative contract.

## What these sources cannot prove

External foundations cannot establish a causal effect of Alder’s specific wording, integration or operating policy on coding agents. Alder-specific observations, normative judgments and unresolved claims remain in the [Research Decision Index](research-decisions.md), its original evidence records and the [evaluation plan](evaluation-plan.md).
