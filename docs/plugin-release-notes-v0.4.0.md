# Alder Plugin 0.4.0 — Check Items and complete workflow Skills

Alder Plugin 0.4.0 packages ten Skills with their pinned guidance. It adds Check Item drafting/maintenance, functional-condition exploration, Structural Discovery, post-review evidence follow-up, Business Graph export and optional bounded drift diagnosis to the four existing workflows.

## Install

```sh
codex plugin marketplace add mk3008/alder --ref plugin-v0.4.0
```

Restart the supported ChatGPT desktop client, open Plugins Directory, choose Alder development, then install/enable Alder and start a new chat. For an existing local marketplace snapshot, refresh/reinstall through the client's supported controls to select this tag. A source update does not auto-upgrade an installed plugin. See the [installation guide](https://github.com/mk3008/alder/blob/plugin-v0.4.0/docs/plugin-adoption.md).

## New requests

- 「Alderでチェック項目を作って」「Alderの検査項目を更新して」
- 「Alderで未記載の機能条件を探して」
- 「ProblemはまだないのでAlderで業務構造を見て」
- 「Alderレビューのフォローアップをして」
- 「この業務設計をAlderでJSON化して」
- 「Alderでチェックとテストの同期漏れを調べて」

Supply readable product inputs such as the agreed Business Design, existing Check list, review or actual human decisions. The plugin bundles Alder knowledge; users need not locate its internal guidance documents.

Business Design remains the SSOT. People confirm Check expectations and make business decisions. Test evidence, model confidence and matching fingerprints do not establish approval. Functional Interface indexing remains optional. Review-only requests stay read-only; record maintenance does not silently authorize product implementation.

## Tool requirements and limits

Graph export and drift detection need local script execution with Python 3.12+. They ship byte-identical copies of the existing official tools. Graph export supports the documented Markdown profile. Drift detection is an explicitly chosen restricted pilot requiring compatible documents, saved reviewed mappings and actual current Test discovery. It is not a universal product parser and never bulk-acknowledges pins.

## Validation

Local verification passed 12 package/CLI/release-workflow tests, 44 graph tests, 12 drift regressions and 26 drift scenarios. Independent Fresh agent runs exercised drafting, feedback updates, evidence follow-up, routing choices, inquiry boundaries and incompatible export input. Requested settings were gpt-6-sol / medium / no history; effective runtime settings were not independently attested.

An isolated Codex CLI 0.159.2 local-marketplace installation also passed: version 0.4.0 enabled with ten Skills, 44 byte-identical package files and a working cached exporter. This does not constitute desktop/chat-client routing or agent-driven script-execution validation. The earlier 0.2.8 package has bounded client routing evidence for its three workflows; 0.4.0's expanded client behavior remains unverified. Publishing this installable tag does not update a user's installed plugin or approve their business meaning.

This is the Plugin release version. It does not release Alder method v0.7 or change review knowledge v0.3. See [coverage and reproducible evidence](https://github.com/mk3008/alder/blob/plugin-v0.4.0/work/workflow-skills/issue-143/RESULT.md).
