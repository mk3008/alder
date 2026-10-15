# Authoring 対話と読取記録

requested model / effort / fork は全 role で `gpt-6-sol` / `medium` / `none`。実効設定の独立検証はできない。以下は Agent 自己申告の読取先であり、共有 filesystem への非接触証明ではない。

| 順序 | role / 固定入力 | 読取申告と出力 |
| --- | --- | --- |
| 初回 | `/root/customer_105` / `customer-launch.txt` | `scenario/customer-role.md`、`scenario/initial-brief.md` → `customer-initial-raw.md`。 |
| 草案 | `/root/designer_105` / `designer-launch.txt`、`customer-initial-raw.md` | `AGENTS.md`、Skill `SKILL.md`、同梱 `adoption.md`、`business-graph.md`、`provenance.json`、初回 raw → `design-v1.md`。研修記録・活動予定表・当日配置表の参照・更新、将来予定相関と変更連絡の3質問を応答と初稿の未確認事項に記した。 |
| 回答 | `/root/customer_105` / `customer-followup.txt` | role card、`design-v1.md` → `customer-followup-raw.md`。役割別判定、A/B/C の一対一対応、当日復元、正常・例外経路、negative / benign control を回答。 |
| 改訂 | `/root/designer_105` / `designer-followup.txt` | 顧客回答、既存 `design.md`、前回読取の Skill 参照 → `design-v2.md`。material question なし、export 成功と自己申告。 |
| 顧客確認 | `/root/customer_105` / `customer-confirmation-prompt.md` | role card、design → `customer-confirmation-v1-raw.md`。機材調整結果の記録、再研修前の旧判定参照という資料外の断定を2箇所指摘。 |
| 修正 | `/root/designer_105` / `designer-correction.txt` | 顧客指摘、同じ design、前回 Skill 参照 → 最終 `design.md`。2断定を削除し material question なし、export 成功と自己申告。 |
| 最終顧客確認 | `/root/customer_105` / `customer-final-prompt.md` | role card、最終 design → `customer-final-raw.md`。合成顧客が current-state の業務意味を確認。 |
| 独立 gate | `/root/authoring_gate_105` / `gate-evaluator-prompt.md` | role card、brief、全顧客 raw、最終 design、AGENTS、Skill と同梱参照 → `gate-evaluation-raw.md`。重大な source 不一致、material open question、主要相関欠落なしとして Pass。 |

Designer は role card、Oracle、Known Problem を読まない指示を受けた。Keeper は最終 design に Oracle 根拠である資格可否→区分→可否の事実が記述され、評価語がないことを別途確認した。`design-v1.md` と `design-v2.md` の hash を残し、既存 raw を後から修正しない。
