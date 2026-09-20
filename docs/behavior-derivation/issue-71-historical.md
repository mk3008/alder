# Issue #71 — Velvet historical backtestと採用判断

[追加コメント](https://github.com/mk3008/alder/pull/72#issuecomment-5746635060)に従い、後のDecisionを知らないFresh Agentへ過去2時点の設計を渡した。**当時未決で、後に人間が判断しDecisionになった結果境界を1件確認した。考慮漏れ検証をAlderの任意工程として正式採用する方向へ変更する。** 全案件の必須ゲート、網羅性保証、promptの因果効果の証明にはしない。

## 固定した試行

| 試行 | Velvet入力版 / UTC | 選定理由 | 結果 |
| --- | --- | --- | --- |
| H1 | `ccc1edc8547aac1a36777d158639d7d7c20db113` / 2026-09-12 04:48:55 | 初期実行とDecision0002より前 | B=1、C=1 |
| H2 | `43c8e57d6d7e8fe67433d8aa0f8ce48232f03999` / 2026-09-13 11:16:19 | 実行戦略Decision0009/0010より前 | A=2 |

各時点1回、生成担当は `/root/history_h1` と `/root/history_h2`、ともに `fork_turns=none`。要求モデル `gpt-6-astra`、effortは省略して継承、実ランタイム値の独立証明なし。評価担当は履歴を知る `/root`。一般知識は許可し、Webを含む入力外の参照は禁止。read logは各6ファイルの全文読了と入力外参照なしを報告する。共有filesystem上のallowlist指示であり、OS権限による隔離ではない。

入力は当該版のScope、Transfer Execution Process、対応DFD、全16 defined ConceptのdefinitionとexternalRelationships、最小共通契約、変更していない探索prompt。H1では当時のSQL実行許可に関する共通契約も含めた。reviewState、既存Check、実装、テスト、レビュー・議論、後のDecision、評価目標や具体例は生成側に渡していない。入力/基準を固定してから生成し、フィードバック・再生成・成功に合わせた時点の差し替えはしていない。

## 4候補すべての評価

| 原本ID | 候補 | 判定 |
| --- | --- | --- |
| H1-01 | 赤伝が成功し新黒が失敗した場合、取消だけを残すか | **B: 後の重要Decisionの先取り**。当時は成功時の順序/不変条件だけで失敗結果を選べず、後のIssue5/Decision0003で一括rollbackを明示 |
| H1-02 | 引数で限定した実行で、範囲外のDirty Keyも不存在判定へ渡すか | **C: 条件付きの有用な未決候補**。後の人間判断との直接対応は未確認。採用条件の加点なし |
| H2-C01 | 複数キー・Linkの途中失敗でどの成功分を残すか | **A: 当時既決**。Decision0002/0008の全work原子性で閉じる |
| H2-C02 | 異なるsource keyの現在値もRun内で同じ時点にそろえるか | **A: 当時既決**。Decision0002の完全なsource queryを一度評価する契約で閉じる |

合計A=2、B=1、C=1、D=0、E=0。分類定義と全候補の当時/後続資料への対応は[別担当評価](../../work/behavior-derivation/issue-71/historical/assessment.md)。H1-01をRun全体・独立キー間の原子性まで当てたとは扱わない。事前目標のうち、Run独立永続化、設定版、蓄積仕事の有限時間内回復は未発見。

[Issue5](https://github.com/mk3008/velvet/issues/5)のRed/Black途中失敗のrollback要求と、[Decision0003の固定版](https://github.com/mk3008/velvet/blob/6739d2d8590f2041372d3e10c2fe938e209f2039/docs/decisions/0003-phase2-immutable-reevaluation.md#L21-L29)に具体的に対応することが採用根拠。単に後の文書に「transaction」という語があるという一致ではない。Issue5は候補評価時に追加照合した後続資料であり、生成前に赤黒の正解例を提示したものではない。

## Alderへの反映

[探索prompt](functional-considerations.md)と[導入ガイド](../adoption.md#optional-explore-undocumented-functional-conditions)を任意の採用工程として整理する。Business Design・業務相関レビューの後、Check導出の前または並行して、具体的な未決結果差を人間へ返す。実運用では現在のDecision・共通契約も必ず照合し、既決の再質問を閉じる。

未承認候補 → 人間判断 → 必要ならBusiness Design更新 → c3 / Atomic Check → Testを維持する。候補の正解をAIが決めず、探索結果を直接Test期待値にしない。今回のC候補をVelvetの新要件や欠陥として登録していない。c3・review knowledge v0.3・製品コードは変更しない。リリース操作は含めない。

[前回Fresh試行](issue-71-fresh-velvet.md)の0件という結果と当時のexperimental判断は維持する。採用判断を変えたのは今回の追加証拠であり、前回を成功へ再分類したためではない。

## 記録と検証

[生成前protocol](../../work/behavior-derivation/issue-71/historical/protocol.md)、[担当・設定・hash](../../work/behavior-derivation/issue-71/historical/run.json)、[評価資料一覧](../../work/behavior-derivation/issue-71/historical/evaluator/evidence.json)を保存。

| 試行 | 入力原本 | 指示 | 出力原本 | read log | 分類 |
| --- | --- | --- | --- | --- | --- |
| H1 | [archive](../../work/behavior-derivation/issue-71/historical/H1/inputs.tar.gz) | [launch](../../work/behavior-derivation/issue-71/historical/H1/launch.txt) | [raw](../../work/behavior-derivation/issue-71/historical/H1/raw.md) | [read log](../../work/behavior-derivation/issue-71/historical/H1/read-log.json) | [evaluation](../../work/behavior-derivation/issue-71/historical/H1/evaluation.json) |
| H2 | [archive](../../work/behavior-derivation/issue-71/historical/H2/inputs.tar.gz) | [launch](../../work/behavior-derivation/issue-71/historical/H2/launch.txt) | [raw](../../work/behavior-derivation/issue-71/historical/H2/raw.md) | [read log](../../work/behavior-derivation/issue-71/historical/H2/read-log.json) | [evaluation](../../work/behavior-derivation/issue-71/historical/H2/evaluation.json) |

`python work/behavior-derivation/issue-71/historical/verify.py --velvet ../velvet`で入力・原本・read log・候補分類と固定版資料を照合する。以前のdiscovery/fresh-velvet verifierも再実行する。試行時のpromptは[原本](../../work/behavior-derivation/issue-71/discovery/prompt.md)へbyte同一で保存した。旧manifestのhashを変更せず、verifierは更新後の運用文書ではなくこの原本を照合する。運用promptの差分は採用状況・根拠リンクのみで、生成に使った探索方法を事後調整していない。

## 限界

時点・評価目標は後続履歴を知る評価者が選定した。同一製品の2回で、promptなし対照・盲検評価・一般的な発見率・人間のレビュー負担は未検証。H1は全Conceptがdefinedだが、別の業務相関に関する過去reviewのopen項目が残っていたため、設計全体がレビュー完了した標本とは主張しない。成功候補はそのopen項目とは異なる。H2のreviewはresolvedだが、Issue20のserverless前提は限定入力に含まれていない。未発見を全条件での能力不足へ一般化しない。

過去の口頭合意や編集前の全Issue本文の不存在は証明できず、未決判定は確認した原典/議論の範囲に限る。テストは後続証拠として読んだもので、本研究では製品テストを実行していない。機械的整合確認を意味の正しさ・人間承認へすり替えない。
