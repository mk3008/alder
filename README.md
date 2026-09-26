# Alder

English | [日本語](README.ja.md)

**Find gaps in your specification through implementation.**

Alder studies a development loop in which an AI agent implements **Business Design**—a description of who does the work, when, and with what inputs and outputs—then another agent or fresh context reviews it. Review traces the business meaning made concrete in implementation back to the design and narrows gaps and unresolved choices into questions people can decide. You can begin coding before every business decision is settled.

It combines established software engineering practices—requirements validation, walkthroughs, bidirectional traceability, decision records, and human judgment—for repeated use with AI. It proposes no new design theory or architecture.

**People define and approve business intent. AI implements it. A separate AI reviews the implementation. Only unresolved business questions return to people for a decision.**

## Start with your product

For **post-implementation review**, install and enable Alder Plugin `0.1.0` once, then start a new chat:

```sh
codex plugin marketplace add mk3008/alder --ref plugin-v0.1.0
```

Keep current Business Design in the product repository under `docs/business-design/` (or specify its existing path). After implementation, ask in that new chat:

```text
Review this implementation with Alder.
```

The plugin finds the design, uses its bundled review knowledge v0.3 and reports read-only findings. No review-knowledge copy, long review prompt, or Alder-specific AGENTS.md entry is needed for the conventional path. A separate follow-up handles human decisions and Check ↔ Test/assertion mappings. See [plugin setup](docs/plugin-adoption.md) for activation and [the adoption guide](docs/adoption.md) for Business Design, implementation handoff, other Alder workflows, and manual review with clients without the plugin.

When a Business Design's relevant current-state relationships are confirmed, an optional [Structural Discovery inquiry](docs/optimization-review.md#optional-structural-discovery-before-a-problem-is-known) can surface a few grounded questions without declaring a Problem. If people confirm a concrete operational **Problem** and **Pain level**, Alder can run the existing [Optimization Review](docs/optimization-review.md) to explore alternatives, evaluate Scope and business-change Difficulty, and preserve existing meaning until people decide to change it; accepted candidates update Business Design first.

**Alder does not prescribe an architecture style or when to introduce structure.** Give the implementation agent the Business Design, explicit requirements and constraints, and concrete future risks you actually foresee; let it choose how to realize them. Architecture knowledge can support that choice, but a style name does not replace requirements.

When technical alternatives compete, **reason before measuring**. Use requirements, risks, scale, runtime behavior, and existing evidence to focus validation on the uncertainties most likely to change the decision. Bound optional evaluation and stop when a sufficiently supported solution is found unless the product explicitly calls for deeper optimization; missing numeric targets alone are not a reason to stop and ask.

[Install and use the Alder Plugin →](docs/plugin-adoption.md) · [Manual adoption and reference prompts →](docs/adoption.md)

## Optional Business Graph export for external tools

[Business Design for using Alder](business-design/alder/README.md) can be projected into versioned JSON with a dependency-free Python 3.12+ CLI:

```sh
python3 tools/business_graph/export.py business-design/alder/README.md -o graph.json
```

Generate JSON when an external visualization, analysis or processing tool helps the designer's own review, a requester's review, or the inspection of business correlations. It is an intermediate format, not a standard Business Activity or a requester deliverable. Business and Object nodes each preserve an explicit boolean Scope declared in Business Design; Object Scope is not inferred from links. Consumers need not commit generated JSON or use it to finish standard design work. This repository commits its own projection only as an exporter regression fixture. Business Design remains the SSOT; feed any corrections discovered through external tools back into it. Procedure is outside the projection. See the [source format, relation contract and CLI usage](docs/business-graph.md).

## Read more

| Need | Document |
| --- | --- |
| One-time plugin install and short implementation-review request | [Alder Plugin](docs/plugin-adoption.md) |
| Initial plugin validation, Fresh A/B comparison, and remaining limits | [Issue #86 validation](docs/plugin-poc-evaluation.md) |
| Workspace setup, Business Design format, AGENTS.md routing, prompts, optional SQL tools | [Adoption guide](docs/adoption.md) |
| Why implementation helps validate requirements; reasoning, DDD and architecture | [Philosophy](docs/philosophy.md) |
| Review questions, procedures, boundaries, and stopping conditions | [Review knowledge v0.3](docs/phase2/review-knowledge-v0.3.md) (Japanese) |
| Problem-driven review of alternative business designs using Problem / Pain / Scope / Difficulty | [Optimization Review](docs/optimization-review.md) |
| Optional discovery of undocumented functional conditions before Check/Test commitments | [Functional consideration discovery](docs/behavior-derivation/functional-considerations.md) |
| Required Check Item design and human review, with AI-maintained traceability from Business Design to tests; tests verify code by execution | [Check Item traceability](docs/check-item-traceability.md) |
| Previous candidates, adoption decisions, established foundations, reasons and reconsideration boundaries | [Research Decision Index](docs/research-decisions.md) |
| Evidence, limitations, current questions, and earlier research | [Validation](docs/validation.md) |

**Alder v0.6** adds the adopted Problem-driven Optimization Review workflow while retaining **Business Design ↔ Check Item ↔ Test** as the permanent traceability boundary. In released v0.6, Check Item drafting and traceability remain optional; **this unreleased revision** makes Check Item design and human review required before handoff to implementation. The standard design business ends at that handoff, while the separate post-implementation Alder review and follow-up check Test expectations and maintain Check ↔ Test/assertion mappings before accepting the implementation change. Tests verify Code by execution; Alder does not maintain Check Item ↔ Code location mappings. **Research review knowledge v0.3** remains unchanged. Alder remains a research candidate overall; see the [v0.6 release notes](docs/release-notes-v0.6.md). The method requires no framework, CLI, or runtime package; the Business Graph exporter is optional.
