# 導出・著者確認記録

## 受領した指示（全文）

> Use /workspace/scratch/dab003a8ea37/alder/plugins/alder/skills/alder-draft-check-items/SKILL.md and bundled references (revision d465c6c0c87740712bba8361b2f24ddde6ad314c) to draft Japanese Check Items from /workspace/scratch/dab003a8ea37/alder/business-design/purchase-request/README.md. The BD is unagreed example: generate only unconfirmed reference draft. Do not read any previous Check lists, docs/examples, root specimens, work/, baseline/candidate outputs, tests or implementation. Generate one GitHub Markdown document with Activity outcomes and Object-mediated handoff review. Preserve undecided business policy; no invented rules. Save /workspace/scratch/dab003a8ea37/candidate-initial.md and report /workspace/scratch/dab003a8ea37/candidate-initial-report.md containing full prompt, input hashes, actual checked scope and limits. Separately run this same Skill on /workspace/scratch/dab003a8ea37/alder/business-design/ai-result-review/README.md as an unconfirmed reference draft and save /workspace/scratch/dab003a8ea37/candidate-stateless.md; do not read implementation or previous derivations. Do not edit repository or approve meaning. Perform author checks; coordinator handles separate reader.

## 入力・権威

- Alder plugin commit（指示で指定）：`d465c6c0c87740712bba8361b2f24ddde6ad314c`。インストール版：`0.4.8`。バンドルの `provenance.json` に記載された Alder source revision：`620a728ab04dbca1528527121d1d8db320db5ad2`。
- `alder/plugins/alder/skills/alder-draft-check-items/SKILL.md`：SHA-256 `2f29d5df6c5f30f872867296a8df58950b9a91d62c75d152932f489bc7a2a744`。
- 同 Skill の `references/check-item-traceability.md`：SHA-256 `fd24530c6d0183e5adf06d08be2afaa34b3737e8d5335711e589c8634e7cf867`。
- 同 `references/adoption.md`：SHA-256 `c2d6c77d5ec28c5a20411a234c67bea8f43336c465c2507470b515160546d542`。Check 導出に必要な同文書の冒頭から任意 Functional Interface 節までを参照。
- 同 `references/candidate-c3.md`：SHA-256 `a5c3874601d70edf87e1fc79b5501be80c35aa4f98d3870a545b79f4867f8446`。
- 同 `references/provenance.json`：SHA-256 `1e6d027a258729ff542f6b304e0bd0c71a4c25c4a62bdbf4ba946fbe0bedf7c4`。`alder/plugins/alder/plugin.json`：SHA-256 `8831bdea6a9fb06aef307f4859f71c1f3699eda32bde3d55a15c936743b1a1e6`。
- 主入力 `alder/business-design/purchase-request/README.md`：SHA-256 `afa5fbfe4160b9c962b6a3ce9df4f83a42f5138d626c1ed3b7f3bfbea08794f7`。
- 別入力 `alder/business-design/ai-result-review/README.md`：SHA-256 `7faa4740be47601e9dc48a88090dc91fbe68ac533ef2df60ad10f88ca77c50a5`。

## 実施した著者確認

- 両 Business Design の全文を読み、Activity の宣言名、Scope、Object Information、When/Who/Input/Procedure/Output/Result と記載された接続をそれぞれのドラフトに照合した。主ドラフトは 4 Activity、状態を持つ Object 購入申請、別ドラフトは 2 Activity と状態を定義しない Object の情報引継ぎを対象にした。
- GitHub Markdown の四列 Activity index、宣言順の同階層 Activity 見出し、各 ID への直接リンク、一つの一次本文、見える条件・期待結果・人間レビュー状態、閉じた `<details>` を確認した。主ドラフトの 9 ID と別ドラフトの 8 ID はそれぞれ重複なく、全 ID/Activity 内部参照に対象アンカーがある。一次フィールドは各 ID について一組、details 開閉は各 9/9、8/8。
- 主ドラフトの状態表は、`submitted` から `approved` / `rejected`、`approved` から `purchased` の定義済み接続と、`rejected` が購買対象外になる明示記述だけを ○/× にした。他の組み合わせを未定義エラーという設計レビュー分類に留め、実行時拒否や例外仕様にはしていない。別ドラフトには状態表や状態遷移を作らず、結果説明から確認結果への情報の引継ぎをリンクで示した。
- 主入力の業務設計で明示的に未決定・対象外とされた金額別承認、在庫・発注・納品等、購入先、資産管理、外部連携、監査・通知は採用していない。入力不足、対象なし、重複実行等も結論を作らず、未定義と明記した。別入力の訂正後の修正実行や恒久的な引継ぎ方法も拡張していない。
- 根拠の原文見出しと行範囲を参照した入力に照合し、導出分類・AI確度・Test 未照合と人間レビュー状態を区別した。すべて未レビューで、確認済みにはしていない。明示/強い導出を混同しないよう本文を再読した。別ドラフトの選択条件は明示的な「いずれか」の表示へ修正し、影響箇所を再確認した。

## 限界

これは未合意の例から作る参照ドラフトであり、業務相関レビュー済みの設計または人間承認済み Check としての引継ぎ評価ではない。実装、テスト、既存 Check、過去の導出・例示を読まず、Test/assertion の照合と実行証拠の評価は未実施。GitHub の実レンダリングと独立した読者レビューはこの著者確認に含まれない。優先 ID は主ドラフト PR-02/04/07/09、別ドラフト AR-03/06/08。責任者が正確な ID ごとに確認・訂正・保留を判断するまでは意味は承認されない。
