# 購入申請 Check 初稿・修正実物の再レビュー

## 依頼文（全文）

> 修正後の実物 candidate-initial-repaired.md をwhole purchase-request BDと同じSkill/guidanceに対して再レビューしてください。candidate-initial.mdとの差分も確認可。作者のrepair reportは読まず、元NG解消と影響範囲、関連する未決の保持、Object表とActivity条件の整合を再確認。修正済みを前提にせず、source-grounded NG・業務未決・制約を区別。candidate-initial-rereview.mdにfull prompt/hash/scopeを保存。編集・承認なし。

## 対象・固定情報

- 修正候補 `candidate-initial-repaired.md` 全226行、SHA-256 `42cedbff29bcdb34fdbc3185aa9e07087e64a0b131d470f4c89b04a2a7517753`。比較元 `candidate-initial.md` 全204行、SHA-256 `2d232e15a99887c872b224276528529ccd0265834c2fb655b067484c04b57f2a`。原典 `alder/business-design/purchase-request/README.md` 全314行、SHA-256 `afa5fbfe4160b9c962b6a3ce9df4f83a42f5138d626c1ed3b7f3bfbea08794f7`。
- Alder plugin 0.4.8。確認時の HEAD `1d77a7d57c819db5d212907e22aba7b5082cd3ac`。`alder/plugins/alder/skills/alder-draft-check-items/SKILL.md` SHA-256 `2f29d5df6c5f30f872867296a8df58950b9a91d62c75d152932f489bc7a2a744`、同 `references/check-item-traceability.md` `fd24530c6d0183e5adf06d08be2afaa34b3737e8d5335711e589c8634e7cf867`、`references/adoption.md` `c2d6c77d5ec28c5a20411a234c67bea8f43336c465c2507470b515160546d542`。
- 修正実物・原典全体、比較元との差分、GitHub Markdown の索引・見出し・ID・補足・内部リンクと Object 表を直接確認した。作者の修正報告、テスト、別のレビュー結果は参照しない。候補と原典は無編集。

## 根拠・再確認結果

- PR-04（候補80–91行）の期待結果は「購買担当者がその申請を購入対象として扱える」に絞られた。業務設計214–216行の承認結果に一致し、購入時の入力は後続 Activity に属するという時点の混在が解消した。共有参照は索引の承認・購入両行と購入 Activity 177行に保たれている。
- PR-08（候補182–192行）は `approved` の対象選択と備品購入に加え、実購入金額を含む「購入結果の登録を完了したとき」を条件とする。業務設計279、291–314行の入力・手順・結果に対応し、入力だけで `purchased` になるという早過ぎる保証を解消した。Object 表222行の○は PR-08 の条件へのリンクであり、状態だけで自動実行しないと226行に明記される。
- PR-10（候補95–115行）は業務設計33–48行にある金額別承認の未決・今回対象外を「候補・未承認」「要確認」として可視に置く。承認と購入の索引行、購入 Activity 177行、Object 節217行は同一 ID を指し、現在の状態表へ未確定の遷移を加えていない。他9 ID の条件・結果・状態は比較元から維持された。Test/assertion の記載は全項目で「未作成・未照合」から「未照合」へ変わり、未確認のテスト不存在を断定しなくなった。
- 原典の4 Activity 名を索引・見出し・参照に使い、各 Check の主要項目は可視、10個の `<details>` は既定閉鎖。15個の明示アンカーに対する内部リンクはすべて解決する。Object 表の `submitted`→承認/却下と `approved`→購入の○は原典27–30、170–314行の条件付き結果、`rejected`→購入の×は31、263–265行の明示的除外に対応する。他の組合せは実行時例外や新たな禁止ではないと説明される。

## NG

確認範囲で出典に基づく明確な NG は認めない。元の PR-04、PR-08 の指摘箇所は解消し、変更範囲から別の条件・結果の逸脱は確認しなかった。これは業務上の承認や全設計の網羅性の認定ではない。

## 業務上の未決事項

PR-10 の金額別承認者・段階・金額条件・`approved` とする時点は、業務設計33–48行で未決かつ今回対象外。現行の確定合否項目には使わない。将来対象に含めるなら業務設計の改訂と責任ある人間の確認が先に必要。現時点でその判断を要求する根拠にはしない。その他の未決定・対象外事項も業務設計33–48行の範囲に残る。

## 検証の限界

相対的な原典リンクのローカル存在、内部アンカー・折りたたみ構文、原典の該当行を静的に照合した。GitHub での実描画、Test/assertion の作成・実行、実装動作は確認していない。「未照合」は証拠不足を示し、テストの有無を判定しない。PR-10 の人間レビュー状態も変更・承認していない。
