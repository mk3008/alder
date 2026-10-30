# 部分定義の状態遷移をJSONに保存する

候補形式 `alder-document-package/0.4` は、BD・Checkに加え、`documents[]` に `kind: stateTransition` の文書を保持する。正式JSON v1ではない。0.1のBD/Checkを変更せず読み込める。0.1へ状態文書を追加する操作、未知の形式版・文書版・kindは拒否する。概念モデルの具体的な型は未定義である。

状態文書のpayload版は `schemaVersion: 0.2`。文書・保存状態・操作にはそれぞれ安定IDを付ける。`basedOn` は同じファイル内のBDのIDと正確なrevisionを参照し、verificationはunverifiedとする。対象objectIdと各activityIdは、同じBDのObject/Activityでなければならない。状態名・操作sourceIdの重複、参照の欠落、例外IDの欠落・重複・異なるActivityへの参照を拒否する。構造検証は業務意味の承認ではない。

各遷移の出発状態と到着状態は単一の参照である。状態文書内では `fromId / activityId / condition` の組を一意にする。条件の前後空白・連続空白は同じものとして検査し、ID・到着先・効果・経路・例外・旧eventの違いでは重複を許さない。同じ到着先でも重複した処理条件は拒否する。自然文の条件どうしが意味として排他的かどうかは、この文字列の検査では証明できず、業務レビューで確認する。

Activityは業務の単位であり、一つのActivityが実行結果によって異なる状態へ進むことはある。その場合は条件ごとに遷移を分け、図では各遷移にActivity名・条件・一つの到着先を表示する。「通常」は経路の分類であり、処理条件の名前として代用しない。条件が異なれば、同じ到着先でも線と説明を統合しない。

## 明示された範囲を草案にする

保存状態は `states: [{id, name}]`、操作は `transitions[]` に記録する。各操作はid/sourceId/fromId/toId/activityIdと、condition/effect/path/evidence/note、event/exceptionIdを持つ。eventは旧宣言の保存用であり、表示名に使わない。正常操作のexceptionIdはnull。名前付き例外はBDのexceptionsにID・activityId・name・descriptionを持ち、exceptionIdから参照する。説明文の書式は参照に影響しない。未定義の旧宣言はnullと明示diagnosticsを保持する。[JSON構造と互換境界](json-native-contract.ja.md)を参照する。

開始 `@new`、終端 `@unknown`、網羅性 `partial` の実験宣言だけを扱う。`@new`（作成前）、`@none`（記録を作らない処理結果）、`@unknown`（未決）は保存状態IDと区別する。効果change/unchanged/no-create/constraintと元・先の関係を検証する。未記載の操作を推定・禁止・状態不変へ補完しない。completeや確定終端の一般化は未対応である。

Pluginでは既存のJSON管理Skillとauthor-cliのcreate/commitを使う。原典の明示情報からJSONを直接草案作成し、validate→create/commit→inspect/validateで保存を確認する。BDの改名・追加・内容変更後もIDを維持し、状態文書のbasedOnと文書revisionを明示更新する。操作・状態の改名はIDを変えず行う。既存IDの削除・差替えやsourceIdの変更はcommitで拒否する。Checkの人間合意・レビューゲートは従来どおりで、状態図の表示成功から承認を推定しない。

## 明示宣言を一方向に変換する

`convertMarkdown(request)` または同梱 `cli.mjs convert request.json new.json` に、BD sourcesと `stateDocuments: [{documentId, revision, businessDesignId, objectName}]` を渡す。Objectの `## State Transitions` にあるstate-metaと9列/旧event列/名前付き例外列の明示表だけを変換する。全宣言とdescriptorは一対一で対応する必要がある。元MDの全文はJSONに格納せず、元ファイルを保持する。再変換はpreviousPackage/expectedRevisionを指定し、既存の明示改名bindingを使う。状態そのものの再変換時の改名bindingは未対応なので、状態名の改名はJSON正本の更新で行う。

購買研究原典のMedium/SR Dependenciesなどの未知見出しやCheck原典版の不一致は、今回も診断して停止する。補助記述を勝手に捨てて変換しない。

## Viewerで確認する

Object右Drawerの既存「業務内容／チェック項目」の間に、PR #265の「状態遷移」を表示する。明示宣言のないObjectでは無効。図・操作詳細・正常/例外・未決表示、Enter/Space/Escapeによる状態選択、Activityへの移動は既存状態図の実装を再利用する。JSONの状態文書から直接表示し、Markdownへ戻さない。業務相関図・Activity詳細の配置器・座標系・配線には変更を加えない。
