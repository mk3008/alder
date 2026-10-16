# 購入申請チェック項目の整合性レビュー

## 依頼文（全文）

> Use Consistency review-only operation of /workspace/scratch/dab003a8ea37/alder/plugins/alder/skills/alder-draft-check-items/SKILL.md and bundled guidance at d465c6c0c87740712bba8361b2f24ddde6ad314c. Review /workspace/scratch/dab003a8ea37/candidate-update.md against whole /workspace/scratch/dab003a8ea37/alder/business-design/purchase-request/README.md and previous /workspace/scratch/dab003a8ea37/alder/docs/examples/purchase-check-review.ja.md. Actual request: presentation-only update, Activity and Object viewpoints in one GitHub Markdown document; preserve existing Check IDs, conditions/results, review states, all supporting text, links/evidence; no new Checks and no inferred policy. Read raw artifacts, not others' reports or root specimens. Report evidence and NG, business questions, limitations separately. Do not edit artifacts, approve business meaning or invoke another reviewer. Save concise Japanese review at /workspace/scratch/dab003a8ea37/candidate-update-review.md including full prompt, hashes and scope. No prior diagnosis or expected findings supplied.

## 対象と固定情報

- レビュー種別：Consistency review only。候補文書は無編集。Alder plugin 0.4.8、リポジトリ HEAD `d465c6c0c87740712bba8361b2f24ddde6ad314c`。
- 候補 `candidate-update.md` SHA-256 `6525d2df53894b5b089f06dc96dd03f6859904116d93bda90d48b8b2f33da3a1`、前版 `alder/docs/examples/purchase-check-review.ja.md` SHA-256 `d2ad07f06cdef93537f6b8b5cca32a5f0f9ebad49ea4ba3f3ffcb1b407cfff55`。
- 業務設計 `alder/business-design/purchase-request/README.md` SHA-256 `afa5fbfe4160b9c962b6a3ce9df4f83a42f5138d626c1ed3b7f3bfbea08794f7`。候補の引用先 commit `c2852531ad62691c375e87818d8c3a49fd19803f` の同ファイルとも SHA-256 が一致。
- 適用手順 `alder/plugins/alder/skills/alder-draft-check-items/SKILL.md` SHA-256 `2f29d5df6c5f30f872867296a8df58950b9a91d62c75d152932f489bc7a2a744`、同 `references/check-item-traceability.md` SHA-256 `fd24530c6d0183e5adf06d08be2afaa34b3737e8d5335711e589c8634e7cf867`、`references/adoption.md` SHA-256 `c2d6c77d5ec28c5a20411a234c67bea8f43336c465c2507470b515160546d542`。
- 範囲：業務設計314行全体、候補186行全体、前版161行全体。GitHub Markdown の構造・名前・リンク・根拠、4 Activity と購入申請 Object、既存6 ID の内容保存を確認した。コード、実装、テスト実行のレビューではない。

## 根拠と照合結果

- 前版との差分は各 Activity に購入申請 Object への案内を1段落ずつ追加し、候補164–179行に Object 節と状態別接続表を追加した部分に限られる。既存の4列索引、6 ID（JA-EX-01～05、JA-EX-Q01）の単一本文・条件・期待結果・レビュー状態・未決事項の質問と影響・折りたたみ内の補足文とテスト証拠・原典 URL はそのまま残る。JA-EX-04 は却下と購入の両 Activity から同じ本文を参照する。
- 業務設計123–314行の4つの `# Activity` 宣言と候補の索引・見出し・本文の名称が一致する。Object 購入申請は業務設計15–31、98–121行の一意に識別される記録と状態・相関に対応する。申請の `submitted`、承認の `approved`、却下の `rejected`、購入の `purchased` は業務設計27–31、123–314行に根拠がある。候補の各○は条件付きで結果と既存 Check にリンクする。`rejected` から購買対象への×は業務相関5および却下 Result（31、263–265行）で明示される。他の未定義エラーは設計上の未定義と説明され、実行時例外・禁止とは扱っていない。
- Object 節から4 Activity と該当 Check に到達し、各 Activity から Object 節に戻れる。内部リンクの対象アンカーはすべて存在し、6つの `<details>` は閉じた状態の指定で、各 ID の主要項目は外側にある。金額別承認経路の未決定は JA-EX-Q01 の可視部分と接続表で維持され、確定した規則にしていない。

## NG（記述規則への明確な不適合）

確認範囲では該当なし。上記は候補文書の表示・整合性の判断であり、業務内容への人間の確認ではない。

## 業務上の確認事項

JA-EX-Q01：申請金額により承認者・承認段階が変わる場合の金額条件、承認者、承認完了条件は業務設計33–44行で未決定のまま。候補73–87行の「要確認」と未承認の期待結果を維持する。今回の表示変更のために新たな業務判断は求めない。

## 検証の限界

引用先の Git commit に格納された原典の内容と行範囲をローカルで照合したが、GitHub 上の URL の到達性と実際の描画は確認していない。アンカーの存在、見出し階層、折りたたみ構文を静的に検査した。候補は未合意の業務設計を原典としており、このレビューは人間の承認や Test 証拠の取得を代行しない。
