# Issue #96 Aggregate 実験事前条件

入力は `business-design.md`（main の原本 SHA-256 `2692b564fd44eb64005f6d595008afdf3ec62660ba81bfa99f6c90165c518fdc`）と `launch.md` のみ。生成者は既存のOptimization Review、過去の出力、比較評価を読まない。既存Controlは issue-81 元High、followup A1、A2の凍結済みrawを評価者が後から使う。Fresh Agent `gpt-6-sol` / `medium` / 履歴なし、1回。rawを保存後に編集しない。

事前評価: 2つ以上のProblemに対する具体的な因果と設計書の箇所、Local候補の併記を越える業務境界・責任・情報・単位の変更があるか。現行の承認判断と却下の購買除外、申請別の実購入結果を保てるか。共通原因がなければ統合しない。未記載の遅延・件数・制度・外部記録は事実扱いしない。差が有用ならDiscoveryを別Fresh Runで実施。候補が抽象化・巨大化・既存Localの組合せだけならそこで停止。結果を見て判定条件を変更しない。
