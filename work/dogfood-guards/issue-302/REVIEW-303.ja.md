# PR #303：Role診断の残存を拒否する

[Chatレビュー](https://github.com/mk3008/alder/pull/303#issuecomment-6481883434)の具体的反例を修正した。正しい診断の存在だけでなく、保存するすべての `Role未確定:` 診断と、現在の未確定Activityの診断が一対一で対応することを検査する。

baselineは `b850df15875f53e994504d590226c07a6a0b1005`。新しい要求は[固定G4契約](review-303-contract.json)、SHA-256 `e8b8931c0797228ddc66e4ae97b8e6a82b3bb6808e77fa8796c8f7b23290b627`。初回のoracle・生成物・実行証拠は変更していない。

## 修正と確認

| ケース | 0.3 / 0.4の結果 |
| --- | --- |
| 現在のWhoと一致する診断だけ | 受入れ。複数Activityの正しい診断も受入れ |
| 古い診断だけ | 拒否 |
| 正しい診断と古い診断が共存・両順序 | 拒否 |
| 同じ正しい診断の重複 | 拒否 |
| 未知Activity ID / Object ID | 拒否 |
| Role確定後に残る診断 | 拒否。診断を除いた正常な確定Roleは受入れ |
| 不正な混在候補のcreate | 拒否し、出力ファイルを作らない |
| 不正な混在候補のcommit | 拒否し、保存済みバイト列とhashを保持 |
| その他の診断 | 保持。validateは入力を変更しない |

`core.mjs`では、型付きBDの `roleId===null` のActivityから現在のID/Whoの期待診断をSetに集める。保存されるRole診断の重複を拒否し、各診断との正確な対応を検査、欠落も拒否する。診断の文字列からIDを推測分割しない。Schema・形式・業務意味・人間状態・保存権限・依存は変更しない。

## 回帰中に確認した外部BD目録

初回の全体回帰は78成功/1失敗だった。既存の外部BD目録テストは、本文BDを `documents` から除いた後も、そのBDのRole診断を残していた。目録の契約は文書ID/版とActivity ID/名称だけであり、現在のWhoやroleIdを持たない。この診断を現在のRole宣言と認めることはG4に反する。

製品の外部参照経路は緩めていない。テストを「孤立Role診断を含む状態は拒否」→「そのRole診断だけ除いた外部目録は有効」とし、無関係診断の保持・入力不変・本文非同梱・Stale Checkの拒否を維持した。既存converterによる外部目録作成の正例も維持している。別Agentがこの修正を読み取り確認し、期待の弱化ではないと判断した。

作業中に全79件成功と誤報した後、この1失敗を確認して訂正した。修正前の失敗と途中の失敗も保存し、最終79成功の記録で置き換えていない。

## コミット前の証拠

- 新しい2テストは旧版で失敗（正しい＋古い診断を拒否しない、createが0で成功してしまう）。[before](review-303-evidence/before.log)
- 最終の保存器全79件成功・失敗0。[after](review-303-evidence/after.log)
- 隔離Plugin7件成功、既存exporterの26ファイル再現成功。
- 別Agentが0.3/0.4の各CLI操作と保存保護を再実行。Role10件、外部目録2件を確認。[報告](review-303-evidence/independent-review.md) / [操作結果](review-303-evidence/results.json)
- 同じ既存reviewer文脈を再利用した別Agentの再確認であり、新規Fresh・盲検・実効モデル設定やSkill推論精度の実証ではない。GitHubコメント本文は主作業者がconnectorで取得し、reviewerは固定G4契約を読んで検査した。reviewer側のURL直接取得は利用不能だった。

全79件成功と別Agentの確認後、canonical sourceを `11848cae45a171a1a49ac6e0542b2bd7cac89b16` として作業branchへ公開した。その公開Git objectのSHAを確認して、既存exporterで同梱runtime/provenanceを再生成した。手動コピーや虚偽のsource pinではない。

最終候補のCIリンクと結果はPRコメントに追記する。共通参照検証の変更なので、既存JSON Gate A/B・配布検証・Viewer全体を維持する。#173全体の未実証範囲や#297等の採否は今回変更しない。Draft・Issue Openを維持し、再レビューへ返す。
