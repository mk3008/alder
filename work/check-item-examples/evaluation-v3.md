# Check Item Skill v3 最終限定再評価（継続評価）

2026-10-16。担当 `/root/independent_evaluation`。指定候補公開revision `b7de3bf013e9133d72384ec5ffb26f66d4fdbfe9`、canonical authority `a3821d3d14dabd568a0d6da93b706dc251e24d0b`。先の `independent-evaluation.md` と `independent-evaluation-v2.md` を保持した。同じ評価者による継続評価であり、新たなFresh review、人間の業務意味承認、最終Chat採用ゲートではない。

## 判定と採用提案

v2で残った「成功を式の前件に置く」欠陥は解消した。`candidate-v3-initial.md` PR-01の22–25行は必須入力の**必要条件**、登録する**行為**、`submitted` の**直接の期待結果**を分け、成功を前件にした保証式を置いていない。`candidate-v3-update.md` 22–29行も同じ区別を保つ。v3同梱 `generation-candidate-v3/plugins/alder/skills/alder-draft-check-items/references/check-item-traceability.md` の「When an action's source specifies required inputs...」とSkillの「Before returning Check Items」に適合する方向である。金額別承認経路も初稿PR-U02（168–188行）と更新JA-EX-Q01（78–107行）で未決・未承認を維持し、更新は既存の原典ピン `c2852531ad62691c375e87818d8c3a49fd19803f` を保持した。

しかし、**初稿には修正を要する三つの明確な記述・意味保持NGが残るため、現出力をそのまま採用する推薦はしない。** いずれもBusiness Designの新しい業務判断なしに、原典の範囲へ戻す表示修正が可能である。

1. **共有Checkへの購買業務からの導線欠落。** `candidate-v3-initial.md` 9行にはPR-09「却下済み申請は購買対象にならない」が却下業務からだけリンクされる。10行の「承認済み備品を購入する」索引と274行以降の同業務節にはPR-09への共有参照がない。PR-09の条件・結果（233–250行）は購買担当者の購入対象からの除外そのものであり、原典の業務相関5（`generation-baseline/business-design/purchase-request/README.md` 23–31行）、却下Result（261–265行）、購入When（277–279行）に対応する。v3同梱guidanceの「GitHub Markdown document layout」は共有Checkを**every related index row and each other Activity's section**から同じIDへリンクするよう要求する。本文PR-09は一つで状態も一つなので、意味の複製ではなくナビゲーションの欠落である。
2. **例示値が独立保証の主条件を狭める。** 初稿PR-08は却下理由「不要」を主条件と期待結果に固定する（217–219行）。原典の却下Activity Input・Procedure・Result（242–265行）は、入力した却下理由を対象申請に記録する一般の保証であり、その理由文字列に限定しない。PR-11も実購入金額11000を主条件・期待結果に固定する（305–307行）が、原典の購入Activity Input・Procedure・Result（291–314行）は、入力した実購入金額と購入日時を対象に記録する保証である。値域の未決は別論点であり、受理された値の記録を11000だけに限定しない。両項目は例の値をサンプル（PR-08 221–223行、PR-11 309–315行）に置き、主項目では「入力した却下理由／実購入金額」と表せる。ここでの固定は文体嗜好ではなく、レビュー対象となる保証の範囲を狭める。
3. **宣言済みActivityNameと本文H2の不一致。** 原典は `# Activity 備品購入を申請する` 等で名前を宣言する（123、170、218、267行）。初稿の索引は名前だけを使うが、本文H2は `## Activity 備品購入を申請する` 等（14、100、190、274行）で `Activity ` を名前に付けている。v3同梱guidanceの「Human-facing view」「GitHub Markdown document layout」は、現行の明示宣言から得た**ActivityName**を索引・Activity heading・業務参照で使うと定める。リンクは接頭辞込みの見出しへ向けており静的に壊れていないが、記述規則へのNGである。H2を宣言済みの名前にし、索引リンクを併せて直す必要がある。

## 全評価軸の確認

| 軸 | v3の観察 |
| --- | --- |
| 条件・式・行為・結果 | 初稿のPR-01、04、07、10は必要入力と行為・期待を分離し、成立成功を前件にした式を廃した（22–25、108–111、198–201、282–285行）。状態の前後と対象R1/R2を明示。PR-09の `rejected ⇒ 購買対象外` は原典の確定保証であり、逆方向を導かない（239–242行）。更新もJA-EX-01/02/03/05で必要条件と期待結果を分ける（22–29、54–57、117–122、174–179行）。ただし上記PR-08/11の主条件が例示値に狭まる。 |
| 代表例・未決 | 初稿は同内容の再登録（PR-01 29–36行）、対象なし（PR-04 115–122行）、空白・数量0（PR-U01 84–94行）、金額差（PR-U04 345–355行）を未決として扱う。更新は通常と欠落・対象外の結果／留意点を三列の比較表に示し、失敗応答を断定しない（33–37、61–68、126–129、183–186行）。正常値の例を許容範囲の一般規則にしない旨も可視。表の列細分や行数は好みであり41行・評価見本の文言一致を要求しない。 |
| 原典明示の未決 | 金額別承認PR-U02とJA-EX-Q01は閾値・経路・完了を確定しない。PR-U01/03/04はAIが見出した欠落・値域の候補として起源を分けて記す。既知の必須性と、条件外での応答・記録を分離。 |
| 構造・共有 | 四列索引、四つのH2業務、各H3 ID、H4の条件／サンプル／参照、常時可視の状態・未決質問はある。しかし初稿のH2名称と購買業務のPR-09共有リンクが上記NG。更新のJA-EX-04は却下・購買両方の索引行と購買節から同一主項目を指し、単一状態である（`candidate-v3-update.md` 9–12、139–166行）。 |
| 更新のID・保証・状態・補足・根拠 | 更新は既存JA-EX-01、02、03、04、05、Q01だけ、通常5件未レビュー／Q01要確認を維持。主期待はそれぞれ `submitted`、`approved`、`rejected`、`rejected`の除外、`purchased` とQ01未決に限定。根拠リンク、導出分類、AI確度、接続、Test未収集記述とQ01の選択肢・影響も残る（`candidate-v3-update.md` 16–194行）。原典にある日時等の別期待を限定された既存項目へ増やさない。 |
| 論理対物理境界 | 業務上の申請、入力、状態で記述し、クラス・テーブル・API・実装方式や新たな必須DSLを要求しない。 |
| 別fixture回帰 | 新しい第三世代の別入力出力はない。`candidate-v2-regression.md` 18–27行の `登録済み ∧ (本人 ∨ 委任済み代理人) ∧ ¬利用停止中 ∧ 0 ≤ 暦日差 ≤ 30` は原典fixtureの**完全に明示された受付条件と結果**に対する保証式であり、v3の「不完全な成功条件から保証式を作らない」という追加説明と矛盾しない。0/30日、31日・利用停止中の未決応答、C-02保留、C-01確認済み、C-04要修正と既存Test証拠は前回評価の範囲で保持（同29–49、51–74、98–119行）。第三世代での再生成に伴う安定性は未検証。 |

上記三件を修正して保存後の索引リンクとPR-08/11の主条件・サンプルを再読した後、候補を次の人間／Chat採用判断に進めることを勧める。初稿IDの16件という数と独立結果の分割は採点条件ではない。原典の未合意状態は維持され、人間レビュー状態のAIによる引上げはない。

## 実施と限界

実際に読んだパス：`/workspace/scratch/0261bb5be107/generation-candidate-v3/plugins/alder/skills/alder-draft-check-items/SKILL.md`、同`references/check-item-traceability.md`の適用箇所、`generation-candidate-v3/business-design/purchase-request/README.md`、`candidate-v3-initial.md`、`candidate-v3-update.md`、`candidate-v3-initial-report.md`、`candidate-v3-update-report.md`、`candidate-v2-regression.md`、`generation-baseline/business-design/purchase-request/README.md`、`generation-baseline/docs/examples/purchase-check-review.ja.md`、`alder/work/check-item-examples/fixtures/README.md`、`alder/work/check-item-examples/fixtures/checks.md`、`evaluation-protocol.md`、以前の二つの独立評価と評価専用見本（後者の私的な本文・リンク・来歴はここに記載しない）。同一の評価作業を通じて読んだ範囲を示す。ローカルで二つのBusiness DesignコピーのSHA-256一致を確認した。指定v3公開revisionのgit objectは手元にないためその実体、原典URLのネットワーク到達性、GitHub描画、外部からの旧アンカー参照、Test実行、実装、人間の理解・承認は検証していない。

`evaluation-protocol.md`の通り、この一連の評価は独立した事前登録・盲検採点ではない。限られた生成・更新例から一般的成功率、誤読率、完全網羅、関連研究課題の結論を推定しない。

## 継続評価依頼全文（原文）

```text
Final bounded recheck after the last guidance clarification. Public candidate source b7de3bf013e9133d72384ec5ffb26f66d4fdbfe9, canonical a3821d3d14dabd568a0d6da93b706dc251e24d0b. Read generation-candidate-v3 bundled guidance and /workspace/scratch/0261bb5be107/candidate-v3-initial.md, candidate-v3-update.md plus reports as available; retain all earlier evaluations. Compare against same original source and evaluator-only specimen, all existing axes. Also check that /workspace/scratch/0261bb5be107/candidate-v2-regression.md remains consistent with final guidance; this last clarification affects incomplete success predicates, whereas the regression source has explicit complete eligibility/result rules, so report the lack of a third generation of that separate input as a limit. Judge semantic retention without requiring literal text equality. Save independent-evaluation-v3.md with full prompt, actual read paths, dispositions and recommendation. No edits to sources/generated outputs, no network/other agents, no private specimen content/provenance in the public-facing report. This is continued evaluation, not a new Fresh review or the final human/Chat adoption gate. If residual findings remain, distinguish material blockers from optional presentation wording; do not reclassify a real violation to force success.
```
