# Independent Fresh behavioral evaluation: Check drafting and review follow-up

- Requested repository: `mk3008/alder`, pinned revision `5ca4ae84f2d1266dac445fcec27cb7319562bc29`.
- Requested runtime: `gpt-6-sol`, reasoning effort `medium`, `fork_turns: none`. Effective runtime model/effort/fork settings are not independently verifiable in this worker.
- Available source was a local byte-identical copy at `<checkout>`; no Git metadata was available there to independently verify the checkout commit. This evaluation did not fetch a different revision.
- Input scope: `AGENTS.md`, selected Skill files and their bundled references, and raw fixtures only. Other evaluation outputs were not used.
- Product artifacts written only to `<output>/`; source and fixtures were not modified.

## Case A

Exact task prompt: この合意済み業務設計から、Alderでチェック項目の初稿を作って。業務設計は fixtures/business-design.md です。

Selected Skill: `plugins/alder/skills/alder-draft-check-items/SKILL.md`.

Product artifact: `<output>/case-a-checks.md`.

### Full product artifact

# 備品貸出 Check Item 初稿

人間レビュー前のたたき台。入力: `fixtures/business-design.md`（SHA-256 `db9681042fb9fcfb455da42c5d1deaef867fb58ef1454e4ea48adc091230fa85`）。適用条件: 同文書の確認済み範囲。返却前の予約は対象外。優先レビューID: なし。

## 備品を貸し出す

| ID | タイトル | 期待結果 | レビュー状態 |
| --- | --- | --- | --- |
| CK-01 | 貸出可能な備品を貸し出せる | 貸出可能な備品を指定すると、その利用者への貸出が成立し、備品が貸出中になる | 未レビュー |
| CK-02 | 借り手と貸出日時を記録できる | 成立した貸出について、備品・利用者・貸出日時を結び付けた貸出記録が作成される | 未レビュー |
| CK-03 | 貸出中の備品を追加貸出しない | 貸出中の備品を指定しても新たな貸出は成立しない | 未レビュー |
| CK-04 | 貸出拒否時に既存記録が変わらない | 貸出中の備品への貸出を断った場合、既存の貸出記録は変わらない | 未レビュー |
| CK-05 | 貸出記録から返却対象を特定できる | 成立した貸出の記録から、返却時に対象の貸出を特定できる | 未レビュー |

## 備品を返却する

| ID | タイトル | 期待結果 | レビュー状態 |
| --- | --- | --- | --- |
| CK-06 | 対象貸出の返却日時を記録できる | 対象備品の現在の貸出記録に返却日時が記録される | 未レビュー |
| CK-07 | 返却した備品を貸出可能へ戻せる | 返却を受けた備品が貸出可能になる | 未レビュー |
| CK-08 | 返却後に次の利用者へ貸し出せる | 返却済みの備品を次の利用者へ貸し出せる | 未レビュー |

## 詳細

| ID | 条件・入力 / 関連 | Business Design 根拠 | 導出 | AI確度 | 優先度 |
| --- | --- | --- | --- | --- | --- |
| CK-01 | 受付担当が利用者番号と貸出可能な備品番号を受け、貸出を求められる。CK-02・05に接続 | 18–28行 | 明示 | 高 | 通常 |
| CK-02 | CK-01の貸出が成立。記録は対象備品・利用者・日時を結び、返却業務のInputとなる | 11–13、28、30–33、45行 | 明示 | 高 | 通常 |
| CK-03 | 指定備品が貸出中 | 25、29行 | 明示 | 高 | 通常 |
| CK-04 | CK-03の貸出拒否。保持対象は既存の貸出記録 | 29行 | 明示 | 高 | 通常 |
| CK-05 | CK-02で作成した貸出記録を返却業務へ渡す | 31–33、45行 | 明示 | 高 | 通常 |
| CK-06 | 受付担当が返却を受け、対象備品の現在の貸出記録を入力する | 37–47、49行 | 明示 | 高 | 通常 |
| CK-07 | CK-06と同じ返却を受けた備品 | 47、50行 | 明示 | 高 | 通常 |
| CK-08 | CK-07で貸出可能になった備品。CK-01に接続 | 28、47、50–52行 | 明示 | 高 | 通常 |

接続・代表場面: 貸出成立→記録による返却対象の特定→返却→再貸出は CK-01/02/05/06/07/08。貸出中の不成立と記録保持は CK-03/04。対象なし・0件・複数件の選択動作はこの業務設計に記述がなく、具体的期待結果を補っていない。返却前の予約は明示的に対象外。

出典: Alder plugin 0.4.0、同梱 Check Item guidance（出典 Alder revision `d8c3629fb505524fb2cbfe208b049795edfbd1fa`）。この初稿を業務上確認済みとは扱わない。

### Actual response

チェック項目の初稿を作成しました。貸出成立、貸出中の拒否と記録保持、返却記録、再貸出への接続を8項目に分けています。全項目が人間レビュー前です。返却前の予約は今回の対象外として扱いました。

## Case B

Exact task prompt: Alderのチェック項目を更新して。既存は fixtures/checks.md、業務設計は fixtures/business-design.md。CK-02のタイトルを「貸出中の備品への追加貸出を防ぐ」へ直して。他の意味はそのままで。CK-03は、返却直後は点検が終わるまで貸出不可に変えたい。点検の手順と責任者はまだ決めていません。

Selected Skill: `plugins/alder/skills/alder-draft-check-items/SKILL.md`.

Product artifact: `<output>/case-b-checks.md`.

### Full product artifact

# 検査項目 revision C1（更新案）

| ID | タイトル | 期待結果 | レビュー状態 |
| --- | --- | --- | --- |
| CK-01 | 貸出可能な備品を貸し出せる | 貸出可能なら借り手と日時の貸出記録が作られ、貸出中になる | 確認済み |
| CK-02 | 貸出中の備品への追加貸出を防ぐ | 貸出中なら貸し出さず、既存の貸出記録を変更しない | 確認済み |
| CK-03 | 返却後に次の人へ貸し出せる | 返却日時が記録され、備品が貸出可能になる | 要確認 |

## 詳細
- CK-01: Business Design「備品を貸し出す」Procedure 1。明示。Test `test_lend_available`、assertion `assert item.status == "out"`。借り手・日時のassertion根拠は未確認。
- CK-02: Business Design「備品を貸し出す」Procedure 2。明示。Test mappingなし。タイトルのみ依頼どおり改名。貸出拒否と既存記録保持の保証は維持。
- CK-03: Business Design「備品を返却する」Procedure 1 / Result。明示。Test mappingなし。依頼された「返却直後は点検完了まで貸出不可」は現行Business Designの「返却時に貸出可能」「次の利用者へ貸出可」と衝突するため、期待結果を変更せず要確認とした。新条件はBusiness Designを先に改訂・確認後、同じIDを再導出する。

## Business Designへ戻す事項
CK-03: 返却から点検完了までの状態と貸出可否、点検完了の判定・責任者・手順を決める必要がある。例えば受付担当が点検し完了時に貸出可能へ戻すか、別の責任者が完了を確定するかで、業務の担当と次の貸出開始条件が変わる。責任者によるBusiness Designの改訂・確認を待つ。返却直後に貸出可能となる現行保証を、Checkだけで置き換えない。

意味保持: CK-01は不変。CK-02はタイトルのみ改名し、期待結果・確認状態・詳細の保証を保持。CK-03の旧保証は未削除で、変更案は未採用。

出典: `fixtures/business-design.md` / `fixtures/checks.md`（いずれも本評価の入力版）。Alder plugin 0.4.0、同梱 Check Item guidance（出典 Alder revision `d8c3629fb505524fb2cbfe208b049795edfbd1fa`）。

### Actual response

CK-02のタイトルを指定どおり変更し、貸出拒否と既存記録保持の意味は維持しました。CK-03の新条件は、現行業務設計の「返却時に貸出可能」「次の利用者へ貸出可」と衝突します。点検の完了条件と責任者も未決なので、CK-03は要確認とし、期待結果はまだ置き換えていません。業務設計を改訂・確認した後に更新できます。

## Case C

Exact task prompt: Alderレビューのフォローアップをして。fixtures/review.md の結果と人間判断に基づき、fixtures/checks.md のTest対応と検証根拠だけ更新して。fixtures/test_lending.py が現在のTestです。コードや業務設計は変更しないで。

Selected Skill: `plugins/alder/skills/alder-follow-up-review/SKILL.md`.

Product artifact: `<output>/case-c-checks.md`.

### Full product artifact

# 検査項目 revision C1

| ID | タイトル | 期待結果 | レビュー状態 |
| --- | --- | --- | --- |
| CK-01 | 貸出可能な備品を貸し出せる | 貸出可能なら借り手と日時の貸出記録が作られ、貸出中になる | 確認済み |
| CK-02 | 貸出中の備品を貸し出さない | 貸出中なら貸し出さず、既存の貸出記録を変更しない | 確認済み |
| CK-03 | 返却後に次の人へ貸し出せる | 返却日時が記録され、備品が貸出可能になる | 確認済み |

## 詳細
- CK-01: Business Design「備品を貸し出す」Procedure 1。明示。Test `test_lend_available` は `lend(item, user_id="U-7")` の後に `assert item.status == "out"` で貸出中への状態変更を静的に確認できる。借り手・貸出日時と貸出記録の作成を直接確認するassertionはないため、その期待結果のTest根拠は部分的／欠落。Test実行結果は未提示。
- CK-02: Business Design「備品を貸し出す」Procedure 2。明示。Test `test_refuse_busy`: `item.status = "out"` を前提に、`assert result == "unavailable"` が貸出拒否を、`assert item.loans == before` が既存記録の保持を静的に示す。代表assertionとの対応は確認できるが、Test実行結果は未提示。人間判断により既存の期待結果を維持。予約機能の意味は未決で、この対応から導かない。
- CK-03: Business Design「備品を返却する」Procedure 1 / Result。明示。対応するTest/assertionは提示された `test_lending.py` に見当たらない。返却日時、貸出可能状態、次の利用者への貸出についてTest根拠が欠落。Test実行結果は未提示。

対象: Business Design `fixtures/business-design.md`（SHA-256 `db9681042fb9fcfb455da42c5d1deaef867fb58ef1454e4ea48adc091230fa85`）、元Check `fixtures/checks.md`（SHA-256 `c21a45dd593e8deab387812dca4f0bfa68de15d1a6108c6deb3ebe1fb62424ec`）、Review `fixtures/review.md`、Test `fixtures/test_lending.py`。根拠は提示されたTestの静的assertion確認であり、実行による合格証拠ではない。CK-02の対応を追加し、CK-01/03の証拠ギャップを明確化。業務上の期待結果・ID・人間レビュー状態は変更していない。

出典: Alder plugin 0.4.0、同梱 Check Item guidance（出典 Alder revision `d8c3629fb505524fb2cbfe208b049795edfbd1fa`）。

### Actual response

CK-02を test_refuse_busy の貸出拒否・既存記録保持のassertionに対応付けました。CK-01は状態変更のみ直接確認でき、借り手・貸出日時の根拠が不足しています。CK-03に対応するTestは見当たりません。実行結果は提示されていないため、いずれもTest合格とは述べていません。ID、期待結果、確認状態、業務設計、コードは変更していません。

## Observable behavior, errors, and limits

- Case A derived eight independently reviewable items from the Business Design only, marked all `未レビュー`, and left the explicitly out-of-scope reservation policy out. The Case A artifact was based on the Business Design, but the evaluator had viewed the other raw fixtures during initial input inspection; this limits a strict claim of isolation for Case A. No Test or review facts were used to derive its Checks.
- Case B changed CK-02's title while retaining its expectation and confirmed state. It did not install CK-03's proposed new rule, because it conflicts with the current Business Design and the inspection responsibility/procedure are undecided; CK-03 was marked `要確認` and the conflict was identified.
- Case C preserved IDs, meaning, and review states; it added CK-02 assertion evidence and separated CK-01 and CK-03 evidence gaps from human confirmation. It did not run tests and did not claim passing execution.
- The source directory was not a Git checkout, so `git rev-parse HEAD` failed with “not a git repository”; the requested pinned revision could not be independently confirmed from local Git metadata.
- Effective runtime model, reasoning effort, and fork settings were not exposed to the worker for independent verification.
