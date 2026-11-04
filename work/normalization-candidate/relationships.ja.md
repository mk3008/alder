# 正規化候補の関係一覧

全体図は主要構造だけを表示する。この一覧は個別図の配線警告がある場合も含む全関係。多重度は、それぞれ反対側の一件に対する最大・最小件数。

| 出発側 | 出発側の件数 | 到着側の件数 | 到着側 | 意味 |
| --- | --- | --- | --- | --- |
| 業務設計書（Business Design） | 1 | 0..N | 主体（Who） | 業務設計書が主体を定義する。 |
| 業務設計書（Business Design） | 1 | 1..N | 業務（Activity） | 業務設計書が業務を持つ。 |
| 業務（Activity） | 0..N | 0..1 | 主体（Who） | Activity.whoId。未決はNULLであり、主体がいないと確定したことを示さない。 |
| 業務設計書（Business Design） | 1 | 0..N | 対象（Object） | 業務設計書が対象を持つ。 |
| 対象（Object） | 1 | 0..N | 情報項目（Information） | 情報項目の所属。 |
| 業務設計書（Business Design） | 1 | 0..N | 情報のまとまり（Data） | 業務設計書がDataを持つ。 |
| 情報のまとまり（Data） | 1 | 1..N | Data項目（DataItem） | Dataを構成する項目。 |
| Data項目（DataItem） | 0..N | 1 | 情報項目（Information） | dataItems.informationId。 |
| 業務（Activity） | 1 | 1..N | 手順行（Step） | 業務内の順序付き手順。 |
| 業務（Activity） | 1 | 1..N | 業務結果（Activity Result） | 業務の複数結果。 |
| 業務（Activity） | 1 | 0..N | 判定表（Decision） | 業務の判定表。 |
| 業務（Activity） | 1 | 0..N | 例外（Exception） | 例外は業務に属する。 |
| 業務（Activity） | 1 | 0..N | 旧順序規則（OrderRule） | 旧形式の順序規則を保持する。 |
| 手順行（Step） | 1 | 0..1 | 受渡し（Interaction） | やり取りがinteractionの場合だけ受渡し行がある。internalとunresolvedには作らない。 |
| 手順行（Step） | 1 | 0..2 | 操作主体・対象（Party） | partiesが指定された場合に、主体側・対象側のうち記録された側を保持する。 |
| 操作主体・対象（Party） | 0..N | 0..1 | 対象（Object） | kind=objectの場合のみobjectIdで参照する。whoの場合はその手順のActivityのWhoを意味する。 |
| 受渡し（Interaction） | 0..N | 1 | 対象（Object） | stepInteractions.objectId。 |
| 受渡し（Interaction） | 0..N | 0..1 | 入出力の関係（Relation） | stepInteractions.relationId。 |
| 受渡し（Interaction） | 0..N | 0..1 | 手順行（Step） | 対応手順。片方向・同じ相手への複数参照を保持する。 |
| 手順行（Step） | 0..N | 0..N | 情報のまとまり（Data） | stepTargetDataで操作対象のDataを参照する。 |
| 受渡し（Interaction） | 0..N | 0..N | 情報のまとまり（Data） | interactionDataで受渡しのDataを参照する。 |
| 手順行（Step） | 1 | 0..N | 手順の前提（Dependency） | 依存情報の明細。 |
| 手順の前提（Dependency） | 0..N | 1 | 手順行（Step） | 前提手順への参照。 |
| 手順行（Step） | 0..N | 0..N | 判定表（Decision） | stepDecisionsで判定表を参照する。 |
| 手順行（Step） | 0..N | 0..1 | 判定行（Decision Row） | 手順を実行する判定行。 |
| 手順の前提（Dependency） | 0..N | 0..1 | 判定行（Decision Row） | この前提が必要となる判定行。 |
| 判定表（Decision） | 0..N | 0..1 | 判定行（Decision Row） | 判定表を適用する判定行。 |
| 判定表（Decision） | 1 | 1..N | 判定軸（Decision Axis） | 判定表の条件軸。 |
| 判定軸（Decision Axis） | 0..N | 0..N | 情報のまとまり（Data） | axisDataが判定軸と対象Dataを対応付ける。 |
| 判定表（Decision） | 1 | 1..N | 判定行（Decision Row） | 先頭から評価する判定行。 |
| 判定行（Decision Row） | 1 | 1..N | 条件セル（Condition） | 判定行の各軸に対応する条件。 |
| 条件セル（Condition） | 1..N | 1 | 判定軸（Decision Axis） | 各判定表には1行以上あり、各行が全ての軸を一度ずつ持つ。 |
| 判定行（Decision Row） | 1 | 0..N | 判定行とCheckの対応 | 判定行とCheckの対応と範囲。 |
| 判定行とCheckの対応 | 0..N | 1 | チェック項目（Check） | rowChecks.checkId。Check本体は元文書に残す。 |
| 判定行（Decision Row） | 0..N | 0..N | 情報のまとまり（Data） | resultDataで判定結果のDataを参照する。 |
| 判定行（Decision Row） | 0..N | 0..N | 例外（Exception） | resultExceptionsで判定結果の例外を参照する。 |
| 例外（Exception） | 1 | 0..1 | 中断・再開（Continuity） | 中断・再開が明示された場合に記録する。 |
| 中断・再開（Continuity） | 0..N | 0..1 | 手順行（Step） | 中断時の手順。 |
| 中断・再開（Continuity） | 0..N | 0..1 | 手順行（Step） | 再開時の手順。 |
| 中断・再開（Continuity） | 0..N | 0..N | 情報のまとまり（Data） | continuityDataは中断時に保持するDataを参照する。 |
| 旧順序規則（OrderRule） | 0..N | 0..1 | 手順行（Step） | before規則の前の手順。 |
| 旧順序規則（OrderRule） | 0..N | 0..1 | 手順行（Step） | before規則の後の手順。 |
| 旧順序規則（OrderRule） | 0..N | 0..N | 手順行（Step） | orderRuleStepsはinterchangeable規則の対象手順を保持する。 |
| 業務設計書（Business Design） | 1 | 0..N | 入出力の関係（Relation） | 入出力等の関係を保持する。 |
| 入出力の関係（Relation） | 0..N | 0..1 | 業務（Activity） | fromIdがActivityを指す関係の場合。 |
| 入出力の関係（Relation） | 0..N | 0..1 | 業務（Activity） | toIdがActivityを指す関係の場合。 |
| 入出力の関係（Relation） | 0..N | 0..1 | 対象（Object） | fromIdがObjectを指す関係の場合。 |
| 入出力の関係（Relation） | 0..N | 0..1 | 対象（Object） | toIdがObjectを指す関係の場合。 |
| 業務設計書（Business Design） | 1 | 0..N | 確認事項（Finding） | 業務設計の確認事項。 |
| 確認事項（Finding） | 0..N | 0..N | 業務（Activity） | findingTargetsのうちActivityへの参照。 |
| 確認事項（Finding） | 0..N | 0..N | 対象（Object） | findingTargetsのうちObjectへの参照。 |
| チェック文書（Check Items） | 0..N | 0..1 | 業務設計書（Business Design） | 原典がパッケージ内BDの場合。Checkは他に外部BD目録を参照でき、どちらか一方を参照する。 |
| チェック文書（Check Items） | 0..N | 0..1 | 外部業務設計書目録 | 原典が外部BD目録の場合。Checkはパッケージ内BDまたは外部目録の一方を参照する。 |
| チェック文書（Check Items） | 1 | 0..N | チェック項目（Check） | Check文書のチェック項目。 |
