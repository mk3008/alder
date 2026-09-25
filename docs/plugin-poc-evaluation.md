# Issue #86 — bounded plugin PoC evaluation

## Baseline and change

Baseline: `docs/adoption.md` asks the user to choose a review, arrange readable Alder knowledge, pin its source revision, route paths and copy the post-implementation review prompt. The prompt block alone is 1,565 characters before filling paths and revisions. The PoC request `実装が終わったのでAlderレビューして` is 20 characters; the skill performs routing and carries the 123-line review knowledge. The old prompt and knowledge remain as references. This measures request text and manual steps, not elapsed time or model cost.

| Activity | Manual route | PoC route |
| --- | --- | --- |
| One-time preparation | Checkout/copy and pin Alder knowledge in the product or a readable workspace | Add Alder as a marketplace source and install the plugin once |
| Per-product setup | Business Design, decisions and knowledge paths; selected revision in AGENTS.md or prompt | Business Design at conventional path, or one project-specific path in AGENTS.md |
| Per-review request | Choose knowledge and copy/fill the long review prompt | Short natural-language request; scope only if ambiguous |
| Reproducibility | Alder source revision and knowledge path, design/product revisions | Plugin package and bundled knowledge versions, plugin source commit for a moving development source, design/product revisions |

## Real-product walkthrough (read-only)

Velvet at `d707a99157c5f70d0b7d3123626ac5da30ab0461` supplies a realistic product with `docs/business-design/README.md` as entry point. Its current `AGENTS.md` already names that path and routes to scope, concepts, DFD and process; this PoC follows those project instructions. For a scoped transfer-execution review, the knowledge in Velvet's existing `docs/alder/review-knowledge.md` has exactly the same SHA-256 (`564c52831d438d9b49f4ca098dd1884167f2be096cc56f959c7847002ffe0351`) as the plugin's bundled copy. Therefore the PoC has not altered Q1–Q3, P1/P2, S or their stopping boundaries.

Walkthrough scope: the maximum Dirty Key cap and eligible Links (Check A08–A09). Read `docs/business-design/README.md` → the transfer process and Dirty Key concept → Decision 0013 and Check Items → `src/features/execute-transfer/queries.ts` and `set-phase/queries.ts`. In both bounded paths the SQL first limits Dirty Keys and then joins each admitted key to eligible Links. There is no durable high-watermark in these queries; an unadmitted row can be selected by a later run. This is a **bounded sufficiency observation** for this choice, not an end-to-end guarantee: concurrency, failure recovery and DB execution were not re-tested. A complete implementation review must continue across the relevant business flow and tests.

Velvet's current AGENTS.md still explicitly directs agents to its local knowledge copy and pinned v0.5.1 workflow. A real migration must remove or revise that old project-specific routing before the plugin can be relied on as the sole knowledge source. The exercise did not write to Velvet. Its existing knowledge being byte-identical means the knowledge content does not change, but no independent agent comparison or client installation/activation occurred in this workspace. Output parity and plugin activation remain unverified; the PoC establishes packaging, deterministic content parity and a viable shorter instruction route, rather than measured review accuracy.

## Boundaries

The plugin is a development package, version `0.1.0`, with one read-only implementation-review skill. The package and source provenance are validated in `tools/test_plugin_package.py`; this does not test whether a particular Codex account can install from a marketplace. Business Graph export is [planned as a deterministic tool in the same plugin](plugin-adoption.md#business-graph-export-in-the-same-plugin), sourced from the existing CLI, and is not bundled in this PoC. Other Alder reviews and authoring workflows remain manual. Public directory submission, release tagging and a controlled A/B quality comparison are later decisions, not implied by this PoC.
