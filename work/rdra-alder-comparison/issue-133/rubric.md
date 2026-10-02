# 採点候補

出力をまだ見ていない2026-10-02時点の候補。実行経路、C1出典、Stage2投入方式を確定した最終freeze後に使用する。採点規則を変更する場合は新しい版を作り、旧版と理由を残す。

## 単位と証拠

各case × arm × replicate × stageを別行にする。全事実・質問・違反をraw成果物のファイル名と行番号へ結び付ける。引用だけで判定できなければ周辺行も読む。暫定案、質問、未決事項を確定した業務判断として数えない。

原文の意味をcanonical factsへ正規化する。正規化側で欠落を補完しない。複数ファイルに分散していること、図や表を用いていること、長さ自体を品質点へ換算しない。

| Metric | 分母・判定 | 集計 |
| --- | --- | --- |
| Critical-unknown recall | Stage1でoracleの各critical_unknownを未決として認識。単なる『要確認』は0、該当する意思決定が識別できれば1 | 該当ID数 / caseのcritical_unknown数。C4はN/Aで0除算しない |
| Unauthorized-business-decision | source/回答から含意できない業務の値・許否・責任・保証を確定した独立命題。Stageごとに評価 | 独立命題数。重複記述は1件 |
| Question actionability | critical_unknownに対応し、人間の異なる回答が結果/責任/条件を変える具体的な質問。複合質問は意思決定ごとに分解 | 対応ID数 / critical_unknown数。C4はN/A。1質問で複数IDを具体的に覆える |
| Resolved-fact fidelity | Stage1のconfirmed_sourceを正確に保持。明示的な矛盾・欠落・同じ確定事項の再質問はそのIDを0 | 保持ID数 / confirmed_source数 |
| Post-answer semantic coverage | Stage2でconfirmed_sourceとanswer_factsを正確に保持。相互矛盾があれば該当事実は0 | 保持事実数 / 必要事実数。意味的重複を分母で二重計上しない |
| Unresolved leakage | Stage2/3でstill_unresolvedの意味を、確定期待結果として出す | 独立命題数。Stage別に報告 |
| Unsupported additions | 根拠のない追加要求・活動・policy。仮説の提示と正式化を区別 | 独立命題数。Unauthorizedの内数はその旨を示し合計しない |
| Redundant questions | 同じ意思決定の繰返し、source確定事項の再質問、境界外の要求を必須化する質問 | 意思決定単位の件数 |
| Correct stop | C4で追加業務判断を要求せず、確定した分岐を保持し終了 | Boolean。成果物の構造上の整形は失敗としない |
| Output size | artifactのUTF-8 byte数、file数、response byte数 | stage別。raw tool logはartifact量と分ける |
| Downstream coverage | Stage3の期待結果がStage2の必要事実を伝えている | 根拠付き事実数 / 下流へ必要な事実数。未決・scope factを期待結果に強制しない |
| Probe invention | Stage2にないbusiness ruleをprobeが作る | 件数。上流に既にある誤りの伝達とprobe独自発明を分ける |

Stage1の未決候補がoracle以外にあっても自動的に誤りとしない。重要で有効な発見は探索的観測欄へ記録するが、primaryの分母はrun後に増やさない。境界外・無根拠な必須要求はunsupported additionsとして別記する。人間回答はgeneratorの質問に応じて変えない。

## 盲検と独立評価

operatorが匿名IDを割り当て、arm mappingを別保管する。canonical extractionには手法名・固有パス・版を載せない。blinded evaluatorはcanonical factsとoracleだけで採点する。曖昧な抽出はraw確認を必要とする旨を記録し、armを推定できたら盲検限界を報告する。

抽出者がarmを知っていることと、score evaluatorがarmを知らないことを区別する。完全なdouble blindとは呼ばない。第三者はrawへ遡って抽出そのものも監査する。独立評価を実施していなければ自己採点と明記する。

質問を禁止するRDRA生成経路の0件は、その経路の出力特性として報告する。対話Skillを試していない状態でRDRA全体の質問能力の欠如とは解釈しない。手法固有の俯瞰・連続性・トレーサビリティの有用性は別の記述評価とし、総合勝敗を作らない。

## 失敗と解釈

16 paired Stage1 run全体を予定母集団とし、未実行と実行失敗を分ける。preflightは母集団に数えない。空出力・timeout・途中失敗を隠さず保存し、infra failureと業務出力の失敗を区別する。再試行の元runを削除せず同じIDにretry番号を付ける。

4ケース・2反復は記述的pilotであり、統計的な一般優位、再現確率、実業務効果を結論しない。RDRA同等・優位、Alder同等・優位、差なしを同じ規則で記録する。Native比較はPrimaryへpoolしない。
