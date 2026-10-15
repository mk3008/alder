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

**Alder neither recommends nor prohibits architecture styles, layers, code layouts, or patterns.** It does not prescribe when to introduce structure; “do not create layers until they are needed” is not an Alder rule either. Alder primarily assumes an AI agent implements and another agent or fresh context reviews; human implementation is also allowed.

Business Design and explicit requirements, constraints, known risks, future foresight, and review concerns are inputs to the implementation agent. The agent chooses how to realize them within the project's constraints. Architecture knowledge is a useful implementation toolbox, but an architecture name does not substitute for stating the requirement or property to protect.

The result may use Clean Architecture, VSA, DDD, Ports and Adapters, Transaction Script, ordinary functions, or other structures. Alder does not select between them. See [the adoption guidance](adoption.md#3-let-the-ai-implement-without-inventing-business-policy) for how to communicate known future risks without prescribing their solution.

An architecture choice can become a Business confirmation matter in Alder review only when it changes business meaning, authority, allowed states, units of work, or downstream guarantees and that choice is unresolved in Business Design. General internal-structure quality remains a product responsibility. Small exploratory comparisons observed risk-aligned isolation, including local boundaries generated from a concrete future risk without specifying a style; see [validation and limits](validation.md). These observations do not establish long-term investment recovery or total maintenance-cost superiority. Long-term maintainability, comprehension costs, and generalization remain unvalidated.
