# Gate C：型付きJSONを実Viewerでレビューする

Gate BのJSONをMarkdown文書へ戻さず、実際のViewerの図・一覧・右Drawerへ直接投影する候補を実装した。人間は業務の意味と採否を確認し、更新はPluginへ依頼する。Viewerは読み取り専用のまま。**本人によるJSON固有の実画面操作レビューは未完了で、採用・merge・release・公開はしていない。**

結果・最終CI・操作確認用artifactの正本は[Alder #274](https://github.com/mk3008/alder/issues/274)、実装は[Draft PR #279](https://github.com/mk3008/alder/pull/279)。この文書は実装範囲と再現方法を示し、各CIの実際の結果はIssue/PRの固定headへの参照で確認する。

## 基準と境界

- Control: root #144、Execution: Alder #274。最新AGENTS、Goal/Done、Viewer検証規則と[Chatレビュー](https://github.com/mk3008/alder/pull/279#pullrequestreview-5610683239)を確認。
- Gate A `98b95f69838cadde9db388da0875b8d588a09faa`、Gate B `b498ddb6a02de44aca6fc27d535febe4cafd0315`。Gate Bからの独立stack `feat/274-viewer-json`、PR #279を継続。
- Gate A/BのPR、保存Schema候補0.1、Plugin、正式BD/Check、Business Graph v1 exporter/validatorは変更していない。
- 初回ラフの記録と単体HTMLは`rough/`の履歴資料。**現在の確認版はGitHub ActionsのPreview artifactを使う**。古いrough HTMLを最新コードの証拠としない。

## 実装と依頼の対応

| 対象 | 実装・拒否境界 |
| --- | --- |
| 読込 | File/HTTPS URL/テキストでMDとJSONを判別。Gate Aのbrowser-safe parser/validatorだけを利用し、Node-only authoring/convertはrendererへimportしない。重複キー・深さ・構造/参照/版を検査 |
| 内部表示 | JSONのActivity/Object/関係から既存の画面モデルへ直接投影。全体図と1-hop Activity詳細は既存の計画器・DOM・操作を共用。表示要素数をサンプルの6件に固定していない |
| IDと名称 | 図・選択・配置・詳細タブは永続IDで結ぶ。タブ・Finding対象・関連項目・線のtooltipは表示名を使う。Findingの表示上の原典IDと永続IDも分離 |
| 業務内容 | 前置き/Scope、5W1H、Procedure/Exception/Result、入出力、Object情報、Problem/Pain、Findingsを表示。旧MD全文は同梱せず、JSON原文をそのまま保持 |
| Check | 同じJSON内の複数Check文書を表示。Activity indexの共有ID、一般保証/比較例/根拠/Test証拠/未決/人間状態を保存値どおり表示。文書全体・未割当項目も既存Drawer内に表示 |
| 確認状態 | `basedOn.verification: unverified`を維持。ID・版の一致を人間合意と称さない。Checkの未レビュー/要確認/確認済み/要修正は変更しない。別の外部原典BDのCheckは現在の図に関連付けず理由を表示 |
| 原文・更新 | 原文はJSONと明示して読み取り専用。MD生成・同期・JSON直接編集UIなし。URL/端末の読直しは同じ保存commit境界で行い、IDを維持した改名/再順序で配置と選択を引継ぐ |
| 保存 | 既存Workspace/IndexedDB/CAS・失敗時の描画保持を共用。旧`Design.markdown`は原文を格納する互換名で、JSONのときは中身もJSON。復元時は原文を再検査・再投影し、保存済み派生Graph/Check cacheを信用しない |
| 互換性 | 旧MD parserとGraph v1の名称ID契約を維持。JSONの永続IDを持つ内部図は公開Graph v1 exportではない。Graph v1への既存投影APIはGate Aのまま |

原文中のHTML/画像/リンクは実行・自動取得しない。一般保証・例への参照は必要時に展開し、循環で再帰描画し続けない。保存したCheckをViewer内で承認する操作は追加していない。

## 実Chromeの最初の表示証拠

Viewer本体がラフheadと同じcommit `5978990fe99f06ec21c86c956089b4b0c095bf9d`で、[CI #39743408200](https://github.com/mk3008/alder/actions/runs/39743408200)成功。Chrome `155.0.8059.39`、1280/393px、JSON固有1群＋既存40群の**全41群成功**。実JSON Fileから図6要素/6関係・一覧・Activity詳細・Findings・Check/保証/例・詳細タブ・再読込を確認した。pageErrorsなし、非GET通信なし。

`evidence/initial-5978990/`にPC全体図・スマホCheck画面・raw結果JSONを保存。これらは**初回表示の証拠**で、後続コードの最終画面や本人の操作確認の代用にはしない。[初回artifact](https://github.com/mk3008/alder/actions/runs/39743408200/artifacts/12410473114)には全10画面と結果がある。

最初の追加CI #39742195521はフォント取得で長時間停滞し、次commitによる自動キャンセルとなった。導入済みのNoto CJKを先に確認し、未導入時の公式apt取得に待ち時間上限を設定。Noto CJK実在検査と全体のassertは維持して再実行した。

後続CI #39747716690ではUbuntuミラーからの61.2MB取得が2回とも時間切れとなり、Chrome検証は未実行。以後は公式Noto配布元の固定commit `f8d157532fbfaeda587e826d4cd5b21a49186f7c` の日本語Regular OTF（16.5MB）を使用し、Git blob SHA `f56224957fb13a81b4c14bac34f2f058a017f9fb` とfontconfigの実在検査を必須とした。取得には接続/全体時間の上限を持たせる。JSON先行3群と全43群を両方実行する最終ジョブの上限は20分とし、assertを減らさない。

過去のCloud Chromeのlocalhost接続失敗/data URL拒否を迂回していない。今回の画面は本人が明示した、既存GitHub Actions runnerの通常HTTP/Chromeで取得したもの。

## 検証の再現

`web-viewer/`でNode24を使う。

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm test
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

Chrome・Playwright1.56.1・日本語フォントを用意した環境で、別ターミナルから次を実行する。既存CIの最終候補では全体を実行する。

```sh
npm run test:browser -- --cases jsonDocuments,jsonBoundaries,jsonOfflinePreview
npm run test:browser
```

- `jsonDocuments`: File、図・一覧・Object/Activity詳細、Findings、人間状態、一般保証/例・共有Check、詳細タブとnative再読込、PC/393px、旧MD画面の比較。
- `jsonBoundaries`: JSON原文readonly、未知format/kind/schema・不正構文/参照/版ずれ、2MiB超のFile表示/保存、各入口の容量差、MIME/HTML/CORS/HTTPエラーとキャンセル、実GitHub HTTPS/CORS匿名読込、更新後ID/配置/選択/版、保存済み派生cacheの破損、native保存失敗時の未commit描画拒否。
- `jsonOfflinePreview`: 配布する**同じ**単体HTMLを実Chromeのfile originで開き、JSON読込・再読込・CheckとPreview専用IndexedDB、外部通信なしを検証。

手元のNode/DOM全体は77 test-runner cases成功（活動/preflightも実行）。`results/node-dom-summary.json`にcommand/exit/count/所要時間/元stdout digestを保存。既存Graph52試験も成功。これらのNode/DOM結果を実Chrome結果と混同しない。

復元について、原文から再投影した結果を一時検査だけで終え、DocumentStateへ反映しない経路を修正した。`results/restore-regression-control.json`に、修正前7fb70e4のmain.tsをoverlayした対照試験が「偽の表示名を使わない」assertで失敗する証拠を保存。修正後は同じ回帰が成功し、原文の人間状態を復元する。

## 容量と負荷の扱い

| 入口・対象 | 候補Viewerの挙動 | 根拠と限界 |
| --- | --- | --- |
| URL本文 | 既存2MiB、30秒、HTTPS/匿名/CORS/redirect拒否を維持 | Content-Lengthに加え受信本文の実バイト数を検査。ネットワーク/展開後の読込負荷を既存どおり制限 |
| テキスト | 既存UTF-8 2MiBを維持 | 閲覧用貼付け経路。大きな文書はFileへ分離 |
| ローカルJSON | **暫定8MiB**、Fileのsizeを読取前に検査し、内容判別後にもUTF-8 bytesを検査 | upload制限ではなく同期parse/validation/DOM/IndexedDBの保護。2.1/4MiB級をChromeのFile→表示/保存で計測する試験を追加。8MiBを安全性の保証や正式形式の上限としない |
| 構造・図 | 配列/オブジェクト10万、図2000要素・5000関係を超える入力は拒否 | 保存Schemaと独立したViewerの予防的budget。最大規模の図を快適に描画できると実証した値ではない |
| Check参照 | 遅延展開、循環の明示、深さ16・一描画5000単位のbudget | 上限時は未表示の内容があると通知し、原文確認へ案内。黙って網羅表示したことにしない |

`results/node-size-observations.json`は約2.2/4.2/8.4MBの単発Node観測であり、ブラウザー性能の代用・一般ベンチマークではない。ChromeのFile→描画/保存の時間はartifactの`boundary-results.json`に残す。Worker化・大規模グラフの描画/メモリー測定・上限調整は残る。

## 操作用確認版と未完了の採否

最終の成功CIから`viewer-preview-pr-279-HEAD` artifactを取得し、フォルダー構造を保って展開する。同梱READMEに通常HTTP版とオフライン版の開き方、固定JSONを案内する。`manifest.json`はsource/checkout/treeと各ファイルのdigestを持ち、PR headとビルドtreeの一致を検査する。HTML単体にもビルドしたJS/CSSを変更せず同梱し、デプロイしない。

保存先は`/preview/pr-279/HEAD/`に対応する専用IndexedDBで、本番の保存領域を使わない。file originからHTTPSを読む場合は取得先が`Origin:null`を許可する必要があり、通常のURL操作はHTTP版で確認する。OSのファイル管理・ネイティブpicker権限・実スマートフォンでの操作は別の本人確認として残る。

artifactの保持期間は14日。期限後は同じsourceから再現が必要。画面キャプチャ・自動テスト・AI目視は本人操作の代用にしない。新しいUI配置や導線の採用は行っていない。

未決：本人によるJSON固有の見え方/共有保証・表/未確認表示の理解と操作感、暫定budgetの採否・大規模性能。複数BD、別BD参照Checkの関連付け、状態遷移/概念モデルの正式Schema・表示は未対応。正式JSON v1・main merge・Plugin release・公開Pages/その他の本番デプロイは実施していない。全体Goalは引き続き未完了。
