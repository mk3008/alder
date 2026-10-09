# Check review

Current Activity: ACT-RECEIVE
Next Check: [CHECK-001](#check-001)

## Business index

- [ACT-RECEIVE Receive request](#act-receive)
- [ACT-ROUTE Route request](#act-route)
- [Unassigned](#unassigned)

## Current review

- [CHECK-001](#check-001)
- [CHECK-002](#check-002)
- [CHECK-003](#check-003)

## ACT-RECEIVE

- [CHECK-001](#check-001)
- [CHECK-002](#check-002)
- [CHECK-003](#check-003)

## ACT-ROUTE

- [CHECK-002](#check-002)
- [CHECK-003](#check-003)
- [CHECK-004](#check-004)
- [CHECK-005](#check-005)

## Unassigned

- [CHECK-006](#check-006)

## Check items

### CHECK-001

- Title: Accept a complete request
- Condition: all of (AND)
  - Request supplied
  - Required fields complete
- Expected result: The request is accepted.
- Human review state: 未レビュー
- [Supporting detail for CHECK-001](#detail-check-001)

### CHECK-002

- Title: Deliver through an available channel
- Condition: any of (OR; one or more)
  - Registered address available
  - Delegated inbox available
- Expected result: The notice reaches an available channel.
- Human review state: 確認済み
- [Supporting detail for CHECK-002](#detail-check-002)

### CHECK-003

- Title: Route an active request
- Condition: all of (AND)
  - Request active
  - Any of (OR; one or more)
    - Recipient available
    - Queue monitored
- Expected result: The request reaches an eligible destination.
- Human review state: 要修正
- [Supporting detail for CHECK-003](#detail-check-003)

### CHECK-004

- Title: Clarify readiness
- Condition (relationship unresolved): Review complete; owner assigned
- Expected result: Unresolved: whether routing may begin.
- Human review state: 要確認
- [Supporting detail for CHECK-004](#detail-check-004)

### CHECK-005

- Title: Preserve exceptional acceptance
- Condition (relationship unresolved): Reviewer or delegate exclusively accepts; urgent requests first; blocked requests cannot proceed except with emergency approval
- Expected result: Acceptance preserves the recorded authorization and exception boundaries.
- Human review state: 確認済み
- [Supporting detail for CHECK-005](#detail-check-005)

### CHECK-006

- Title: Keep the receipt reference
- Condition: Receipt stored
- Expected result: The receipt reference is retained.
- Human review state: 未レビュー
- [Supporting detail for CHECK-006](#detail-check-006)

## Supporting detail

### Detail CHECK-001

- Business Design: BD-01
- Derivation: 明示
- AI confidence: 高
- Test/assertion: none
- Evidence gap: missing test evidence

### Detail CHECK-002

- Business Design: BD-02
- Derivation: 明示
- AI confidence: 高
- Test/assertion: TEST-02 / asserts registered delivery
- Evidence gap: partial: delegated inbox assertion missing

### Detail CHECK-003

- Business Design: BD-03
- Derivation: 強い導出
- AI confidence: 要精査
- Test/assertion: TEST-03 / asserts monitored queue destination
- Evidence gap: partial: recipient assertion missing

### Detail CHECK-004

- Business Design: BD-04
- Derivation: 考慮候補
- AI confidence: 要精査
- Test/assertion: none
- Evidence gap: candidate / unapproved
- Open question: Is readiness all-of, any-of, or a different relationship?

### Detail CHECK-005

- Business Design: BD-05
- Derivation: 明示
- AI confidence: 要精査
- Test/assertion: none
- Evidence gap: missing test evidence
- Presentation question (要確認): Confirm exclusive alternatives, priority ties, and the negation/exception boundary in Business Design before changing the condition.

### Detail CHECK-006

- Business Design: BD-06
- Derivation: 明示
- AI confidence: 高
- Test/assertion: TEST-06 / asserts receipt reference retained
- Evidence gap: none
- Mapping question (要確認): Which Activity owns this retained expectation?
