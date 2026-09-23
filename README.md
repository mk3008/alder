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
2. For this unreleased revision, agree on Business Design and human-review the derived Check Items before handing both to implementation. This completes the standard design business; the tagged v0.5/v0.5.1 workflow kept Check Items optional.
3. Route these paths through AGENTS.md or the task prompt. Have the AI read the confirmed Business Design and Check Items, implement the task, and report material assumptions and choices for the later Alder follow-up. It must not invent unresolved business policy; routine reversible technical choices can proceed.
4. After implementation, give the review prompt to a separate AI agent or fresh context. Use `docs/alder/review-knowledge.md` to review the work, reading **Business Design → Decision Records → implementation / DDL / tests**. In the follow-up, verify and maintain Check ↔ Test/assertion mappings.
5. Return only unresolved business questions to people for a decision.

This layout and a local review-knowledge copy are optional. Prefer keeping design and implementation in the same repository; a known workspace path and revision also works. Review knowledge may instead come from a readable versioned GitHub URL or an Alder checkout in the workspace.

**Alder does not prescribe an architecture style or when to introduce structure.** Give the implementation agent the Business Design, explicit requirements and constraints, and concrete future risks you actually foresee; let it choose how to realize them. Architecture knowledge can support that choice, but a style name does not replace requirements.

When technical alternatives compete, **reason before measuring**. Use requirements, risks, scale, runtime behavior, and existing evidence to focus validation on the uncertainties most likely to change the decision. Bound optional evaluation and stop when a sufficiently supported solution is found unless the product explicitly calls for deeper optimization; missing numeric targets alone are not a reason to stop and ask.

[Follow the adoption guide and copy the prompts →](docs/adoption.md)

## Optional Business Graph export for external tools

[Business Design for using Alder](business-design/alder/README.md) can be projected into versioned JSON with a dependency-free Python 3.12+ CLI:

```sh
python3 tools/business_graph/export.py business-design/alder/README.md -o graph.json
```

Generate JSON when an external visualization, analysis or processing tool helps the designer's own review, a requester's review, or the inspection of business correlations. It is an intermediate format, not a standard Business Activity or a requester deliverable. Consumers need not commit generated JSON or use it to finish standard design work. This repository commits its own projection only as an exporter regression fixture. Business Design remains the SSOT; feed any corrections discovered through external tools back into it. Procedure is outside the projection. See the [source format, relation contract and CLI usage](docs/business-graph.md).

## Read more

| Need | Document |
| --- | --- |
| Workspace setup, Business Design format, AGENTS.md routing, prompts, optional SQL tools | [Adoption guide](docs/adoption.md) |
| Why implementation helps validate requirements; reasoning, DDD and architecture | [Philosophy](docs/philosophy.md) |
| Review questions, procedures, boundaries, and stopping conditions | [Review knowledge v0.3](docs/phase2/review-knowledge-v0.3.md) (Japanese) |
| Optional discovery of undocumented functional conditions before Check/Test commitments | [Functional consideration discovery](docs/behavior-derivation/functional-considerations.md) |
| Required Check Item design and human review, with AI-maintained traceability from Business Design to tests; tests verify code by execution | [Check Item traceability](docs/check-item-traceability.md) |
| Previous candidates, adoption decisions, established foundations, reasons and reconsideration boundaries | [Research Decision Index](docs/research-decisions.md) |
| Evidence, limitations, current questions, and earlier research | [Validation](docs/validation.md) |

**Alder v0.5** kept Check Item drafting and traceability optional; when used, permanent mappings stopped at Test, without Check Item ↔ Code location mappings. **This unreleased revision** makes Check Item design and human review required before handoff to implementation. The standard design business ends at that handoff. The separate post-implementation Alder review and follow-up still check Test expectations and maintain Check ↔ Test/assertion mappings before accepting the implementation change. Tests verify Code by execution. **Research review knowledge v0.3** remains unchanged. Alder remains a research candidate; see the historical [v0.5 release notes](docs/release-notes-v0.5.md). The method requires no framework, CLI, or runtime package; the graph exporter above is optional.
