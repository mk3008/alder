# Alder Plugin

Alder Plugin `0.4.1` packages the current design and review workflows with their versioned guidance. Business Design drafting/revision, Check Item drafting/maintenance and scoped review follow-up can write their requested artifacts; reviews and discovery remain read-only. Optional graph export and a restricted traceability-drift pilot use bundled Python scripts. No MCP server or product-side Alder checkout is needed.

The package version is separate from the Alder method release and review knowledge v0.3. New routing and packaged-script execution in a real client remain unverified. Python 3.12+ and local script execution are required for the two tool-backed workflows; a client without them cannot execute those tools. The earlier 0.2.8 package retains its three workflows with bounded client-validation evidence. The stable tag `plugin-v0.1.0` provides implementation review only.

## Install once

Pin the Plugin release tag:

```sh
codex plugin marketplace add mk3008/alder --ref plugin-v0.4.1
codex plugin marketplace list
```

The repository is public, so a supported client can install this GitHub-distributed plugin without a separate package registry. For development or unreleased testing, a reviewed commit or branch may be used instead of the stable tag. A branch can move, so record the resolved plugin source commit with the review.

Then restart the ChatGPT desktop app, open the Plugins Directory, choose the **Alder development** marketplace, install **Alder**, and start a **new chat** before testing the skill. The repository marketplace at `.agents/plugins/marketplace.json` points to `plugins/alder`; installing once does not copy Alder files into each product repository. Refresh/reinstall after updating the package.

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

Provide the notes in the request or as a readable file. The skill writes the Business Design draft under the project's declared path, or `docs/business-design/` by convention. It keeps source facts separate from unresolved business outcomes, responsibilities and handoffs. When an answer would change business meaning, correlations or responsibility, it asks a few concrete questions in its response; give it the answers to revise the same design. Details that do not affect current meaning may remain open. If the responsible person has not decided, the draft retains that decision for human review rather than inventing it or continuing questions indefinitely. It does not generate Check Items or implement the product. The 0.4.1 tag includes this workflow. Start a new chat after installing or updating the package.

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

### Clarifying a proposed change

Plugin 0.4.1 checks missing background before drafting a change when that background could change whether the proposed means should be adopted. It reuses information already supplied and does not reopen settled decisions or externally fixed means. When a means-only request leaves its decision status unclear, it asks briefly rather than assuming either a proposal or an approved requirement. Known work can still be drafted with deferrable matters left open. This adds no new Skill. See [the authoring boundary](adoption.md#before-drafting-a-proposed-business-change).

## Reproducibility and scope

The plugin's `plugin.json` identifies the package version. Each skill's `references/provenance.json` records its source revision and the digests of bundled guidance. A review result records the plugin and knowledge versions, design and implementation revisions, and the plugin source commit when installed from a moving branch. Keep a released package's content immutable; bump its version when changing its workflow or bundled knowledge. A local marketplace installation is a snapshot; refresh/reinstall to use a later package version.

Each skill owns its routing and write boundary. Deterministic tools cannot approve business meaning. Use the requested product's Business Design, Check list, review and evidence; the plugin selects its bundled Alder knowledge.

### Check Items and review follow-up

After the Business Design is agreed, ask:

```text
Alderでチェック項目を作って
```

The draft keeps one independently reviewable observable expectation per item. People review its expected results; AI confidence and passing tests never set human confirmation. Give feedback with “Alderのチェック項目を更新して”. Existing IDs, guarantees and mappings are preserved. If feedback changes business meaning, the work returns to Business Design revision and human confirmation first. Missing evidence from newly written Tests is not a prerequisite for the earlier design handoff.

An optional request such as “AlderでFunctional Interfaceを整理して” groups observable responsibilities only where that index is useful. It does not prescribe APIs or files.

After the independent read-only implementation review, ask “Alderレビューのフォローアップをして” and provide actual decisions and the review/evidence. The follow-up maintains requested Decision Records and Check-to-Test/assertion evidence, keeps gaps separate from review states, and leaves undecided meaning open. It does not silently implement fixes or accept the result for the requester.

### Optional questions before proposing a change

With confirmed current work but no known Problem, ask “Alderで今の業務の見直しどころを探して”. Structural Discovery returns grounded relationships and questions; it does not invent a burden, Pain level or improvement benefit.

After design/correlation review, “Alderで未記載の機能条件を探して” explores a small set of concrete undecided outcomes. These are unapproved questions, not requirements or test assertions. Both inquiries are read-only and may return no useful findings.

For improvement proposals, install version 0.4.1 and identify the current Business Design and its confirmed Problem / Pain level, then ask:

```text
Alderで改善提案して
```

The review helps identify the actual target work, then confirms its Problem before proposing alternatives. An unidentified target stops at current-work questions, even with High Pain. When candidates are returned, it asks for human acceptance, modification, deferral or rejection and waits. It does not change files or treat silence as adoption. A separate revision updates and re-agrees Business Design after acceptance and before downstream changes. The installed guidance is selected automatically; no internal Skill name or manual document selection is needed.

## Optional graph export and drift diagnosis

Ask “AlderでBusiness Graphを出して” for a deterministic projection of Business Design in the [supported Markdown profile](business-graph.md#opt-in-markdown-profile-v1). The plugin invokes its byte-identical copy of `tools/business_graph/export.py`; it never substitutes AI-generated JSON or edits the design to make export pass. A format error returns the relevant source location and correction needed. Export validates supported structure, not business correctness or agreement.

For an already chosen compatible [drift pilot](traceability-drift/study.md), ask “Alderでチェックとテストの同期漏れを調べて”. The bundled detector accepts the restricted pilot documents, saved relations/pins and a fresh actual Test inventory. It is not a universal parser for product documents. Without a compatible existing adapter or deliberately selected fixture, it reports the unsupported input instead of migrating it. Diagnosis does not run product tests, edit human review states or acknowledge pins. Separate, explicitly requested reconciliation updates only relations actually compared against their evidence.

Both commands require a client capable of local Python 3.12+ script execution. If unavailable, the agent reports that limitation without fabricating a result. No MCP server is installed as a fallback. The package records source digests for guidance and scripts; maintain the exporter and detector at their original source locations and refresh their identical distribution copies. Do not edit the copies independently. Client routing and script-runtime validation are distinct from local package tests.

The [bounded real-product walkthrough](plugin-poc-evaluation.md) records the manual versus plugin route and the validation limits. Existing projects that explicitly route agents to an older local Alder copy must update that routing once when adopting the plugin; a project's own instructions still take precedence.
