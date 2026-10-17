# 要求から自動検証へ: 架空予約アプリの実測

## 結論

**選定した3領域で、要求 → 合格条件 → 自動検査 → 実行証拠を結べた。** 16個のテストに対し、最終の補完実験で6種類の意図的違反をすべてassertionで検出し、同じ検査のまま実装差分を戻すと再び成功した。機械検査が有用な反証を返す最小経路は成立したが、要求の完全性や実製品の安全性を示す研究ではない。

研究上の提案は、**領域ごとに通常のテスト・監視・回帰検査へ接続する経路を残し、現時点ではPoCを拡大しない**こと。新しいSkill、共通フレームワーク、一律の追加Check Item体系、Alder/Torroneの製品統合は採用しない。具体的な製品・責任者・実運用で確認すべき問題が現れた時点で、その領域だけを検討する。

これは研究上の採否案であり、現実の人間による業務要求の承認、残余リスク受容、標準工程の変更ではない。AlderのBusiness Design → Check Item → Testは変更していない。

## 何を実行したか

架空の会議室予約を作成・参照・取消する、Python標準ライブラリだけのアプリを使用した。業務意味は[実行前計画](protocol.ja.md)のBD1–4に固定した。認識済み社員はalice/bobだけで、架空トークンを使う。予約主体や許否を技術側で追加決定していない。

- 要求・入力・oracle: `a85c9e56e767071a45a59ac68a90c1836c8a9e53` で実行前固定
- 検査と実装: `ad74b002fc91ef49a8e76ac902d9ddffc4fa33bf` で実行前固定
- 違反注入・復元runnerを含む実行元: `8b3eac9ebfa2d47d073e41c082faf424b6caa828`
- 初回実行: 2026-10-07 UTC、CPython 3.12.14 / SQLite 3.53.1 / Linux x86_64
- 検査補完の実行元: `0dbbf642368419625c0bd45c0002e71fe68950b9`。要求・oracle・実装は不変
- 保存先: [補完manifest](results/run-02/manifest.json)と[初回manifest](results/run-01/manifest.json)。入力・コード・oracle・各phaseのhash、実行時刻、コマンド、終了コード、失敗テスト、ログhashを含む

実装担当には要求・fixture・API契約を渡し、oracleファイル・検査コードを渡さなかった。検査担当は実装コードを読む前に検査を作成した。合否基準を結果に合わせて修正していない。ただし同一系列のAIによる指示上の分離であり、独立した人間承認・強制された盲検・一般的な妥当性検証ではない。

## 要求と証拠の対応

| 要求 / 想定承認者 | 正常実装の観測 | 意図的違反での観測 | 復元 | 証拠 |
| --- | --- | --- | --- | --- |
| SYS1 / システム責任者 | commit前closeで未確定行0→再送1行。commit後closeで確定行1→再送同一ID・全行一致。内容違い409、owner別の同一request_idは独立 | 既存request_id照会を無効にすると、commit後再送が201でなく409。DBの一意制約は残り、重複行は作られないが、確定結果を再取得する要求に違反 | 4/4成功 | [正常](results/run-01/system_skip_replay-normal.log)、[差分](results/run-01/system_skip_replay.diff)、[違反](results/run-01/system_skip_replay-violated.log)、[復元](results/run-01/system_skip_replay-repaired.log) |
| SEC1 / セキュリティ責任者 | bobの直接GET/取消・body owner偽装は403、未知/匿名は401、拒否前後のDB不変・本文に予約なし。alice自身の操作は200 | owner照合を常時許可すると、bobの直接参照・取消・body偽装の3テストで200を観測し失敗 | 5/5成功 | [正常](results/run-01/security_allow_other_owner-normal.log)、[差分](results/run-01/security_allow_other_owner.diff)、[違反](results/run-01/security_allow_other_owner-violated.log)、[復元](results/run-01/security_allow_other_owner-repaired.log) |
| OPS1 / 運用保守責任者 | clean / fixable / failed / missing / no_fix / breakingを区別。候補1.1は実アプリ回帰成功、候補2.0は時間の順序判定を実際に破りblocked。現行1.0は不変 | 回帰gate無効でcandidate_blockedがcandidate_readyになり失敗 | 7/7成功 | [正常](results/run-01/maintenance_skip_regression-normal.log)、[差分](results/run-01/maintenance_skip_regression.diff)、[違反](results/run-01/maintenance_skip_regression-violated.log)、[復元](results/run-01/maintenance_skip_regression-repaired.log) |
| OPS1失敗通知 | scan例外を失敗履歴・scan_failedイベントにし、過去成功を更新しない | 通知appendだけを外すとscan_failedイベント欠落を検出 | 7/7成功 | [差分](results/run-01/maintenance_hide_failed_run.diff)、[違反](results/run-01/maintenance_hide_failed_run-violated.log)、[復元](results/run-01/maintenance_hide_failed_run-repaired.log) |
| OPS1未実行検知 | 成功履歴なし/古い成功/直近失敗を区別。25時間ちょうどでは未超過、25時間+1秒でoverdue | overdueイベントを抑制すると未実行・古い成功の検出テストで失敗 | 7/7成功 | [差分](results/run-01/maintenance_hide_missing_run.diff)、[違反](results/run-01/maintenance_hide_missing_run-violated.log)、[復元](results/run-01/maintenance_hide_missing_run-repaired.log) |

15のプロセス実行は、5つの違反それぞれの正常→違反→復元である。独立に抽出した15製品や15replicateを意味しない。初回実行の想定外結果は0、import/runtime errorは0。違反検出は指定したassertion失敗であり、runner自体が失敗したために検出扱いにしていない。修正は欠陥差分の厳密な復元で、AIによる任意修理能力を測っていない。

## 独立監査と検査の補完

[最初の独立監査](results/fresh-audit/audit.ja.md)は、既存結果を読む前に固定ソースを確認し、5変異・15phaseを再実行した。すべて期待通りだったが、再送receipt全体の照合と通知payloadの関連付けにassertion不足が見つかった。初回成功を完全な照合成功とは扱わず、[追加実行前の補完計画](assertion-addendum.ja.md)を固定した。

要求・fixture・oracle・実装を変えずに、保存行と再送receipt全体の一致、通知の時刻/advisory/version/回帰結果、履歴なしの未実行通知の期限を追加検査した。DBとIDが正しくても返却roomだけが誤る6つ目の変異を追加し、[そのassertion失敗](results/run-02/system_corrupt_replay_receipt-violated.log)と[復元成功](results/run-02/system_corrupt_replay_receipt-repaired.log)を観測した。既存5変異も再び検出した。

[補完run-02](results/run-02/manifest.json)と[監査担当による継続再実行](results/audit-supplement/audit.ja.md)はいずれも6変異・18phaseが期待通りで、runtime errorは0。[最終の一括実行](results/final-suite.log)も16/16成功。継続監査は同じレビュー担当が行い、新たなFresh contextとは数えない。

なお、古い成功履歴がある場合のwatchdog通知はtypeを検査するが、全payload項目をassertionしていない。通知のすべての組合せを検証済みとは言わない。補完計画はrunnerの8ソースhash対象外だが、公開commitと[出所照合記録](provenance.json)で別途固定している。manifestのsource_revisionは呼出側の申告であり、独立した出所照合が必要。

## 領域ごとの適した経路と必要な成果物

以下は今回の観測を踏まえた限定的な設計判断で、代替toolの性能比較実験ではない。

| 領域 | 今回適した接続 | 必要最小限の成果物 | 今回は採用しない候補と理由 |
| --- | --- | --- | --- |
| システム | システム責任者の耐障害要求 → 既存テストrunner内の障害注入 → DBの実状態・receipt照合 | 要求と対象障害の記述、テスト、DB状態を照合するassertion、実行ログ | 文書/設定の照合だけではcommit前後の結果を観測できない。分散障害frameworkは今回の1DB局所仮説には過大 |
| セキュリティ | BDの許否 → 技術責任者のserver認可要求 → 直接API否定テスト | BDのowner規則、対象endpoint/主体、否定と許可のテスト、状態不変の証拠 | UI E2EだけではUIを通らない呼出を反証できない。静的検査だけでは実行時の状態を観測できない。実侵入試験は対象環境も許可もなく、今回の問いに不要 |
| 保守運用 | 対応責任・失敗時条件 → 模擬scan/成功履歴/独立watchdog → candidateのアプリ回帰 | 運用条件、監視/候補生成コード、履歴/通知イベント、候補検証ログ | cron設定確認だけでは未実行や失敗を区別できない。本番自動patchは残余リスクと運用承認を飛ばす。新しい統一台帳はこの経路を成立させる必須条件ではない |

既存製品のテストがあったわけではない。再利用したのはPythonの通常のunittest/SQLiteという実行手段で、16テストはこの研究のために作った。実製品では既存の業務回帰テストを候補環境へ流用できる可能性があるが、その導入コスト・保守コスト・有効性は未実測。

研究記録上の対応表を、全製品で必須の新しい恒久成果物に昇格しない。要求の所在はその製品の適切な設計・運用文書に置き、検査/設定/ログへ参照を持てばよいという候補である。

## どの時点で何を言えるか

- 実装前: 要求と想定責任者、合格条件、対象障害、未決を読める形にできた。妥当性・完全性が人間に承認されたことにはならない。
- PR時: 固定入力に対する自動判定と、意図的違反を検出する検査の感度を限定的に確認できた。
- リリース時: 同じ検査を対象artifact/configurationで再実行する経路は候補になるが、今回リリース環境を再現・検証していない。
- 運用中: scanの失敗、成功履歴の期限切れ、修正不能、互換性破壊を固定時計で判定できた。scheduler・watchdogの将来の呼出、実通知配信、実advisoryの取得は証明していない。

Alder Check ItemへSYS/SEC/OPSを一律混入せず、BDの意味を共通入力として、それぞれの要件元へ結果を返せる。システム側の再送テストや保守の時間回帰が業務意味の証拠を再利用しても、他領域全体の合格を意味しない。

## 誤検出・見逃しと残る判断

- 正常実装で今回の16テストは成功した。実際の製品に対するfalse-positive率を推定したわけではない。誤ったoracleなら正しい実装を不合格にする。
- 最終実行で6種類の既知mutantを検出した。仕様にない攻撃・時刻境界・並行要求等は通り抜け得る。mutation選択自体が既知の弱点に寄っているため、一般的なfalse-negative率や攻撃網羅率は算出できない。
- SQLiteの実接続をcloseしたが、分散DB、ネットワーク分断、停電、disk故障、同時要求、failoverを実行したわけではない。
- 認可判定はサーバー側のアプリ呼出境界で実行した。HTTP transport、TLS、セッション、実Identity Provider、トークン偽造耐性、実クライアントからの経路は未検証。
- fake-time/SYN-001–003はすべて架空。実CVE/脆弱性DBの鮮度・精度、推移依存、悪意あるpackage、supply-chainの信頼は未検証。
- 保守の通知は返却値として生成されたローカルJSONイベント。メール/Slackへの配送、プロセスをまたぐ履歴永続化、scheduler自体の欠落検知は未検証。更新は適用せず、candidate生成と限定回帰まで。
- 回帰は二つの予約時刻例が中心で、すべての業務回帰・セキュリティ回帰ではない。安全な更新の完全保証にもrollback試験にもならない。
- 要求の妥当性、業務上の許否、実運用で十分か、検出できない残余リスクを受け入れるかは、実際の責任者の判断として残る。

## 再現

Python 3.12のある隔離環境で、補完実行元 `0dbbf642368419625c0bd45c0002e71fe68950b9` をcheckoutし、当ディレクトリで実行する。依存関係のinstallや実アカウントは不要。

```sh
python3 -B -m unittest -v test_routes
python3 -B run_experiment.py --source-revision 0dbbf642368419625c0bd45c0002e71fe68950b9 --output results/my-run
```

出力先は新規ディレクトリとする。既存のrunは上書きしない。runnerの成功条件は全phaseが期待した終了コードで、違反phaseが指定assertionを失敗させ、runtime errorがなく、元ソースhashが不変であること。個別違反phaseのexit 1は実験が狙った検出で、通常実装のテスト失敗と混同しない。

wall-clockの実行時間・UTC時刻・環境versionは再実行で変わる。判定に使う業務時計とadvisoryは固定されている。将来のPython/SQLite差異までbyte単位の再現を保証しない。

## 振り返りと次の判断

文書作成やAIの「問題なし」だけを成功にせず、先に固定したoracleと実装差分を使って失敗を観測した。独立監査で検査不足を発見し、元の証拠を保持して補完した。今後も「assertionが要求のどこまで照合するか」を既存レビューで確認する。新しい恒久ルールは追加しない。実装担当と検査担当の分離は自己整合だけの合格を弱めるが、要件そのものの独立性までは作らない。

この範囲では検証経路の成立可能性に十分な証拠が得られた。追加fixture・新Skill・標準工程の研究へ自動継続しない。再開条件は、実製品で必要な要求と責任者が特定され、今回未検証の運用・信頼境界について具体的に何を判定するか決まること。研究記録のmainへのmergeは別の人間判断である。

## CIの範囲

既存4workflowのpath条件を確認した。この研究ディレクトリとDecision Indexの変更は対象外で、GitHub Actionsでの自動実行は設定していない。CI成功とは表現しない。上記のクラウド隔離環境での実行証拠を評価対象とし、製品全体の回帰は今回実行していない。
