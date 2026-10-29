# Phase B: Plugin・同梱runtime・実Agent検証

Phase B実装候補を[Draft PR #311](https://github.com/mk3008/alder/pull/311)で返却する。[Execution #310](https://github.com/mk3008/alder/issues/310)。Phase A PR #309の正式受入head `85ed1d14b0e6cc0cdc9c62f6e4ac37d8b187acf8`から分岐し、PR baseは`feat/177-d2-json-contract`。未マージのAとBを別差分でレビューできる。mainへの統合は行っていない。

## 実装と契約保持

- 新規JSONはpackage 0.5 / BD schema 0.4。JSON管理・草案・レビューSkillとcanonicalガイドを整合し、共通Data・Information所有者、主体/Role兼任、Step担当/義務/適用条件/局所順序、Result 1..Nを扱う。同梱`structured.mjs`を追加し、既存Node Validator/保存ガードをbyte-identicalで配布候補へ取り込んだ。新依存・第二Validatorなし。
- 旧0.4は旧形式のまま、旧0.1〜0.3/MDは既存互換境界。0.4→0.5は構造化BD全文を明示してBD-onlyの別packageへ作成し、旧BD＋Check/Stateは元packageに保持する。0.5通常更新でも既存basedOn変更を禁止する。旧例外全文の保全とexceptions[]正本、既存ID/所有者/参照を維持する。Result.condition保留、Activity横断順序なし。
- Phase AのSchema/Validator/構造/保存ガード・固定候補・検証正本の9ファイルを受入headとbyte比較し不変を確認した。[機械検証記録](mechanical/evidence.json)。通常Viewerの変更なし。
- canonical sourceを先にGitHub branchへ公開・取得確認し、そのcommitから既存exporterでbundleを生成した。最終同梱sourceは`f2716613a1fb65236ac1c30ec1eab221ef576392`。`--check`は2 Skill・33ファイルを厳密照合。manifestの製品版は未リリースの候補でも0.4.9のままであり、実行版はsource commitで別途識別する。公開Release/アカウント登録版/ロード版の更新は含まない。

## Gate Bの原因と復旧

旧provenance source `11848cae45a171a1a49ac6e0542b2bd7cac89b16`はmainの祖先ではなく、全履歴checkoutでも取得されなかった。exact SHAのfetchは成功し、旧bundleの25ファイルもそのsourceのbytes/digestに一致した。source消失やchecksum不一致ではなく、Gate Bだけが既存のexact-source取得工程を欠いていた。[詳細](provenance-evidence.json)。

Gate Bも既存`fetch_plugin_sources.py`で全provenance SHAを取得・commit identityを確認してから検査する。source/branch/tagを代替せず、参照不能なら失敗する。main祖先外のsource取得、存在しないSHAの拒否、全3検証workflowでfetchがテストより前にあることを回帰検査する。sourceはGitHubの候補branch/PR履歴から取得可能なcommitに固定し、生成元をworking treeへ差し替えない。

候補`47a458ce`では[Gate B](https://github.com/mk3008/alder/actions/runs/40888207453)・[Plugin package](https://github.com/mk3008/alder/actions/runs/40888207439)・[Release検証](https://github.com/mk3008/alder/actions/runs/40888207432)がsuccess。最終返却headとその全runはPR/Executionの返却コメントで固定する。Release workflowはPRの検証だけで、公開jobは実行していない。

## 検証の種類と結果

| 種類 | 確認したこと | 結果・根拠 |
| --- | --- | --- |
| canonical Node回帰 | A契約の正負例、移行、保存、旧互換、ID/参照/所有者 | 92 pass、fail/skip 0。[ログ](mechanical/node-92.log) |
| 隔離bundle・export/fetchの機械テスト | repo/Pythonなしの直接JSON、0.5作成更新、合意なしCheck拒否、Check/State単独・双方rebase拒否、保存失敗の保全、厳密bytes | 22 tests OK。[ログ](mechanical/installed-export-fetch-22.log)。存在しないSHAのfatal出力は意図した負例 |
| Plugin全体 | 既存Skill/参照/パッケージ/Release境界 | 84 tests OK。[ログ](mechanical/plugin-package-84.log)。既存CI同様に歴史fixture2 commitをfetch後に成功 |
| 旧Graph | 既存変換挙動 | 52 tests OK。[ログ](mechanical/graph-52.log) |
| 実Agent・作成 | Skillを実際に読み、自然文から直接0.5草案、create/commit/inspect/validate | 保存成功。[入力](intake.ja.md)／[作成記録](agent/create/evidence.json) |
| 実Agent・更新 | Role改名、ID/色/参照/未決保持、期待hash/版付きcommit、読戻し | 成功。[更新記録](agent/update/evidence.json)。別reviewerでも差分を検証 |
| 実Agent・意味レビュー | read-onlyの別Agentが原資料と保存JSONを照合し、作成Agentが修正、同reviewerで再照合 | 1指摘→修正→新たな重要な指摘なし。[初回](review/initial.ja.md)／[再レビュー](review/re-review.ja.md) |
| 実Agent・合意ゲート | 合意なしCheck作成/確認済み化、未採用State候補の確定 | 保存前にAgentが停止。[記録](agent/update/gates-evidence.json)。runtimeでの拒否観測とは区別 |
| 実Agent・無確認rebase | 旧Check確認済みとStateのbasedOnを新BDへ付替える要求 | Agentが保存前に停止。旧seed全bytesと旧状態を保持し、BD-only別草案だけ保存。[記録](agent/rebase/evidence.json)。runtime負例は別の隔離bundle機械テスト |
| 実Agent・保存失敗 | 不正JSON、外部lock、古い期待hash、既存targetへのcreate | 実CLI全4件exit 2。target/candidate/外部lockのbytes保持、残留temp/所有lockなし。[記録](agent/failure-probes/evidence.json) |

テスト群は重複を含み、件数を合算して一意テスト総数とはしない。機械テストの模擬BD合意/確認済みfixtureは実運用の人間合意ではない。

## 実Agentの版・入力・到達点

新規作成は公開済みPlugin snapshot `f496c76dfd7504a3a031bcaaa506a1d0012cf860`、更新・ゲート・レビューは`47a458cef88bc17c242da23f74d79789566e563a`の隔離copyを使用。両版のruntime bytesは同一。差は草案Skillの句読点、契約内の固定sourceリンク、provenance pinのみ。本人の個人Pluginは変更していない。

最初の候補はIcon表記をValidatorに拒否され、表示metadataを修正して保存した。同一Agentの自己点検後も、独立reviewerが「後続で読む来訪日の台帳記録とのつながり」を指摘した。原資料の希望日＝来訪日という値対応を既存登録手順へ明示し、別操作・担当・順序制約を追加せず修正した。一発成功やSchemaによる意味保証とは扱わない。

最終保存は`package-4 / bd-4`、[JSON](agent/review-revision/business-design.json)のSHA-256は`b520831a2869c2bb045bb370b82dd26fb94ec4cbac6f2b29e4e4d4050ac12cfe`。通知失敗時の扱いはopen Findingのまま。改名ではRole名と版情報だけ、再レビュー修正ではStep 1本文と版情報だけが変わった。全入力hashはレビュー前後で一致した。

実行prompt全文、許可/禁止入力、requested model/effort、fork、公開pin、限界は[agent-runs.json](agent-runs.json)。authorは親設定継承、独立reviewerはAGENTS指定の`gpt-6-sol / medium / fork none`。effective設定は独立にattestしていない。再レビューは初回reviewerの文脈を継続し、authorの内部点検記録は渡していない。

## 再現

このbranchのcheckoutでNode 24+を使い、次を実行する。元fixtureや正本を変更せず、一時ディレクトリで実Agentの保存候補を再実行し、同じhashと失敗時保全を検査する。

```sh
python3 work/plugin-json/issue-310/replay.py
python3 tools/fetch_plugin_sources.py
python3 tools/export_plugin_references.py --check --skill alder-manage-json-documents --skill alder-review-business-design
python3 -m unittest tools/test_json_plugin.py tools/test_export_plugin_references.py tools/test_fetch_plugin_sources.py
```

replayは作成・改名・レビュー修正の3版を同じhashで保存/読戻しし、4失敗例でも全bytesを保全して成功した。Agent推論そのものの再実行は公開promptと入力から行う。非決定的な推論結果のbyte再現を約束しない。

## 未検証・境界

- 限定した架空の1ケースであり、一般的な推論品質、実業務の妥当性、人間合意、状態遷移の網羅性を実証しない。Stateの機械検証も人間の合意を認証しない。
- 実際に候補Skillファイルを読み実行した検証であり、アカウントPluginの自動routing/ロード版、個人環境での導入成功はNOT_VERIFIED。Phase Dで別途確認する。
- 通常Viewerの0.5統合・GUI・Phase C/D、main merge、タグ、GitHub Release、公開/配備、同一ID PRIVATE個人Plugin更新は未実施。
- 新版Check/Stateの意味再照合専用フローは追加していない。旧同意を新BDに継承する権限として扱わない。
- 今回は実際にValidatorと意味レビューで失敗/修正を観測できた。新たな一般ルールを追加せず、既存のreview/revision loop・保存guard・source照合を使用した。

Phase Bの実装・限定検証候補をChatレビューへ返す。採用・マージ・公開の承認とは別である。
