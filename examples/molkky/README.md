# モルック得点計算の業務設計サンプル

[業務設計JSON](business-design.json) は、1回の点数、複数回の合計、各回までの累計の推移を対象とするAlderの単一JSONパッケージです。業務設計書と10件のCheck Itemを収録しています。

## 開く・検証する

Alder Viewerの「開く」→「ファイルを開く」で `business-design.json` を選択すると、業務の流れとCheck Itemを確認できます。

JSONの構造と参照の整合性は、リポジトリのルートで検証できます。

```sh
node tools/document_storage/cli.mjs validate examples/molkky/business-design.json
```

## 留意点

このデータは、AIの依頼者役との模擬対話によって作成された実演成果物です。実在の人間による業務上の承認を受けたものではなく、Check Itemの原典確認状態は `unverified` のままです。

Check Itemの `testEvidence` が参照するソースコード、実行ログ、レビュー記録は実演時の別の研究ディレクトリにあり、このサンプルには同梱していません。ここに含まれるJSONだけでテストの再実行や実行証拠の確認ができるわけではありません。
