# Viewerの単一原本とActivity詳細

Control: [root #122](https://github.com/mk3008/root/issues/122) / Execution: [Alder #233](https://github.com/mk3008/alder/issues/233) / Draft: [PR #239](https://github.com/mk3008/alder/pull/239)

## 方針と実装

2026-10-16の本人判断でGroupによる階層化を取りやめた。全体図の簡略化は目的にせず、原本の全Activity・Object・相関を表示する。各Activityの詳細だけを直接Input/Outputの1段に絞る。ObjectのPrivate/Public属性、Scope、Graph v1、業務上の意味は変更しない。

- `activities.ts`：全体図は元のDesignそのもの。詳細は指定Activity、直接I/Oを持つObject、そのI/O線のみ。例外や他Activityからの再帰展開は行わない。ObjectとRelationは元定義の同一性を保つ。
- `workspace.ts`：原本のMarkdown・取得元・draft・関連Checkと表示タブを分離。保存形式3は原本1件＋原文を含まないActivity views＋復旧文書。全体図は常設、同じActivityは1タブ、座標・倍率・選択は独立。
- Activity本体はクリック／tap／Enter／Spaceで詳細を開く。移動は別のハンドル。mouse・pen・touchは既存の座標・端スクロールモデルを使用し、移動後に詳細を開かない。ハンドルでは矢印キーで10、Shift＋矢印で1ずつ移動できる。配置ロック・倍率・保存／復元は既存モデルを維持する。
- Object本体の選択・移動、右Drawer、関連Check、原文編集と取得元更新を維持。詳細から開いても文書全体を扱い、開始元の詳細を閉じた後の非同期更新／Check読込も同じ原本へ継続する。
- 旧複数文書Sessionは全原本・draft・Checkを復旧欄へ保持。旧Group形式2は全体図から再開し、旧viewsとactiveを`legacyViews`へそのまま退避する。読取だけでは元レコードを書き換えず、全保存JSONから旧表示も退避できる。保存失敗・競合では原文・旧表示を保護する。

## Groupの整理と後方互換性

PR #231の変更範囲と利用箇所を調査した。暫定Groupは標準Business Designの前書きと独立したPoC／検査だけで、Graph v1 exporter本体や正式schemaの一部ではなかった。

- 標準`business-design/alder/README.md`の暫定分類とGroupsセクションを削除。Activity・Object・相関の本文は保持する。
- 不要となった`group_poc.py`と専用テスト、ViewerのGroup parser／集約投影を除去。関連する検証はActivity投影・旧注釈互換・旧保存形式の検証へ置換する。
- 既存ファイル内のGroups注釈は意味を与えず読み込み、原文を勝手に書き換えない。PythonとTypeScriptの双方でGraph v1が変わらないことを検証する。歴史的記録と旧commit固定Previewは保持する。
- 別Draft PR #228は変更しない。既に統合した#234/#238のNode並列runnerと既存の回帰検出項目を維持する。

## 検証と返却

候補commit、最終CI、公開Pages確認版のURL・配信hashはPR #239と両Issueへ記録する。限定実行や過去のGroup版の成功を最終成功として扱わない。

- Activity投影の正確な集合・方向・Object同一性、旧注釈、format 2/旧Session移行、原本共有・復旧・異常系をunit／DOM／生IndexedDBで確認する。
- 既存の移動・選択・配置・保存回帰は、ActivityハンドルやObject、既存の一覧操作で検証する。長いタブ名の配置テストには明示した長いActivity名の入力を使う。座標・経路oracleを簡略化して通さない。
- 実ブラウザーのActivity群は1280/393/320pxで詳細、重複防止、独立倍率、ハンドルのkeyboard/mouse/touch、誤Openなし、座標reload、関連Check、非同期更新を確認する。既存39群を維持した全40群を最終CIで確認する。
- ローカルChromiumのフォント／native clipboardには既知の環境差がある。変更前からの差を区別し、assertを維持して最終CIのChromeで判断する。

本人のGUI実操作による採否と、その後のmerge許可は別の判断。実機Android/iOS、OSファイル選択／権限変更、突然のプロセス終了の耐久性は自動検証の範囲外。確認版のPages公開は本人の許可済み。本番更新・merge・releaseは行わない。
