---
name: alder-review-implementation
description: Review completed implementation, DDL, and tests against a project's agreed Alder Business Design. Use for requests such as "実装したのでAlderレビューして" or "Alderで実装をレビューして". This is a read-only post-implementation review, not authoring, optimization, or follow-up.
---

# Alder implementation review

Use this installed plugin's bundled [review knowledge v0.3](references/review-knowledge-v0.3.md) in full. Its text is copied without modification from Alder `docs/phase2/review-knowledge-v0.3.md`; the plugin package version is in `../../plugin.json`. Do not fetch the latest Alder repository or ask the project to copy review knowledge.

1. Locate the product repository and its `AGENTS.md`; follow project instructions. Resolve Business Design from the declared path, or the conventional `docs/business-design/`. If neither exists, ask for its readable location. Determine the requested change's scope from the request and repository diff/commits; ask for a target only if that scope remains ambiguous. Never assume the entire product is being reviewed.
2. Record the Business Design's revision and the implementation revision (commit IDs, or explicit working-tree state when uncommitted). Read the applicable Business Design **first**, including connected activities and their actual inputs and outputs. Read relevant Decision Records, documented assumptions and confirmed Check Items **second**. Read implementation, DDL, and tests **third**. A missing optional artifact is not evidence of a missing business guarantee.
3. Apply every part of the bundled review knowledge, including its boundaries and stopping conditions. Walk representative work from each participant's perspective, then trace the implementation's business-significant choices back to the design. Business Design is the authority for meaning; Decision Records, Check Items, tests and current code are evidence, not independent authority to approve unresolved meaning.
4. Report each material finding with its evidence and current/downstream effect. Classify it as a definite mismatch, Business confirmation, technical improvement, or sufficient. Name the smallest decision or confirmation and its responsible party when needed. Do not manufacture business rules, prescribe an architecture, or turn every undocumented detail into a finding. State what could not be checked.
5. Include `Alder plugin 0.2.0 / review knowledge v0.3`, the reviewed source revisions and the installed plugin source commit if known, especially for a moving development branch. The bundled knowledge's source commit and digest are in [provenance.json](references/provenance.json). Review only; do not edit product files or convert findings into approved business decisions. A later follow-up may update Business Design first after human decisions and maintain Check-to-Test evidence, but is outside this skill.

The plugin supplies review meaning and procedure. Existing deterministic tools may verify syntax, graph export or traceability when relevant and available in the project; passing them does not establish business correctness. This review needs no MCP server or runtime dependency.
