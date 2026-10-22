# Viewerの変更を検証する

修正中は、変更した機能と隣接する操作を先に検証します。そこで失敗を直してから、一まとまりの候補をpushします。PRのCIは全体検証を行います。同じPRへ新しいcommitをpushすると、古いCIはキャンセルされます。

## 変更から検証範囲を選ぶ

最初に `git diff --name-only` と実際の差分を読み、変更した関数・DOM・CSSを利用する箇所と、そのテストを確認します。ファイル名だけで影響範囲を決めません。次の表は修正中の選択の出発点です。依存関係に応じて対象を追加します。

| 変更した振る舞い | 先に実行するブラウザ検証群の例 | 対象を広げる条件 |
| --- | --- | --- |
| ヘッダーのボタン・メニュー | `headerControls,gettingStarted,documentActions` | 高さ、共通フォント、画面全体の余白が変わる場合は全体 |
| チェックリストの読込・右Drawer | `relatedChecks,nodeDrawer,drawerOpeningFocus` | 文書読込・保存・選択処理を共有する変更は、その関連群も追加 |
| 図の設定・画像出力 | `toolbarSettings,layoutReset,graphPng` | 図の寸法・座標・共通レイアウトが変わる場合は全体 |
| 原文編集・反映 | `markdownEditor,editorViewport,documentActions` | 保存・復元へ影響する場合は保存関連群も追加 |
| 保存・復元・複数タブ | `saveState,sessionConcurrency,saveConflictNoop,lifecycleSave,savedStatePreflight` | 保存形式・共通状態の変更は全体 |
| テスト1群だけの手順・待機 | 変更した群 | 共通helper・runner・fixtureも変えた場合は全利用群 |
| 共通CSS・HTML構造・グラフ計算・依存関係・検証基盤、影響不明 | 全体 | 限定検証だけで完了扱いにしない |

関連するNode／DOMテストも先に実行します。各 `web/test-*.mjs` の起動方法は `package.json` の `test` を参照します。型や本体コードを変更した場合は `npm run build` で型検査と配布ビルドを確認します。

## 対象を指定して実行する

`web-viewer/` で実行します。検証群の一覧と選択結果は、ブラウザーを起動せず確認できます。

```sh
npm run test:browser -- --list
npm run test:browser -- --list --cases headerControls,gettingStarted,documentActions
```

実画面の検証には、Node 24、Playwright 1.56.1、Chromeと、日本語スクリーンショット用のフォントが必要です。CIと同じセットアップは [workflow](../.github/workflows/web-viewer-once.yml) を参照してください。Playwrightを別ディレクトリへ入れた場合は `PLAYWRIGHT_MODULE` にその絶対パスを指定できます。Chromeの既定位置は `/usr/bin/google-chrome` で、`CHROME_PATH` で変更できます。

まず現在のソースをビルドして、別ターミナルで配布版を起動します。コードを直した後は再ビルドします。

```sh
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

起動できたら、選んだ群を実行します。

```sh
npm run test:browser -- --cases headerControls,gettingStarted,documentActions
```

名前は完全一致です。未知名、空の指定、未知の引数は失敗します。選択した群の中の検証やassertは省略しません。失敗しても後続の独立した群を実行し、最後は非ゼロで終了します。

## Node／DOMテストの実行方式

`npm test` は、実行方式を確認する回帰の後、通常の56ファイルを[Node標準test runner](https://nodejs.org/download/release/v24.15.0/docs/api/test.html#test-runner-execution-model)の独立プロセスで最大2本ずつ実行します。共有のメモリーやfake IndexedDBを使い回しません。ファイルごとのケースとassertは変更せず、失敗したファイルがあっても同じバッチの後続ファイルを実行し、最後は非ゼロ終了します。引数が必要な3つのブラウザpreflightは、従来どおり `--preflight` を付けて実行します。ブラウザ全43群の実行方式は変更しません。

CIのjob数・runner・依存関係を増やさず、並列数は2に固定します。Linuxでの比較の再現は [benchmark.py](../docs/evidence/viewer-node-runtime-121/benchmark.py) を使い、`--baseline` に変更前のcommit、`--output` に結果JSONの出力先を指定します。[計測結果と判断](https://github.com/mk3008/alder/issues/232)はExecution Issueに記録します。

## 配置・破線をブラウザーなしで反復する

配置、接続点、戻り線の交差、破線の位相は、次のコマンドでHTTPサーバー・Chrome・Playwright・外部取得なしに確認できます。

```sh
npm run test:layout
```

全体図とActivity詳細は `matrixPlan` を共用します。対象Activityは同じ計画器の投影条件として指定し、通常のOutput Objectを例外Activityより先に配置します。非Alderグラフ用の汎用DAG配置はfallbackとして残します。

この検証は公開サンプルの座標、役割別ポート、独立した経路／交差の判定、長いグラフ、両軸・両方向・負座標での破線位相を検査します。通常の `npm test` にも同じ回帰を含めます。実SVGの線分描画、文字寸法、操作、PNG・クリップボードは別の境界なので、最終候補の実ブラウザー検証を維持します。`labelLayout` 群は、実データの共有区間をSVGとして描画し、重なっても透明な隙間が残ることをピクセルで確認します。

## 全体検証へ進む

限定検証の成功は、選んだ範囲だけの結果です。人間へ操作確認版を返す前とmerge前には、同じ候補の全体CI成功を確認します。限定検証で変更範囲を説明できない場合や、選択外の不具合が見つかった場合は、対象を広げます。

ローカルで全体を実行する場合は、previewを起動した状態で次を実行します。CIでも同じ全体検証を行うため、同じ候補に対して理由なく両方を繰り返す必要はありません。

```sh
npm test
npm run build
npm run test:browser
```

`--cases` を省略すると既存の全43群を実行します。結果の `browserSummary` に `scope`（`targeted` / `full`）、全群数 `available`、実行名 `selected`、成功・失敗数、所要時間 `durationMs` を出力します。各 `browserCase` にも所要時間を出力します。報告には候補commit、変更箇所、選んだ群とその理由、未実行範囲を残し、限定成功を全体成功と書かないでください。

## テストを減らす判断

遅いという理由だけでテストを削除したり、assertを弱めたりしません。削除・統合する場合は、同じ不具合を検出できる別のテスト、固有の境界・異常系がないこと、統合後にも意図した誤実装を検出できることを確認します。Node／DOMのモデルと実ブラウザーの検証は、同じ画面に関係していても同等とは限りません。

全体CIの自動省略や変更ファイルだけからの自動選択は行いません。対象指定の実績と所要時間を基に、次の改善を判断します。

## 読み取り専用の保存・URL回帰

原文の編集・Apply・未反映draftの新規保存、復旧文書の入替は廃止しました。以前のeditorテスト名はCIの参照を保つため残し、現在は読み取り専用の原文表示・閉じる操作・URL更新を検証します。

- `test-editor.mjs`：原文への入力と直接submitが保存を変えないこと、起動時の本文比較、通知の閉鎖／再起動、履歴の重複排除・本文非蓄積、通信失敗と遅延結果。
- `test-editor-save-integration.mjs`：旧draft・本文・表示状態の読取非破壊と一度限りの原記録保護、管理UIを出さないこと、保存中断・容量不足・競合・更新commitと表示の境界。
- `test-source-sharing.mjs`：共有URLの検証、匿名通信、失敗・中断・最新の受信URL・保存中に届くURLの扱い。受信の成功は現在文書を置き換え、過去のURLは本文なしの履歴へ残します。
- `test-save-state`／`test-session-concurrency`／`test-save-conflict-noop`：本文変更の入口を新規文書の読込または取得元の更新へ変更し、保存世代・競合・離脱保護の判定を維持します。旧編集の保護は移行データから検証します。
- 実ブラウザーの原文・URL回帰では、スマホ幅の操作、再読込、匿名取得、通知からの更新、移行書出しのコピー代替とnative IndexedDBも確認します。図・関連Check・画像出力などは既存の全体検証に残します。

文書切替後に旧文書を復旧するテストは、現在文書の保存復元・URL履歴からの再取得・旧記録の非破壊保護へ置き換えています。Activity詳細タブの独立状態、更新時の配置維持、PNG作成中に別文書を開く場合の元画像保持は引き続き検証します。

固定座標・経路の回帰で使う旧no-Groupサンプルは、テキスト入力後、アプリを離れた同一originのページで旧Sessionのsample識別をfixtureとして保存し、通常の復元経路で読み込みます。製品の編集機能やliveアプリへの状態注入は使いません。同じ本文で再度helperを呼んだ場合は配置を初期化しません。公開サンプルそのものの操作は別のsmoke検証で維持します。共有URLの再読込は、起動時の更新確認1回を期待します。

## リリース後の通知簡素化

更新通知は「更新する」「このまま読む」の2択です。旧draft／編集済み本文／旧文書がある状態でも、移行・保護・本文保存・JSON書出しのUIや、更新前の追加確認を表示しません。通知の選択だけで本文を保持／更新し、次回起動時に再確認します。

廃止した本文download／copy救出UIの専用テストは、保存管理UIが存在しないこと、エラーを閉じても現在の図と入力が変わらないこと、通常の再読込で競合先の表示を開くことへ置き換えます。失敗・quota・transaction中断・世代CAS・stale window・旧Sessionの非破壊復元・未commitの図を表示しない検証は維持します。native error通知は320/393/1280px・light/darkで本文と閉じるボタンが切れず、入力画面と重ならないことを確認します。

## 型付きJSONの回帰

`jsonDocuments,jsonBoundaries,jsonOfflinePreview`は、既存ViewerのJSON File/URL、一覧・詳細・Findings・共有Check、原文読取専用、版/参照異常、容量差、保存/復元・保存失敗と、配布する単体HTMLの隔離保存を実Chromeで検証します。全体CIにも含みます。未知の保存種別や版を表示成功として読み飛ばしません。

スクリーンショットと観測は`json-document-HEAD`、操作確認版は`viewer-preview-pr-PR-HEAD` artifactへ保存します。確認版のmanifestはsource/checkout/treeと各ファイルのdigestを持ち、PR headとビルドtreeの一致を要求します。公開デプロイを行わず、本人操作レビューと自動検証を分けます。
