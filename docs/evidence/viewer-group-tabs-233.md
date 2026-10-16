# Viewer Groupタブ改修の作業記録

## 現在の判定

**実装途中。受入れ候補ではありません。** 原本/表示状態の分離とGroup投影の限定検証は成功していますが、既存の全体回帰は未成功です。merge・release・本番配備・一般公開は行っていません。

## 実装

- `groups.ts`: PoCと同じ明示的なGroup所属を検査し、Graph v1を変更せず表示用Graphを投影。全体図のGroup間/未所属ActivityとのI/Oは原Graphから置換し、詳細図は所属Activityと実際のObjectに限定します。境界関係は原Endpoint名で右Drawerに示します。
- `workspace.ts`: DocumentStateとViewStateを分離。保存形式2はdocument 1件、原文を含まないviews、旧文書のrecoveryを保持します。旧Tabを使う既存表示コードへは、非列挙の文書accessorを渡します。保存時にはそれらを直列化せず、documentを一度だけ保存します。
- 異なる原本へ切り替える前に、現在の原本・未反映draft・関連Checkをrecoveryへ退避します。既存原本がある場合は保存成功後に表示を切り替えます。旧複数文書Sessionは選択中の原本を開き、全旧文書を復旧欄で選び直せます。復元のみでは保存を書き換えません。
- Groupタブの重複防止、個別の倍率/座標/スクロール/選択、全体図の常設、改名・削除後のタブ整理。文書のCheck読込状態と取得元の更新ガードは文書単位で共有します。
- 保存のgeneration比較と同一transactionのwriteを保持。保存待機中のUI変更を、documentのcommitで巻き戻さないようにします。

## 検証

- `npm run test:groups`: 成功。構文異常、原Graph不変、全体/詳細の集合、タブ重複、独立倍率、旧複数文書のdraft/Check保持、改名、原本置換、DOMのEnter操作、IndexedDB復元・読取専用移行、stale write拒否を確認。
- `npm run build`: 成功。既存のbundleサイズ警告は残っています。
- 既存Node/DOMエントリを診断実行したところ、旧「複数原本タブ」・旧保存形式・非集約サンプルに依存する失敗が多数あります。個別実行の45秒上限による未完了もあり、`npm test`全体成功とは扱いません。assertや検証対象は削除していません。
- `npm test`の最初の失敗と最終headのCIはPR/Issueへ追記します。
- ローカルにChromeはありません。Playwrightによる配布物取得は壊れたZIPのため失敗し、実ブラウザー・スマホ幅の実操作・ネイティブFile System Access APIは未検証です。

## 残る作業

1. 旧テストの保存形式・文書操作を新しいDocument/View/復旧操作へ明示的に移し、既存の競合・quota/abort・draft救済・取得元更新・共有URL・関連Checkの検出能力を維持する。Groupなし旧文書の図形/配線の回帰と、新しい集約図の期待値を分ける。
2. Group機能の実ブラウザー検証、未所属/Scope外の復帰、Group間共有Object・Checkを含む操作を追加し、既存全群も最終候補で成功させる。
3. 壊れた旧Session/レイアウトの入力検査、file handle、保存失敗・同時操作を更に精査する。現在の限定成功で本番データ移行の安全性が完全に裏付けられたとはしない。
4. 最新mainとPR #234（Node実行方式）、その依存修復PR #238を照合する。今回のpackage.jsonはテスト追加だけで、並列実行方式は取り込まない。#234と同じtest行を触るため、統合時は両方のコマンド保持を確認する。
5. 全体CI成功後に受入れ用のcommit固定確認版を再作成し、本人GUIレビューへ渡す。現状のパッケージは途中版の探索用で、採用/merge許可を求める完成版ではない。

PR #228は変更していません。既存のGroup宣言とBusiness Designの意味も変更していません。
