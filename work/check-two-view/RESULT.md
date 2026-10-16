# Activity／Object二視点Checkの生成・更新検証

既存Skillに二視点表示を追加し、購買例で生成・更新、別の状態なし業務で任意表示を検証した。独立Draft PR #240として返却する。表示の採用は個別Checkの業務承認ではなく、生成物の人間による確認は残る。

## レビューする成果物

- [最終更新例](combined-update-repaired.md)：既存6 IDの意味・状態・原典URL・補助情報・Test証拠文を保持し、Object節と状態表を追加した。#235の通常見出し形式と内部リンクへ更新した。
- [最終初稿](combined-initial-repaired.md)：未合意BDからの参照草案。10 ID、金額別承認は未決・要確認。個別の業務意味を承認したものではない。
- [図と表の例](candidate-update-diagram.md)／[図のみの例](candidate-diagram-only.md)／[状態を持たない別業務](candidate-stateless.md)。図表は一律必須ではない。
- [確認済み状態・架空Test対応を持つテスト入力](synthetic-reviewed-input.md)／[更新出力](synthetic-reviewed-output.md)／[別読者レビュー](synthetic-reviewed-review.md)。確認済みとmappedはfixtureの設定であり、新たな人間承認や実在Testの存在・実行成功ではない。

## 改修前後

| 比較対象 | 実際の出力・観察 | 判断 |
| --- | --- | --- |
| main固定版の表示のみ更新 | [改修前出力](baseline-update-scoped.md)は6 IDを保持し、Objectからのリンク索引を追加した。状態図・状態表・三分類は生成しなかった | 二視点の索引は既存能力。今回の増分は接続表示と三分類の規約であり、二視点全体を新規能力としない |
| 本件単独の更新 | [更新出力](candidate-update.md)は同じ6本文を逐語保持し、Object表で○／×／未定義エラーを区別。別読者の明確なNGなし | 表示改修で既存意味を保つ限定例を確認 |
| 本件単独の初稿 | [raw](candidate-initial.md)に、購入登録の条件不足など2件のNG。作者が[修正](candidate-initial-repaired.md)し、[再レビュー](candidate-initial-rereview.md)で残る明確なNGなし。統括から関連未決の保持を追加確認した | 初回生成・自己点検だけで無欠陥とはいえない |
| #235との結合版 | [raw初稿](combined-initial.md)の移設で切れる原典リンク、Object表の条件違いの参照、[raw更新](combined-update.md)の管理説明を[別読者](combined-review.md)が検出。作者が[修正理由](combined-repair-report.md)を残して修正し、[再レビュー](combined-rereview.md)で残る明確なNGなし | 実際の生成→別読取→原典照合修正→再読取を実施。統括がrawを手編集して合格にはしていない |

主担当の最初のbaseline依頼は「表示のみ・新Check追加なし」が明示不足で追加7件が出たため、比較から除外した。scopeを明示して再実行した上表のbaselineだけを比較対象とする。同一依頼の多回統計比較ではない。

## 本件の差分と#235との関係

既存のSkillとcanonical guidanceにActivity／Object表示を追加し、3 Skillの参照bundleを公式exporterで同期した。共有Checkの本文はActivity側・Object側のどちらに置いても一つとし、全関連ActivityとObjectから同じIDへ到達する。図・状態表は原典に基づき必要な場合だけ表示する。○は担当者の判断・必須入力を含む条件下での定義、×は原典の明示的除外、未定義エラーは設計上の未定義であり、実装時の例外・拒否・追加禁止を定めない。追加研究候補8件の承認、Object台帳／DSL、製品実装・正式BD・既存Check原典・manifestは変更していない。

#235は調査中40d8510f→517e6dda→01278802→7ff23617へ進行した。最初はmain基準で分離し、固定された最終返却head **7ff236179b408d5005761ba017825e2892dd1d3c**を土台に本件を積み直した。#235のbranchを停止・変更・mergeしていない。PR #240のbaseは`feat/check-item-examples`で、#235採否に依存する独立Draft PRである。

統合試行ではcanonical guidanceとSkillは自動結合できたがprovenanceが競合し、別々のdigestを足す方法は採らず、結合した公開原典から再exportした。#235の名前診断がObjectや既存ナビゲーションH2をActivityとして誤検出したため、本件側で原典Object名とナビゲーションを分離した。独立コードレビューがprefix無し／ASCII colonの正当なObject見出しにも誤検出を再現し、修正・回帰・[再レビュー](integration-rereview.md)を行った。誤Activity名・未知Object・Activity名との衝突は引き続き検出する。これはActivity名用の狭い診断で、一般Markdown parserやObject意味検査ではない。

最初の2 CI失敗は、main上の履歴fixture・未到達のbundle原典Git objectが取得されなかったもの。期待hashやassertを変更せず、履歴取得で再現・解消した。固定#235には必要な取得処理があり、最終差分ではそれを引き継ぎ、新規回帰suiteを両CIへ追加する。本件単独の中間branchは`study/check-two-view-initial`に保持する。

採用する場合の順序は、#235の独立採否→承認済み#235のmain統合→#240のbaseをmainへ戻す→最終差分・bundle・必要CI再確認である。#235のheadが変わった場合は、この固定結合版の結果を無条件に流用しない。

## 入力・実行の固定

- baseline：main `9e6ee9dd2ff65330aa5395cd40ed9d5b99b24d59`、[依頼全文・hash](baseline-scoped-report.md)。既存BD内容のSHA-256は`afa5fbfe4160b9c962b6a3ce9df4f83a42f5138d626c1ed3b7f3bfbea08794f7`、既存Checkは`d2ad07f06cdef93537f6b8b5cca32a5f0f9ebad49ea4ba3f3ffcb1b407cfff55`。
- 単独候補：公開source `620a728ab04dbca1528527121d1d8db320db5ad2`→bundle `d465c6c0c87740712bba8361b2f24ddde6ad314c`。最初の生成・更新・状態なし・図追加の原記録は同directoryの各report。
- 結合候補：公開source `20ae45a46517c3812706fb94dfc7e6faa15a83f6`→bundle `8be11c2785ba3f53e9e725d3fb8a2d377fab544f`。[依頼全文・全hash](combined-generation-report.md)。初稿担当は初稿保存まで既存Checkを読まず、更新時に初めて既存Checkを読んだ。完成見本、他生成物、研究・答案を生成担当へ渡していない。
- 名前診断の追加修正source `e19214c698c2d99952c8bcd42b59be95d980553a`からbundleを再export。Skill/guidanceとBDの意味は前の結合候補から不変で、診断の対応見出しだけを修正した。修正版生成物は更新済み診断も通した。
- Fresh生成・読取・コードレビューはAGENTS指定の`gpt-6-sol / medium / fork none`を要求した。修復と再レビューは各担当contextの継続。実効runtime設定は独立に証明していない。隔離は別contextとパス／禁止入力指示によるものでOSアクセス制御ではない。
- rawと各依頼全文・実際のhashを保持。内部証拠の原記録には英語や実行時相対パスも残す。rawを移設したために切れる相対リンクは成功見本とせず、最終修正版の固定URLを使う。

## 検証と限界

最終ローカルのPackage／Workflow／Reference／本件回帰は93件、Business Graphは52件、driftは12件と26 scenario。実行ログを同directoryに保持する。最終headのCIはPR #240のChecksとroot #123の返却記録で確認する。release workflowは検証のみで、公開release jobは実行しない。

回帰suiteは既存6本文と補助情報の保持、全12セルの三分類、重複・根拠欠落・確認済みへの不正変更の拒否、アンカー、4遷移の図と表の整合、状態なしのObject、状態ありでも図のみ、syntheticの既存確認済み状態とTest対応、結合出力の保証と参照を検査する。boundedな保存出力の回帰であり、任意BDの意味・完全性の自動判定ではない。

GitHub実レンダリング、実際の依頼者による理解・操作、誤読率・レビュー時間の改善、一般的な生成成功率、網羅性、製品Test実行・業務意味の人間承認は未検証。関連外のWeb Viewer変更・#109/#110/#117/#122・SR・実装方式へ波及させていない。外部から旧fragmentへ入る既存リンクは調査できず、本文内リンクは修復した。既知の外部互換性が必要なら旧target保持を個別確認する。

## 返却時点

限定例では、二視点表示の生成・更新と意味保持を、実際の別読取・修復・再レビューまで確認した。初回生成だけの無欠陥や完全自律成功は主張しない。Draftを維持し、採否と未合意の業務意味は人間へ返す。#123/#236はOpen、merge・tag・releaseなし。
