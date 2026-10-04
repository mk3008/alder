# Synthetic intake cases

Each case is a separate conversation. Facts do not carry between cases. All names and operations below are fictional.

## S1

Current agreed Business Design: The reception clerk receives application details in the daily reception list, enters each application in the register, checks that its applicant identifier and requested service match the list, and records reception as complete. A subsequent service clerk starts service arrangement only for completed receptions. No other operation is in scope. The manager records this Problem / Pain High: the reception clerk manually enters 500 applications every day and this repeated work is burdensome. No change has been approved.

Requester: 毎日500件手入力していて負担です。Alderで改善案を検討してください。

## S2

Current agreed Business Design: The reception clerk receives application details in the daily reception list, enters each application in the register, checks that its applicant identifier and requested service match the list, and records reception as complete. A subsequent service clerk starts service arrangement only for completed receptions. No other operation is in scope. A file format, workload, experienced problem, target outcome or approved change has not been supplied.

Requester: CSV一括登録を追加したいです。この変更をAlderの業務設計書にしてください。

## S3

Current agreed Business Design: A requester submits a purchase request including purpose, item and amount. One manager decides approve or reject, and the purchasing clerk places an order only for an approved request. The request records the decision and decision maker. No new approval policy or operational Problem has been supplied.

Requester: 承認を二段階にしたいです。この変更後の業務フローをAlderの業務設計書にしてください。

## S4

Requester: 私はこの業務の責任者です。新しく資料貸出業務を始めることを決定しました。既存業務の改善ではありません。目的は会員が保有資料を一時利用できるようにすることです。会員が資料を選んで申し込み、貸出担当者が貸出可能と記録されていることを確認して資料を渡し、会員名と返却予定日を貸出記録に残します。貸出中の資料は次の会員には渡しません。返却時に担当者が受け取り、返却済みと記録します。返却後に再貸出してよいかはまだ決めていません。その点は未確認として残して、今分かっている業務をAlder業務設計書にしてください。

## S5

Current agreed Business Design, version agreed-7, approved by the responsible operations manager: CSV import is an approved input channel. Reception imports the supplied list, rejects the entire file if any application identifier is repeated in that file or already registered, and otherwise registers all rows together. No partial registration is permitted. Success establishes that every row is registered once. The implementation task is to implement exactly this agreed meaning; technical choice is delegated. The relevant confirmation questions have already been resolved and recorded; no contradictory fact is present in this input.

Requester: 合意済みの業務設計 agreed-7 に従ってCSV一括登録を実装してください。

## S6

Current agreed Business Design: The settlement clerk sends the day's established settlement results to the partner by the end of each business day. The receiving party returns an acceptance receipt; the clerk records that receipt against the sent results. This exchange enables next-day reconciliation. The partner's binding interface specification now requires CSV transfer; API and manual entry are not accepted. The responsible manager confirms this constraint and authorizes updating only this exchange to comply. The business purpose is unchanged. The schema and transport settings will be supplied in technical requirements; no other new business policy is requested.

Requester: 取引先I/FがCSV必須になったので、この確定制約に合わせて業務設計を更新してください。
