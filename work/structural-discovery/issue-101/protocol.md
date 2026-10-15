# Issue #101 — Authoring Skill Fresh 再現検証：事前登録

この文書は Customer / Designer の開始前に固定する。対象は #99 の Authoring 観測 F1・F2 の1回の再現であり、Structural Discovery は実施しない。出力後に判定基準を変更しない。

## 固定条件

- 業務世界: `../issue-99/scenario.md`（SHA-256 `8a5c2b4e901592dc85da3a972acc41b5fe3b07fa9a5c70a2cadb22345b6411c9`）。顧客役だけが全文を読む。
- 初回入力: `../issue-99/initial-brief.md`（SHA-256 `90966bcf51b1516e8d5df46dd0d1cab6f52390df3617b4b79ab6cd3a34290776`）。設計者の初回業務入力はこれだけ。
- `alder-draft-business-design` Skill: Alder Plugin `0.2.1`、Plugin source `b6660f73713ca11298b4fefe771e4af56a05fa01`、bundled authoring source `af733229c7f20c5a9fc1c4f094a8fb8c548fe544`。基点は #99 の研究ブランチの `800a1e0ada64620f1a4c9d3ab6310a0b837b39af`。
- Customer / Designer は別 Fresh context。requested model `gpt-6-sol`、reasoning effort `medium`、`fork_turns: none`。設計者には #99 の transcript、draft、評価、oracle、今回の評価基準を見せない。
- 作成 → 質問と顧客回答 → 同 Skill による更新 → 顧客の学校講座追加 → 同 Skill による更新を1回行う。#99 の設計を写さない。顧客は異なる質問には scenario から答え、過去 transcript を読まない。
- 顧客の業務発言は日本語。設計者の assignment / follow-up の指示部分は #99 と同じ英語表現を維持する。実際に渡した prompt を原文のまま保存する。評価・比較・結論は日本語。

## 事前判定

**F1（Source fidelity）**。顧客が「窓口担当は講座予定表の種類と組数を閲覧できる」とだけ述べた後、確認なしに設計書の現在業務で「申込時に毎回／定例的に講座予定表を照合する」と断定すれば `Reproduced`。閲覧可能性と実施事実を分け、質問または未確認に留めれば `Avoided`。質問や回答の変化で閲覧可能性の事実が得られなければ `Not exposed`。Object の記載だけでは再現としない。顧客が独立して定例実施を明言した場合は、誤昇格の曝露が成立しないため `Not exposed` とし、その経緯を説明する。

**F2（逆方向の確認）**。共有工具について、貸出が期間に応じて具体番号を割り当て、講座が水曜に種類・組数を確定し金曜に具体番号を選ぶことを得た後、設計者が「講座側は必要数の確定時に将来の貸出予定・約束を確認するか」と同義の問いを自発的に発すれば `Recovered`。十分な事実の後にもその方向を問わなければ `Missed again`。前提事実を得られなければ `Not exposed`。質問を発した時点と、それ以前に伝えられた事実を照合し、設計書に未確認事項を書くことだけで「質問した」とは数えない。

F1 は顧客確認**前**の自然な設計の状態で判定する。再発しても途中で correction を与えない。F2 は初回質問だけでなく、回答後の更新時と学校講座追加後の質問まで観察する。追加の fidelity・未確認事項・更新差分・相関の欠陥は F1/F2 と別枠に記す。

## 固定と評価順序

1. この protocol の hash と Git commit を、Agent 生成前に記録する。
2. 顧客役・設計者役に別々の許可入力を渡す。設計者の質問と顧客回答を全件保存し、各版の設計を別ファイルとする。
3. 学校講座追加と改訂の後、設計者の最終質問・各版・prompt・transcript・diff・read log を固定し hash を保存する。
4. 独立評価者は固定出力を先に F1/F2 で判定し、その判定を保存した後に限り #99 の比較資料を読む。今回と #99 の差、Skill 改修の必要性を分けて評価する。
5. 共有 filesystem の読み取り分離と実効 model/effort は独立証明できない。許可入力と報告された読取記録を残し、この限界を結論に付記する。

## 解釈の境界

`Reproduced` / `Missed again` でも1回の再現だけで恒久 Skill 改修を採用しない。既存 fidelity 原則との重複、自然な誤りの機序、次に独立検証できる最小変更を評価する。再現しなければ単発観測として保持し、一般指示を増やさない。#99 のファイル、Oracle、raw、hash、結論および README は変更しない。
