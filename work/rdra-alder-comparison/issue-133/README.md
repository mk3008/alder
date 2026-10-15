# RDRA / Alder same-model pilot

Issue #133の5ケース・2反復の比較記録。Primary runは完了済み。全60資料の生成・匿名抽出・文脈評価を完了。厳密条件とsource-clean探索を分けた記述的pilot。

[最終結果・実行報告](REPORT.md) · [詳細表](evaluation-result/RESULT-TABLES.md) · [証跡manifest](EVIDENCE-MANIFEST.json) · [ふりかえり](RETROSPECTIVE.md)

## 記録を読む

- [固定条件](PROTOCOL.md)、[cases/source/固定回答/oracle](cases.json)、[rubric](rubric.md)
- [配布物・版・全file hash](source-manifest.json)、[初回生成前のchecksums](SHA256SUMS)
- [実行上の逸脱と分析の境界](benchmark-preparation/EXECUTION-DEVIATIONS.md)
- [原生成・script・spawn/read-log](primary-runs/)、[匿名packet](blind-packets/)、[canonical抽出と引用根拠](canonical-extractions/)
- [実受領handoffの抽出と同一byte証明](handoff-extractions/)、[局所原文reviewと全claim ledger](blind-raw-checks/)
- [匿名採点](blind-evaluation/)、[全60枠のavailability](evaluation-result/availability.json)、[記録されたFresh agent数](evaluation-result/call-counts.json)
- [匿名化・観測の補足](benchmark-preparation/OBSERVATION.md)、[Stage3分母の補足](benchmark-preparation/downstream-denominators.json)

初回生成前のfinal freezeは `b6d579a4d9c5a90f7e1de84fa2eccd36d0a14a95`。[preflight・準備時点のREADME](https://github.com/mk3008/alder/blob/b6d579a4d9c5a90f7e1de84fa2eccd36d0a14a95/work/rdra-alder-comparison/issue-133/README.md)と固定条件・SHA256SUMSは当時の履歴として参照する。このREADMEの本文は完了後の案内であり、準備時点の履歴本文は上記の固定revisionで保存している。開始後の補足を当初のfreezeに含めたとは扱わない。

## 再現と解釈の境界

RDRAは公式0.8のPrompt/Knowledge本文と18 AI node/6 scriptsのDAGを維持し、AI呼出しだけWork Fresh agentへ置換した。公式ZIP本文は再配布せず、URLとhashから再取得する。native CLI runではない。AlderのAuthoring Skillはrevisionと4fileのhashを固定した。要求設定は全agent共通のgpt-6-sol/medium/fork_turns:noneであり、provider側の独立証明はない。

Stage2は元source+固定回答からFresh再生成し、Stage1 artifact/historyを渡さない。Stage3は最終handoffだけを受け取る。18nodeのRDRA定義までが対象で、後段のRDRASpec/RDRASdd/Code生成は実行していない。RDRA中間成果物一式やQA Skillを渡す追加armは試していない。C5実装/DB試験は行わずimplementation viabilityはnot_executed。

実際のwrapper許可は同一でなく、RDRAはown output検証readを許可し、Alderはinput-onlyだった。厳密条件による有効資料と、自己生成output検証read/非存在path試行だけのsource-clean探索資料を分ける。後者は開始後の追加分類で、共有FSと自己申告traceの限界を伴う。guard無効を業務品質の0点へ変換しない。

匿名抽出のJSONから根拠ID・引用・行番号でrawへ遡れる。mappingは第三者監査のため保存し、抽出者・採点者・probeには渡さない。形式からarmを推測できるsingle-blindの限界がある。同じ要求モデルによるFresh AI評価であり、人間/外部第三者の独立評価とは呼ばない。

5ケース・2反復の記述的pilot。RDRA18calls対Alder1callというworkflow bundleの比較で、計算量を揃えた単一Prompt比較ではない。出力量を品質点にせず、一般優位や総合勝敗を主張しない。
