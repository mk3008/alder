# Evaluator-only expectations: synthetic field-role cases

Do not include this file in any reviewer's inputs. These are the fixture author's intended judgments for a designed synthetic regression exercise, not independently established ground truth. All organizations, roles, objects, agreements, and events are fictional. No private Business Design or user document was copied. This file records intended outcomes, not an executed model result or any new business approval.

## Intended coverage

The two input files mix cases with a localized field-role defect and cases that should be preserved. Each Case is a separate design; identical conventions do not create shared objects or operational connections.

- S01: The activity name says the configuration work begins at a later execution event, while the agreed scene begins on a change need. Check what the temporal phrase modifies rather than banning time words.
- S02: The configuration activity's When is borrowed from the later operation.
- S03: The configuration activity's Result claims completion of the later operation.
- S04: A later Activity swaps the actor and environment; the preceding Activity is coherent. Check beyond the first Activity and beyond What / When / Result.
- S05: A save action can be the correct When. A time-qualified setting can be the correct object of the activity name.
- S06: A saved-state modifier can identify the object correctly. A UI viewing activity can have a legitimate business purpose and a display-based completion state without a guarantee of human understanding.
- S07: An explicitly unresolved business decision remains unresolved, without converting it into a documentation error or silently deciding it.
- S08: Configuration and later execution may be separate, coherent Activities with their own starts, actors, inputs, outputs, and ending states. A time-qualified operational name is not inherently an error.

All Activities are intended to be checked against all field roles, including Why, Input, Procedure and Output. The cases sample several failures; they do not exhaustively mutate every field or prove that every possible field error is detected. Do not require a permanent all-field worksheet or force a finding for each Activity. Mentioning the complete scope plus grounded findings is sufficient evidence of the requested review output; it does not prove the reviewer's hidden process.

## Per-case intended judgments

### S01: 荷札の印刷条件

Location: Activity `仕分け完了時に荷札の印刷部数を設定する` (the What/name).

Expected: A required wording correction. `仕分け完了時に` grammatically places the setting work at the time the sorting finishes. The case's explicit facts say a change need starts the setting work, and sorting completion starts a later print operation. The When and Procedure correctly describe the setting scene. The disagreement is not fixed by preserving all source words somewhere in the document.

Minimal acceptable repair: `荷札の印刷部数を設定する`. `仕分け完了時に印刷する荷札の部数を設定する` is also acceptable if the temporal phrase clearly identifies the future print job rather than when the setting work occurs. The reviewer may explain that the simpler name is sufficient in this scope; it must not generalize that all What names must lose temporal or saved-state modifiers.

Do not: change When to sorting completion; add an approval, operator, or mandatory in-scope print Activity; reject the correct saved-setting Result; claim the original work actually prints labels. Reporting only a general warning about setting/execution separation, without locating the name mismatch, does not satisfy this case.

### S02: 空容器の振り分け設定

Location: `回収容器の振り分け先を設定する` → When.

Expected: A required field-content correction. Container arrival is the later conveyor's trigger. The agreed start of this configuration work is receipt of the change request, before intake. What, actor, environment, normal steps, outputs and the saved-setting Result are consistent with that work.

Minimal acceptable repair: `容器管理担当者が振り分け先変更依頼を受け取ったとき。`

Do not: move the setting task to arrival time, invent a new approval, or make adding the out-of-scope conveyor activity a prerequisite for a coherent configuration design.

### S03: 温室の散水時間

Location: `温室の散水時間を設定する` → Result.

Expected: A required field-content correction. The steps save a schedule, while the Result claims the next day's watering has already completed. The agreed scene explicitly says saving does not water and execution completion is known later. The mismatch is the ending state, not an absence of an execution procedure within this scope.

Minimal acceptable repair: `対象の温室の開始時刻と散水時間が保存され、後続の制御装置がその設定を参照できる。`

Do not: claim watering succeeded, add a watering step into this configuration activity, or create a mandatory approval or execution Activity to validate the saving scene.

### S04: 貸出用具の引き渡し

Location: The second Activity, `貸出用具を引き渡す` → Who and Where.

Expected: A required structural correction. The facts explicitly define `貸出担当者` as the actor and `備品窓口` as the place. The Procedure also names the actor. Who and Where have exchanged roles. Report these two cells as one linked defect or two related findings; finding count is not the score.

Minimal acceptable repair: Who `貸出担当者`; Where `備品窓口。`

The first Activity, `貸出用具の空きを確認する`, has no intended field-role defect. Waiting for pickup justifies the existing separation despite the same actor handling both. A review that inspects only the first Activity, or only What / When / Result, fails this coverage probe.

Do not: invent a new counter actor, change the responsibility, force the two Activities into one, or demand extra approval or identity verification explicitly outside this scene.

### S05: 開館時の照明

Expected: No required correction for field roles in the stated scene.

Why: The actual work is saving an already prepared lighting setting. The save operation is its explicit starting boundary, and the Result is saved settings available to a later lighting process. `開館時の照明設定` names which lighting configuration is saved; it does not say the save must occur at opening time. The setting can be saved earlier without changing its object or the work performed. The facts distinguish independently stored opening-time and closing-time settings, so the qualifier identifies the selected setting.

Do not: reject save operations as When in general; change When to opening time; require a separate pre-save business activity; remove `開館時` as a categorical rule; claim that lighting has turned on. A clearly optional style preference is not an incorrect mandatory finding, but unnecessary rewriting is not a success criterion.

### S06: 保存済みの座席図

Expected: No required correction for field roles in the stated scene.

Why: `保存済み` selects the information being viewed. The business purpose is making the diagram available before a later comparison. The UI viewing work has a defined actor, start, input and display output. Its Result says the diagram is available for reference, not that its reader has understood or approved the arrangement.

Do not: remove the saved-state modifier just because it refers to an earlier event; reject the Activity as “only UI”; add a comprehension check, approval, acknowledgement, or guaranteed understanding; insist that the out-of-scope comparison must occur before this Activity can finish.

### S07: 清掃周期の草案

Expected: No new required field correction. The known unresolved choice can be reported as a boundary/remaining business decision. It is not evidence that the stated trial-registration scene is contradictory.

Why: Whether existing cleaning plans will be regenerated remains explicitly undecided; the owner of the future decision is named. Trial registration can finish without applying any setting operationally. The Result preserves the unresolved state and claims only a saved trial proposal available for consideration.

Do not: choose retroactive or prospective application, add “approval complete” to Result, infer a real-world start while the input says operation remains paused, or require another permanent approval Activity. The reviewer may restate the decision that remains for the operation owner; no forced question count or repeated confirmation is required.

### S08: 開場時の案内曲

Expected: No required field correction for either Activity in the stated scene.

Why: The registration Activity starts with receipt of the selection proposal, stores the selected song and ends with a usable setting. The playback Activity starts on the opening signal, consumes that setting and the audio, and ends with one completed playback plus its history. Each name matches its Procedure and Result. `開場時` identifies the setting in the first name and the operational occasion in the second. The agreed facts distinguish opening-time and intermission songs, so the qualifier has a stated use.

Do not: merge the two Activities across the wait and actor change, turn the save into playback, remove all temporal qualifiers, change the trigger or responsibility, or add a listener-understanding guarantee.

## Scoring use and limits

For each case, record the finding that matches the intended defect, the quoted evidence, and any additional mandatory finding or unauthorized business decision. Distinguish optional, evidence-based simplification suggestions from false mandatory errors; an optional proposal is not itself a failure when it preserves the agreed meaning and scope. Keep missed defects and unwarranted mandatory corrections separate. Do not reduce results to total issue count.

Treat materially grounded disagreements with these intended judgments as evaluator discussion, not automatic model failure. In particular, verify that an alleged extra issue changes the described work under the explicit facts, rather than being an implementation edge case or a stylistic preference. If an input is ambiguous, revise the fixture openly and rerun; do not reinterpret the old result after seeing it.

A useful result would find the localized defects in S01–S04 while preserving the stated meanings in S05–S08. This outcome, even if observed, would support only this designed set at its pinned input and guidance versions. It would not establish real-project detection rates, prove model-internal coverage, or independently authorize adoption.
