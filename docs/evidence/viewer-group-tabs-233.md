# Viewerの単一原本とGroup表示

Control: [root #122](https://github.com/mk3008/root/issues/122) / Execution: [Alder #233](https://github.com/mk3008/alder/issues/233) / Draft: [PR #239](https://github.com/mk3008/alder/pull/239)

## 実装と条件の対応

- `workspace.ts` は原本のMarkdown・取得元・draft・関連Checkと、全体図／Groupの座標・倍率・選択・表示設定を分ける。保存形式2は `document` 1件、原文を含まない `views`、以前の文書の `recovery`。ライブ表示の文書accessorは保存に複製しない。
- 全体図は常設。同じGroupを再度開くと既存の表示へ戻り、Groupだけを閉じられる。保存の完了前は閉じず、失敗時も図と原本を保持する。開いている編集画面の対象は、閉じたGroupから残る全体図へ引き継ぐ。
- `groups.ts` は明示された所属を検査し、Graph v1を書き換えず表示用に投影する。未所属Activityを残し、Scopeと所属を独立に扱う。詳細図は所属Activityと実際のObject、内部関係に限定し、境界の元Endpointと例外関係を右Drawerで読める。共有Objectは元定義の同一性とI/O方向を保つ。
- 配置の手掛かりとなるActivity順は原文から引き継ぐ。全体図では最初の所属Activityの位置にGroupを置き、実行順序を新たに定義しない。
- 原本の切替は旧本文・未反映draft・関連Check・全体図の配置を退避し、保存成功後に表示を変える。旧複数文書Sessionは選択中の原本を開き、全文書を復旧欄へ残す。復元だけでは元レコードを書き換えない。JSON退避も可能。
- 共有URLの再訪は現在または退避済みの原本を選び直す。原文の更新・Checkの関連付けは文書全体に共通。待機中に開始元のGroupが閉じられても、同じ原本への処理は継続する。原本が切り替わった場合は適用しない。generationの比較と書込みは同一transactionのまま保持し、保存中のテーマ・Drawer等の変更も巻き戻さない。
- 集約GroupのScope切替は元Activityの非表示IDを保持し、再読込で勝手に復帰させない。旧sampleLayoutの配置・倍率・余白も保持する。

## 検証

最終候補commit、CIの全体結果、固定確認版のhash・操作手順はPR #239とroot #122に記録する。限定実行や別commitの成功を最終headの全体成功として扱わない。

- `npm test`: 追加Groupの2スクリプト、既存の54ファイルを含むNode runner、3つのpreflightを保持。並列実行はmainへマージ済みのPR #234 / #238を取り込み、その方式のまま検証する。
- 旧文書タブのテストは、原本の復旧とGroup表示の操作へ移行する。固定の座標・配線oracleはGroupなしの旧文書fixtureに対して維持。新Group原本は別のunit／DOM／生のIndexedDB／実ブラウザー検証を持つ。保存の生レコードと、既存機能のassert用の読取専用モデルを区別する。
- Native browserのregistryは既存39群を残し、Group操作の1群を加えた40群。Groupの1280/393/320px、Enter・単一tap、重複防止、倍率の独立、Scope再読込、関連Check共有、原本の非複製を確認する。
- 保存失敗・quota・abort・競合・原文Apply・Close/Escape・救済ダウンロード、共有URLの連続変更、文書復旧、関連Check、図の表示・配線・ドラッグ・画像出力の検証を残す。
- ローカルChromium 153では、フォント変更の既存テストが変更前mainでも失敗し、native clipboardの成功系も環境差がある。assertを弱めず、最終CIのChrome結果を判定に使う。ローカルで行った実ブラウザー検証とCIは区別して記録する。

## 残る人間の確認

本人のGUI操作レビューと、その後のmerge許可は別の判断。実機Android/iOS、OSのファイル選択・権限変更、突然のプロセス終了に対する耐久性は自動検証の範囲外。自動検証の成功を業務上の採用・便益の確認として扱わない。

PR #228とBusiness Designの意味は変更しない。一般公開・merge・release・本番反映は行わず、確認版はcommit固定のlocalhost用パッケージとして渡す。
