# 固定候補の読み取り専用レビュー

担当: `/root/readonly_review`（別 Agent）。要求設定はモデル継承・medium・履歴 fork なし。実効設定は未確認。ファイル変更は禁止し、実装側の `review.ja.md` は読ませていない。

製品候補: `4ec70543763c7abc41270e2d130b22b2581445f4`。開始: `7ebe732f6ccc1676d591d564d95b711e473c60a3`。固定準備: `e5de0729da91ee6cc79ee1e49dad99b52d33c77f`。凍結台帳 SHA256: `8c4b19b5b38445d931a09597e1ccbd8ded3c2d23195929bc3be40cb3db8251ab`。製品ファイル SHA256: `fde424bef282388a03fdef472b3fbfb6fade89ba5d2beab4f63a6164e286b6e7`。

Agent の返却結果を要約：製品コードに修正を要する問題なし。逆順伝播と legacy の遮断が従来の直接子条件を維持する。137保護ファイル・既存269テストのバイト不変、7正本・32ID・39ケースの台帳一致を Git オブジェクトから独立に確認。新規9例は開始版／候補の双方で成功。担当が別途保存せず実行した手書き期待値でも、深い選択行のDOM・aria-current復元、手動展開復元、循環の有限検索と手動再展開、別host分離、同じモデルを変更後の再描画が成功した。これら追加独立例のコードはリポジトリ保存されていないため、保存済みテストと同じ再現可能性は主張しない。

| 正本の全ID | 実装と検証の意味照合 |
| --- | --- |
| STRUCTURE-001〜004 | 明示ルート、方向・多重度、循環・共有、検索解除時の展開復元、元モデル保持。test-structure-explorer.mjs |
| STRUCTURE-COMPAT-001〜004（v2） | 明示分類、初期ON、ON/OFFと検索、目印・理由、元データ保持。test-structure-explorer-compatibility.mjs |
| STRUCTURE-CLASS-ONLY-001〜005 | 属性表、属性検索、値の区別、復帰、関係・循環保持。test-structure-explorer-class-only.mjs |
| STRUCTURE-SIDEBAR-001〜005 | 切替、表示名・検索、中央詳細、URL・文書分離、他画面Drawer設定保持。test-structure-explorer-sidebar.mjs |
| STRUCTURE-OWNER-CONTEXT-001〜005 | 所属・含む構造、直前所有の逆戻り抑止、参照・個別起点の所属リンク。test-structure-explorer-ownership-context.mjs |
| STRUCTURE-TAB-001〜003 | 後続sidebar正本を適用したURL、再利用・状態保持・文書分離、有限展開。test-structure-explorer-focus-tabs.mjs |
| BETA-001〜006 | Nodeと既存browser assertionを静的照合。幅・native keyboard等はNode成功から実行済みとしない。test-structure-beta-fixes.mjs / test-structure-beta-browser.mjs |

後続の supersedes を適用し、属性ツリー行・別タブアイコン・型名のツリー表示・右Drawer配置を復活させない。所属リンクは直前所有の逆戻り抑止と、参照／個別起点からのリンクを区別する。

E/B-Vの指摘を修正側へ返却：初期ゲートはファイル成功から39結果を生成しており個別ケース実行証明ではない。BETAの実画面証拠を未検証と区別し、browser JSONのSHA256と配信buildを対応付けること。実装側は後続でpending状態と配信build照合を追加。最終版ゲートと全体CIの確認は別記する。Aの製品不適合、Sの仕様不足を断定しない。

## 再現するための依頼文

初回（全文）:

> Read-only independent B review for mk3008/alder PR #361 at pinned start 7ebe732f6ccc1676d591d564d95b711e473c60a3 in /workspace/alder. Do not edit anything. First read AGENTS.md, docs/review-responsibilities.ja.md, web-viewer/validation.ja.md, relevant .agents/skills if present, and preserve-behavioral-identity skill plus references/verification-loop.md. Review src/structure-explorer.ts and viewer-shell.ts under web-viewer. Candidate focus: remove repeated descendant search in filter via direct child visibility postorder; avoid global model caches. Assess grounded benefit, same requirements preserved, intended differences and supersedes in structure-explorer CheckItem authorities. Report B-S/B-V findings distinct from A/X/S, authoritative IDs/paths, exact code lines, concrete minimal change recommendation. Do not read prior work/361-b-path-review outputs (will be created); do not use parent conclusions as independent evidence. Requested model inherited (no override), effort medium; effective settings unverified. A later message will pin implementation candidate for read-only verification. Full prompt = this message; record it in response.

固定候補レビュー（全文）:

> Read-only verification of fixed implementation candidate 4ec70543 (full SHA obtain git rev-parse) in /workspace/alder. Do not edit. Compare frozen pre-B e5de0729 frozen.json with pinned original 7ebe732f. You may now read work/361-b-path-review/frozen.json and verify.mjs for baseline gate validation; continue avoiding review.ja.md parent conclusions. Review diff 7ebe..4ec (only filter code plus new independent fixture test/package/gate; baseline docs separately). Verify immutable authoritative bytes, all 32 ID/39 case inventory and no deletions; assess every applicable authority ID semantically vs implementation/retained tests with later supersedes. Run new regression baseline and candidate, and gate if useful. Challenge legacy-hidden parent/deep descendant, cycles, restored selection, model lifetime/isolation; important correctness based independent expectations not old/new mutual agreement. Report exact candidate, hashes, results, A/X/S versus B, concerns remaining. Requested settings inherited model, medium from original AGENTS Fresh instructions; effective unverified. Full prompt for this followup plus original retained in response.

途中の方針提示ではSetをfilter呼出しごとの局所変数にする案を共有した。新規独立レビューの盲検性や実装方式からの完全独立は主張しない。成果物・合否はこの記録ではなく固定ソースと実際の実行証拠で判断する。
