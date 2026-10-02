# RDRA / Alder same-model pilot 実行報告

5ケース・2反復の同一要求モデル比較を完了した。両手法に観測可能な構造差と未決保持の差があるが、一般的な優劣は確定できない。全60資料は技術的に完成し、厳密条件のpaired資料は予定30組中5組、source-clean探索資料は30組。guard許可が非対称だったため、厳密条件の有効率を手法品質と解釈しない。

[全60件の結果表](evaluation-result/RESULT-TABLES.md)、[証跡manifest](EVIDENCE-MANIFEST.json)、[実行ふりかえり](RETROSPECTIVE.md)。元採点・全attempt・原文引用を保持し、原文曖昧な15claimは影響metricだけNA、未確認claimは0件。

## 対象と実行条件

5ケース、各2反復、2手法、3Stageの60資料枠。Stage1は元ヒアリング、Stage2は同じ元情報に人間回答を模した事前固定packetを追記したsourceからFresh再生成、Stage3はStage2の最終引継ぎ資料だけを受け取る共通probe。Stage1 artifactの更新性能は試していない。

- 最終freeze: `b6d579a4d9c5a90f7e1de84fa2eccd36d0a14a95`。初回生成前に5ケース・source/回答・oracle/rubric・DAGを保存。
- RDRA: RDRAAgent 0.8公式ZIP（SHA256 `528b17deb76ac70050620b82118a6140f070f9e7b6282fc8b26d2a43420e074b`）。公式Prompt/Knowledgeの本文を変更せず、DAG依存・出力・skip条件を維持しAI呼出しだけFresh agentに置換。20workflow ×18予定AI nodes =360 node calls。6 scripts/workflow。
- Alder: `eb591bfbc1b077b0e93d62253cb1e7f3e392e462`のAuthoring Skill、plugin 0.2.8。20 Fresh authoring calls。任意のBusiness Graph export、実装、Check Item、Optimization reviewは要求しない。
- 全generator/probe/extractor/scorerは要求設定 `gpt-6-sol / medium / fork_turns:none`。provider側の実効設定・token・費用の独立証明はない。
- RDRA native CLIは不在、preflightはEPIPE/exit1。今回の成功/失敗分母とは別の環境障害。native比較はblockedであり、CLI install・外部認証・費用操作はしていない。
- C1は公開RDRA historical fixture `tango238/rdra@be7b56578b65a9582ede2684009dafeab9933c79/example/library/rdra.yml`、blob `4b7881c0a1361e5d4270a492f99421381052ee06`を参照。0.8同梱sampleとは分ける。その他は事前固定の人工/適応ケース。

## 評価と分析の境界

手法・反復を匿名IDへ置換し、抽出者は匿名business資料だけを正規化する。採点者はcaseの固定source/回答/oracle/rubricとcanonicalだけを読む。probeの発明は実際に受領した引継ぎpacketのcanonicalと比較する。Stage2全体のcanonicalはStage2品質に用いる。初回C1採点後に両者の範囲差を確認し、同一byteなら原canonicalを再利用、非同一なら実受領packetのみを別Fresh抽出する測定補正を追加した。原採点attemptと全raw-check claimsを保持し、補正後評価の前に手順を公開した。根拠IDから引用と物理行番号を通じて原資料へ遡れる。機械照合は引用文字列の存在・行範囲・IDの正しさを確認するもので、短い単語引用も形式上は通るため、canonicalの意味解釈が正しい独立証明にはならない。人間または外部第三者の評価ではなく、同じ要求モデルによるFresh AI評価である。形式から手法を推測できるsingle-blindの限界がある。

厳密なwrapper遵守の分析と、実行開始後に追加したsource-clean探索分析を分ける。実際のwrapper外read/attemptをstrict分析から除外する。RDRA wrapperはown output検証readを許可していた一方、Alder wrapperはinput-onlyで、この許可差は生成開始後に判明した。Alderの自己生成output検証readによる無効とRDRAの非存在path試行による無効を原記録に残すが、guard合格率を同一難度の条件や手法品質の比較へ置換しない。source-cleanは正規input/Prompt hash一致と追加内容取得なしという申告traceに基づく限定的分類。共有filesystemと自己申告read-logはsecurity isolationや完全性の証明ではない。無効枠を予定母集団から消さず、欠測をcoverage 0に置換しない。

生成開始後・初回probe/score前に固定oracleからStage3必要事実subsetを明示した。scope、still unresolved、historical候補、業務期待結果ではない技術名を期待結果の分母へ強制しない。元oracle、Stage1/2分母は変更していない。変更時点と全除外をdownstream-denominators.jsonへ保存。

Stage1/2のRDRA抽出は0_RDRAZeroOneと1_RDRAの完成business資料、Stage3のhandoffは1_RDRAのみ。Alderは業務設計書と最終応答を渡す。18nodeのRDRA定義までを対象にし、後段のRDRASpec/RDRASdd/Code生成は対象外。RDRA中間資料一式を渡す追加probe、RDRA QA Skillを使う対話armは実施していない。質問禁止の公式生成workflowの観測をRDRA手法全体の対話能力へ一般化しない。

RDRA18node pipelineとAlder1call workflowのbundle比較であり、計算量を揃えた単一Promptの因果実験ではない。dispatch件数とartifact UTF-8 bytes/file数を品質とは分ける。queue・並列枠・operator検証を含む実行時間を固有latencyや人間作業時間と解釈しない。

C5はAPI/schemaの既存制約保持、named architecture追加必須指定、未承認内部構造の業務要件化、資料としてのhandoff readinessを観測する。実装/API/DBの動作試験はなく、implementation viabilityは`not_executed`。5ケース・2反復の記述的pilotから一般優位や実業務効果、統計的再現性、総合勝敗を結論しない。

曖昧な採点箇所は、元入力やoracleを読まないFresh原文reviewerの局所引用と対応IDを保存する。初回・retry両方の全claimsをledgerに残し、別Fresh scorerが引用文脈から判断する。flagが消えただけで解決済みにしない。原文自体が曖昧なら影響するmetricのみNA、その他の根拠付きmetricは保持する。未解決claimが残るpacketは最終pair集計に混ぜない。

C1では未決factを具体的質問と誤って採点した2資料について、評価者自身が固定rubricへの適用誤りを訂正した。原採点を上書きせず、別patchと理由を保存し、集計は元値/根拠ID/hash照合後に明示適用する。元flagの文脈対応確認も同じ評価者の追加model turnとして記録し、新Fresh spawnとは数えない。

完全JSONをファイル保存できても最終応答への全文返却に残った配送逸脱は、canonical deliveryのstrict不合格として別記した。元generationの厳密条件と分け、完成payload/hash/引用検証済み資料だけを探索観測へ供給する。新Fresh再抽出で原結果を差し替えない。

## 結果

以下はsource-clean探索観測である。値の全一覧とstrict適格IDは結果表を参照する。2反復を平均や総合点にせず、caseごとの結果を記す。

| case | Stage1 未決発見 / 質問（rep1, rep2） | Stage2 source+回答保持 | Stage3 必要期待結果保持 |
|---|---|---|---|
| C1 図書館貸出 | Alder 2/2・2/2 / 2/2・2/2。RDRA 2/2・2/2 / 0/2・0/2 | Alder 13/13・13/13、RDRA 12/13・13/13 | 両手法・両rep 11/11 |
| C2 会議室予約 | Alder 3/5・4/5 / 3/5・4/5。RDRA 0/5・0/5 / 0/5・0/5 | Alder 14/14・14/14、RDRA 13/14・14/14 | 両手法・両rep 13/13 |
| C3 購買申請 | Alder 3/3・3/3 / 3/3・3/3。RDRA 2/3・1/3 / 0/3・0/3 | 両手法・両rep 14/14 | 両手法・両rep 13/13 |
| C4 承認分岐だけ | 未決は適用外。correct_stopは両手法・両rep false | Alder 6/6・6/6、RDRA 6/6・5/6 | 両手法・両rep 5/5 |
| C5 既存API/schema引継ぎ | Alder 1/2・1/2 / 1/2・1/2。RDRA 1/2・1/2 / 0/2・0/2 | Alder 21/22・22/22、RDRA NA・NA（source保持の原文曖昧性） | Alder 15/16・15/16、RDRA NA・14/16 |

C1 RDRA rep1で落ちた事実は試験範囲の限定、C2 RDRA rep1では同時予約保証と順序が未決であること、C4 RDRA rep2では承認分岐だけというscope。これらは下流期待結果subsetに含まれないため、probe coverage一致から範囲や未決の引渡しも同じとは言えない。C1 probeのRDRA追加決定各1件は上流資料から伝わったもので、probe独自の発明ではない。C2 RDRA rep1とC4 RDRA rep1のprobe発明/未決漏出には原文曖昧性によるNAがある。

C4ではAlderがscope外の具体化を質問2件/1件として残し、RDRAには資料間の承認権限表現の曖昧さがあった。両手法のcorrect_stopはfalseであり、Alderが必ず止まるという主張を支持しない。これは有限の生成結果に対するrubric判定であり、無限ループやruntime停止障害の計測ではない。

C5では両手法が未決2件のうち1件しか発見せず、下流でschema列型制約などの詳細が失われた。Alder Stage2もrep1は既存schema具体制約を完全保持していない。RDRA Stage2の2資料はactor対応/schema厳密制約の原文曖昧性によりcoverageを確定できない。未承認architecture昇格はRDRA Stage1/2各資料1件、Alder各資料0件という採点。追加architecture手法の必須指定は全12資料falseであり、評価者の当初nullは適用漏れとして別patch12件で訂正した。実装viabilityは全資料not_executedで、実装の成功・失敗を表さない。

## 両手法の固有の強みと限界

RDRAはBUC・活動・UC・情報・条件・状態・actorを横断する表と関係を生成した。C2 P002では取消後の即時復帰（F13/F14）と停止時の検索・新規予約・変更先・既存予約維持（F16–F19）が関連構造に残る。変更影響を追う入口としての構造が観測できる。ただし変更影響分析の実作業、変更後の追従、人間の時間節約は試していない。関係構造の多さは整合性の保証でもなく、C4/C5の局所曖昧性と両立する。

AlderはActivityをInput/Procedure/Output/Resultへまとめ、未決を合意済みの期待結果から分けた。C2 P058では同時要求の未決（F19）を維持し、取消復帰（F7/F9）と停止効果（F13/F22/F23）を明示した。C2/C3の未決発見・質問で今回のRDRA生成workflowとの差が観測された。一方、C2/C5の未知事項を全て発見できず、C4で追加質問し、C5では契約詳細が落ちた。非専門家の理解速度や合意率は計測していない。

C1の両手法は同じ2未決を保持し、C1–C4の全16probeは固定した下流期待結果を全て保持した。差がない指標もそのまま残す。RDRA質問0は公式生成workflowの質問禁止に沿う結果であり、QA Skillや手法全体の対話能力への否定ではない。総合勝敗、単一Promptの因果効果、一般的な業務効率の優位はこのpilotから確定しない。

## 実行・監査の結果

原生成はAlder20/20、RDRA20/20技術完了。生成のstrict適格はAlder15/20、RDRA4/20。20probe、匿名canonical60、実受領handoff対応20を確認した。P013/P042は保存payloadの引用/hash検証に合格したが全文final返却の契約逸脱を残す。P050の引用不一致2attemptを保持し、同一条件の第3Fresh抽出が合格した。原業務生成は再生成していない。

記録されたFresh agent IDは514：Alder20、RDRA362（予定360、parameter retry1、早期transport abort1）、probe20、canonical62、score11、raw reviewer29、handoff10。既存agentの補足turn、dispatch前のthread limit失敗、coordinator、provider billing単位とは別である。RDRA scriptは123attempt（成功122・失敗1）を保存。全20workflowの760依存順/producer-consumer照合を確認した。

原文確認33claimは解決18・原文曖昧15・未確認0。C1質問と未決の混同4patch、C5 architecture適用漏れ12patchは評価者作成の別ファイルをhash・元値・canonical ID照合して適用した。元scoresを書き換えず、原文曖昧metricのNAも保存している。21固定fileのhash、generator元artifact、canonical/probe/実受領資料のbyte provenanceを照合。引用存在の機械合格を意味解釈の独立証明へ拡張しない。

実測中にmainを取り込んでfreezeを変更していない。実測完了後のmainとの差分確認とPR mergeabilityはpublication記録で分ける。正式Alder仕様は変更しない。

## 応答記録の範囲

通常JSON runは子が保存したcanonicalとraw payloadのJSON同一性を機械照合する。tool FINALの表記はtool traceが原記録であり、全FINALの逐字byteを独立に永続保存したとは主張しない。summary/file-link/配送逸脱の実finalは別ファイルに残す。pure-return全文の一部もpayload bytecopyと原tool traceの役割を区別して記録した。出力量は保存artifact/raw-response.mdのUTF-8 bytesであり、provider wire serialization、token、費用ではない。

## 追加の運用観測（post-hoc）

保存timestampの再集計では、同一共有実行でAlderの20 authoringは先に完了した。その時点でRDRAは360 node中49終了・50開始、最終nodeまで終わったworkflowは2/20だった。Alderは最大同時実行1、RDRAは3。永続業務成果物はStage1/2の各runでAlder1ファイル、RDRA27ファイル。C1–C4の固定Stage3下流必要期待結果の保持は両手法とも全件で、この指標にRDRAの追加中間成果物が必要だったとは確認できない。全体の品質一致や少ない成果物による速度の因果を意味しない。RDRAの横断関係構造の追加価値と維持コストの関係は別途検討が必要。

[実行時系列・成果物面積](change-cost-probe/EXECUTION-TIMELINE.md)と全timestampを保存した。scheduler/共有資源/DAG依存は統制しておらず、一般的な開発速度やcredit/token/実課金を主張しない。これはPrimary scoreの変更ではない。

C2/r1/s2の既存資料に停止時予約維持→取消・利用不可の1変更を各arm1回反映した[変更コストprobe](change-cost-probe/CHANGE-COST-SUPPLEMENT.md)。Alder1ファイル、RDRA23ファイルが変わり、両最終資料に新しい意味が明示された。更新面積の仮説と整合するが、各arm1 Fresh dispatchでcall差は示していない。RDRAは公式影響分析＋直接編集＋公式派生scriptの探索経路で、公式incremental updaterの試験ではない。利用上限中断後に同じagentを継続したためwall spanを速度比較に使わず、未記録read1件も保存しstrict pairedとは扱わない。独立downstreamや実装動作は追加実行していない。Primaryの採点は変更しない。
