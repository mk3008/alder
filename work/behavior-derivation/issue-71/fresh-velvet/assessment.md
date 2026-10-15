# Fresh Velvet出力の別担当評価

評価担当は `/root`。生成担当 `/root/velvet_fresh_discovery` は履歴なしの別Agent。生成担当へ評価資料・途中の内容フィードバックは渡していない。原本は [outputs/raw.md](outputs/raw.md)、分類・証拠hashは [records/evaluation.json](records/evaluation.json)。分類と採否はAI評価であり人間承認ではない。

## 全候補の分類

| ID | 外部知識からの問い | 主分類 | 未決差分・採否 |
| --- | --- | --- | --- |
| FC-01 | 別キーの失敗後、先に成功したキーの成果を残すか | A: Decisionで既決 | 全workを一緒に確定するため未決差分なし。採用加点0 |
| FC-02 | 設定更新と実行が重なる場合の設定版 | A: Decisionで既決 | 設定ロックと再検証によって境界は決定済み。条件付きのオンライン編集機能を新設する要求にも数えない。採用加点0 |

A=2、B=0、C=0、D=0、E=0。Bは既知でも**未決**の重要論点の再発見に限る。既決の論点を例なしで取り出せたことをBへ付け替えない。FC-01の独立キーとFC-02の設定版は具体的な観測結果差を持つので、単にSQLやロック方式だけのDとはしない。優先する閉じ方はAであり、Eとの二重計上もしない。

## FC-01の根拠

[Decision 0002 L15–26](https://github.com/mk3008/velvet/blob/6b64e3b99845a315a394fee8e500564c3631e2af/docs/decisions/0002-phase1-trusted-execution.md#L15-L26) は全転送workと成功Runを同時に確定し、失敗時にworkを破棄して別transactionで失敗Runを記録する。partial successは非対象で、別のキーが残る制限もowner確認として明示されている。初期の対応モデル制限はその後拡張されているため、それだけを現行全体の根拠にはしない。[Decision 0013 L40–42](https://github.com/mk3008/velvet/blob/6b64e3b99845a315a394fee8e500564c3631e2af/docs/decisions/0013-product-set-phases.md#L40-L42) でも共通境界の原子性を維持する。

[実装boundary L143–180](https://github.com/mk3008/velvet/blob/6b64e3b99845a315a394fee8e500564c3631e2af/src/features/execute-transfer/boundary.ts#L143-L180) はrow/set両ルートを同じwork transaction内で実行し、その後成功確定、失敗時rollbackとする。[既存テスト L250–283](https://github.com/mk3008/velvet/blob/6b64e3b99845a315a394fee8e500564c3631e2af/tests/features/execute-transfer/execution.integration.test.ts#L250-L283) は先行書き込み後の失敗でDestination/Active Black/Lineage/Work/Processingが残らずfailed Runが残ることを検査する。このテストをそのまま「独立A/Bキーの完全再現」とは呼ばず、決定・実装を支える既存証拠として扱う。テストは読んだもので、この試行で再実行したものではない。

[過去レビューC11](https://github.com/mk3008/velvet/blob/6b64e3b99845a315a394fee8e500564c3631e2af/docs/review/issue-39/execute-transfer-mapping.md#L47) と [PR44 Atomic Checks A33–35](https://github.com/mk3008/velvet/blob/5d9872221b1e3f67cef671f644aacff69810efb1/docs/review/issue-43/execute-transfer-atomic-checks.md#L91-L93) にもrollback・失敗記録・再試行が既出。Checks自体には未レビュー表示があるため、人間承認の代わりには使わない。入力から除外したDecisionに答えがあることがA判定の根拠。

## FC-02の根拠

[Decision 0002 L15](https://github.com/mk3008/velvet/blob/6b64e3b99845a315a394fee8e500564c3631e2af/docs/decisions/0002-phase1-trusted-execution.md#L15) はRun作成後に設定ロックを再取得し、pending work選択前に変更を拒否、SettingとLink/Destinationのロックを保持する。[Decision 0013 L7–11、L42](https://github.com/mk3008/velvet/blob/6b64e3b99845a315a394fee8e500564c3631e2af/docs/decisions/0013-product-set-phases.md#L7-L42) も設定の一括有効化、revision/hash、同じ設定再検証と実行設定の記録を定める。

[queries L3–10](https://github.com/mk3008/velvet/blob/6b64e3b99845a315a394fee8e500564c3631e2af/src/features/execute-transfer/queries.ts#L3-L10) のロックと [boundary L143–149](https://github.com/mk3008/velvet/blob/6b64e3b99845a315a394fee8e500564c3631e2af/src/features/execute-transfer/boundary.ts#L143-L149) の比較・拒否が対応する。[既存テスト L389–410](https://github.com/mk3008/velvet/blob/6b64e3b99845a315a394fee8e500564c3631e2af/tests/features/execute-transfer/execution.integration.test.ts#L389-L410) はRun作成commit後の設定変更を注入し、転送なし・failed Runとなることを検査する。任意の外部DDL・trigger・運用違反を全て防ぐ証明ではなく、現在のtrusted configurationの範囲での判断である。

「実行中に設定を変えられる環境があるか」という追加仮定は原本で条件付きと明示されている。しかし現在の契約が設定版混在を許す未決状態にはない。一般的な編集API・deployment運用の再設計へ広げて新しいC候補を作らない。

## その他の出力と結論

原本の「既決として閉じた」9項目と見送り5項目は、追加の未決候補ではない。insert_onlyの定義に関する文書内の表記差も、生成側が区別したとおり今回の外部知識由来の発見として数えない。

固定した採否基準の有用な未決論点は0件。**experimentalを維持する。** 入力の範囲で具体的な問いを作れたことと、製品として未決の問いを発見できたことを区別する。Decisionを入力から外したことで既決事項を再質問する余地は生じているが、それを今回の成功へ読み替えない。promptは変更せず再生成もしない。1回・1機能の不成立から手法全体の無効性を結論しない。
