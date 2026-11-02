# 旧0.5の読取検証

`core.mjs`・`schema.mjs`・`structured.mjs` は、未リリースの旧候補
`fa93735283f84e51fceac74e07b35f9df70d2d9a` の `tools/document_storage/` から
バイト同一で取得したViewer専用の読取検証器です。保存器、形式版、正式Schemaを変更しません。
同梱のWriterやPluginでは使わず、0.5の入力と復元のみをこの検証器に渡します。

旧0.5のObject・Role配列は、ActivityからWhoへの直接参照ではありません。形式上有効な
データもWhoは未決として扱い、旧担当情報と複数Object・Role等の確認事項を別に表示します。
指摘は`structured-display.ts`で表示用に作り、元JSONのFindingや確認状態には記録しません。
旧0.5に概念モデルを追加した新契約や、0.5の新規作成・移行は対象外です。
