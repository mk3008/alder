# 草案生成Skill実行評価パイロット — Phase 1

Control: [root #160](https://github.com/mk3008/root/issues/160) / Execution: [#299](https://github.com/mk3008/alder/issues/299)

既存Skillの指示が実際の成果物に反映されるかを、原資料から独立して固定した評価要件へ照合する任意実行パイロット。業務合意、Skill改訂、採用、merge/releaseは行わない。小標本から成功率の安定性や一般効果は主張しない。

## 固定ケースと既存評価との関係

Plugin source は `4494e2e22ed84c73e8ea0e770d4ff4e576ca0ab2`。新規JSON経路のみ。旧MD互換は対象外。

| ケース | 実行条件 | 既存6静的分岐との関係 |
| --- | --- | --- |
| normal | 申込受領→台帳記録→申込者への受付内容伝達 | normalを原資料へ拡張。省略の修復も起き得るが修復を誘導しない |
| undecided | 取消記録まで。枠解放・通知は明示的に未決 | missing_fact / ambiguityを代表。勝手な確定と未決回答の再質問を検査 |
| review_unavailable | 原資料は十分、意味レビューが実行不能 | rereview_failureの未完了報告境界を初回レビュー不能へ限定して拡張 |

`tools/fixtures/plugin-draft-review-loop`とその6分岐テストは変更しない。repairable_omission / no_progress / 修正後の再レビュー失敗の実挙動を網羅したとは言わない。レビュー結果を合成して実測に混ぜない。

評価計画の既存3ベンチマーク（設備保全・購買・会議室）は完成した業務設計のレビュー用であり、ヒアリングからの新規JSON生成と実行不能条件を分離できない。そのスコア・原典は変更せず、小さな合成受付業務を使う。undecidedは会議室取消という領域だけを再利用し、既存ベンチマークの「取消で占有解除」という確定事項を持ち込まない。異なる原資料であり横並びの精度比較はしない。通常の草案→レビュー→原資料照合→修正と人間合意を維持する。

## 入力境界と凍結

fixtureは `tools/fixtures/draft-skill-pilot/`。`worker/*.md`は課題とヒアリングのみ、`evaluator/*.json`は評価側専用の正解/critical/禁止事項。`frozen.json`は双方のSHA256を保存する。最初の公開commitで凍結し、結果を見て書き換えない。欠陥があれば当該評価を無効として記録し、別の将来版で扱う。

実行者には以下のpackageだけを渡す。全リポジトリ、Issue、PR本文、oracle、テスト、先行出力、採点記録は渡さない。packageはtask、AGENTS、Plugin版、草案/レビュー/JSONの3 Skillsと全同梱参照/runtimeに限定する。原本を変更せず、`input-manifest.json`に全入力hashとpackage作成commitを保存する。Pluginソース版とfixture凍結commitは別に記録する。package外の入力を読んだ場合は漏洩/境界逸脱としてINVALID、追跡不能はunknownにする。allowlistはコピー境界でありOSの隔離を保証しない。アクセス制約とツール履歴も評価者が確認する。

```sh
python3 tools/draft_skill_pilot.py package normal /tmp/alder-299-normal
python3 -m unittest tools/test_draft_skill_pilot.py tools/test_workflow_skills.py
```

公開済みの固定commitからpackageを作成し、そのcommitと安全な入力が取得可能であることを確認する。既存通常枠の独立実行者を最大3 Freshまで起動する。新規API/課金/権限追加は禁止。指定はgpt-6-sol / medium / forkなし。実効設定を確認できなければ独立検証不能と記す。実行不能はNOT_RUNとし自己再読で置き換えない。ケースを再実行しても1件を消さず全起動数を数える。レビュー用Freshも上限に含め、必要ならSkillが許す同一Agentの別read-only工程を使い非独立と報告する。

起動promptは次の全文を使い、`<bundle>`だけを実際の絶対パスに置換して保存する。

> 入力は <bundle> の task.md、AGENTS.md、input-manifest.json と plugins/ 以下だけです。task.md の依頼を実行してください。Skillの必要な同梱参照を読んでください。書込みは <bundle>/output/ 以下だけにしてください。外部通信、別リポジトリ、他の実行結果・評価資料の参照は禁止です。追加Agentは起動しないでください。別reviewerはこの実行では利用できないため、Skillが許す場合は同一Agentで別のread-onlyレビュー工程を行い非独立と明示してください。実施した操作と参照先、レビュー対象ファイルのhash、所見・修正・再レビューを output/trace.md に実行時に記録し、実際のコマンド出力は output/commands.log に保存してください。実行できない工程は理由を記録してください。task.md の明示された実行制約を守ってください。最後に output/response.md へ返却説明を残してください。

traceは診断材料であり自己申告を真実と認定しない。実行ホストのツール履歴/コマンド出力と突合できないレビュー完了はunknownにする。ホストの履歴を安全に保存できなければその限界を記す。

## 評価者の手順と結果レコード

実行者とは別の評価者が、入力manifest/起動prompt/ツール履歴、原資料、JSON全文、実行コマンド出力、返却説明、最後にレビューした版を読む。oracleの各要件を原資料の行→出力ID/fieldへ対応付け、追加された断定を逆照合する。Schema検査は別途同梱CLIで行う。語句一致では業務意味の正否を自動判定しない。

スコア入力はJSON（下記の`requirements`はoracleの全IDを過不足なく列挙）。`tools/test_draft_skill_pilot.py`のsynthetic recordは形の実例でありAgent結果ではない。

```json
{
  "case": "normal",
  "source_revision": "4494e2e22ed84c73e8ea0e770d4ff4e576ca0ab2",
  "executor_id": "ホストが返したID",
  "evaluator": {"id": "別の評価者ID", "independent_of_executor": true},
  "execution_status": "RUN",
  "input_integrity": "verified",
  "output_evidence": "design",
  "evidence": {"design": {"path": "output/design.json", "sha256": "実ファイルhash"}},
  "requirements": [{"id": "json", "status": "unknown", "evidence": [], "rationale": "未確認の理由"}],
  "review": {"status": "unknown", "independence": "unknown", "evidence": null, "reviewed_output_sha256": null},
  "observations": {"steps": "unknown", "seconds": "unknown", "retries": "unknown", "cost": "unknown"},
  "findings": []
}
```

各要件はmet（全成立）/partial（一部のみ）/unmet（未達）/unknown（根拠不足）。既知判定にはevidenceキーと具体的な場所・理由を付ける。証拠は評価用ディレクトリ内の実ファイルとSHA256で固定する。全criticalがmetでなければ合格しない。partialもcritical失敗。critical未達はFAIL、不明はINCONCLUSIVE、漏洩はINVALID。review.statusはcompleted / not_run / failed / unknown。完了なら最終出力hashと実レビュー証拠が必要。同一Agentのレビューはsame_agentと明示する。全要件metでも未実施/失敗レビューはINCOMPLETE。review_unavailableの正直な報告はpending要件metにできるが、実レビュー未完了をPASSにしない。非criticalの一部未達はPARTIAL。

`NOT_RUN`ではcase、executor_id、evaluator、execution_status、input_integrity、reasonのみで採点を止める。起動していなければexecutor_idは`none`。起動済みなのに失敗した実行をNOT_RUNへ消さず、RUNの失敗/unknownとして記録する。

steps/seconds/retries/costは観測可能な場合だけ `{"value": 値, "evidence": "キー"}` とし、他は文字列`unknown`。費用unknownをゼロとしない。実行者の不明瞭点はresponse/traceを参照する診断として記録する。採点外の起動台帳には要求model/effort/fork、実効設定確認可否、実行ID、Pluginソース版、fixture凍結commit、全文prompt、入力manifest、出力一覧、開始/終了観測範囲を保存する。

findingsは `issue` / `evidence`（キーの配列）/ `cause_hypothesis` / `general_fix_rule` を別々に記録する。Causeは仮説であり失敗の観測と混ぜない。再発時は該当する既存指示の位置と有効性を確認し、重複する文言追加で対処しない。明確に実測されたSkill欠陥だけをPhase 2候補にし、このPhaseではSkillを編集しない。

```sh
python3 tools/draft_skill_pilot.py score \
  tools/fixtures/draft-skill-pilot/evaluator/normal.json \
  /path/to/evaluation.json /path/to/evidence-root
```

この検査は証拠の存在/hashと評価記録の整合を検査する。評価者の意味判断や独立性の自己記載を認証するものではない。生出力は合成入力でも安全性を確認してから保存し、秘密を含むホスト履歴は公開しない。保存した要約だけならsummary-onlyとし、再現可能な実測に格上げしない。
