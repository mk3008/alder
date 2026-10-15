## H ラベル補正

**H5 — Inconclusive** と判定する。初回評価の **H3 は撤回**する。初回は H1〜H5 の定義が許可資料に欠けていたため、「構造を発見したが人間が拒否した」という結果類型に H3 を独自に割り当ててしまった。追加された Issue 事前定義では、H3 は「Authoring または通常 Optimization だけで Oracle が十分表面化し、独立 Discovery の追加価値が薄い」を意味する。

今回、Authoring は変換構造を**現行事実として記述**したが、再検討機会としては評価していない。K は Oracle に対応する Problem を**入力で与えられて**候補に到達した。したがって、この二つから H3 の「Discovery 不要」は示せない。一方、U1 は Oracle 構造を発見したものの、顧客が改善対象と認めず、事前 gate に従って U3 は未実行となった。H1 に必要な「人間確認後に通常 Optimization へ進み、K と収束する」連鎖も観測できない。H2 の Known Problem でも Discovery が必要という証拠はなく、H4 に当たる重大な false positive や意味の毀損も見られない。この比較で二入口の必要性を識別できないため、H5 が最も合う。

**A〜F の事実認定と根拠は初回評価のまま保持する。** 特に B の構造発見、D の K が仮定的 Problem に依存する点、E の U3 との収束は比較不能という点、F の専用経路の必要性は立証されないという点は、このラベル補正と整合する。

読取パス（基点 `/workspace/scratch/97b524818cca/alder105`）：`work/optimization-comparison/issue-105/` の `evaluator-addendum-prompt.md`、`hypotheses-from-issue.md`、`evaluation-initial-raw.md`、`protocol.md`、`oracle-revealed.md`、`authoring/design.md`、`phase2/{known-problem,human-confirmation-raw,u3-not-run}.md`、`runs/{k-raw,u1-raw}.md`、および Git 履歴 `d158df8`、`d8fb8a1`、`8ee39e3`。事前定義の転記は `d8fb8a1` で初回評価固定 `8ee39e3` より前に追加されたが、Oracle 開示 `d158df8` より後である。元 Issue 本文との逐語的一致はこの読取だけでは独立検証していない。ファイル変更なし。
