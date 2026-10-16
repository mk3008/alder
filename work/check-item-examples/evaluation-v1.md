# Check Item Skill 生成・更新の独立読解評価（暫定）

2026-10-16。評価担当 `/root/independent_evaluation`。依頼された設定は **gpt-6-sol / medium、fork none**。実効ランタイム設定の独立証明はしていない。公開基準 `9e6ee9dd2ff65330aa5395cd40ed9d5b99b24d59`、候補 `744998715701320dbce7030f33401114e3e7d47b`。Business Design の意味を承認せず、生成物やソースは変更しない。この評価は最終の人間／Chat採用ゲートではない。

## 結論とリリース提案

候補は更新の範囲維持と別fixtureの混在論理・境界・レビュー状態保持で基準より明瞭である。ただし、**この結果だけで採用を勧めない**。候補初稿は原典に明記された「申請金額によって承認者や承認段階が変わる場合」の未決事項をレビュー項目にも説明にも残していない（`candidate-initial.md` の承認業務、107–183行、特に PR-04、PR-Q02）。原典 `generation-baseline/business-design/purchase-request/README.md` 33–44行はこれを未決定と明示する。基準初稿も同じ事項を落としており、候補の新規退行ではないが、初稿生成の未解決の欠落である。候補更新は JA-EX-Q01 を保持したので、この欠落を検出する試験にはならない。

また、候補更新は元文書の `c2852531ad62691c375e87818d8c3a49fd19803f` に固定された原典URLを全て `744998715701320dbce7030f33401114e3e7d47b` へ置換した（`candidate-update.md` 3、40、68、98、128、153、185行等）。基準更新も同様に `9e6ee9dd2ff65330aa5395cd40ed9d5b99b24d59` へ置換した（`baseline-update.md` 3、34行等）。`git -C alder diff c2852531ad62691c375e87818d8c3a49fd19803f 744998715701320dbce7030f33401114e3e7d47b -- business-design/purchase-request/README.md` に差分はなく、両生成入力のsha256も一致した。指定されたSkill guidanceの「ローカル／一時コピーだけなら既存のソース改訂・URLを保持し、根拠あるソース変更またはマッピング欠陥の時だけ付け替える」（`alder/docs/check-item-traceability.md`、Before returning a draft or update）に対し、変更の根拠がない。新URLの行範囲はローカル同文書を指しているので、内容の誤引用とは断定しないが、恒久的な証拠リンクの同一性を表示更新で変えている。

この二点を直した候補で同じ初稿・更新依頼を再実行し、初稿の原典明示未決事項と更新のURL保持を再評価することを提案する。候補の後述の改善は保持できる。人間による業務意味の採否と実際の閲覧環境でのリンク確認は別途必要。

## 評価軸別の証拠

| 軸 | 基準 | 候補 | 判断と根拠 |
| --- | --- | --- | --- |
| 1 条件・式・行為・結果、論理方向 | 限定 | 適合寄り・限定 | 基準初稿は AND 箇条書きと結果を記すが、式と行為の分離が薄い（`baseline-initial.md` 19–23、114–118、288–293行）。基準更新は式を条件に混ぜ、全入力があれば結果になるようにも読める（`baseline-update.md` 22–29、50–56行）。候補初稿 PR-Q01 は必要条件、PR-09 は `rejected ⇒ 購買対象外` と逆を禁じ、PR-04 は承認前／後を分ける（`candidate-initial.md` 85–99、113–120、230–240行）。候補更新も必要条件と行為を分離し、除外保証の逆を禁じる（`candidate-update.md` 22–29、54–57、140–149行）。ただし正常例の「登録が成立した」「承認が成立した」「登録が成立した」は結果を入力側に取り込む弱い説明（同35、63、180行）。主項目の行為は試行・登録として別記されており、項目全体が同語反復の失敗とは判定しない。 |
| 2 具体例と未決結果 | 基準は限定 | 候補は改善・限定 | 基準初稿の例はほぼ通常例を文章に埋め、欠落時候補はあるが空文字・0等の区別は示さない。候補初稿は申請入力欠落・金額0、購買対象の `rejected` と `submitted` を別に示す（`candidate-initial.md` 90–99、321–330行）。候補更新は通常・欠落・除外の三列表と備考を用いる（`candidate-update.md` 31–36、144–149行）。ただし行ごとの列分解や0・空白の独立例は少なく、評価見本ほどの診断密度はない。41例や同文言は要求しない。 |
| 3 必須制約、未決の応答・値域、金額経路 | 初稿不適合、更新適合寄り | 初稿不適合、更新適合寄り | 両初稿とも未入力等の候補を扱う一方、原典33–44行の金額別承認経路を初稿本文から落とした。基準初稿にはさらに未入力時に `submitted` として「成立しない」、理由欠落で `rejected` として「確定しない」という未承認候補の具体的結果があり（`baseline-initial.md` 93–105、265–277行）、候補初稿は未決のまま結果・応答を保留している（`candidate-initial.md` 85–103、253–267行）。両更新は元の JA-EX-Q01 の閾値・経路・完了条件の未決と候補性を維持（`baseline-update.md` 69–89、`candidate-update.md` 74–102行）。候補更新は0・負値・空白を成功／拒否に変えず未規定とする（36、124、181行）。 |
| 4 構造・表・共有 | 基準初稿・更新とも適合寄り | 適合 | 候補の両購買成果物は4列索引、H2の宣言済み業務名、H3のID、H4の条件・サンプル・参照情報、同一ID PR-09／JA-EX-04 の共有リンクを持つ（`candidate-initial.md` 7–16、224–244、269–273行、`candidate-update.md` 5–16、134–161行）。更新では6件の主項目を一つずつ置く。候補回帰は C-01 に比較表、C-03・04に文章例を使い分ける（`candidate-regression.md` 29–40、85–106行）。基準版の旧折りたたみ形式は当時の出力形態であり、それだけを不適合と扱わない。 |
| 5 更新の意味・ID・状態・補足・Test | 基準は範囲逸脱、両者リンクNG | 候補は保持、リンクNG | 更新元 `generation-baseline/docs/examples/purchase-check-review.ja.md` の6 ID、JA-EX-04共有1本文、通常5件「未レビュー」、Q01「要確認」、根拠・導出・確度・関連業務・Test未収集を候補更新が保持した。`candidate-update.md` 16–189行の主期待は元の状態結果と除外保証に限定。基準更新は元のJA-EX-01/02/03/05の期待結果に日時・付随保証を追加し、表示更新の既存範囲を拡張した（`baseline-update.md` 27、54、106、156行）。これらは原典で別途支持されても、この既存6項目の表示改善では独立候補として報告すべき事項。両更新のソース固定URL付け替えは上記NG。 |
| 6 業務語と物理境界 | 適合 | 適合 | 候補は申請R・状態など業務上の対象識別で論理を記し、クラス、DB列、API、実装構造、個別例とTestの対応契約を規定しない。原典冒頭およびScopeと一致。 |
| 7 回帰fixture | 非該当（基準回帰出力なし） | 適合寄り・限定 | `candidate-regression.md` 18–40行は `登録済み ∧ (本人 ∨ 委任済み代理人) ∧ ¬利用停止中 ∧ 0 ≤ 日付差 ≤ 30`、両端と外側、両資格、停止中を扱い、条件外の応答・記録は決めない。C-02は原典で未決と明記し「保留済みで再質問しない」を維持（49–71行）。C-01確認済み、C-04要修正を保持し、対象のその相談の依頼者を明確化（75–115行）。既存 `test_acceptance::test_inclusive_window` の検査対象と最終実行未収集も保持（47行）。別の小規模例一件であり一般化できない。 |

初稿ID数と期待の分け方は違う。基準の18件と候補の16件を数で採点しない。たとえば基準の却下理由・日時はRJ-04/05に分かれ、候補PR-08では同じ却下結果に結び付く一組にまとめられており、この差自体は明確な欠陥ではない。候補初稿のPR-01、PR-02、PR-03、PR-05/08/11は原典の主要状態・保持・識別を扱い、PR-09は「rejected中の除外」を独立保証として保っている。初稿に金額経路以外の対象外事項を全てCheck化しないことは、Scopeから逸脱しない適切な選択である。

## 検証範囲と限界

読んだパス：`/workspace/scratch/0261bb5be107/alder/AGENTS.md`、`alder/docs/check-item-traceability.md`、`evaluation-protocol.md`、`generation-baseline/business-design/purchase-request/README.md`、`generation-candidate/business-design/purchase-request/README.md`、`generation-baseline/docs/examples/purchase-check-review.ja.md`、`alder/work/check-item-examples/fixtures/README.md`、`alder/work/check-item-examples/fixtures/checks.md`、`baseline-initial.md`、`baseline-update.md`、`candidate-initial.md`、`candidate-update.md`、`candidate-regression.md`、`baseline-initial-report.md`、`baseline-update-report.md`、`candidate-initial-report.md`、`candidate-update-report.md`、`candidate-regression-report.md`、評価専用見本 `/workspace/scratch/0261bb5be107/eval-only-specimen.md`。候補の同梱該当 guidance を必要範囲で照合した。原典のgit差分をローカルで読んだ。評価専用見本の私的な来歴、リンク、本文はここに転記しない。

`evaluation-protocol.md` が明記するとおり、事前に更新出力の一部が見られているため盲検・事前登録採点ではない。各workerの報告は実施を主張する範囲の資料であり、実効モデル設定、ランタイム隔離、レンダラ挙動、外部URL到達、Test実行、人間の誤読率を独立に立証しない。独立課題の結論や一般的な成功率はこの五出力から導かない。既存の参照を変えた事実は確認したが、公開GitHubで各リンクを開く試験はしていない。

## 依頼全文（原文）

```text
Perform read-only evaluation of Check Item Skill validation; do not edit sources/artifacts or approve business meaning. Read /workspace/scratch/0261bb5be107/alder/AGENTS.md and docs/check-item-traceability.md; baseline public revision 9e6ee9dd2ff65330aa5395cd40ed9d5b99b24d59; candidate public revision 744998715701320dbce7030f33401114e3e7d47b. Product inputs are /workspace/scratch/0261bb5be107/generation-baseline/business-design/purchase-request/README.md and (update only) generation-baseline/docs/examples/purchase-check-review.ja.md. Evaluate baseline-initial.md, baseline-update.md, candidate-initial.md, candidate-update.md and candidate-regression.md in /workspace/scratch/0261bb5be107; read completed *-report.md if present. Regression input is alder/work/check-item-examples/fixtures/*.md. Evaluation-only accepted specimen is /workspace/scratch/0261bb5be107/eval-only-specimen.md; do not publish its private provenance/links/text. Compare semantic guarantees, Japanese condition/expression/action/result structure, useful concrete samples and undecided outcomes, table suitability, stable ID/support/review/shared identity and logical-vs-physical boundary. Initial drafts may choose IDs and split expectations differently; do not require specimen string equality or 41 examples. Compare source-explicit relevant unresolved matters, language, logic including necessary/sufficient/implication direction, before/after target identity, existing scope. Report material defects with exact artifact/location and source support, improvements and limitations; distinguish actual failures from preferences or untested properties. Follow /workspace/scratch/0261bb5be107/evaluation-protocol.md with its stated non-preregistered limits. Save /workspace/scratch/0261bb5be107/independent-evaluation.md with full prompt verbatim, requested model gpt-6-sol / medium, fork none, agent ID, actual read paths, findings and release recommendation. No network/other agents. This is an interim independent evaluation, not the final human/Chat acceptance gate.
```

公開時に非公開の管理課題番号のみを一般語へ置換した。評価内容・依頼文の実質は変更していない。
