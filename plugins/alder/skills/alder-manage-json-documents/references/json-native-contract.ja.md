# JSONの構造と例外参照

新規草案は[package 0.5 / BD schema 0.4](business-design-json-0.5.ja.md)を使う。例外定義はexceptions[]に一元化し、Activity.exceptionは持たない。0.5の既存Check/StateのbasedOnは通常更新で変更できず、旧packageを保全してBD-onlyの別packageへ明示移行する。

以下は旧0.4までの互換契約である。旧ファイルを読んだだけで0.5へ移行しない。

## 旧0.4の構造

旧0.4のJSON草案は候補 `formatVersion: "0.4"` を使う。Business Designは `schemaVersion: "0.3"`、状態文書は `schemaVersion: "0.2"`、Check Itemは従来の `0.1`。正式JSON v1の採用・Plugin releaseは別判断である。

## 例外をIDで参照する

Business Designは `exceptions: [{id, activityId, name, description}]` を持つ。idは名称や説明文を変更しても維持し、activityIdは同じBDのActivityを参照する。同名の例外を異なるActivityに置ける。識別と整合性の根拠はIDであり、Markdownの装飾・改行・箇条書きから例外を認定しない。

状態操作の `exceptionId` は、この例外IDを参照する。別Activityの例外、存在しないID、重複ID、原典revisionの不一致を拒否する。正常経路はnull。例外経路で参照先が未決ならnullとし、`diagnostics` に `例外参照未決: <transition id>` を残す。未記載の遷移や例外は生成しない。

`name` と `description` は表示用情報である。Activityの `exception` 文章も任意の補足として保持できるが、例外IDの存在・参照・状態の検証に使わない。文章中に別の例外名や装飾が現れても構造は変わらない。

JSON専用の検証・編集は `core.mjs`／`authoring.mjs`／`edit.mjs`、ViewerのJSON専用入口は `parseJSONDocument`。これらは旧MDの業務parser／変換器を必要としない。文章のMarkdown表示は許容するが、構造や参照の導出には使わない。

## 旧候補JSONとMDを開く

旧JSON 0.1〜0.3は、版を識別する互換入力adapter `legacy-json.mjs` の `readLegacyPackage` へ渡す。旧候補の名前付き例外を旧契約の表記で解釈し、構造化した例外とID参照へ変換する。名前が存在しない・曖昧な場合は拒否する。名前のない旧例外は未決を保持する。

旧版に対する `core.validate` は構造と既存の型付き参照を検査し、名前による例外参照をadapterで検査する必要をdiagnosticsへ返す。旧版の完全な受入検査には `readLegacyPackage` を使う。CLIのvalidate／inspect／create／commitは、旧版の場合だけこの境界を通す。旧名前参照を未検査のまま保存成功にはしない。

Viewerの共通入力入口は `document-input.ts`。MDの場合だけ `legacy-document.ts` と旧文法parserを使い、業務情報・例外・明示状態を型付きモデルへ渡す。旧MDの名称ID、旧JSONのUUID、原文、revision、Check人間状態と未決は保持する。変換後は同じ `validateReferences` と表示処理を使い、MDを再解析しない。旧MDの参照先不明Findingは、解決済みIDと未決の参照名を分けて保持する。

互換読込はメモリー内の投影であり、元ファイルを書き換えず、保存済みの手動配置も再発行しない。Viewerが元のMD／旧JSONを正式な保存0.4へ自動移行したことにはしない。

## 保存形式を明示移行する

`author-cli.mjs prepare-exception-upgrade old.json candidate.json revisions.json` は、旧ファイルを残して候補0.4を新規ファイルへ作る。要求にはexpectedRevision、新しいpackage revision、変更する各文書のexpected／next revisionを渡す。BDと従属状態／CheckのbasedOnを整合させ、既存ID・原典情報・Checkレビュー状態を維持する。

候補の検査後、既存のcommitに期待hash／版と `migration: "exceptions-0.4"` を渡す。Checkがある場合は新しいBD版に対する既存の人間合意ゲートも必要で、構造移行から人間の確認を推定しない。MD→JSONの明示convertは0.4を出力し、旧MDを保持する。JSON→MD同期は行わない。

Business Graph v1は従来の独立した契約である。0.4の表示名には旧MDの区切り記法を構造制約として適用しない。Graph v1で表現できない表示名を明示exportした場合は拒否し、Graph v1自体の仕様を変更しない。
