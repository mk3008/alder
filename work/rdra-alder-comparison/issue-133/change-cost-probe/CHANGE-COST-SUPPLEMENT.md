# C2の要件1点変更に伴う更新面積

今回の1変更は「RDRAでは更新する資料面積が大きくなる」という仮説と整合した。Alderは1ファイル、RDRAは23ファイルを変更し、両方の最終資料に新しい取消・利用不可の意味が残った。AI dispatch数の差と一般的な保守コスト優位は確認していない。

## 対象と更新経路

Primary `9098b43276f40e3c8adf62e6c8cb6194c4a528f3` のC2 / replicate 1 / Stage2をコピーした。Alder P058、RDRA P002はPrimary時点でstrict paired。停止前の既存予約を維持して利用できる規則を、利用停止時にその会議室の既存予約を取り消し利用不可とする規則へ1点だけ変更した。他の条件と未決は変更しない。Primaryのraw・score・freezeは保存したまま。

各arm1回のpost-hoc exploratory probe。反復、平均、統計比較、独立downstream生成は行わない。要求設定は同じ `gpt-6-sol / medium / fork_turns:none`。provider側の実効設定は独立証明できず、共有FSのread guardは手順上の制限。

Alderはpin済みPlugin 0.2.8のAuthoring Skillによる既存Business Designの修正。RDRAはhash一致した0.8配布物の公式 `rdra-impact-analysis` Skillで変更影響を調べ、既存TSVを直接編集し、公式 `makeGraphData.js` を1回実行した。配布物には専用incremental editorを確認できなかった。最新指示のゼロからの再生成禁止に合わせてこの探索経路を選び、公式更新workflowそのものの測定とは扱わない。過去の生成用18-node DAGを再実行していない。

実行前にbaselineコピー・入力・envelopeをlocal commit `ce0204c1af8703b3cfdedf8c34ee9fd1249af93a`へ固定した。公開pushは自動承認レビューで拒否され、このcommitは実行前に公開されていない。remoteで事前固定を独立確認できる条件ではない。

## 観測

| 観測 | Alder | RDRA |
| --- | --- | --- |
| 更新対象業務artifact（自己申告） | 1 | 23 |
| 実変更ファイル（byte比較） | 1 | 23 |
| 全業務artifact before → after | 1 → 1 | 27 → 27 |
| 全artifact bytes before → after | 6,385 → 6,527 | 79,510 → 81,712 |
| Fresh agent dispatch | 1 | 1 |
| agent turn attempt | 1 | 2（利用上限中断後の同じagentの継続） |
| 公式派生script | 0 | 1（makeGraphData） |
| 開始UTC | 2026-10-02 13:21:53 | 2026-10-02 13:22:07 |
| 終了UTC | 2026-10-02 13:22:46 | 2026-10-02 13:30:03 |
| 中断を含むwall span | 53秒 | 7分56秒 |
| 意味・参照整合の確認path（自己申告） | 1 | 9 |
| 読んだ業務artifact（自己申告） | 1 | 27 |
| 追加行 / 削除行 | 8 / 6 | 53 / 54 |
| 追加UTF-8 bytes / 削除UTF-8 bytes | 620 / 478 | 42,734 / 40,532 |
| 旧「停止前予約を維持」の残存 | 観測なし | 観測なし |
| 新しい取消・利用不可の最終資料への明示 | あり | あり |

evidence、method、sourceは業務artifact数に含めない。行差分bytesは追加・削除各行をLF付きで数え、ファイルサイズの純増や意味の変更量とは区別する。RDRAの長い関係データ行は小さい意味変更でも大きなbyte差分になる。人間の認知負荷の直接測定ではない。

RDRAは構造確認として全TSVのheader・列数と両JSONのparseも確認したと記録した。9はmetadataに個別列挙された意味・参照確認pathの数で、27資料すべての意味を独立確認した件数ではない。更新された23資料は最低限の再レビュー候補となるが、確認が論理的に必要な全範囲の網羅性は証明していない。shellによる文字置換・read log・監査処理は両armにあり、公式派生script数とは分ける。agent dispatchを内部の全model request、tokenや実課金件数に置き換えない。

RDRAの最初のagent turnは影響分析を保存後に利用上限エラーで中断した。ユーザーの「再開」に従い同じagent・同じ試行で未完了編集を続けた。新Fresh runや完成出力のやり直しではないが、transport failureだけを例外とした当初条件からの逸脱として保存する。wall spanは中断と再開待ちを含むため速度比較には使わない。

## 変更意味とdriftの確認

Alderは「会議室の利用停止」のInput/Procedure/Output/Resultへ予約の取消を追加した。RDRAは維持UC・条件・説明を取消へ変更し、予約済み→取消済みの遷移と派生グラフを更新した。RDRA最終handoffの条件・状態・BUC・関連データとAlderのBusiness Designに、取消・利用不可と、停止中の検索/新規予約/変更先からの除外が明示される。

coordinatorがbefore/after差分と該当原文を確認した。停止前維持・利用権維持・維持UC/条件・取り消さず等の機械候補scanは両arm0件。時間変更失敗時に「元の予約を維持」は別規則でありdriftに数えない。両資料の一般取消後の時間帯再利用表現は従前から残るため、停止中除外を併読する必要がある。独立downstream実行や実装動作による意味伝達の証明ではない。

read-logはAlder11件、RDRA69件を保存。method/source不変はAlder7ファイル、RDRA68ファイルでhash一致。RDRAはphase3 BUCのtail検証readを1回記録せず、read-log条件不合格を自己申告した。Primaryのstrict資格を今回へ引き継がず、今回をstrict paired結果と呼ばない。patchの期待行不一致で1編集が失敗し、未変更を確認した上で同じ更新試行内で適用した記録も残す。

## 解釈とふりかえり

**更新面積・差分量の仮説と整合する。call数増大と追加品質価値の比較は未確定。** RDRAの関係構造は影響分析の根拠として実際に使用された。今回は、その価値が23資料の同期・再確認を上回るかを測っていない。両arm1 Fresh dispatchで編集できたため、生成時の18対1のcall差を変更時にも当てはめない。中断があり、wall-clockも方法差の根拠にしない。

この1人工ケース・coordinator確認・選択した更新経路から「RDRAは常に高コスト」「Alderが一般に速い」「最終品質が同じ」とは結論しない。非対称な更新制御とRDRAのread-log逸脱は結果の限界。追加実験で取り繕わず、この1回のまま完了する。再利用できる学びは、維持コストを見る際に成果物の初期個数だけでなく、実変更・派生同期・再確認面積と追加価値を分けて記録すること。

詳細: [事前条件](PROTOCOL.md)、[metrics](change-metrics.json)、[validation](validation.json)、arm別before/after、DIFF.patch、envelope、read-log、metadata、raw final、dispatch/resume記録。公式ZIPの本文は再配布しない。
