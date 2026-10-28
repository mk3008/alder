# Viewer互換投影の追加確認

同じ既存 `/root/storage_audit` 文脈へ次のタスクを送った。新規Fresh・盲検ではない。

最終CIでViewerの5ユニットファイルが失敗しました。https://github.com/mk3008/alder/actions/runs/40782734269 。原因は既存document-input.tsのpre-Role(0.1/0.2)互換表示が、互換upgradeで派生したRole catalog/roleIdを消しschemaVersionを0.1へ戻す一方、その派生Role診断を残していたことです。共有validateReferencesの新しい全件対応がこの残存を拒否しました。未コミットの候補は /workspace/scratch/84e40d7c56da/alder/web-viewer/src/document-input.ts の当該branchでRole未確定診断だけを併せて除く1行と /workspace/scratch/84e40d7c56da/alder/web-viewer/web/test-json-roles.mjs の境界テストです。固定契約 /workspace/scratch/84e40d7c56da/alder/work/dogfood-guards/issue-302/review-303-legacy-contract.json SHA256 d438efb3409565af58187fc446c0f2b494acbce273f3893b4b571964416e9d68。raw sourceは入力時にshared validatorを通り、実際の0.3/0.4不正Role診断を除去してごまかす変更でないか、元JSON/他診断/Role色を保持するかを読取り確認してください。直接再現probeは /workspace/scratch/84e40d7c56da/verification/review-303-legacy-probe.mjs（node --experimental-strip-types probe-path alder-root）。before/after JSONも同verificationにあります。source/runtime/契約は変更せず、追加証拠を自身のreview-303フォルダに保存してください。Node依存なしの実際のnormalizeDocument/parseDocument境界だけならローカル実行できます。全文Viewer unitはesbuild/jsdom未導入のためCIで実行します。まだ未コミットです。

その後、依存なしの既存`test-json-roles.mjs`は必要な公開ソース/fixtureを取得して主作業者がローカル実行できた。全文Viewer unit未実行という限界は維持する。
