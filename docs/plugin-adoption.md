# Alder Plugin

Alder Plugin version `0.2.3` provides two skills: **Business Design drafting and revision from interview notes and answers** and **read-only post-implementation review**. The authoring skill bundles the adoption guide and optional export-profile documentation as versioned references; the review skill still bundles the exact review knowledge v0.3. No MCP server or product-side Alder checkout is needed. The plugin package version is separate from the Alder method release and review knowledge v0.3. The previous stable tag `plugin-v0.1.0` still provides only read-only review; version 0.2.3 is available from this change's commit/branch until separately released.

## Install once

For the released review-only package, pin its stable tag:

```sh
codex plugin marketplace add mk3008/alder --ref plugin-v0.1.0
codex plugin marketplace list
```

The repository is public, so a supported client can install this GitHub-distributed plugin without a separate package registry. For development or unreleased testing, a reviewed commit or branch may be used instead of the stable tag. A branch can move, so record the resolved plugin source commit with the review.

Then restart the ChatGPT desktop app, open the Plugins Directory, choose the **Alder development** marketplace, install **Alder**, and start a **new chat** before testing the skill. The repository marketplace at `.agents/plugins/marketplace.json` points to `plugins/alder`; installing once does not copy Alder files into each product repository. Refresh/reinstall after updating the development package.

The 2026-09-25 initial client validation confirmed `alder@alder-development` version `0.1.0` as installed and enabled, and a new Fresh run selected the review skill from a short request. That validation does not establish client routing for the new authoring skill. The repository marketplace is the current distribution route; public Plugins Directory publication is a separate future step. Plugin support and marketplace availability vary by client.

## Product setup

Keep the Business Design in the product repository. If the conventional `docs/business-design/` path applies, no Alder-specific AGENTS.md entry is necessary. Otherwise add only the project path:

```markdown
## Alder

Business Design: docs/operations/
```

The project may also specify Check Items and Decision Records paths if they differ from its existing conventions. Business Design is the source of truth for business meaning. The installed skills hold Alder guidance; do not copy it into the product or put their internal paths or SHAs in AGENTS.md.

For interview notes, request a draft with ordinary language, for example:

```text
このヒアリング結果をAlder業務設計書にして
```

Provide the notes in the request or as a readable file. The skill writes the Business Design draft under the project's declared path, or `docs/business-design/` by convention. It keeps source facts separate from unresolved business outcomes, responsibilities and handoffs. When an answer would change business meaning, correlations or responsibility, it asks a few concrete questions in its response; give it the answers to revise the same design. Details that do not affect current meaning may remain open. If the responsible person has not decided, the draft retains that decision for human review rather than inventing it or continuing questions indefinitely. It does not generate Check Items or implement the product. For an unreleased test, install the branch or commit containing version 0.2.3 and start a new chat; the stable tag above does not include this skill.

Review a completed scoped implementation separately with:

```text
実装が終わったのでAlderレビューして
```

If there are multiple unrelated changes or Business Designs, identify the target in that natural-language request. In the previously validated Velvet run, the short request selected the Alder implementation-review skill, read the bundled review knowledge v0.3 in full, and left the product tree unchanged. The review skill still reports evidence and classifications without editing files, even though the package now advertises Write for the separate authoring skill. Run its follow-up separately after a responsible person has answered unresolved business questions.

## Reproducibility and scope

The plugin's `plugin.json` identifies the package version. Each skill's `references/provenance.json` records its source revision and the digests of bundled guidance. A review result records the plugin and knowledge versions, design and implementation revisions, and the plugin source commit when installed from a moving branch. Keep a released package's content immutable; bump its version when changing its workflow or bundled knowledge. A local marketplace installation is a snapshot; refresh/reinstall to use a later package version.

Each skill owns its own routing and write boundary. Deterministic tools handle format, graph export and traceability checks when applicable; they cannot approve business meaning. Plugin 0.2.3 packages design authoring and implementation review; design-quality/correlation/omission review, Optimization Review, Check Item drafting, graph export and follow-up are not packaged skills.

## Business Graph export in the same plugin (next step)

Business Design → Business Graph JSON is a deterministic projection, not an LLM-generated interpretation. Package the existing `tools/business_graph/export.py` **in this Alder plugin** as an executable tool, with a thin export skill that finds the requested Business Design and invokes that tool when the user says “この業務設計をJSON化して” or “Business Graphを出して”. Authoring or review skills may invoke the same tool only when the workflow needs a graph. Export success validates the supported structure; it does not establish correct business meaning or human agreement. Do not make exporting a mandatory step of every review.

Keep `tools/business_graph/export.py` as the single maintained implementation and the direct CLI for external consumers such as `alder_viewer`. Package an identical artifact from that source at build/release time, and check its digest and behavior against the source so plugin and CLI cannot silently diverge. A copied artifact is distribution output, not a second implementation to edit. The installed plugin must have its own copy available without checking out the Alder repository in every product. The package version and exporter source digest should identify what produced a JSON result. Test execution in supported clients and Python availability before making natural-language export a standard advertised capability; do not add an MCP server or independently reimplement the exporter to bridge a client without local script execution.

Future format/structure validation and traceability checks should follow the same boundary: the skill chooses when and why to run a deterministic tool; the tool checks only properties it can establish. This section defines the packaging direction for a later plugin version; plugin `0.2.3` does not yet contain those tools or the export skill.

The [bounded real-product walkthrough](plugin-poc-evaluation.md) records the manual versus plugin route and the validation limits. Existing projects that explicitly route agents to an older local Alder copy must update that routing once when adopting the plugin; a project's own instructions still take precedence.
