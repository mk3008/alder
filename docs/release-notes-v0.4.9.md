# Alder 0.4.9 — 業務設計のJSON管理

Alder Pluginで業務設計書とCheck Itemを一つの型付きJSONに保存し、人間は対応するViewerで業務を確認しながら修正を依頼できるようになりました。新しい業務設計の作成はJSONが標準です。

## 追加

### JSON正本の作成・更新と検証

ヒアリング結果から業務設計書をJSONとして直接草案作成し、Activity・Object・Check Itemの追加や内容変更を行えます。名称を変更しても安定IDと参照関係を保持し、文書版・期待ファイルハッシュ・保存競合を検査します。確認できない業務判断や未決事項は自動で確定しません。

Check Itemの作成・更新には、対象Business Designの正確な版に対する人間の合意が必要です。既存の確認状態、共有保証、例、根拠とテスト対応を保持し、意味が変わった期待結果は再確認へ戻します。

### ロールと明示された状態遷移

ロールのID・名称・表示色を一元的に管理し、Activityから参照できます。部分的に明示された状態遷移は、状態・操作・対象Activity・例外ID・根拠・未決を同じJSONに保存できます。例外の識別はMarkdownの説明文ではなく安定IDで行います。未記載の遷移を自動補完したり、完全なライフサイクルと判定したりしません。

### 既存Markdownからの一方向変換

対応する旧Business Design／Check ItemのMarkdownを、明示依頼によりJSONへ変換できます。元のMDは保持され、読込だけで自動移行したり、JSONからMDを再生成して同期したりしません。不明な参照、原典版の不一致、未対応の記載は検査結果として返します。

## 変更

新規Business Design・Check Itemで保存形式の指定がなければJSONを使用します。選択済みのJSONは同じ正本を更新し、既存MDファイルを明示した改訂では従来の互換経路を維持します。人間はJSONや内部IDを直接編集する必要はなく、業務の意味と期待結果をレビューして修正を指示できます。

## 互換性・利用条件

- JSONの新規保存契約は候補`alder-document-package/0.4`です。Business Designはpayload 0.3、明示状態遷移はpayload 0.2、Check Itemはpayload 0.1を使用します。これは正式JSON v1の宣言ではありません。
- JSONの作成・更新・検証はNode.js 24以上とローカルでのスクリプト実行が必要です。Markdownからの明示変換にはPython 3.12以上も必要です。実行できない環境では操作を停止し、制約を報告します。
- Business Graph JSON v1の契約、従来のMarkdown互換利用、人間による業務合意は維持します。概念モデルの保存・表示は、この版の提供範囲に含みません。
- JSON／状態遷移の閲覧には対応するAlder Viewerが必要です。**Pluginの更新だけでは公開Web Viewerの配信内容は切り替わりません。** Viewerは別途その公開版と対応機能を確認してください。
- Pluginの導入・更新には、GitHub Releaseで`plugin-v0.4.9`が公開されたことを確認してから、`codex plugin marketplace add mk3008/alder --ref plugin-v0.4.9`を利用してください。既存のインストールは自動更新されません。
