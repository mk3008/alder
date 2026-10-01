# 境界分解による探索定義の明確化

[Optimization Review](../optimization-review.md) · [事前条件](../../work/optimization-review/issue-128/protocol.md) · [Issue #128](https://github.com/mk3008/alder/issues/128)

## 結論

境界分解を、既存の空間探索・Extreme perspectives・縮退と合成を明確にする任意の規則として採用する。別方式への置換や、性能向上を根拠とする採用ではない。

今回の3ケースでは、ControlとTreatmentの候補構成は実質的に同じだった。新しい構成の発見という優位は確認できなかったが、Treatmentは独立判断、探索範囲、除外した枝、停止理由を明示した。既存の候補探索、意味保持、Unknowns分離、Extreme perspectives、Scope Expand、Painの比例性、最大3候補と0件正常終了に、確認した範囲で劣化は見られなかった。

[採用基準の追加整理](https://github.com/mk3008/alder/issues/128#issuecomment-5940813880)は、性能優位よりもnon-regressionと定義の精度を重視している。このコメントはrun開始後に確認した。公開済みの事前条件・入力・promptは変更していない。元の条件も構成差と説明・探索境界の価値を区別し、既存機能の維持を評価対象としていた。評価の採用基準は追加コメントに従う。

## 比較条件と再実行

基準版は `18af981bc00bd624ad7f791fff12ba172aad8f00`。安全な入力・事前条件・promptテンプレートを公開commit [`1aeb3ea71f354236c4bb1f1cd54e1f523fd51580`](https://github.com/mk3008/alder/commit/1aeb3ea71f354236c4bb1f1cd54e1f523fd51580)に保存し、匿名git fetchとconnectorによるファイル取得を確認してから実行した。

Controlは基準版のガイドの無変更コピー。Treatmentは同じガイドへBoundary decomposition trial節を追加したもの。生成者は各群1つの別々のFresh agentで、要求設定は `gpt-6-sol / medium / fork_turns: none`。各agentが同じ3ケースを読むため、6出力を独立した6標本とは扱わない。実効設定は独立証明できず、共有ファイルの隔離は指示による。read-logは両者とも許可した4入力のみを申告している。

| 群 | 完全な起動指示 | 無修正出力 | 読取申告・設定・hash |
| --- | --- | --- | --- |
| Control | [invocation](../../work/optimization-review/issue-128/runs/control/invocation.txt) | [raw](../../work/optimization-review/issue-128/runs/control/raw.md) | [read-log](../../work/optimization-review/issue-128/runs/control/read-log.json) / [run](../../work/optimization-review/issue-128/runs/control/run.json) |
| Treatment | [invocation](../../work/optimization-review/issue-128/runs/treatment/invocation.txt) | [raw](../../work/optimization-review/issue-128/runs/treatment/raw.md) | [read-log](../../work/optimization-review/issue-128/runs/treatment/read-log.json) / [run](../../work/optimization-review/issue-128/runs/treatment/run.json) |

再実行する場合は公開commitを取得し、各promptの絶対パスだけを取得先へ置換する。許可入力と禁止入力、要求設定を維持して、履歴なしの別agentへ渡す。入力の[SHA-256一覧](../../work/optimization-review/issue-128/inputs-manifest.json)も保存した。出力の完全一致は要求しない。

[既存 #81 / #82 / #85](../optimization-review.md#evidence-and-limits)の業務意味と、[#108](../../work/structural-discovery/issue-108/RESULT.md)の未確認関係・Problemを作らない境界を再利用した。過去rawは新規agentへ渡していない。既存purchase設計には、独立して委譲できる検査と固定の人間判断の組合せが明示されていないため、sealedな架空の照合ケースを追加した。0件ケースも架空の固定条件を用いる。実顧客の情報は使っていない。raw・read-logを公開前に確認し、認証情報、個人・顧客情報、private URLがないことを確認した。実行先のscratch pathは再実行時に置換できる。

## 観察

| ケース | Control | Treatment | 確認した差と限界 |
| --- | --- | --- | --- |
| 既存の備品購入申請 / High | まとめ処理、購入結果取込の2候補。共通在庫は候補外のExtreme perspective | 同じ2候補と在庫の視点。購入のまとめ方と登録情報源を別軸として説明 | 新規構成なし。承認、申請別の金額・日時、購入成立を維持。Expandは登録負担に必要な記録元だけへ限定 |
| 数量・金額・証憑の照合 / Medium | 数量だけ、金額だけ、両方の3構成。真正性は人間に残す | 同じ3構成。二つの委譲判断と数値上限を区別し、禁止・未確認・無関係な枝を止める理由を明示 | 独立分解はControlにもある。Treatmentだけが構成を発見できたとは言えない。数値や責任を潰さず説明できた |
| 必須の一回証憑確認 / Low | 0候補。重複なし、固定条件を緩めない | 0候補。さらに分解しても判断が変わらないこととPainを停止理由として説明 | 新しい軸・業務・外部サービスを無理に追加しない。0件とno-changeを維持 |

non-regressionは候補数だけでなく、上表の候補の因果、残す意味、Unknowns、Scope、Difficulty、Extreme perspectivesをraw同士で比較した。両群とも人間の採用判断を残し、未測定の効果量や契約を既知としなかった。数量・金額の不一致と証憑の人間判断がすべて解決するまで確定しない意味も両群が保った。

Treatmentの出力は5,299文字、Controlは4,934文字で、約7.4%長かった（改行・空白を含む文字数）。定義と停止理由の説明には出力増がある。読みやすさや人間のレビュー時間は測定していないため、認知負荷が減ったとは主張しない。正式ガイドでは必要な判断だけを既存欄で説明し、軸一覧や停止理由の毎回の長文出力は要求しない。

## 仕様への反映

正式ガイドの[Boundary decomposition](../optimization-review.md#boundary-decomposition-when-useful)とcopyable promptに、次を反映した。

- 曖昧な主要判断は独立に変えられる判断へ分解できないか確認する
- 追加・細分化にはProblemとの因果、根拠、独立性、判断への実質的影響をすべて求める
- 数量・時間・上限などの数値は単位と制約を保ち、二値へ潰さない
- 独立に意味を持つ判断でも、制約により不成立な組合せは除く
- 新しい適格軸が見つからない、判断が変わらない、創作を要する、Scope Expandを説明できない、情報価値が小さい場合は該当の探索を止める
- 未確認の重要事項は限定した質問として残せるが、実行可能性や事実を確定しない
- 全組合せの列挙を要求せず、最大3候補・0件・人間判断を維持する

発見済み次元が定まっても、目的・制約・探索の証拠が不十分なら、その中の最適性も証明できない。現在の探索範囲で比較できる候補として返し、新しいコンテキストで軸が増える可能性を残す。global optimum、網羅性、未探索の組合せに対する非劣性は主張しない。

これは現行の探索を精密化するAlder固有の規則であり、新しい数理最適化手法としての独創性は主張しない。既存のBusiness Designや実装、Pluginのrouting・版は変更しない。正式文言はtrialの規則を既存ガイドに統合し例を加えたもので、その完成文言を別のFresh比較で再実行したわけではない。

## 限界と停止判断

小さな架空の3ケース、各群1回、同一要求モデル、条件を知る非盲検の評価である。照合ケースは分解を識別しやすいよう設計されており、自然なヒアリングから未知の軸を発見できる一般性は示さない。Low/Medium/Highは業務も異なるので、Painだけの因果比較にもならない。探索が将来いつも収束する保証、候補品質の優位、実業務効果、定量的なnon-inferiorityは未検証。

今回の採用基準は既存探索を壊さない定義の明確化であり、Controlも同じ構成を出せたことは採用の障害とはしない。主要な境界と既存能力の維持を確認できたため、生成揺らぎだけを調べる追加runはしない。実利用で過剰な軸分解、弱いUnknownの量産、候補や極論の消失、レビュー負担の増加が観測されたら規則の適用範囲を再検討する。

## 独立した証拠レビュー

結果・仕様を公開commit `dbb3cc76a5017f005291aac1c40556dcd740f166`へ保存した後、別の履歴なしagent（要求 `gpt-6-sol / medium`）が指定範囲をread-onlyで確認した。[完全な指示と無修正最終応答](../../work/optimization-review/issue-128/evidence-review.md)を保存した。重大・中程度の指摘はなく、入力と成果物のhash、同じ候補方向、既存境界の維持を確認した。完成文言の別Fresh実行がないこと、実効設定・隔離等の独立証明がないことは限界として残る。このレビューはBusiness採用の承認ではない。

## 振り返り

Goalは既存探索の精密化として維持した。追加コメントは評価基準の明確化であり、入力や結果の改変には用いていない。反復した人間指摘や意味破壊は今回観測していないため、新たな共通運用ルールは追加しない。採用時は既存の正式ガイドを更新し、同じ規則の別SSOTは作らない。PRのレビューとマージが残るため、Issueは完了扱いにしない。
