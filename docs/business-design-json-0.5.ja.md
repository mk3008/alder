# 業務設計JSON 0.5

未リリースの契約実装候補です。現行配布Pluginと通常Viewerの対応形式は0.4までです。0.5の保存・検証はこのソース版のNode API/CLIで行い、配布Pluginや通常Viewerへの対応は別途必要です。

packageの`formatVersion`は`0.5`、Business Designの`schemaVersion`は`0.4`です。Checkは`0.1`、状態遷移は`0.2`を維持します。これらは文書の`revision`やPlugin製品バージョンとは異なります。Schemaは[JSON](../tools/document_storage/schema.json)と[生成元](../tools/document_storage/schema.mjs)、参照検査は[core.mjs](../tools/document_storage/core.mjs)が正本です。

## 構造と所有者

| 要素 | 件数・所有者 | 内容 |
| --- | --- | --- |
| Role | BDに0..N | id/name/color。兼任を許し、人やObjectをRoleごとに複製しない |
| Object.Information | Objectに0..N | id/name/description。情報項目の名前と説明の正本 |
| Activity.performers | 1..Nまたは未決null | Object参照とRole参照0..N。Who/roleIdは重ねて保存しない |
| Procedure.steps | Activityに1..N | id/text/obligation/appliesWhen/performerObjectIds |
| Procedure.orderRules | 同じProcedureに0..N | before、または確認済みinterchangeable |
| Activity.results | Activityに1..N | id/text。独立した成立状態。後続Activity数とは無関係 |
| Data | BDに0..N | id/name/items。各Dataに情報項目参照1..N |
| input/output関係 | BDに0..N | 既存id/kind/fromId/toIdを保ち、dataIdで一つの共通Dataを参照 |

例えば入力と出力が同じ情報を扱う場合、関係は同じ`dataId`を使います。

```json
{
  "data": [{
    "id": "contact-data",
    "name": "連絡案内",
    "items": [{"informationId": "contact-method", "condition": null}]
  }],
  "relations": [
    {"id": "out", "kind": "output", "fromId": "explain", "toId": "requester", "dataId": "contact-data"},
    {"id": "in", "kind": "input", "fromId": "requester", "toId": "confirm", "dataId": "contact-data"}
  ]
}
```

これはBDの部分例です。`contact-method`はObject `requester`のInformation、`explain`と`confirm`は同じBDのActivityとして定義します。Data名はBD内で一意です。各関係の受渡先/受取元Objectが項目を所有し、Data側では項目名や説明を再定義しません。関係側のlabel/itemsによる上書きも許しません。例外関係は従来のlabelと型付き接続を保ちます。

## 担当と標準手順

Activityの主体には人、システム、スケジューラー等のObjectを参照できます。Roleは主体がその業務で担う役割で、複数指定と空配列を許します。主体未決のnullは、Activityを対象とするopen Findingとともに保持します。

Stepの`performerObjectIds`はActivityの主体の部分集合です。nullの場合、Activity主体が一つならその担当を継承します。複数主体から担当を特定できない場合は未決とし、open Findingを必要とします。関係のI/O相手を実行主体と推定しません。

`obligation`はrequired/optional、`appliesWhen`は適用条件の自然文またはnullです。条件付き必須はrequiredと適用条件を併せて表します。これらは順序とは独立しています。

Step配列は標準提示順です。厳守する先後関係は`{kind:"before",beforeId,afterId}`、入替可能と確認した関係は`{kind:"interchangeable",stepIds:[...]}`で表します。参照は同一Procedure内に限り、標準順との不整合、自己参照、循環、重複、厳守制約と入替の矛盾を拒否します。制約がないことから順不同を推定しません。

Activity間の順序構造はありません。Activity配列は実行順ではなく、依存・待ち合わせは後続ActivityのWhenと、Result・Object経由のI/Oで表します。

## Resultの条件

Resultは`{id,text}`です。正常系の条件は「倒れたものがあれば、その場所に立て直される」のようにtextへ含められます。正常結果・例外・未決を混同せず、条件が偽ならエラーになる等の逆の規則を補いません。

専用`condition`の採否は保留です。本契約候補では受理せず、独立構造を必要とする便益が確認された場合に版付き拡張を検討します。文字列から条件を自動抽出しません。代替の`condition`必須/nullable案は、未実証の入力・移行負担を増やすため必須化していません。Data項目やStepの適用条件は別の既存採用範囲です。

## 保存と明示移行

0.5の新規作成・更新・検査には既存の`author-cli.mjs create/commit/inspect`と`cli.mjs validate`を使います。期待hash/版、排他lock、失敗時非書込み、既存IDと所有者、人間のCheck判断に対するガードを維持します。

0.4からの移行は`author-cli.mjs prepare-structure-upgrade old.json candidate.json request.json`で別ファイルを作ります。requestにはexpectedRevision、新しいpackage revision、変更するBDと従属Check/StateのdocumentRevisions（expected/next）、構造化済みBD全文のbusinessDesignsを渡します。既存BDすべてを明示し、同じIDを保ちます。Procedureの句点分割、WhoからObjectの自動発明、情報項目の推測抽出は行いません。

候補生成は保存承認ではありません。元ファイルへのcommitには期待hash/版と`migration: "structure-0.5"`が必要です。Checkを新しいBD版へ結び直す場合は、その版に対する既存の人間合意ゲートも通します。Checkの本文・ID・確認状態、Stateの遷移・例外参照・partial/unverifiedは維持します。構造移行だけで確認状態を昇格しません。

旧Whoに対応するRole未確定診断は移行前の診断として文言を保持し、現在の担当未決は新しい主体参照とFindingで検査します。移行前後の文章の意味が同じかは、明示された候補と原本の意味レビューで確認します。

## 旧版との境界

0.4の読込み・検証・保存は0.4のままです。旧JSON 0.1〜0.3の入力adapterと、旧Markdownから0.4への明示convertを維持します。読込みから0.5へ自動移行しません。既存文書や凍結研究原本を書き換えません。

通常Viewerの入力契約と表示実装はここでは変更していません。Graph v1は0.5の主体・手順・複数結果等を表せないため、0.5からの旧Graph出力は拒否します。情報を捨てた旧形への自動投影は行いません。通常Viewer対応とその本人操作レビューは別途必要です。

Schema/Validatorが保証するのは型、多重度、ID、参照、所有者、明示制約の整合性です。実際の担当・順序・結果・情報項目が業務に合うか、Whenの待ち合わせ条件が十分かは、AIの意味レビューと依頼者の判断に残ります。機械validは合意や推論品質の保証ではありません。
