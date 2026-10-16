# 初稿2件の Consistency レビュー

## 依頼文（全文）

> Perform another separate read-only Consistency review using same installed Skill/guidance, now for initial drafts candidate-initial.md against whole purchase-request BD, and candidate-stateless.md against whole ai-result-review BD. No previous Check list or prior diagnoses for this initial derivation. Raw draft artifacts only; do not read generation reports or tests. Both are unconfirmed reference drafts, Japanese GitHub Markdown with Activity/Object viewpoints. Report source-grounded NG, undecided business questions and verification limits; no edits, approval or nested review. Save candidate-initial-review.md with full prompt, hashes and actual scope in scratch parent. Also assess whether diagrams/tables were selected appropriately without imposing optional features.

## 対象・固定情報

- Alder plugin 0.4.8、リポジトリ HEAD `d465c6c0c87740712bba8361b2f24ddde6ad314c`。`alder/plugins/alder/skills/alder-draft-check-items/SKILL.md` SHA-256 `2f29d5df6c5f30f872867296a8df58950b9a91d62c75d152932f489bc7a2a744`、同 `references/check-item-traceability.md` `fd24530c6d0183e5adf06d08be2afaa34b3737e8d5335711e589c8634e7cf867`、`references/adoption.md` `c2d6c77d5ec28c5a20411a234c67bea8f43336c465c2507470b515160546d542`。
- `candidate-initial.md`（204行、SHA-256 `2d232e15a99887c872b224276528529ccd0265834c2fb655b067484c04b57f2a`）を `alder/business-design/purchase-request/README.md` 全314行（SHA-256 `afa5fbfe4160b9c962b6a3ce9df4f83a42f5138d626c1ed3b7f3bfbea08794f7`）と照合。
- `candidate-stateless.md`（161行、SHA-256 `de9211ce87c58e8799390874da9e558e276c5d15955fdbb7a81da6f59a71c08c`）を `alder/business-design/ai-result-review/README.md` 全167行（SHA-256 `7faa4740be47601e9dc48a88090dc91fbe68ac533ef2df60ad10f88ca77c50a5`）と照合。前版 Check、生成報告、テスト、他のレビューは読まず、候補・原典の生データのみを対象にした。

## 根拠・適合した点

- 両初稿とも原典の `# Activity` 名をそのまま使い、4列索引から各 Check 本文へ直接リンクする。主要項目は見える位置に一度だけ置き、補足は閉じた `<details>` 内にある。購入申請稿の9 ID、結果返却稿の8 ID はそれぞれ単一本文を持ち、共有 ID は関連 Activity から同じ本文へ到達する。内部アンカーは全件存在する。未合意・未レビューの位置づけも明記されている。
- 購入申請稿の Object 購入申請の状態表は、業務設計23–31、123–314行の状態遷移と業務間接続をたどる用途に適している。○の結果は既存 Check に結びつき、`rejected` の購買対象外だけを×とする根拠は31、263–265行にある。他の組合せは未定義として扱い、実行時例外や禁止と同一視していない。図を追加する必要はない。
- 結果返却稿は結果説明から確認結果への情報の引継ぎを Object 節のリンクで示す。業務設計9–71、73–159行にこれら Object の状態遷移はなく、状態図・状態表を設けなかった判断は適切。任意の図表を欠いたことを NG としない。

## NG（出典と記述規則に基づく不適合）

1. **PR-08 の条件が購入結果の登録を落としている。** 候補160–162行は「対象を選択し、その備品を購入して、実購入金額を入力したとき」に直ちに `purchased`、実購入金額と購入日時の記録を期待する。業務設計298–314行では、備品の購入に加えて「その結果を登録する」業務であり、実購入金額の記録、状態変更、購入日時の記録を手順3–5として定める。入力しただけの時点を結果成立条件にすると原典より早い保証になる。Check の条件と結果を原典の境界に合わせるという traceability guidance「Write conditions without changing their logic」「Before returning a draft or update」に反する。PR-09（候補177行）は登録を条件に含んでおり、この違いも見える。修正は原典の登録条件を PR-08 に明示することで足り、新たな業務規則の決定は要らない。
2. **PR-04 の期待結果に別時点の購入入力が混在する。** 候補80–82行は承認済みになった時点の購買対象への引継ぎと、「購入時には対象申請を選択し、実購入金額を入力する」を同じ期待結果欄に置く。後者は業務設計279、291–303行の後続 Activity の入力条件であり、承認の結果（214–216行）ではない。候補 PR-08 が後者を扱う。traceability guidance「one independently reviewable observable expectation」「Activity and Object viewpoints」の条件付き接続に照らし、承認時点の期待結果と後続 Activity の条件を分けて参照する必要がある。これは新 Check を求める指摘ではない。

`candidate-stateless.md` には確認範囲で明確な NG を認めなかった。上記 NG は人間レビュー状態の変更を意味しない。

## 業務上の未決事項

- 購入申請の金額別承認者・承認段階、在庫・発注・納品・検収・支払、購入先、購入後管理、連携、監査・通知は業務設計33–44行で未決定または対象外。初稿はこれらを確定規則にしていない。今回の2件の NG は業務判断を要せず、出典に沿う条件・記載場所の訂正で対応できる。
- AI結果返却の業務設計にも、この初稿の Check を確定させる新たな業務判断は見つからなかった。個別 ID のタイトル・条件・期待結果の確認は依頼者に残る。

## 検証の限界

相対的な原典リンクのローカルでの存在、内部アンカー、折りたたみ構文、原典行範囲を静的に確認した。GitHub 上の描画、実装、Test/assertion の有無・実行結果、業務上の合意は検証していない。初稿は網羅的な設計引継ぎや人間の承認を主張できない。
