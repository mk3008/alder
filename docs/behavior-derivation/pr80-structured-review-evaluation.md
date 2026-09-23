# PR #80: 業務相関・考慮漏れレビューの構造利用試行

## 条件と結果

対象の変更前Business Designは `b0d6d69a01d280b446e3f68a51dccc2d5510480b:business-design/alder/README.md`。baselineと候補は別々の履歴なしFreshコンテキストで同じ原文を読み、要求モデル `gpt-6-sol`、effort `medium`。実ランタイムの独立した証明はない。候補だけが[六つの試行観点](../business-design-structured-review-trial.md)を追加で読む。これは指示量と参照資料も変わる探索比較であり、因果効果・発見率の実験ではない。

| 観察 | baseline | 候補 | 判定 |
| --- | --- | --- | --- |
| 更新時の業務設計書Input不足 | 報告なし | BD-01 | 既存のI/O↔Procedureでも検出可能。候補で顕在化したが新知識固有ではない |
| 更新時の検査項目Input不足 | 報告なし | BD-02 | 同上。妥当な明確化 |
| 実装からの例外復帰後のCheck再確認 | 報告なし | BD-03 | 既存原則でも検出可能。共通の追跡手順が既に再導出と確認を定めるため、この設計だけに新たな工程を設ける根拠は弱い |
| 合意済み期待結果に検証不足がある場合の引き渡し | FC-01（条件付き、未承認） | 報告なし | baseline固有。実際の不足と引き渡し場面が具体化したら、範囲・引受者を人間に確認する。現時点で一律の停止／許可を決めない |
| 候補ルールだけで見つかった確定指摘 | － | 0件 | 一般的なレビュー性能向上は主張できない |

別途、編集担当が原文・既存契約を読み直し、`同期漏れ検査` のTest内容のInput欠落（旧385–396行）と `業務グラフ出力` のInformation抽出対象の明記不足（旧433–439行）を確認した。前者は既存の双方向照合で検出可能で、先行した `gpt-6-astra` 試行でも指摘された。後者は新構造を意識して見つけた記述改善だが、正式な同条件のsol候補出力に含まれないので、新規検出件数へ加算しない。先行astraのbaselineおよび中断したastra候補はユーザーのモデル指定前の探索であり、このsol比較には含めない。

## 原文への反映と判断境界

- `業務設計` は更新時の現行業務設計書をInputで受け、Procedureで現行の要件・期待結果・未決事項を確認することを明示。
- `検査項目の設計` は更新時の既存CheckをInputで受け、ID・レビュー状態・追跡関係を確認。初版には既存成果物を要求しない。
- 任意の `同期漏れ検査` は変更Checkと照合するTestの期待結果・アサーションをInputに追加。単なるTest IDと意味の照合を区別。
- 任意の `業務グラフ出力` は原文Object.Informationを順序付きで抽出することをInputとProcedureに明記。既存JSON契約・実装の変更ではない。
- 検証不足のある確定Checkをどの範囲で引き渡せるかは、この自己適用例だけで実在条件と結果を確定できない。将来の具体例では依頼者・責任者へ問いを戻す。未承認候補から業務上の必須ゲートを作らない。

今回の[構造を使う六観点](../business-design-structured-review-trial.md)は**PR #80の試行候補**として保存し、汎用のレビュー知識v0.3や既存の任意探索へは恒久化しない。既存原則の適用と候補ガイドによる指摘が重なり、片方にだけ出た論点もある。単一の自己適用、各条件1回、非盲検、資料・指示量の差、実行時のばらつきにより、検出率・再現性・誤検知率の優位は不明。既存の研究結果は改変しない。別の実Business Designで、同じモデル設定と凍結入力、基準を事前に揃え、新規の有用指摘と過剰指摘を比較した後に採否を再検討する。

## 再レビュー

変更後に六Activity・十三Objectを、記述品質→既存相関→任意の考慮漏れ→試行構造観点の順に読み直した。業務設計の合意ResultとCheck設計のWhen、Checkの引き渡しResultと実装依頼、システム設計と実装の技術条件、例外の発生先と業務設計の二つのException Whenは整合。任意の診断とgraph出力は通常経路の必須工程にならない。InputとOutputを同じObjectに持つ更新業務は情報契約として読める。全十三ObjectのInformationは既存JSONへ投影され、相関のラベルとProcedureに必要な概念の矛盾を確認しなかった。`scope:false` の内部の検証・Alder保守を追加していない。実装中の業務意味の未決は業務設計へ戻り、[追跡手順](../check-item-traceability.md#1-business-design-is-the-ssot)に従い影響Checkを更新してから後続へ進む。

グラフの機械検証は構文・接続・再生成の一致だけを証明する。業務意味の合意、具体的な検証不足の扱い、任意探索の網羅性は証明しない。

## 指示全文（変更前の固定入力）

### baseline — `/root/pr80_baseline_sol`

モデル `gpt-6-sol`、effort `medium`、`fork_turns: none`。以下が送信した全文。

```text
Read-only baseline review of PR #80 Business Design at commit b0d6d69a01d280b446e3f68a51dccc2d5510480b in /workspace/scratch/64196363f679/alder. Read business-design/alder/README.md in full, docs/adoption.md section 'Authoring and checking business correlations' (existing/current principles only), docs/behavior-derivation/functional-considerations.md in full, and existing decisions/Scope referenced by the design as needed. First apply ONLY current business-correlation guidance to assess whether work and handoffs can run; then apply ONLY existing optional functional-consideration discovery to find concrete unresolved result differences. Do not use or devise new checks based specifically on Result↔When, Object.Information↔I/O, or other newly explicit fields; do not read subsequent candidate-review files or this thread's proposed improvements. Do not edit files, post comments, or change repo state. Return a Japanese structured report with findings IDs, exact source line numbers and evidence, whether existing knowledge detects each issue, candidate vs established inconsistency, proposed clarification (not a business decision), dismissed/false-positive ideas with reasons, and limitations. Model gpt-6-sol; reasoning effort medium. Exact prompt text is this message, to be recorded in the evaluation.
```

### candidate — `/root/pr80_candidate_sol`

モデル `gpt-6-sol`、effort `medium`、`fork_turns: none`。以下が送信した全文。

```text
Read-only candidate review of PR #80 Business Design at commit b0d6d69a01d280b446e3f68a51dccc2d5510480b in /workspace/scratch/64196363f679/alder. Read business-design/alder/README.md in full, docs/adoption.md section 'Authoring and checking business correlations', docs/behavior-derivation/functional-considerations.md in full, and the NEW TRIAL guide docs/business-design-structured-review-trial.md in full. Read existing decisions/Scope referenced by the design as needed. Apply baseline current principles and optional functional-consideration discovery, and then trial the six structured checks in the new guide. Do not read any evaluation document or baseline agent's output, and do not inspect later edits to Business Design; pin source design with `git show b0d6d69a01d280b446e3f68a51dccc2d5510480b:business-design/alder/README.md` if working tree differs. Do not edit files, post comments, or change repo state. Return a Japanese structured report with finding IDs, exact source line numbers and evidence, detection under existing knowledge vs only trial guide, concrete impact, proposed clarification (no invented business policy), dismissed/false-positive ideas with reasons, and limitations. Model gpt-6-sol; reasoning effort medium. Exact prompt text is this message, to be recorded in the evaluation.
```

## 後続の人間レビューによる標準業務境界の修正

[後続の依頼者コメント](https://github.com/mk3008/alder/pull/80#issuecomment-5787725995)は、JSON生成を業務そのものではなく、外部ツールで設計・レビューを助けるための任意の中間投影と位置づけた。これは上記の凍結入力を使った比較結果を変更するものではない。比較時に修正した業務設計書・既存検査項目・Test内容の三つのInputは維持し、標準Business Designからグラフ出力ActivityとJSON Objectを削除した。CLIのInformation投影・検証契約と、このリポジトリにcommitする回帰fixtureは保持した。commitされたprojectionの再生成不一致は決定的生成物の古さであり、Business Design ↔ Check ↔ Testの意味的同期漏れとは別に扱う。

FC-01の発端となった「検証不足」は、Check期待結果への人間の合意とは独立したTestによる検証根拠の不足と明記した。設計時のCheck Outputからは外し、同じCheck Objectには実装後フォローアップで維持する情報概念として残した。新規Testと根拠が揃うことを引き渡しの必須条件にしない。実際に既知の不足を伴う引き渡しで結果差が問題になれば、具体的な範囲・責任を人間に確認するという未承認候補の位置づけは維持する。一般的な許可・禁止は決めない。

記述品質→業務相関→任意の考慮漏れの順に、修正後の五Activity・十二Objectを再読した。業務設計の合意ResultからCheck設計When、確認済みCheckから隣接実装のInput/When、システム設計の技術条件から実装、実装・Check設計の二つの例外復帰と既存追跡手順はつながる。更新時の現行成果物Inputと任意の同期漏れ検査のTest内容Inputも残る。Check Outputは合意した期待結果・状態・Business Design対応だけを渡し、後続Test根拠を設計時点で確定したかのように読ませない。Scope外の実装内部、Test実行、実装後フォローアップ、外部ツールの操作を標準Activityに追加していない。新しい機能条件や必須ゲートに相当する指摘は残さなかった。この再読は人間による業務意味の承認ではない。
