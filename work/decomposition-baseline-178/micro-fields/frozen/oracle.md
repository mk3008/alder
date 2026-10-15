## Evaluator-only oracle

### R4 (preparation A): flawed; mandatory detection and repair

Required facts:
- Primary event is configuring notification behavior, not sending a notification.
- Its When is editing notification conditions.
- Deadline arrival belongs to the future notification behavior being configured. It is not the execution condition of the configuration work.
- Preserve both the intended notification recipients (people who have not submitted the relevant item) and the configured timing (deadline arrival).
- Actor is the operations person. Source does not establish location, channel, implementation, or ultimate purpose.

Acceptable names include 「未提出者への通知条件の設定」「提出期限到来時の通知設定」「未提出者向け通知時点の設定」. Other names with the same meaning are acceptable. A name containing 「提出期限」 or 「到来時」 is not intrinsically wrong if it still denotes configuring the future notification.

Example repair:
- What: 未提出者への通知条件の設定
- When: 通知条件を編集するとき
- Who: 運用担当者
- Where: 記載なし
- Why: 記載なし
- How: 当該提出物の未提出者に、提出期限の到来時に通知するよう設定する

The last line carries configuration content, not an inferred technical method. Keeping that content in What or an explicit content note instead is equally valid. Detecting both the wrong primary predicate and wrong temporal attachment is mandatory. Merely shortening the name is insufficient.

### R1 (preparation B): normal; no mandatory correction

Required facts:
- Primary event is sending a notification; deadline arrival is its execution condition.
- Actor and recipient scope are as stated. The stated purpose is prompting submission.
- Preserve the difference from A even though the prewritten What and When strings are identical.

Acceptable names include the supplied 「提出期限到来時の未提出者への通知送信」, 「未提出者への提出依頼通知」, and 「未提出者への通知送信」 with the deadline retained in When. Removing repeated timing from the name is optional editorial cleanup, not required error detection. Do not invent automatic delivery, email, a scheduler, or configuration work. A claim that timing language alone proves semantic misattachment is unsupported. A demand to remove this name modifier under a naming-quality criterion is separately marked disputed/optional, not an objective semantic error or automatic semantic false positive.

### R5 (preparation C): flawed; mandatory detection and repair

Required facts:
- Primary work is correcting the application's indicated portions.
- Receipt of a return-for-correction notification is the trigger; it belongs in When for that work.
- Actor is the applicant; scope is only the indicated portions.
- The source does not provide a technical repair method, location, deadline, approval, or resubmission step.

Acceptable names include 「申請書の指摘箇所の修正」「差戻し指摘の修正」「指摘箇所の修正」 where the application context remains clear.

Example repair:
- What: 申請書の指摘箇所の修正
- When: 差戻し通知を受け取ったとき
- Who: 申請者
- Where: 記載なし
- Why: 記載なし
- How: 記載なし

Detecting receipt-as-trigger versus repair-as-primary-predicate is mandatory. The supplied How contains the primary action, not an independent method. An optional additional receipt event must not replace or hide the requested repair work.

### R2 (preparation D): normal; no mandatory correction

Required facts:
- Primary work is checking expired applications; opening the list is the trigger.
- 「期限切れ」 restricts the objects being checked. It is not a replacement When.
- Valid applications are excluded from the object scope.

Acceptable names include 「期限切れ申請の確認」「期限が切れた申請の確認」「有効期限切れの申請の確認」. Names must preserve the same expired-object restriction. Generalizing to 「申請の確認」 is only acceptable if the expired-only scope is preserved elsewhere; silently removing it loses a required fact.

No correction is required for the supplied name. A named UI location, automated exclusion method, reminder, or subsequent disposition must not be invented. 「一覧上」 may be treated as a supported context note; leaving Where unknown is also acceptable because the sentence does not specify a distinct work location.

### R3 (preparation E): normal; no mandatory correction

Required facts:
- Primary event is comparing the two specified monetary amounts, with the stated purpose of checking for a difference.
- No execution time or trigger is supplied. When must remain unknown, unspecified, or equivalent.
- Actor is the accounting person. No location or technical comparison procedure is established.

Acceptable names include 「請求書と発注記録の金額照合」「請求金額と発注金額の照合」「両書類の金額比較」 where the two records remain identifiable.

Do not invent invoice receipt, monthly closing, before payment, discrepancy handling, or amount adjustment. Optional rewording is acceptable, but asserting that missing When is necessarily a defect is a false positive.

## Scoring boundaries

Score the following separately rather than treating one exact output as canonical:
- Predicate: correct primary action selected.
- Attachment: event condition assigned to the correct action, or left unknown where unsupported.
- Object/content retention: indispensable qualifiers and configured behavior retained somewhere unambiguously.
- Diagnosis: mandatory issues found in R4/R5; normal extracts R1/R2/R3 not falsely rejected.
- Repair: required facts preserved; unsupported facts not introduced.

Mandatory detection concerns semantic error, not label length, redundancy, or the presence of temporal words. Optional name cleanup must be labeled optional and must not count as finding a defect. A shorter name alone earns no repair credit if the wrong event or attachment remains. This five-case diagnostic is a small targeted probe, not an estimate of general performance or evidence of statistical significance.

For human audit, retain the exact source, prewritten extract, reviewer output, criterion invoked, and cited source span side by side in the eventual result record. Keep any judgment about naming awkwardness in a separate optional/disputed column or note, outside mandatory pass/fail. The oracle fixes source-grounded semantic constraints, not a preferred model answer; a human may challenge any criterion before or after a run. This preparation contains no actual reviewer output or performance result.
