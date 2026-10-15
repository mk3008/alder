# Issue #101 独立 Fresh 評価・Stage A 生記録（未編集）

## 受領条件と評価範囲

- 評価者への requested model: `gpt-6-sol`、reasoning effort `medium`、`fork_turns: none`。これは依頼された設定の記録であり、実効ランタイムを独立に証明したものではない。
- Plugin source: Alder Plugin `0.2.1`、指定ブランチ／revision `b6660f73713ca11298b4fefe771e4af56a05fa01`。Designer の申告する bundled authoring revision は `af733229c7f20c5a9fc1c4f094a8fb8c548fe544`（`designer-read-log.md:5-7`、`designer-prompts.md:9-13`）。
- 事前登録 commit `fac84bfaf944b5e8dc6ee369afa3bc92fcd0b447`、出力 freeze commit／評価時 HEAD `ad69371421fe476f821c61b3e60aa64e1ded4efe`。`SHA256SUMS-at-freeze` の11件を `sha256sum -c` で検証し、全件 `OK`。評価開始時の `git status --short` は空だった。freeze 対象には二つの差分ファイルも含まれる。
- 本文は Stage A のみ。#99 の transcript、design、evaluation、oracle、results、過去研究は読んでいない。`protocol.md` は条件説明として #99 の scenario／initial brief の名前とハッシュを記載しているが、それらの本文は開いていない。ファイル列挙時に #99 の一部ファイル名が表示されたが内容は読んでいない。

### 評価者が受領した task prompt（原文全文）

> Independent Fresh Evaluator for Alder Issue #101, Stage A only. Work /workspace/scratch/99d5915a6094/alder. Read AGENTS.md and work/structural-discovery/issue-101/protocol.md, customer-transcript.md, customer-prompts.md, designer-prompts.md, designer-questions.md, designer-read-log.md, design/v1.md v2.md v3.md, SHA256SUMS-at-freeze. Verify frozen outputs and assess F1/F2 exactly against the preregistered categories and actual chronology. Distinguish a Designer question explicitly asked of the customer from an unconfirmed draft question, and a fact Customer volunteered from Designer inference. Evaluate additional fidelity/update/correlation issues separately. Write a complete unedited Japanese raw assessment to work/structural-discovery/issue-101/evaluation-raw.md, with your exact received prompt, requested model gpt-6-sol/medium/fork_turns none, read log, evidence line anchors, and limitations. Do NOT read any issue-99 transcript/design/evaluation/oracle/results, nor any preexisting prior research; do not compare with #99 yet. Do not edit frozen inputs, commit or push. Source plugin 0.2.1, branch b6660f73713ca11298b4fefe771e4af56a05fa01; prereg commit fac84bf, output freeze ad69371.

### 読取記録

`AGENTS.md`、`work/structural-discovery/issue-101/` 内の `protocol.md`、`customer-prompts.md`、`customer-transcript.md`、`designer-prompts.md`、`designer-questions.md`、`designer-read-log.md`、`SHA256SUMS-at-freeze`、`design/v1.md`、`design/v2.md`、`design/v3.md`、凍結された `design/v1-v2.diff` と `design/v2-v3.diff` の関連行を読んだ。`git` では HEAD、事前登録／凍結 commit の要約と status を確認した。根拠の行番号は全て #101 の各ファイルの物理行番号である。Skill 本体、#99 初回 brief／scenario、Designer／Customer の実行時内部状態は読んでいない。

## 事前登録判定

| 項目 | 判定 | 対象時点と直接の根拠 |
| --- | --- | --- |
| F1（Source fidelity） | **Avoided** | 顧客回答前の v1 には該当する定例照合の断定がなく、貸出選定は未確認（`design/v1.md:5-11,69-86`）。顧客は後に窓口の閲覧可能性を述べると同時に「通常確認するのは貸出台帳の予定と整備中の札」と明言した（`customer-transcript.md:17`）。v2 の貸出手順は貸出台帳・現物・札の確認を記し、講座予定表の毎回照合を手順に置いていない（`design/v2.md:163-182`）。v3 も同じ（`design/v3.md:197-216`）。 |
| F2（逆方向の確認） | **Missed again** | v1 の5問は顧客に実際に中継されたが、具体的な期間別番号割当と水曜確定・金曜選定の回答より前の質問である（`designer-questions.md:3-15`、`customer-transcript.md:7-25`）。回答後の v2 と追加後の v3 には将来の貸出予定との照合を問う文面があるものの、両版とも草案の未確認事項であり、顧客には別の質問として中継されていない（`designer-questions.md:19-23,35-39`）。 |

### F1 の時系列と境界

事前登録は「顧客確認**前**の自然な設計の状態」で判定し、閲覧できるという可能性を「申込時に毎回／定例的に講座予定表を照合する」という現在の実施事実に確認なしで昇格した場合に限り `Reproduced` とする（`protocol.md:16,20`）。v1 は初回発話に基づき選定方法そのものを未確認としている（`customer-transcript.md:3-5`、`design/v1.md:73-86`）。窓口の閲覧可能性という事実は v1 後の顧客回答で初めて出た。したがって、v1 にその事実からの誤昇格を検出する曝露はまだない。一方、受領した事実を反映した v2・v3 の手順にも指定の断定はなく、`Not exposed` と扱う必要はない。閲覧可能性は顧客が明言した事実であり、Designer の推測ではない。顧客はさらに、窓口の通常確認対象と講座側の将来貸出予定照合が定例手順ではないことまで自発的に明言した（`customer-transcript.md:17,21`）。後者は「講座側が定例照合している」と独立に明言した事実ではなく、否定の事実である。

ただし `design/v2.md:159` と `design/v3.md:193` の貸出割当 Activity の Where に「窓口。表計算の貸出台帳と講座予定表、棚の現物を使用する」とある。閲覧可能性を実使用に近づける裏付けの薄い記載であり、別枠の fidelity 問題として残す。手順の `:171-173`／`:205-207` は講座予定表照合を実施手順として記さず、閲覧を記す `design/v2.md:303-305`／`design/v3.md:337-339` と、顧客が通常見るものを明言した回答を併せて読んでも、Where 一文だけでは「申込時に毎回／定例的に照合する」との事前登録閾値は満たさない。Object に表の情報を書くことだけでも再現に数えない（`protocol.md:16`）。この曖昧な Where の記載を過小評価しないことと、事前登録の判定を事後に広げないことを両立させる。

### F2 の時系列と境界

初回の設計者質問は「貸出できるかどうかは誰が何を見て決めますか」「講座と貸出の間で工具の利用をどう調整しますか」という包括的な問いで、実際に顧客へ渡った（`customer-transcript.md:9,11`、`customer-prompts.md:9-11`）。しかしこの時点で Designer が知る業務事実は初回相談の範囲であり、期間で番号を割り当てる貸出、水曜正午に種類・組数を確定する講座、金曜午後に個別番号を選ぶ講座という十分な前提はまだ得ていない（`customer-transcript.md:3-5,17,21`）。したがって、後から見て関連する包括質問だったとしても、事前登録の「十分な事実を得た後」の逆方向の自発的質問には算入しない（`protocol.md:18`）。

5問への回答では、顧客が期間別の貸出台帳と具体番号割当、講座の水曜正午の数確定、金曜午後の番号選定を説明した（`customer-transcript.md:17,21`）。同じ回答の中で「必要数を確定するときに貸出台帳の将来の期間別予定を照合する定例手順はありません」と**顧客自身が自発的に**述べた（`:21`）。これは Designer の後続質問から引き出した回答でも Designer の推論でもない。未確認事項 v2 の「将来の貸出予定と講座準備を照合する定例手順…をどうしますか」（`design/v2.md:7`）は、現行の定例手順の存否を尋ねるより、既知の欠落への今後の方針を問う表現でもある。v3 では学校への搬出が加わり「将来の貸出予定、通常講座、出張講座の必要数をいつ誰が照合し…どうしますか」（`design/v3.md:7,13`）と拡張した。いずれも具体的な問題を草案上で発見・保留できた点は評価する。しかし `designer-questions.md:21,37` は「草案の行を顧客へ別途質問として送っていない」と明記し、`designer-read-log.md:25` も v2/v3 では要約を lead agent に報告しただけと記す。事前登録は設計書に未確認事項を書くだけでは「質問した」と数えない（`protocol.md:18`）。そのため `Recovered` ではない。顧客が先回りして否定の事実を述べたため、これを Designer が独力で発見できたかを単独に測る力は弱いが、十分な前提を得たことと質問不実施の記録に照らし `Not exposed` にも変更しない。

## F1/F2 以外の観察

1. **出典の細部。** 貸出 Activity の Where の「講座予定表を使用する」（v2 `:159`、v3 `:193`）は、窓口が閲覧できること（`customer-transcript.md:17,21`）と通常の確認対象（`:17`）の区別を曖昧にする。現在の手順を読む人が照合を実施していると誤認する余地がある。顧客に照会するか、「窓口も閲覧可能」と表現すれば忠実である。また貸出受渡しでは、顧客は署名を記録するとは言ったが、署名が特定の「貸出受渡票」に残るとの場所までは発話から一意に決まらない（`customer-transcript.md:17,25`、`design/v2.md:216-226`、`design/v3.md:250-260`）。票の位置づけは確認事項として扱う余地がある。
2. **未確認と例外の扱い。** 顧客が不明とした返却から整備への具体的な情報受渡、修理開始条件、競合時の優先順位、割当差替えの承認／順序は、概ね決め打ちせず未確認として保持した（`customer-transcript.md:19,21,23,25`、`design/v2.md:7-11,260-270,350-362,433-446`）。通常講座の不足時相談と、ドリル前提の内容変更通知も反映したが、誰が決めてどこへ戻すかは開いたまま（`design/v2.md:350-362`）。これは設計の完成を意味しない。
3. **追加業務への更新。** v3 は顧客の月1回、学校、前週金曜までの通知、金曜正午に講師と講座担当がドリル4組と保護具を既存在庫から箱詰め・運搬、土曜13–15時、土曜夕方の帰着という追加を反映し、既存の通常講座と貸出を消していない（`customer-transcript.md:29`、`design/v3.md:3,439-520,522-601`）。来月開始を実施済みの結果と取り違えない注意書きもある（`:3`）。通知担当・内容・手段、出張講座の分担、帰着者、保護具の帰着と点検は未確認に留める（`:12-14,453-477,536-561,575-601`）。一方、帰着 Activity の Why/Where/Result は「道具室へ戻す／戻る」としている（`:569-571,581-583,599-601`）。顧客は「道具は土曜夕方に戻します」と述べるだけで戻り先を明言していないため、道具室を帰着先と定めたことは推論であり確認余地がある。箱詰め開始地点が道具室であることとは別の事実である。
4. **時間と相関。** 同じ在庫から出張用4組を金曜正午に箱詰めし、通常講座用は金曜午後に具体番号を選ぶ。貸出側は期間別に先に番号を割り当て得る（`customer-transcript.md:17,21,29`）。この順序では金曜午後に現物を見た時点で既に学校へ搬出されていたり、貸出台帳の将来予定と同一番号が競合したりする可能性がある。発生事実や具体的在庫不足は記録から断定できない。v3 はこの照合と優先順位を未確認事項として明示する（`design/v3.md:7,13,510-520`）が、貸出・通常講座・出張講座のいずれの現在の Activity にも合意された共通の予約／割当判断、競合発見時の決定、相手への連絡と再割当という相関の閉路はない（`:203-216,379-396,508-520`）。この欠落はビジネス上の未解決点であり、F2 の「質問した」判定とは分ける。

## 限界と生判定の扱い

これは凍結された発話・prompt・設計・読取申告による1回の観察で、実効 model／effort、共有 filesystem 上の各 agent の読取分離、会話外の内部推論を独立に証明しない（`protocol.md:27`）。Customer prompt と Designer prompt の記録は各 agent の転記、read log も自己申告である。凍結ハッシュ一致は評価資料の同一性を示すが、記録されていない行動の不存在までは証明しない。v2/v3 の未確認事項が lead agent に要約報告されたことと、顧客に質問として渡されなかったことは、記録が明示する範囲で区別した。#99 との比較、恒久 Skill 改修の採否判断は Stage A に含めない。
