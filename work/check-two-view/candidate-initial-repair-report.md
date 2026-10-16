# 備品購入申請 Check 初稿の修正記録

## 今回受領した指示（全文）

> 独立Consistency review candidate-initial-review.mdを読み、指摘をBDとSkillに照合し、根拠のある修正を行ってcandidate-initial-repaired.mdとcandidate-initial-repair-report.mdへ保存してください。元rawは保持。主担当の追加確認事項：BDの「未決定の事項」の金額別承認経路について、現行Skillの関連未決事項の可視化要求と照合し、今回の初稿でどのように保持すべきか検討してください（業務方針を確定しない）。PR-04/08以外も影響範囲を再読し、本文に研究・管理説明が混入しないよう確認。statelessはNGなしのため変更不要。既存IDは維持、業務意味・レビュー状態は承認しない。修正理由と変更ID、入力ハッシュ、full prompt、残る未決を報告。再レビューは別途行います。

## 入力と改訂版

- Skill：`alder/plugins/alder/skills/alder-draft-check-items/SKILL.md` SHA-256 `2f29d5df6c5f30f872867296a8df58950b9a91d62c75d152932f489bc7a2a744`、plugin 0.4.8、指定 commit `d465c6c0c87740712bba8361b2f24ddde6ad314c`。
- Guidance：`references/check-item-traceability.md` SHA-256 `fd24530c6d0183e5adf06d08be2afaa34b3737e8d5335711e589c8634e7cf867`、`references/adoption.md` SHA-256 `c2d6c77d5ec28c5a20411a234c67bea8f43336c465c2507470b515160546d542`、`references/candidate-c3.md` SHA-256 `a5c3874601d70edf87e1fc79b5501be80c35aa4f98d3870a545b79f4867f8446`。
- Business Design：`alder/business-design/purchase-request/README.md` SHA-256 `afa5fbfe4160b9c962b6a3ce9df4f83a42f5138d626c1ed3b7f3bfbea08794f7`。
- 独立 Consistency review：`candidate-initial-review.md` SHA-256 `1c7c243b9eac487939d44b73230cb5c1de771ba5be98eb1f45add0c9f2156f95`。
- 修正元：`candidate-initial.md` SHA-256 `2d232e15a99887c872b224276528529ccd0265834c04b57f2a`。元ファイルは変更していない。
- 修正版：`candidate-initial-repaired.md` SHA-256 `42cedbff29bcdb34fdbc3185aa9e07087e64a0b131d470f4c89b04a2a7517753`。

## 指摘への対応と意味保持

| 対象 | 修正・判断 | 根拠と保持した保証 |
| --- | --- | --- |
| PR-04 | 期待結果を承認済み申請が購買対象になることに限定。後段での選択・実購入金額入力は PR-08 の条件へ委ねた。 | BD の承認 Result（212–216 行）と購入 Input（291–294 行）は別時点。承認時点の購入可能性は保持し、購入そのものを早めない。独立レビューの NG 2 を採用。ID・未レビュー状態は維持。 |
| PR-08 | 条件を備品購入と「必須の実購入金額を含む購入結果の登録を完了したとき」に修正。 | BD の購入 Procedure 2–5、Output/Result（296–314 行）。購入前・入力直後に `purchased` が成立する誤読を避ける。`purchased`、実購入金額、購入日時という期待結果は保持。独立レビューの NG 1 を採用。ID・未レビュー状態は維持。 |
| PR-10（新規） | 承認 Activity 内に「未決事項（業務設計由来・今回の対象外）」として追加。承認・購入 Activity の索引と本文、Object 引継ぎから同一 ID にリンク。 | BD 33–48 行は申請金額による承認者・段階の扱いを未決定かつ今回の対象外と明記する。Skill は明確に関連する未決事項を当該 Activity に置き、種別・質問・選択肢と影響を見えるように求める。将来の対象化について判断を示しただけで、金額しきい値、承認者、段階、結果を決めていない。状態は要確認であり、人間確認ではない。 |
| PR-01～03、PR-05～07、PR-09 | 条件・期待結果・ID・人間レビュー状態を維持。折りたたみ内の Test 記述のみ「未作成・未照合」から「未照合」へ修正した。 | Test を読んでいないので不存在は断定できない。根拠にない証拠状態の主張を除き、期待結果に触れていない。PR-09 の購入結果登録条件も確認した。 |

## 実施した著者確認と残る限界

修正版全文を再読し、BD の Scope、Object Information、4 Activity の When/Input/Procedure/Output/Result、業務相関、未決事項と照合した。購入時の選択・実購入金額は PR-08、同一の対象申請を購入済みとして扱う接続は PR-09 に残る。却下理由と購買対象からの除外は PR-05～07、申請の識別と後段への引継ぎは PR-01～02 に残り、PR-04/08 の修正で落ちていない。読者に必要な状態表の定義・明示的除外・未定義の説明は残し、本文から人の状態に関する余分な説明を除いた。折りたたみ内の実装調査に関する著者説明と未確認の Test 不存在の断定を除いた。

四列の Activity 索引、宣言済み Activity 名、共有・未決 ID への直接リンク、単一本文、見える一次フィールドと PR-10 の種別・質問、閉じた details、状態表の ○/×/未定義エラーを静的に確認した。10 ID は一意で、全内部リンクの対象が存在し、条件・期待結果・レビュー状態と details は各 10 個。既存 9 ID は未レビューのまま、PR-10 だけ要確認。NG と業務上の未決を混同していない。`candidate-stateless.md` は変更していない。

金額別承認経路を将来対象に含めるなら、金額条件・承認者・段階と `approved` 成立条件を業務設計で人が決めた後に関連 Check を導出し直す必要がある。今回対象外のままなら現行 Check を金額別規則で拡張しない。他の BD 33–44 行の未決・対象外事項も未採用。PR-10 は確定した合否条件ではない。GitHub 上の描画、Test/assertion、実装、独立した再レビュー、人間の意味確認はこの著者確認では実施していない。
