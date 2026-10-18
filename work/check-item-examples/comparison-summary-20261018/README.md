> この記録は前回版です。A案承認後の最終Skillによる初稿・更新・独立読取・修復・回帰は[最新の実行比較](../meaning-validation-20261018/README.md)を参照してください。過去のrawは保持しています。

# 同じ評価軸の具体例を上位サマリで比較する

root #105 / PR #235の表示改善。個別Checkより先に、同じ業務の成立・不成立・未決を比較する表を置く。一般条件・期待結果・人間レビュー状態・根拠・Test証拠は各IDの単一本文に残し、表の行から該当IDへ、本文から表へ辿る。固定DSL、新しい成果物契約、全Checkの表化は追加しない。

本人は先行の列分解案を分かりやすいと評価した後、C-01/C-02で表を分けるより上位の一つのマトリックスで比較したいと指示した。この方向合意に基づく改修であり、新たな生成結果の人間承認やmerge/releaseの許可ではない。

## 版と入力

- 改善前のSkill・出力：`38cf3ac7ea6d7e802daddc3483c42bbed0455bcb`。旧[相談受付サンプル](https://github.com/mk3008/alder/blob/38cf3ac7ea6d7e802daddc3483c42bbed0455bcb/work/check-item-examples/index-diagnostic-20261018/run/checks-final.md)はC-01の表とC-02の段落が分かれていた。
- 今回のcanonical guidance / Skill：`1584c9e1db3437eac5fa35f82a951cc9a28922f3`。
- 公開を確認後に公式exporterで同期したbundle：`d7f84fcca636e88015b15b9da993b200abd62999`。初稿、更新、読取、修復、再読取をこの同じ版で実行した。表示上のPlugin版は既存の0.4.8で、未リリース候補のまま。
- [合意済み架空BD](https://github.com/mk3008/alder/blob/d7f84fcca636e88015b15b9da993b200abd62999/work/check-item-examples/fixtures/README.md)、更新だけに渡した[旧4 Checkと人間フィードバック](https://github.com/mk3008/alder/blob/d7f84fcca636e88015b15b9da993b200abd62999/work/check-item-examples/fixtures/checks.md)。購買とは別の小規模BDで、比較表と短文の説明例の両方を確認した。

生成担当には完成見本、本人レビュー画像、旧生成結果、過去の評価、実装・Test本体を渡していない。公開版から必要ファイルだけを別packetへ展開し、履歴なしの作者2名と別読取担当を明示起動した。指示による入力制限であり、OSによるアクセス遮断や実クライアントの自動routingの実証ではない。要求設定は全員 `gpt-6-sol / medium / fork none`。実効設定の独立attestationは利用できない。

## 入力から最終版まで

| 工程 | 初稿 | 既存4 IDの更新 |
| --- | --- | --- |
| Skillの一次生成（無編集） | [candidate-01](initial/candidate-01.md) | [candidate-01](update/candidate-01.md) |
| 保存後の作者点検 | [author-check-01](initial/author-check-01.md) | [author-check-01](update/author-check-01.md) |
| 別コンテキストの読取 | [reader-report-01](initial/reader-report-01.md) | [reader-report-01](update/reader-report-01.md) |
| 作者の採否・修復 | [disposition-01](initial/disposition-01.md)、[candidate-02](initial/candidate-02.md) | [disposition-01](update/disposition-01.md)、[candidate-02](update/candidate-02.md) |
| 実際の保存後再読取 | [reader-report-02](initial/reader-report-02.md) | [reader-report-02](update/reader-report-02.md) |
| 実表示所見を受けた作者の表示修復 | [disposition-02](initial/disposition-02.md)、[candidate-03](initial/candidate-03.md) | [disposition-02](update/disposition-02.md)、[candidate-03](update/candidate-03.md) |
| 最終保存版の実際の再読取 | [reader-report-03](initial/reader-report-03.md) | [reader-report-03](update/reader-report-03.md) |
| 最終成果 | [final](initial/final.md) | [final](update/final.md) |
| 依頼全文・入力・診断・限界 | [execution](initial/execution.md) | [execution](update/execution.md) |

作者の自己点検と独立読取は別工程。読取担当は編集しない。統括は所見を元のBDに照らし、実表示を点検し、支持できる修復を作者へ返した。原文候補を統括が書き換えて成功扱いにはしていない。生の記録内の一時パスは実行時の配置であり、公開後の導線はこの一覧と公開固定版の入力リンクを使う。

両runとも修復と実際の再読取は当初設定した2巡以内。各finalは最終再読取したcandidate-03の無編集コピーで、hashは[manifest](manifest.json)に記録する。要求設定と全promptは各execution・reader-reportに残る。担当は初稿 `/root/matrix_initial_author` / `/root/matrix_initial_reader`、更新 `/root/matrix_update_author` / `/root/matrix_update_reader`、旧例読取 `/root/matrix_baseline_reader`。

## 検出と修復

旧サンプルを新指針で読取のみ検査した[baseline review](baseline-review/report.md)は、成立例と不成立例が比較可能なのに共有サマリに集約されず、行とCheckの往復参照がないことを指摘した。原典相対リンクの指摘はpacket配置に依存する限定所見として記録され、名称診断はmatchだった。名前診断やCI成功は表示の合格を意味しない。

新指針による一次生成は初稿・更新とも上位比較表を作成したが、そのまま無条件合格にはしていない。

従来の各ID内の書式適合だけでは、複数Checkに跨る同じ軸の比較を確認できなかったことが原因の一つと考える。新指針で旧例の分断は検出できたが、画面を見ない作者・readerだけでは新しい過密表の折返しを判定できなかった。そこで既存Consistency reviewの保存版読取に、ホストによる実表示の点検と、画像を見た作者の修復・再読取を組み合わせた。注意文の追加だけで自律的に解決したとはしない。

- 初稿：境界例だけへ狭まった日付の一般則、受付担当者の共通行為の不足、C-04に混在した受付結果と後続説明の期待を別読取が検出。作者は原典に照合して修復した。作者点検で出た資格/停止条件の粒度所見は、初稿C-02からC-08への分離としてID対応と根拠を記録した。これは旧4 ID更新側の採番や状態には影響しない。
- 更新：作者点検で条件と操作の混在、別読取で日数差の逆向き定義を検出した。統括は公開した候補の原典リンクと実表示も点検した。既存4 ID・確認済み/要確認/未レビュー/要修正、一般保証、包含OR・否定・0〜30日、既存Test名・未収集状態・自動説明判定方法の未決、C-02の保留と希望日変更の未決を保持する。
- 原典の「固定の説明文や自動理解判定を規定しない」と、既存Test証拠欄の「説明内容を判定する自動方式は未決」は同じ意味へ短絡して置換しない。C-03型の短い説明例は文章で残す。

## 実表示と残る限界

本人が提示した元画像2点は統括が実際に閲覧した。GitHubへ転載していない。新生成物のGitHub実表示は統括が確認し、更新の修復担当には自身の生成物の実表示画像だけを渡して閲覧を確認した。

最初の更新候補は幅約983pxに10列が収まったものの、日付や短語まで折り返していた。単に統合表が存在することをもって可読とせず、共通値・業務行為を表の前へ出し、重複した文を整理して作者へ修復を戻した。独立読取担当は画面を利用できないため、意味・構造・参照の検査と実表示の点検を区別している。

更新candidate-02（8列）からcandidate-03（7列）を同じGitHub表示幅で比較し、表の高さは約522px→330px。candidate-03の実表幅は約972px（親幅約983px）で、相談名・登録状態・停止状態・日付・判定が短い行として対比できることを目視確認した。これは表示寸法の観測であり、人間の理解速度の実測ではない。表のC-02リンクをクリックして該当本文へ移動し、本文から比較表へ戻る操作も確認した。原典リンクは公開固定版の同一BDへ修復された。

今回の限定実行は一般的な生成精度、全ケース網羅、実クライアントの自動実行、人間の誤読率やレビュー時間の改善を証明しない。原典で未決の応答・記録・再申請・希望日変更は未決。Test本体やTest実行は今回行っていない。本人の最終表示レビューと独立最終レビューは残る。

## テスト・CIと範囲

配布・CLI・既存表示契約の関連90 testsとSkillのquick validationが成功。新しいテストは統合サマリ指針と既存Consistency reviewへの配布/到達性の検査であり、生成や可読性の代用ではない。旧テストは弱めていない。更新したtraceability参照を持つ3 Skillは公式exporterの13ファイル再現検査に成功。内容の変更はCheck生成Skillの説明、canonical guidance、配布参照とprovenance、および関連検査に限定した。

canonical sourceだけ先に公開した `1584c9e1` の中間CIは参照bundle未同期で失敗（Package 39131789102 / release validation 39131789111）。同期後 `d7f84fcc` は成功（Package 39131853515 / release validation 39131853506）、公開release jobはskipped。最終headの結果はPR返却コメントへ記録する。

既存のraw・評価は上書きしていない。Activity名診断器やViewerの実装、正式BD、正式Check、Test実装、依存PR #240と他Issueは変更していない。#235採用後の#240再統合・回帰確認は別途必要。Draftを維持し、merge/tag/releaseは実施しない。
