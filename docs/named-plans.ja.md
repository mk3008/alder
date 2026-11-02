# 複数の業務案を一つのJSONで扱う

`alder-named-plans/1.0` は、名前と安定IDを持つ1件以上の業務案を包む形式です。各案には従来の `alder-document-package` をそのまま含めます。案は独立して検証され、同じIDを別の案で使えます。案同士を参照したり、文書の `revision` を案の識別子として使ったりはしません。既存の単一JSONにはラッパーは不要です。

Node 24以上の環境で、既存の単一JSONを保持したまま新しいファイルを作成できます。

```sh
node tools/document_storage/named-plans-cli.mjs create plans.json current 現行案 current.json improved 改善案 improved.json
node tools/document_storage/named-plans-cli.mjs inspect plans.json
```

更新時は `extract plans.json current candidate.json` で対象案を新しいファイルへ取り出し、通常のJSON作成・更新操作で候補を作ります。`inspect` のファイルhashと対象案のrevisionを通常の操作要求に記載して、`commit plans.json current candidate.json operation.json` を実行します。対象案には既存のID・参照・人間合意・確認状態の保存ガードを適用し、ほかの案は変更しません。取り出し先・新規作成先は既存ファイルを上書きしません。`commit` は複数案ファイル自体を更新し、元の単一ファイルは更新しません。

各案にはそれぞれ完全なJSONを格納するため、案数に応じて容量が増えます。閲覧時にはViewerのファイル／URLの容量上限が適用されます。自動差分、案間のマージ、認証付きURLの取得は提供しません。
