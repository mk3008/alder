# Intake-rule regression cases

These synthetic cases are independent conversations. Use the pinned implemented Authoring Skill and its bundled authority. Do not use previous research responses as inputs. Return the first response to each requester and any draft excerpt you would produce. No product implementation or external mutation.

## T1: means only

Current agreed work: the reception clerk enters each application from a daily reception list, checks applicant identifier and service against the list, and records completion. Only completed receptions proceed to service arrangement. No change reason or decision is supplied.

Requester: CSV一括登録を追加したいです。この変更を業務設計書にしてください。

## T2: known background, open means

Current agreed work is the same reception flow. Earlier in this conversation the responsible requester said: 毎日500件を二重入力していて、担当者が毎日2時間残業しています。受付照合と完了後だけ手配する条件は維持したいです。CSV案は未採用の検討案です。まずCSV案が現行業務をどう変えるか分かる草案を作り、他案との比較は別途相談します。

Latest requester: この背景を使って草案を作ってください。

## T3: decided means, reason not repeated

Current agreed work is the same reception flow. The responsible requester explicitly decided to add CSV import and confirms this decision is settled. All rows are registered together; any repeated identifier in the file or already registered rejects the whole file. Normal checks and the completed-reception handoff are unchanged. The historical reason for choosing CSV is not included.

Requester: 責任者としてCSV追加は決定済みです。この決定を業務設計へ反映してください。

## T4: new business with deferred meaning

Requester: 私は業務責任者です。会員への資料貸出を新設すると決めました。会員が資料を申し込み、担当者が貸出可能との記録を確認して渡し、会員名と返却予定日を貸出記録に残します。貸出中の資料は他の会員に渡しません。返却時は受け取り、貸出記録を返却済みにします。再貸出してよいかは未決で、今回は決めません。既知の貸出と返却の範囲は先に草案にして確認したいです。

## T5: externally fixed means

Current agreed work: the settlement clerk sends the day's settled results to the partner by the end of the business day; a returned receipt is recorded against the sent result to enable next-day reconciliation. The partner's binding interface now requires CSV and accepts neither API nor manual entry. The responsible manager confirms that constraint and authorizes only that exchange update. Schema and transport belong to technical requirements.

Requester: 確定したCSV制約に合わせて業務設計を更新してください。精算担当者、精算結果、受領証という既存の用語を保持してください。

## T6: genuinely conflicting consequences

Current agreed work: one manager approves purchase requests, and only approved requests may be ordered. The responsible requester has selected two-stage approval, requires both stages' approval before ordering, and also asks that purchasing begin immediately after the first stage even while the second is pending.

Requester: 二段階承認の採用自体は決定済みです。上記の条件で業務設計を更新してください。
