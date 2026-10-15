# Issue #102 実行記録

- `protocol.md` と4入力を commit `03cda87` で固定した後、各ケースに独立した Skill コピーと `notes.md`、`AGENTS.md` を置いた。
- 4つの Fresh Agent に、ケースごとの `notes.md` から Alder 業務設計書を作る依頼を渡した。requested model は `gpt-6-sol`、effort は `medium`、`fork_turns` は `none`。各作業場所は `/workspace/scratch/99d5915a6094/validation-102/caseN`。実際の作業場所への到達可能性や自己申告の読み込み記録だけで隔離は証明できない。
- `response.md` および `response-v1.md` は最初の依頼者向け回答。ケース2と4には protocol の固定顧客回答を一度だけ送り、同じ Skill と既存草案の更新を依頼した。`response-v2.md` は更新後の実際の依頼者向け回答。
- ケース2、4の初稿はその場で独立ファイル保存されず、更新前後の差分と更新後の草案から `draft-v1-reconstructed.md` を逆パッチで復元した。これらは**復元物**であり、一次 raw と区別する。差分と回答文は agent が保存したままの内容。
- `sha256.json` はコピー後の各ファイルのハッシュ。`skills/` は固定 revision の重複コピーのため含めない。Agent 出力中の sandbox リンクは当時の別作業場所を指す。
