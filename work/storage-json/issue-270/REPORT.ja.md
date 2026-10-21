# 整形済み単一JSON Phase 2

## 結論と実施範囲

型付き単一JSONで、業務本文を独立フィールドへ分け、永続ID・文書版・Check/Findingsの参照を検査する小規模PoCは成立した。旧MDを読める既存parserとBusiness Graph v1は変更していない。Codexによる固定編集は初回のpatch適用失敗を保存し、明示した再試行後の6件で指定外の変更がないことを確認した。

**実ブラウザーでの読込・描画・IndexedDB保存・ダウンロードの検証は未完了**である。クラウドブラウザーが共有HTMLの`file:`実行をセキュリティポリシーで拒否したため、その操作を停止した。開発コンテナのlocalhostには接続できず、ローカルPlaywright用ブラウザーの取得も失敗した。迂回する公開デプロイは行っていない。`results/browser.json`に実行不能の証拠と未測定項目を残した。

この結果から、正式なJSON採用や容量上限の撤廃を決めることはできない。次に必要なのは、作成済みハーネスを承認済みブラウザー環境で実行し、読み込み後の資源・描画・保存の成立性を確認することである。

## 原典と型付き化

main `f3a045d9f55bb27b1289145fcdc5f6bd2df594a1`のAGENTS、BD構造、Graph v1、Check、版管理、Viewerのmain/source/check/session、返却指針を確認した。前回PR #269の固定commit `a2e841d049fa45a795e99b16ff4a053805474180`を読み、そこから次の3原典を同じバイト列で凍結した。原典hashは`inputs/manifest.json`、仕様・実装のhashは`results/authority.json`にある。

| 文書 | 固定した入力・扱い |
| --- | --- |
| 現在の購買BD | PR #254固定原典`6e55d987…`。7 Object、5 Activity、4 Findings。未合意の草案 |
| Checkの原典snapshot | Plugin 0.4.8 tagの旧購買BD。4 Activity。現在の購買BDへ同一性や合意を推測して統合しない |
| Check見本 | Plugin 0.4.8 tag `9b4a3cb…`内の`meaning-validation-20261018/purchase/final.md`。6 ID、4共通保証、4比較表。見本が主張する原典リンク`c2852531…`の意味対応は未確認 |

Checkは明示的に旧snapshot文書ID・版を参照する。現在の購買BDにCheckを再生成した成果ではない。既存Checkの5件の未レビュー、1件の要確認、Test証拠の未収集を保持した。新しい業務上の確認済み状態を付与していない。

| 部分 | 型付き試案 | 保持・限界 |
| --- | --- | --- |
| Activity | `name/scope/why/when/who/where/procedure/exception/result/problem/painLevel` | 文章は文字列のまま保持。MD行配列の包みではなく、欄ごとに編集・検査する。Whatはname |
| Object | `name/scope/icon/information[]` | 草案のMedium/SR Dependenciesは`draftAnnotations`へ保持し、Graphに追加しない |
| 関係 | `id/kind/fromId/toId/label` | Input/Output/例外をID参照で一度だけ保存。対象型と文書境界を検査 |
| Findings | `sourceId/kind/status/scope/targetIds/summary/content` | 元のF01等と状態を保持。ターゲットはIDへ変換。自由記述中の名称や歴史説明は自動改稿しない |
| Check | `id/title/reviewState/fields`、明示的なActivity index | condition/expectedResult/guarantee/evidence/derivation/related/testEvidence/question等を区別。一般保証は例だけに置換しない |
| 共通保証・例 | guaranteeのprose/example blocks、exampleのcolumns/rows、rich reference spans | 見出しfragmentから安定ID参照へ変換。共有JA-EX-04は単一本文を2業務から参照。論理条件を新DSLへ推測変換しない |
| 根拠・原文 | HTTPSリンク、旧版のimmutable `archives` | 原文全文とdigestを保持。編集後の表示は型付き値から作る。archiveは旧版の証拠で、現在の値を上書きする第2正本ではない |

自由記述・prefaceはMarkdownを含む文字列である。文章まで形式言語に変換したわけではない。すべての意味を機械判定できると主張しない。今回の固定入力で未解析の見出し・Check欄は0件。任意MDでは未対応欄を黙って破棄せず、診断と原文保持で保留する必要がある。

`schema.json`はJSON Schema 2020-12の構造案、`core.mjs`はその使用subsetと文書間参照を検査する実装である。未知フィールドは拒否する。汎用JSON Schema engineを新規に配布する意図はない。

## ID・参照・版

| 概念 | 今回の扱い |
| --- | --- |
| 保存契約 | `format: alder-typed-storage-poc`、`formatVersion: 0.2-poc`。実験用で正式仕様ではない |
| 要素ID | 初回importでUUIDを発行し`identity-map.json`へ保存。以後のJSON改名・並び替え・更新で再発行しない。Check IDは元のJA-EX値を保持 |
| importの対応 | 原典hashが不一致なら停止。登録キーに初期見出しを使うが、それは凍結した初回対応表の索引であり、変更後の名前からIDを再生成する規則ではない |
| 文書版 | package revisionと各document revisionを分離。CheckのbasedOnは文書IDと正確な版を持ち、版が変わると自動追従せず停止 |
| 製品版・Graph | Alder製品版と独立。Graphは従来どおり`version:1`、id=表示名の投影。永続IDをGraph idへ流用しない |
| 更新 | `update`は旧document revisionを前提条件にし、ID置換を拒否して全体検査後に新しい値を返す。旧BDだけ改名しCheck参照版を放置する更新は拒否 |

改名・再順序・serialize/reloadでUUID集合、関係先、Findings対象、Check共有を保持できた。原文の引用に残る旧名称は今回の固定課題で明示的に保持した。型付き参照が通ることは、自由記述の名称まで追従したことを意味しない。

単独のJSON検査だけでは、過去のIDをすべて一貫して置き換えた変更を識別できない。永続ID維持は更新APIと変更前後の比較で確認した。正式保存機能には履歴・期待版との照合が必要である。元MDに永続IDがないため、任意のMD更新を再importして同一性を確定する機能は未実装である。

未知formatVersion、未知kind、壊れたJSON、重複キー・ID、欠落/型違い/別文書参照、Check原典版の不一致、比較表の列欠落を拒否した。例外の自己再開とCheck/保証の参照循環は、一律に禁止せず有限の検査として処理する。業務的妥当性や人間の承認をvalidatorが判定することはない。

## 容量と通信経路

**現行ViewerのローカルBDはサーバーへアップロードしていない。** `File.text()`→`parseDesign()`→表示状態の更新で処理し、セッション保存はブラウザーIndexedDBを使う。URL取得は別の入力経路である。`results/capacity-audit.json`に対象コードと行を残した。

| 現行経路 | 2MiB検査 | 確認方法 |
| --- | --- | --- |
| ローカルBD | File読込経路に明示的検査なし | main.tsのaddFileを現物確認。Node File.text＋既存parserで2MiB超を読め、fetchが呼ばれない検査を実施。実ブラウザーの描画・保存は未検証 |
| URL BD / Check | Content-Lengthと取得streamのUTF-8 bytes | production `fetchMarkdown`のHTTPS、MIME、宣言長・stream長をNode Responseで検査。実際のブラウザーCORS/HTTPS通信は未検証 |
| テキストBD | 入力後のUTF-8 bytesで2MiB | main.tsを現物確認。File経路との相違を記録。ブラウザー入力操作は未検証 |
| ローカルCheck | File.sizeで事前検査、Check parserも2MiB | main.tsとparseChecksを確認し、parserの上限拒否をNodeで実行 |

2MiBという数値の根拠は、確認したコードには示されていない。サーバー送信の制約とする根拠はない。ローカル処理でも、解析・DOM・レイアウト・複製・IndexedDBの資源は有限なので、容量の議論自体を不要とはできない。

PoCは全経路の仮予算16MiB、Activity/Object合計5,000、worker 5秒、取得30秒、表示リスト100件・読取見本5要素を置いた。ローカルはFile.sizeで読込前、URLは宣言長とstream bytes、テキストはUTF-8 bytesを検査する設計である。解析・検査はworkerへ分離し、中止・古い結果の無視・保存完了時の通知・最後の表示保持を実装したが、**ブラウザーでの動作は未確認**である。

これらは検査用の仮値で、本番推奨値ではない。Node workerで要素数拒否とthread終了を確認しただけでは、ブラウザーで5秒・5,000件が妥当とは言えない。メモリ測定はブラウザーによって利用可否や精度が違うため、未実測のメモリ値だけで容量予算を置き換えない。ブラウザー結果が得られるまで本体の上限変更は保留する。

## 実測と実ブラウザーの停止記録

実ブラウザーのFile読込、URL読込、DOM/paint、IndexedDB、download/reload、キャンセル、CORS、メモリはすべて未測定である。UIが動いている画像や結果を作って代用していない。

- ローカルPlaywright: browser未導入。公式downloadのzipが0 bytes/破損で失敗。
- Cloud Chrome→開発コンテナlocalhost: `ERR_CONNECTION_REFUSED`。
- Cloud Chrome→共有file HTML: browser security policyが`file:`を拒否。http/httpsだけ許可されるとの明示的拒否後、この経路を停止した。raw CDP、別URLへの偽装、公開配信による回避は行っていない。

以下は**Node CPU/ディスクの計測だけ**である。2 warmup＋5回、中央値と生値・min/max・Node/V8・実装hashを`results/node-performance.json`に残す。1,000 Activityは現在のBDの原文を反復した合成入力で、元の5 ActivityとFindingsを保持し、Objectを共有する。旧BD/Check・旧原典archiveも同梱した。業務モデルの正しさを検証する入力ではない。

<!-- NODE_TABLE_START -->

| Activity数 | UTF-8 bytes | ディスク読込 ms | JSON解析 ms | 型・参照 ms | 索引 ms | Graph投影 ms | JSON化 ms | ディスク保存 ms |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 5 | 153,406 | 0.601 | 1.645 | 1.158 | 0.018 | 0.110 | 0.303 | 0.266 |
| 100 | 611,348 | 2.092 | 4.459 | 3.943 | 0.093 | 1.523 | 1.041 | 0.651 |
| 1000 | 4,960,149 | 18.765 | 34.627 | 39.208 | 1.285 | 19.424 | 10.452 | 5.097 |

<!-- NODE_TABLE_END -->

JSONは重複キーの事前走査＋native JSON.parse、型/参照検査、Graph投影を分けて測った。ディスク保存はブラウザーIndexedDBの代用ではない。Node process memoryのsnapshotも保存したが、ブラウザーのpeak memoryではない。旧parserの時間は同内容のGraph互換MD投影に対するもので、画面描画や人間の保守性の比較には使わない。

同一のbundle workerロジックをNode worker threadで実行し、小規模・4.96MB入力の処理、低い要素予算での拒否、1msのNode側期限によるthread終了を確認した。起動とデータ転送を含む時間も別に保存した。この結果をブラウザーworkerやGUIの成功へ読み替えない。

## Codexによる固定編集

`edits/protocol.md`でWhy、Activity/Object改名、Check状態変更の3課題を固定した。この同一CodexセッションでMD→JSONの順に編集し、作者は形式とoracleを知っている。別モデル・Fresh・blind・大量比較ではない。実効variant/effortの独立確認、推論時間、トークン費用はない。

初回の6ファイルbatch patchは、確認していないsectionIdを文脈へ含めて適用を拒否された。全ファイルが未変更だったことを確認し`edits/first-attempt.json`へ保存した。初回6件成功とは報告しない。その後、実際の文脈を読んだ上で6件を個別patchとして再試行した。

<!-- EDIT_TABLE_START -->

| 課題 | 方式 | 追加/削除行 | 変更行bytes | 構文・参照・目的 | 指示外変更 |
| --- | --- | ---: | ---: | --- | ---: |
| why | md | +1/-1 | 263 | 合致（再試行） | 0 |
| why | json | +1/-1 | 303 | 合致（再試行） | 0 |
| rename | md | +4/-4 | 378 | 合致（再試行） | 0 |
| rename | json | +2/-2 | 151 | 合致（再試行） | 0 |
| review | md | +1/-1 | 84 | 合致（再試行） | 0 |
| review | json | +1/-1 | 82 | 合致（再試行） | 0 |

<!-- EDIT_TABLE_END -->

表は明示した再試行後の結果。すべて構文・参照・目的に合致し、指示外変更は0だった。JSONでは全IDを保持した。MDには永続IDが符号化されていないため、同じ保証はできない。JSONの改名は宣言2箇所、MDは宣言と参照4箇所に差分が出た。Whyと状態変更は両方式とも1行ずつである。

機械採点は編集後に実施し、期待する変更以外との一致を確認した。`audit-edits.mjs`は採点用であり、Codexの編集を代行していない。差分全文を`results/edit-*.patch`へ保存した。「読みやすい」の評価は作者所見に限り、人間の誤読率や実務の編集成功率は測っていない。1度のbatch失敗と再試行6件という少数・非独立の結果から、JSONのAI編集一般優位は結論しない。

## 旧MD互換と4成果物への境界案

- 旧MDは既存parserを維持した経路で読み続ける。新JSONの識別・版検査adapterを別経路にし、未知版のJSONをMDへ自動fallbackしない。
- 新JSONから従来Graph v1へ投影し、Procedure・Findings・Check・草案注記をGraphへ追加しない。正式Graph validatorで照合し、旧MDと現在のBDの互換投影が同じGraphになることを確認した。注記を除く投影は原本や採用済みBDの代わりではない。
- MD→JSONは別出力とし原本を残す。原典digest、欄・参照・状態・未決の対応を確認してから導入する。任意MDとのbyte完全一致往復や、改名後のIDを保存するMD書式は未実装。
- 将来は`documents`のkindとpayload契約版を拡張し、BD／Check／状態遷移／概念モデルを論理的に分けて同梱する案を残す。document revisionは内容版、formatVersionや将来のpayload versionは互換性の版として分ける。今回のreaderは未知kindを拒否し、後二者の内容・Schema・業務意味は定めない。
- 通常保存では型付き値を正本とし、immutable archiveはimport証拠として区別する。原文を永続同梱する必要性・容量コストは未決であり、確認後に省略できる設計を検討する。

今回の変更先は独立PoCディレクトリだけ。現行Viewer、Plugin/Skill、正式BD/Check、Graph v1、PR #254/#266/#269、別研究の状態遷移・概念モデルを変更していない。

## 次に必要な検証

実ブラウザーの検証可能な環境で、ハーネスのFile/テキスト/URL、2MiB超、未知版・破損・遅延の表示保持、中止、IndexedDBの失敗・復元、download/reload、低メモリ端末を確認する。実UIの証拠が得られるまではPhase 2全体が完全に実証されたとは扱わない。

その後に、永続IDと旧MDの同一性対応、Checkの原典主張とsnapshot/合意版、4成果物のpayload版、出力archiveの要否、同時更新・原子的保存を検討する。スキーマ上の整合と人間が合意した業務意味は引き続き区別する。正式採用・merge/release/deployは今回行わない。
