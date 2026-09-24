# 極論探索の追加比較と本採用判断 — PR #87

[PR #87 の追加指示](https://github.com/mk3008/alder/pull/87#issuecomment-5823350104)に従い、実務利用まで採否を先送りせず、既存3ベンチマークの結果で本採用を判断した。購入申請の[初回検証](issue-85.md)に加え、設備保全と会議室予約では通常の Optimization Review を Control、極端な望ましい状態から縮退する探索を Treatment とし、同じ Business Design / Problem / Pain / 要求モデルで各1回実行した。

## 条件・追試資料

[出力を見る前に固定した条件](../../work/optimization-review/issue-85/followup/protocol.md)に Problem、Pain、入力 SHA-256、評価基準、停止条件を保存した。両 Problem は比較用に加えた条件であり、Business Design 本文にある実測事実ではない。Alder revision は `d0a5f28fc1bd12472bb001cfc750b91377610f06`。生成者は各々別の履歴なし Fresh agent で、要求設定は4回とも `gpt-6-sol` / `medium` / `fork_turns: none`。対象設計書と現行ガイドだけを指定し、他 Run の出力や比較基準は渡していない。実効設定は独立証明できず、共有ファイルの隔離は指示による。

| 比較 | Control（指示・無修正出力・実行記録） | Treatment（同左） |
| --- | --- | --- |
| 設備保全 | [指示](../../work/optimization-review/issue-85/followup/facilities-control/launch.txt) / [raw](../../work/optimization-review/issue-85/followup/facilities-control/raw.md) / [run](../../work/optimization-review/issue-85/followup/facilities-control/run.json) | [指示](../../work/optimization-review/issue-85/followup/facilities-treatment/launch.txt) / [raw](../../work/optimization-review/issue-85/followup/facilities-treatment/raw.md) / [run](../../work/optimization-review/issue-85/followup/facilities-treatment/run.json) |
| 会議室予約 | [指示](../../work/optimization-review/issue-85/followup/meeting-control/launch.txt) / [raw](../../work/optimization-review/issue-85/followup/meeting-control/raw.md) / [run](../../work/optimization-review/issue-85/followup/meeting-control/run.json) | [指示](../../work/optimization-review/issue-85/followup/meeting-treatment/launch.txt) / [raw](../../work/optimization-review/issue-85/followup/meeting-treatment/raw.md) / [run](../../work/optimization-review/issue-85/followup/meeting-treatment/run.json) |

各フォルダには起動指示全文 `invocation.txt`、生成者申告の `read-log.json`、入力・出力・指示の hash もある。raw は生成後に編集していない。各 Control と Treatment に与えた追加 Problem / Pain は同一で、Treatment の探索ヒューリスティック以外は同じガイドと設計書を使った。ただし生成が非決定的なため、単回差を手法の因果効果とは断定できない。

## 意味比較

| 対象 | Control に現れた方向 | Treatment に現れた方向 | frame-breaking の追加価値 |
| --- | --- | --- | --- |
| 購入申請 | まとめ買い、定型購入の自動化、購買委託、結果取込など（#81 / #82 の既存結果） | 同じ方向2件と、申請別都度購入を共通備品の在庫補充・承認後引渡しへ置き換えられるかという調査仮説 | **1件の新しい問い**。購入時点・単位、承認対象、`purchased` の意味を変える。反復需要・在庫費用は未確認。既存 Control は同一時点・同一プロンプトでの対照ではない。 |
| 設備保全 | 日程候補の提示、自動確定（個別の `open` 依頼の日時決定を維持） | 候補提示と、複数依頼を一回の対応機会に載せて日程検討をまとめる | 後者は Control にない**通常の改善候補**だが、各依頼を個別に `scheduled` として日時・完了を保持する。Activity の不要化や処理単位の置換は起きていない。重複可能な故障の頻度・技術者の対応条件も未知。frame-breaking と数えない。 |
| 会議室予約 | 変更時の代替室提示、会議予定と予約の連携 | 同じ二方向。極端には別個の変更・取消を不要にする案や部屋の直前割当を置いたが、最終仮説は現行の変更・取消と特定室予約を維持 | **追加なし**。予定記録・権限・代替室の有無を両群が未確認とし、同じ人間判断を返した。極論そのものは実用仮説として採用しなかった。 |

設備保全の Control にある自動確定は「同じ Activity の自動化」であり、Treatment の共同日程は「同じ処理の束ね」である。両者が異なることは記録するが、今回の主要尺度である**現在の業務モデルを疑う新規方向**には加算しない。会議室の外部予定との連携も Control に既にあり、Treatment 固有の発見とは数えない。

3対象とも指定 Problem との因果は説明され、未知の件数・設備・外部記録を既知事実としなかった。現行の安全閉鎖、予約の重複防止、申請別購入実績などの意味を保つか、変更が必要な点を人間判断として明記している。購入申請の在庫案だけは承認と購入実績の意味を変える高難度の問いであり、採用可能性は未確認である。設備保全の共同日程は技術者との条件調整を要し、会議室の連携は予定記録と権限に依存する。いずれも効果量や費用は測っていない。

## 総合判断と停止

**現時点では恒久ガイダンスへの本採用を見送る。** 購入申請では通常出力にない前提変更が1件出た一方、同条件の2比較では Treatment 固有の frame-breaking な実用仮説は出なかった。会議室は Control と同じ方向、設備保全はまとめ処理への差にとどまる。追加の探索指示と、極論を制約に戻して評価する読み取りコストに対し、現行方式より安定して有用な別モデルが得られるという証拠は弱い。既存ガイドも Eliminate と意味の変更判断を許しており、購入申請の案を現行方式が原理的に出せないという証拠はない。本判断は「極論探索が無効」という一般命題ではなく、このベンチマークと少数の出力で恒久化する費用対価値の判断である。

追加 Run は行わない。2件の対照比較で最終的な方向がほぼ重なり、単発の生成差にさらに数回を重ねても、実務での効果や出力の安定性まで示せないためである。未実施は追加 seed / prompt 変種、別 Problem / Pain、別ベンチマーク、盲検評価、実データと責任者による検証。特に購入申請には同時対照がなく、この限界は結論の確信度を下げる。採用の再検討には、別モデルへの転換が Control で見落とされ Treatment で繰り返し有用に現れる証拠、または在庫案の成立性・調査価値の実務情報が有用である。将来の昇格を完了条件には置かず、この PR の採否は不採用として閉じる。Business Design、製品実装、恒久 Rule / Skill は変更しない。
