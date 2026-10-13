# 文書順を手掛かりにした初期配置

対象は `web-viewer/`。基準sourceは `c4e2b0632c688f83c65fc3d9e8f798eae879fd4d`。サンプルは公開の `business-design/alder/README.md`（25 nodes / 63 relations）。公式Graph JSON、Native、保存済み座標、routing自体は変更しない。

## 採用した配置

Markdownを読む際にActivityの登場順をViewerのDesignへ保存し、Graph JSONの名前順ソートとは分離する。初期配置は既存4列gridと接続距離の短縮を維持し、Activityの文書順位に応じた目標行からの距離を重み2で評価する。交換は50,000候補・250,000隣接訪問・10pass以内、同点は交換しない。Objectの章順には順序の意味を与えない。文書順は業務の実行順を規定しない。

Activityを1列で厳密な順に固定した試案は、線の交差が48から102へ増えたため採用しなかった。段組と順序の罰則を比較し、文書の前半から後半への読みやすさと接続の近さを両立するsoft hintを選んだ。任意入力で最適になる保証はない。

ヒントがないJSON-onlyの呼出し、古いDesign、欠損・重複等の不完全なヒントは旧アルゴリズムへ戻る。保存済み座標があるノードは、文書順が変わっても再配置しない。座標のない新規ノードだけを初期配置し、保存済みカードとの重なりを避けて追加する。

## モデル比較

`node --experimental-strip-types web/compare-document-order.mjs` で `comparison.json` と `sample-layout.json` を再生成できる。routingの曲線サンプル点・固定カード寸法・推定ラベル幅によるモデルであり、実ブラウザーの見た目や実フォントの測定ではない。

- Activityの上下逆転ペア: 11 → 1
- 線の交差: 48 → 52
- 線とノードの衝突: 23 → 27
- ラベル同士の重複: 28 → 42
- ノード同士／ラベルとノードの重複: 0 → 0
- 経路の長さ: 19,470 → 18,604

厳密な順序ではない。同じ段では「システム設計」と「画面設計」が右→左に並ぶ。「製品検証」は次の「検証結果の統合」より1段下に残る。「同期漏れ検査」も「製品検証」の左に置かれる。逆転・交差・ラベル重複が完全になくなったとは扱わない。

## 検証

- `test-document-order.mjs`: MarkdownのActivity節の逆順化でhintと初期配置だけが変わり、Graph JSONは不変。Object節だけの並替えは配置不変。数字ID、孤立Activity、接続Object、ヒントなし／不正ヒント、重複関係、同一入力の決定性、1–1000 Object、保存済み／旧版座標を検査。
- `test-layout.mjs`: JSON-onlyの旧snapshotを保持し、Markdown用の新snapshotを別に検査。新規ノードの衝突回避と既存座標優先も維持。
- `test-document-order-browser.mjs`: 実Chromeでsampleの座標、読順の残る例外、カード非重複、curve/label extent、曲線、Scope/Writeでの位置保持、close/reload/reopen、新規の逆順入力、同じ入力を更新した際の座標優先を確認する。
- 既存Chrome群でdrag/lock、Scope半透明、curve、入力、永続化、touch等を回帰検査する。native Drawer指scroll／対照は既知の入力経路制約により再試験しない。実AndroidとOS pickerは未検証。

CI実行結果はPR #194の記録を参照する。新preview配備・本番昇格・merge・releaseはこの修正に含めない。
