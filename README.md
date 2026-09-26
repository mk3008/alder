# Alder

English | [日本語](README.ja.md)

**Find gaps in your specification through implementation.**

Alder studies a development loop in which an AI agent implements **Business Design**—a description of who does the work, when, and with what inputs and outputs—then another agent or fresh context reviews it. Review traces the business meaning made concrete in implementation back to the design and narrows gaps and unresolved choices into questions people can decide. You can begin coding before every business decision is settled.

It combines established software engineering practices—requirements validation, walkthroughs, bidirectional traceability, decision records, and human judgment—for repeated use with AI. It proposes no new design theory or architecture.

**People define and approve business intent. AI implements it. A separate AI reviews the implementation. Only unresolved business questions return to people for a decision.**

## Start with your product

**Alder Plugin (post-implementation review):** Install version `0.1.0` from the public Alder GitHub repository, enable it once, start a new chat, keep Business Design in the product repository, and ask “Review this implementation with Alder.” The current stable GitHub distribution is pinned by tag `plugin-v0.1.0`; public Plugins Directory publication is a separate future distribution step. With the conventional `docs/business-design/` path, no Alder-specific project configuration is needed. The installed plugin bundles review knowledge v0.3, routes the short natural-language request to the review skill, discovers the relevant Business Design, remains read-only, and reports the versions and revisions it used. The initial client validation also found semantically equivalent review conclusions to the manual route on one bounded Velvet comparison.

```sh
codex plugin marketplace add mk3008/alder --ref plugin-v0.1.0
```

See [Plugin setup](docs/plugin-adoption.md). Other Alder workflows still use the [adoption guide](docs/adoption.md).

### Manual/reference workflow

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

When a Business Design's relevant current-state relationships are confirmed, an optional [Structural Discovery inquiry](docs/optimization-review.md#optional-structural-discovery-before-a-problem-is-known) can surface a few grounded questions without declaring a Problem. If people confirm a concrete operational **Problem** and **Pain level**, Alder can run the existing [Optimization Review](docs/optimization-review.md) to explore alternatives, evaluate Scope and business-change Difficulty, and preserve existing meaning until people decide to change it; accepted candidates update Business Design first.


Business quality requirements are not omitted or collected in a separate Quality bucket. A requester-defined deadline, continuity condition, retry invariant, authority rule or traceability requirement is written into the existing Business Design field that it constrains—such as Procedure, Exception, Result, Who or Object.Information—while technical mechanisms remain in System Design. See [business quality requirements](docs/adoption.md#business-quality-requirements-belong-where-they-constrain-the-work).

This layout and a local review-knowledge copy are optional. Prefer keeping design and implementation in the same repository; a known workspace path and revision also works. Review knowledge may instead come from a readable versioned GitHub URL or an Alder checkout in the workspace.

Detailed design is permitted and is not a separate required gate before implementation. Make technical choices alongside implementation where they can be revised safely; design costly or hard-to-reverse changes in advance as needed, and review the resulting choices after implementation. See [where detailed design fits](docs/philosophy.md#where-detailed-design-fits).

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
