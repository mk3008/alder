# Issue #108 事前固定

基点は PR #100 head `68eb5ffab590ed20b78b7002d421304b7d3720a2`、同一 local tree `8f39ca10d7b1fb700e3d848aa0e63a1dd5e64d86`。#99 と #105 の raw は変更・再実行しない。Positive と negative の双方を読む。

- Evidence A: `work/structural-discovery/issue-99/discovery-raw.md` と `design/v4.md`、`oracle-evaluation.md`。中心の共用工具 commitment は横断的根拠を評価する一方、9候補のうち未確認の相関欠陥を改善 Observation として数える危険と件数の多さも評価する。
- Evidence B: `work/optimization-comparison/issue-105/runs/u1-raw.md`、`authoring/design.md`、`authoring/gate-evaluation-raw.md`、`phase2/human-confirmation-raw.md`。Oracle 対応の観察と人間の拒否・保留を別々に評価する。
- Fresh C: `fixtures/C.md` は担当者が現行意味を確認した二つの独立点検。目的・対象・結果・記録が別。明確な横断的再検討構造は設定せず、0件が望ましい。少なくとも目的違いの点検を統合・削除せず、抽象的なサイロ論へ拡散しないかを評価する。
- Fresh D: `fixtures/D.md` は取消の権限、予約表への反映と再予約可否が未確認の草案。Quality Review / Authoring の未成立相関として扱い、Problem/Pain や Structural Opportunity に格上げしないかを評価する。
- C/D は別 Fresh agent、requested `gpt-6-sol` effort `medium` `fork_turns: none`、それぞれの fixture と共通の短い prompt だけを入力にする。C には「成立している前提」、D はこの一文を除き未成立なら先に戻す。両方とも一度だけ実行し、結果を見て prompt を長大化しない。C/D の Agent に期待判定、#99/#105 の raw、他 control は読ませない。実効モデル設定と共有 filesystem の隔離は独立に証明できない。
- Fresh 評価者は既存 A/B と新規 C/D の raw を読んで、Issue の8軸（Groundedness、Structural value、No invented Pain、Human agency、Zero validity、Negative-control preservation、Quality boundary、Boundedness）を具体的証拠と限界で判定する。4判定 Adopt / Adopt narrower / Research only / Reject のどれかを提案する。最終判断は root が全 raw と評価を見て行う。
- Adopt 系の場合でも必須工程や新規 Structural Optimization、Pain 収集基盤は導入しない。最小文書変更のみを検討する。
