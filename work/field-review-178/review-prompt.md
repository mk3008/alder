# Synthetic field-role review prompt

This is a prepared prompt, not a record of an executed review. Replace every angle-bracket placeholder before a run and retain the exact substituted prompt with that run's result. Pin the guidance and input files independently; a mutable working tree or a local-only SHA is not public reproduction evidence.

## Prompt to pass to a fresh reviewer

```text
Alderの業務設計の記述品質を、読み取り専用でレビューしてください。

レビュー用ガイダンスの固定版: <guidance revision or immutable snapshot identifier>
業務設計の構造: <pinned business-design-structure.ja.md path>
記述品質ガイダンス: <pinned business-design-quality-check.ja.md path>
入力の固定版: <input revision or immutable snapshot identifier>
対象入力:
- <readable input root>/inputs/designs-a.md
- <readable input root>/inputs/designs-b.md
本文の言語: 日本語

各Caseは独立した文書です。そのCaseに記載された前提を、当該の架空業務内で
決まっている事実として使ってください。他のCaseの事実を持ち込まないでください。
対象は、各Caseが説明する正常な一場面です。

指定したガイダンスに従い、対象文書全体の記述品質を確認してください。
指摘にはCase ID、対象箇所、根拠、読み手に生じる誤解、修正案または確認事項を
含めてください。意味を変えずに直せる点と、業務判断が必要な点を区別してください。
問題がない場合はその旨を示し、確認範囲と限界を報告してください。

入力とガイダンスは変更しないでください。業務判断を決定・承認しないでください。
許可する資料は上記の固定版ガイダンスと2つの入力ファイルだけです。
期待判定、他のレビュー結果、実験の作業メモ、会話履歴は参照しないでください。
```

## Conditions to record outside the reviewer's inputs

- Requested model and reasoning effort, whether conversation history is forked, reviewer identifier, exact substituted prompt, guidance revision, input revision, and files actually read.
- Follow the repository's Fresh-review model and effort instructions unless a specific experiment explicitly overrides them; record any override. Do not claim effective runtime settings were independently verified unless evidence supports that claim.
- Keep `expected.md` out of the reviewer's accessible input bundle. Before invoking a reviewer, separate the allowlisted files from scoring notes and earlier outputs; a prompt prohibition alone is not physical isolation.
- Score after the review without feeding expected findings back into the same run. A correction to an input creates a new input revision and requires a new run if results are compared.
- This designed synthetic exercise checks a narrow failure pattern and nearby counterexamples. It is not an objective oracle, statistical benchmark, measurement of real-world benefit, or business approval.
