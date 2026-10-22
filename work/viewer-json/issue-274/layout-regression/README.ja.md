# MDとJSONの配置・配線の同値回帰

同じ業務情報の入力で描画結果を比較し、JSON対応で変わった配置を入力アダプターで修正した。描画アルゴリズム、定数、カードCSSは変更していない。正式採用・merge/release・公開配備は行わない。

## 再現した原因と修正

対象はPR #279の `4fd7ebabf9d11ee6998f5074ecdf8173b6be87ec`。本人の原画像2点はWork内で実際に確認した。異なる業務の画像なので数値オラクルにはせず、公開転載もしていない。

`same-business.md`は対象headの`business-design/alder/README.md`の変更なしのコピー（25要素、10 Activity）。`same-business.json`はGate Aコンバーターで同じ情報を型付き構造へ変換した固定入力。意味・接続・ラベルを比較のために変えていない。UUIDは変換器の決定的なIDを保持し、旧MD全文をJSONへ同梱しない。

修正前は全体図の「コード」と「テスト」の座標が入れ替わった。詳細図でも名称順とUUID順の差が複数のObject位置へ影響した。`baseline-failure.txt`は修正前に同じ座標assertを実行して失敗した記録、`baseline-input-difference.json`は従来どおりUUIDを直接計画器へ渡した場合の数値差。既存計画器への入力IDで順序が変わる仮説を再現した。関係線もMD readerと同じkind/from/to/label順へ正規化し、caption laneなどの入力順の差を除いた。

JSONの内部表示GraphはUUIDを保持する。計画器の境界だけで名称IDへ写像して既存の`initialPositions`/`matrixPlan`を呼び、返る座標辞書のキーをUUIDへ戻す。初期配置・欠落要素補完・リセット・表示用wire計算の呼出しをこのアダプターにつなぐ。別の計画器を作らず、MDは従来関数へそのまま委譲する。保存/選択/Check/FindingsのID、Graph v1、元JSONと型付き本文を変更しない。

既存のActivity文書順hintを維持する。Object/関係配列やUUID自体の順を並べ替えた入力も比較する。Activity順を変更した更新では、従来の文書順hintと保存済み座標の扱いを維持し、順序の新しい業務意味を定義しない。

## 検証

`web-viewer/`で次を実行する。

```sh
node --experimental-strip-types web/test-json-layout.mjs
npm run test:layout
npm run build
npm run test:browser -- --cases jsonLayout
```

Nodeの比較は全体＋全10詳細、UUID差替えとObject/関係順変更、ノード座標/矩形/全組の間隔、経路の端点/折れ点/ラベル/分類を誤差0で検査する。計画器へUUIDを直接渡す負の対照は現在も不一致となり、アダプターを迂回する誤実装を検出する。改名・Activity再順序・保存/再読込でもUUIDに紐付く手動座標/選択/カメラを保持する。

`jsonLayout`は1280/393pxで本物のViewerをFileから開く。全体図と全Activity詳細のDOM world座標/矩形/間隔、SVGのpath全体とlabel座標、画面座標・カメラをMD/JSONで比較。全体図と先頭詳細ではズーム・native scroll・IndexedDB保存/ページ再読込・既存リセットを操作する。実画面とViewerのネイティブPNG保存による全図を証拠にする。画像・AI目視は人間の操作レビューを代替しない。

`protected-sources.json`はGate Bとbyte同一のlayout/layout-order/matrix-layout/routing/geometry/activities/route-cache、および修正前headと同一のCSSのSHA256を固定する。`web/json-layout-protection.mjs`が検査する。既存43ブラウザー群を削らず、新1群を含む全44群の最終CIを実行する。実際のCI結果と固定artifactはAlder #274へ記録する。

## 保存済み配置と残る判断

旧候補で既に保存した座標や人間の手動配置は自動移行しない。初期位置へ戻す場合は既存の「レイアウトを初期値に戻す」を使う。JSON固有表示の本人再レビュー、暫定容量budget、大規模図の性能、未合意のモデルは未完了のまま。古い公開ベータと公開トップを変更せず、修正候補はCIの隔離Preview artifactで返す。
