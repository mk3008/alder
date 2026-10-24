# Alder Plugin

Alder Plugin creates and updates Business Design and Check Items from notes and human feedback. New artifacts use a single JSON package; people review business meaning in the Viewer and request revisions from the Plugin. Existing Markdown selected for update keeps its compatibility route unless a one-way conversion is explicitly requested. Reviews and discovery remain read-only.

These instructions apply to **Alder 0.4.9**. Confirm that [plugin-v0.4.9](https://github.com/mk3008/alder/releases/tag/plugin-v0.4.9) has been published before installing it; a development branch or manifest version is not proof of release. JSON and explicit partial state-transition viewing require a compatible Viewer published separately from the Plugin. If it is not yet deployed, use the [Viewer review build](../web-viewer/json.ja.md#確認版を用意する). Formal JSON v1 and concept modeling are not included in this release.

JSON creation, validation and guarded saving require Node 24+ and local script execution in the host. Explicit MD conversion also requires Python 3.12+. Optional Graph export and the restricted drift pilot use their bundled Python scripts. No product-side Alder runtime package or MCP server is needed. Installed-copy CLI checks do not prove automatic Skill selection or execution in a real ChatGPT host; check the host's actual tool/runtime availability before relying on those operations.

## Install once

After verifying the published release tag, register the versioned Plugin:

```sh
codex plugin marketplace add mk3008/alder --ref plugin-v0.4.9
codex plugin marketplace list
```

The versioned tag fixes the source and bundled guidance. Existing installations are snapshots and must be refreshed/reinstalled to pick up a new version. For earlier Markdown-only usage, the [0.4.8 installation guide](https://github.com/mk3008/alder/blob/plugin-v0.4.8/docs/plugin-adoption.md) remains available.

Then restart the ChatGPT desktop app, open the Plugins Directory, choose the **Alder development** marketplace, install **Alder**, and start a **new chat** before testing the skill. The repository marketplace at `.agents/plugins/marketplace.json` points to `plugins/alder`; installing once does not copy Alder files into each product repository. Refresh/reinstall after updating the package.

The initial 0.1.0 client validation confirmed short implementation-review routing. A later 0.2.8 client validation confirmed, in separate new chats, short requests for Business Design authoring, Business Design review, and implementation review without cross-routing under the tested client conditions. This is bounded routing evidence, not a guarantee across every model or client. The repository marketplace is the current distribution route; public Plugins Directory publication is a separate future step. Plugin support and marketplace availability vary by client.

## Product setup

Keep the Business Design in the product repository. If the conventional `docs/business-design/` path applies, no Alder-specific AGENTS.md entry is necessary. Otherwise add only the project path:

```markdown
## Alder

Business Design: docs/operations/
```

The project may also specify the canonical JSON package and Decision Records paths. BD and Check may share one JSON file; separate legacy Check MD paths remain valid for existing projects. Business Design is the source of truth for business meaning. The installed skills hold Alder guidance; do not copy it into the product or put their internal paths or SHAs in AGENTS.md.

For interview notes, request a draft with ordinary language, for example:

```text
このヒアリング結果をAlder業務設計書にして
```

Provide the notes in the request or as a readable file. The skill writes a JSON Business Design draft under the project's declared path, or `docs/business-design/` by convention. Use the returned file in the Viewer, inspect the whole work and selected details, then send corrections to the Plugin and reopen the same updated JSON. New creation without a specified format defaults to JSON; selecting an existing MD file for revision does not authorize migration. It keeps source facts separate from unresolved business outcomes, responsibilities and handoffs. When an answer would change business meaning, correlations or responsibility, it asks a few concrete questions in its response; give it the answers to revise the same design. Details that do not affect current meaning may remain open. If the responsible person has not decided, the draft retains that decision for human review rather than inventing it or continuing questions indefinitely. It does not generate Check Items or implement the product. This JSON default is included in Alder 0.4.9. Start a new chat after installing or updating the package.

Business Design authoring also runs the existing read-only review as a distinct phase, using a separate agent or fresh context when available and useful, repairs source-supported findings and re-reviews the revision before returning it. Missing facts remain concrete questions, and ambiguous interpretations remain unapproved candidates. Repeated findings without improvement or unavailable/failed review stop the loop with the unresolved scope reported; an unreviewed draft is never presented as passing. A host without a separate reviewer can apply the complete review skill in the same agent, clearly reporting that the review was not independent. If the review itself cannot run, the draft is returned with review pending. These instructions do not establish real-client execution or general semantic-review accuracy.

Review Business Design itself with:

```text
業務設計書をAlderでレビューして
```

This review checks description quality, connections between business activities, and material omissions while remaining read-only. It separates wording/structure findings from matters requiring requester/designer judgment and does not decide unresolved business rules.

Review completed scoped implementation separately with:

```text
コードをAlderでレビューして
```

<a id="combined-review-requirements"></a>

The existing `実装したのでAlderレビューして` wording remains supported. If there are multiple unrelated changes or Business Designs, identify the target in the natural-language request. The implementation review reads the bundled review knowledge v0.3 and reports evidence and classifications without editing files, even though the package advertises Write for other requested writing workflows. Plugin 0.4.3 includes the combined route introduced in 0.4.2: “Alderで実装をレビューして、チェックとテストの対応も更新して”. It runs a separate read-only reviewer first, then updates authorized records in the same interaction. “レビューだけ” or a review request without update authorization does not write. This combined route needs a host that can run a separate agent or fresh context; without it, the independent review remains pending and no combined-workflow writes occur. Release tag `plugin-v0.4.1` does not include this new route.

### Clarifying a proposed change

The authoring intake introduced in Plugin 0.4.1 checks missing background before drafting a change when that background could change whether the proposed means should be adopted. It reuses information already supplied and does not reopen settled decisions or externally fixed means. When a means-only request leaves its decision status unclear, it asks briefly rather than assuming either a proposal or an approved requirement. Known work can still be drafted with deferrable matters left open. This adds no new Skill. See [the authoring boundary](adoption.md#before-drafting-a-proposed-business-change).

## Reproducibility and scope

The plugin's `plugin.json` identifies the package version. Each skill's `references/provenance.json` records its source revision and the digests of bundled guidance. A review result records the installed Alder version, applicable knowledge identifier, design and implementation revisions, and the plugin source commit when installed from a moving branch. Keep a released package's content immutable; bump its version when changing its workflow or bundled knowledge. A local marketplace installation is a snapshot; refresh/reinstall to use a later package version.

Each skill owns its routing and write boundary. Deterministic tools cannot approve business meaning. Use the requested product's Business Design, Check list, review and evidence; the plugin selects its bundled Alder knowledge.

### Check Items and review follow-up

After the Business Design is agreed, ask:

```text
Alderでチェック項目を作って
```

For a JSON source, the draft adds Checks to the same package, retaining the exact BD ID/revision. If the only source is an agreed MD document, obtain an explicit one-way conversion request before creating new JSON Checks; do not silently convert it or infer agreement from a format choice. An existing MD Check selected for update stays on its compatibility route.

The draft keeps one independently reviewable observable expectation per item. People review its expected results; AI confidence and passing tests never set human confirmation. Give feedback with “Alderのチェック項目を更新して”. Existing IDs, guarantees and mappings are preserved. If feedback changes business meaning, the work returns to Business Design revision and human confirmation first. Missing evidence from newly written Tests is not a prerequisite for the earlier design handoff.

An optional request such as “AlderでFunctional Interfaceを整理して” groups observable responsibilities only where that index is useful. It does not prescribe APIs or files.

To update records from an existing review, ask “Alderレビューのフォローアップをして” and provide actual decisions and the review/evidence. This does not add another review. In the combined route introduced in 0.4.2, the same follow-up runs after the independent reviewer returns without a second skill invocation. The follow-up maintains requested Decision Records and Check-to-Test/assertion evidence, keeps gaps separate from review states, and leaves undecided meaning open. It does not silently implement fixes or accept the result for the requester.

### Optional questions before proposing a change

With confirmed current work but no known Problem, ask “Alderで今の業務の見直しどころを探して”. Structural Discovery returns grounded relationships and questions; it does not invent a burden, Pain level or improvement benefit.

After design/correlation review, “Alderで未記載の機能条件を探して” explores a small set of concrete undecided outcomes. These are unapproved questions, not requirements or test assertions. Both inquiries are read-only and may return no useful findings.

For improvement proposals, install the plugin and identify the current Business Design and its confirmed Problem / Pain level, then ask:

```text
Alderで改善提案して
```

The review helps identify the actual target work, then confirms its Problem before proposing alternatives. An unidentified target stops at current-work questions, even with High Pain. When candidates are returned, it asks for human acceptance, modification, deferral or rejection and waits. It does not change files or treat silence as adoption. A separate revision updates and re-agrees Business Design after acceptance and before downstream changes. The installed guidance is selected automatically; no internal Skill name or manual document selection is needed.

## Optional graph export and drift diagnosis

Ask “AlderでBusiness Graphを出して” for a deterministic projection of Business Design in the [supported Markdown profile](business-graph.md#opt-in-markdown-profile-v1). The plugin invokes its byte-identical copy of `tools/business_graph/export.py`; it never substitutes AI-generated JSON or edits the design to make export pass. A format error returns the relevant source location and correction needed. Export validates supported structure, not business correctness or agreement.

For an already chosen compatible [drift pilot](traceability-drift/study.md), ask “Alderでチェックとテストの同期漏れを調べて”. The bundled detector accepts the restricted pilot documents, saved relations/pins and a fresh actual Test inventory. It is not a universal parser for product documents. Without a compatible existing adapter or deliberately selected fixture, it reports the unsupported input instead of migrating it. Diagnosis does not run product tests, edit human review states or acknowledge pins. Separate, explicitly requested reconciliation updates only relations actually compared against their evidence.

Both commands require a client capable of local Python 3.12+ script execution. If unavailable, the agent reports that limitation without fabricating a result. No MCP server is installed as a fallback. The package records source digests for guidance and scripts; maintain the exporter and detector at their original source locations and refresh their identical distribution copies. Do not edit the copies independently. Client routing and script-runtime validation are distinct from local package tests.

The [bounded real-product walkthrough](plugin-poc-evaluation.md) records the manual versus plugin route and the validation limits. Existing projects that explicitly route agents to an older local Alder copy must update that routing once when adopting the plugin; a project's own instructions still take precedence.
