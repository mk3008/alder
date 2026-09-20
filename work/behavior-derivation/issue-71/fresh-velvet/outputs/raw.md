# 設定済み転送の実行：未記載条件の独立探索

対象版：`6b64e3b99845a315a394fee8e500564c3631e2af`（concepts.md 冒頭の固定版）。そのほかの5ファイルは提供された入力版。内容のハッシュは read-log.json に記録する。

適用範囲：設定済みの Transfer Setting を指定して実行し、Dirty Key を Work Item に固定化し、現在値・Active Black・転送モデルから判断して転送先と関連状態を更新する機能。業務相関レビューは完了済みとして扱う。PostgreSQL を実行環境とする確定済み共通前提を適用する。

**人間レビュー前の考慮候補。以下は候補・未承認 / 要確認であり、追加要件や確定した期待結果ではない。** 文書内の決定と、文書外の一般知識によって作った問いを分ける。網羅性は主張しない。

## 機能の短い把握

外部入力は対象 Transfer Setting と実行引数。実行が Transfer Run を作り、設定に属する Destination Link と Destination、Dirty Key Processing、Active Black、転送元の現在値を読む。Dirty Key を Work Item に固定化し、判定に従って黒伝・赤伝・物理削除・no-op を成立させ、必要な Lineage、Active Black、Dirty Key Processing を記録する。転送成功と処理済み記録の意味は規定されているが、複数の独立した作業のうち一部が失敗した際の実行全体の確定範囲までは示されていない。

## 文書外の知識を使った未記載論点

### FC-01：途中の失敗時に、別の source key の成功分を残すか

状態：**候補・未承認 / 要確認**。

対象機能：Transfer Execution の結果確定と、Transfer Run の実行全体の成否。

具体的な場面：1つの Transfer Run が独立した source key A と B を処理する。A の必要な全 Destination Link への反映と関連記録を完了できた後、B の転送先書き込みが制約違反などで失敗する。A と B の間には順序依存や一体性を要求する設定がなく、設定自体は実行中に変わらないとする。

人間から見た結果差：実行失敗後に A の転送先行・Active Black・必要な Lineage・処理済み記録が残る扱いと、A も残らず再実行対象になる扱いの両方が考えられる。再実行までの間に利用者が見られる反映範囲、および再実行時に除外される Dirty Key が異なる。

適用性を示す文書箇所：

- transfer-execution-process.md の `Transfer Execution Main` と `Record Processing Result detail`。
- concepts.md / transfer-execution / `dirty-key-processing-transfer-execution-record-work-item-2`：終わった Work Item の処理結果を記録する。
- concepts.md / dirty-key-processing / `destination-link-dirty-key-processing-transfer-run-record`：処理後に Dirty Key ID、Destination Link ID、結果、Run を記録する。
- concepts.md / transfer-run / `destination-transfer-run-lifecycle-state`：Run 状態は実行全体を表し、キーごとの処理結果ではない。
- concepts.md / duplicate-control / `not-define-db`：ロック、トランザクション、リトライ方式はここで定義しない。

既存判断で決まらない部分：個々の成功結果の整合、二重転送防止、Run 状態の意味は既決である。しかし「同一 Run に含まれる別キーが失敗したら、先行キーの完了も取り消されるか」は明示されていない。これは単にトランザクション構文を選ぶ話ではなく、利用者が失敗後に見る成果物を変える。複数宛先へ同じスナップショットを一貫して流す既決事項を緩める提案ではない。

発見に使った一般知識と推論：複数の書き込みを伴う処理は途中で失敗し得るという一般知識を使用した。外部資料による事実引用はない。そこから、この機能の複数キーの成果物について、失敗時の確定範囲が利用者に影響すると推論した。制約違反の特定の発生率や現在の実装の振る舞いは仮定していない。

最小限の選択肢と影響：

1. Run 内の転送成果物を全体として確定し、途中失敗時には A の成果物も残さない。利用者が部分反映を見ない保証が得られる一方、再実行では A も再処理する必要がある。
2. 完了した独立キーの成果物と関連記録を残し、Run 全体は失敗として区別する。成功済み部分を再転送せず進められる一方、「実行失敗＝反映なし」にはならず、未完了部分を識別できる必要がある。

どちらでも、個々の成功結果には既定の Active Black・Lineage・処理済み記録の意味を保ち、Dirty Key を書き換えず、再実行で同じ転送を二重に成立させない。Run の失敗状態だけで部分成果の有無を誤認させない扱いが必要かも、この選択に従って具体化する。成功した赤伝だけを残して訂正の新黒を落とすといった、同一キー内の部分成功を許す案は本候補に含めない。

追加仮定：1 Run が複数キーを処理し、その一部だけで書き込みが失敗する利用状況。件数上限や具体的な回復 API は未提示のため仮定しない。

判断先：失敗時に残る反映範囲を保証するなら Business Design へ戻して人間が確定する。選択後のロックや SQL の方式は後続設計とする。

### FC-02：設定更新と実行が重なる場合、どの設定版で1回の実行を成立させるか

状態：**条件付き候補・未承認 / 要確認**。

対象機能：実行時に参照する Transfer Setting・Destination Link と生成済み SQL の組の境界。

具体的な場面：転送を開始した時点では mapping v1 が設定されている。source key A を処理した後、実行とは別の設定更新により mapping v2 と対応する生成済み SQL が有効になり、その後に source key B を処理する。転送モデル、source key、destination row key の意味は変更しない。例えば同じ数値列について既存の単位変換係数の設定が更新された状況とする。各キーについては、すべての宛先をそのキーに適用する設定の整合した組で処理する。

人間から見た結果差：A も B も開始時の v1 に従う実行と、A は v1、B は v2 に従う実行では、同じ Run の出力値が異なる。設定更新を実行終了まで有効化しない運用も考えられる。いずれも、転送エンジンが設定内容を自ら変更する必要はない。

適用性を示す文書箇所：

- concepts.md / transfer-execution / `transfer-execution-setting-target-reference` および `destination-link-transfer-execution-setting-reference-belongs`：実行が設定とリンク群を参照する。
- concepts.md / transfer-execution / `not-destination-transfer-execution-setting`：実行は設定内容を変更しない。
- concepts.md / destination-link / `black-insert-transfer-update-destination-link-physical-delete`：mapping 依存の生成済み SQL はリンクに属し、設定・転送先・mapping の組み合わせで決まる。
- concepts.md / transfer-run / `transfer-run-trace-hold`：開始時引数を後から追跡する。
- concepts.md / work-item / `transfer-setting-context-trace-decide-work-item`：どの設定の文脈で判断したかを追跡する。

既存判断で決まらない部分：設定の参照先と責務、開始時引数の保存は定まっているが、設定を1 Run 全体で固定するか、処理の区切りで更新を取り込むか、実行との重なりを許さないかは記載されていない。「実行が設定を変更しない」ことから「他主体も更新しない」ことは導けない。一方で、実行中更新が可能であるとも入力文書だけからは断定できない。

発見に使った一般知識と推論：設定を読む長時間処理と設定更新が時間的に重なるシステムでは、読み取る時点によって設定値が変わり得るという一般知識からの条件付き推論。外部資料による引用ではない。Velvet にオンライン設定変更機能が実在するという主張ではない。

最小限の選択肢と影響：

1. 重なりを禁止・調整するか、開始時の整合した設定一式を使い切ることで、1 Run に適用する設定を固定する。Run 単位で結果を説明しやすい一方、変更の反映が次回以降になる。
2. 完了済みキーを再処理せず、後続の作業単位から整合した新設定を使うことを許す。同一 Run の結果が設定変更をまたぐため、どの作業にどの設定が適用されたかを説明できる契約が必要か確認する。

設定と生成済み SQL の不整合な組を実行してよいという選択肢ではない。また、既決の転送モデル変更の migration-level decision を回避する提案でもない。

追加仮定：実行中にも設定更新またはデプロイによる設定の有効化が許される環境。この環境がないと確認できれば、本候補は適用なしで閉じられる。設定編集機能を今回新設する要求ではない。

判断先：まず利用環境として更新と実行の重なりを許すか確認する。許す場合に人間が結果の境界を選び、Business Design へ反映する。具体的な版管理方式やロック方式自体は通常の技術設計に残す。

## 文書内の導出・既決として閉じた論点

| 論点 | 文書から決まる結果・根拠 |
|---|---|
| 同一キーへの再通知をイベント順に再生すべきか | Dirty Key は変更通知であり操作ではない。`dirty-key/responsibility-b2adcf08`、`dirty-key/dirty-key-transfer-management-2` は時刻・シーケンスによる順序保証を否定し、`transfer-target-decision/immutable-no-source-no-active-black-is-no-op` はイベント逐次再生をしないと明記する。再質問しない。 |
| 並行・再実行で同じ状態の黒伝を二重に作ってよいか | `black-transfer/black-transfer-destination-link-setting-source-context-state-2` が二重転送を禁止し、`active-black/unique-per-context` が文脈ごとに最大1つと定める。競合時にもこれを守るのは既存要件の展開。ロック方式の未指定を新業務要件としない。 |
| 処理中に後続通知が追加されることを考慮するか | `dirty-key/dirty-key-management-transfer` と `dirty-key/dirty-key-transfer-management` が継続追記と長時間妨害しない前提を明記。`work-item/dirty-key-transfer-execution-change-detection-history-target` による対象固定化も既決。固定化手段だけは候補化しない。 |
| 同じ元データを複数宛先へ別々の値で送ってよいか | `destination-link/destination-link-source` と `destination-link/destination-link-transfer-setting-source-reference-produce-distinguish` は同じスナップショットを一貫して流すと記載。宛先ごとの任意再読みによる値ずれを選択肢にしない。 |
| 初回前に元行が消えた immutable / insert_only を永久保留するか | `transfer-target-decision/immutable-no-source-no-active-black-is-no-op` と `insert-only-no-source-no-active-black-is-no-op` で no-op と処理済み化、再出現は新 Dirty Key による評価が確定。 |
| insert_only の既存行を更新・削除するか | `transfer-target-decision/insert-only-active-black-is-no-op` により現在値や存在にかかわらず no-op。 |
| 日付補正前後のどちらで差分を見るか | `transfer-target-decision/ignored-columns-only-is-no-transfer` が補正後の保持値で判断することを確定。元日付列が明示的にある場合も規定済み。 |
| 締め後の補正を拒否にするか、mutable に許すか | `posting-date-lower-bound/destination-row-2` は最小許可日への補正、`destination-posting-date-lower-bound-mutable-transfer-model` は mutable でエラーと確定。 |
| 赤伝を現在の元行から作るか | `red-transfer/red-transfer-destination-row-source-black-target-reference` により転送先の元黒から生成する。Active Black と Lineage の意味も既決。 |

## 見送り・入力上の留意点

- CDC の通知漏れ、集計の再評価キーの発見、外部 producer の登録方式は、今回完了済みとされた業務相関や明示された外部責務に戻るため、候補として提案しない。外部 producer の正しさをこの探索で検証したという意味ではない。
- 外部利用者が転送先行を直接変更・削除した場合の修復は、そうした更新が許される利用環境が未提示であるうえ、転送先の業務意味へ踏み込むため今回は提案しない。既存の転送成功・Active Black・Lineage の保証を緩める判断ではない。
- NULL 比較や型変換の SQL をどの形で書くかは `transfer-target-decision/not-column-comparison-expression` の非責務。具体的な利用型・期待する値の同一性について別扱いが必要な例が今回の入力から定まらず、一般的な項目名だけで候補にしない。
- `destination/destination-has-transfer-model-yaml-immutable-mutable` は値を immutable / mutable と記す一方、他の多数の明示的 statement は insert_only を定義する。これは入力内の表記整合の論点であり、新たな外部知識由来の候補ではない。この探索では insert_only の具体的な確定規則を尊重し、モデルの採否を問い直していない。
- 障害回復の SQL、トランザクション分割、キャンセル API、監視・保持期間・性能目標の一般棚卸しは行わない。FC-01 の結果境界を決める前に実装手段を要件化しない。

候補を採用する場合は、人間が意味・保証を Business Design に確定してから Interface / Check 等へ展開する。未承認のままアサーションやテスト期待値へ変換しない。
