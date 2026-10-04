# Fresh actual Skill run: initial Check Item draft

## Exact user task

『この合意済み業務設計から、Alderでチェック項目の初稿を作って。業務設計は work/workflow-skills/issue-143/fixtures/business-design.md です。』

## Requested settings and source

- Model requested by repository AGENTS.md: gpt-6-sol
- Reasoning effort requested: medium
- Fork: no history
- Pinned mk3008/alder source: 5ca4ae84f2d1266dac445fcec27cb7319562bc29
- Selected Skill path: plugins/alder/skills/alder-draft-check-items/SKILL.md
- Input path: work/workflow-skills/issue-143/fixtures/business-design.md

## Observed access list

Only these product/Skill inputs were read:

1. plugins/alder/skills/alder-draft-check-items/SKILL.md
2. plugins/alder/skills/alder-draft-check-items/references/check-item-traceability.md
3. plugins/alder/skills/alder-draft-check-items/references/adoption.md (particularly the required Check Item section through optional Functional Interface guidance)
4. plugins/alder/skills/alder-draft-check-items/references/candidate-c3.md
5. plugins/alder/skills/alder-draft-check-items/references/provenance.json
6. work/workflow-skills/issue-143/fixtures/business-design.md

The first combined terminal display truncated `adoption.md`; its required Check Item section was reread directly. The design was read in full and its line numbers and SHA-256 were observed. No other fixture, test, prior review, Check list, output, COVERAGE.md, evaluation file, implementation, or code was read.

## Effective-runtime verification limit

This was an isolated chat-agent simulation using the selected local Skill bundle, not a host-client installation or routing test. I did not verify that a real installed plugin routes the user request to this Skill, presents any UI, or runs under the pinned model/effort in a production client. The work demonstrates only the product draft produced from the allowed local Skill guidance and Business Design in this run. The actual model serving this run was not independently attested by a runtime metadata tool.

## Complete actual product draft

# 備品貸出 Check Items 初稿

**人間レビュー前のたたき台。** 業務設計が確定済み・業務相関レビュー済みであることを前提に、記載された貸出・返却の範囲だけを対象とする。Check の意味はまだ人間に確認されていない。

- 入力: `work/workflow-skills/issue-143/fixtures/business-design.md`、SHA-256 `db9681042fb9fcfb455da42c5d1deaef867fb58ef1454e4ea48adc091230fa85`
- Alder plugin: 0.4.0、選択した plugin commit: `5ca4ae84f2d1266dac445fcec27cb7319562bc29`、同梱 authority revision: `d8c3629fb505524fb2cbfe208b049795edfbd1fa`
- 適用条件: 備品番号と現在の貸出状態、利用者番号が与えられた貸出、および対象備品の現在の貸出記録が与えられた返却
- 優先レビュー ID: L-05、L-07、R-01、R-03。特に「既存記録の保持」と貸出・返却・次回貸出の接続を確認する。

## Activity: 備品を貸し出す

| ID | タイトル | 期待結果 | レビュー状態 |
| --- | --- | --- | --- |
| L-01 | 貸出可能な備品を貸し出せる | 指定された貸出可能な備品が、求めた利用者へ貸し出される。 | 未レビュー |
| L-02 | 貸出の事実を記録できる | 貸出記録に、貸し出した備品番号、借りた利用者番号、貸出日時が記録される。 | 未レビュー |
| L-03 | 貸出した備品が貸出中になる | 貸し出した備品の貸出状態が「貸出中」になる。 | 未レビュー |
| L-04 | 貸出中の備品を再貸出しない | 指定された備品が貸出中なら、その貸出要求では備品を貸し出さない。 | 未レビュー |
| L-05 | 貸出中の備品の既存記録を変えない | 貸出中の備品への貸出要求では、既存の貸出記録が変更されない。 | 未レビュー |
| L-06 | 不成立の貸出記録を作らない | 貸出中で貸し出さなかった要求について、新しい貸出記録を作らない。 | 未レビュー |
| L-07 | 返却時に貸出を特定できる | 成立した貸出の記録から、返却対象の備品とその現在の借り手・貸出を特定できる。 | 未レビュー |

## Activity: 備品を返却する

| ID | タイトル | 期待結果 | レビュー状態 |
| --- | --- | --- | --- |
| R-01 | 対象の貸出記録に返却日時を記録できる | 返された備品について、現在の貸出を表す対象の貸出記録に返却日時が記録される。 | 未レビュー |
| R-02 | 返却した備品が貸出可能になる | 返された備品の貸出状態が「貸出可能」になる。 | 未レビュー |
| R-03 | 返却後に次の貸出へ進める | 返却済みの同じ備品が、次の利用者から貸出を求められたとき、貸出可能な備品として扱われる。 | 未レビュー |

## 同じ ID に対応する導出詳細

| ID | 条件・契機・入力 | 業務設計の根拠 | 導出 | AI確度 | 優先度 | 前後の接続・保持条件 |
| --- | --- | --- | --- | --- | --- | --- |
| L-01 | 受付担当が受付で、利用者の指定した番号の備品を扱う。備品は貸出可能。 | 18–28行: 要求、担当、入力、貸出可能時の処理。 | 明示 | 高 | 通常 | 成立した貸出から L-02・L-03 へ進む。 |
| L-02 | L-01 の貸出が成立したとき。備品番号・利用者番号を入力として持つ。 | 7、10、13、25–33行: 記録の情報、作成、出力、結果。 | 明示 | 高 | 通常 | 貸出日時を含む成立した貸出の事実。L-07、R-01 の元になる。 |
| L-03 | L-01 の貸出が成立したとき。 | 7、28行: 貸出状態と「貸出中にする」。 | 明示 | 高 | 通常 | 次の貸出要求では L-04 の条件となる。 |
| L-04 | 指定された備品の状態が貸出中。 | 18、25、29行: 指定要求、現在の状態、「貸し出さず」。 | 明示 | 高 | 通常 | 備品の引き渡しは成立しない。L-05・L-06 は別に確認する。 |
| L-05 | 指定された備品の状態が貸出中で、既存の貸出記録がある。 | 29行: 「既存の貸出記録を変えない」。 | 明示 | 高 | 優先 | 現在の貸出の事実を保ち、後の R-01 で対象の貸出を扱える。 |
| L-06 | 指定された備品の状態が貸出中で、貸出が不成立。 | 28–31行: 貸出記録の作成は貸出可能な場合の処理で、出力は貸し出した備品・利用者・日時。29行は貸出禁止。 | 強い導出 | 高 | 通常 | 不成立を成立した貸出の記録として扱わない。既存記録の不変更は L-05。 |
| L-07 | L-01 の貸出が成立し、L-02 の記録がある。 | 13、28、31–33、45行: 記録の情報、作成、返却時の特定、返却の入力。 | 明示 | 高 | 優先 | 貸出 Output → 返却 Input。貸出成立だけで、返却の実施まで保証するものではない。 |
| R-01 | 利用者が備品を受付へ返し、対象備品の現在の貸出記録が入力される。 | 38–49行: 返却の契機・担当・入力、対象記録への返却日時、出力。 | 明示 | 高 | 優先 | L-07 で特定可能となった貸出について、対象の記録を更新する。別の貸出記録への記入は想定しない。 |
| R-02 | R-01 と同じ返却。 | 7、47、50行: 貸出状態、貸出可能への復帰、出力。 | 明示 | 高 | 通常 | 次の L-01 に渡せる状態となる。 |
| R-03 | 返却によって同じ備品が貸出可能に戻った後、次の利用者がその備品番号で貸出を求める。 | 18、28、47、50–52行: 次回の指定要求と貸出可能時の処理、返却結果。 | 強い導出 | 高 | 優先 | 返却 Output → 次回貸出 Input。次の利用者の要求がある場合の接続であり、自動的な再貸出は意味しない。 |

## 範囲とレビュー上の論点

- 成功・不成立・接続: 貸出成功は L-01～L-03、貸出中の不成立は L-04～L-06、返却への引継ぎは L-07 と R-01、返却後の次回貸出は R-02～R-03。
- 対象なし・0件: この設計の貸出 Input は「番号と現在の貸出状態を持つ備品」、返却 Input は「対象備品の現在の貸出」である。指定番号の備品が存在しない場合や現在の貸出記録が見つからない場合の結果は書かれていないため、確定した期待結果として追加しない。必要になれば業務設計で決める。
- 対象外: 返却前の予約を認めるかは未決かつ今回の範囲外（3行）。予約の可否を Check やテストの合否として扱わない。
- Business Design へ戻す事項: 今回の確定範囲内ではなし。対象なしのケースを業務範囲に含める場合は、その扱いを業務設計で確認する。
- 実装・テストは未参照。Check ↔ Test/assertion は実装後の別の追跡で扱う。人間の確認・修正後、同じ ID を保って更新する。

## Response verbatim

チェック項目の初稿を作成しました。貸出・返却の確定範囲から10項目を導出し、すべて「未レビュー」としています。貸出中の再貸出防止と既存記録の保持、返却から次回貸出への接続を分けて確認できる形にしました。指定備品や現在の貸出記録が見つからない場合は業務設計に結果がないため、確定した期待結果には加えていません。予約は対象外です。

初稿: <output>/initial-checks.md
証跡: work/workflow-skills/issue-143/evidence/initial-check-draft-raw.md
