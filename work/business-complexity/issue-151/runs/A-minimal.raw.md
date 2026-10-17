# Alder Optimization Review：業務A

**位置づけ**：読み取り専用の研究レビュー。Alder plugin 0.4.3。凍結Skill／installed plugin commit：`a58c970f3a78ac9a0ba91be3c6bfb05e4e2b1168`。同梱authorityの出典revision：`9d67d886de8317ad4d884ba8e06c356b44370c9a`、`docs/optimization-review.md`のdigest：`76f9dd4fd58629e689fadc8edbbdbeda5b975197758b410c44e953795b0c657f`。対象の研究入力packet revision：`beea72b8eb9954ad37a2c7c5b4c89946700705e7`。これは現場で合意済みのBusiness Designではない。

**現行業務とProblem**：聴聞担当が資料の受領処理を行い、画像化作業へ受け渡す。担当職員の対応可能状況への依存によって、受領から画像化への資料準備に待ちが生じている、という追加入力をProblemとする。Painは研究用のprompt-only入力でMediumであり、現場の測定・承認値ではない。待ちが受領処理中と受渡し後のどちらで、誰に、どれだけ発生するかは未提示。以下の効果はいずれも期待であり、観測された改善ではない。

## Optimization Candidate 1：受領・画像化の受渡し時機を合わせ、空き待ちを減らす

聴聞担当による受領処理と画像化への受渡しという既存の接点について、対応可能な時機の共有と受渡しの取り決めを検討する。受領や画像化に伴う判断・責任はそれぞれの担当に残す。

1. **Candidate**：受領処理と画像化への受渡しの時機を、関係者が確認できる形で合わせる。具体的な連絡手段や頻度は未決定。
2. **Relation to the Problem**：対応可能状況が分からないこと、または対応時機が合わないことが待ちの一因なら、その部分を減らせる可能性がある。職員の総対応能力が不足している場合、待ちそのものは解消しない。
3. **Approach**：Simplify。既存の受渡しの調整方法を見直す。新たな画像化能力があるとは仮定しない。
4. **Scope and reason**：Keep。対象は既存の資料受領と画像化への受渡しであり、聴聞判断や裁定には広げない。
5. **Expected benefit**：受渡し時機の不一致から生じる待ちが減り、資料準備の進行を見通しやすくなる可能性。
6. **Difficulty and basis**：低〜中程度の仮見積り。受領担当と画像化側の調整が必要。画像化側の正式な役割、工程順序、利用できる連絡手段が不明なため確定できない。
7. **Affected parties / affected business**：聴聞担当、画像化を担当する側、聴聞用資料の準備。
8. **Existing Business meaning and constraints to preserve**：聴聞に使う情報と証拠開示資料を適切に受領して画像化作業へ渡す。聴聞内容の判断・裁定には踏み込まない。未提示の承認権限、期限、アクセス権を変更済みとみなさない。
9. **Assumptions / Unknowns**：待ちの原因に時機の不一致や可視性不足が含まれるか不明。職員の対応能力、画像化側の工程・制約、現行の受渡し方法も不明。
10. **Questions people must decide or verify**：待ちは受領処理前、受渡し時、画像化着手前のどこで発生し、誰が待つのか。対応可能状況の共有や時機の調整で減る待ちか。必要な情報を誰が安全に共有できるか。
11. **Confidence**：低〜中。既存の受渡しと職員の対応可能状況への依存は入力に明記されるが、遅延の内訳とこの方法の効き方は未検証。

## Optimization Candidate 2：受領処理の代替対応を定め、特定職員の不在待ちを減らす

受領処理が担当職員の対応可能状況に依存する接点について、権限と資料アクセスが許す場合に限り、別の認められた担当者が受領処理を引き受ける運用を検討する。画像化への受渡しと、聴聞に必要な資料の意味は保つ。

1. **Candidate**：受領担当が対応できない場合の代替対応者と引継ぎ条件を定める案。現に代替担当者が存在するとは主張しない。
2. **Relation to the Problem**：特定職員が対応可能になるまで受領処理が止まることが主因なら、待ちを減らす可能性がある。画像化側の容量不足には効かない。
3. **Approach**：Delegate。現在の担当から、条件を満たす代替担当へ受領処理の責任を移せるか検討する。既に委任済みとは扱わない。
4. **Scope and reason**：Keep。受領処理内の責任分担を対象とし、聴聞の判断や画像化以外の全工程へは広げない。
5. **Expected benefit**：特定職員の対応可能状況に起因する停止時間が減る可能性。
6. **Difficulty and basis**：中〜高程度の仮見積り。受領権限、資料アクセス、引継ぎ、職員間の責任分担の確認が必要。これらの実態が未提示のため実行可能性は判断できない。
7. **Affected parties / affected business**：聴聞担当、仮に設ける代替対応者、画像化側、聴聞用資料の準備。
8. **Existing Business meaning and constraints to preserve**：聴聞担当による受領処理と画像化への受渡しという目的・責任の連続性を保つ。代替者に未確認の承認・閲覧権限を与えない。聴聞の判断内容は変更しない。
9. **Assumptions / Unknowns**：適格な代替者と権限設定が存在または設定可能か、待ちが特定職員への集中から生じているか、引継ぎに必要な情報と負荷が不明。
10. **Questions people must decide or verify**：受領処理のうち代替可能な作業と、聴聞担当に残すべき判断は何か。誰が受領と証拠開示資料へのアクセスを許されるか。代替対応で待ちが減るだけの対応余力があるか。
11. **Confidence**：低。可用性への依存は明記されるが、代替可能性、権限、容量は未確認。

**探索の境界**：受領と画像化への受渡しは区別して捉えられるが、どちらの対応可能状況が待ちを支配するかは不明。したがって画像化の自動化、外部委託、工程統合を実行可能な候補とはしない。画像化以外の手順・権限・期限を創作して探索を広げない。資料にない別の事業モデルをExtreme perspectiveとして作らない。

**採否・確認待ち**：両候補とも未採用。責任ある業務関係者は、待ちの発生箇所と原因、受領・画像化各側の権限と余力を確認したうえで、各候補を採用・修正・保留・却下のいずれにするか判断してください。採用する場合も、変更後の業務上の意味と責任を確認し、Business Designを合意し直すことが先決。ここでは業務変更も入力・Skillファイルの変更も行っていない。

**読んだ相対パス**：`AGENTS.md`、`plugins/alder/skills/alder-optimize-business/SKILL.md`、`plugins/alder/skills/alder-optimize-business/references/optimization-review.md`、`plugins/alder/skills/alder-optimize-business/references/provenance.json`、`work/business-complexity/issue-151/inputs/A-workflow.md`、`work/business-complexity/issue-151/inputs/A-minimal.md`、`work/business-complexity/issue-151/prompts/A-minimal.txt`。

**残る未知**：待ちの場所・時間・頻度・被影響者、画像化側の正式な役割と工程順序、受渡し方法、双方の対応余力、代替対応者の有無と権限、資料アクセス権、承認権限、法定期限。実効モデル設定は独立確認していない。この事例を以前から知っていたとの認識はない。
