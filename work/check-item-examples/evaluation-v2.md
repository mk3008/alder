# Check Item Skill v2 再評価（暫定・継続評価）

2026-10-16。担当 `/root/independent_evaluation`。これは同じ評価者による継続評価であり、新しいFresh reviewerではない。元の `independent-evaluation.md` は保持した。公開候補revisionは依頼指定の `667d92cf0f361dc6dbaf4597661a173b06e4ef6d`、canonical authorityは `69e0da2f5d6e3e2a58aa8e33df7ebf0cdb701689`。この二つの実効配布・実行同一性は独立に証明していない。業務意味を承認しない。

## 判定

**前回の二つの主要欠陥は解消した。** 初稿の `candidate-v2-initial.md` 125–148行、PR-09は、原典 `generation-baseline/business-design/purchase-request/README.md` 33–44行で明記された金額別承認者・承認段階の未決を、項目自身の種別「業務設計で明示された未決事項」、要確認、閾値を決めない例、確認事項として保持する。PR-03/04への影響も言及する。更新の `candidate-v2-update.md` 3、45、77、106、141、167、204行等は、元の `generation-baseline/docs/examples/purchase-check-review.ja.md` の `c2852531ad62691c375e87818d8c3a49fd19803f` 固定URLを維持する。候補入力Business Designのsha256は基準入力と同じ。指定したv2 revisionはローカル `alder` gitオブジェクトとして見つからなかったため、その公開revisionとのdiffは確認不能だが、既存リンクを置換する根拠は見られない。

**残る明確な記述規則NGは初稿PR-01の保証式に限定される。** `candidate-v2-initial.md` 25行は「上記の申請登録が成立 ⇒ `submitted` と申請日時」という形で成功を前件に置く。v2同梱 `generation-candidate-v2/plugins/alder/skills/alder-draft-check-items/references/check-item-traceability.md` 135、143行は、操作と結果を分け、`if registration succeeds` 型に保証を弱めず、操作から期待される結果を記すよう明示する。原典の「備品購入を申請する」Input/Procedure/Resultは、四必須入力で新しい申請を登録し `submitted` と申請日時を結果として記録する。PR-01の条件・操作・期待結果・通常例（22–29行）は直接の期待を読めるため、この欠陥でCheck全体の保証が消えたとは評価しない。ただし式だけを参照すれば状態保証の検査条件が循環し、今回の改修で狙った説明能力を損なう。候補初稿の他の状態式（PR-03 95行、PR-05 191行、PR-07 237行）と更新版JA-EX-01 29–30行は、操作から結果へ記している。PR-01の式をこの形に揃えて再検査することを勧める。

## 評価軸と差分

| 軸 | v2観察・判定 |
| --- | --- |
| 日本語の条件／式／操作／結果 | 概ね適合、PR-01式のみNG。更新JA-EX-01/03/05は必須入力のANDを成功保証から分け、対象の操作後の結果を示す（`candidate-v2-update.md` 22–30、120–126、183–189行）。初稿はRの対象同一性と承認前後、購入前後を明記（`candidate-v2-initial.md` 90–99、232–241行）。 |
| 例と未決結果 | 適合寄り。更新は通常操作と欠落入力を並べ、結果と注記を別列に置き、0・空白等の妥当性を決めない（`candidate-v2-update.md` 32–41、128–137、191–200行）。初稿はPR-08で欠落と空文字を異なる行にする（69–78行）。値域を定めない正常例は例示の限界を添える。表の各入力をより細かい列にする余地はあるが必須の41行や文字列一致は求めない。 |
| 原典明示の未決事項 | 改善・適合。PR-09と更新JA-EX-Q01（`candidate-v2-update.md` 83–110行）は金額経路を未決・未承認に保つ。初稿PR-08/10、更新の必須欠落例は未入力応答や対象状態外の遷移を創作しない。`rejected` 中の購買対象除外は別保証として残る（初稿206–224行、更新147–171行）。 |
| 構造・表の適性 | 適合。四列Activity索引、宣言済みH2名、H3 ID、H4区分、同じ本文への共有参照。初稿PR-06/10は関連Activityから同一IDを指す（5–12、175–178、221–226行）。更新JA-EX-04は単一本文で二業務の参照を受ける（9–12、147–175行）。比較例には表、単一場面には文章を使い分ける。 |
| 更新の保証／ID／状態／根拠／Test | 適合。更新のJA-EX-01/02/03/04/05とQ01は元の6主項目・期待結果の範囲、未レビュー5・要確認1、Q01の候補、根拠URL、導出、確度、関連業務、未収集Test証拠を保持した（`candidate-v2-update.md` 16–208行）。日時等の原典上別の保証を、この限定リストの期待結果に追加しない。既存HTMLアンカーの文書内リンクは見出しフラグメントに変換され、共有IDに別状態を作らない。外部から旧アンカーを参照するリンクの有無は未検証。 |
| 物理境界 | 適合。業務上の対象R・状態と条件を用い、テーブル、クラス、API、物理実装を強制しない。 |
| 別fixture回帰 | 適合寄り。`candidate-v2-regression.md` 18–38行は `登録済み ∧ (本人 ∨ 委任済み代理人) ∧ ¬利用停止中 ∧ 0日 ≤ 差 ≤ 30日`、0/30/31日と停止中を示す。C-02 51–74行は未決・保留済みで再質問しない。C-03/04はその相談の依頼者を保ち、C-04は要修正のまま（78–119行）。C-01確認済みと`test_acceptance::test_inclusive_window`の0/30日・最終実行結果未収集を保持（14、49行）。 |

v2初稿は10 IDで前候補の16 IDより少ないが、分割数自体は評価しない。独立した保持・時刻を一つの通常結果に束ねても、人間が個別に採否する必要があるなら後続レビューで分割できる。現入力の未合意Business Designから完全網羅や最適粒度は立証されない。初稿の通常値30000を閾値にしない旨とPR-09の未決は読めるため、通常例から金額別承認を確定したとは判定しない。

## リリース提案と検証限界

v2は前回より明確に改善し、**PR-01の循環した保証式の局所修正・再読後に、次の人間／Chat採用判断へ進める候補**とする。現状を全規則適合として無条件に採用する推薦はしない。この一件は式の記述NGであって、業務設計の新しい人間判断ではない。初稿の申請日時・一意性、各遷移と保持、除外保証、未決事項は原典に照らした範囲でおおむね保持される。

実際に読んだパス：`/workspace/scratch/0261bb5be107/independent-evaluation.md`、`evaluation-protocol.md`、`eval-only-specimen.md`（私的来歴・リンク・本文をこの報告に転記しない）、`alder/AGENTS.md`、`alder/docs/check-item-traceability.md`、`generation-baseline/business-design/purchase-request/README.md`、`generation-baseline/docs/examples/purchase-check-review.ja.md`、`generation-candidate-v2/business-design/purchase-request/README.md`、`generation-candidate-v2/plugins/alder/skills/alder-draft-check-items/SKILL.md`、同`references/check-item-traceability.md`、`alder/work/check-item-examples/fixtures/README.md`、同`checks.md`、`candidate-v2-initial.md`、`candidate-v2-update.md`、`candidate-v2-regression.md`、三つの対応`candidate-v2-*-report.md`。v2同梱ガイダンスは該当箇所を照合した。静的に各項目・見出し・共有・状態・意味・根拠記述を読んだ。公開URL到達、実際のGitHubレンダリング、Test実行、実装、人間による意味確認はしていない。`evaluation-protocol.md`のとおり、これは事前登録された盲検採点ではなく、限られた五出力の後続評価であり、一般的成功率や人間誤読率を示さない。

## 継続評価依頼全文（原文）

```text
Re-evaluate the final v2 candidate read-only, retaining your original interim report. Public source revision 667d92cf0f361dc6dbaf4597661a173b06e4ef6d; canonical authority 69e0da2f5d6e3e2a58aa8e33df7ebf0cdb701689. Use guidance from /workspace/scratch/0261bb5be107/generation-candidate-v2/plugins/alder/skills/alder-draft-check-items and the same original product inputs, same private eval-only-specimen and evaluation-protocol. Read /workspace/scratch/0261bb5be107/candidate-v2-initial.md, candidate-v2-update.md, candidate-v2-regression.md, and their reports if present. Check earlier material findings and all evaluation axes for new regressions, particularly source-preserved uncertainty, logical formulas/inputs/results, guarantees/states/shared identity/support/reference preservation. Initial IDs/splits may differ; no 41-row/string-equality criterion. Save /workspace/scratch/0261bb5be107/independent-evaluation-v2.md with concise disposition, exact evidence, remaining material defects vs optional limitations, adoption/release recommendation, actual checks, full follow-up prompt verbatim. Do not edit sources or generated artifacts, publish private specimen material, use network/other agents, or claim human approval. This is a continued evaluation by the independent evaluator, not a newly Fresh reviewer or the final Chat/human gate. Send confirmed material issues promptly.
```

公開時に非公開の管理課題番号のみを一般語へ置換した。評価内容・依頼文の実質は変更していない。
