# PR #361 表示文言とCI統合

## 統合

旧head `bd5bb6fe` に main `c0376fcd`（#363・#362）を取り込み、`fe262cf3` に記録した。workflowの競合を解消し、Chrome 3分割へ追加3ケースを1件ずつ配分した。分割の和集合は55件、欠落・重複・未知名0。`browser-shards.json` の52件の計測値は履歴として残し、新55件の計測値と混同しない。

固定正本のfetchは最終verifyに保持。`structureSampleHeader`を担当するChrome 1に`structure-beta`成果物保存を置いた。各Chrome成果物は各runnerの`web/evidence/`と結果ログを保持し、`verify-published-beta`はverify成功後に実行する。verifyの`if: always()`とChrome集約結果の厳密なsuccess比較は、failure / cancelled / skippedを拒否する。Preview梱包は全Chrome・Node・lint/build/contract成功後に行う。

保護対象のbyte照合は、新mainの採用済み#363のPlugin変更を保護するよう基準commitだけを更新した。全対象の比較assertは保持した。Viewerの既存browser registryと既存assertは削除・緩和していない。

## 表示コピー

元JSONと以前のベータ6サンプル修正を入力に、FlowStepの説明2か所だけを正確なID・原文一致で差し替える。`display-copy.json`に元head・JSON Pointer・原文・表示文・作成ルールを記録した。汎用Viewerの入力処理・表示器・Schemaには変更を加えない。

構造説明はフローと手順の対応、順序、判定行、手順の共有を説明する。作成時の3ルールは別ページ「FlowStep 作成ガイド」に分離した。Preview識別欄のリンクから開ける。会話由来の比喩は通常説明とガイドに出さず、原記録と対応表に保持する。元JSONの業務ルールや合意を撤回する変更ではない。

## 周辺の表示確認

構造・項目の説明、用途、サンプル、関係条件とツールチップの入力経路を確認し、作成・レビュー等の語を含む候補を抽出して文脈を読んだ。抽出は調査用であり、表示の削除判定には使わない。集計は`surface-review.json`に記録する。

FlowStep以外の候補は、データの意味・利用目的・未決理由・旧形式の保持・業務改善やレビューを表すデータだったため保持した。既存の生成プレースホルダー表示処理には触れていない。以前に修正した6サンプルは再修正しない。通常の説明・用途と、null許容未決47件・各理由・互換移行表示・Preview識別を残す。これは全66構造の業務意味に対する完全監査や承認ではない。

## 検証の分担

実装修正と同一Agentの別工程で、`fe262cf3`の`acceptance.json`（COPY-001〜004、INTEGRATE-001）と既存固定正本へ照合する。独立Agentレビューではない。固定manifest自身のhashと各正本のhashを検査し、配信用コピーを元へ戻すと以前のベータコピーと完全一致することを確認する。汎用Viewerへ元文とメタ情報の語を含む通常文を渡し、そのまま表示する正例も確認する。

ブラウザーではFlowStep検索→標準手順→構造の説明を1280/393pxで表示し、通常説明・未決47・互換表示を確認する。作成指示と比喩が通常表示に出ない負例、ガイドの明示・3ルール・元記録へのリンクを検証する。公開照合では新旧の固定URLを開いてbefore/afterとガイドのスクリーンショットを保存し、新Previewの全配信ファイルを再構築したdigestと比較する。

ローカルの変更前画面は、既存Pages branchから`bd5bb6fe`の配信ファイルを取得し、manifestと全ファイルhashを照合してからHTTPで表示する。元JSONは同じ配信バイトをHTTPS URLへのブラウザーrouteで渡す。公開URLへの直接通信は実行環境のプロキシが拒否するため、公開の実配信確認はActionsの結果を用いる。
