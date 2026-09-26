# Issue #98 — Problemなしの業務構造探索

## 結論

**追加検証。** 2つの既存Business DesignをProblem/Painなしで読むと、複数業務にまたがる構造と人間への具体的な質問を出せた。痛みや効果は事実化していない。一方、今回の候補は既存の業務相関・既知の改善視点の再表現、または承認の意味を確定するための記述品質の問いに近い。**利用者が未自覚だった新しい業務上の課題を発見したとは確認できない。** Business Designが探索の入口になり得ることと、そこから新しい改善機会を得られたことは区別する。Discoveryを恒久の前段工程として採用しない。

## 条件・証拠

[事前条件](../../work/optimization-review/issue-98/protocol.md)をraw閲覧前に保存し、設備保全で具体的な横断観測と確認質問が出たので備品購入申請を追加した。各1回、別々の履歴なしFresh Agentで実行。両者とも要求モデル `gpt-6-sol`、effort `medium`、`fork_turns: none`。実効設定の独立証明はなく、閲覧範囲は明示的な指示によるものでアクセス制御ではない。業務入力は以下の設計書だけで、生成者にProblem/Pain、既存結果、#96の結論、評価条件は渡していない。

| 対象 | 入力 | 指示全文 | 無修正raw | hash・実行記録 |
| --- | --- | --- | --- | --- |
| [設備保全](../../business-design/facilities-maintenance/README.md) | [固定入力](../../work/optimization-review/issue-98/facilities/business-design.md) | [指示](../../work/optimization-review/issue-98/facilities/launch.md) | [raw](../../work/optimization-review/issue-98/facilities/raw.md) | [run.json](../../work/optimization-review/issue-98/facilities/run.json) |
| [備品購入申請](../../business-design/purchase-request/README.md) | [固定入力](../../work/optimization-review/issue-98/purchase/business-design.md) | [指示](../../work/optimization-review/issue-98/purchase/launch.md) | [raw](../../work/optimization-review/issue-98/purchase/raw.md) | [run.json](../../work/optimization-review/issue-98/purchase/run.json) |

## ObservationとOpportunityの評価

| 出力 | Observationの根拠 | Opportunityと未確認のPain | 非自明性・既存研究との関係 |
| --- | --- | --- | --- |
| 設備1: 安全閉鎖・解除と日程対象の接点 | 業務2の設備状態による日程制約、業務4の`open`保持、業務5の解除後の再対象化。複数ロール・状態にまたがる。 | 閉鎖中・解除後の依頼を誰がどう把握するか問う。把握の困難・失念・遅延は設計書にないため断定しない。 | 横断した関係は正しいが、設計書の業務相関4・5に既に明記されている。具体的な業務単位や責任の代替案はまだなく、今回の新規改善候補とは数えない。 |
| 設備2: 複数の依頼と設備単位の安全判断 | 業務1は同一設備への複数報告を許し、業務2・4は設備状態で個々の日程設定を制約する。 | 設備単位で依頼を見渡すか問う。複数件の頻度、重複や負荷は未知。個別依頼の保持と安全閉鎖中の停止を維持。 | 設備と依頼の単位差は具体的。ただし[#85 follow-up](issue-85-followup.md)が既に同一設備の複数依頼を一回の対応機会で見る問いを記録している。安全状態との接点を明示した点は異なるが、改善効果・新しい処理単位までは示せない。 |
| 購入1: 承認・却下の共通入口 | 業務2・3はいずれも承認者が`submitted`を確認し、結果が分岐する。 | 一つの購入可否判断として表す余地を問う。効率や判断品質が改善する根拠はない。承認日時と却下理由・日時の意味は維持する。 | 業務の記述単位や同一判断の表し方の問題が主。業務上の新しいProblemや改善効果として数えず、Quality reviewとの境界に置く。 |
| 購入2: 希望額と実額の関係 | 業務1・2・4の金額と状態遷移を追える。二つの金額の許容関係は規定されない。 | 承認が何を許すか人間に確認する。差額発生や現実の支障は未知。条件を加えるなら承認権限・`purchased`の意味を再決定する。 | 記述されていない業務判断を明らかにする問いで、主として仕様の決定・Quality review。[#81 raw](../../work/optimization-review/issue-81/outputs/raw.md)も希望額と実額の区別・価格差の扱いをUnknownとして既に挙げている。新規改善機会とは数えない。 |

すべてのObservationはBusiness Designの具体的な関係から追え、Opportunityは条件付きで、人間に確認できる質問へ落ちている。Problemを創作したり、機能・外部システム・組織全体への無制限な拡張をしたりはしていない。ただし、**4候補とも採用可能な新規改善案はゼロ**という評価である。ゼロを許す設計だったが、生成者は各2件を返した。明示的なゼロ出力が可能か自体はこの実行では観測していない。

## 判断・限界・再検討条件

追加実行で望む結果を探さず、2対象で停止する。Problemなしでも設計書から論点・問いを返す能力の小さな例は得たが、「未自覚だったか」は利用者本人への確認がなく検証できない。Business Designだけでは現実の頻度、手間、価値判断、現行構造を採った理由が欠ける。既存研究との意味の重複が大きく、今回だけではDiscoveryをOptimization Reviewの前段に追加する根拠にならない。

再検討するなら、実利用者がまだ言語化していない論点を含む合意済みBusiness Designと、人間に確認できる現状資料を選ぶ。生成前にQuality reviewで解消すべき記述不足・既知のLocal/Extremeの論点を固定し、盲検の評価者が新規の業務上の問いと実利用者による検証可能性を判断する。必要な事実がない場合は候補ゼロも許す。#96の結論とrawは変更しない。恒久仕様・Skill・Business Design・実装にも変更を加えない。
