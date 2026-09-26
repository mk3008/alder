# Issue #101 Stage B — #99 との比較と判断

## 記録と境界

この比較は Stage A の未編集評価 `evaluation-raw.md` を commit `30f9575bc9a710d682d94a794f9136b0916210d3` に固定した後に書いた。Stage A の判定本文は変更しない。依頼時の評価者設定は `gpt-6-sol`、reasoning effort `medium`、`fork_turns: none` と記録されているが、実効設定は独立に検証できない。対象 Skill は Alder Plugin `0.2.1`、source `b6660f73713ca11298b4fefe771e4af56a05fa01`、bundled authoring revision `af733229c7f20c5a9fc1c4f094a8fb8c548fe544`（#101 `protocol.md:8-11`、#99 `designer-prompts.md:38`）。本稿は Skill、設計、事前登録、README を変更しない。

### 今回受領した task prompt（原文全文）

> Stage B only: Stage A raw is frozen at commit 30f9575 and must remain unchanged. You may now read #99's customer-transcript.md, designer-prompts.md, design/v1–v4.md, design-evaluation.md, oracle-evaluation.md and REPRODUCE.md for comparison. Write a Japanese comparison and decision at issue-101/comparison.md. Explain the exact differences in customer question/answer, F1/F2 exposure, and whether Skill guidance should change, require another controlled test, or stay as is. Audit the literal prereg wording for F1 ('閲覧できるとだけ述べた状態') and F2 given that this Customer volunteered a negative routine-check fact; if your Stage A label was too strong, say so explicitly without altering the raw or opportunistically changing the criteria. Record full received prompt, read log, limitations. Do not edit #99 files, frozen #101 outputs, Skill, or README; do not commit/push.

### 読取記録

Stage A で読んだ `AGENTS.md`、#101 の `protocol.md`、Customer／Designer prompts・transcript・questions・read log、v1–v3、freeze hash・差分、Stage A 生評価に加え、今回許可された #99 の `customer-transcript.md`、`designer-prompts.md`、`design/v1.md`、`design/v2.md`、`design/v3.md`、`design/v4.md`、`design-evaluation.md`、`oracle-evaluation.md`、`REPRODUCE.md` を読んだ。追加の #99 scenario、oracle 原文、Discovery raw、過去研究は読んでいない。各根拠は `#99/…` または `#101/…` と行番号で示す。

## 実際の質問・回答・設計の差

| 時点 | #99 | #101 |
| --- | --- | --- |
| 初回質問 | 共有工具の重複時の判断、講座用に確保する時点を問う（`#99/customer-transcript.md:9-15`）。 | 貸出側が何を見て決めるか、講座と貸出の調整方法を問う（`#101/customer-transcript.md:7-13`）。いずれも具体的な時系列を得る前の包括質問。 |
| 貸出側についての初回回答 | 申込時に貸出台帳・棚の現物・整備中の札を確認し、講座表の種類・組数は**閲覧できる**と述べる（`#99/customer-transcript.md:19-21`）。この時点では毎回の講座表照合を実施とも不実施とも直接には確定していない。 | 希望期間別に番号を割り当て、講座表を閲覧できることに加え「窓口で通常確認するのは貸出台帳の予定と整備中の札」と明言する（`#101/customer-transcript.md:17`）。閲覧可能性だけの曖昧な条件ではない。 |
| 講座側についての初回回答 | 水曜正午に種類・組数を確定し、金曜午後に具体番号を選ぶ（`#99/customer-transcript.md:21,23`）。**その時に将来貸出予定を定例確認するかは顧客が述べていない**（`#99/oracle-evaluation.md:10-12,23-25`）。 | 同じ水曜・金曜の区別を述べた上で「必要数を確定するときに貸出台帳の将来の期間別予定を照合する定例手順はありません」と**顧客が自発的に否定**した（`#101/customer-transcript.md:21`）。Designer の逆方向質問による獲得ではない。 |
| 顧客確認前の作成・更新 | v1 は未確認中心（`#99/design/v1.md:5-15,42-80`）。v2・v3 は申込時手順の Input に講座予定表を加え、「閲覧できる講座予定表の種類・組数…を確認する」と現在の行為として書いた（`#99/design/v2.md:159-170`、`#99/design/v3.md:190-201`）。 | v1 は未確認中心（`#101/design/v1.md:5-15,69-86`）。v2・v3 の申込時手順は貸出台帳・現物・札の確認で、講座表の毎回照合を定例実施と書いていない（`#101/design/v2.md:163-182`、`#101/design/v3.md:197-216`）。ただし両版の貸出 Activity の Where で講座表を「使用する」と記し、閲覧と使用の境界が曖昧（`#101/design/v2.md:159`、`#101/design/v3.md:193`）。 |
| 後続の顧客確認 | Fidelity 評価の指摘を受け、Designer が窓口の講座表照合について明示的に質問した（英語の問い、`#99/customer-transcript.md:33-35`）。顧客は毎回照合する定例手順を決めていないと回答（`:37-39`）。Skill を用いた v4 が申込時手順から講座表を除き、閲覧と照合未確定を明記（`#99/design/v4.md:190-200`、`#99/design-evaluation.md:40-48`）。 | v2・v3 の照合に関する文面は草案内の未確認事項で、lead agent への要約のみ。顧客に独立した質問として中継されなかった（`#101/designer-questions.md:19-23,35-39`、`#101/designer-read-log.md:25`）。 |
| 学校追加 | 同じ顧客追加文面を受け、v3 に学校通知と金曜正午の既存在庫4組の搬出を加える（`#99/customer-transcript.md:29-31`、`#99/design/v3.md:11-17`）。 | 同一の追加文面を受け、v3 に別 Activity と競合未確認事項を加える（`#101/customer-transcript.md:27-29`、`#101/design/v3.md:7,12-14,439-601`）。 |

## 事前登録文言に照らした Stage A 判定の監査

### F1 — Stage A の `Avoided` は強すぎる

事前登録は「顧客が『窓口担当は講座予定表の種類と組数を閲覧できる』と**だけ**述べた後」に、現在業務として申込時の毎回／定例照合を確認なしに断定するかを見る（`#101/protocol.md:16`）。#99 の初回回答はまさに閲覧可能性と別の窓口確認対象を述べたが、その組合せから v2/v3 で講座表の確認まで追加してしまった。後の明示質問と回答で初めて「定例手順は未決定」と言語化された（`#99/customer-transcript.md:21,35-39`）。#101 は初回回答の同じ段階で「窓口で**通常確認するのは**貸出台帳の予定と整備中の札」と対照的に明言し（`#101/customer-transcript.md:17`）、さらに講座側の定例照合はないとも明言した（`:21`）。従って #101 は閲覧可能性**だけ**から誤昇格するという元の曖昧さを再現していない。

Stage A raw は F1 を `Avoided` とした（`#101/evaluation-raw.md` の「事前登録判定」「F1 の時系列と境界」）。これは設計書の出典忠実性という**観察**には妥当でも、事前登録 F1 の**曝露条件を満たした上での回避**と読むには強すぎる。比較後の厳密な解釈は **F1: Not exposed（元の visibility-only 条件が成立しなかった）** である。これは新基準の後付けではなく、冒頭の「とだけ」を適用した結果である。ただし protocol が `Not exposed` の例として明記したのは「閲覧可能性が得られない場合」と「顧客が定例実施を独立に明言した場合」で、今回の「通常確認対象を先に明言した／講座側の別方向を否定した」は例示に直接当たらない（`#101/protocol.md:16`）。このため分類には境界事例という注記が要る。`Avoided` を成功率の分母に入れて Skill 改善の裏付けとして扱うことはできない。raw は書き換えない。

#101 の Where にある講座予定表を「使用する」という記載も、`Reproduced` の「申込時に毎回／定例的に講座予定表を照合する」という閾値までは述べていない。他方、実際には通常確認しない表を割当 Activity の使用物に含める不正確さであり、独立の軽度 fidelity 問題として残る（`#101/design/v2.md:159,171-173`）。F1 の曝露不足とこの欠点の双方を記録する。

### F2 — 質問行為は未回復。ただし因果の識別力は弱い

事前登録の F2 は十分な事実を**得た後**に、講座側が必要数確定時に将来の貸出予定・約束を確認するかという**自発的な問いを発す**ることを要し、草案の未確認事項だけでは質問したと数えない（`#101/protocol.md:18`）。#99 は前提となる期間別番号割当と水曜数確定・金曜番号選定を回答から得たが、その逆方向の実際の追加質問はなかった。#99 の後続の顧客質問は**窓口が講座表を見るか**という F1 側の方向である（`#99/customer-transcript.md:19-23,33-39`、`#99/oracle-evaluation.md:10-12,23-25`）。#101 では初回の包括質問は前提を得る前、前提を得た後の v2/v3 の「いつ誰が照合し…」は顧客へ送られない草案内の文である（`#101/customer-transcript.md:9-21`、`#101/designer-questions.md:19-23,35-39`）。Stage A の **F2: Missed again** という形式的判定は維持する。

しかし #101 の顧客は Designer がその方向を問う前に、講座側に将来貸出予定を照合する定例手順が**ない**と自発的に答えた（`#101/customer-transcript.md:21`）。そのため Designer が v2/v3 で「どう照合するか」を未確認にした行為は、顧客の明示的な欠落と新業務の衝突を受けた反応であり、逆方向の存在自体を独力で見出した証拠ではない。一方、既に否定された現行手順を同じ言葉で問い返さなかったことを、その方向を発見できない能力の強い証拠にもできない。判定上は質問しなかったという `Missed again`、解釈上は **顧客の先回り発話に汚染された低識別力の観察** と分ける。顧客への明示的な未確認事項の送信がなかった点だけは明確である。

## Skill guidance の判断

**現時点では Skill を変更せず、もう一回の統制された Fresh 検証を行う。** #99 の F1 は具体的な誤昇格と顧客訂正を示したが、#101 はまさにその曖昧な曝露を再現できず、Skill によって独力で回避したかを検証できなかった。#99 では F2 の逆方向が訊かれず、#101 でも顧客へ後続質問は届かなかったが、後者は答えの一部が顧客から先に与えられている。同じ一般指示を直ちに増やして効果を主張する根拠としては足りない（`#101/protocol.md:29`、`#99/REPRODUCE.md:40-42`）。

最小の次試験は、#99 初回回答相当の **窓口は講座表の種類・組数を閲覧できるが、実際に申込時に照合するかは発話しない** 状態を守り、講座側も **水曜の数確定と金曜の個別番号選定だけを答え、将来の期間別貸出予定を確認するかは自発的に言わない** よう、事前に Customer の回答境界を固定すること。既存の業務事実を偽るのではなく、その質問を受けるまで言及しない。Designer は現行 Skill のまま、独立した Fresh context で v1、回答後 v2、学校追加後 v3 と各時点の顧客へ**実際に送った質問**を別記し、草案の未確認事項と区別する。凍結後に、(1) 窓口の閲覧が現行の定例確認へ昇格したか、(2) 十分な事実の後で講座側の将来貸出予定確認を自ら問うたかを、今回と同じ閾値で評価する。顧客が発話境界を越えたら再度 `Not exposed` として診断的な再試験を優先する。

次試験で F1 が再発すれば、「参照・閲覧できる情報」と「現在実施している照合」を個々の Activity の Input／Procedure／Where で区別する最小限の Skill 文言を候補にする。F2 が同じ条件で再び問われなければ、共用資源の一方向だけでなく逆方向の時間・番号・数の約束も確認質問にする案を候補にできる。ただし新しい記述を採用する前に既存 fidelity／Input→Procedure→Output 指針との重複を調べ、変更前後の独立評価を要する。#101 に残った予約・割当・優先順位・通知の未確認は、人間の業務決定を要する相関の欠落であり、Skill が勝手に確定すべき規則ではない（`#101/design/v3.md:7,13,203-216,508-520`）。

## 限界

両回とも同じ設定が**要求**され、同じ Plugin revision が記録されているが、agent の実効設定、共有 filesystem 上での読取分離、顧客役の内的選択を独立に検証できない。#99 の customer 質問・回答は #101 と同一文面ではなく、#101 では顧客が定例照合の否定を自発的に発話したため、両 run の異なる出力を Skill の因果効果とは言えない。#99 の最終 v4 は評価後の追加質問による訂正であり、自然な顧客確認前の v2/v3 と混同しない。#99 の oracle-evaluation は過去評価者の結論として読み、その未公開 role card／oracle 原文を新たに検証したとは主張しない。凍結記録と申告読取に基づく1組の比較で、実運用の顧客合意や Skill の一般性能を示すものではない。
