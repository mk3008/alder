# Alder 実装・テストレビュー（凍結入力、CI-08 / CI-41 / CI-63 / CI-71）

## 対象と権限

読み取り専用レビュー。業務設計 `bd-draft-0.48`（package-draft-0.48）、Check草案 `check-draft-0.37`、指定されたCLI・テスト・対応表・保存済み実行結果を対象とした。業務設計とCheckは模擬依頼者とAIの草案であり、実在の人間の業務承認はない。Checkの `human_review_state` はCI-08/41/71が「未レビュー」、CI-63が「要確認」。これらを承認済みとは扱わない。提供SR・Decision Record・DDLはなし。対象CLIには別個のSR制約が確認できず、未提供の制約について適合を主張しない。

Alder plugin 0.4.9、plugin source `4494e2e22ed84c73e8ea0e770d4ff4e576ca0ab2`、同梱 review knowledge v0.3（provenance source `6fce51884963422eb4713aec9a5698b46fc84700`、SHA-256 `564c52831d438d9b49f4ca098dd1884167f2be096cc56f959c7847002ffe0351`）。レビュー入口は `alder-review-implementation` の read-only stage。新しい独立コンテキストとして依頼されたが、実効モデル・推論設定の検証手段はない。AGENTS.md のFresh既定は `gpt-6-sol` / `medium` / `fork_turns:none`。実際に要求した設定の記録は呼出側で照合されたい。

入力source: mk3008/root、BD `67f5f644b3f5d6a4ce6c0017b8337f7fd9e33771`、Check `88fe0e62a0ded4b9a0f02e8fdf8275a59668f4f1`、CLI・Test・対応表・保存結果 `fe80db86039dc9e8ac0abb29cce1108cc1604c93`。以下は供給された凍結ファイルのSHA-256。

| ファイル | SHA-256 |
| --- | --- |
| business-design.json | `aa79deb25abab01d825d7f03abd93ec9d13d9d7f682fb818fbb802204dd63fff` |
| check-items-draft.json | `584aa36748f4465dc2f9a8e1826750e116b8457923c7850e3e733fe2d339b808` |
| cli/molkky.py | `43b4eedef4fcc9d57732d3e4679240be1f9d2a74f4d0f021b68d27d9944fa272` |
| cli/tests/test_molkky.py | `75dafae37373d9ee0c8fef74b07f67a6ac1d2f317092908d2df2062d9d5630ba` |
| CHECK_COVERAGE.md | `75e4e9a935e8eb53023986bb424e9bbe8d5c726e467e43232fc8413191469f82` |
| tests-final.txt | `3d13c94252bca7dd06192f478d186d16386e5c473cc479bf4d0811df7667d009` |

## 業務の接続と結果

参加者が順番と試合を決め、記録者が実投を試合へ結び、道具が得点・次の人を再計算し、閉じた後は一覧から同じ試合を選んで再開する。写真・メモなしの中断も許され、現場では倒れたものを立て直してから次に投げる。失格訂正後の優先は投球が数えられるか、本人の後続投球が数えられたか、複数の優先対象の残り方に依存する。BDの「得点と試合の進行を反映する」「試合を見分ける情報を示す」「以前の試合を開いて確認または再開する」「次に投げる人を決める」「配置を振り返る情報を残し見返す」と関連する現場Activityを照合した。

| Check | 分類・判断 | 根拠と検証範囲 |
| --- | --- | --- |
| CI-08 | 十分性確認（対象例） | BDは有効な1本ならその番号を点数とする。`throw_points`（molkky.py:66-67）と`replay`（:86-107）が適用。`test_scoring_zero_reset_and_single_count`（test_molkky.py:47-60）はBの8番に8点、Aの4番に4点と累計を主張。コピー上のCLIでAの8番が8点となることを観測した。 |
| CI-41 | 十分性確認（実装）。テスト証拠は一部弱い | BDは同日順、参加者、年を含む開始日・最終実投日または未投球、状態・終了時勝者を一覧で示して選ぶ。`create_game`（:167-182）と`run` のlist（:454-460）、日付関数（:254-258）を照合。同日同参加者2試合、片方未投球、年越し実投のCLI表示を追加観測。`test_dates_and_layouts`（:242-259）は内部の日付・同日順・未投球を主張するがlistの全文を確認せず、`test_multi_process_persistence_and_invalid_input`（:266-284）はlist中の両日文字列のみを確認し、同日2件、状態、勝者、未投球の一覧行は直接主張していない。対応表の「関連テストあり・十分性未確定」は妥当。終了時勝者を含む一覧行はこの追加観測では未実行。 |
| CI-63 | 十分性確認（提示された複数優先の代表場面） | BDは、Cの優先0点が数えられ、Aが残れば閉じて開き直してもAが優先。`start_throw`（:190-207）に優先の投球種別を保持し、`replay`（:69-108）と`priority_analysis`/`next_turn`（:110-165）が記録から次を再計算、JSON保存・読込（:291-315）。`test_two_priorities_formed_by_recorded_corrections`（:192-209）は実際の訂正で2件の優先を作り、Cの0点と再訂正後、write/readをまたいでA優先を主張する。`test_two_priorities_and_recorrection_after_zero`（:177-190）も同じ再開を確認するが、前半は履歴とincidentを直接作るfixture。`CLITests.test_multi_process_persistence_and_invalid_input`（:266-284）は複数プロセス経由だが優先状態を作らないため、対応表に挙げたそのテスト単独でCI-63を検証したとは言えない。 |
| CI-71 | 十分性確認（道具の任意記録）・既存テストの直接性に限界 | BDは写真・メモを残すことを必須とせず、中断時の現場の立て直しは別責務。`add_layout`（:260-289）の少なくとも一方という条件はlayoutコマンドを使う場合だけ。保存・show・次の投球（:301-357, :448-514）は配置記録を要求しない。コピー上で配置記録0件の試合を閉じ、別CLIプロセスからshowと次の投球を成功させた。`test_dates_and_layouts`（:242-259）は配置あり試合を主に扱い、配置なしの中断・再開を明示的に主張しない。物理的に立て直したかはCLIでは検証できない。 |

確定的な不一致、具体的な追加Business判断を要する未決は、この4項目の供給範囲・代表場面では見つからなかった。実装選択のうち日付取得はBDが未確認としているため、`--date`またはローカル日付の採用（:28-40, :431-460）を新たな業務承認と解釈しない。選ぶ一覧の各行には試合IDがあり、show/throw/correctがそれを受け取る。CI-63の優先状態は履歴の再計算に依存し、保存されたラベルだけを盲信しない。

## 実行証拠と未検証範囲

提供済み `tests-final.txt` は21件成功（0.880秒）。入力を一時領域へコピーして `python -m unittest discover -s tests -v` を再実行し21件成功（0.835秒、`retest.txt`）。追加のCLI観測は `probes.txt`。コピー上の実行であり、凍結入力は変更していない。

未検証: 実人間によるCheckの期待結果確認、現場での立て直し・配置復元、CI-41の終了勝者を含む一覧行の追加実行、CI-63の実CLIで優先途中の別プロセス再開、同時書込み・障害時復旧など未提供SRの運用保証、全投球順・全訂正組合せ。これらを本レビューの不一致や新たな実装要求とみなさない。`CHECK_COVERAGE.md` の「関連テストあり」は主張全文の網羅を意味せず、草案の `test_evidence: 実装前・未作成` は凍結した別文書内の古い記載として読んだ。対応表・Check本文は更新していない。
