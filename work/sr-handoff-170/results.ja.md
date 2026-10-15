# 提供済みSRの引き継ぎ：実装と回帰確認

2026-10-06 / [Issue #170](https://github.com/mk3008/alder/issues/170) / [Draft PR #171](https://github.com/mk3008/alder/pull/171)

## 結果

提供済みSystem Requirements（SR）のsource・revision・適用範囲をFreshな独立実装レビューへ渡す最小変更を実装した。SRの作成・妥当性・完全性はプロダクト側に残す。実装レビューSkill、read-only stage、follow-upのstale確認、canonical adoptionとその3つのpackage copies、README日英の入力・役割説明を揃えた。新しいNFRチェックリスト、SR Check台帳、Risk分類、人間ゲートは追加していない。

新たな手法の有効性比較ではなく、採用済み境界の実装確認である。版番号は0.4.4を保持し、release・install・mergeはしていない。

## 固定入力と再現

- 基準main: `318058920c07249468d7e9d4be88c87f51602e4f`。README #165マージ後のtree `a9e128797c0d7205e1938345af5e8e0334a2d429`とcheckoutの一致を確認した。
- canonical source公開commit: `b9ac9a3b44a02790f03a77b1b8d128934be06636`。
- package同期・fixture公開commit: [`a3a824eedb3ad4a0ebc648de615e0ca88278035f`](https://github.com/mk3008/alder/tree/a3a824eedb3ad4a0ebc648de615e0ca88278035f)。公開commitとfixture本文を再取得してからFreshを開始した。tree `c3649b7ceb0f9b7888555c03c84b9875aa9ae184`も一致した。
- [protocol](protocol.md)の通り各caseを別directoryへ抽出し、9つの別contextを履歴forkなしで実行。C08へ実行logを渡さず、C03はReceiptTestsの結果だけを有効とした。C04の過去レビューは合成のscenario事実である。
- 各caseの[runs](runs/)に完全なdispatch/read prompt、入力hash、要求設定、agent識別子、raw結果を保存。要求はgpt-6-sol / medium / fork none。実効runtime設定の独立証明はない。C01–03は終了後、同じ結果の保存だけを依頼し、再レビューはしていない。
- 入力とrawは公開安全性を確認した合成例。顧客データ、秘密、private URLを含まない。閲覧制約は指示によるものでOS隔離ではない。

## 9ケースの観測

評価は各raw結果が固定された後、[expected outcomes](expected-outcomes.md)と照合した。表はcoordinatorの評価であり、rawと区別する。

| Case | 確認した挙動 | 評価 |
| --- | --- | --- |
| [C01](runs/C01/raw.md) | 未提供SRを適用外とせず未確認。BD/Checkは継続し、技術要件の保証が必要なときだけ所在・範囲を確認 | 期待した境界を確認 |
| [C02](runs/C02/raw.md) | 名前と版がある読取不能SRを、未提供・適用外と区別。権限回避や内容の推測なし | 期待した境界を確認 |
| [C03](runs/C03/raw.md) | receiptに適用外というSR-C-1の範囲を保持。無関係なbackupやstorageを要求せず、指定テストだけを評価 | 期待した境界を確認 |
| [C04](runs/C04/raw.md) | SR-D-1→D-2のWAL変更を認識。旧in-memory実行を新しいstorage保証へ流用せず、影響範囲を再レビューへ。receipt記録は継続可能 | 期待した境界を確認 |
| [C05](runs/C05/raw.md) | 「reference identifier」の二解釈を保持。明確な実装違反と断定せず、cross-partnerへの影響と最小の意味確認を返した | 期待した境界を確認。確認先をbusiness/product ownerと表現し、SR owner単独の用語確認とは分けきっていない |
| [C06](runs/C06/raw.md) | BD/CHK-02とSR-F-1の明確な衝突を両方引用。SRで業務意味を上書きせず、責任者へ返し、CHK-01/03の評価を継続 | 期待した境界を確認 |
| [C07](runs/C07/raw.md) | 業務保証と許されたSQLite/PK手段を区別。余分なarchitecture・文書・承認要求なし | 期待した境界を確認 |
| [C08](runs/C08/raw.md) | static整合、未実行テスト、restore実証不足を分離。他caseのpassを流用せず、失敗・実データ損失とも断定しない | 期待した境界を確認 |
| [C09](runs/C09/raw.md) | PostgreSQL制約と提出されたSQLite実装の確定違反。業務意味変更や新しい業務承認を要求せず技術修正へ返した | 期待した境界を確認 |

C04のWAL不一致はコード読解上の判断であり、file-backed実行で再現したという主張ではない。C08が呼んだoperational gateはfixtureのSRに明記されたrehearsal条件であり、Alderが追加した一般ゲートではない。9例を通した結果から、実プロダクトでの網羅性・信頼性・検出率改善を主張しない。

## 機械検証

- 既存exporterで公開sourceから3 skillを同期し、`--check`成功。
- Package関連5 suites: 28 tests成功。追加のSR handoffテストは配布文面の契約を確認するもので、LLM挙動の証明ではない。
- Business Graph: 44 tests成功。
- Drift: 12 tests、evaluator 26 scenarios成功。変更していない既存経路の回帰確認。
- Synthetic fixture: 3 tests成功。Python 3.12.14 / SQLite 3.53.1、in-memory実行のみ。[実行logとsource hashes](inputs/execution.txt)。
- Diff whitespace成功。READMEの見出し・画像参照・既存成果物説明の不変を差分で確認。
- 入力commitのGitHub Actions: [Plugin package](https://github.com/mk3008/alder/actions/runs/37482202176)、[release validation](https://github.com/mk3008/alder/actions/runs/37482202179)成功。release workflow名は公開を意味しない。CodeRabbitはDraftのためreview skipped。

## 独立差分レビュー

履歴forkなしの別Fresh agentによる[実装全体のread-only監査](implementation-audit.md)で、blocking findingなし。対象は公開head `a3a824eedb3ad4a0ebc648de615e0ca88278035f`。監査者は9caseのrawを読まず、変更差分・package・fixtureの構造を確認した。要求モデルはgpt-6-sol / medium、実効設定の独立証明なし。agent識別子は `/root/implement_system_requirements_handoff/audit_sr_handoff_implementation`。監査後の追加は本結果・原文・prompt・hash等の証拠記録のみで、製品guidance/README/package/fixture入力は変更していない。

## 限界と次の判断

各caseは1回の合成回帰で、同じモデル系の小規模例。実clientのSkill自動routing、実環境のSR探索、実運用のRTO/RPO、ユーザー負荷、要件完全性を検証していない。制御済みの既知入力に対する境界確認であり、未知の不具合を網羅して検出できるとはしない。

研究 #168の採否と本実装は分離した。独立差分レビューを完了し、最終commitの検証を経て結果を返す。merge判断は人間に残す。
