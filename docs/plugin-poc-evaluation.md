# Issue #86 — initial Alder Plugin validation

## Baseline and change

Baseline: `docs/adoption.md` asks the user to choose a review, arrange readable Alder knowledge, pin its source revision, route paths and copy the post-implementation review prompt. The prompt block alone is 1,565 characters before filling paths and revisions. The PoC request `実装が終わったのでAlderレビューして` is 20 characters; the skill performs routing and carries the 123-line review knowledge. The old prompt and knowledge remain as references. This measures request text and manual steps, not elapsed time or model cost.

| Activity | Manual route | Plugin PoC route |
| --- | --- | --- |
| One-time preparation | Checkout/copy and pin Alder knowledge in the product or a readable workspace | Add Alder as a marketplace source and install/enable the plugin once |
| Per-product setup | Business Design, decisions and knowledge paths; selected revision in AGENTS.md or prompt | Business Design at conventional path, or one project-specific path in AGENTS.md |
| Per-review request | Choose knowledge and copy/fill the long review prompt | Short natural-language request; scope only if ambiguous |
| Reproducibility | Alder source revision and knowledge path, design/product revisions | Plugin package and bundled knowledge versions, plugin source commit for a moving development source, design/product revisions |

## Client activation and natural-language routing

A supported client validation on 2026-09-25 used the development marketplace from `issue-86-plugin-poc`.

| Check | Result | Observation |
| --- | --- | --- |
| marketplace registration | done | `alder-development` registered from the development branch |
| plugin installation | done | `alder@alder-development`, version `0.1.0` |
| plugin enabled | done | installed and enabled state confirmed |
| short-request routing | done | `実装が終わったのでAlderレビューして` selected the implementation-review skill without naming it |
| repository / Business Design discovery | done | Velvet and its Business Design were located without a path question |
| bundled review knowledge | done | review knowledge v0.3 was read in full |
| authority/read order | done | Business Design → Decision Records → implementation / DDL / tests |
| version reporting | done | output included `Alder plugin 0.1.0 / review knowledge v0.3` |
| read-only behavior | done | Velvet HEAD and working tree were unchanged |
| Plugins Directory screen | not observed | the validation environment could not automate the desktop UI itself |

The missing directory-screen observation is narrower than plugin activation: the installed/enabled package and successful skill execution were both observed. It is therefore kept as a UI verification limit rather than a blocker for this PoC.

## Fresh A/B comparison on Velvet

The manual route and plugin route were each run once in Fresh contexts against the same Velvet scope, `fcda11bebbb8cf88dc317f79e55f83c77bdee980..ecd2152c7502247c156a63bea2ca837e4b230b41`.

| Classification | Manual route | Plugin route |
| --- | ---: | ---: |
| definite mismatch | 0 | 0 |
| Business confirmation | 0 | 0 |
| technical improvement | 0 | 0 |
| sufficient | 4 | 3 |

The count difference is grouping, not a semantic disagreement. Both reviews concluded that:

- removing the INSERT forwarder did not change the relevant business meaning
- transaction handling, receipt validation and error propagation remained intact
- the SQL / DDL / public API / downstream Transfer Execution guarantee boundary did not materially change
- no unnecessary implementation or scope expansion was required
- Decision Records and tests remained evidence, not substitutes for Business approval

This one-pair comparison supports semantic equivalence for the tested scope; it is not a detection-rate study, a proof of deterministic output parity, or evidence that every future review will group findings identically.

## Earlier bounded walkthrough

Velvet at `d707a99157c5f70d0b7d3123626ac5da30ab0461` supplied the earlier realistic product walkthrough with `docs/business-design/README.md` as entry point. Its existing `docs/alder/review-knowledge.md` had the same SHA-256 (`564c52831d438d9b49f4ca098dd1884167f2be096cc56f959c7847002ffe0351`) as the plugin's bundled copy, so packaging did not alter Q1–Q3, P1/P2, S or their stopping boundaries.

The walkthrough examined the maximum Dirty Key cap and eligible Links (Check A08–A09): `docs/business-design/README.md` → transfer process / Dirty Key concept → Decision 0013 / Check Items → `src/features/execute-transfer/queries.ts` and `set-phase/queries.ts`. In both bounded paths the SQL first limits Dirty Keys and then joins each admitted key to eligible Links. There is no durable high-watermark in those queries; an unadmitted row can be selected by a later run. This was a bounded sufficiency observation, not an end-to-end guarantee.

Velvet's project instructions still matter. If an existing product explicitly routes agents to an older local Alder copy, update that routing once before relying on the installed plugin as the sole knowledge source. The plugin does not override project instructions.

## Execution observations

One plugin Fresh run attempted an additional ephemeral-thread collaboration check. That internal collaboration call failed once and caused an idle wait, but the main review completed normally. The skill does not require that cross-check, so this is recorded as client/harness execution friction rather than a functional plugin failure.

The tested Velvet checkout did not have `node_modules`, so typecheck, tests and SQL audit were not rerun inside the Plugin run. The reviewer explicitly distinguished that limitation from the existing PostgreSQL CI evidence and the unchanged runtime tree instead of claiming new execution evidence.

## Boundaries and conclusion

The plugin is a development package, version `0.1.0`, with one read-only implementation-review skill. The package and source provenance remain checked by `tools/test_plugin_package.py`.

Issue #86 began as a bounded PoC, but the validated result is retained as Alder Plugin version `0.1.0` rather than discarded as a demonstration. Client installation/enabling, natural-language skill routing, project/Business Design discovery, bundled-knowledge use, authority order, read-only behavior and one Fresh semantic A/B comparison are verified. The remaining Plugins Directory item is only direct visual observation of the desktop list.

Business Graph export is [planned as a deterministic tool in the same plugin](plugin-adoption.md#business-graph-export-in-the-same-plugin), sourced from the existing CLI, and is not bundled in plugin `0.1.0`. Other Alder reviews and authoring workflows remain manual. Public directory submission, release tagging, broader client coverage and repeated/controlled quality measurement are separate future decisions, not completion requirements for this bounded PoC.
