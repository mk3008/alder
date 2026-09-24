# Alder

English | [日本語](README.ja.md)

**Talk with users through Business Design.**

Alder does not treat the business agreement with users as an external handoff document.  
It keeps the agreed **Business Design** as the source of truth and connects improvement, Check Items, AI implementation, and review to it.

No framework or runtime package is required. Put the Business Design where the agent can read it.

## Alder in 30 seconds

| Current situation | What Alder does |
| --- | --- |
| Business meaning is missing or undecided | Write Business Design with users and agree on it |
| You have a hypothesis for new or changed work | Make the intended work concrete as Business Design and check whether the work can operate coherently |
| The current work is viable, but people have a concrete pain | Record Problem / Pain in Business Design and run Optimization Review |
| Business Design is agreed and should be implemented | Derive Check Items, human-review them, then let AI implement |
| You want to verify the implementation against the agreed work | A separate AI reviews it and returns only unresolved business decisions to people |

An improvement proposal does not become policy by being generated. Only an accepted change updates Business Design, and implementation proceeds again from that agreed source.

```text
Users ↔ Business Design
          ├─ Problem / Pain → Optimization Review ──accepted→ Business Design
          └─ Check Item → AI implementation → independent review
```

## Start

For a new product, this is enough:

```text
product/
  docs/
    business-design/
    decisions/
    alder/
      review-knowledge.md
  src/
  tests/
```

1. Write the current or intended work under `docs/business-design/`.
2. Review it with users and agree on the business meaning.
3. Have AI draft Check Items and have people review them.
4. Let AI implement, then review in a separate agent or fresh context.

See the [adoption guide](docs/adoption.md) for the detailed workflow and copyable prompts.

## When you want to improve the work

If the current work is viable but people experience a concrete problem, first record **Problem / Pain** in Business Design.

Then run [Optimization Review](docs/optimization-review.md). AI proposes a small set of alternatives; people decide whether to adopt any of them.

## Business Graph (optional)

Business Design can be projected to JSON for external visualization or analysis.  
JSON is an intermediate format; Business Design remains the source of truth.

[Business Graph JSON v1 and exporter](docs/business-graph.md)

## Read more

| Need | Document |
| --- | --- |
| Setup, Business Design authoring, standard workflow | [Adoption guide](docs/adoption.md) |
| Business improvement proposals | [Optimization Review](docs/optimization-review.md) |
| Implementation review questions | [Review knowledge v0.3](docs/phase2/review-knowledge-v0.3.md) |
| Business Design → Check Item → Test traceability | [Check Item traceability](docs/check-item-traceability.md) |
| Business Graph JSON / exporter | [Business Graph](docs/business-graph.md) |
| Alder's reasoning and boundaries | [Philosophy](docs/philosophy.md) |
