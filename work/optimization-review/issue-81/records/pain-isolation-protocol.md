# PR #82 Pain単独比較 — 出力確認前の固定条件

対象: PR #82 コメント `5794509548`。備品購入申請 main `5405a5069fc13e1a1e27de8b06e4a375a3653e5e`、入力SHA-256 `2692b564fd44eb64005f6d595008afdf3ec62660ba81bfa99f6c90165c518fdc`。

- 固定Problem: 「承認済みの購入申請について、購買担当者が申請ごとに購入を行い、その結果を登録している。」強度や困り度をProblemに含めない。
- H1/H2: Pain level High。L1/L2: Pain level Low。各2独立Fresh Agentを `gpt-6-sol` / `medium` / `fork_turns: none` で要求する。入力は同一のBusiness Designコピーと元PoCの共通指示。Conditionと入出力パス以外の指示は変えない。結果を見てrun数やpromptを変えない。
- 生成側に会話履歴、他runの出力、旧結果、評価資料を渡さない。無修正出力・read log・完全な起動指示・要求設定・入力と出力のhashを保存する。実効モデル/effortを独立確認できなければその旨を記録する。
- 評価者は生成者と別の親担当。各runについて (1) 実質的に新しい業務改善案の数（設計済み手順の言い換えは除外）、(2) Scope / Difficultyと影響先、(3) 高難度の調査継続・見送りの理由、(4) ConfidenceとUnknownsの扱い、(5) 承認・購入の意味の維持、(6) Painを判断に使った明示的根拠を記録する。有用候補ゼロも許す。
- H/Lを条件内・条件間で比較するが、2例ずつの非決定的生成なので候補数やラベルの差だけではPainの効果としない。差がなければ追加価値未確認と記録。外部の業務事実や実測効果を推定しない。恒久Rule/Skill/Business Designは変更しない。
