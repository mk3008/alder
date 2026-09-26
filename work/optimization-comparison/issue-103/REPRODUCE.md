# Issue #103 再現・監査の入口

研究ブランチ `research/issue-99-authoring-discovery`。このディレクトリは #99/#101/#102 の raw・oracle・評価を変更せず追加した。既存研究の比較前基点は `691994afd9c602d4f739bc2b751e14fc10e91205`。

## 記録順と入力

1. [`phase0/protocol.md`](phase0/protocol.md)、`customer-prompt.md`、`customer-launch.txt` を先に固定。顧客回答 `customer-raw.md`、Designer の exact launch と source-fidelity correction、学校講座への一問・顧客追回答・同 Skill による改稿、全 response・diff・read log を保存。最終 `phase0/benchmark.md` の SHA-256 は `1b13ebe8bbd15aa112ed68bda6df58ba6647ad79db60d101ea0a71c1753c7bc4`。
2. [`phase1/problem-question.md`](phase1/problem-question.md) と `customer-launch.txt` を回答前に固定。合成顧客の `problem-confirmation-raw.md` を次に固定。
3. [`comparison/protocol.md`](comparison/protocol.md)、`prompts/L1.md`～`S.md`、`input-sha256.json`、各 exact `launch/*.txt` を4件実行前に固定。各 arm は別 workspace で一度だけ実行し、`runs/{L1,L2,L3,S}/raw.md`、`read-log.md`、`run-prompt.md`、AGENTS.md と `runs/sha256.json` を評価前に固定。
4. 別 Fresh Evaluator の指示全文は `comparison/evaluator-launch.txt`。raw 固定後に #99 oracle と評価を初めて評価側へ開き、`comparison/evaluation-raw.md`、`evaluation-read-log.md` と hash を保存した。

## Fresh 設定と許可資料

| Role | Agent ID | 指示全文 | 主要許可入力 |
| --- | --- | --- | --- |
| 合成顧客（Phase 0/1） | `/root/customer_103` | `phase0/customer-launch.txt`、`customer-followup-launch.txt`、`phase1/customer-launch.txt` | #99 scenario・transcript・v4 と顧客へ送った中立な確認文、Phase1 では固定 benchmark |
| Authoring Designer | `/root/designer_103` | `phase0/designer-launch.txt`、`designer-correction.txt`、`designer-followup.txt` | v4 copy、顧客回答、Authoring Skill 0.2.6 と同梱参照 |
| Local L1/L2/L3 | `/root/local_l1_103` 等 | `comparison/launch/{L1,L2,L3}.txt` + 各 `prompts/*.md` | 同一 benchmark、Optimization guidance、各自の Problem |
| Structural S | `/root/structural_s_103` | `comparison/launch/S.txt` + `prompts/S.md` | 同一 benchmark、同一 guidance、横断 Problem と最小 treatment |
| 独立比較評価 | `/root/evaluator_103` | `comparison/evaluator-launch.txt` | 上記全 raw、protocol、固定設計、#99 oracle・評価 |

全役割の requested model は `gpt-6-sol`、reasoning effort は `medium`、`fork_turns: none`。各 read log に自己申告の実際の読取先がある。共有 filesystem の指示だけで他資料への非接触、実効モデル設定や独立性を証明できない。

## 同一性と構造の確認

リポジトリ root から：

```bash
sha256sum -c work/optimization-comparison/issue-103/phase0/customer-sha256.txt
sha256sum -c work/optimization-comparison/issue-103/phase0/customer-followup-sha256.txt
sha256sum -c work/optimization-comparison/issue-103/phase1/sha256.txt
sha256sum -c work/optimization-comparison/issue-103/comparison/evaluation-sha256.txt
python tools/business_graph/export.py work/optimization-comparison/issue-103/phase0/benchmark.md --output /tmp/alder-issue-103-business-graph.json
git diff --name-only 691994afd9c602d4f739bc2b751e14fc10e91205..HEAD -- work/structural-discovery/issue-99 work/structural-discovery/issue-101 work/authoring-loop/issue-102
```

上記 hash と exporter は今回成功した。JSON manifest (`phase0/benchmark-sha256.json`, `comparison/input-sha256.json`, `comparison/runs/sha256.json`) も保存値と現ファイルの SHA-256 が一致した。旧研究ディレクトリの変更ファイルは空。export 成功や hash 一致は**業務意味の正しさや agent の隔離を証明しない**。比較は原文を読み、意味と責任の変更を評価する必要がある。
