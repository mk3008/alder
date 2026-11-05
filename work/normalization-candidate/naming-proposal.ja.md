# 業務設計の構造名：検討案

構造の役割が名前から分かるように、構造エクスプローラーに表示する正規化候補の25構造を見直した案です。ここで示す型名はレビュー用の概念名であり、正式なJSONのキーや実装済みのクラス名ではありません。構造の採用と名前の採用は未確定です。

## 情報項目とグループ

- **情報項目** `InformationItem`：対象が持つ情報。例：郵便番号、住所1、住所2、氏名。
- **情報項目グループ** `InformationGroup`：業務で扱う情報項目のまとまり。名前を持ち、手順の操作対象や受渡し内容などとして参照できる。例：住所、申込情報。
- **グループ構成項目** `InformationGroupMember`：あるグループにある情報項目を含める関係と、その項目を含める条件。例：申込情報に「電話番号」を「電話連絡を希望する場合」に含める。

例えば、「住所」は郵便番号・住所1・住所2を参照し、「申込情報」は氏名・郵便番号・住所1・住所2を参照できる。同じ情報項目を複数のグループで参照してよい。矢印のキャプションにグループ名を使えるが、グループは手順の操作対象などにも使うため、受渡し専用の名前にはしない。

現在の候補では、グループには1件以上の情報項目が必要で、直接含められるのは情報項目のみ。別のグループを入れ子にする構造はない。また、情報項目自体の粒度は固定されていない。グループ内の項目は複数の対象にまたがることもできる。構成項目を画面や保存構造で独立して見せる必要性は別途検討する。

## 構造名の対応

現行列は、今回の画面に表示されていた名前です。括弧内は正規化試作中の保存先で、正式なJSONでの対応は後述します。

| 現行 | 候補 | 意味 |
| --- | --- | --- |
| Business Design (`businessDesigns`) | `BusinessDesign` 業務設計書 | 業務設計の単位。 |
| Who (`actors`) | `Who` 主体 | 業務を実行する役割・システム・スケジューラー。 |
| Activity (`activities`) | `Activity` 業務 | 一つの主体が実行する業務。 |
| Object (`objects`) | `Object` 対象 | 業務で扱う対象。帳票、人、データベースなどを含む。 |
| Information (`information`) | `InformationItem` 情報項目 | 対象が持つ情報の項目。 |
| Data (`data`) | `InformationGroup` 情報項目グループ | 業務で扱う項目の名前付きのまとまり。 |
| DataItem (`dataItems`) | `InformationGroupMember` グループ構成項目 | グループに含める項目と条件。 |
| Step (`steps`) | `Step` 手順行 | 業務内の一つの手順。 |
| Interaction (`stepInteractions`) | `StepInteraction` 受渡し | 手順における相手との受渡し。 |
| Party (`stepParties`) | `StepParty` 手順の当事者 | 手順のFromまたはToに置く主体・対象。 |
| Dependency (`dependencies`) | `StepDependency` 手順の前提 | 手順に先立って必要な別の手順と、その適用条件。 |
| OrderRule (`orderRules`) | `StepOrderRule` 旧順序規則 | 旧形式の手順順序・入替可能性の記録。 |
| Activity Result (`results`) | `ActivityResult` 業務結果 | 業務が成立させる結果。 |
| Decision (`decisions`) | `DecisionTable` 判定表 | 条件の軸と行を持つ判定表。 |
| Decision Axis (`axes`) | `DecisionAxis` 判定軸 | 判定表の条件を整理する軸。 |
| Decision Row (`rows`) | `DecisionRow` 判定行 | 一組の条件と結果を持つ判定表の行。 |
| Condition (`conditions`) | `DecisionCondition` 判定条件セル | 判定行と判定軸が交わる位置の条件。 |
| 判定行とCheckの対応 (`rowChecks`) | `DecisionRowCheck` 判定行とチェックの対応 | 判定行とチェック項目の対応、および対応範囲。 |
| Exception (`exceptions`) | `ActivityException` 業務の例外 | 業務に属する例外。 |
| Continuity (`continuities`) | `InterruptionHandling` 中断・再開 | 中断条件、中断後の扱い、必要に応じた再開方法。 |
| Relation (`relations`) | `BusinessRelation` 業務・対象の関係 | 入出力や例外に関する業務・対象間の関係。 |
| Finding (`findings`) | `DesignFinding` 設計上の確認事項 | 業務設計に対する質問や修正事項。 |
| 外部業務設計書目録 (`source.externalDocuments`) | 外部業務設計書の目録項目 | 外部の業務設計書を参照するための目録の1件。 |
| Check Items (`retained Check document`) | `CheckDocument` チェック文書 | チェック項目を収める既存文書。 |
| Check (`retained Check.items`) | `CheckItem` チェック項目 | 既存チェック文書内の個々のチェック項目。 |

対象とグループの違いを保ち、情報項目とグループに共通の `Information` を用いた。グループの一つの構成要素にも `InformationGroup` を付けて所属関係を明示する。判定表・手順・業務などの中でのみ意味を持つ構造には、その文脈を名前に含める。既に役割が分かる `Who`、`Activity`、`Object`、`Step` は維持する。外部業務設計書の目録項目は日本語の型名のままとし、英語名は決めていない。

## 属性・関係名

構造名に合わせ、関係は「操作対象の項目グループ」「受け渡す項目グループ」「判定対象の項目グループ」など、参照元における役割を示す。外部キー名は対応情報として保持する。

意味と一致していなかった属性表示も、`scope` は「システム化対象」、手順の `side` は「From／To」、`kind` は「当事者の種類」とした。情報項目の `name` は「項目名」、グループの `name` は「グループ名」、構成項目の `condition` は「含める条件」とする。

## 現在のJSONとの境界

| 対象 | 0.7候補での保存先 | 正規化試作での保存先 | 今回の型名案 |
| --- | --- | --- | --- |
| 情報項目 | `objects[].information[]` | `entities.information[]` | `InformationItem` |
| 項目グループ | `data[]` | `entities.data[]` | `InformationGroup` |
| グループ構成項目 | `data[].items[]` | `entities.dataItems[]` | `InformationGroupMember` |

今回は概念モデルJSONの表示候補とその生成元を更新する。上の保存キー、Schema、保存器、既存JSON、Plugin、Viewerの入力契約は変更しない。名前を実データのキーへ反映する場合は、明示的なバージョン・移行、既存データと参照の保全、編集Skill・Viewer・検証の対応を別途確認する。

この25構造はBusiness Design中心のレビュー投影であり、State TransitionやCheckなどを含むJSON全体の名前の確定版ではない。また、表示フィールドは試作の全属性を網羅していない。例えば `information.description`、`activities.where`、`steps.obligation`／`appliesWhen`／`effect` が投影にない。全体を確定する前に、JSON全体のルート、別文書、属性・列挙値・関連を含めた網羅確認が必要。
