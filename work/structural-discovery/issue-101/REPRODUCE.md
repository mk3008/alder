# Issue #101 — Authoring Fresh 再現検証の追試

## 結果を読む順序

1. 出力前に固定した [protocol](protocol.md) で F1/F2 の条件と入力境界を確認する。
2. [顧客との対話](customer-transcript.md)、[設計者の質問](designer-questions.md)、`design/v1.md` → `v2.md` → `v3.md` を順に読む。差分は `design/v1-v2.diff` と `v2-v3.diff`。質問ファイルは「実際に顧客へ中継した初回質問」と「草案内に記録した未確認事項」を区別する。
3. #99 と比較する前に書かれた [独立評価の生記録](evaluation-raw.md)を読む。比較後の解釈修正を含む [比較と判断](comparison.md)は最後に読む。生記録は修正していない。

## 入力と役割

- `../issue-99/scenario.md` は顧客役だけ、`../issue-99/initial-brief.md` は設計者の初回入力だけに使用した。設計者には #99 の設計・会話・評価、#101 の評価基準を渡さなかった。顧客は #99 transcript を読まず、今回の質問に scenario の範囲で答えた。
- 実際に受領した指示文は [顧客役](customer-prompts.md)と[設計者役](designer-prompts.md)に原文で保存。設計者は `plugins/alder/skills/alder-draft-business-design/SKILL.md` と指定参照資料を読み、新規作成、回答反映、学校講座追加を同じ Skill で行った。読取申告は [こちら](designer-read-log.md)。
- Plugin `0.2.1`、Plugin source `b6660f73713ca11298b4fefe771e4af56a05fa01`、bundled authoring source `af733229c7f20c5a9fc1c4f094a8fb8c548fe544`。Customer、Designer、Evaluator の requested model は `gpt-6-sol`、effort `medium`、`fork_turns: none`。Agent ID は `/root/customer101`、`/root/designer101`、`/root/evaluator101`。実効設定と共有 filesystem 上の読取隔離は独立には証明できない。
- 顧客発言と Business Design は日本語。比較条件を保つため設計者への assignment / follow-up 指示部分は前回と同じ英語表現を使用し、翻訳していない。評価・比較・本手順は日本語。

## 固定順序と検証

| 段階 | ローカル commit | 内容 |
| --- | --- | --- |
| 事前登録 | `fac84bf` | `protocol.md` を Agent 生成前に固定。SHA-256 `2bd79bff5359fb517f4db35db6c495fc1342351ef3e1b3d9be4caa71c3cf8e47`。 |
| 生成物 | `ad69371` | 対話、全 prompt、3版、差分、読取記録、`SHA256SUMS-at-freeze` を評価前に固定。 |
| 独立生評価 | `30f9575` | `evaluation-raw.md` を #99 の評価資料閲覧前に固定。SHA-256 `310f1eb44b76523d5fbfbeeb1b240748ac6d0ef41cde3a9cadb331d396b36a1a`。 |
| 比較 | 後続 commit | `comparison.md`。生評価を改変せず、#99 との差と分類上の留保を記録。 |

リポジトリのルートで `sha256sum -c work/structural-discovery/issue-101/SHA256SUMS-at-freeze` を実行すれば生成時点の全入力を照合できる。後続評価を含めたファイルは同じ位置の `SHA256SUMS-final` で照合する。`python tools/business_graph/export.py work/structural-discovery/issue-101/design/v3.md --output /tmp/alder-issue-101-graph.json` は構造検証として成功した。これは業務上の合意や F1/F2 の判定を検証するものではない。

## 追試の手順

Fresh 顧客役へ #99 scenario、別の Fresh 設計者役へ初回 brief と上記 Skill だけを与える。設計者に最初の草案と質問を出させ、質問に応じて顧客が答え、同じ Skill で更新する。次に scenario の指定する学校講座追加を渡し、もう一度更新する。各段階の顧客への**実際の質問**、発話、設計全文、差分、許可入力・読取記録と hash を固定した後で、Fresh 評価者が F1/F2 を判定する。#99 の材料を評価者が読むのは生判定を固定してからである。

今回は顧客が定例確認対象と講座側の照合不存在を質問前に詳しく述べたため、元の曖昧な曝露条件を十分に再現していない。比較上 F1 は `Not exposed`、F2 は形式上 `Missed again` だが識別力が低い。これをもって Skill の改善または問題解消の証拠にはしない。次の統制実験で回答の情報境界を事前に固定するという判断は `comparison.md` に記す。#99 の証拠・結論、Skill 本体、README は今回変更しない。
