# Why Alder uses implementation to validate requirements

[Back to Alder](../README.md) · [Apply it to a product](adoption.md)

## Why not settle every decision before implementing?

Business Design needs enough detail to identify the current work and trace its connections. Alder does not treat careless specifications as sufficient, but it does not postpone implementation until every business decision is perfectly specified.

Implementation makes ambiguity observable: code, DDL, tests, and decision records fix choices about data meaning, cardinality, identity, states and allowed transitions, authority and responsibility, units of work, constraints, and upstream or downstream guarantees. Review can then ask where those concrete choices came from in the operational specification.

| Material | Role |
| --- | --- |
| Business Design | The reference for current operational intent. |
| Implementation, DDL, tests, decision records | Evidence of what the implementation chose and how it behaves. |
| Unresolved business meaning | A focused question for the responsible people to decide. |

Implementation is observation material for requirements validation; it does not become the business source of truth. A documented assumption or passing test does not constitute business approval. The loop follows specification to implementation and implementation back to specification.

A light pre-implementation check can catch obvious contradictions or blockers. Alder's main use here is reviewing choices after implementation has made them concrete. The best division between pre- and post-implementation review remains unverified; design review is not dismissed.

## Validation rather than model discovery

Alder does not seek to derive the correct domain model. It procedurally checks whether business meaning fixed in the chosen implementation was actually decided in the current Business Design.

Start with the described work, read the implementation evidence, and apply Q1–Q3 through P1 / P2 in the [review knowledge](phase2/review-knowledge-v0.3.md). Use S to distinguish definite mismatches, Business confirmation, technical improvements, and sufficient behavior. Return only unresolved choices with concrete effects on work or guarantees; stop when the relevant meaning and external responsibility are established.

This makes what to inspect, what counts as evidence, and where to stop more explicit. It produces candidates for human judgment, not an automatically correct model. Agent findings still vary; see [the evidence and limits](validation.md).

## Established practices, used together

Alder combines requirements description and validation, walkthroughs and scenario review, forward and backward traceability, assumptions and decision records with rationale, iterative implementation, and human review and decisions. Its research question is whether AI can repeatedly apply these established practices in a small development loop. It introduces no new design theory and is not positioned as a replacement for DDD.

## Relation to DDD / Domain Models

DDD keeps domain knowledge and implementation aligned through a domain model. Model-Driven Design connects analysis, design, and code; Hands-on Modelers connects modeling with programming. DDD also emphasizes iterative discovery and refactoring toward deeper insight. It does not assume a perfect model before coding or reject learning from implementation. See Eric Evans' [DDD Reference](https://www.domainlanguage.com/ddd/reference/) and its [pattern summaries](https://www.domainlanguage.com/wp-content/uploads/2016/05/DDD_Reference_2015-03.pdf), especially Model-Driven Design, Hands-on Modelers, and Refactoring Toward Deeper Insight.

Evans describes DDD as a synthesis of accepted practices and his experience and insights, not a rejection of established engineering. See [The Big Blue Book](https://www.domainlanguage.com/ddd/blue-book/).

Alder does not require a domain model, Ubiquitous Language, Bounded Contexts, Aggregates, Entities, or Value Objects. It neither derives an object model from Business Design nor requires code to mirror that model's structure. It reviews whatever implementation was chosen and checks whether its business meaning was decided.

DDD and Alder can be used together. A DDD product, a Transaction Script, or ordinary functions and SQL can all supply implementation evidence. The difference is what the approach centers on, not a judgment that one is superior.

## AI coding and architecture

**You do not have to choose an architecture up front.** Alder primarily assumes an AI agent carries out implementation and another agent or fresh context reviews it. Human coding is allowed, but the current operating approach is designed around AI implementation.

Under that assumption, repository search and work across code locations reduce the reason to prescribe a global layout solely for human navigation. Without a strong requirement, constraint, or known change boundary, start from Business Design and existing conventions without choosing a named architecture style. First establish that the intended work is supported.

Introduce boundaries, layers, and patterns only where concrete change, integration, runtime, or organizational needs justify them, at the necessary scope. When the cost of changing an external API or persistent data boundary is already clear, separating it early can be sensible product engineering. This is not an Alder checklist or a prerequisite for starting.

Layered Architecture, Vertical Slice Architecture, Hexagonal / Ports and Adapters, DDD / Domain Model structures, Transaction Script, and framework conventions are theoretically compatible. These are possibilities, not a selection exercise or a validated comparison. An explicitly named style is unnecessary if the design and implementation are readable and business-significant choices can be traced.

Architecture choices enter Alder review when they change business meaning, authority, allowed states, units of work, or downstream guarantees. General internal-structure quality remains a product responsibility. Alder has not validated architecture effects or long-term maintainability, and does not claim AI makes maintenance irrelevant or that every structural problem can be fixed later.
