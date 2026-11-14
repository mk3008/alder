# PR #361 の経路改善レビュー

開始 head: `7ebe732f6ccc1676d591d564d95b711e473c60a3`。base: `c0376fcd34eb7227f695d26da07c9fe2d04f0778`。PR head とコメントは 2026-11-09 に GitHub から再取得し一致を確認。AGENTS.md、責務契約、Viewer 検証手順、preserve-behavioral-identity と verification-loop を読んだ。.agents は plugins/marketplace.json のみでローカル skills は存在しない。

## B 開始前の固定

`frozen.json` は開始 head から取得した既存正本の版、全 ID、明記された全 cases、バイト SHA-256 と保護ファイルを保持する。要求を追加・修正する準備工程は不要。cases 配列のない旧正本は各 ID の条件と保証全体を declared-guarantee として照合し、架空の条件直積を追加しない。全構造 Check Item を新規設計し直す S 工程ではない。

適用する後続判断：STRUCTURE-002 の逆向き非表示は OWNER-CONTEXT-002〜004 の直前所有への戻り抑止／参照経路・個別起点からの所属リンクを区別する。CLASS-ONLY は属性行を表へ移すが属性検索は維持する。SIDEBAR は詳細を中央へ移し型名・別タブアイコンをツリーから除くが検索語・URL・タブ・他画面 Drawer を維持する。COMPAT v2 は適用条件の分類だけを旧版から更新する。元の正本は書き換えない。

## 候補

B-S-1: `structure-explorer.ts` の filter は DOM を逆順に走査する一方、各行で全子孫を検索して直下の構造だけに絞り込む。子の hidden 判定は既に完了しているため、一回の走査で表示中の子を持つ親へ結果を渡せる。検索語生成、互換分類、展開、選択、検索解除時の保存ツリーと詳細表示は同じ仕様として保持する。構造の親子・所属文脈は統合しない。

独立した読み取り調査では全展開時の旧子孫候補数／直下数は complete: 1097/187 (188行)、normalized: 194/54 (57行)、structure: 189/39 (40行)。候補列挙の観測であり実時間の改善値ではない。新方式は filter 呼出しごとの局所 Set に結果を集約し、モデルやページをまたぐ cache を持たない。

B-S-2: 詳細再描画時の structureGraph 再構築と関係ごとの information 再走査も確認した。ページ・モデルの寿命へ結び付けた presenter 等は追加の API/所有責務を伴う。今回の小さい改善へ混ぜず現状保持とする。新しい可変モデル cache 契約を暗黙導入しない。名前整形の類似だけからの共通化は行わない。

B-V: 既存の構造 Node suite を反復の先行経路とする。Chrome 固有の描画・native keyboard・保存・iframe 境界は移管・削除しない。既存保証/assert は保持する。

A/X/S: この B は業務意味の承認、Check-Test 恒久対応の再編、Check パターンの新規策定を行わない。欠落した状態を pass にしない。古い正本の文言を後続条件と無関係に無条件適用しない。

## 検証方針

反復では構造 Node suite と、検索の深い子孫一致・互換枝の遮断・0件・解除の独立した期待値を使用する。先行成功時点では実 Chrome、共通 contract と通常 Node の残りは未検証。最終候補で lint、全 Node、build、contract、全 Chrome と全体 CI を維持する。各候補と終了時に別工程で固定正本のバイト、全 ID/cases/results の網羅性を機械照合し、ID削除・case削除・result欠落の負例も行う。本人 GUI と業務承認を代行しない。公開済み固定 Preview を変更・配信しない。

## 固定製品候補の結果

製品候補 `4ec70543763c7abc41270e2d130b22b2581445f4`。変更はfilterの5行追加・2行置換のみ。新規検索回帰は手書きの独立期待値9例を開始版と候補で確認し、既存構造22ファイル＋表示文検査は成功した。既存テストは編集していない。

別Agentの読み取り専用結果は `independent-review.ja.md` に記録。既存137保護ファイル・269テストのバイト保持と32ID/39ケース台帳一致を確認し、実装不一致なし。初期検証記録の証拠粒度への指摘を受け、BETA-001〜005は実browser観測がなければpending-browserとした。台帳の結果行生成を個別assertion実行証明とは扱わない。正本の意味とテストの対応も別工程で照合する。

関連Chrome（ローカルはChromium 154）2/55群: structureSampleHeader / explorerResizeScroll は成功。検索・互換・コピー文・native keyboard・280pxのツリーと幅調整・横スクロールを1280/393pxで確認、pageErrorsなし。残り53群はこの限定実行では未検証。11配信ファイルのHTTP応答とbuildの全バイトを照合し、`browser-identity.json` で製品SHA・観測JSONのSHA256と結合した。browser-results.json と targeted-browser-summary.json は観測記録であって検証正本ではない。

再実行（repo root）:

```sh
node work/361-b-path-review/verify.mjs work/361-b-path-review/browser-results.json work/361-b-path-review/browser-identity.json
```

ゲートは固定blobを一括読取し、byte不変とID/cases/results欠落・重複・失敗の負例を機械照合する。正常な過去の観測JSONが任意に偽装されないことを保証する仕組みではなく、この実行の記録と対象を明示するためのもの。配布buildがない場合は第2・第3引数を省略し、browserをpendingのまま実行できる。全体CIの結果はPRの最終headコメントを参照する。既存固定Previewは変更・再配信していない。

## 固定公開版の検証経路

`8f03b275` のChrome55群は成功したが、最終jobの事前照合で、公開検証がPR headをcheckoutし、そのHEADから公開URLを組み立てることを確認した。新しいheadを配信しない今回の条件では、未公開URLの出現を待つことになる。

B-V-2: `verify-published-beta` のcheckoutだけを公開済み `7ebe732f6ccc1676d591d564d95b711e473c60a3` へ固定する。既存の全assertion、配信ファイル・manifest hash・Chrome・作成ガイド・変更前後の照合を保持する。現在候補の製品はcurrent-headのChrome55群とverifyが担当し、固定公開版はその固定ソースから再構築して照合する。公開がCIの暗黙の前提にならないよう版の所有を分ける。artifact名は起動したPR headを示し、中身のmanifestは公開版のsourceを示す。配信・公開版上書きは一切行わない。

製品ソースは独立レビュー済み4ecと不変。新しい最終headで全体CIを再実行する。8f03b275の実行結果を新headの全体成功の代用にしない。
