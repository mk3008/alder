# Issue #105 独立評価

**結論：U1 は Oracle に対応する構造を発見したが、合成顧客はそれを改善対象と認めなかった。事前 gate に従って U3 を実行しなかった判断は妥当である。** K の候補は、顧客が最初から Problem を認識した場合の条件付き結果であり、実際の採用判断ではない。

## 固定と順序

`oracle-revealed.md` の SHA-256 は `652b181e…f6dc126b8ae`、`known-problem.md` は `f34d7db8…b9f06` で、`sealed-commitments.sha256` の事前値にそれぞれ一致した。Git 履歴でも、commitment `6ca2887` → Authoring 最終確認 `0c59962` → gate と入力固定 `73f13c2` → K/U1 raw 固定 `b14d29a` → 人間判断と U3 不実行の固定 `00e64b3` → Oracle 開示 `d158df8` の順である。各 raw の現行 hash も `phase2/first-runs.sha256`、人間判断の hash も `phase2/human.sha256` と一致した。これはリポジトリ上の固定順序と内容の検証であり、実効モデル設定、許可外資料の未閲覧、真の Fresh 独立性までは証明しない。

## A〜F の判定

| 観点 | 判定と根拠 |
|---|---|
| **A Authoring / Discovery 境界** | **成立。** 初回依頼は現行業務の記述を求め、改善評価を求めていない。Designer は追加質問と修正を経て、役割別判定、A/B/C への変換と逆変換、変更・欠席時の責任、異なる目的の確認を記述した。初回の「調整結果の記録」「旧判定の判定前参照」という未確認断定は顧客の指摘で修正され、最終顧客確認と独立 gate は pass した。設計書には当該構造が事実として存在する一方、それを非効率・重複・不要という Problem にする先出しはない。未確認問題や評価語がないこと自体を、実証された痛みとは数えない。 |
| **B Unknown recall** | **構造について成功、Problem 確認について不成立。** U1 Observation 1 は、役割可否→月次 A/B/C→当日の可否という Oracle の横断構造を、複数 Activity と情報の引き継ぎに即して特定した。区分の用途を認め、負担・誤読を未知として分けている。Observation 2 は両予定表の連動という別の仮説で、Oracle の中心的対象ではない。 |
| **C false positive / benign control** | **重大な誤統合なし。** U1 と K は研修時の能力判定と当日の現物確認を統合せず、役割ごとの判定も保持した。独立した案内表示確認を配置の Problem にしなかった。U1 Observation 2 は既存の正常な両表反映を改善機会として挙げるため弱い仮説だが、未確認事項と人間への問いに留め、失敗や損失とは断定していない。顧客は保留した。 |
| **D Problem normalization integrity** | **仮定付きで限定的。** `known-problem.md` は Oracle の変換・再構成を具体的な検討対象として与えるが、測定された手間や失敗を述べない。K は暫定 Medium、未測定と明記して候補を出した。ただし既存 guidance は実際に経験された具体的 Problem を入力に求める。この合成顧客はその Problem を拒否したため、K を現実の適格な Optimization Review として扱えない。 |
| **E optimization convergence** | **条件付きの論点収束のみ確認。** K の二案は資格可否の受け渡しを、活動予定表に保持する案と研修記録を共通参照する案として検討し、当日判断と判定権限を保持した。U1 の中心 Observation と同じ構造に向かう。ただし U3 は事前 gate により存在せず、U1→顧客承認→Optimization の経路との出力収束や改善効果は比較不能。候補 1 は区分の人数編成上の実用途を残す必要があり、実際の負担がないなら便益は成立しない。 |
| **F two-entry-route necessity** | **この事例では必要性を立証しない。** Known Problem が人間から与えられたという仮定では K が有用な検討案を作る。一方 U1 は Problem なしでも構造を見つけたが、人間が改善対象を拒否し U3 は起動しない。二入口の機能上の違いは見えるが、専用 Structural Optimization を追加しなければならない、または両入口が常に必要、という結論は出ない。 |

U3 の起動条件を「Oracle に対応する Observation が出るだけ」で済ませず、**顧客による改善対象としての確認**まで要求した事前 gate を守っている。Observation 1 に対する顧客の「現状維持の理由があり Problem としない」、Observation 2 の「追加事実が必要で保留」は `human-confirmation-raw.md` で固定され、後から Known Problem を渡して拒否を上書きしていない。

**H 判定：H3（構造は発見したが人間が Problem と認めず、U3 は未実行、という結果類型）**。ただし許可資料内には H1〜H5 の記号の定義が見当たらず、この番号との正式な対応は検証できない。厳密に確定できるのは括弧内の結果類型である。専用 Structural Optimization の必要性は、この結果だけでは支持されない。単一の合成事例、一回ずつの raw、測定された痛みや改善結果の欠如により、未知問題の一般的発見率、false positive 率、候補品質や費用対効果には一般化できない。

**読取パス**（基点 `/workspace/scratch/97b524818cca/alder105`）：`work/optimization-comparison/issue-105/` の `evaluator-prompt.md`、`protocol.md`、`scenario/{initial-brief,customer-role}.md`、`sealed-commitments.sha256`、`oracle-revealed.md`、`authoring/{design,customer-initial-raw,customer-followup-raw,customer-confirmation-v1-raw,customer-final-raw,gate-evaluator-prompt,gate-evaluation-raw,design-final.sha256}.md`（hash ファイルは該当拡張子）、`phase2/{known-problem,human-confirmation-prompt,human-confirmation-raw,u3-not-run}.md` と各 `.sha256`、`runs/{optimization-input,u1-prompt,k-raw,u1-raw}.md`、`docs/optimization-review.md`、同リポジトリの上記 Git commit 履歴。ファイル変更なし。
