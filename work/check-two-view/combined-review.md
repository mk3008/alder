# 二視点 Check 最終統合版の別読者 Consistency レビュー

## 依頼文（全文）

> 最終統合版の別読者レビュー。stack-source/plugins/alder/skills/alder-draft-check-items/SKILL.mdとbundle source20ae45a46517c3812706fb94dfc7e6faa15a83f6 / bundle8be11c2785ba3f53e9e725d3fb8a2d377fab544fを使い、combined-initial.mdをwhole purchase BDに、combined-update.mdをsame BD+元docs/examples/purchase-check-review.ja.mdに照合。初稿は未合意参照草案、更新は表示のみで全既存ID/保証/状態/補助情報/URL/Test証拠保持、新Check追加なし。GitHub上でwork/check-two-view/に保存して人間が読むMarkdownとして、アンカー・根拠参照も確認。rawと原典からsource-led二passを実行し、NG・業務未決・制約を分ける。作者報告・他review答案やroot見本は読まず、修正/承認しない。combined-review.md（scratch親）へfull prompt/hashes/scopeと結果保存。

## 対象・固定情報

- 指定 Skill `stack-source/plugins/alder/skills/alder-draft-check-items/SKILL.md`、Alder plugin 0.4.8。レビュー開始時の checkout HEAD `20ae45a46517c3812706fb94dfc7e6faa15a83f6`。Skill SHA-256 `65be6ef8989662599739584b61bbefc7b0058e1cf955e09ce971119436907ea7`。参照 `references/check-item-traceability.md` SHA-256 `bcac07de5da861fb6535c48fc122246ef90402b992706316a312fb24204a63f7`、`references/adoption.md` `2992bd2dc95f215d0869c8eac7c2fac13d8696d97264f5a483ce34645ccba0d3`、`references/candidate-c3.md` `a5c3874601d70edf87e1fc79b5501be80c35aa4f98d3870a545b79f4867f8446`。開始時に読んだ provenance は source revision `20ae45a46517c3812706fb94dfc7e6faa15a83f6`（同 commit のファイル SHA-256 `ffab55958846bad49473c86bcdb888284bbe095564e9b48158a063943b804634`）。名前診断の実行時スクリプト SHA-256 `bc6768c30fa5e2608eaaec0cac1f100a0ed10134ef3d38f03d9b9988ee7ff677`。
- 初稿 `combined-initial.md` 全226行、SHA-256 `f6df585fb175594520f4802f972ce6c4249d343fe5c28cf9e7a835e6352c8c12`。更新稿 `combined-update.md` 全189行、SHA-256 `765130c96b2dfc0aa0947b1781bde19b01ca2e9699d95d47b90c114fb6f9bb6d`。原典 `stack-source/business-design/purchase-request/README.md` 全314行、SHA-256 `afa5fbfe4160b9c962b6a3ce9df4f83a42f5138d626c1ed3b7f3bfbea08794f7`。前版 `stack-source/docs/examples/purchase-check-review.ja.md` 全161行、SHA-256 `d2ad07f06cdef93537f6b8b5cca32a5f0f9ebad49ea4ba3f3ffcb1b407cfff55`。更新稿の外部 URL が指す `c2852531ad62691c375e87818d8c3a49fd19803f` の業務設計内容は原典と同一 SHA-256。
- 2文書全体、業務設計全体、更新の前版全体を直接読んだ。保存予定位置 `stack-source/work/check-two-view/` を基準に Markdown 相対リンクを解決。作者報告、別レビュー答案、root 見本、実装・テストは読まず、候補・原典は無編集。

## 原典起点の二パス

1. **宣言名と共有参照。** 原典の生の宣言は `備品購入を申請する`／`購入申請を承認する`／`購入申請を却下する`／`承認済み備品を購入する`（123、170、218、267行）。両稿の索引ラベルと H2 はこの順に文字列一致した。Skill 付属 `check_activity_names.py` も両稿とも `status: match`、不一致0件。初稿では PR-03 の一意識別が4 Activity に、PR-05 の承認後の購買対象が承認・購入に、PR-07 の却下除外が却下・購入に関係するため、索引と該当 Activity から同じ単一本文へ到達できる。更新稿では JA-EX-04 を却下・購入から同じ本文へ参照し、6つの旧 ID と状態を維持する。現存する内部見出しリンクは両稿ともすべて解決する。ただし初稿の原典への相対リンクと Object 表の PR-07 参照には以下の NG がある。
2. **一般的な条件→結果と例を別々に照合。** 原典の申請必須4入力→`submitted` と申請者・入力値・申請日時保持（149–168行）、一意識別（15–21行）、承認者の判断・対象選択→`approved`・承認日時・購買対象（180–216行）、却下判断・対象と理由→`rejected`・理由/日時・購買除外（228–265行）、承認済み対象の購入と対象/実額の登録→`purchased`・実額/日時・購入済み扱い（277–314行）を、初稿 PR-01～09 と更新稿 JA-EX-01～05 の主要条件・結果に照合した。初稿の具体例（椅子2点/30000、対象A/Bと理由、購入額28000）は正常時の入力と判断を明記し、金額の閾値、必須入力欠落・値の妥当性・失敗応答を確定させない。必要条件式は十分な成功条件とは表記せず、`rejected` の保証の逆も主張しない。更新稿は前版の条件・期待結果、種別/質問/影響、根拠・導出分類・AI確度・関連業務・Test証拠文と c285... の原典 URL を保持し、例と必要条件表現を追加しただけで、Check は増やしていない。金額別承認は両稿とも未承認として残る。

## NG（明確な記述規則不適合）

1. **初稿の原典リンクが保存予定位置で切れる。** `combined-initial.md` 3、31、49、66、90、107、129、153、171、195、212行の相対リンク `stack-source/business-design/purchase-request/README.md#...` は scratch 親を基準にすると存在するが、GitHub の `work/check-two-view/combined-initial.md` からは `work/check-two-view/stack-source/business-design/...` を指し、存在しない。Skill の「source names/references」「verify evidence labels and anchors」と shared heading view の参照情報に反する。保存位置から原典 `business-design/purchase-request/README.md` へ正しい相対経路または固定 URL が必要である。後続の見出し fragment 自体は原典の見出しと対応する。
2. **初稿 Object 表の `approved` 行に、条件の合わない PR-07 が紛れる。** `combined-initial.md` 223行は `approved`→`purchased` の根拠・Check に [PR-07](#pr-07--却下した申請を購買対象から外す) を含めるが、PR-07 の条件は `rejected`（161–163行）であり、原典31、263–265行も却下申請の購買除外である。購入 Activity の共有参照として PR-07 を残すことと、`approved` 行の遷移根拠に含めることは別。Skill の Object 接続と共有参照の出典対応に反し、その行からは外す必要がある。
3. **更新稿に作者側の説明が混入する。** `combined-update.md` 177行の「この説明は既存Checkの期待結果を拡張しない」は業務条件や読者の判断材料ではなく、編集範囲についての管理説明である。Skill の「Keep reader-facing text about business conditions and decisions; omit author-side research or management explanations」と `stack-source/AGENTS.md` の文書 polish gate に反する。前版の補助情報ではなく新たに追加された一文であり、Object の接続説明から除いても Check の意味は変わらない。

## 業務上の未決事項

金額別承認者・承認段階と境界は原典33–48行で未決かつ今回対象外。初稿 PR-10、更新稿 JA-EX-Q01 はともに未承認・要確認として表現し、通常の承認例や状態表から承認経路を推定しない。在庫、購入先、購入後管理等も原典の対象外のまま。上の3件は業務判断を代行せずに参照・配置を直せる記述 NG である。

## 検証の制約

指定された bundle commit `8be11c2785ba3f53e9e725d3fb8a2d377fab544f` はレビュー時のローカル Git object store で参照できず、同一性は確認できなかった。上記の実測した Skill・参照内容を適用した。レビュー後に checkout HEAD が `e19214c698c2d99952c8bcd42b59be95d980553a` に変わり、provenance と診断スクリプトは更新されたが、Skill と traceability guidance の内容 SHA および候補2件の SHA は不変だった。GitHub の実描画と外部 URL のネットワーク到達は検証せず、見出し slug・ローカル Git 原典・行範囲を静的照合した。初稿は未合意の参考草案であり、Test/assertion は未提示、人間の業務承認や実装適合性はこのレビューから結論しない。
