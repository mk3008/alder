# Primary pilot final freeze v1

2026-10-02。Issue #133の07:32 UTC決定コメントを反映した、初回Primary run前の条件。旧準備commit `513f616d4fd36f0d5e7a3d35eb89dd4aa245f6b5` は候補とpreflightの記録として保持する。

## 比較範囲

- 5 cases × 2 arms × 2 replicates。20 Stage1、20 Stage2、20中立Stage3 probe。
- C1–C4は要求整理、C5はarchitecture指定の有無と公開API/schema制約を含む引渡し。
- Stage2は `inputs/C*/s2.txt` のresolved sourceだけを使う。固定回答をsourceへ追記し、clean directory / Fresh contextで再生成する。Stage1成果物や会話履歴を渡さない。成果物の編集・更新能力は評価対象外。
- C5についてStage3の回答で、named architectureなしに実装へ進めるための期待結果と未決を抽出する。実装・DB接続試験は本pilotに含めないため、実装viabilityは「資料からの準備状態」のみを判定し、動作実証とは呼ばない。

## モデルと実行

生成node、Alder authoring、probe、独立評価はすべて `gpt-6-sol / medium / fork_turns:none` を要求する。providerはChatGPT Work collaboration。実効model/effortの独立attestationは利用できない。requestedとeffectiveを混同しない。

RDRAはAI呼出しだけFresh agentに置換する。公式ZIPのPrompt / Knowledgeを編集しない。`dag.json` は公式 `rdraDependency.js` のnodesをそのままJSON化したもの。AI nodeは**18本**。旧準備READMEの19本という記述は誤りであり訂正する。公式18 nodeそれぞれのinputs/outputsを守り、入力充足・出力存在でrunnable/skipを判断する。独立nodeの実行順はconcurrency制限に応じてよい。rebuildとphase5の6公式scriptは元の順序で実行する。

各nodeへ独立したディレクトリを渡す。そこには当該公式Prompt、公式AGENTS.md、公式Knowledgeと当該nodeのinputsだけを置く。Knowledgeの他Promptやsampleは読ませない。Promptは原byteで保存してagentが読んで実行する。orchestration envelopeはそのPromptを修正せず、作業root、許可入力、出力先、証跡の置き場だけを指定する。公式Promptのsource hashと完全なenvelopeを保存し、第三者は公式ZIPからPrompt原文を再構成できる。配布物の全文は再配布しない。

一部公式Promptは存在しない `RDRA_Knowledge/_1_RDRA/RDRA.md` を参照する。実物の正典 `RDRA_Knowledge/.rdracore/RDRA.md` を同一byteのpath aliasとして供給し、aliasの両hashを保存する。Prompt自体には修正を加えない。この実行上の補助は全RDRA runで共通にする。

AlderはpinしたAuthoring Skillと同梱参照を使用する。Skillが指定するadoption section 1と任意Graph profileを読む。今回はBusiness Graphの任意exportを要求しない。別ケース・実装・Optimization・oracleは渡さない。両armの共通sourceはhashを照合する。

## 入力隔離と記録

oracle/rubricはoperator・evaluatorだけの材料。generatorへのmessageや作業rootには含めない。各Fresh agentへ相手arm、過去replicate、parent会話、全体Issueを渡さない。共有filesystemはsecurity sandboxではなく、限定rootと明示的read allowlistで運用する。この限界は結果に残す。

各invocationを開始前に保存し、requested settings、agent ID、時刻、read-log、raw response、artifact hash、失敗/retry、nodeごとのinputs/outputsを記録する。途中失敗を修正して消さない。公式postprocessが変更したファイルのbefore/afterも区別する。単一nodeの出力修正はoperatorが行わない。

Stage3は各Stage2のbusiness artifactsだけを匿名の単一packetへ連結して渡す。手法名・version/provenanceだけは匿名化し、意味は変更しない。匿名化patchとmappingを保存する。元source・oracle・他出力はprobeへ渡さない。formatからarmを推測できるsingle-blind限界を記録する。

## 評価

`rubric.md`を固定する。canonical factsへの抽出とscoreを区別し、rawの根拠行から第三者が再採点できるようにする。質問禁止はRDRA公式生成workflowの特性として記録する。能力全般への一般化はしない。RDRA QA Skill追加armは実行しない。

C5ではarchitecture input requirement、内部構造の未承認要件化、API/schema制約の保持を別記する。動作する実装を作っていないときのconstraint-only implementation viabilityは `not_executed` とし、handoff readinessを補助観測として分ける。

同一採点によるpaired記述比較。差なし・RDRA優位も残す。モデルや条件を結果を見て変更しない。Secondary/nativeはCLI/認証を変更せずblockedとして別欄に置く。

## 修正・停止

初回run後の入力・rubric変更はv1へ上書きせずdated deviationとして記録する。入力不足、公式script失敗、禁止入力参照は該当runの失敗/無効性として残す。Partial runだけで全Doneを満たしたと扱わない。
