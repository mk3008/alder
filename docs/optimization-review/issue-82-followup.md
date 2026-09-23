# Problem / Pain / Scope 追従性 — PR #82 追加検証

## 条件と記録

[PR #82 の追加検証指示](https://github.com/mk3008/alder/pull/82#issuecomment-5793580901)に従い、Issue #81 と同じ[備品購入申請](../../business-design/purchase-request/README.md)（main `5405a5069fc13e1a1e27de8b06e4a375a3653e5e`、SHA-256 `2692b564fd44eb64005f6d595008afdf3ec62660ba81bfa99f6c90165c518fdc`）を使った。元のPoCの指示から、各入力・出力パス、Problem、Pain level だけを変更した。元のHigh出力も比較対象にした。生成前に[評価条件](../../work/optimization-review/issue-81/records/followup-protocol.md)を保存した。

各ケースで会話履歴を渡さないFresh Agentを別々に1回実行し、過去の出力と他ケースを読まないよう指示した。要求設定は `gpt-6-sol` / `medium` / `fork_turns: none`。[A1の記録](../../work/optimization-review/issue-81/followup/a1-approval/run.json)、[A2の記録](../../work/optimization-review/issue-81/followup/a2-reconciliation/run.json)、[Lowの記録](../../work/optimization-review/issue-81/followup/b-low/run.json)に入力・指示・無修正出力のhashと担当IDを残した。起動ラッパーと指示全文もケース別に保存した。要求設定は記録できたが、実効モデル・effortの独立した受領証明はない。ファイルの隔離はアクセス制御ではなく明示した閲覧範囲による。

## 出力の比較と独立点検

| 入力 | 出力の焦点と件数 | Scope / Difficulty | Problemとの関係と限界 |
| --- | --- | --- | --- |
| [元のHigh](../../work/optimization-review/issue-81/outputs/raw.md): 購買担当者の購入・結果登録負荷 | まとめ買い、自動購入、委託の3件 | Narrow 3件。中 / 高 / 高 | 購入操作の反復に焦点。登録負荷は案により残る。既存の契約・サービスは仮定と区別。 |
| [A1](../../work/optimization-review/issue-81/followup/a1-approval/raw.md): 承認待ち、High | 確認枠と滞留時引継ぎ、承認担当の分散の2件 | Keep 2件。中 / 高 | 業務2・3の待機と承認権限に焦点。承認の集中・人数・代理権限は不明で、候補2の効果は条件付き。購入手配案の再提示はない。 |
| [A2](../../work/optimization-review/issue-81/followup/a2-reconciliation/raw.md): 購入結果の照合・登録、High | 購入時の申請と実績の一体確定、購入記録との自動照合の2件 | Keep / Expand。低〜中 / 高 | 業務4の結果帰属・ミスに焦点。候補1は現行設計の「承認済み対象を確認→購入→結果を登録」と重なる。事後の再特定という工程は現行設計にないため、**新しい有用候補としては数えない**。候補2は購入記録の実在と一意照合の可否が未確認。 |
| [B](../../work/optimization-review/issue-81/followup/b-low/raw.md): 元のProblem、Low | 購買のまとめ処理、購入時の結果記録の2件 | Narrow 2件。低〜中 / 低 | Highの高難度な自動購入・委託を独立候補にせず、その関係先調整はLowの痛みに見合う根拠がないと明記。一方、候補1は元のまとめ買いと重なり、候補2の別工程としての遅延登録は現行設計で確認できない。 |

**Problem差:** A1は承認、A2は結果照合へ探索対象が移り、元の購入操作の3案の単純再提示はなかった。申請・却下まで全面再設計する案もない。ただしA2候補1は元のBusiness Designの手順を言い換えたものに近く、Problemへ焦点が合うことと新たな改善余地の発見は別である。

**Pain差:** Lowは3件から2件に減り、高難度の外部関係先を要する案の深追いを避ける理由を述べた。Painを欄に再掲しただけではないという出力上の証拠がある。ただし一回ずつの非決定的な出力差から、Pain変更が原因だとは断定できない。特に指定された元のProblem自体が「負荷が**高い**」と述べる一方、Bでは Pain level を **Low** としており、入力条件が意味上衝突している。Bは Low に沿って判断したが、Painのみの明瞭な比較条件にはなっていない。この衝突は指示どおりProblemを同一に保った結果であり、後から書き換えていない。

**Scope差:** 元のHighは3件ともNarrowだったが、A1はKeepを選び、承認権限を維持しながら担当運用を変える理由を述べた。A2の自動照合は、購入記録の取得・照合・例外確認という現在未定の責任が必要だとしてExpandを選んだ。LowのNarrowは業務4の限定的運用変更というPain判断と結び付いている。3種類が現れたため追加Problemは不要と判断した。ただしA1の引継ぎや問い合わせ経路も未定義の運用を増やし得るので、「Keep」が唯一正しい分類とは断定しない。今回の観測だけでは元のHighのNarrow集中が入力の性質か指示の誘導かは分離できない。

**Difficulty / Business上の意味:** A1の高難度案は承認権限・担当組織、A2の高難度案は購入記録の管理者・責任分界、Lowの低難度案は購買担当者内の運用にそれぞれ結び付いており、コード量で評価していない。部門・外部サービス・購入記録の存在は確認済み事実にせず、要確認条件として扱った。全案で承認者の実判断、`rejected` の購買除外、実際の購入後の申請別 `purchased` と金額・日時を守る方向を示した。業務方針は決定していない。

## 判断と限界

この小さな定性検証ではProblemに応じた焦点とScope表現の切替、Lowで高難度候補を控える判断が**出力上観測された**。A2の重複により候補の水増しも部分的に観測された。2件のProblem差とHigh/Low各1回であり、候補の価値・実現性・適切な探索深さを一般化できない。Painの入力文面の衝突、モデル出力の揺らぎ、独立した盲検採点や実利用者・実測負荷がないことも比較の限界となる。継続調査の要否と候補の採否は人間に残し、Business Design、実装、恒久Rule / Skillは変更しない。

Pain入力の衝突に対する後続の比較は[中立ProblemでのHigh/Low各2回の記録](issue-82-pain-isolation.md)に分けて保存した。このページの条件と観測結果は変更しない。
