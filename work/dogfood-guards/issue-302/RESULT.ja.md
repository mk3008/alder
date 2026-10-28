# root #173 / Alder #302 実施結果

独自JSONのfollow-up保存経路と、未確定Role診断の原文不一致の2件を再現し、コミット前に改善を確認した最小修正だけを提出する。意味レビュー精度の一般的改善、全127 Checkの保証、正式導入への反映は実証していない。root #170の研究は再試行せず、凍結成果・先行Draft・main・公開版を変更していない。

Control: [root #173](https://github.com/mk3008/root/issues/173)。Execution: [Alder #302](https://github.com/mk3008/alder/issues/302)。作業branch: `work/302-dogfood-guards`。

## 版と検証の条件

- baseline: Alder main `4494e2e22ed84c73e8ea0e770d4ff4e576ca0ab2`、Plugin 0.4.9。全88 PluginファイルをGitHub treeのGit blob SHAと照合した。
- 既存意味レビュー候補: #297 `8410b72561ce9b371885c2c3174efca4b904b9e5`。mainに対するPlugin差分はSkill・authoring guide・provenanceの3ファイル。比較用コピーにだけ適用し、本branchへ採用しない。
- 新follow-up候補: baselineに `alder-follow-up-review/SKILL.md` 冒頭1段落の差分だけを適用。全Plugin hash比較で他87ファイル不変を確認してから実行した。
- 機械修正のcanonical source: `cf0a041c045b5c2e80a865c75a8e0e06aaa3626d`。独立検証・77件成功後に作業branchへ公開し、既存exporterで26ファイルを再生成。変更は同梱coreとprovenanceの2件だけ。
- 実行環境: Node v24.22.1、Python 3.12.14。7つの新規Agent文脈を `gpt-6-sol / medium / fork_turns:none` で要求した。実効モデル設定・費用・全ホストtraceは独立確認不能。[全タスク本文](prompts.md)を保存した。
- 使用しなかった備品貸出例とoracleをauthor起動前に固定した。authorへoracle・過去出力・診断・修正案を渡さず、別readerには原文・最終実物・同梱契約だけを渡した。OSによるファイル隔離や全アクセスの記録はないので、非閲覧の完全証明は主張しない。

## P0の対応

| 対象 | 実際の失敗・起因 | 既存検証と分類 | Before / After・最終品質 | 採用する変更・未実証 |
| --- | --- | --- | --- | --- |
| ① 正規Skill・保存形式 | follow-upの入口は「typed JSON」を選択した場合だけJSONガイドへ接続していた。独自 `molkky-research-check-items` を渡す通常の記録更新依頼では、4件の証拠とrevisionを編集し、形式非対応を返さなかった | validatorによる独自形式の拒否は実装済み。(a)既存機能の未利用 | 同じ原本・レビュー・依頼で、baselineは0.37→0.38へ編集。候補はvalidator終了2を開示し、原本SHA `584aa367…b808` を保持、4件の証拠準備だけを返した。独立readerも原本不変・境界維持を確認 | follow-upのJSON入口を、未知・独自JSONを含めて既存validatorへ接続。新しい保存器・形式・合意規則は作らない。クライアントの自動Skill dispatchはNOT_VERIFIED |
| ② セルフレビュー・修復 | #170の保存版間で条件の明確化・一般保証/例の再編を読取り確認。修復後の全面的品質保証は別問題 | JSONの構造成功は意味保証ではない。(c)意味判断 | 備品貸出を現行/#297へ各1回生成。別readerは主要意味を両方で確認し、候補に軽微な入力labelの改善余地を指摘。両作者は同一文脈の修復・再確認を記録したが、全読取り/反復をホストtraceでは独立確認できない | **NO_CHANGE**。#297との改善差なし。意味レビュー指示を重複実装・採用しない。全127件の意味保証・一般成功率・新たな#170修復の効果はNOT_VERIFIED |
| ③ Check→Test / 実装レビュー | 名前/コメント/緑だけでは4件全体を保証しない。custom Checkの保存と証拠内容の読取りは区別が必要 | 正式review/follow-upにassertionと実行の区別が既存。(c)意味判断、形式入口は① | 正式review Skillを通常依頼で選択し、CI-08の成功例とCI-41/63/71の部分証拠・未実行を区別。21テストをコピー上で再実行。候補follow-upは原本を保存せず、同じ4件の入力→観測→assertion→実行/不足を準備メモへ記録 | 証拠の意味判定規則は**NO_CHANGE**。永久Check↔Codeリンク、1Check=1Test、テストランナー制約、台帳を追加しない。実人間の合意・現場作業・未提供SRは保証しない |
| ④ 機械判定 | 未確定Role診断はActivity IDのprefixだけで通り、現在のWhoと異なる「旧原文」でも保存できた | 原文保持は既存Role契約。対応検査だけ不足。(b)機械化可能な未実装部分 | 固定入力で旧版validate/createは0、新版は2。正しい診断のcreate/inspectは両方0。Whoを変更して旧診断を残すcommitは旧版0、新版2で保存済みbytes不変。0.3/0.4の追加テストは旧版で失敗→修正後77/77成功 | `startsWith` を現在のWhoを含む完全一致へ変更。Role推測・承認判定は追加しない。既存CIで回帰・配布同一性・Viewer共通経路を検証する |

## 機械化の棚卸し

| 分類 | 実在する経路・結果 |
| --- | --- |
| (a) 実装済み | `schema.json/schema.mjs` の型/列挙/未知欄、`parseStrict` の重複key、`inventory/validateReferences` の重複ID・参照種別/所有者/版、authoringのID保持・実変更とrevision・期待hash/意味hash・人間状態保護、CLIのcreate no-clobber・CAS・lock・atomic save・保存後再検査。独自形式、欠落/型違い/版違い、無断確認昇格等14操作を実行。重複実装不要 |
| (a) 配布/CI | `export_plugin_references.py` は公開source commitのbytesとprovenanceを再現。既存Plugin package/JSON Gate A/Bに検証があり、共通coreの変更は既存Viewer CIのpathsにも含まれる。新規CI・hookは不要 |
| (b) 必要な最小追加 | 未確定Role診断と現在のWhoの文字列対応だけ。Schemaの形だけでは現在Activityへの対応を検査できないので、既存`validateReferences`へ1行で追加 |
| (c) 意味判断 | 誰が実人間か、業務合意の内容、When/Resultの成立、一般保証と個別例、assertionの十分性、実行していない運用保証。Schema validやID一致へ還元しない |

## #170の固定ケースと別例

[独立した保存版照合](evidence/historical-review.md)は、原会話とBD 0.26/0.27、Check 50→112→127件の実物を読んだ結果である。BD0.26→0.27ではWhen自体は変わらず、二つのResultに「訂正後も試合が続く場合」の開始接続と勝者決定時終了が明確になった。Checkの優先条件は会話n40/44/46に対応して一般保証CI-121〜123とCI-30/31/116〜120の例へ再編されていた。CI-41とCI-44/124〜127の一覧保証には重なりがあり、各境界の個別点検が必要。中間Checkが参照するBD0.22/0.28を手元の0.26/0.27との時点差だけで誤参照と断定していない。これは歴史版の独立読取りであり、今回新たに修復した実証ではない。

[備品貸出の独立レビュー](evidence/lending-independent-review.md)では原文・最終版A/Bを直接照合。L2/L3/L5の業務意味、Result→次のWhen、未決保持を確認した。人間合意のないCheck追加依頼では両版とも作成を止め、AIの模擬合意を人間の合意にしなかった。

固定oracleのL1/L4が求めた**型付きstateTransition文書は両出力とも作られていない**。三状態はBD本文に保持されたが、typed Stateの実Agent作成は未達。依頼文に別状態文書作成までの明示が弱く、Skill欠陥や差の根拠にはしない。oracleを後から変更せず、結果をPARTIALとした。型付きStateのCLI経路は既存fixtureで機械検証した。概念モデルの正式Skillは本Pluginに存在せず、実装済みと扱っていない。

## Check→Testの判断

| Check | 入力・観測・assertion・実行の対応 | 残る不足 |
| --- | --- | --- |
| CI-08 | 番号1本の入力と得点/累計assert、コピー上の実行を確認 | 代表例の成功であり、全ゲーム動作の承認ではない |
| CI-41 | 内部の日付/同日順/未投球のassert、一覧の両日文字列、追加CLI一覧観測を区別 | 同日2件・状態・勝者・未投球の全一覧行を直接assertしない。終了勝者の追加観測も未実行 |
| CI-63 | 実訂正から複数優先を作りwrite/read後A優先をassertするCore testを確認 | 既存対応表のCLITest単独は優先状態を作らない。実CLIの優先途中・別プロセス再開は未実行 |
| CI-71 | 写真/メモ0件でも別CLIプロセスで再開・次投球できた観測を確認 | 直接の自動回帰assertなし。物理的立て直しをCLIで検証したとはしない |

証拠不足を実人間の業務合意不足と混同せず、未承認期待から製品欠陥とも断定しない。詳細は[正式レビュー](evidence/implementation-review.md)と[保存せず返した準備メモ](evidence/followup-after-preparation.md)。元の研究Check・テストは不変。

実装品質のB観点では、凍結CLIに第三者ライブラリ/API依存はなく、関数の直接検査と21件の回帰を使える。新たなORM・レイヤー・依存削除の必要性は確認していない。B工程や高速化改修を追加しない。0.880秒という既存結果と0.835秒の再実行の差を最適化効果とは呼ばない。

## 先行PRの扱い

| PR / 調査head | 判断 |
| --- | --- |
| root #171 `6723e53d` / #172 `e2bdff06` | 独立維持。研究証拠として読み取り専用 |
| Alder #297 `8410b725` | 既存の部分採用候補。実測上の改善差を確認できず今回採用しない。無断改稿・mergeなし |
| Alder #258 `b6d559de` | 修復/未決/提案の分類は別の部分採用候補。#297とcanonical/shared adoptionの重なりを確認。統合判断は保留 |
| Alder #240 `94795a8a` | 独立維持。Activity/Object二視点の別機能。metadata base=mainに対し本文は#235固定head前提で、採否時に依存/base条件の再確認が必要 |
| Alder #300 `70913eeb` | Closed・未採用を維持。#160/#299の評価pilotを再開しない |
| Alder #296 `caa5e56e` / #301 `e950f32e` | Viewer系の独立目的。今回変更しない |

現時点で根拠付きのClose候補なし。先行PRの採否、base変更、merge、releaseは行わない。

## 検証と再現

- 修正前の保存器76件成功。新Role回帰は旧版で `Missing expected exception`。修正後77件成功。
- 独立CLI再検証、固定正常/負例14操作、隔離Plugin7件、affected bundle26ファイルのexporter再現成功。
- 最初のローカル76件実行は、取得前のfixture2ファイルがなく74成功/2 ENOENTだった。main固定SHAから不足fixtureを取得して76/76。製品・assertを緩めていない。
- ローカルGit cloneは利用可能な接続先で失敗。connectorから固定SHAを取得した部分作業コピーを使用。exporter用の公開commit/tree/25 source blobをGitHub APIから復元し、各Git object SHA一致後に既存exporterを実行した。これは完全cloneではない。全CIはGitHubの通常checkoutで確認する。
- 原典取得時の末尾改行の差でローカル重複資料1件の不変ゲートが失敗したため、固定時のbytesへ戻して再確認した。公開原典と固定した期待は書き換えていない。
- [証拠manifest](evidence/manifest.json)は各保存物のSHA-256を保持。固定入力11ファイルのbytes不変と結果IDの網羅、保証ID削除・ケース削除・結果1件脱落の検出を確認する。結果の網羅は意味上の合格を代替しない。

固定Roleの再現はrepository rootから実行できる。

```sh
node work/dogfood-guards/issue-302/reproduce-role.mjs tools/document_storage
node work/dogfood-guards/issue-302/reproduce-role.mjs plugins/alder/skills/alder-manage-json-documents/scripts/document_storage
node --test tools/document_storage/test-native-json.mjs tools/document_storage/test-storage.mjs tools/document_storage/test-authoring.mjs tools/document_storage/test-states.mjs tools/document_storage/test-roles.mjs
python3 tools/export_plugin_references.py --check --skill alder-manage-json-documents
```

旧版runtimeへ同じprobe/fixtureを渡すとvalidate/createの拒否assertが失敗する。新版は正例を保存し、誤診断commitを拒否してbytesを保つ。

## 未実証・採否

実証範囲は固定ケースでの2件の改善に限る。follow-up比較は各1回で、一般的な未知JSON処理の成功率・実クライアントrouting・導入済みPlugin更新・型付きJSONでの実人間合意付きfollow-up保存・人間の使いやすさ・全127件意味監査・一般状態/概念の生成は未実証。作者内部のレビュー実施は自己記録であり、別readerによる最終実物の評価と区別する。追加有料API、汎用評価基盤、新runtime、Husky、利用者Repoのsetupは追加していない。

DraftとしてChatへ返す。#173全体を全面Doneとはしない。修正2件の採否と#297/#258/#240の統合順が次のレビュー対象であり、merge/release/Closeには進まない。Plugin利用時のNode.js一本化はP1の別範囲として未着手。
