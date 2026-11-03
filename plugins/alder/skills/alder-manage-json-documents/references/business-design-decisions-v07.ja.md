# 業務設計の手順と判定表（0.7 候補）

この文書はDraft PRの候補契約です。正式版・配布済みPluginの更新を意味しません。業務設計の目的は、聞いた内容と未決を共有し、質問や訂正ができるようにすることです。

前提関係を追加した0.7候補のJSONは、修正前の0.7候補Viewer・保存器では読めません。Viewerと保存器を対応する組で使用します。既存の0.7候補は前提を未確認として読み、原本を自動変更しません。

## 聞き取りと表示

分かった手順、認可・入力検査・正常系の計算などの条件と結果は、同じ聞き取りの中で記録します。業務設計のActivity内に判定表を置き、手順からIDで参照します。テスト仕様のCheckも同じ判定行を参照できます。モデル設計は業務を整理した後に、サンプルデータを使って構造と関連をレビューします。業務設計とテスト仕様のレビューは同時でも別々でも構いません。

手順表のFrom・Toは情報の流れる方向、Dataは対象または受渡し情報、Actionは業務上の動作です。入力はObject→ActivityのWho、出力はWho→Object、内部処理はWho→「—」と表示します。操作主体と情報の流れが異なるときはその違いも保持します。手順ID、方法、必須・任意、適用条件、局所順序、操作効果、要求・応答の対応は消しません。実際の応答がない場合に応答を作らず、未知のDataや条件は未決のままにします。

判定表は条件軸を左、結果とCheckを右に置き、上から順に最初に該当した行を読みます。連続する同じ条件は、左側の分岐が同じ場合に限って縦結合します。「それ以外」は同じ前提で先行条件に当てはまらない場合、「不問」はその軸を判定しない場合、「未決」は内容が分かっていない場合です。パターン数を減らすことより、IF／elseとして読めることを優先します。`is`は聞き取った業務上の条件であり、実行可能な式という意味ではありません。

## 手順の前提

手順表の行順は説明のための標準順です。必要な前提が保たれれば、無関係な手順の順番は変えられます。例えば点数の計算には入力の検査が先に必要です。前提が分かったら、その手順の `dependsOn` に同じActivity内の前提StepのIDを記録します。ViewerはAction欄に前提を表示し、対象の手順へ移動できます。

前提をまだ確認していないときは省略または `null`、そのActivity内に前提がないと確認したときは `[]` です。前提が特定の判定結果の場合だけ必要なら、`whenDecision` にその判定表と行のIDを指定します。`null` は条件なしです。Step自身の `whenDecision` は、そのStepを行う条件として別に保持します。

```json
"dependsOn": [
  { "stepId": "validate", "whenDecision": null },
  { "stepId": "calculate", "whenDecision": { "decisionId": "input-validation", "rowId": "valid" } }
]
```

この例では検査は常に前提で、計算は入力が有効な場合の前提です。Dataや判定表を共有するだけでは、どの手順が前提かを推測しません。検証は明示された前提の参照・重複・標準順・旧順序規則との矛盾を検査します。旧データで判定表を参照する手順が後方にしかない場合は、前提を自動確定せず要確認として示します。任意・条件付き手順が前提の場合も実施条件の確認を促します。条件の成立やすべての前提の網羅性は自動判定しません。並列専用の手順表現は設けません。

例は `tools/document_storage/examples/molkky-dependencies-v07.json` です（同梱版では `scripts/document_storage/examples/molkky-dependencies-v07.json`）。既存のモルック原本とは別の、確認用の合成例です。

旧形式の `before` と `interchangeable` は従来の意味のまま読みます。旧0.5からの明示移行では、それらの確認済み規則を候補から落としません。0.6からの移行時にも前提を推測せず、元の規則を維持します。

例は `tools/document_storage/examples/molkky-decisions-v07.json` です（同梱版では `scripts/document_storage/examples/molkky-decisions-v07.json`）。元のモルック設計書を変更せず作成した、未レビューの合成例です。Check番号の使用は既存Checkの承認や移行を意味しません。入力エラー時に全体をエラーとする扱いと、一部対応の`MK-10*`も例に含みます。

## JSONと検証

- package `formatVersion: "0.7"` のBusiness Designは `schemaVersion: "0.6"`。旧`0.6`のActivity Who、Step、Relation、Dataの意味はそのままです。
- Activityの `decisions` は安定ID、種別（`authorization`・`validation`・`algorithm`）、条件軸、順序付き行、結果、Check参照を持ちます。Stepの `decisionIds` は同じActivityの判定表、`whenDecision` は適用される判定行を参照します。表自体にも他の判定行による適用条件を指定できます。
- 各条件セルは軸IDと `value`・`else`・`any`・`undecided` を区別します。値の比較方法と値、結果種別・業務上の結果、関連Data・Exception、Check内部IDと対応範囲は別々に保存します。Checkの表示番号やレビュー状態を判定表へコピーしません。
- 条件の列数・順序、ID・所有Activity、Data、Exception、Checkと原典版、StepのRelation方向、Request/Responseの組、判定間の循環を検査します。`else`には同じ左側の分岐に先行条件が必要です。構造検査は聞き取り内容の意味や条件の網羅性を確定しません。
- 0.7では、未レビュー・要確認のCheck草案を業務設計と同じ候補に保存できます。Checkの原典は `unverified` のままです。新規Checkを確認済みにできず、既存の人間判断を勝手に変更しません。確認済み・要修正を含むCheckの原典改版などは従来の正確なBD版の合意ガードを維持し、判定表の条件・結果・補足、前提となる判定、参照するDataやExceptionの意味が変わったCheckに古い確認を引き継ぎません。

## 旧版からの移行

0.4、旧0.5、候補0.6は従来の意味で読み、暗黙に書き換えません。0.4・旧0.5からは既存の`prepare-procedure-upgrade`を使って明示的な0.6候補を作り、Who・Scope・原文とIDの対応を人間が確認します。

0.6から0.7への候補作成は `node tools/document_storage/author-cli.mjs prepare-decision-upgrade source.json candidate.json request.json` を明示実行します。要求には元ファイルの`expectedSha256`・`expectedRevision`、新しい`revision`、各Business Designの新revisionを指定する `businessRevisions` が必要です。既存ファイルの上書きや原本への自動commitはできません。候補には既存のBD・Step・Data・Relation等のIDと値を保ち、空の判定表と参照欄だけ追加します。旧0.6の操作主体・対象を情報方向と読み替えて保存しません。

Check、State、概念設計、外部目録と人間確認状態は元ファイルに残し、候補へ自動的に付け替えません。依存文書の移行は、原典の新旧版、各ID、意味、確認状態と根拠を別途人間が照合して行います。候補の検査成功は移行や業務内容の承認ではありません。
