# Alder Plugin

Alder Plugin development version `0.3.2` adds **read-only Optimization Review** to Business Design drafting/revision, read-only Business Design review, and read-only post-implementation review. Each skill bundles its versioned authority. No MCP server or product-side Alder checkout is needed. The plugin package version is separate from the Alder method release and review knowledge v0.3. New 0.3.2 routing and regression in a real client remain unverified; the pinned 0.2.8 onboarding package retains its three validated workflows. The previous stable tag `plugin-v0.1.0` provides implementation review only.

## Install once

For the released review-only package, pin its stable tag:

```sh
codex plugin marketplace add mk3008/alder --ref plugin-v0.1.0
codex plugin marketplace list
```

The repository is public, so a supported client can install this GitHub-distributed plugin without a separate package registry. For development or unreleased testing, a reviewed commit or branch may be used instead of the stable tag. A branch can move, so record the resolved plugin source commit with the review.

Then restart the ChatGPT desktop app, open the Plugins Directory, choose the **Alder development** marketplace, install **Alder**, and start a **new chat** before testing the skill. The repository marketplace at `.agents/plugins/marketplace.json` points to `plugins/alder`; installing once does not copy Alder files into each product repository. Refresh/reinstall after updating the development package.

The initial 0.1.0 client validation confirmed short implementation-review routing. A later 0.2.8 client validation confirmed, in separate new chats, short requests for Business Design authoring, Business Design review, and implementation review without cross-routing under the tested client conditions. This is bounded routing evidence, not a guarantee across every model or client. The repository marketplace is the current distribution route; public Plugins Directory publication is a separate future step. Plugin support and marketplace availability vary by client.

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

Provide the notes in the request or as a readable file. The skill writes the Business Design draft under the project's declared path, or `docs/business-design/` by convention. It keeps source facts separate from unresolved business outcomes, responsibilities and handoffs. When an answer would change business meaning, correlations or responsibility, it asks a few concrete questions in its response; give it the answers to revise the same design. Details that do not affect current meaning may remain open. If the responsible person has not decided, the draft retains that decision for human review rather than inventing it or continuing questions indefinitely. It does not generate Check Items or implement the product. For an unreleased test, install the branch or commit containing version 0.2.8 and start a new chat; the stable tag above does not include this skill.

Review Business Design itself with:

```text
業務設計書をAlderでレビューして
```

This review checks description quality, connections between business activities, and material omissions while remaining read-only. It separates wording/structure findings from matters requiring requester/designer judgment and does not decide unresolved business rules.

Review completed scoped implementation separately with:

```text
コードをAlderでレビューして
```

The existing `実装したのでAlderレビューして` wording remains supported. If there are multiple unrelated changes or Business Designs, identify the target in the natural-language request. The implementation review reads the bundled review knowledge v0.3 and reports evidence and classifications without editing files, even though the package advertises Write for the separate authoring skill. Run its follow-up separately after a responsible person has answered unresolved business questions.

## Reproducibility and scope

The plugin's `plugin.json` identifies the package version. Each skill's `references/provenance.json` records its source revision and the digests of bundled guidance. A review result records the plugin and knowledge versions, design and implementation revisions, and the plugin source commit when installed from a moving branch. Keep a released package's content immutable; bump its version when changing its workflow or bundled knowledge. A local marketplace installation is a snapshot; refresh/reinstall to use a later package version.

Each skill owns its own routing and write boundary. Deterministic tools handle format, graph export and traceability checks when applicable; they cannot approve business meaning. Plugin 0.3.2 packages Business Design authoring, Business Design review, implementation review and Optimization Review. Check Item drafting, graph export and follow-up are not packaged skills.

For improvement proposals, install the development revision containing 0.3.2 and identify the current Business Design and its confirmed Problem / Pain level, then ask:

```text
Alderで改善提案して
```

The review helps identify the actual target work, then confirms its Problem before proposing alternatives. An unidentified target stops at current-work questions, even with High Pain. When candidates are returned, it asks for human acceptance, modification, deferral or rejection and waits. It does not change files or treat silence as adoption. A separate revision updates and re-agrees Business Design after acceptance and before downstream changes. The installed guidance is selected automatically; no internal Skill name or manual document selection is needed.

## Business Graph export in the same plugin (next step)

Business Design → Business Graph JSON is a deterministic projection, not an LLM-generated interpretation. Package the existing `tools/business_graph/export.py` **in this Alder plugin** as an executable tool, with a thin export skill that finds the requested Business Design and invokes that tool when the user says “この業務設計をJSON化して” or “Business Graphを出して”. Authoring or review skills may invoke the same tool only when the workflow needs a graph. Export success validates the supported structure; it does not establish correct business meaning or human agreement. Do not make exporting a mandatory step of every review.

Keep `tools/business_graph/export.py` as the single maintained implementation and the direct CLI for external consumers such as `alder_viewer`. Package an identical artifact from that source at build/release time, and check its digest and behavior against the source so plugin and CLI cannot silently diverge. A copied artifact is distribution output, not a second implementation to edit. The installed plugin must have its own copy available without checking out the Alder repository in every product. The package version and exporter source digest should identify what produced a JSON result. Test execution in supported clients and Python availability before making natural-language export a standard advertised capability; do not add an MCP server or independently reimplement the exporter to bridge a client without local script execution.

Future format/structure validation and traceability checks should follow the same boundary: the skill chooses when and why to run a deterministic tool; the tool checks only properties it can establish. This section defines the packaging direction for a later plugin version; plugin `0.3.2` does not yet contain those tools or the export skill.

The [bounded real-product walkthrough](plugin-poc-evaluation.md) records the manual versus plugin route and the validation limits. Existing projects that explicitly route agents to an older local Alder copy must update that routing once when adopting the plugin; a project's own instructions still take precedence.
