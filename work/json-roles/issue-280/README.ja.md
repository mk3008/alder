# Role catalog統合の検証記録

形式0.3・BD payload 0.2としてRoleの安定ID/name/colorを一元化し、Activity.roleIdを参照する。旧0.1/0.2のreaderを維持し、旧JSONを読込時に移行しない。明示upgrade APIと候補準備CLIを用意する。版・参照・5色の検査、Pluginの直接作成/更新と明示移行、Viewerの既存バッジ/ロール一覧/Who表示を同じ契約へ揃える。

`roles.mjs` の初期色は現行MD Viewerの5色ハッシュと同じ。保存後は色を保持し、Viewerは新しい名前のハッシュへ置換しない。5を超える明示Roleは色を再利用できる。複合Whoは原文・null参照・診断を保持し、中立色で表示する。文字パターンで保守的に判定するだけで、同義語・同名異役割の業務判断はしない。

## 再現

`node work/json-roles/issue-280/make-fixtures.mjs` は、既存の同一業務25要素/63関係、Gate Dの13操作、Gate BのCheck見本をそれぞれ明示upgradeする。元のMD/JSONは変更しない。Check付き見本の人間状態は既存の模擬試験由来であり、本人の業務承認を表さない。

- `node --test tools/document_storage/test-roles.mjs`：旧版読込、移行の期待版と依存版、ID/原文/根拠保持、既存Graph v1一致、重複/未知色/参照/未知版拒否、改名/再順序、MD再変換、未確定Who、5色再利用、Check人間合意ゲート。
- `cd web-viewer && node --experimental-strip-types web/test-json-roles.mjs`：全11図のworld座標、ID/色/Role表示、保存カメラ/選択、旧JSONとCheck状態、Stateの未決。
- Chrome `jsonRoles`：既存44群を削らず、新形式の全11図・接続点/折れ点/ラベル・camera/reload/reset・PNG一致を再実行。保存色変更（ハッシュと異なる色）・ロール一覧・名称変更/再順序・保存/復元・不正色で前表示保持を1280/393pxで確認。Gate D群を含め46群で最終CIを行う。

最終CI・Plugin隔離実行・固定Pages URLの証拠はIssue #280に記録する。新レイアウトや操作導線、JSON手編集UIは追加しない。既存描画器7ファイル・style.cssの固定hashを維持し、Graph v1のshapeや旧MDを変更しない。Graph v1へRole catalogは出力せず従来Who原文を保持する。

未決/制限：同名異役割の識別、複雑なWhoの構造化、人間の状態遷移の業務意味・概念モデル、completeの一般化、購買原典のMedium/SR Dependencies全体変換。新構造は候補であり、正式JSON v1/main merge/Plugin release/本番配信は行わない。

最終候補では、状態宣言のコード例を誤抽出しない境界（バッククォート/チルダのfence、重複metaキー）も補った。これは新たな状態仕様ではなく旧MD互換の防御で、PR #281後の共有parserの修正として本stackに含める。未定/TBD等のWhoもRoleを新設せず原文/未確定へ保持する。
