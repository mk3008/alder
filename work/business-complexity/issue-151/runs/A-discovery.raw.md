# Alder Structural Discovery：業務A（読み取り専用）

## 入力と前提

- Alder plugin 0.4.3。凍結Skill revision：`a58c970f3a78ac9a0ba91be3c6bfb05e4e2b1168`。同梱authorityのprovenanceに記されたAlder source revision：`a971d60bb64fbc048a871d70dda277c93b680288`。
- 入力packet revision：`beea72b8eb9954ad37a2c7c5b4c89946700705e7`。
- 読んだ相対パス：`AGENTS.md`、`plugins/alder/skills/alder-discover-business-questions/SKILL.md`、`plugins/alder/skills/alder-discover-business-questions/references/optimization-review.md`、`plugins/alder/skills/alder-discover-business-questions/references/provenance.json`、`work/business-complexity/issue-151/inputs/A-workflow.md`。加えて実行指示として`work/business-complexity/issue-151/prompts/A-discovery.txt`を読んだ。外部検索および他資料の閲覧はしていない。
- 入力は公開の実施報告から再構成された歴史的な改善前業務であり、現場の関係者が合意した現行Business Designではない。以下は、この研究入力に明記された関係に限る問いであり、現在の運用で問題が生じているという判定ではない。実効モデル設定を独立に確認していない。

## 根拠のある問い

### 1. 受領処理から画像化作業への受渡し

- **Structural Observation：** 聴聞担当による資料の受領処理と、資料の画像化作業との間に受渡しがある。
- **Evidence：** `A-workflow.md`の「役割・情報・つながり」に、聴聞担当が受領処理を行い、画像化する作業への受渡しがあると記される。扱うものは聴聞に使う情報と証拠開示資料である。
- **Why it may matter：** 受渡しで何を誰が引き継ぐのかを明らかにすると、この接点を見直す必要があるかを判断できる可能性がある。受渡し自体を負担、遅延、重複と見なす根拠はない。
- **Unknowns：** 画像化側の正式な部署・役職、受渡しの具体的な内容と条件、全工程順序、受領と画像化で保つべき確認の目的は未提示。
- **Question：** 当時の受領処理から画像化作業への受渡しでは、誰が何をどの条件で引き継ぎ、それぞれどの目的の確認を担っていたか。現在の業務を検討対象にするなら、その関係は今も成り立つか。

### 2. 処理の進行と担当職員の対応可能性

- **Structural Observation：** 処理の進行は、担当職員が対応可能かどうかに依存する。
- **Evidence：** `A-workflow.md`の「役割・情報・つながり」にこの依存関係が明記される。
- **Why it may matter：** どの処理で、いつ、どの担当職員の対応が必要かを確かめると、この依存関係が見直し対象かどうかを判断できる可能性がある。待ち時間や支障が現にあるとは言えない。
- **Unknowns：** 依存する具体的な処理・時点・頻度、代替担当の有無、対応可能性の制約、権限や期限、実際の影響は未提示。
- **Question：** どの処理の進行が、どの担当職員の、いつの対応可能性に依存していたか。その依存が実際に支障を生んでいたか、現場の事例や記録で確認できるか。

## 確認待ち・採否

上記2件は調査する問いであり、Problem、Pain、改善案、採用済み変更ではない。いずれも採否は未判断で、現場が却下・保留できる。現行業務に適用する前に、責任者・実務者が、入力の関係が現在のBusiness Designを忠実に表すかを確認する必要がある。運用上の具体的なProblemとPain levelが確認されるまでOptimization Reviewには進まない。業務変更やファイル変更は行っていない。

## 残る未知と記憶について

画像化側の正式な役割、工程全体の順序、受渡しの詳細、担当職員の対応可能性が影響する具体的な工程、目的の異なる確認、承認権限、法定期限、情報アクセス権、処理量、実際の支障とPain levelは不明である。未記載を欠陥や既定規則とは断定しない。この事例を以前から知っていたと自覚できる材料はない。ただし、過去に類似内容へ接していないことまで独立には証明できない。
