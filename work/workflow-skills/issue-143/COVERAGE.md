# 公式workflowのSkill coverage

2026-10-04。業務authorityはmain `a971d60bb64fbc048a871d70dda277c93b680288`。提供案内のみ`d8c3629fb505524fb2cbfe208b049795edfbd1fa`で0.4.0向けに更新した。業務意味や研究採否は変更しない。

| 現行の仕事 | 実装先 | 判断 |
| --- | --- | --- |
| 業務設計の初稿・修正・Problem記録・人間回答の反映 | 既存 alder-draft-business-design | 既存。依頼された設計のみを変更し、未決を残す |
| 記述品質・業務相関・考慮漏れの設計レビュー | 既存 alder-review-business-design | read-onlyを保持 |
| 確認済み現行業務から構造上の問いを探す | 新規 alder-discover-business-questions | optimization authorityの採用済みOptional Structural Discovery。Problem/Painを捏造しない |
| 確認済みProblem/Painから改善候補を比較 | 既存 alder-optimize-business | 別の構造探索へ明示routing。候補採否は人間 |
| チェック項目の初稿・内容の整合性レビュー・フィードバック更新 | 新規 alder-draft-check-items | c3 + 現行追跡authority。IDと人間確認状態を保守 |
| Functional Interfaceの任意索引 | 同じCheck Skillの明示的opt-in mode | 独立フェーズを増やさず、Interfaceだけの依頼は勝手にCheckを作らない |
| 未記載の機能条件の任意探索 | 新規 alder-explore-functional-conditions | 採用済み考慮漏れ探索。少数の未承認候補、0件可 |
| 完了実装・DDL・Testの独立レビュー | 既存 alder-review-implementation | read-only維持。follow-upへ書込みを分離 |
| 実際の人間判断の反映・Decision Record・Check↔Test/assertion根拠保守 | 新規 alder-follow-up-review | Business Design先行、実装修正への暗黙拡張なし。未検証証拠と未決意味を区別 |
| Business Graph JSON出力 | 新規 alder-export-business-graph + 原本同一script | 既定工程にしない決定的投影。原本exporterがSSOT |
| 同期漏れ候補の検出 | 新規 alder-check-traceability-drift + 原本同一script | 明示opt-inした制限付きpilot。既存の互換入力/adapterが必要 |
| pilotで照合した関係だけpin更新 | follow-upの明示依頼mode | bulk更新・自動承認なし。Check本文不変なら一致するTest pinを触らない |
| 業務設計の合意、Check期待結果確認、Problem/Pain確定、候補採否、実装受入 | 人間の行為 | AIが説明・草稿・証拠を準備しても判断を代行しない |
| システム設計・一般実装・Test作成/実行・deploy | 隣接する製品開発 | Alder固有のSkillへ包み直さない。必要な情報を既存の開発作業へ渡す |
| Alder研究・汎用GitHub/Release作業 | この利用workflowの外 | 実在する開発作業でも製品利用Skillの追加対象ではない |
| Explore It!追加、Scope-First、全項目網羅、汎用drift parser、恒久Code位置対応 | 未採用/延期/非対象 | 研究を製品能力へ昇格させない |

## 出典と境界

- `docs/adoption.md`: 3 loops、Check、任意機能探索、任意Interface、実装後レビュー/follow-up。
- `business-design/alder/README.md`: 設計・改善・検査項目・任意同期漏れ検査。設計業務は引渡しで終わる。
- `docs/check-item-traceability.md`: ID、4 review states、意味保持audit、Testまでの恒久対応、別のevidence state。
- `docs/optimization-review.md`: Problemの前のStructural Discoveryと、Problem起点Optimizationの分離。
- `docs/behavior-derivation/functional-considerations.md`: 採用済み任意探索。
- `docs/plugin-adoption.md`: 同一exporterを同じPluginへ同梱する方針。
- `docs/traceability-drift/study.md`: 制限付きpilotのみ。汎用product runtimeは未採用。

歴史的c3/f1にはCode/SQL位置の対応が残る。原本は変更せず、Skill入口で現行adoption/traceabilityのTest-only境界が優先することを明示した。レビュー知識v0.3や未採用PR #142の要求受付案を改変・導入していない。

## 提供状態

0.4.0は公開許可を受けた実装。最終検証後にmainと固定tag/Releaseへ公開する。既存4 + 新規6 = 10 Skills。登録済みPluginの更新と実クライアントrouting/script実行は行わない。ローカルpackage/CLIとFresh agentで確認できる事項を、インストール済みクライアントでの挙動と混同しない。
