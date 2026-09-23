# Alder

English | [日本語](README.ja.md)

**Improve work and verify its implementation from one Business Design.**

Alder uses **Business Design** as the source of truth for current operational intent: who does the work, when, with which inputs and outputs. People can record an operational Problem and Pain level and optionally request an [Optimization Review](docs/optimization-review.md). AI suggests a few alternatives; people decide whether to adopt a change and update and agree on Business Design first. A proposal does not become current business policy by appearing in a review.

For system delivery, people agree on Business Design and human-review derived Check Items before implementation. An AI agent implements them; a separate agent or fresh context reviews the resulting implementation and tests. Follow-up checks expectations against the agreed design and maintains Check ↔ Test evidence. Questions about unresolved business meaning return to people. Coding can begin before every possible future policy is settled, but unresolved policy cannot be silently invented.

Alder combines established requirements validation, walkthroughs, traceability, decision records and human judgment for repeated use with AI. It proposes no new BPM theory or architecture and does not prescribe a UI or a code structure.

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
2. Agree on Business Design and human-review the derived Check Items before handing both to implementation. This completes the standard design business.
3. Route these paths through AGENTS.md or the task prompt. Have the AI read the confirmed Business Design and Check Items, implement the task, and report material assumptions and choices for the later Alder follow-up. It must not invent unresolved business policy; routine reversible technical choices can proceed.
4. After implementation, give the review prompt to a separate AI agent or fresh context. Use `docs/alder/review-knowledge.md` to review the work, reading **Business Design → Decision Records → implementation / DDL / tests**. In the follow-up, verify and maintain Check ↔ Test/assertion mappings.
5. Return only unresolved business questions to people for a decision.

The optional improvement loop starts from a concrete recorded **Problem** and **Pain level**, explores alternative work through [Optimization Review](docs/optimization-review.md), and returns the adoption decision to people. If adopted, revise and re-agree Business Design before deriving Check Items or implementing the change. Candidate Scope, Difficulty and Confidence are proposal assessments, not current facts.

This layout and a local review-knowledge copy are optional. Prefer keeping design and implementation in the same repository; a known workspace path and revision also works. Review knowledge may instead come from a readable versioned GitHub URL or an Alder checkout in the workspace.

**Alder does not prescribe an architecture style or when to introduce structure.** Give the implementation agent the Business Design, explicit requirements and constraints, and concrete future risks you actually foresee; let it choose how to realize them. Architecture knowledge can support that choice, but a style name does not replace requirements.

When technical alternatives compete, **reason before measuring**. Use requirements, risks, scale, runtime behavior, and existing evidence to focus validation on the uncertainties most likely to change the decision. Bound optional evaluation and stop when a sufficiently supported solution is found unless the product explicitly calls for deeper optimization; missing numeric targets alone are not a reason to stop and ask.

[Follow the adoption guide and copy the prompts →](docs/adoption.md)

## Optional Business Graph export for external tools

[Business Design for using Alder](business-design/alder/README.md) can be projected into versioned JSON with a dependency-free Python 3.12+ CLI:

```sh
python3 tools/business_graph/export.py business-design/alder/README.md -o graph.json
```

Generate JSON when an external visualization, analysis or processing tool helps the designer's own review, a requester's review, or the inspection of business correlations. It is an intermediate format, not a standard Business Activity or a requester deliverable. Business and Object nodes each preserve an explicit boolean Scope declared in Business Design; Object Scope is not inferred from links. Consumers need not commit generated JSON or use it to finish standard design work. This repository commits its own projection only as an exporter regression fixture. Business Design remains the SSOT; feed any corrections discovered through external tools back into it. Procedure and unapproved Optimization Review candidates are outside the projection; a recorded Problem / Pain pair is included when present. See the [source format, relation contract and CLI usage](docs/business-graph.md).

## Read more

| Need | Document |
| --- | --- |
| Workspace setup, Business Design format, AGENTS.md routing, prompts, optional SQL tools | [Adoption guide](docs/adoption.md) |
| Why implementation helps validate requirements; reasoning, DDD and architecture | [Philosophy](docs/philosophy.md) |
| Review questions, procedures, boundaries, and stopping conditions | [Review knowledge v0.3](docs/phase2/review-knowledge-v0.3.md) (Japanese) |
| Problem-driven review of alternative business designs using Problem / Pain / Scope / Difficulty | [Optimization Review](docs/optimization-review.md) |
| Optional discovery of undocumented functional conditions before Check/Test commitments | [Functional consideration discovery](docs/behavior-derivation/functional-considerations.md) |
| Required Check Item design and human review, with AI-maintained traceability from Business Design to tests; tests verify code by execution | [Check Item traceability](docs/check-item-traceability.md) |
| Previous candidates, adoption decisions, established foundations, reasons and reconsideration boundaries | [Research Decision Index](docs/research-decisions.md) |
| Evidence, limitations, current questions, and earlier research | [Validation](docs/validation.md) |

The current development loop keeps **Business Design ↔ Check Item ↔ Test** as its permanent traceability boundary. The standard design business ends at the agreed design and Check Item handoff. A separate post-implementation Alder review and follow-up checks Test expectations and maintains Check ↔ Test/assertion evidence before accepting a change. Tests verify Code by execution; Alder does not maintain Check Item ↔ Code location mappings. **Research review knowledge v0.3** remains unchanged. Alder remains a research candidate overall, while Optimization Review is adopted. See the [v0.6 release notes](docs/release-notes-v0.6.md) for its introduction. No framework, CLI or runtime package is required; Business Graph export is optional.
