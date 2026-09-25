# Alder plugin PoC

The development package contains one skill: **read-only post-implementation review**. It includes the exact review knowledge v0.3 text and requires no MCP server, network request at review time, Python package, or product-side Alder checkout. Other Alder workflows still use the existing [adoption guide](adoption.md). The plugin package version `0.1.0` is separate from the Alder method release and from review knowledge v0.3.

## Install once (Codex local marketplace)

In a supported Codex CLI / ChatGPT desktop environment, add the Alder Git repository as a marketplace source and install **Alder** from that source in the Plugins Directory:

```sh
codex plugin marketplace add mk3008/alder --ref <reviewed-release-tag>
```

During development, use a reviewed commit or branch instead of the release tag. A branch can move: record the resolved plugin source commit with the review. Installation and skill activation should be confirmed in a new session. This is an authoring/testing distribution route, not a claim that Alder is listed in the public Plugins Directory. A release tag and directory publication are separate future steps. Plugin support and marketplace availability vary by client.

The marketplace at `.agents/plugins/marketplace.json` points to `plugins/alder` in this repository. Installing once does not add Alder files to each product repository. A fresh session is needed after installing or updating a plugin in supported clients.

## Product setup

Keep the Business Design in the product repository. If the conventional `docs/business-design/` path applies, no Alder-specific AGENTS.md entry is necessary. Otherwise add only the project path:

```markdown
## Alder

Business Design: docs/operations/
```

The project may also specify Check Items and Decision Records paths if they differ from its existing conventions. Business Design is the source of truth for business meaning. The installed skill holds Alder review knowledge; do not copy it into the product or put its internal path or SHA in AGENTS.md. Review the scoped implementation with:

```text
実装が終わったのでAlderレビューして
```

If there are multiple unrelated changes or Business Designs, identify the target in that natural-language request. The skill reads the project context and bundled knowledge, reports evidence and classifications, and does not edit files. Run its follow-up separately after a responsible person has answered unresolved business questions.

## Reproducibility and scope

The plugin's `plugin.json` identifies the package version. `references/provenance.json` records the Alder source commit, original review-knowledge path and SHA-256 of the bundled copy. A review result records the plugin and knowledge versions, design and implementation revisions, and the plugin source commit when installed from a moving branch. Keep a released package's content immutable; bump its version when changing its workflow or bundled knowledge. A local marketplace installation is a snapshot; refresh/reinstall to use a later package version. The package's version label alone does not pin an independently changing local source.

The skill owns task routing, meaning review, authority order and read-only boundaries. Deterministic tools handle format, graph export and traceability checks when applicable; they cannot approve business meaning. This PoC does not implement design authoring, design-quality/correlation/omission review, optimization, Check Item drafting, graph export or follow-up as plugin workflows.

## Business Graph export in the same plugin (next step)

Business Design → Business Graph JSON is a deterministic projection, not an LLM-generated interpretation. Package the existing `tools/business_graph/export.py` **in this Alder plugin** as an executable tool, with a thin export skill that finds the requested Business Design and invokes that tool when the user says “この業務設計をJSON化して” or “Business Graphを出して”. Authoring or review skills may invoke the same tool only when the workflow needs a graph. Export success validates the supported structure; it does not establish correct business meaning or human agreement. Do not make exporting a mandatory step of every review.

Keep `tools/business_graph/export.py` as the single maintained implementation and the direct CLI for external consumers such as `alder_viewer`. Package an identical artifact from that source at build/release time, and check its digest and behavior against the source so plugin and CLI cannot silently diverge. A copied artifact is distribution output, not a second implementation to edit. The installed plugin must have its own copy available without checking out the Alder repository in every product. The package version and exporter source digest should identify what produced a JSON result. Test execution in supported clients and Python availability before making natural-language export a standard advertised capability; do not add an MCP server or independently reimplement the exporter to bridge a client without local script execution.

Future format/structure validation and traceability checks should follow the same boundary: the skill chooses when and why to run a deterministic tool; the tool checks only properties it can establish. This section is a packaging decision for later work, not a claim that plugin `0.1.0` already contains those tools or export skill.

The [bounded real-product walkthrough](plugin-poc-evaluation.md) records the manual versus plugin route and the validation limits. Existing projects that explicitly route agents to an older local Alder copy must update that routing once when adopting the plugin; a project's own instructions still take precedence.
