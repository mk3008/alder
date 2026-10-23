# Viewerの共通読込境界

## 経路

新規URL・履歴URL・共有URL・明示再取得は `document-loader.ts::loadDocumentURL` を使う。ファイルは `loadDocumentFile`、貼付本文は `loadDocumentText`。取得後はすべて `json-document.ts::parseDocument` → `normalizeDocument` → `viewer-document.ts::readViewerDocument` を通す。

- MD：既存MD parserで解釈 → 閲覧用の型付きJSON → 共通読込 → 既存表示モデル。
- 保存用JSON：既存の厳密parse/Schema・版・参照検査 → 同じ閲覧用JSON → 同じ共通読込。

閲覧用JSONは `ViewerDocumentJSON`（内部version 1）で、Graph・文書順・Findings・明示状態・保存文書のレビュー情報を扱う。これはBusiness Graph v1の新契約でも、保存用 `alder-document-package` の新バージョンでもない。JSON文字列への不要なserialize/parse往復はしない。元の本文・MD詳細表示の断片は `OriginalDocument` として正規化データの外に保持する。原文確認やMDの既存Drawerを維持し、JSON→MDを生成しない。

## 互換性と責務

Gate Aの保存用MD→JSONコンバーターはNode/Pythonで実行する独立した明示移行。Viewerの自動読込で呼び出したり、旧MDを正式JSONへ保存/置換したりしない。Gate Aの未対応見出し・未解決参照等の契約を緩めず、従来Viewerが受け付けたMDを狭めない。読み取り時の正規化IDは元のMD名称ID、保存用JSONでは永続IDのまま。Graph・配置・配線・保存形式・業務合意状態は変更しない。

URL履歴はURL/nameの参照のみ。新規と履歴で別のMIME/parser方針を持たず、application/jsonも共通の取得器で受け付ける。単独Check Markdownの取得 `fetchMarkdown` はCheck専用として残す。業務文書の履歴からは呼ばない。

URL/テキスト2MiB、ローカルJSON8MiB、タイムアウト/中止/CORS/匿名GET、原文保管、IndexedDBの先行commit・失敗時の旧画面保持は従来境界を維持する。URL更新確認では比較のために原文を取得するが、候補の解釈は共通parseDocumentを使用する。

## 検証

`node --experimental-strip-types web/test-document-loader.mjs` はFile/URL/テキストのMD/JSON、正規化JSONの直列化、共通参照検査と実アプリDOMの新規/履歴・重複除外・不正履歴の旧表示保持を検査する。`--baseline` は固定head1b82b23fの実mainをビルドし、JSON履歴を開けず旧MD18ノードが残る失敗（期待JSON6）を再現する。修正後は成功。

既存のjsonDocuments Chrome群へ393pxのMD/JSON新規URL→別文書→履歴→native保存復元・壊れた履歴の表示保持を追加。図形の絶対値を増やさず、読込境界の結果を確認する。JSON document/state/role、共有URL/cleanup、workspace DOMは影響するため手元で選択実行した。反復中の全件E2Eは行わない。最終CIは最新main AGENTS/validationが要求するものを一度実行し、結果はIssue #274とDraft PRに記録する。

## 今回扱わないこと

保存用Schemaへのブラウザー内MD完全変換、Plugin変更、状態/概念モデルの業務仕様、閲覧履歴UIや配置の再設計は対象外。別branchの余白ラフ66a0は本人確認待ちのまま保持し、この読込共通化へ混ぜない。
