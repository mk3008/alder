# 一意な一般保証と、違いを観察できる具体例

採用されたA案を既存Skillとcanonical guidanceへ反映し、完成見本を渡さずに相談の初稿・既存4 ID更新、購買の既存6 ID更新、出荷対象の小規模初稿を生成した。作者点検→別コンテキストの読取専用Consistency review→作者修復→実保存版の再読取を実施。生成結果は統括が手修正せず、最終ファイルは作者の保存候補と同じバイト列である。

まず[相談受付の更新結果](update/final.md)で、上位の一般条件と成立/不成立の統合表、説明内容と相手の違い、参照中心のC-01〜04を確認できる。[購買の更新](purchase/final.md)は共有JA-EX-04とサンプル値を一般保証に固定しない点、[出荷対象の初稿](short/final.md)は表を使わない短文と未決の分離の回帰である。[相談受付の初稿](initial/final.md)は旧IDを与えない別の導出。

**限定された実行証拠であり、完全自律生成・検出精度・人間の読解時間や誤読率の改善を証明しない。** 初回の全候補に修正事項があり、独立読取にも不検出と過剰指摘があった。本人による最終生成物の受入、独立最終Chatレビューとmerge/release承認は残る。

## 何を変えたか

[原因分析と採用前の実物比較](../meaning-review-20261018/review.md)を根拠に、個別H4条件/結果必須という旧規則を置換した。一般条件・業務行為・一般結果はActivity内に一度だけ置き、各IDが明示参照する。タイトル＋参照で範囲が決まらなければ短い保証をそのIDへ移し、共通部へ二重定義しない。一般保証は有限の例へ置換せず、式・操作・全個別欄は一律必須にしない。ID/人間状態/根拠/Test証拠・固有の未決とフィードバックは各IDに保持する。

例の作り方は、まず対象・事前状態・行為・観測結果を取り出し、何の値や対応を変えると何が違って見えるかを示してから、表か短文を選ぶ。既存Consistency reviewも表・短文の両方でこの対応を検査する。単なる期待の言い換え、一般保証の再定義、成分だけを見たCheck全体の合格推定を点検する。全Checkへの反例、二行表、全組合せ、新DSL・別Skill・必須帳票は導入していない。

## 版・入力と再現範囲

- source：`b3113b7c0b6915562f0ebd6892e01199510cf319`（canonical guidance / Skill）。公開確認後、公式exporterで3 Skillを同期したbundle：`a8ae2af200b7e27b3f411228ef8b02638b3c89e0`。
- 実行版：`75fb043568ade8b442853421a0bc78ef999b23e1`。全生成・読取・作者修復はこの同じSkill/bundleで固定。後続は実行記録の保存であり、実行後にSkillだけ差し替えた成功例ではない。
- 相談BDは[公開原典](https://github.com/mk3008/alder/blob/75fb043568ade8b442853421a0bc78ef999b23e1/work/check-item-examples/fixtures/README.md)。更新入力は[前回の最終4 Check](https://github.com/mk3008/alder/blob/8c2b1460bc35ea51f9c95cf3d92851b41953db68/work/check-item-examples/comparison-summary-20261018/update/final.md)。初稿には旧Checkを与えない。
- 購買BDと旧Checkは同版の `business-design/purchase-request/README.md` / `docs/examples/purchase-check-review.ja.md`。未合意BDの参考草案という性質と限定された旧スコープを保持する。既存の原典リンクc2852531…と相談更新のd7f84fcc…は、GitHubから取得したBD本文とpacket本文の一致を別途確認した。
- 出荷対象は[短い架空BD](short/source.md)。生成担当にはBDのみを渡し、分析資料に記した手作りの短文例は渡していない。
- 生成者4名・各ケースの別reader・旧版読取・Skill差分reviewは `gpt-6-sol / medium / fork none` を要求。意味の修復と再読取は各担当へのfollow-up。相談更新と購買の最終表示修復は、ブラウザ工程の進捗を回収できなかった後、同じSkill/原典・直前保存候補・実表示所見のみを渡した別の作者contextで行った。未完了のcandidate-03は採用せず、相談更新candidate-03b、購買candidate-04bを明示選択した。実効設定の独立attestationはなく、初回は履歴なし、再読取は自分の前所見を含む。完成見本、他生成、過去評価、実装/Test本体は入力禁止。packetの内容・hashは[入力manifest](verification/input-manifest.json)。これは指示によるアクセス制限で、OS隔離や自動routingの実証ではない。

## 改善前と、検出できたこと／できなかったこと

旧版はC-01/C-02の受付表を比較できる一方、C-03/C-04の短文は対象名を置いた期待の言い換えに近く、二内容の欠落と実際の相手が区別できなかった。一般条件と式・操作・結果も上位と個別で再掲されていた。[旧版を新guidanceで読むblind review](baseline-review/report.md)はC-03/C-04の説明不足を検出した。ただしC-01の上位/個別の重複は独立所見にならず、限定更新を網羅検査した追加保証要求と「受付する」の成功先取りの確定NGは採用しなかった。[採否と条件上の限界](baseline-review/disposition.md)に残している。

| ケース | 初回作者点検 | 別readerの初回所見 | 修復・再読取と残る限界 |
| --- | --- | --- | --- |
| 相談初稿 | 比較例の二軸差をNGとした | CI-01/05/06の共有部と個別部の重複を検出 | 作者は根拠の弱い一軸強制を不採用。第2候補をreaderがNGなしとした後、統括がCI-02/03/04の残る重複を検出して作者へ再修復。第3候補の最終readerは重複/消失なし、CI-02の比較説明1件をNGとした。別読取の[採否評価](initial/finding-adjudication.md)は反実仮想の短文として原典から導けるため確定NGには不採用、任意の明瞭化提案とした。解釈差を隠さない |
| 相談4 ID更新 | 確認済みC-01へ旧範囲外の対応対象保証を追加したことを検出 | 同じ拡張と比較説明の不正確さを検出 | 統括が残る式/未決説明の再掲、実表示の折返し、共通前提の読みを追加点検して作者へ返した。元の4状態と未決・保留・Test記述を保持。結果は[保存後読取](update/reader-report-03.md)へ |
| 購買6 ID更新 | 一般保証の再掲、申請Dの希望額未設定、共有Checkから購入例への戻り不足を検出 | 同じ3件を独立に検出 | 作者修復後、限定保証・共有参照・未決Q01・状態/Test補足を再読取。実表示修復後のreader03が行リンクの消失と仮入力の曖昧さを検出。追加修復1回で04bへ直し、[保存後読取04](purchase/reader-report-04.md)では根拠付きNGなし |
| 小規模出荷対象 | 共通保証とC-01本文の重複を検出 | 同じ重複を独立に検出 | 作者が一意な保証参照と観察差のある短文へ整理。取消済みでない注文の可否と誤対象時の通知等は未決のまま。[保存後読取](short/reader-report-02.md)では根拠付きNGなし |

独立contextは同じ評価観点の適用を自動保証しない。今回、初稿の第2読取にも重複の不検出があり、統括の追加点検が必要だった。検出数の増加だけでレビュー精度が上がったとはいえず、過剰指摘を原典へ戻して採否判断する工程も必要だった。新しいルールの追加だけで完了したとは扱わない。

## 全工程への直接リンク

| ケース | 生成と作者点検 | 独立読取 → 作者修復 | 保存後の読取 | 最終ファイル・実行依頼全文 |
| --- | --- | --- | --- | --- |
| 相談初稿 | [candidate-01](initial/candidate-01.md) / [作者01](initial/author-check-01.md) | [読取01](initial/reader-report-01.md) / [採否01](initial/disposition-01.md) → [candidate-02](initial/candidate-02.md) / [読取02](initial/reader-report-02.md) / [採否02](initial/disposition-02.md) → [candidate-03](initial/candidate-03.md) | [最終読取03](initial/reader-report-03.md) / [所見の採否評価](initial/finding-adjudication.md) | [final](initial/final.md) / [execution](initial/execution.md) |
| 相談更新 | [candidate-01](update/candidate-01.md) / [作者01](update/author-check-01.md) | [読取01](update/reader-report-01.md) / [採否01](update/disposition-01.md) → [candidate-02](update/candidate-02.md) / [読取02](update/reader-report-02.md) / [採否02](update/disposition-02b.md) → [candidate-03](update/candidate-03b.md) | [最終読取03](update/reader-report-03.md) | [final](update/final.md) / [生成実行](update/execution.md) / [表示修復実行](update/execution-display.md) |
| 購買更新 | [candidate-01](purchase/candidate-01.md) / [作者01](purchase/author-check-01.md) | [読取01](purchase/reader-report-01.md) / [採否01](purchase/disposition-01.md) → [candidate-02](purchase/candidate-02.md) / [読取02](purchase/reader-report-02.md) / [採否02](purchase/disposition-02b.md) → [candidate-03](purchase/candidate-03b.md) | [読取03](purchase/reader-report-03.md) → [採否03](purchase/disposition-03b.md) → [candidate-04b](purchase/candidate-04b.md) / [最終読取04](purchase/reader-report-04.md) | [final](purchase/final.md) / [生成実行](purchase/execution.md) / [表示修復実行](purchase/execution-display.md) |
| 出荷初稿 | [candidate-01](short/candidate-01.md) / [作者01](short/author-check-01.md) | [読取01](short/reader-report-01.md) / [採否01](short/disposition-01.md) → [candidate-02](short/candidate-02.md) | [最終読取02](short/reader-report-02.md) | [final](short/final.md) / [execution](short/execution.md) |

## 回帰・CI・表示と受入

[検証の範囲と中間失敗](verification/checks.md)、[保存物のID/状態/参照点検](verification/structure.json)、[全記録のhashとfinalの選択](manifest.json)、[Skill差分の独立review](guidance-review.md)から確認できる。関連91テスト、Skill基本検証、3 Skill/13ファイルの公式exporter再現が成功。旧assertの置換は情報保持と一意到達をともに検査するもので、弱化とは独立reviewも判断した。テストは指示・配布・CLI等の契約検査であり、生成や人間理解の代用ではない。

実表示はGitHubの通常Previewで確認した。主な判断対象は一般保証→サンプル→個別IDの導線、受付の成立/不成立を同じ表で見比べられること、説明内容と相手の具体的な差、共有項目の往復、短文例の読み分け。初回表示に問題があれば作者へ戻し、読み手の観察と作者の修復を分離した。人間の操作/読解の受入やスマホ等すべての幅での読みやすさは未確認。単純な字数削減だけを効果指標にしない。

Viewerは今回確認・改修せず、互換性も主張しない。関連二視点PRや独立Issueの実装へは拡張していない。業務意味・Checkの人間レビュー状態をAIが承認へ変更せず、Draftのまま独立最終Chatレビューへ返す。merge/tag/releaseは最終本人承認前に行わない。
