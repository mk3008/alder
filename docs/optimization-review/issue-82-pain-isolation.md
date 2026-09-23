# Pain level 単独比較 — PR #82 追加検証

## 条件

[PR #82 コメント](https://github.com/mk3008/alder/pull/82#issuecomment-5794509548)の指定どおり、[備品購入申請 Business Design](../../business-design/purchase-request/README.md) main `5405a5069fc13e1a1e27de8b06e4a375a3653e5e`（SHA-256 `2692b564fd44eb64005f6d595008afdf3ec62660ba81bfa99f6c90165c518fdc`）を固定し、Problemを「承認済みの購入申請について、購買担当者が申請ごとに購入を行い、その結果を登録している。」に固定した。Highを2回、Lowを2回、会話履歴と他の出力を渡さない独立Fresh Agentで実行した。各指示の差はPain値と入出力パスだけであり、結果に応じた再生成や指示変更はない。[出力を見る前の評価条件](../../work/optimization-review/issue-81/records/pain-isolation-protocol.md)も残した。

要求設定は4回とも `gpt-6-sol` / `medium` / `fork_turns: none`。ケースごとに指示全文と起動ラッパー、無修正出力、参照ログ、入力・出力hashを保存した（[H1](../../work/optimization-review/issue-81/pain-isolation/h1/run.json)、[H2](../../work/optimization-review/issue-81/pain-isolation/h2/run.json)、[L1](../../work/optimization-review/issue-81/pain-isolation/l1/run.json)、[L2](../../work/optimization-review/issue-81/pain-isolation/l2/run.json)）。実効モデル・effortの独立した受領証明はなく、ファイル隔離は指示ベースである。

## 4出力の独立点検

| Run | 新しい業務変更案 / 件数 | Scope / Difficulty / Confidence | Painと探索判断の関係 |
| --- | --- | --- | --- |
| [H1](../../work/optimization-review/issue-81/pain-isolation/h1/raw.md) | まとめ買い、外部購買への委託、購入結果の一括取込 / 3 | Keep・中・中、Expand・高・中低、Keep・条件付き中・中 | 高難度の外部委託を調査対象に残す。取引情報の取得先や契約は未確認のまま明示する。結果取込も未定義の取引結果に依存し、既存の連携を事実とはしていない。 |
| [H2](../../work/optimization-review/issue-81/pain-isolation/h2/raw.md) | まとめ買い、定型品の自動購入、購買サービスへの移譲 / 3 | Keep・中・中、Narrow・高・低〜中、Keep・高・低 | 責任・購入先・契約の調整を要する2案を残す。ただし委託と自動化は、反復購入を購買担当から移す方向で重なり、独立した便益が2倍あるとは数えない。既存サービスの存在も仮定。 |
| [L1](../../work/optimization-review/issue-81/pain-isolation/l1/raw.md) | 急がない申請の購買作業を同じ機会にまとめる / 1 | Narrow・低〜中・中 | 注文の統合は必須とせず、購入と結果登録は申請別に維持。Lowと未確認の件数・効果では外部委託・連携の調整を正当化できないと明記。 |
| [L2](../../work/optimization-review/issue-81/pain-isolation/l2/raw.md) | 条件付きのまとめ買い、結果登録の作業機会の統合 / 2 | Narrow・低〜中・中、Narrow・低〜中・中 | 外部委託・自動購入を除外。結果登録を遅らせる案は購入済み状態の反映遅延を生むため、許容時間と参照先を確認するまで有用性は未確定。 |

「購入後に実購入金額・購入日時を申請へ記録する」だけなら既存の業務4の言い換えなので数えない。上表の案は購入・記録の単位や責任、作業機会を変える提案だが、件数が多いことは有用性の証明ではない。特にL2の登録タイミング変更は、元の課題が購買担当の負荷のみで、状態の即時性に関する根拠がないため、純便益を留保した。

**探索予算・変更許容度:** High 2回はいずれも3案を出し、関係先が広い高難度案を未確認条件付きで残した。Low 2回は1案・2案に絞り、外部委託・連携や自動購入を調査コストに見合う根拠がないとして除外した。Low側は単なるPainの再掲にとどまらず、見送り理由を書いている。High側は効果の大きさを実測・推計しておらず、「高いPainなら高難度案の調査に見合う」という積極的な費用対効果判断まではしていない。

**Scope・Difficulty・Confidence・Unknowns:** Lowの案はすべてNarrowかつ低〜中難度。HighはKeep/Expand/Narrowを含み、外部委託・自動購入に高難度を付けた。難度は承認者・購買担当者の責任、申請者、購入先・外部サービス・他部署との契約や調整範囲に基づき、実装工数で決めていない。ConfidenceはHighの外部案で低めだが、HighとLowの確信度は一律に分かれていない。いずれも品目の反復頻度、購入のまとめやすさ、結果の申請別帰属、外部サービス・取引記録の存在を未確認とし、Painだけでこれらを既知には変えていない。

**意味と過剰探索:** どのrunも承認者の判断と`rejected`の除外、実際の購入後の申請別`purchased`・実購入金額・購入日時を守る条件を示した。未定の購入先・サービスを既存事実にはしていない。一方、H2の自動化と委託の便益は重なり、H1/H2の高難度案は利用可能な取引手段に関する証拠が薄い。L2の遅延記録は、作業集約のために状態の適時性を損なう可能性がある。これらを単純に「有望案」の件数として加算しない。

## 判断と限界

**Pain levelが探索の幅と変更許容度に寄与する傾向を、この4出力では観測した。** 固定Problemから強度表現を除いたため、前回の「負荷が高い」対Lowという入力の衝突は解消した。Lowが高難度案を控えた理由も出力中で確認できる。ただしHigh側は高難度案の調査価値を定量的に立証していない。Painと無関係な生成の揺らぎも4回だけでは分離できず、最適な候補数・固定閾値・一般的な効果は決められない。実利用者の痛み、件数、調査費用や候補実現性の測定もない。Painを入力として残す判断の材料にはなるが、この結果だけで恒久Rule/Skillを採用しない。Business Designや実装、候補の業務上の採否も変更しない。
