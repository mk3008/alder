# 実行条件と再現手順

- 実行日: 2026-09-30
- 対象Issue: [#122](https://github.com/mk3008/alder/issues/122)
- 入力revision: [90890e1c209af1b7f88f14e64bb27a7a0d2edbee](https://github.com/mk3008/alder/commit/90890e1c209af1b7f88f14e64bb27a7a0d2edbee)
- 要求設定: model `gpt-6-sol` / reasoning effort `medium` / `fork_turns: none`
- 実効runtime設定の独立した証明: 取得できていない。上記は要求した設定
- 読者数: A・B各1の独立したAI代理読者。統計的比較ではない
- 評価者: `/root/reader_a`、`/root/reader_b`
- 比較結果を判定した親コンテキスト: A/B双方と一次資料を参照。fresh-readerではない
- 共通条件: persona.md、evaluation.md。リンク先を含む他資料と他評価者出力は読ませない
- 追加質問: 事前プロトコルの1〜10と導入タスクに加え、具体的書式・人間レビュー・起動操作を文書単独で実行できるかを両者に同条件で質問した
- skim / 段落ごとの離脱 / 翌日recall: 未実施。通読後の自己申告をその代用としない
- 原出力: [A](raw/reader-a.md)、[B](raw/reader-b.md)。公開資料と架空タスクのみを用い、個人・顧客情報・非公開URL・認証情報の混入がないことを公開前に確認した
- 評価終了後、原出力保存のみを追加依頼。回答の修正や再評価は依頼していない

## 入力

公開GitHub connectorから上記SHAで取得したUTF-8テキストを同じパス構成に置いた。入力commitと各ファイルが取得できることを実行前に確認した。SHA-256はローカルで評価に使ったバイト列（末尾LFあり）を示す。

| 入力 | SHA-256 |
| --- | --- |
| README.ja.md | 8700a75aab5b47ad94563d999c68fbc45768011e523445387dee47611da076b5 |
| docs/research/explainer-readme-122/prototype.ja.md | e85ba89527fc26bf9910cfd0de3023745c644025389b325ff3e618af2168026d |
| docs/research/explainer-readme-122/persona.md | 7bf5c1d00815a8055387169df905b19b2729abde1b41c09bbe5fa46213a9b90f |
| docs/research/explainer-readme-122/evaluation.md | 5ee8e4b00a87e7bffc11e328443bec119d8b71597f174064c1f3518e7cf7bc7f |

## Aへの完全なプロンプト

```text
Alder README初見読者代理実験。入力revision 90890e1c209af1b7f88f14e64bb27a7a0d2edbee（mk3008/alder、公開GitHubから取得済み）。許可入力は /workspace/scratch/e184bc1beb18/alder/README.ja.md、alder/docs/research/explainer-readme-122/persona.md、alder/docs/research/explainer-readme-122/evaluation.md のみ（相対パスは同workspace基準）。READMEのリンク先、他資料、prototype、他の評価者出力、会話履歴、AGENTS.md、Web検索は禁止。ファイルは変更しない。personaの初見読者としてREADMEを読み、evaluationの質問1〜10と会議室予約導入タスクに日本語で回答する。各回答にREADMEの節名または短い根拠を示し、文書から確定できない事項と自分の推測を明示する。特に業務設計の具体的な書式・人間の検査項目レビュー・起動操作を文書だけで実行できるかを報告する。最後に読みにくかった箇所/誤読しそうな箇所/実際に読んだ入力パスを記録。別案比較や正解採点は行わない。完全な出力を最終応答として返す。これは人間の理解度実測ではない。
```

## Bへの完全なプロンプト

```text
Alder README初見読者代理実験。入力revision 90890e1c209af1b7f88f14e64bb27a7a0d2edbee（mk3008/alder、公開GitHubから取得済み）。許可入力は /workspace/scratch/e184bc1beb18/alder/docs/research/explainer-readme-122/prototype.ja.md、alder/docs/research/explainer-readme-122/persona.md、alder/docs/research/explainer-readme-122/evaluation.md のみ（相対パスは同workspace基準）。READMEのリンク先、他資料、README.ja.md、他の評価者出力、会話履歴、AGENTS.md、Web検索は禁止。ファイルは変更しない。personaの初見読者としてREADMEを読み、evaluationの質問1〜10と会議室予約導入タスクに日本語で回答する。各回答にREADMEの節名または短い根拠を示し、文書から確定できない事項と自分の推測を明示する。特に業務設計の具体的な書式・人間の検査項目レビュー・起動操作を文書だけで実行できるかを報告する。最後に読みにくかった箇所/誤読しそうな箇所/実際に読んだ入力パスを記録。別案比較や正解採点は行わない。完全な出力を最終応答として返す。これは人間の理解度実測ではない。
```

## 追試

1. 上記の公開SHAから許可入力を取得する。
2. 別々の履歴なしコンテキストを用意し、同じ要求設定と完全プロンプトで片方だけを渡す。ローカルパスを移す場合は置換内容を記録する。
3. 各読者の回答を凍結してから、別の評価者が同じSHAの一次資料と照合する。
4. 原出力、設定、逸脱、判定を保存する。確率的生成なので同じ文章や同じ観測の再出現は保証しない。

## 比較の範囲

Bはexplainerの読者条件・読後目標・冒頭表・理解度チェックを取り入れた既存の試作であり、この実行でexplainer Pluginを起動して再生成したものではない。`verify-doc.mjs`、HTML検証、図の検証、first-readerの段落送りは実行していない。explainer全体の性能、Plugin有無の因果効果、実在の一人に合わせたpersonaの効果は測定していない。
