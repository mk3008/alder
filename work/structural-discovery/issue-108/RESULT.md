# Issue #108 結果：Adopt with narrower wording

**Structural Discovery を任意の業務改善探索として文書化する。** 対象は、現行 Business Design の業務意味と、その Observation が依拠する Activity 間の関係が確認済みの場合に限る。問題や効果は推定せず、再検討の問いを少数提示する。未確認の関係は Authoring / Quality Review に戻し、改善候補として数えない。人間が Problem と Pain を確認した場合だけ既存 Optimization Review に進む。新しい Structural Optimization、必須工程、metrics 収集、Plugin Skill は作らない。

| 証拠 | 観測と制限 |
| --- | --- |
| A: #99 既存 raw | 共用工具の住民貸出・講座数・個別番号の確約時点を横断する§1・2・9は、一つの条件付きの問いとして有用。9件すべてを独立成果と数えない。§3・4・6・8などには未確認の受渡・状態・通知が多く、§5・7もその境界にかかる。設計書 v4 は未合意で、業務上の欠陥・負荷の実証ではない。異なる目的の受渡確認、講師の使用前確認、整備点検を統合していない。 |
| B: #105 既存 raw | 独立 Authoring gate が通った current-state 設計から、役割可否→A/B/C区分→役割可否の変換を観察し、Unknowns と質問を分けた。ただし合成顧客は現行区分の用途と負荷・誤読の未確認を理由に改善対象化を拒否。二つの予定表の関係も保留。Optimization へ自動昇格していない。 |
| C: 新規 benign control | 成立済みの避難経路点検と展示案内点検を別目的として保持し、**Observation 0件**。共通の開室前時点から統合や抽象的なサイロ論を捏造しなかった。 |
| D: 新規 Quality boundary | 取消後の予約表と空き判定が未確認の草案に対し、**改善候補 0件**として業務設計の確認を要求。raw は確認事項の説明に Structural Observation 等の見出しを流用したため、positive 候補と見誤る表示上のリスクがある。採用文書では、未成立なら通常の設計確認質問に戻し、候補様式を使わないと明記した。 |

独立 [評価原文](evaluation/evaluator-raw.md) は Groundedness / Structural value / No invented Pain / Human agency / Zero validity / Negative-control preservation / Quality Review boundary / Boundedness の8観点を、四つの証拠ごとに照合した。C/D は [事前固定](PROTOCOL.md) 後、別 Fresh context で各1回。判定は独立評価と同じ **Adopt with narrower wording**。C/D のゼロは false positive に歯止めを示したが、一般的なゼロ率や発見率は推定できない。

最小変更は [Optimization Review 文書](../../../docs/optimization-review.md#optional-structural-discovery-before-a-problem-is-known) に任意の入口、五欄の出力、未成立時の返し方、人間確認、既存 Optimization への接続を追加し、英日 README に各一文の導線を置くこと。Business Design は SSOT のまま変更しない。Observation は業務判断でも採用済み改善でもなく、人間は拒否・保留を選べる。

既存 #99〜#106 の raw・hash・Oracle・評価原文は不変。共有 filesystem におけるアクセス隔離とモデル設定の実効値は独立に証明できない。合成4例と各 Fresh 1回は実測 Pain、便益、網羅性を立証しない。
