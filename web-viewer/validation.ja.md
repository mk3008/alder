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

## 全体検証へ進む

限定検証の成功は、選んだ範囲だけの結果です。人間へ操作確認版を返す前とmerge前には、同じ候補の全体CI成功を確認します。限定検証で変更範囲を説明できない場合や、選択外の不具合が見つかった場合は、対象を広げます。

ローカルで全体を実行する場合は、previewを起動した状態で次を実行します。CIでも同じ全体検証を行うため、同じ候補に対して理由なく両方を繰り返す必要はありません。

```sh
npm test
npm run build
npm run test:browser
```

`--cases` を省略すると既存の全39群を実行します。結果の `browserSummary` に `scope`（`targeted` / `full`）、全群数 `available`、実行名 `selected`、成功・失敗数、所要時間 `durationMs` を出力します。各 `browserCase` にも所要時間を出力します。報告には候補commit、変更箇所、選んだ群とその理由、未実行範囲を残し、限定成功を全体成功と書かないでください。

## テストを減らす判断

遅いという理由だけでテストを削除したり、assertを弱めたりしません。削除・統合する場合は、同じ不具合を検出できる別のテスト、固有の境界・異常系がないこと、統合後にも意図した誤実装を検出できることを確認します。Node／DOMのモデルと実ブラウザーの検証は、同じ画面に関係していても同等とは限りません。

全体CIの自動省略や変更ファイルだけからの自動選択は行いません。対象指定の実績と所要時間を基に、次の改善を判断します。
