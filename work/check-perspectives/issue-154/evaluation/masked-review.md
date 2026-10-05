# Masked Check derivation review

Frozen source: `a58c970f3a78ac9a0ba91be3c6bfb05e4e2b1168`. Preregistration: `25ec5216cbc2561d5c60e93ade22118c7f621272`. Arm key withheld. Scope: two supplied BD files, frozen rubric, and four blinded outputs only. Read-only meaning evaluation; no human business approval.

## Counts from raw Check tables

| Case | Output | Unicode chars | Check IDs | Explicit questions | Review units | Categories (all units) |
|---|---:|---:|---:|---:|---:|---|
| purchase-request | X | 6882 | 25 | 2 | 27 | direct 22, same-meaning-view 2, duplicate-noise 1, business-question 2 |
| purchase-request | Y | 7722 | 25 | 1 | 26 | direct 20, duplicate-noise 4, same-meaning-view 1, business-question 1 |
| facilities-maintenance | X | 8342 | 27 | 0 | 27 | direct 25, duplicate-noise 2 |
| facilities-maintenance | Y | 7821 | 27 | 0 | 27 | direct 24, same-meaning-view 1, duplicate-noise 2 |

Unicode length is the complete blinded Markdown file, not just its main table. Review units are each main-table Check plus each explicit BD question. Detailed grounding and same-output/cross-output links are in the JSON. Time burden was not measured.

## Purchase request: within-case comparison

Shared direct coverage includes submission, required fields and retention, unique identification, approval/rejection and downstream treatment, approved-only purchase, timestamps, and missing-input/state boundaries. A cross-output match never changes a valid direct item into noise.
- X-02 is a distinct useful target-isolation view: a decision or purchase outcome should attach to the selected application, not silently alter another application. Y names the same selected application in success checks, but does not independently check non-target state.
- Y A4-06 is a distinct useful negative view of the BD sequence: registration alone cannot mark a not-yet-purchased item `purchased`. X A4-01 conditions success on actual purchase but does not isolate this negative boundary.
- X X-01 is useful only as a single-record state assertion: one current application status cannot simultaneously be `approved` and `rejected`. The BD does not specify a concurrency policy, arbitration order, or guarantee that two close operations cannot both report success. X’s wording must not be used as that stronger guarantee. Y omits a separate mutual-exclusion view but does not thereby omit a specified concurrency behavior.
- X X-03 reselecting `purchased` is an instance of X A4-04 (not `approved`) rather than an independent guarantee. Y A1-06/A2-06/A3-06/A4-07 restate role conditions already inside same-output success checks; none independently tests a role-only unauthorized attempt. X A3-04 and A3-06 split missing reason from missing target; Y A3-05 combines them. X A4-05 and A4-06 split missing amount from missing target; Y A4-04 combines them. These changes in granularity do not themselves prove more business coverage.
- X asks two BD questions: post-purchase result-registration failure, and permitted quantity/amount ranges. Y asks the same post-purchase failure question as Q-01, but omits the range question. Both safely keep the question out of Check. The BD explicitly defers amount-tier approvals, procurement sub-processes, supplier selection, asset management, external integration, audit, and notifications; neither output repeats these as a requested decision or establishes them as Checks.

## Facilities maintenance: within-case comparison

Shared direct coverage includes additional reports for the same registered equipment, open→scheduled→completed states, non-closed and future-time scheduling conditions, trusted completion time, early completion, report-time lower bound, role boundaries, closure preserving open/completed requests, scheduling blockage during closure, and release restoring conditional scheduling capability without itself scheduling.
- Y M2-04 is a distinct useful establishment-time view. An `open` request selected while equipment is available must still meet the non-closed condition when scheduling is established if an independent safety inspection closes the equipment in between. X A2-04 covers already-closed equipment but not this change between selection and establishment. This derives a business outcome at establishment, not any locking or technical execution method.
- Y M4-04’s multiple-open-request example has no distinct result beyond Y M4-02 (each existing `open` remains) plus M4-03 (closed equipment’s `open` requests cannot be scheduled). X A4-02 explicitly mentions one/multiple requests and X A4-04 applies to the equipment’s remaining `open` requests. Do not count M4-04 as a unique gain.
- X A2-08’s zero-open-request scenario is a trivial failure to select an eligible required target, already contained in X A2-01’s conditions; Y omits a separate zero-case Check. Both outputs omit new BD questions, appropriately avoiding re-questioning explicit deferred topics.

## Boundary and evidence limits

No item uses an implementation-specific API, database, locking, authentication, or timestamp representation as a required business outcome. No explicit question was mispromoted into a Check. The only material meaning-overreach risk is interpreting X X-01 as a guarantee about two concurrent operations succeeding; the supported core is one stored state. For facilities, selection-time and final-establishment conditions can be separated because the BD says the equipment must not be closed at the time of scheduling, while the independent safety inspection may occur between selection and establishment. The purchase BD does not establish an analogous general concurrency policy.
The blinded files report their own guidance and viewpoint provenance, but these reports do not independently prove causal origin. No Test, implementation, human approval, measured review time, or actual operational behavior was available; categories judge source-grounded meanings only. The outputs’ declarations of “unreviewed” should be respected. Neither volume nor alleged priority IDs are success evidence.

## Per-item judgments

### purchase-request X

| ID | Kind/category | BD grounding | Judgment / flags | Same-output duplicate | Other output counterpart |
|---|---|---|---|---|---|
| A1-01 | check/direct | 業務1 Input（4項目すべて必須）、手順3-4、Output（submitted） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A1-01 |
| A1-02 | check/direct | 購入申請の情報、業務1 Output（申請者・入力4項目・申請日時を保持） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A1-02 |
| A1-03 | check/direct | 業務1 Input（4項目すべて必須）と Output（成立したsubmitted） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A1-03 |
| A1-04 | check/direct | 購入申請「一意に識別できる」 | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A1-04 |
| A1-05 | check/direct | 業務1 Why/Output（承認者が判断可能）、業務2 When/手順1 | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A1-05 |
| A2-01 | check/direct | 業務2 When（submitted）、Who、Input、手順3、Output（approved） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A2-01 |
| A2-02 | check/direct | 業務2 手順4、Output（承認日時） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A2-02 |
| A2-03 | check/direct | 業務2 Why/Output（購買対象）、業務4 When | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A2-03 |
| A2-04 | check/direct | 業務2 When（submittedのみ）、手順1-3 | submittedでない選択時には承認は成立しない。選択後・成立前の競合についてはBDに時点指定がないため、この文面以上に拡張しない。 | — | A2-04 |
| A2-05 | check/direct | 業務2 Input（対象選択必須） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A2-05 |
| A3-01 | check/direct | 業務3 When（submitted）、Who、手順4、Output（rejected） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A3-01 |
| A3-02 | check/direct | 業務3 Input（理由必須）、手順3・5、Output（理由・日時） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A3-02 |
| A3-03 | check/direct | 業務3 Why/Output（購買対象外）、業務相関5 | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A3-03 |
| A3-04 | check/direct | 業務3 Input（却下理由必須）、手順3-4 | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A3-05 |
| A3-05 | check/direct | 業務3 When（submitted）、手順1-4 | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A3-04 |
| A3-06 | check/direct | 業務3 Input（対象選択必須） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A3-05 |
| A4-01 | check/direct | 業務4 When（approvedの購入時）、Input、手順1-4、Output（purchased） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A4-01 |
| A4-02 | check/direct | 業務4 Input（実購入金額必須）、手順3・5、Output（金額・日時） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A4-02 |
| A4-03 | check/direct | 業務4 Why/Output（purchasedの申請を購入済みとして扱える） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A4-05 |
| A4-04 | check/direct | 業務4 When（approvedのみ）、手順1-4、業務相関4-5 | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A4-03 |
| A4-05 | check/direct | 業務4 Input（実購入金額必須）、手順3-4 | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A4-04 |
| A4-06 | check/direct | 業務4 Input（対象選択必須）、手順1-4 | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A4-04 |
| X-01 | check/same-meaning-view | 購入申請の単一状態欄、業務2/3 When（ともにsubmitted）、両業務の相反する状態Output。並行処理の成功応答までは記載なし | 限定すれば単一申請の最終状態は一値という有用な交差視点。ただし近接/並行する承認と却下が双方成功を返さない保証、裁定順、原子性はBDにない。; unauthorized-decision/overreach risk | — | — |
| X-02 | check/same-meaning-view | 購入申請の一意性、業務2/3/4 Input（対象選択）、各手順・Output（対象申請） | 複数申請で、選択対象以外を書き換えないという対象同一性の横断確認。Yの個別成功は対象を同じ申請と呼ぶが、別申請の非変更を独立Checkにしていない。 | — | A2-01, A3-01, A4-01 |
| X-03 | check/duplicate-noise | 業務4 When（approved）、Output（purchased）。XのA4-04の一例 | purchasedの再選択はX A4-04の非approved状態の一例。 | A4-04 | A4-03 |
| QX-01 | explicit-question/business-question | 業務4 手順2-5（購入→記録→purchased）。登録失敗時の扱いは記載なし | 新しい回復・照合・再購入防止の業務判断が必要。質問に留めている。 | — | Q-01 |
| QX-02 | explicit-question/business-question | 業務1 Input（数量・希望購入金額必須）、業務4 Input（実購入金額必須）。値域規定なし | 必須性から値域は決まらない。質問に留めている。 | — | — |

### purchase-request Y

| ID | Kind/category | BD grounding | Judgment / flags | Same-output duplicate | Other output counterpart |
|---|---|---|---|---|---|
| A1-01 | check/direct | 業務1 Input（4項目すべて必須）、手順3-4、Output（submitted） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A1-01 |
| A1-02 | check/direct | 購入申請の情報、業務1 Output（申請者・入力4項目・申請日時を保持） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A1-02 |
| A1-03 | check/direct | 業務1 Input（4項目すべて必須）と Output（成立したsubmitted） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A1-03 |
| A1-04 | check/direct | 購入申請「一意に識別できる」 | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A1-04 |
| A1-05 | check/direct | 業務1 Why/Output（承認者が判断可能）、業務2 When/手順1 | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A1-05 |
| A1-06 | check/duplicate-noise | 業務上のロール「申請者」、業務1 Who | 担当ロールは明示されるが、同出力の成功Checkが同じロール条件をすでに含む。無権限者の否定的場面はこの文面にない。 | A1-01 | — |
| A2-01 | check/direct | 業務2 When（submitted）、Who、Input、手順3、Output（approved） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A2-01, X-02 |
| A2-02 | check/direct | 業務2 手順4、Output（承認日時） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A2-02 |
| A2-03 | check/direct | 業務2 Why/Output（購買対象）、業務4 When | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A2-03 |
| A2-04 | check/direct | 業務2 When（submittedのみ）、手順1-3 | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A2-04 |
| A2-05 | check/direct | 業務2 Input（対象選択必須） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A2-05 |
| A2-06 | check/duplicate-noise | 業務上のロール「承認者」、業務2 Who | 担当ロールは明示されるが、同出力の成功Checkが同じロール条件をすでに含む。無権限者の否定的場面はこの文面にない。 | A2-01 | — |
| A3-01 | check/direct | 業務3 When（submitted）、Who、手順4、Output（rejected） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A3-01, X-02 |
| A3-02 | check/direct | 業務3 Input（理由必須）、手順3・5、Output（理由・日時） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A3-02 |
| A3-03 | check/direct | 業務3 Why/Output（購買対象外）、業務相関5 | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A3-03 |
| A3-04 | check/direct | 業務3 When（submittedのみ）、手順1-4 | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A3-05 |
| A3-05 | check/direct | 業務3 Input（対象・却下理由とも必須） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A3-04, A3-06 |
| A3-06 | check/duplicate-noise | 業務上のロール「承認者」、業務3 Who | 担当ロールは明示されるが、同出力の成功Checkが同じロール条件をすでに含む。無権限者の否定的場面はこの文面にない。 | A3-01 | — |
| A4-01 | check/direct | 業務4 When（approvedの購入時）、Input、手順1-4、Output（purchased） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A4-01, X-02 |
| A4-02 | check/direct | 業務4 Input（実購入金額必須）、手順3・5、Output（金額・日時） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A4-02 |
| A4-03 | check/direct | 業務4 When（approvedのみ）、手順1-4、業務相関4-5 | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A4-04, X-03 |
| A4-04 | check/direct | 業務4 Input（対象・実購入金額とも必須） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A4-05, A4-06 |
| A4-05 | check/direct | 業務4 Output（購入済みとして扱える）、購入申請の一意性 | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A4-03 |
| A4-06 | check/same-meaning-view | 業務4 When（購入したとき）、手順2→3→4、Why（実際の購入として完了） | 購入結果登録より実物購入が先という境界を独立に確認する。X A4-01の成功前提には含まれるが、未購入を結果登録でpurchasedにしない否定例は独立していない。 | — | A4-01 |
| A4-07 | check/duplicate-noise | 業務上のロール「購買担当者」、業務4 Who | 担当ロールは明示されるが、同出力の成功Checkが同じロール条件をすでに含む。無権限者の否定的場面はこの文面にない。 | A4-01 | — |
| Q-01 | explicit-question/business-question | 業務4 When・手順2-5。失敗/再開方法は規定なし | 回復・再登録条件はBDにない。質問に留めている。 | — | QX-01 |

### facilities-maintenance X

| ID | Kind/category | BD grounding | Judgment / flags | Same-output duplicate | Other output counterpart |
|---|---|---|---|---|---|
| A1-01 | check/direct | 業務1 When（登録済み設備）、Input（4項目必須）、手順2-3、Output（新しいopen依頼） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | M1-01 |
| A1-02 | check/direct | 業務1 Input/Output（対象設備・報告日時・報告者・症状を保持） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | M1-02 |
| A1-03 | check/direct | 業務1 When（既存依頼があっても新しい報告を受け付ける）、保守依頼の一意性 | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | M1-03 |
| A1-04 | check/direct | 業務1 Output（後続の日程設定対象）、業務2 Whenの別条件 | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | M1-04 |
| A2-01 | check/direct | 業務2 When（open・非閉鎖・未来）、Who、手順3、Output（scheduled） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | M2-01 |
| A2-02 | check/direct | 業務2 Input（予定日時）、手順3、Output（決定日時を記録） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | M2-01 |
| A2-03 | check/direct | 業務2 Output（完了業務の対象）、業務3 When | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | M2-02 |
| A2-04 | check/direct | 業務2 When（safety_closedでない）、不成立時Output（状態不変）、業務4 Output（閉鎖中設定不可） | BDの閉鎖時禁止を日程設定側から確認。A4-04と同じ保証を重ねている。 | A4-04 | M2-03, M4-03 |
| A2-05 | check/direct | 業務2 When（予定日時は設定時点より未来）、不成立時Output（状態不変） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | M2-05 |
| A2-06 | check/direct | 業務2 When（openのみ、completed対象外）、不成立時Output | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | M2-06 |
| A2-07 | check/direct | 業務2 Who（現場報告者だけでは権限なし） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | M2-07 |
| A2-08 | check/duplicate-noise | 業務2 Input（対象依頼選択必須）、When（openのみ） | 対象open依頼が0件なら対象選択できず、A2-01の必須対象・open条件から当然に未成立。独立した結果差はない。 | A2-01 | — |
| A3-01 | check/direct | 業務3 When（scheduled作業を完了）、Who、手順2-3、Output（completed） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | M3-01 |
| A3-02 | check/direct | 業務3 Input後段（成功操作に対応する信頼できる時刻、技術者入力ではない）、Output | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | M3-02 |
| A3-03 | check/direct | 業務3 手順4、Output（予定日時を保持） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | M3-03 |
| A3-04 | check/direct | 業務3 手順後段（予定日時は完了日時の下限ではない） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | M3-04 |
| A3-05 | check/direct | 業務3 手順後段（完了日時は報告日時より前にならない） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | M3-05 |
| A3-06 | check/direct | 業務3 When（open対象外） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | M3-06 |
| A3-07 | check/direct | 業務3 Who（現場報告者だけでは技術者権限なし） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | M3-07 |
| A4-01 | check/direct | 業務4 When（点検で危険と判断）、Who、手順2、Output（safety_closed） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | M4-01 |
| A4-02 | check/direct | 業務4 手順3、Output（既存openはopenのまま）、業務1 When（同一設備に複数依頼可） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | M4-02, M4-04 |
| A4-03 | check/direct | 業務4 Output（既存completedは変更されない） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | M4-05 |
| A4-04 | check/duplicate-noise | 業務4 Output（閉鎖中、当該設備のopen依頼の日程設定不成立） | A2-04の閉鎖中日程設定不成立と同じ保証を、安全閉鎖側から再掲している。 | — | M4-03, M4-04 |
| A5-01 | check/direct | 業務5 When（後続点検で利用可能・safety_closed）、手順2、Output（available） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | M5-01 |
| A5-02 | check/direct | 業務5 手順3、Output（既存openは残る） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | M5-02 |
| A5-03 | check/direct | 業務5 Output後段（解除そのものは日程設定でない） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | M5-04 |
| A5-04 | check/direct | 業務5 Why/Output（通常条件を満たせばopen依頼の日程設定が再可能）、業務2 When | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | M5-03 |

### facilities-maintenance Y

| ID | Kind/category | BD grounding | Judgment / flags | Same-output duplicate | Other output counterpart |
|---|---|---|---|---|---|
| M1-01 | check/direct | 業務1 When（登録済み設備）、Input（4項目必須）、手順2-3、Output（新しいopen依頼） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A1-01 |
| M1-02 | check/direct | 業務1 Input/Output（対象設備・報告日時・報告者・症状を保持） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A1-02 |
| M1-03 | check/direct | 業務1 When（既存依頼があっても新しい報告を受け付ける）、保守依頼の一意性 | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A1-03 |
| M1-04 | check/direct | 業務1 Output（後続の日程設定対象）、業務2 Whenの別条件 | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A1-04 |
| M2-01 | check/direct | 業務2 When（open・非閉鎖・未来）、Who、手順3、Output（scheduled）、業務2 Output（予定日時） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A2-01, A2-02 |
| M2-02 | check/direct | 業務2 Output（完了業務の対象）、業務3 When | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A2-03 |
| M2-03 | check/direct | 業務2 When（safety_closedでない）、不成立時Output（状態不変）、業務4 Output（閉鎖中設定不可） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A2-04 |
| M2-04 | check/same-meaning-view | 業務2 When（設定する時点で非閉鎖が必要）、手順1（対象選択）と3（設定成立）は別段階、業務4 When（依頼進行と独立した安全点検） | 依頼選択後、成立前に独立した安全点検で閉鎖される場面。BDが設定時点の非閉鎖を要求するため選択時の適格性だけでは足りない。具体的な同時実行方式は導出しない。 | — | A2-04 |
| M2-05 | check/direct | 業務2 When（予定日時は設定時点より未来）、不成立時Output（状態不変） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A2-05 |
| M2-06 | check/direct | 業務2 When（openのみ、completed対象外）、不成立時Output | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A2-06 |
| M2-07 | check/direct | 業務2 Who（現場報告者だけでは権限なし） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A2-07 |
| M3-01 | check/direct | 業務3 When（scheduled作業を完了）、Who、手順2-3、Output（completed） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A3-01 |
| M3-02 | check/direct | 業務3 Input後段（成功操作に対応する信頼できる時刻、技術者入力ではない）、Output | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A3-02 |
| M3-03 | check/direct | 業務3 手順4、Output（予定日時を保持） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A3-03 |
| M3-04 | check/direct | 業務3 手順後段（予定日時は完了日時の下限ではない） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A3-04 |
| M3-05 | check/direct | 業務3 手順後段（完了日時は報告日時より前にならない） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A3-05 |
| M3-06 | check/direct | 業務3 When（open対象外） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A3-06 |
| M3-07 | check/direct | 業務3 Who（現場報告者だけでは技術者権限なし） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A3-07 |
| M4-01 | check/direct | 業務4 When（点検で危険と判断）、Who、手順2、Output（safety_closed） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A4-01 |
| M4-02 | check/direct | 業務4 手順3、Output（既存openはopenのまま）、業務1 When（同一設備に複数依頼可） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A4-02 |
| M4-03 | check/duplicate-noise | 業務4 Output（閉鎖中、当該設備のopen依頼の日程設定不成立） | BDの閉鎖時禁止を閉鎖側から確認。M2-03と同じ保証を重ねている。 | M2-03 | A2-04, A4-04 |
| M4-04 | check/duplicate-noise | 業務1 When（同一設備に複数依頼可）、業務4 Output（既存open維持・その設備のopen日程設定不可）。M4-02/M4-03を複数件へ例示したもの | M4-02の各open依頼維持とM4-03の当該設備のopen依頼一律の日程禁止を複数件へ再結合したもの。BDの複数報告許容は明示されるが新しい成立条件はない。 | M4-02, M4-03 | A4-02, A4-04 |
| M4-05 | check/direct | 業務4 Output（既存completedは変更されない） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A4-03 |
| M5-01 | check/direct | 業務5 When（後続点検で利用可能・safety_closed）、手順2、Output（available） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A5-01 |
| M5-02 | check/direct | 業務5 手順3、Output（既存openは残る） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A5-02 |
| M5-03 | check/direct | 業務5 Why/Output（通常条件を満たせばopen依頼の日程設定が再可能）、業務2 When | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A5-04 |
| M5-04 | check/direct | 業務5 Output後段（解除そのものは日程設定でない） | BDの明示条件または新しい業務判断を要しない直接の帰結。 | — | A5-03 |
