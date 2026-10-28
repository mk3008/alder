# Alder Check–Testフォローアップ: 読み取り専用の準備

## 保存結果と適用範囲

指定のCheckコピーは**更新していない**。候補Alder `alder-follow-up-review` のJSON入口は未知・独自JSONの更新を禁止し、公式validatorの失敗を記録して読み取り専用の根拠整理のみ返す。対象の `format: molkky-research-check-items`、`format_version: "1"` に対し、Node v24.22.1の `document_storage/cli.mjs validate` は終了コード2、`{"code":"CLI_ERROR","severity":"error","message":"Legacy JSON version required"}`。この形式をAlder Check packageとみなして直接編集・commitした成功とは扱えない。原資料、製品、テスト、対応表、Pluginも変更していない。

候補Skill入口は `alder-follow-up-review`。Plugin 0.4.9、指定された作業ツリーのplugin source `4494e2e22ed84c73e8ea0e770d4ff4e576ca0ab2`、同梱provenance source `2df97f66f705fb79e4228e5e249cbbcacc9e3bfa`。独立レビューのピンはBD `bd-draft-0.48` / Check `check-draft-0.37`、CLI・テスト・対応表の供給版。提供SR・Decision Record・DDLなし。チェックコピーSHA-256 `584aa36748f4465dc2f9a8e1826750e116b8457923c7850e3e733fe2d339b808`、BD SHA-256 `aa79deb25abab01d825d7f03abd93ec9d13d9d7f682fb818fbb802204dd63fff`。独立レビューの入力ピンと一致する。

## 4件の候補対応（未保存）

| ID | assertionとの意味対応、実行証拠 | 残る証拠の範囲 |
| --- | --- | --- |
| CI-08 | `CoreTests.test_scoring_zero_reset_and_single_count` のevents `[0,8,2,0,1,1,4]`、Aの4点・Bの9点をassert。1本の8番→8点、4番→4点の代表例に対応。再実行21件成功。追加CLI観測でもAの8番→8点、終了コード0。 | 実人間のCheck確認なし。全番号・全状態を網羅した主張ではない。 |
| CI-41 | `CoreTests.test_dates_and_layouts` は同日順(1,2)、未投球時の最終実投日None、年越しの実投日、保存後の日付をassert。`CLITests.test_multi_process_persistence_and_invalid_input` は一覧の開始日と最終実投日文字列をassert。再実行21件成功。追加CLI観測のlist行は同日・同参加者の2件に異なるIDと順番、年付き開始日・最終実投日/未投球、途中状態を表示。 | 既存自動テストは一覧行全体、同日2件、状態、勝者、未投球表示を直接assertしない。終了時勝者を含む一覧行は追加観測でも未実行。人が一覧から選べることは表示・IDの観測まで。 |
| CI-63 | `CoreTests.test_two_priorities_formed_by_recorded_corrections` は実際の訂正でA/Cの優先を形成、Cの優先0点後に再訂正、保存・読込後もA優先をassert。`test_two_priorities_and_recorrection_after_zero` も保存・読込をassertするが前半はhistory/incident fixture。両方とも再実行成功。 | 対応表にある `CLITests.test_multi_process_persistence_and_invalid_input` は優先を作らず、CI-63の直接証拠ではない。実CLIの別プロセスで優先途中を再開する場面は未実行。Checkの人間状態「要確認」を維持。 |
| CI-71 | 既存 `CoreTests.test_dates_and_layouts` は配置記録のある試合とその保存・読込をassertし、配置記録なしの中断・再開を直接assertしない。追加CLI観測では配置記録0件のg0002を、別CLI呼出しのshow、次のthrowで継続し、終了コード0。 | この追加観測は保存済みの観測結果であり自動回帰assertionではない。物理的な立て直し・配置復元はCLIから検証できない。 |

参照元: `agent-output/candidate-followup-input/review.md`、`eval-inputs/molkky/business-design.json`、`eval-inputs/molkky/check-items-draft.json`、`eval-inputs/molkky/CHECK_COVERAGE.md`、`eval-inputs/molkky/cli/tests/test_molkky.py`、`eval-inputs/molkky/tests-final.txt`、`agent-output/baseline-review/retest.txt`、`agent-output/baseline-review/probes.txt`。再実行は21件/0.835秒、OK。追加CLI観測末尾は `PROBE ASSERTIONS OK`。この観測は今回の新規実行ではない。

## 維持すべき状態と次の境界

4件の期待結果、条件、BD参照、IDは変更対象でない。人間レビュー状態はCI-08/41/71「未レビュー」、CI-63「要確認」。模擬依頼者の「確認済み（模擬）」を実人間の承認へ昇格できない。独立レビューは代表範囲で確定的不一致や新たな業務判断を見いだしていないが、製品受入れを意味しない。

指定コピーへのCheck–Test証拠保存を完了するには、この研究用独自JSONに対する明示的にサポートされた保存経路が必要。現行候補SkillのJSON契約下で形式を推測変換、検証を迂回、直接上書きして解決したことにはできない。上表はその際の判断材料であり、保存済みの対応付けではない。
