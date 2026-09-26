# Issue #103 — Local / Structural Optimization 比較事前条件

Local と Structural の出力を生成する前に本条件、4件の prompt、入力の SHA-256 を固定する。各 Run は1回のみ、好ましい結論のため seed や質問を追加しない。対象は合成事例の現行業務と来月から決定した学校講座であり、実在組織の承認済み設計ではない。

## 固定入力・モデル

- Business Design: `../phase0/benchmark.md`、SHA-256 `1b13ebe8bbd15aa112ed68bda6df58ba6647ad79db60d101ea0a71c1753c7bc4`。#99 v4 を Authoring Skill 0.2.6 と合成顧客確認で最小改訂したもの。#99/#101/#102 の raw、hash、oracle、評価、結論は変更しない。
- Optimization Review guidance: `docs/optimization-review.md`、SHA-256 `c2d6b98a57ac97cf0b78cfd544e1d8a9ab071016acdaaf937435251aa3166ad5`。4件とも同一 copy。標準の Narrow / Keep / Expand、最大3候補、zero valid、Extreme perspectives 任意。Local に隣接 Business の閲覧や Expand を禁じない。
- 人間役の Problem 確認: `../phase1/problem-confirmation-raw.md`。優先順位・承認・通知・方式は未決、競合件数・損失・Pain 実測なし。全 Run へ Problem 文だけを渡し、顧客の全文や研究評価を見せない。
- **Pain level = Medium** を全4件で同一の実験用固定 signal とする。Low は横断調査を抑えやすく、High は観測のない深刻度を暗示するため、中間値で Scope 判断を agent に委ねる。実際の痛み・頻度・効果の測定値ではない。候補の難易度や範囲を機械的に許可しない。
- 4件とも requested model `gpt-6-sol`、reasoning effort `medium`、`fork_turns: none`。別 workspace に同一設計と guidance、各自の prompt と AGENTS.md を置く。#99 の Oracle/Discovery raw、#96/#98 の結論、他 Run の prompt/output、本 protocol、比較評価は読ませない。read log は自己申告で実効隔離を証明しない。

## Arm と treatment

| Arm | Problem の焦点 | 追加条件 |
| --- | --- | --- |
| L1 | 住民貸出の番号・受取予定の約束と講座側の将来利用との整合が未決 | 現行 Optimization Review のみ |
| L2 | 通常講座の水曜の種類・必要数と金曜の番号選定を先行貸出といつ整合するか未決 | 現行 Optimization Review のみ |
| L3 | 学校講座の前週木曜の必要数・金曜正午から土曜夕方の4組の持出しを他の約束とどう整合するか未決 | 現行 Optimization Review のみ |
| S | 三つの利用で期間・数・具体番号と現物の持出しを約束する時点が異なり、先行する約束の相互扱い、優先順位・変更権限・通知が未決 | 事前固定の最小 Structural treatment |

各 Problem の全文は `prompts/` に固定する。Local も隣接活動を自然に検討してよい。Structural は設計全体を読み、個別 Activity 案を先に並べず共通構造を確かめ、一つの変更が複数 Business に効く場合にだけ横断 Candidate と呼ぶ。Local 案の列挙や単純な束ね直しは横断 Candidate にならず、共通構造がなければゼロを許す。単一台帳、中央予約、優先順位などの解は prompt で指定しない。

## 事前固定の独立評価

raw と hash を4件とも固定した後、別 Fresh Evaluator が同じ Design、guidance、4 raw、#99 Oracle と negative control を読んで比較する。#99 の評価資料は評価段階でのみ開く。Candidate と Extreme perspective を区別し、下記を各案と対照群について判定する。

1. **Root structural match**：貸出の期間・番号、通常講座の水曜の種類・組数→金曜の番号、学校講座の前週木曜の必要数→金曜正午から土曜夕方の custody を同じ有限資源の約束として扱うか。
2. **Causal coverage**：一つの変更が複数 Business の約束の成立・変更・通知へどう効くかを具体的に示すか。単に個別改善を並べないか。
3. **Novelty against Local**：Structural の主要作用点が、いずれかの Local 1案または Local 全案の単純な和に既にあるか。Local が Expand して同等に到達すれば Structural 固有の差は小さい/ない。個々の候補と union を両方比べる。
4. **Meaning preservation**：住民の番号・付属品の相互確認と署名、講師の使用セット・保護具・作業場所確認、整備担当の機能点検と復帰を目的・時点別に保持するか。類似の確認を安易に統合・削除しないか。
5. **Boundedness**：実測されない事故・損失・在庫総数を創作せず、組織再編、全社基盤、契約変更、技術決め打ちへ根拠なく拡大しないか。
6. **Human decision**：優先順位、確約時点、変更承認・通知責任などを採用済み運用とせず人に返すか。

結論は **Structural-specific / Local-expands / No useful structural candidate / Over-expansion** のいずれか、または材料不足なら限定的な複合評価とし、根拠と反証可能な境界を示す。既存 #96/#98/#99 と比較しても1件から一般的優位・全体最適は主張しない。恒久 Skill の採否は今回決めない。
