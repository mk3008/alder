# 購入申請 Object 状態図の整合性レビュー

## 依頼文（全文）

> Read-only review追加：candidate-update-diagram.md と candidate-update.md の差分をwhole purchase-request BDおよび同じSkill/guidanceに照合してください。依頼はObject節に小さなMermaid図を追加する表示変更のみ。全Check本文・状態・根拠・状態表を保つこと、図のsource conditions/edgesと表の整合、不要な研究説明がないことを確認。candidate-diagram-report.mdなど作者報告は読まずrawのみで確認。candidate-diagram-review.mdにfull prompt/hash/scope/NG・制約を記録。編集・承認なし。

## 対象・固定情報

- Alder plugin 0.4.8、HEAD `d465c6c0c87740712bba8361b2f24ddde6ad314c`。適用 `alder/plugins/alder/skills/alder-draft-check-items/SKILL.md` SHA-256 `2f29d5df6c5f30f872867296a8df58950b9a91d62c75d152932f489bc7a2a744`、同 `references/check-item-traceability.md` `fd24530c6d0183e5adf06d08be2afaa34b3737e8d5335711e589c8634e7cf867`、`references/adoption.md` `c2d6c77d5ec28c5a20411a234c67bea8f43336c465c2507470b515160546d542`。
- 候補 `candidate-update-diagram.md` 196行、SHA-256 `c24958236c52bd03bdda3fbba2a53974b6f75df2d197856e23ddb686c645d57b`。比較元 `candidate-update.md` 186行、SHA-256 `6525d2df53894b5b089f06dc96dd03f6859904116d93bda90d48b8b2f33da3a1`。原典 `alder/business-design/purchase-request/README.md` 全314行、SHA-256 `afa5fbfe4160b9c962b6a3ce9df4f83a42f5138d626c1ed3b7f3bfbea08794f7`。
- 両候補全体の差分と原典全体を直接確認。作者報告、生成テスト、他レビューは参照せず、候補文書・業務設計は変更していない。

## 根拠と結果

- 差分は候補172–180行の説明1段落と小さな Mermaid `stateDiagram-v2` だけ。既存6 ID の本文、条件、期待結果、人間レビュー状態、未決事項、補足と原典リンク、Object の状態別接続表はバイト上変更なし。図の新しい状態はなく、`submitted`、`approved`、`rejected`、`purchased` は原典116行にある。
- `[*] → submitted` は業務設計123–168行の新規購入申請成立、`submitted → approved` は170–216行、`submitted → rejected` は218–265行、`approved → purchased` は267–314行および業務相関27–31行に対応する。矢印には各 Activity と同じ ID が付く。直前の段落は JA-EX-01/02/03/05 の条件・結果に直接リンクし、追加段落は判断と必須入力の条件付きであることを明記する。状態に達するだけで次の業務が自動実行されるとは記していない。
- 状態表の3つの○に図の状態間の3辺が対応し、残る `[*] → submitted` は申請成立を示す。`rejected` の購買対象外の×（業務設計31、263–265行）は遷移ではないので図に辺を設けない。表の未定義の組合せにも図の辺を足していない。JA-EX-Q01 の金額別承認経路は未決定のままと明記。導入文の開始点の説明は図の `[*]` の誤読を防ぐ読者向け説明であり、研究・評価過程の説明ではない。

## NG

確認範囲で明確な NG はない。状態が定義され、後続 Activity との接続を示す用途で小図の追加は任意の表示方法として妥当である。

## 業務上の未決事項と検証限界

JA-EX-Q01 の金額別承認者・段階は業務設計33–44行で未決定であり、図はそれを決めない。GitHub 上での Mermaid の実描画と外部 URL の到達性は検証していない。静的な Markdown 差分、辺・ラベル・リンクと原典の照合であり、人間の業務承認、テスト証拠や実装動作は判定していない。
