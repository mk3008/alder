# 工具の返却受付のチェック項目（試験用の模擬レビュー反映版）

事前固定された試験用の模擬人間レビューを、同じチェック項目リストへ反映しました。**TR-01〜TR-09 は、今回の固定範囲について確認済み（模擬）** です。これは試験内の状態であり、実際のユーザーによる業務承認や本番の受入れを示しません。未決事項は確認済みの期待結果と分けて残しています。

## 入力版・適用条件

- 対象 Business Design: `docs/business-design/tool-return.md`（138 行、SHA-256: `ef86b2225a1479e64cb8f138fd073e4c789559b7e13e16add8bf8dd2d2f4cdd2`）。試験用の模擬合意版。初稿時の版 `687f04cc6848d9b3daeef36bbe03c45eff5bd985c91abc4db169fcb1bc3124f4` から冒頭の合意状態表示が更新され、業務本文・未決事項は保持されています。
- 反映した模擬人間レビュー: `docs/decisions.md`（SHA-256: `402a106decdd3581cf3f949755ac52ae3b5e0627dbf38f5acbc65a636df91806`）。同ファイルの「模擬Checkレビュー」は、更新前 Check 草案の正確な版と TR-01〜TR-09 の条件・期待結果を対象にした試験入力です。実際のユーザーによる業務承認ではありません。
- 整合性レビュー: `../evidence/10-check-review.md`（SHA-256: `b8fbab2ae2a6e0f6a135608c1a82682be88b8143a10cd1d89c4b77e60b8aa650`）。指摘のうち、承認された TR-08 の表現調整を反映し、余剰・置換等は未決として残します。このレビュー自体を確認済みの根拠にはしません。
- 初稿の来歴: 補足入力 `../evidence/simulated-feedback.md`（SHA-256: `d22a536ff015811d28a1566fb162d0381b305e2dedf8113fc702ad1d8aac5a94`）の参照を保持します。今回の更新では再読せず、上記の現行 Business Design と項目別の模擬レビューを適用しています。
- 対象: 登録済みの地域住民による工具の返却受付。対象の貸出について、照合に必要な工具番号と、その貸出で渡した付属品一覧が貸出・返却記録にある範囲です。
- 固定された照合・受領条件だけを Check にしています。付属品の余剰・置換など未決の入力、未確認の担当・通知・保管責任、要確認後の調査・再受付、明示保留の物理的引渡しは今回の実装範囲に含めず、後述の別枠に残します。
- 版: 模擬レビュー反映 v2 + Test 証拠更新 e1。更新前 Check v1 の SHA-256 は `a366d2a44ff1fbc75384b829e695c49a4f40e138b8a09ef1f82fdfa4510f9e47`、証拠更新前 v2 は `f5003361c073f3a17dfa3389ed6ef89ec3103c1185d0d6ae51e29aa1ceb08351`。既存 ID `TR-01`〜`TR-09` と業務意味・模擬レビュー状態を保持し、Test 対応と証拠だけを追加。Check の追加・削除・分割・統合はありません。
- 確認範囲: TR-01〜TR-09 の既存の条件・期待結果を保持し、未レビューから確認済み（模擬）へ更新。TR-08 のタイトルだけを、明示された表現調整の許可に従って変更しています。合意状態と Test 証拠は別です。
- 未決の問い: 役割分担は `BD-Q01`、通知・保管は `BD-Q02`、要確認後の調査・再受付は `BD-Q03`、付属品の余剰・置換等は `BD-Q04`。すべて未決・範囲外として保持し、今回再判断を求めません。
- Functional Interface は追加せず、Business Design → Check → Test の直接対応を用います。

## 確認済みの項目（模擬） — Activity「返却受領」

| ID | タイトル | 期待結果 | レビュー状態 |
| --- | --- | --- | --- |
| TR-01 | 番号と付属品が一致した組を受領できる | 対象の貸出記録にある工具番号と付属品一覧に、返却される組の番号と付属品が一致すると、返却受領が確定する。 | 確認済み（模擬） |
| TR-02 | 受領した貸出の返却日時を記録できる | 一致を確認して初めて受領を確定した貸出について、返却日時が貸出・返却記録に記録される。 | 確認済み（模擬） |
| TR-03 | 受領した組が点検待ちになる | 受領済みの組が点検待ちになる。 | 確認済み（模擬） |
| TR-04 | 受領直後の組はまだ貸出できない | 返却受領が確定した段階では、その組は貸出可能にならない。 | 確認済み（模擬） |
| TR-05 | 番号不一致・付属品不足では受領を確定しない | 工具番号が一致しない、またはその貸出で渡した付属品が不足する場合、返却受領を確定しない。 | 確認済み（模擬） |
| TR-06 | 番号不一致・付属品不足では返却日時を記録しない | 工具番号が一致しない、または付属品が不足する受付では、返却日時の記録を行わない。 | 確認済み（模擬） |
| TR-07 | 番号不一致・付属品不足では点検待ちへ変更しない | 工具番号が一致しない、または付属品が不足する受付では、その組を点検待ちへ変更しない。 | 確認済み（模擬） |
| TR-08 | 番号不一致・付属品不足を窓口へ要確認として返す | 工具番号が一致しない、または付属品が不足する受付結果が、窓口へ要確認として返される。 | 確認済み（模擬） |
| TR-09 | 同じ貸出を再処理しても最初の返却日時は変わらない | 受領済みの同じ貸出を再処理しても、貸出・返却記録にある最初の返却日時が保持される。 | 確認済み（模擬） |

## 同じ ID に対応する詳細

### 共通条件と読み方

- 根拠の行番号は、上記 SHA-256 で固定した Business Design を指します。初稿の模擬フィードバックは設計へ反映された条件の来歴として扱います。今回の模擬レビューは既存項目の確認状態と許可された表現だけに反映し、設計にない期待結果を追加する根拠にはしません。
- 全 Check の Activity は「返却受領」。契機は工具の返却受付時（100〜110 行）。作業主体の「返却受領担当」は仮称であり、権限・責任者は確定していません（17、29、104〜106 行）。特定の職種、権限、承認段階は補いません。
- 照合する入力は、返却される組の工具番号・付属品と、対象の貸出で記録された工具番号・付属品一覧です（7〜8、114〜121 行）。別の貸出の一覧によって照合条件を満たすことにはしません。
- 下記「高」は、期待結果を文書から導ける確度です。実際の人間による業務承認、Check の人間レビュー、網羅性を表しません。
- Test 証拠: 下記の各 ID で意味を照合した Test/assertion に対応済み（mapped）。静的な assertion 確認と実行成功は別々に確認しました。初回の独立レビューは元20 Test を対象とし、後続の技術的補強後に現在の21 Test を再発見・実行しています。正確な版・実行記録と限界は「Test 証拠の版と実行履歴」を参照してください。模擬レビュー状態や業務承認は Test 成功から変更しません。Code、SQL 入口、実装 symbol・行への恒久的な対応表は作りません。

<a id="tr-01"></a>

### TR-01 — 番号と付属品が一致した組を受領できる

- 条件・入力: 共通の対象範囲で、対象の貸出に記録された工具番号と、その貸出で渡した付属品一覧に、返却された組の番号と付属品が一致する。
- 期待結果: 返却受領が確定する。
- 根拠: 9 行「一致した場合だけ返却受領を確定」、39 行の対象範囲、121〜122 行の照合と受領、138 行の Result。
- 導出分類: 明示。AI 確度: 高。レビュー優先度: 優先。
- 代表場面: 番号と付属品の両方が一致する受付。照合方法の画面・データ構造、余分な付属品の扱い、数量や同一性の新しい定義は補わない。
- 関連・接続: 前段で作られた貸出情報を入力として用いるが、貸出処理自体は対象外。受領後の個別結果は TR-02〜TR-04、不成立は TR-05〜TR-08。再処理で時刻を変えてよいとは導かず、TR-09 を適用する。

- Test 対応（mapped、静的照合・最終実行済み）: `test_tool_return.ReturnReceptionTests.test_matching_return_is_confirmed`、`test_tool_return.ReturnReceptionTests.test_selected_loan_is_the_comparison_source`。
- Assertion と証拠の限界: 一致する組の受付で `status == CONFIRMED` と受領確認フラグを確認。別の選択貸出でもその貸出の記録を照合元として受領し、非対象貸出が変わらないことを確認。余剰・置換等には適用しない。

<a id="tr-02"></a>

### TR-02 — 受領した貸出の返却日時を記録できる

- 条件・入力: TR-01 の一致条件を満たし、対象の貸出の返却受領が初めて確定する。
- 期待結果: その貸出の返却日時が貸出・返却記録に記録される。
- 根拠: 9 行の記録先、18 行の記録の範囲、72〜74 行の情報、123 行の Procedure、133 行の Output、138 行の保持結果。
- 導出分類: 明示。AI 確度: 高。レビュー優先度: 通常。
- 代表場面: 初回の一致受付後に、対象の貸出に返却日時がある。具体的な時刻取得方法、精度、タイムゾーンは定めない。
- 関連・接続: TR-01 の受領事実を記録へつなぐ。再処理は TR-09。貸出情報の作成・更新一般はこの Check の保証に含めない。

- Test 対応（mapped、静的照合・最終実行済み）: `test_tool_return.ReturnReceptionTests.test_first_receipt_records_time_on_selected_loan`、`test_tool_return.ReturnReceptionTests.test_time_is_normalized_to_utc`。
- Assertion と証拠の限界: 初回一致受付で対象貸出に指定時刻が記録され、別貸出が不変であることを確認。タイムゾーン違いでも同じ時点・UTC・マイクロ秒を保持する assertion は、システム試験条件の技術的補助であり、Check にタイムゾーン方針を追加しない。

<a id="tr-03"></a>

### TR-03 — 受領した組が点検待ちになる

- 条件・入力: 番号・付属品の一致を確認し、対象の組の返却受領が確定している。
- 期待結果: その受領済みの組が点検待ちの業務状態になる。
- 根拠: 10、19 行、57 行、124 行、134 行、138 行。
- 導出分類: 明示。AI 確度: 高。レビュー優先度: 通常。
- 代表場面: 一致受付を終えた組の点検待ち状態を確認する。
- 関連・接続: 点検待ちという後続業務向けの状態までを扱う。整備担当への通知済み・物理的な引渡し済み・実際の点検開始可能性のすべてを保証しない（25、30、138 行）。貸出不可の独立した保証は TR-04。

- Test 対応（mapped、静的照合・最終実行済み）: `test_tool_return.ReturnReceptionTests.test_received_group_waits_for_inspection`。
- Assertion と証拠の限界: 一致受付後の `inspection_pending` が true であることを確認。通知・保管・物理的引渡し・実際の点検開始はこの assertion の対象外。

<a id="tr-04"></a>

### TR-04 — 受領直後の組はまだ貸出できない

- 条件・入力: 対象の組について、返却受領が確定した段階。
- 期待結果: その組はまだ貸出可能ではない。
- 根拠: 10、19 行、58 行、124 行、134 行、138 行。
- 導出分類: 明示。AI 確度: 高。レビュー優先度: 通常。
- 代表場面: 一致受付後も、その組が貸出可能になっていない。
- 関連・接続: TR-03 と同じ組を扱うが、人が独立して確認できる禁止として分離。点検後にいつ・誰が貸出可能へ変更するかは対象外であり、永続的な貸出禁止を意味しない。

- Test 対応（mapped、静的照合・最終実行済み）: `test_tool_return.ReturnReceptionTests.test_received_group_is_not_available_for_loan`、`test_tool_return.ReturnReceptionTests.test_matching_return_clears_artificial_available_sentinel`。
- Assertion と証拠の限界: 元の Test は一致受付後の貸出可能フラグが false であることを確認するが、初期値も false のため代入漏れを単独では検出できない。追加 Test は人工的な技術検出用 sentinel として true を設定し、一致受付の `CONFIRMED` と受付後の厳密な false を確認する。この初期値を正当な現実の貸出状態、新しい業務前提、貸出方針とは扱わない。後続の限定 mutation 検証では当該代入を省くと元20件は成功し、追加 Test だけが失敗した（後述の実行履歴）。

<a id="tr-05"></a>

### TR-05 — 番号不一致・付属品不足では受領を確定しない

- 条件・入力: 返却される工具番号が対象の貸出の番号と一致しない、または、その貸出で渡した付属品が不足する。
- 期待結果: この受付で返却受領を確定しない。
- 根拠: 9 行の「一致した場合だけ」、11、39、128 行の Exception。
- 導出分類: 明示。AI 確度: 高。レビュー優先度: 優先。
- 代表場面: 番号のみ不一致／番号は一致して付属品不足／両方が不成立。いずれも同じ不確定結果となるため一つの Check にまとめる。
- 関連・接続: TR-06〜TR-08 はこの不成立時の独立した記録・状態・返却先の保証。どの担当者が例外受領を許可できるかという新しい権限は定めない。

- Test 対応（mapped、静的照合・最終実行済み）: `test_tool_return.ReturnReceptionTests.test_failed_reception_does_not_confirm_receipt`、`test_tool_return.ReturnReceptionTests.test_mismatching_reprocessing_keeps_existing_time_and_state`。
- Assertion と証拠の限界: 番号のみ不一致、純粋な不足、両方、付属品全欠落の4場面で、今回の結果が `CONFIRMED` ではなく、未受領の対象が受領済みにならないことを確認。受領後の不一致再処理では今回の結果が `NEEDS_REVIEW` で、過去の受領確認は保持される。過去の受領を取り消す意味に拡張しない。

<a id="tr-06"></a>

### TR-06 — 番号不一致・付属品不足では返却日時を記録しない

- 条件・入力: TR-05 と同じ不成立条件。
- 期待結果: この受付による返却日時の記録を行わない。
- 根拠: 11 行「返却日時…の変更も行わない」、39 行、128 行「返却日時を記録せず」。
- 導出分類: 明示。AI 確度: 高。レビュー優先度: 優先。
- 代表場面: TR-05 の各不成立場面で、返却日時の記録が行われないことを確認する。
- 関連・接続: 「返却日時を空にする」という削除処理や、全データを一律無変更にする保証ではない。受領済みの同じ貸出の最初の日時保持は TR-09。

- Test 対応（mapped、静的照合・最終実行済み）: `test_tool_return.ReturnReceptionTests.test_failed_reception_does_not_record_return_time`、`test_tool_return.ReturnReceptionTests.test_mismatching_reprocessing_keeps_existing_time_and_state`。
- Assertion と証拠の限界: 同じ4不成立場面で未記録の返却日時が None のままであることを確認。すでに受領した対象では後日の不一致再処理でも最初の日時が同一オブジェクトのまま保持される。今回の記録禁止を既存日時の削除と読み替えない。

<a id="tr-07"></a>

### TR-07 — 番号不一致・付属品不足では点検待ちへ変更しない

- 条件・入力: TR-05 と同じ不成立条件。
- 期待結果: この受付によって、その組を点検待ちへ変更しない。
- 根拠: 11、39、128 行の「点検待ちへの変更も行わない」。
- 導出分類: 明示。AI 確度: 高。レビュー優先度: 優先。
- 代表場面: TR-05 の各不成立場面で、点検待ちへの変更が行われないことを確認する。
- 関連・接続: 点検待ち以外の新しい状態を作らない。「常に点検待ちではない」とも拡張せず、指定された変更禁止を扱う。TR-08 の要確認は窓口へ返す結果。

- Test 対応（mapped、静的照合・最終実行済み）: `test_tool_return.ReturnReceptionTests.test_failed_reception_does_not_set_inspection_pending`、`test_tool_return.ReturnReceptionTests.test_mismatching_reprocessing_keeps_existing_time_and_state`。
- Assertion と証拠の限界: 同じ4不成立場面で、未受領・点検待ち false の対象は false のまま。別の既存 Test では受領済み・点検待ち true の対象が不一致再処理後も true のままであることを確認。両 Test はそれぞれの fixture 文脈で false/true の双方を扱う。初回レビューの追加強化候補は確定した証拠不足や欠陥を意味せず、この更新で新しい TR-07 Test は要求しない。全ての将来状態や副作用一般の不変性には拡張しない。

<a id="tr-08"></a>

### TR-08 — 番号不一致・付属品不足を窓口へ要確認として返す

- 条件・入力: TR-05 と同じ不成立条件。
- 期待結果: 窓口へ要確認という受付結果を返す。
- 根拠: 11、20、31、39 行、88 行の窓口の情報、128〜129 行の Exception。
- 導出分類: 明示。AI 確度: 高。レビュー優先度: 優先。
- 代表場面: TR-05 の各不成立場面で、窓口が要確認の結果を受け取れる。
- 関連・接続: 受取先としての窓口まで。通知媒体、エラー形式、調査担当、再受付の条件・手順を決めない。未確認の責任分担は BD-Q01、以後の手順は BD-Q03。

- Test 対応（mapped、静的照合・最終実行済み）: `test_tool_return.ReturnReceptionTests.test_failed_reception_returns_needs_review_to_counter`。
- Assertion と証拠の限界: 同じ4不成立場面で `status == NEEDS_REVIEW` と `recipient == 窓口` の両方を確認。呼出し元へ返る値の証拠であり、外部通知の配送、調査完了、再受付成功の証拠ではない。

<a id="tr-09"></a>

### TR-09 — 同じ貸出を再処理しても最初の返却日時は変わらない

- 条件・入力: すでに返却受領が確定し、最初の返却日時が記録されている同じ貸出を再処理する。
- 期待結果: 貸出・返却記録にある最初の返却日時を上書きせず保持する。
- 根拠: 12、39、123、138 行の同一貸出の再処理・最初の日時保持。
- 導出分類: 明示。AI 確度: 高。レビュー優先度: 優先。
- 代表場面: 初回の受領・記録後に同じ貸出を再処理し、最初の日時が残る。
- 関連・接続: 初回記録は TR-02。同じ貸出の特定手段は規定しない。返却日時以外の全副作用が一切起きない、再処理の応答内容、別貸出への同じ工具の再貸出時の動作は導かない。

- Test 対応（mapped、静的照合・最終実行済み）: `test_tool_return.ReturnReceptionTests.test_matching_reprocessing_preserves_first_return_time`、`test_tool_return.ReturnReceptionTests.test_mismatching_reprocessing_keeps_existing_time_and_state`。
- Assertion と証拠の限界: 最初の一致受付後、後日・過去日時を与えた一致再処理の双方で、最初の返却日時が同一オブジェクトのまま保持される。不一致再処理の4場面でも保持される。全副作用の冪等性や応答全般は保証しない。

## Test 証拠の版と実行履歴

- この証拠更新は、独立した実装レビュー後の限定的な記録保守です。新しい業務判断や実装受入れは行いません。上記の同一 Business Design と模擬 Check v2 の条件・期待結果を基準にしています。[Business Design](../business-design/tool-return.md) → 各 Check 詳細 → Test ID と、下表の Test ID → Check 詳細 → Business Design の両方向を辿れます。
- 元の独立レビュー: `../../../evidence/13-implementation-review.md`。Check SHA-256 `f5003361c073f3a17dfa3389ed6ef89ec3103c1185d0d6ae51e29aa1ceb08351`、元 Test SHA-256 `4dfd53ba191ef48b6af4d7c891171905b104239fe5385208ad2845bc2a963d1d` に対する20件成功。このレビューの対象を21件へ遡及拡張しません。
- 後続の技術的補強: `../../../evidence/14-regression-strengthening.md`。TR-04 の人工 sentinel Test を1件追加。代入を省く限定 mutation は元20件では検出されず、補強後21件では新 Test だけが失敗。実装は変更されていません。
- 現在の Test: [tests/test_tool_return.py](../../tests/test_tool_return.py)、SHA-256 `0ff16b58155d6d0c6f30a9261bdd5c35519b800880612db41764a40a773ce5c7`。runner-discovered ID は `../../../evidence/15-test-ids.json` に21件を保存。静的に実際の assertion を確認した上で、workspace から `PYTHONDONTWRITEBYTECODE=1 python run_tests.py` を実行し、21件成功・失敗0・エラー0・終了0を観測しました。
- 実行対象の実装スナップショット SHA-256: `0980f2f430f217f22b7494958c61c474817c440e23166cdc6d40c4586df0b7a1`。runner SHA-256: `7778146810d410f9758d49f8310f023fe68d204b990c8dd92894a7c3e451a0f1`。これらは実行版の固定であり、Check と実装位置の恒久対応ではありません。
- 正確なコマンド・stdout・stderr・終了値は `../../../evidence/15-commands.json` と `15-final-tests.*`、独立 discovery の結果は `15-discovery.*` に保存。更新前後 Check の完全なスナップショットと SHA-256・意味保持監査は `15-checks.before.md`、`15-checks.after.md`、`15-invariants.json` を参照。
- 証拠の範囲は合成データのローカル in-memory fixture です。外部通知、実際の責任主体、物理的な引渡し、永続化・並行処理・中断後復旧、本番運用への証拠はありません。BD-Q01〜04 と明示保留を解消しません。

### Test → Check の逆引き

以下の ID は全て今回の runner discovery に存在します。Check に対応する Test は、その詳細にある assertion と限界を合わせて読みます。技術的補助・境界 Test は業務期待結果の追加承認になりません。

| Runner Test ID | 対応・位置づけ |
| --- | --- |
| `test_tool_return.ExampleBoundaryTests.test_empty_issued_list_is_not_given_new_business_meaning` | 技術的入力・fixture 境界。承認済み Check への業務合否対応なし |
| `test_tool_return.ExampleBoundaryTests.test_extras_and_substitutions_have_no_business_outcome` | 技術的入力・fixture 境界。承認済み Check への業務合否対応なし |
| `test_tool_return.ExampleBoundaryTests.test_other_loan_accessories_are_not_used_as_fallback` | 技術的入力・fixture 境界。承認済み Check への業務合否対応なし |
| `test_tool_return.ExampleBoundaryTests.test_repeated_accessory_labels_do_not_define_quantity_policy` | 技術的入力・fixture 境界。承認済み Check への業務合否対応なし |
| `test_tool_return.ExampleBoundaryTests.test_unknown_loan_is_outside_the_fixture` | 技術的入力・fixture 境界。承認済み Check への業務合否対応なし |
| `test_tool_return.ReturnReceptionTests.test_failed_reception_does_not_confirm_receipt` | [TR-05](#tr-05) |
| `test_tool_return.ReturnReceptionTests.test_failed_reception_does_not_record_return_time` | [TR-06](#tr-06) |
| `test_tool_return.ReturnReceptionTests.test_failed_reception_does_not_set_inspection_pending` | [TR-07](#tr-07) |
| `test_tool_return.ReturnReceptionTests.test_failed_reception_returns_needs_review_to_counter` | [TR-08](#tr-08) |
| `test_tool_return.ReturnReceptionTests.test_first_receipt_records_time_on_selected_loan` | [TR-02](#tr-02) |
| `test_tool_return.ReturnReceptionTests.test_matching_reprocessing_preserves_first_return_time` | [TR-09](#tr-09) |
| `test_tool_return.ReturnReceptionTests.test_matching_return_clears_artificial_available_sentinel` | [TR-04](#tr-04)（人工 sentinel による技術的補強） |
| `test_tool_return.ReturnReceptionTests.test_matching_return_is_confirmed` | [TR-01](#tr-01) |
| `test_tool_return.ReturnReceptionTests.test_mismatching_reprocessing_keeps_existing_time_and_state` | [TR-05](#tr-05), [TR-06](#tr-06), [TR-07](#tr-07), [TR-09](#tr-09) |
| `test_tool_return.ReturnReceptionTests.test_naive_time_is_rejected_before_mutation` | 技術的入力・fixture 境界。承認済み Check への業務合否対応なし |
| `test_tool_return.ReturnReceptionTests.test_non_datetime_is_rejected_before_mutation` | 技術的入力・fixture 境界。承認済み Check への業務合否対応なし |
| `test_tool_return.ReturnReceptionTests.test_received_group_is_not_available_for_loan` | [TR-04](#tr-04) |
| `test_tool_return.ReturnReceptionTests.test_received_group_waits_for_inspection` | [TR-03](#tr-03) |
| `test_tool_return.ReturnReceptionTests.test_selected_loan_is_the_comparison_source` | [TR-01](#tr-01) |
| `test_tool_return.ReturnReceptionTests.test_time_is_normalized_to_utc` | [TR-02](#tr-02)（UTC はシステム試験条件の技術的補助） |
| `test_tool_return.ReturnReceptionTests.test_timezone_without_offset_is_rejected_before_mutation` | 技術的入力・fixture 境界。承認済み Check への業務合否対応なし |

## 未決の項目 — Business Design へ戻す事項・明示保留

以下は Check の合否期待結果ではありません。既存の未確認事項と、整合性レビューで指摘された未決の範囲を記録したものであり、AI が新しい業務方針を採用していません。模擬レビューの明示的な範囲指定に従い、いずれも今回の実装範囲外です。今回の更新のために再質問しません。

### BD-Q01 — 受領と要確認受付の責任分担（要確認・優先）

- 根拠: 17、20、29、104〜106 行。実際の受領責任主体と窓口との分担が未確認。
- 確認する問い: 返却受領を確定する主体と、要確認結果を受け取る窓口は同じ担当ですか。それとも別担当ですか。
- 選択肢と影響: 同じ担当なら同一窓口内で両責任を持つ記述になる。別担当なら受領の責任と要確認結果を引き受ける責任を分けて記述する。いずれも役割・権限に関する Check を追加する前に Business Design で合意する。
- 本版への影響: TR-01〜TR-09 は特定担当の権限を保証せず、固定された業務結果だけを表す。

### BD-Q02 — 通知と保管の責任（要確認・継続保留）

- 根拠: 19、25、30、138 行。点検待ちの確定から通知済み・物理的引渡し済みを導けない。
- 選択肢と影響: 受付側が別途通知・保管を担う運用と、別担当がそれらを担う運用では、責任と後続開始条件が異なる。現在はどちらも採用しない。
- 本版への影響: TR-03 の期待結果は点検待ち状態まで。通知成功・保管完了を Check にしない。今回これらの決定を草案作成の条件にはしない。

### BD-Q03 — 要確認後の調査・再受付（要確認・継続保留）

- 根拠: 31、129 行。窓口へ要確認として返した後の担当・手順・再開条件は未確認。
- 選択肢と影響: 窓口で判断を完結する運用と、別の判断担当へ回してから再受付する運用では、引継ぎ先と再開条件が異なる。いずれも今回の期待結果として採用しない。
- 本版への影響: TR-08 は窓口へ結果を返すところまで。調査完了、修正後の自動再開、再受付成功を保証しない。

### BD-Q04 — 付属品の余剰・置換等の一致条件と受付結果（要確認・明示保留）

- 根拠: Business Design 9、121〜122 行は番号と付属品の一致を受領条件とし、11、128 行は番号不一致・付属品不足の結果を定めています。整合性レビューは、余剰品や数量不足のない置換について、一致の定義と例外経路が未決だと指摘しています。`docs/decisions.md` はこれらを決めず、今回の実装範囲から外すと明示しています。
- 将来の確認事項: 付属品の一致を同一性・数量の完全一致とするか、どの差異を許容するか。また、余剰や置換時にどの受付結果とするか。
- 選択肢と影響: 完全一致として余剰・置換も不成立にする場合は、対象条件と受領・記録・状態・窓口への結果を Business Design で決め直す必要があります。一部の差異を許容する場合も、許容条件とその結果を Business Design で定める必要があります。今回はどちらも採用しません。
- 本版への影響: TR-01 は文書上で一致する場合、TR-05〜TR-08 は明示された番号不一致・付属品不足の場合の保証だけを維持します。余剰・置換等に新しい合否期待結果を追加せず、同じ9項目の確認済み（模擬）を未決入力への承認に拡張しません。対象化する際は Business Design の改訂・人間確認を先に行います。

### 明示保留 — 整備担当への物理的引渡し

25、41 行で未決かつ今回の実装範囲外とされているため、引渡し方法・完了条件の Check は作成しません。この決定を再質問しません。点検待ちから引渡し完了を推定しません。

## 扱った接続・代表場面と境界

- 前段の貸出記録 → 対象の工具番号・付属品一覧による照合: TR-01、TR-05 の条件に保持。貸出情報そのものを作る処理は対象外。
- 一致 → 受領 → 記録と点検待ち・貸出不可: TR-01〜TR-04。
- 番号不一致、付属品不足、両方不成立 → 受領非確定・記録非実施・点検待ち非変更 → 窓口への要確認: TR-05〜TR-08。条件が同じでも個別に確認できる結果を分けた。
- 受領済みの同一貸出の再処理: TR-09。時刻保持以外の再処理結果は追加していない。
- 0 件・対象貸出なし: 照合元があるという今回の入力前提外のため、見つからない場合の確定結果を創作していない。付属品一覧が空の場合も、一覧の内容・意味を追加決定せず、入力で決まる一致条件の範囲に限る。
- 複数件・まとめ返却: 一括受領や一部受領の単位が未記載のため、新しい集合条件を設けない。本版は対象の貸出とその返却される組についての保証に限定する。
- 付属品が余分にある場合や数量不足のない置換など、「一致」の業務定義を新たに選ぶ場面は、TR-01 の文書上の一致条件を超えて確定していない。BD-Q04 として未決・今回対象外を明示し、TR-05〜TR-08 の例外経路にも勝手に追加しない。
- 貸出処理、点検作業、修理、課金、登録業務、物理的引渡し方法は対象外。UI、DB 構成、API、技術的エラー形式、通知方式も指定しない。
- 人間による Check レビューで意味の変更や未決が判明した場合は、影響項目を要確認とし、Business Design の改訂・合意を先に行ってから同じ ID の条件と期待結果を更新する。

## Alder 出典

- 使用 Skill: `alder-draft-check-items`。Alder plugin **0.4.2**。
- 公開 plugin commit: `6d30b93`（依頼で指定された短縮 SHA）。同梱 authority revision: `f904fe1e584ed6693983d58749b1f9dec83b3c8c`。
- `docs/check-item-traceability.md`: SHA-256 `87b98910b3cc5be9b7b2ccba017d57dba38be2b18db4faa22a6ac24d5529a884`。
- `docs/adoption.md`: SHA-256 `c2d153263b765f8870531e658b8e410d9a90043d585056c16146159bf29b0547`。Check Items 必須節から任意 Functional Interface 節までを適用。
- 初稿で使用した `docs/behavior-derivation/candidate-c3.md`: SHA-256 `a5c3874601d70edf87e1fc79b5501be80c35aa4f98d3870a545b79f4867f8446`。
- 今回の更新で使用した `check-item-traceability.md` と `adoption.md` の実ファイル SHA-256 は、同梱 `references/provenance.json` と一致。初稿の c3 出典は来歴として保持し、今回再導出は行っていません。現行の Test/assertion までという恒久対応の境界を適用。

### Test 証拠更新 e1 の出典

- 使用 Skill: `alder-follow-up-review`。Alder plugin **0.4.2**、source commit `6d30b93abf8ecdc8902fef5c16bfb53fda8617e9`。
- 同梱 authority revision `f904fe1e584ed6693983d58749b1f9dec83b3c8c`。全 `check-item-traceability.md` と `adoption.md` の Check Item 節・実装後レビュー節を適用。上記の同梱 SHA-256 を再検証しています。
