# Historical backtestの別担当評価

生成前に[protocol](protocol.md)を固定し、H1/H2各1回をFresh Agentで生成した。評価担当は `/root`、生成担当は `/root/history_h1` と `/root/history_h2`。生成側に候補例・後続資料・追加ヒントは渡していない。指定モデルはgpt-6-astra、effort省略・継承、独立ランタイム証明なし。分類はAIによる証拠評価であり、新しい業務要求の人間承認ではない。

## 全候補

| 原本ID | 分類 | 当時と後の根拠 | 採用根拠への加点 |
| --- | --- | --- | --- |
| H1-01 | B: 後の重要Decisionを先取り | 赤伝後の新黒失敗で、旧黒を有効なまま保つか、取消だけ残すか。当時の成功時規則だけでは選べず、後のIssue5/Decision0003で一括rollbackを明示 | 1件。ただし訂正単位の境界のみ |
| H1-02 | C: 当時有用な条件付き未決候補 | 実行引数の範囲外のDirty Keyを今回の対象に入れるか。不存在後の判断との違いが具体的。後の人間判断への直接対応は未確認 | 0件 |
| H2-C01 | A: 当時既決 | 全workの原子性は当時のDecision0002/0008で既決 | 0件 |
| H2-C02 | A: 当時既決 | Runの完全なsource queryを一度評価する契約は当時のDecision0002で既決 | 0件 |

合計A=2、B=1、C=1、D=0、E=0。文書内導出・見送り項目を追加の発見数へ含めない。H1は初期実行実装前、H2は実行戦略評価前で、異なる2時点だが同一製品・同一機能であり独立した2製品ではない。

## H1-01: 成功と数える範囲

H1は `ccc1edc8547aac1a36777d158639d7d7c20db113`（2026-09-12 04:48:55 UTC）。当時の[Process](https://github.com/mk3008/velvet/blob/ccc1edc8547aac1a36777d158639d7d7c20db113/docs/processes/transfer-execution-process.md)はRed → Black → 結果記録という順序を定め、トランザクション実装を定義しない。[Active Black](https://github.com/mk3008/velvet/blob/ccc1edc8547aac1a36777d158639d7d7c20db113/docs/concepts/active-black/concept.json)は赤伝成功後の旧黒の退役・新黒成功後の有効化を定める。これらは成功した個別操作の規則であり、後続Black失敗時に先行Redを確定してよいかを明記していない。[Run DDL](https://github.com/mk3008/velvet/blob/ccc1edc8547aac1a36777d158639d7d7c20db113/db/ddl/run.sql)のfailed状態も成果物の確定粒度を決めない。当時の唯一のDecision0001、Scope/Concept/DFD/Process、DDLと検証方針を照合した範囲で、この失敗結果の一意な規定は確認できなかった。

原本H1-01は、旧黒+100 → 赤伝-100成功 → 新黒+150失敗を示し、「旧黒+100が有効のまま」と「取消だけ残りActive Blackなし」という観測結果差を提示した。一般的なエラー処理やSQL方式だけの提案ではない。原本はRun全体の原子性まで主張せず、評価側もそこへ拡張しない。

後続の人間の[PR4判断](https://github.com/mk3008/velvet/pull/4#issuecomment-5645913309)（2026-09-12 12:34:41 UTC）は転送workの確定境界・失敗時破棄を具体化した。さらに[Issue5](https://github.com/mk3008/velvet/issues/5)（作成2026-09-12 21:54:50 UTC）はRed/Black途中失敗のrollbackと既存失敗時原子性の維持を明示する。[Decision0003の固定版 L21–29](https://github.com/mk3008/velvet/blob/6739d2d8590f2041372d3e10c2fe938e209f2039/docs/decisions/0003-phase2-immutable-reevaluation.md#L21-L29) はRed・退役・両Lineage・新Black・Processingが一緒に確定またはrollbackすると記録する。Issue本文の過去編集版そのものは取得していないが、Issue作成自体がH1より後であり、Decisionは不変commitで固定している。

[現在の回帰テスト L455–466](https://github.com/mk3008/velvet/blob/6b64e3b99845a315a394fee8e500564c3631e2af/tests/features/execute-transfer/reevaluation.integration.test.ts#L455-L466) は新Blackキー競合時にRedも戻り、転送先行・Active Blackが元のままになることを検査する。これは後続結果の補強証拠で、当時の仕様や実行済みテストを装うものではない。本研究では製品テストを再実行していない。

事前T1は途中失敗時の確定範囲を対象とした。独立キー間やRun全体まで当てたわけではなく、訂正内の部分成果の境界への**部分対応**。この限定した結果差は後の人間判断/Decisionに直接対応するためBを1件とする。Run独立永続化T2、設定版T3は発見していない。生成後にIssue5を見つけたため新たな一致へ事後照合したことも明示する。事前に赤黒の具体例を正解として登録・提示した試験ではない。

## H1-02: 後続Decisionへの一致と数えない

原本は引数で支店Bを実行したとき、支店AのDirty Keyをそもそも今回のWork Itemに含めるかを問う。当時の[Dirty Key](https://github.com/mk3008/velvet/blob/ccc1edc8547aac1a36777d158639d7d7c20db113/docs/concepts/dirty-key/concept.json)には、クエリ結果から消えることが削除相当になる例が既にある。この**対象として選んだ後の不存在**を再発見扱いにしない。残る差分は、実行引数を選択範囲として使う利用契約と対象固定化の接続。誤った取消と対象外維持の結果差があり、条件付きで当時検討価値があるCと評価する。

[後のDecision0004](https://github.com/mk3008/velvet/blob/7353b9ab8808493d6c5a04a332edb14a5e197f85/docs/decisions/0004-phase3-source-disappearance.md)はフィルタ/結合を含むSQL結果の不存在を定義するが、引数によるadmission範囲の選択を人間が新たに決めた証拠とは限らない。実装が全pending対象に現在SQLを適用する事実だけで業務承認としない。Cは今回のB必須の採用条件へ加算せず、現在のVelvetの欠陥や新要件にも変換しない。

## H2: 2件とも既決、回復論点の発見なし

H2 `43c8e57d6d7e8fe67433d8aa0f8ce48232f03999`（2026-09-13 11:16:19 UTC）では[Decision0002](https://github.com/mk3008/velvet/blob/43c8e57d6d7e8fe67433d8aa0f8ce48232f03999/docs/decisions/0002-phase1-trusted-execution.md) L15–20と[0008](https://github.com/mk3008/velvet/blob/43c8e57d6d7e8fe67433d8aa0f8ce48232f03999/docs/decisions/0008-multi-destination-verification.md)が既存。全workの原子性、完全なsource queryを一度評価するsnapshot契約でH2-C01/C02を閉じる。生成入力にDecisionがないことによる再質問でありBではない。

事前T4の蓄積仕事/有限実行時間/回復進捗は出力されなかった。後続[Decision0010](https://github.com/mk3008/velvet/blob/6e89908847b48fd619cab93cabc46295cca816c1/docs/decisions/0010-bounded-execution-candidate.md)と[Issue23](https://github.com/mk3008/velvet/issues/23)が要求する回復は未発見として残す。H2前に作成されたIssue20にはserverless前提があるが、今回の限定入力BD/Scope/共通契約には含めていない。従ってserverless前提込みの公平な検出率を測ったとはしない。条件を足した再生成も行わない。

## 採否と限界

Bを1件確認できたため、ユーザー指定の条件に従い、**考慮漏れ検証をAlderの任意工程として正式採用する方向へ変更する**。必要な機能に使える工程であり、全案件の必須ゲートや網羅性保証ではない。人間に返す前に当時/現在の既決Decisionと共通契約を照合する運用を重視する。

H1のConceptは全てdefinedだが、当時のai-review.jsonはneeds-reviewで、Work Item/Lineage関係とmutable監査のopen項目が残る。生成には渡していない。今回の成功候補はそれらの業務相関の再検出ではないが、設計全体のレビュー完了を立証したベンチマークとは言えない。H2の同レビューはresolved。最初の時点を成功後に変更せず、この適用範囲の限界を残す。

時点・後続目標は履歴を知る評価者が選んだ。2回・1製品、promptなし対照なし、評価者盲検なし、モデル/effortの独立証明なし、OS隔離なし。read logは指定6件だけと報告している。全ての過去の口頭判断や編集前Issue本文の不存在を証明したわけではない。従って歴史上の未決判定は確認した原典・議論の範囲に限る。効果量、一般化、発見率向上を主張しない。未発見・再質問も含めて残し、実用価値の限定された証拠とする。
