# Alder

English | [日本語](README.ja.md)

**Find gaps in your specification through implementation.**

Alder studies a development loop in which an AI agent implements **Business Design**—a description of who does the work, when, and with what inputs and outputs—then another agent or fresh context reviews it. Review traces the business meaning made concrete in implementation back to the design and narrows gaps and unresolved choices into questions people can decide. You can begin coding before every business decision is settled.

It combines established software engineering practices—requirements validation, walkthroughs, bidirectional traceability, decision records, and human judgment—for repeated use with AI. It proposes no new design theory or architecture.

**People define and approve business intent. AI implements it. A separate AI reviews the implementation. Only unresolved business questions return to people for a decision.**

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

1. Put current Business Design in `docs/business-design/` and a local copy of the selected Alder version's review knowledge in `docs/alder/review-knowledge.md`.
2. Route these paths through AGENTS.md or the task prompt. Have the AI read Business Design first, implement the task, and record material assumptions and choices in `docs/decisions/`. It must not invent unresolved business policy; routine reversible technical choices can proceed.
3. After implementation, give the review prompt to a separate AI agent or fresh context. Use `docs/alder/review-knowledge.md` to review the work, reading **Business Design → Decision Records → implementation / DDL / tests**.
4. Return only unresolved business questions to people for a decision.

This layout and a local review-knowledge copy are optional. Prefer keeping design and implementation in the same repository; a known workspace path and revision also works. Review knowledge may instead come from a readable versioned GitHub URL or an Alder checkout in the workspace.

**Alder does not prescribe an architecture style or when to introduce structure.** Give the implementation agent the Business Design, explicit requirements and constraints, and concrete future risks you actually foresee; let it choose how to realize them. Architecture knowledge can support that choice, but a style name does not replace requirements.

When technical alternatives compete, **reason before measuring**. Use requirements, risks, scale, runtime behavior, and existing evidence to focus validation on the uncertainties most likely to change the decision. Bound optional evaluation and stop when a sufficiently supported solution is found unless the product explicitly calls for deeper optimization; missing numeric targets alone are not a reason to stop and ask.

[Follow the adoption guide and copy the prompts →](docs/adoption.md)

## Optional Business Graph export

[Alder's own Business Design](business-design/alder/README.md) can be projected into versioned JSON with a dependency-free Python 3.12+ CLI:

```sh
python3 tools/business_graph/export.py business-design/alder/README.md -o business-design/alder/graph.generated.json
```

Business Design remains the SSOT; JSON is regenerated, not edited. Procedure is outside this projection. See the [source format, relation contract and CLI usage](docs/business-graph.md).

## Read more

| Need | Document |
| --- | --- |
| Workspace setup, Business Design format, AGENTS.md routing, prompts, optional SQL tools | [Adoption guide](docs/adoption.md) |
| Why implementation helps validate requirements; reasoning, DDD and architecture | [Philosophy](docs/philosophy.md) |
| Review questions, procedures, boundaries, and stopping conditions | [Review knowledge v0.3](docs/phase2/review-knowledge-v0.3.md) (Japanese) |
| Optional discovery of undocumented functional conditions before Check/Test commitments | [Functional consideration discovery](docs/behavior-derivation/functional-considerations.md) |
| Optional human/AI traceability from Business Design through Check Items to tests; tests verify code by execution | [Check Item traceability](docs/check-item-traceability.md) |
| Previous candidates, adoption decisions, established foundations, reasons and reconsideration boundaries | [Research Decision Index](docs/research-decisions.md) |
| Evidence, limitations, current questions, and earlier research | [Validation](docs/validation.md) |

**Alder v0.5** keeps Business Design ↔ Check Item ↔ Test as the permanent traceability boundary and deliberately does not maintain Check Item ↔ Code location mappings. Tests verify the implementation by execution. **Research review knowledge v0.3** remains unchanged. Alder remains a research candidate; see the [v0.5 release notes](docs/release-notes-v0.5.md). The development method requires no framework, CLI, or runtime package; the graph exporter above is optional.
