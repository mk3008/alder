# 状態遷移JSON統合の検証記録

PR #265固定head `7bb51e91eea393d4a6a0eaf02373698e11ff2ae4` の `state-transitions.ts` と依存するgraph-focus/graph-visualsを選択移植した。状態図用CSSだけを別ファイルへ切り出し、共通カードCSS、既存配置器7ファイルとGraph v1は変更しない。Object右Drawerに既存候補と同じ状態遷移タブを追加し、Activityの別レイアウト/SR/Medium/概念モデルの変更は取り込まない。

`formatVersion: 0.2` の候補契約と、文書payload `stateTransition/0.1` を追加した。BD/Check 0.1と各文書の内容revisionは独立。旧0.1を受け付け、0.1に新kindを入れた候補・未知版/kindは拒否する。状態/操作をinventoryへ加え、Object/Activity/状態のID・参照先型・原典版・重複・例外名・効果の整合を検査する。状態図はJSONから直接投影し、JSON→MD文書を生成しない。

## 原典と試験入力の区別

`original-pr265.md` は既存公開fixtureの変更なしのコピー。13操作の明示宣言と例外名は固定原典と同一で、T07/T08/T10/T11/T12の未決、T03の非作成、partialを保持する。原典にはMedium/SR DependenciesというGate A未対応の補助見出しがあり、そのままの一方向変換は今回も失敗する。

`make-fixture.mjs` は**試験専用**の対応profileを作る。Medium/SR Dependenciesの本文を捨てずprefaceへ項目名/Object名とともに移し、その他のBD各欄・明示状態表を維持する。移動した全4欄は `unsupported-fields.json` に記録。この正規化は製品converterへ実装しない。原典全体を正式変換可能にしたとは主張しない。JSONへMD全文は同梱しない。

`node work/json-state/issue-275/make-fixture.mjs` で `supported-state.md` と、その同一入力をGate A APIで変換した `purchase.json` を再現する。正式BD/Check・研究PR #254/#265は変更していない。

## 検証

- `node --test tools/document_storage/test-states.mjs`：13操作/未知版/壊れた参照/重複/例外名/未決/循環・明示不変/改名・再順序/再変換。元の未対応原典が失敗する対照も含む。
- `cd web-viewer && node --experimental-strip-types web/test-json-states.mjs`：MD明示宣言と型付きJSONの正規化後モデルが一致。移植した同一rendererのSVG/箱/線/ラベル/操作詳細がouterHTML単位で完全一致。Enter/EscapeとObject改名を確認。
- `jsonStates` Chrome群：1280/393pxの実ViewerでMD/JSON図・13操作、キーボード、未決、Activityへの移動、保存/復元と無宣言Objectを確認する。最終CI結果はIssueに記録。

未対応：complete/確定終端の一般化、自然文からの抽出、状態の再変換時改名binding、原典SR/Mediumの正式変換、概念モデル。Checkの人間確認、既存状態遷移の業務意味の承認は自動化しない。正式採用/merge/release/本番配信は行わない。
