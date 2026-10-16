# 二視点 Check 修正実物の Consistency 再レビュー

## 依頼文（全文）

> 作者修正の実物 combined-initial-repaired.md / combined-update-repaired.md を同じwhole BD/更新前Check/最新Skillに対しConsistency再レビューしてください。raw版との差分も確認可、作者repair reportは読まない。前回3NGの解消と影響範囲、全ID/共有/状態/保証/根拠/Test情報、Objectの接続参照、不要な管理説明、work/check-two-viewに置く場合のリンク/anchorsを点検。最新Skill/guidanceはsource20aeと同じ、診断だけe192へ更新した実物。combined-rereview.mdへfull prompt/hash/scope、残NG/業務未決/制約を区別して保存。編集・承認なし、nestedなし。

## 固定情報と範囲

- 修正実物 `combined-initial-repaired.md` 226行、SHA-256 `552b192885b12f580f330bdbb3b6534457f149d73ecb1d5a3e91465bbcb586a1`、`combined-update-repaired.md` 189行、SHA-256 `67a4ea3bed9f5ea94e5ff37a2f423b3d28c182aaeded6ba5dd8304ff64768ed2`。比較元 `combined-initial.md` `f6df585fb175594520f4802f972ce6c4249d343fe5c28cf9e7a835e6352c8c12`、`combined-update.md` `765130c96b2dfc0aa0947b1781bde19b01ca2e9699d95d47b90c114fb6f9bb6d`。
- 原典 `stack-source/business-design/purchase-request/README.md` 314行、SHA-256 `afa5fbfe4160b9c962b6a3ce9df4f83a42f5138d626c1ed3b7f3bfbea08794f7`。更新前 Check `stack-source/docs/examples/purchase-check-review.ja.md` 161行、SHA-256 `d2ad07f06cdef93537f6b8b5cca32a5f0f9ebad49ea4ba3f3ffcb1b407cfff55`。
- Alder plugin 0.4.8、確認時の checkout HEAD `e19214c698c2d99952c8bcd42b59be95d980553a`。Skill `stack-source/plugins/alder/skills/alder-draft-check-items/SKILL.md` SHA-256 `65be6ef8989662599739584b61bbefc7b0058e1cf955e09ce971119436907ea7`、traceability guidance `bcac07de5da861fb6535c48fc122246ef90402b992706316a312fb24204a63f7`、adoption `2992bd2dc95f215d0869c8eac7c2fac13d8696d97264f5a483ce34645ccba0d3`、名前診断スクリプト `8f829265556d457e192777aad02f24e2062ffd8ca72fb3a9bd684c63a018bc41`、provenance `3c0cf0c346b3c7f72efdea596a2b8cc2028d2eb989e9d4e7d0b67e2297a05bd8`。
- 修正実物と比較元の差分、原典全体、前版全体を対象に、宣言名・共有参照と一般的な条件→結果・例の二パスを再実施。作者修正報告や実装・テストは読まず、候補と原典は無編集。

## 再確認した根拠

- 初稿の業務設計リンクは16件すべて `20ae45a46517c3812706fb94dfc7e6faa15a83f6` 固定の GitHub URL に変わった。同 commit の業務設計のローカル Git 内容は上記原典と SHA-256 が一致し、各 fragment は原典見出しに対応する。`work/check-two-view/` に置いても相対パス依存はない。初稿 Object 表223行の `approved`→`purchased` から PR-07 の引用だけを外し、`rejected` 行224行と購入 Activity 索引・節の共有参照は残る。PR-07 の条件は `rejected` で、原典31、263–265行の除外と整合する。
- 更新稿の Object 説明177行から新規の管理向け文「この説明は既存Checkの期待結果を拡張しない」だけが消えた。前版の JA-EX-01～05 と JA-EX-Q01 の単一本文、条件・結果・人間レビュー状態、未決の質問・影響、根拠 URL、導出・AI確度・関連業務・Test 証拠の全行は保持される。新 Check や新たな業務保証はない。更新稿の固定 `c2852531ad62691c375e87818d8c3a49fd19803f` URL の原典内容も上記原典と同じ SHA-256 で、改訂を無根拠に差し替えていない。
- 原典の宣言した4 Activity 名と両稿の索引・H2 は文字列一致し、最新 `check_activity_names.py` は双方 `status: match`、mismatch 0。初稿は PR-03 を4 Activity、PR-05 を承認・購入、PR-07 を却下・購入から同一本文へ参照し、PR-10 の未決は承認の本文・索引に残る。更新稿は JA-EX-04 を却下・購入から同じ本文へ参照する。GitHub の見出し slug と照合した現存する内部リンクは初稿60件、更新稿30件すべて解決し、原典リンク以外の相対パスはない。
- 原典149–168、180–216、228–265、277–314行の申請・承認・却下・購入の条件と結果は初稿 PR-01～09、更新稿 JA-EX-01～05 の主要項目から辿れる。初稿の必要条件表現は入力の存在を成功保証にせず、例は対象・判断・入力・結果を記し、金額境界や不備時応答を決めない。両稿の Object 表は状態が後続業務を自動実行しないと明記し、`rejected` の購買除外を適用する位置を分ける。更新稿の追加例・表は旧 Check の限定された期待結果を拡張していない。

## 残る NG

確認範囲で明確な NG はない。前回の3件は上記の実物差分と原典照合で解消した。記述整合性の判断であり、人間による業務意味の承認ではない。

## 業務上の未決事項

金額による承認者・段階・境界は原典33–48行で未決・今回対象外。初稿 PR-10、更新稿 JA-EX-Q01 は未承認・要確認のまま、通常の承認結果に金額別経路を混ぜていない。必要になれば業務設計で条件と結果を決め、人間が確認する。在庫・購入先・購入後管理なども同じ原典の対象外に残る。

## 制約

GitHub の実描画と固定 URL のネットワーク到達は検証していない。見出し/fragment と固定 commit の原典をローカルで静的確認した。Test/assertion の実在・実行、実装動作、業務設計の人間合意は未検証。初稿は未合意の参考草案、更新稿は表示変更の整合性までの結論である。
