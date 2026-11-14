# #340：main起点の構造レビューPreview

構造エクスプローラーを main `777b79a4f919a1456c74a724b949bc7748f32df1` に選択統合する。業務の意味、正式なJSON構造、Who、version、移行の決定は依頼者へ残す。本人GUIレビューは未実施。

- [保証単位の比較・採否](comparison.ja.md)
- [実装前に固定した今回の検証正本](acceptance.json)（commit `d3123341bdb69aae3e5dca8f6e648bffed0389d7`）
- [移植元の検証正本のhash](authority-sha256.json)

## 固定JSON

移植元は #357 head `887c0f60a191d06e1db0ed50567844cca2ec1950` の `business-design/alder/json-complete-concept-review.json`。SHA-256 は `e93657d3680bac31907b7d54e96498e79dcff8ffd66c420ef3ca9441cc5a7181`。package形式は0.4、package revisionは `package-review-1`、conceptModel形式は0.1、model revisionは `package-study-1`。版名だけでは各headを識別できないため、commitとhashで固定する。

この最新版は66構造・339項目（通常属性255、関係キー84）。指示書の252属性は以前の説明であり、指定headのJSONを252へ合わせて編集しない。null許容が未決の47項目はすべて維持する。左側に未決総数を表示し、個別詳細にはnull許容とその理由を表示する。互換・移行用の項目は左側の非表示フィルターを解除して確認できる。

## 選択した差分

製品コードは `structure-explorer.ts/css` の追加と、mainの `viewer-shell.ts/css`、`drawer-resize.ts` の接点に限定した。shellはmainとの差分から構造URL・左タブ・中央詳細・左右幅の部分を抽出し、#357 baseに由来するResult文言、概念フィールド投影、fieldLinks付きグラフpayloadは採らない。概念図の配線・レイアウト・状態描画・業務詳細・入力・Schema・保存器・Pluginはmainのまま。

mainの既存検査は、右Drawerの幅検査を右Drawer内のseparatorへ明示するselector変更と、ブラウザー群52→55への追加分の件数更新、下記の読込完了待ちを行う。既存の期待値・assert・テスト群は保持する。#357のDOM検査21本と実Chrome3群を追加する。

候補の表示テストに必要な旧レビューJSON2種、normalization-candidateの4ファイルは移植元からbyte同一のテスト資料として追加した。`source-schema.mjs` と `paper-manual-v06.json` は同じheadの生成元Schema／入力の読取固定資料で、canonical Schemaでも配布runtimeでもない。値域の出所を照合する検査だけがこのSchemaを読む。候補package自体の読込・validateはmainのSchemaを通す。

移植元テストのSchema不変hashはmainの正確なhashへ結び直した。説明欄へnull理由を混ぜない保証を維持し、本人の今回の依頼に従って理由を別欄へ追加したため、その検査は「説明には理由を含めず、理由欄は原記録と一致する」とした。その他の移植元assertは保持する。古い表示正本のうち後続版で訂正済みの扱いは、各ファイルのsupersedesと今回の検証正本を優先する。

## 検証の境界

`test-main-structure-review.mjs` は実装前正本のbyte不変、ID/適用ケース/結果の欠落・重複の負例、mainの保護対象全ファイル、指定headの候補JSONと固定資料、未決47項目すべてのDOMと原モデル不変を照合する。shellの2ケースと公開Previewのケースは別の検査結果へ対応付け、未実行をpendingのまま出す。検証の最終記録で全6ケースを照合する。

テスト成功・AIによる疎通検査は本人の業務上の疑問・不整合・未決の実GUIレビューを代替しない。比較表にある旧0.5/Procedure/Who/移行の保留を、この環境の表示成功で採用扱いにしない。

## キーボード回帰の修復

初回候補4c62c627の全体CIはChrome54/55成功、drawerOpeningFocusが失敗した。モードタブの追加でmainの閉じるボタン→Tab→文章検索という経路が変わっていたため、モードタブを閉じるボタンの前のTab順へ置き、視覚上の見出し・タブの順は維持した。閉じるボタンからShift+Tabでモードタブへ到達し、左右キーで文章/構造を切り替えられる。mainの既存テストは変更せず、追加したChrome検査に両方の到達経路を加えた。固定した要求・検証正本は変更しない。

読込完了前にCheck案内を判定する競合は、基準mainへ150msのFile.text遅延を入れて同じ失敗を再現した。#357にもある読込完了待ち（開く操作が有効になり、図のノードが存在すること）を2つのFile読込直後へ選択移植した。元のassertと期待値はすべて保持し、遅延下でも案内・メニュー・保存/復元を1280/393/320pxで確認した。待機を検証そのものの代わりにはしない。
