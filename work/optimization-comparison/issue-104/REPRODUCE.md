# Issue #104 再現・監査の入口

ブランチ `research/issue-99-authoring-discovery`。既存研究との差分基点 `be856b9a292e0405dfe2e68cb91999b001763741`。本件は合成事例一件であり、実在業務の承認ではない。

GitHub 反映時の commit ID 対応は [`REMOTE-COMMITS.md`](REMOTE-COMMITS.md) に記録した。以下の短縮 SHA は検証時のローカル Git 系列を指す。

## 実行順と固定コミット

1. `d9d6cd9`：シナリオ、`protocol.md`、Oracle plaintext の SHA-256 commitment。平文は `/tmp/alder-104-oracle.txt` に置き、Agent の許可入力から外した。後の `oracle-revealed.md` と同じハッシュ `d8443346e2bf6c9f414ec304a4135c24d067ad78d97260381566004a9fb18308`。
2. `f4b4754`：合成顧客の最初の回答。`3375747`：Authoring Skill による初稿、重要質問への顧客回答。`da114eb`：同一 Business Design の改訂版、source fidelity、Known Problem、negative control を固定。Skill は Plugin 0.2.6、同梱 provenance は `af733229c7f20c5a9fc1c4f094a8fb8c548fe544`。
3. `5ab468f`：K / U1 / no-Problem control の指示と共通入力ハッシュを事前固定。`c5ab374`：三つの raw を固定。
4. `b27bd1e`：顧客による Observation ごとの判定と確認、U3 の二つの独立 Problem 指示を固定。`78a7895`：二つの U3 raw を固定。
5. `ba1d915`：Oracle 平文を公開し、独立評価の指示を固定。評価はこのコミット以降のみ Oracle を読める。

## Fresh 条件

全 role の requested model は `gpt-6-sol`、reasoning effort は `medium`、history fork は `none`。顧客 `/root/customer_104`、設計者 `/root/designer_104`、既知 `/root/known_104`、未認識発見 `/root/unknown_discovery_104`、control `/root/control_104`、確認後最適化 `/root/opt_u3_1_104` と `/root/opt_u3_2_104`、独立評価 `/root/evaluator_104`。各 role の指示全文は `authoring/*launch.txt`、`authoring/*followup.txt`、`runs/*/prompt.md`、`phase1/human-*-prompt.md`、`evaluator-prompt.md`。Agent 起動ラッパーはこれらの固定パスを参照し、read log は各 raw の末尾にある。共有 filesystem のため物理的な非接触、実効モデル設定、完全な独立性は証明できない。

## 確認

リポジトリ root から `sha256sum -c` で `oracle-commitment.sha256` を使う場合は、記録内の `/tmp/...` を公開後の `oracle-revealed.md` に置き換えて照合する。`authoring/*.sha256`、`phase1/*.sha256` は repo root からそのまま `sha256sum -c` で照合できる。ハッシュはファイル同一性だけを示す。

`git diff --name-only be856b9..HEAD -- work/structural-discovery/issue-99 work/structural-discovery/issue-101 work/authoring-loop/issue-102 work/optimization-comparison/issue-103` が空であることを確認する。raw の意味評価は `RESULT.md` と `evaluation-raw.md` を原文と照合する。

`git diff --check be856b9..HEAD` は U3 の raw 二件の冒頭で、回答原文の Markdown 改行用の行末空白（各2行）を報告する。raw を一字も変更しない記録条件を優先して残す。他のファイルでこの指摘はない。
