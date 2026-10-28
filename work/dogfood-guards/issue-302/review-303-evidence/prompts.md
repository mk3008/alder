# 再確認のタスク記録

既存の `/root/storage_audit` 文脈を再利用。初回の要求設定はgpt-6-sol / medium / forkなし。今回は新規Freshを起動していない。実効設定・盲検性を主張しない。

## 追加タスク

PR #303の新しい人間レビュー https://github.com/mk3008/alder/pull/303#issuecomment-6481883434 への最小修正候補を読み取り専用で再検証してください。固定要求は /workspace/scratch/84e40d7c56da/alder/work/dogfood-guards/issue-302/review-303-contract.json（SHA256 e8b8931c0797228ddc66e4ae97b8e6a82b3bb6808e77fa8796c8f7b23290b627）。baselineはPR head b850df15875f53e994504d590226c07a6a0b1005、旧runtimeは同梱 /workspace/scratch/84e40d7c56da/alder/plugins/alder/skills/alder-manage-json-documents/scripts/document_storage/ にまだ保持。候補は /workspace/scratch/84e40d7c56da/alder/tools/document_storage/core.mjs と test-roles.mjs。正しいRole診断と古い診断の共存、重複、未知Activity ID、Object ID、Role確定後の残存を0.3/0.4で拒否し、正例・他の診断・失敗commit時の保存済みbytesを保持するか確認してください。製品・テスト・契約・過去証拠は変更せず、追加実行証拠と根拠を /workspace/scratch/84e40d7c56da/agent-output/storage-audit/review-303/ へ保存して返してください。既存文脈を再利用した別Agentの再確認であり、新規Fresh/盲検評価とは主張しません。まだ未コミットです。

## 正例の追加を通知

test-roles.mjsの新規検証に、同じpackage内で複数Activityの正しい未確定Role診断が共存する正例も追加しました。core/固定要求は不変です。全保存器テストはこの最終テスト候補で再実行中です。

## 全体回帰失敗後の追加確認

全保存器79件では78成功/1失敗でした（こちらの成功判断を訂正済み）。失敗はtest-storage.mjsの外部BD目録の正例が、本文BDを手で除いた後もそのBDのRole未確定診断を残していたことです。converterの外部目録作成は診断を生成せず、既存契約はexternalDocumentsにID/名称だけでWho/roleIdはないとしています。G4はin-package BDの現在のWhoに対応を求めます。製品コードは変えず、このfixtureに『BDを除いた直後の孤立Role診断は拒否』を加え、そのRole診断だけを除いた目録の正例・他診断保持・元のStale Check負例を保持しました。tools/document_storage/test-storage.mjsの該当テストも読み取り再確認してください。全79件は最終候補で再実行中です。期待の弱化ではないかも確認して、自身の再確認記録へ追補してください。未コミットです。
