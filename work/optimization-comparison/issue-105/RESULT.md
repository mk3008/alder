# Issue #105 結果：H5（2入口の必要性は判定保留）

合成の市民講座センターを使い、Oracle と Known Problem の平文 SHA-256 を Authoring 前に固定した。Plugin 0.2.6 で顧客・設計者対話を行い、資料外の断定2箇所を顧客指摘で修正。合成顧客が current-state を確認し、別 Fresh Evaluator の Authoring completion gate は **Pass**。業務設計書には役割別可否→月次 A/B/C 区分→当日の可否という根拠事実があるが、それを Problem とする評価や material open question はない。

| 入口 | 観測 |
| --- | --- |
| Known K | 事前固定した Problem から、役割別可否を活動予定へ引き継ぐ案と研修記録を共通参照する案に到達した。A/B/C の月次用途、研修の判定権限、当日の配置判断、異なる目的の確認を保持した。これは人間が Problem と認識済みという仮定の結果。 |
| Unknown U1 | Problem を渡さず、Oracle に対応する変換・逆変換を複数 Activity の根拠とともに観察した。別の両予定表の変更単位も仮説として提示した。機材実技と実機状態の確認、独立した案内表示確認を安易に統合・Problem 化しなかった。 |
| Human Confirmation | 合成顧客は A/B/C に人数編成上の現行用途があり、復元の手間・誤読も確認されていないとして Oracle 対応 Observation を**改善対象としなかった**。別の両表 Observation は事実不足として保留した。 |
| U3 | 人間の確認を得られず、事前 gate に従って未実行。K/U3 の同一 Problem・guidance を使った Optimization 収束は比較不能。 |

**独立評価の最終判定は H5**。Authoring が事実を記述し、Discovery が再検討機会を初めて観察するという境界はこの事例で見えた。一方、人間は改善対象を認めなかったので、Unknown → Human Confirmation → 同一 Problem の Optimization という連鎖は成立しない。H1 の2入口の必要性も、H3 の Discovery 不要も立証されない。専用 Structural Optimization の必要性も本事例からは示されない。

評価指示に Issue 本文の H1〜H5 定義を含め忘れ、独立評価の初回 raw は定義を独自解釈して H3 と記した。初回 raw は `evaluation-initial-raw.md` に保持した。元 Issue の事前定義を `hypotheses-from-issue.md` で渡し、同じ評価者が `evaluation-addendum-raw.md` で H3 を撤回して H5 と補正した。A〜F の観測事実は変えていない。この欠落と補完の時系列は再現記録に残す。

単一合成事例、各 arm 1回、手間や損失の実測なし。人間の拒否を覆す seed の追加や U3 の強制実行はしない。運用一般での発見率や候補の便益・費用対効果は推定できない。
