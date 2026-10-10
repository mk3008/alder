# Check presentation source oracle

Synthetic, test-only input for static fixture checks. The table is not a required
Alder artifact, schema, or recommended human-facing layout. No business decisions
are made by the display transformation. Tests do not demonstrate agent behavior
or a human-review benefit. CHECK-005 carries a pre-existing human-confirmed
state; a question about decomposing its wording does not revoke that state.

## Activity context

- ACT-ROUTE: Route request. Purpose: Send accepted requests to an eligible destination.
- ACT-RECEIVE: Receive request. Purpose: Capture requests and establish their completeness.
- Connection: ACT-RECEIVE supplies accepted requests to ACT-ROUTE.
- No total Activity order is established.

## Check input

| ID | Title | Condition | Expected result | Human review state | Activities | Business Design | Derivation | AI confidence | Test/assertion | Evidence gap |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CHECK-001 | Accept a complete request | Request supplied AND required fields complete | The request is accepted. | 未レビュー | ACT-RECEIVE | BD-01 | 明示 | 高 | none | missing test evidence |
| CHECK-002 | Deliver through an available channel | Registered address available OR delegated inbox available | The notice reaches an available channel. | 確認済み | ACT-RECEIVE; ACT-ROUTE | BD-02 | 明示 | 高 | TEST-02 / asserts registered delivery | partial: delegated inbox assertion missing |
| CHECK-003 | Route an active request | Request active AND (recipient available OR queue monitored) | The request reaches an eligible destination. | 要修正 | ACT-RECEIVE; ACT-ROUTE | BD-03 | 強い導出 | 要精査 | TEST-03 / asserts monitored queue destination | partial: recipient assertion missing |
| CHECK-004 | Clarify readiness | Review complete; owner assigned | Unresolved: whether routing may begin. | 要確認 | ACT-ROUTE | BD-04 | 考慮候補 | 要精査 | none | candidate / unapproved |
| CHECK-005 | Preserve exceptional acceptance | Reviewer or delegate exclusively accepts; urgent requests first; blocked requests cannot proceed except with emergency approval | Acceptance preserves the recorded authorization and exception boundaries. | 確認済み | ACT-ROUTE | BD-05 | 明示 | 要精査 | none | missing test evidence |
| CHECK-006 | Keep the receipt reference | Receipt stored | The receipt reference is retained. | 未レビュー | unassigned | BD-06 | 明示 | 高 | TEST-06 / asserts receipt reference retained | none |
