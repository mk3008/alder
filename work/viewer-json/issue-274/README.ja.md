# Gate C：JSON読込の方向性確認用ラフ

Gate B固定head `b498ddb6a02de44aca6fc27d535febe4cafd0315`から独立branch `feat/274-viewer-json`を作り、実Viewerに型付きJSONの直接投影を追加した最小版。**Gate Cは未完了で、方向性確認待ち**である。

## 見る手順

`rough/preview.html`をダウンロードしてChromeで開く。既存Viewerの「テキストを入力」から`rough/gate-b-example.json`の全文を貼り、表示する。端末のファイル読込からJSONを選ぶ経路も追加している。Activityの選択、詳細タブ、業務内容/チェック項目、未決の指摘を確認する。ローカルサーバーで通常のdistを使う場合は、`web-viewer`で`npm ci --ignore-scripts --no-audit --no-fund`、`npm run build`の後、`dist`をHTTPで配信する。

単体HTMLはビルド済みViewerのJS/CSSを変更せずgzipで同梱したもの。圧縮は検証版配布の包装であり、保存JSONの圧縮契約ではない。Previewの画面描画・ブラウザー内保存は今回確認できていない。ファイルoriginの制限で動作しない場合は通常のHTTP配信が必要になる。安定した共有Preview URLは未提供。

方向性は、既存の図・一覧・右Drawerを維持し、JSONの業務内容を直接表示すること。Checkの人間レビュー状態を表示し、原典の意味対応は未確認と明示する。参照する共有保証・例は展開して読める。原文はJSONのまま読み取り専用で保持する。

## 最小限で確認したこと

- 最新root/Alder AGENTS、root #144/Alder #274のGoal/Done、`web-viewer/validation.ja.md`、Gate A/B固定headと現行reader/session/check契約を確認。
- `npm run build`成功。初回の括弧不足による型検査失敗を修正し、再ビルドで成功。Viteは既存の大きいbundle警告を出す。
- Gate Aのbrowser-safe `core.mjs`/`schema.mjs`のみを利用。Node-only authoring/convertをrendererへimportしない。Business Graph v1 exporter/validator、Plugin、Gate A/Bの成果は変更していない。
- Gate Bの固定JSON例をNodeで投影し、6ノード・6関係・3 Findings・4 Checkを確認。package-7/BD bd-3と永続ID、原文一致を確認。ノード数の表示上限は設けていない。
- 名前ではなく永続IDで図・詳細タブを結ぶ。JSONで復元する場合は原文を再検査・再投影する処理を試作。旧Sessionの`Design.markdown`フィールドは原文格納の互換スロットとして使用し、`sourceFormat: json`を付ける。JSONからMD文書を生成していない。

## 実画面を確認できなかった理由

接続されたブラウザーはChrome。ローカルHTTP Previewへの接続は`ERR_CONNECTION_REFUSED`。環境内のHTTP配信も別コマンドから到達できず、画面を取得できなかった。単体HTMLのdata URL表示はブラウザーのセキュリティポリシーで拒否された（許可protocolはHTTP/HTTPS）。その制限を別surfaceや迂回で回避していない。スクリーンショット・実画面操作成功の証拠はない。

## 実装を作り込む前の確認

最新[root AGENTS.md](https://github.com/mk3008/root/blob/main/AGENTS.md)の「GUIはラフで方向性を確認してから作り込む」に従う。

> 本人が方向性を確認してから、本実装の作り込み・回帰テスト・必要な最終検証へ進む。

このゲートのため、方向性確認前の全体回帰や詳細実装には進めていない。Draft PRの自動CIが起動した場合、その観測はIssueへ記録し、操作レビューと区別する。

## 未実施・未対応

- 実ChromeでのローカルFile/HTTPS URL、2MiB超、MIME/CORS/取得中止、IndexedDB保存・復元、不正JSON時の描画保持、既存MDの全体回帰、安定した隔離Preview URLと本人操作レビュー。
- UIの各入口には既存のMarkdown表記が残る。JSONの版/参照/未確認表示、共有保証や表の見せ方、Findingの人間向け参照名などはラフであり清書前。
- 単一package内のBD1件だけを仮対応。複数BDは明示拒否。外部BDを参照するCheckはこの図に関連付けない。文書/未割当Checkの網羅的閲覧や参照展開量の制御は未完了。
- URL上限2MiBは既存値を維持。JSONの容量方針・解析負荷の安全策は未検証。ローカルJSONをサーバーへuploadする実装は追加していない。
- 未知kind/版・壊れた参照・Check版ずれはGate A validatorへ委譲するが、ブラウザー異常系の検証は未完了。原典の意味対応や業務合意を承認する機能は追加していない。
- 概念モデル・未合意状態遷移、JSONの直接編集UI、JSON→MD同期は対象外。正式JSON v1採用・merge/release・本番デプロイは行っていない。
