# Issue #91 — 業務改善レバーの既存証拠再評価

## 結論

**現行の通常 Optimization Review は、少なくとも3つの既存ベンチマークで、Activity の削除・統合・順序変更以外にも踏み込んだ仮説を自然に出している。** 購入申請では承認権限の配置と取引記録の取得、設備保全では日程判断の規則と決定責任、会議室予約では別の予定記録の正本・編集権限を問う候補がある。これらは分類を生成者に教える前の Control 出力である。ただし、後二者を含め、必要な情報・規則・外部記録の実在と効果は未確認である。分類上の「技術」だけを成果とは数えない。

**在庫補充・承認後引渡しという、資源の保有方針を変える明確な別モデルは、既存の通常出力にはなく #85 の極論探索で現れた。** 設備と会議室の極論にも依頼単位・部屋の確約時期を外す問いがあるが、最終 Candidate には残らず、成立に必要な業務事実がない。後に採用した任意の Extreme perspectives 欄が同じ方向を安定して再発見するかは、これらの過去出力だけでは検証していない。

したがって「通常レビューが Process に閉じている」とは言えず、固定分類や新ガイダンスの追加を正当化する再現した探索不足もない。**Phase 1 で停止し、Fresh Run / Treatment は行わない。** これは全種類を網羅する能力、通常レビューと極論探索の因果差、業務効果を証明する結論ではない。

## 対象と評価方法

再評価時の main は `4340a7fe3db01dc7741bd1a7127423d2c278310e`。対象は [購入申請](../../business-design/purchase-request/README.md)、[設備保全](../../business-design/facilities-maintenance/README.md)、[会議室予約](../../business-design/meeting-room/README.md) と [現行ガイド](../optimization-review.md)。過去実験の入力 revision、Problem、Pain、生成指示、raw の追跡先は [#81](issue-81.md)、[#82 追従](issue-82-followup.md)、[#82 Pain 比較](issue-82-pain-isolation.md)、[#85 初回](issue-85.md)、[#85 追加比較](issue-85-followup.md) にある。購入申請の過去入力は `5405a5069fc13e1a1e27de8b06e4a375a3653e5e`、#85 の3業務比較は `d0a5f28fc1bd12472bb001cfc750b91377610f06`。以下はその凍結済みの結果を後から読み直した評価で、再生成結果ではない。

ラベルは今回だけの観測用。**Process** は作業の機会・単位・手順、**Data** は業務記録の取得・対応・正本、**Rule** は判断条件や規則、**Role** は権限と決定責任、**Resource** は保有する物・設備とその運用、**Technology** は新たな能力を成立させる場合、**Mixed** は複数の変更が不可分な場合とする。自動化という実装手段だけ、未確認のデータ項目の列挙だけ、既存手順の言い換えだけでは「有用な非 Process 仮説」に数えない。各行の主たる変更対象と、付随して人が決めるべき前提を区別する。

Problem はいずれも実験用の追加条件で、件数・工数・効果の実測値ではない。設備保全と会議室予約には同条件で通常 Control と旧 Treatment が各1回あるが、購入申請の比較 Control は過去 Run の再利用であり同時比較ではない。旧 Treatment は現在の Extreme perspectives 欄の採用前の探索指示である。

## 購入申請：通常出力の観察

根拠となる Business Design は、承認者の判断で `approved` にし、購買担当者が承認済み申請に基づいて購入し、申請ごとに実購入額・日時と `purchased` を記録する。繰り返す品目、注文先、取引記録、在庫、代理承認の可否は記載されない。

| 既存 raw / 対象 Problem | 変更対象と Problem への因果 | ラベル・判定 |
| --- | --- | --- |
| [#81 初回](../../work/optimization-review/issue-81/outputs/raw.md)、購入・登録負荷 High | まとめ買いで購入機会を減らす。申請別の実績帰属は維持。 | Process。品目の共通性、待機と配賦は Unknown。 |
| 同上 | 定型申請の購入と結果取得を自動化し、手操作と転記を減らす。 | Mixed（Process / Data / Role）。取引結果の取得手段、購入権限と責任、定型品の存在が Unknown。単なる「自動化」だけでは成果に数えない。 |
| 同上 | 外部購買サービスへ手配を移し、購買担当の反復を減らす。 | Role / Process。サービス・契約・申請別結果の確定は Unknown。自動化案と便益の重複あり。 |
| [#82 A1](../../work/optimization-review/issue-81/followup/a1-approval/raw.md)、承認待ち High | 確認枠と滞留時引継ぎで承認待ちを短くする／案件別に承認判断者を分散する。 | 前者 Process / Role、後者 **Role / Authority**。判断主体を変え得る直接の非 Process 仮説。ただし承認集中や代理権限は未確認。実判断は承認者に残す。 |
| [#82 A2](../../work/optimization-review/issue-81/followup/a2-reconciliation/raw.md)、結果照合 High | 購入時に申請と実績を一体で確定／別の購入記録と照合し例外のみ人が確定。 | 前者は既存の購入後登録に近く、新規成果に数えない。後者 **Data / Role** で転記・照合を減らす条件付き候補。購入記録の存在と一意な対応は Unknown。 |
| [#82 B Low](../../work/optimization-review/issue-81/followup/b-low/raw.md)、購入負荷 | 購入機会をまとめる／結果記録を購入時の確認に含める。 | Process。後者は既存設計の言い換えに近い。Problem 文の「負荷が高い」と Low が衝突し、Pain 差の証拠には使わない。 |
| [#82 H1](../../work/optimization-review/issue-81/pain-isolation/h1/raw.md)、中立 Problem High | まとめ買い／外部委託／取引のまとまりから購入結果を取り込み、申請別に確認。 | Process、Role / Process、**Data / Process**。最後は取引記録の取得・申請との帰属を変え得る。記録の存在と配賦は Unknown。 |
| [#82 H2](../../work/optimization-review/issue-81/pain-isolation/h2/raw.md)、同 High | まとめ買い／定型品の自動購入／購買サービスへ実行と結果収集を移す。 | Process、Mixed（Rule / Role / Process）、Role / Process。定型判定・決定権・委託先は Unknown。自動化と委託を独立した便益として二重計上しない。 |
| [#82 L1](../../work/optimization-review/issue-81/pain-isolation/l1/raw.md)、同 Low | 急がない申請を同じ購買機会にまとめる。 | Process。急ぎの判定と待機許容は Unknown。 |
| [#82 L2](../../work/optimization-review/issue-81/pain-isolation/l2/raw.md)、同 Low | 条件付きまとめ買い／購入後の結果登録機会をまとめる。 | Process。後者は `purchased` の反映を遅らせ得るため、許容条件がないまま有益とは判定しない。 |

[#85 の旧 Treatment raw](../../work/optimization-review/issue-85/raw.md) は上記のまとめ買い・委託を再提示したほか、**申請ごとの都度購入を共通備品の在庫補充・承認後引渡しへ転換**する問いを出した。ラベルは **Resource / Rule / Process の Mixed**。購入時点と単位が変わって反復購買を減らし得るが、現在の承認対象、`purchased`、実購入額の意味はそのまま保てない。共通需要、在庫費用、保管責任は Design と Problem に存在しないため Candidate の採用可能性を認定できない。#85 の旧 Control は同時・同一文面の対照ではなく、「通常方式には生成できない」とは言えない。

## 設備保全と会議室予約：通常出力と旧 Treatment

設備保全の Design は故障報告ごとの `open` 依頼、保守調整担当者による各依頼の予定日時決定、`safety_closed` での日程設定禁止、技術者による依頼別完了を規定する。同じ設備への複数報告は受け付けるが、技術者の空き、所要時間、優先順位、重複排除規則は定めない。Problem は依頼増加時の依頼別日程決定負荷、Pain High。

| 既存 raw | 変更対象と Problem への因果 | ラベル・判定 |
| --- | --- | --- |
| [通常 Control](../../work/optimization-review/issue-85/followup/facilities-control/raw.md) 候補1 | 日時候補を提示し、探索の反復を減らす。個別の確定は担当者に残す。 | Data / Process の条件付き候補。候補の根拠となる作業枠情報は Unknown。技術だけの置換とは数えない。 |
| 同候補2 | 人が承認した条件だけ日時を規則で自動確定し、個別判断件数を減らす。 | **Rule / Role / Process の Mixed**。規則の承認・管理責任を新設し得る。定型依頼と判断基準が Unknown であり、現行の安全閉鎖・未来日時条件は保つ必要がある。 |
| [旧 Treatment](../../work/optimization-review/issue-85/followup/facilities-treatment/raw.md) 最終候補 | 候補提示／複数依頼を一回の対応機会に載せて日程検討する。 | 前者は Control と重複、後者は主に Process。各依頼の `scheduled` と完了対象は維持するので別モデルの成立例に数えない。 |
| 同 raw の極端な到達状態 | 故障依頼ではなく設備への一回の対応を日程単位にし、依頼別の日程決定を不要にする。 | Resource / Process の探索視点。依頼別の記録・完了保証をどう置き換えるか、人間判断と実例が必要。最終 Candidate には残っていない。 |

会議室予約の Design は特定室と時間帯の確約、予約者自身による変更・取消、変更失敗時の元予約維持と競合防止を規定する。会議予定の別記録・編集権限、定員・設備、直前割当は定めない。Problem は予定変更・取消時の予約やり直し負荷、Pain High。

| 既存 raw | 変更対象と Problem への因果 | ラベル・判定 |
| --- | --- | --- |
| [通常 Control](../../work/optimization-review/issue-85/followup/meeting-control/raw.md) 候補1 | 空き確認と予約変更を接続し、探索と再入力を減らす。 | Process。代替室の有無は Unknown。 |
| 同候補2 | 会議予定の変更・取消を別の予約記録へ反映し、二重更新を減らす。 | **Data / Role / Process の Mixed**。予定の正本・対応付け・編集権限を問う非 Process の候補。別記録の実在は Unknown。 |
| [旧 Treatment](../../work/optimization-review/issue-85/followup/meeting-treatment/raw.md) 最終候補 | 予定との対応付け／代替室提示。 | Control と同じ二方向。非 Process 発見の増分には数えない。 |
| 同 raw の極端な到達状態 | 予定変更をそのまま部屋の権利変更にする／特定室の事前確約をやめ、利用直前に割り当てる。 | 前者 Data / Role、後者 Resource / Rule / Process。前者の縮小案は Control に既出、後者は特定室を選ぶ現在の意味を変えるため最終候補には残らない。 |

## 研究質問への回答と停止

1. **現行方式で発見できるか。** できるという存在証拠がある。Control の A1（承認権限）、設備（判断規則・権限）、会議室（予定記録・正本）には Problem への因果と変更対象がある。ただし非 Process 要素の多くは Process と一緒に変わる条件付き仮説であり、独立した分類の網羅率は測れない。
2. **Extreme によって初めて発見したか。** 在庫補充の方向は既存通常出力になく旧 Treatment で観測された。設備の依頼単位廃止と会議室の直前割当は旧 Treatment の探索過程に現れ、最終候補には残らなかった。購入申請の Control は歴史的比較で、3例とも旧 Treatment 固有の因果効果は立証できない。
3. **導出不能な情報か。** 在庫・共通品目、購買の取引記録、作業枠、予定の正本・編集権限、代替室の条件はいずれも現行 Design にない。仮説を質問として提示することと、効果・成立性を判断することは別である。価格・契約、データ品質、需要・安全・費用の実態も Problem にない。後者を理由に特定の改善策を採用可能とすることはできない。
4. **ガイダンスによる探索不足か。** 複数の Control が非 Process の前提を問い、極論では資源モデルも出ているため、現時点で再現した偏りは観測されない。すべての Rule / Resource 変化を自然に見つけるかは未検証であり、不在だけを欠陥とは判定しない。
5. **仕組みを変えるべきか。** 今回は変更不要。追加情報がある実業務で、価値のある非 Process 仮説が繰り返し見落とされる事例が出た場合に、同じ Problem・Design の Control と最小の追加指示を比較し、別 Issue で扱う余地がある。Business Design の観測範囲にない制度や資源は Review の文言だけで埋められない。

既存3ベンチマークと raw、既存評価を確認し、分類は後付けで行った。追加 Run は、上記の存在証拠と情報不足の切り分けを大きく変える見込みが低く、業務上の実在・適用可能性は生成を重ねても確定しないため停止した。**Business Design、Optimization Review、Skill、Rule、ベンチマーク本体は変更しない。** 実改善の効果、分類ごとの再現率、現在採用された Extreme perspectives 欄の実行結果は主張しない。
