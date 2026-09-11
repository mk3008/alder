# Alder

English | [日本語](README.ja.md)

**Find gaps in your specification through implementation.**

Alder studies a development loop in which an AI agent implements **Business Design**—a description of who does the work, when, and with what inputs and outputs—then another agent or fresh context reviews it. Review traces the business meaning made concrete in implementation back to the design and narrows gaps and unresolved choices into questions people can decide. You can begin coding before every business decision is settled.

It combines established software engineering practices—requirements validation, walkthroughs, bidirectional traceability, decision records, and human judgment—for repeated use with AI. It proposes no new design theory or architecture.

**Business Design → Implementation → Review → Human Decision → Update**

## Start with your product

For a new product, this is the recommended example; existing equivalent locations are fine:

```text
product/
  AGENTS.md
  docs/
    business-design/
      ...
    decisions/
      ...
    alder/
      review-knowledge.md
  src/
  tests/
```

1. Put current Business Design in `docs/business-design/` and the selected Alder version's review knowledge in `docs/alder/review-knowledge.md`.
2. Route these paths through AGENTS.md or the task prompt. Have the AI read Business Design first, implement the task, and record material assumptions and choices in `docs/decisions/`. It must not invent unresolved business policy; routine reversible technical choices can proceed.
3. After implementation, give the review prompt to a separate agent or fresh context. Apply the selected review knowledge and read **Business Design → Decision Records → implementation / DDL / tests**.
4. Return necessary business decisions to people, update Business Design with their decisions, and align implementation and tests.

This layout and a local review-knowledge copy are optional. Prefer keeping design and implementation in the same repository; a known workspace path and revision also works. Review knowledge may instead come from a readable versioned GitHub URL or an Alder checkout in the workspace.

**You do not have to choose an architecture up front.** Without a strong requirement, start AI coding from the Business Design without selecting a named architecture style. First check that the work can be carried out as intended; introduce boundaries, layers, and patterns where concrete needs arise. Known costly boundaries may justify earlier separation.

[Follow the adoption guide and copy the prompts →](docs/adoption.md)

## Read more

| Need | Document |
| --- | --- |
| Workspace setup, Business Design format, AGENTS.md routing, prompts, optional SQL tools | [Adoption guide](docs/adoption.md) |
| Why implementation helps validate requirements; DDD and architecture | [Philosophy](docs/philosophy.md) |
| Review questions, procedures, boundaries, and stopping conditions | [Review knowledge v0.3](docs/phase2/review-knowledge-v0.3.md) (Japanese) |
| Evidence, limitations, current questions, and earlier research | [Validation](docs/validation.md) |

The planned **Alder v0.1** release includes **research review knowledge v0.3**. Alder remains a research candidate; see the [release notes draft](docs/release-notes-v0.1.md). It requires no framework, CLI, or runtime package.
