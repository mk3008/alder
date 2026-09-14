# Blockers

## Stage 1 — resolved by HD-001 through HD-004

Fresh Sol review found expiry semantics, line cardinality, identifier/performer scope, and DDL association ambiguity. Human decisions are appended in `HUMAN_DECISIONS.md`; canonical association required `DDL_AMENDMENT_001.md`. Search and serialization details are now recorded as non-blocking implementation choices under the prospective blocker calibration.

## Stage 2 — HUMAN_BLOCKER

First observable stage: Stage 2 cross-activity consistency review. No Stage 2 refactoring or Stage 3 work is authorized.

1. **under-specification — Quotation to Order eligibility/lifecycle**: requirements do not say whether business-expired, persisted `expired`, or `ordered` Quotation may source an Order. A choice changes allowed state transitions.
2. **under-specification — post-conversion Quotation state**: requirements do not say whether successful conversion changes Quotation status to `ordered`, or what invariant relates status and canonical Order association.
3. **under-specification — Quotation revision policy**: editable fields and eligible Quotation states are undefined; this changes allowed transitions and expiry interpretation.
4. **under-specification — direct Order line cardinality**: zero Order Lines are DDL-permitted and implementation-permitted, but business cardinality is not defined.
5. **under-specification / conditional data-model insufficiency — copied header projection**: “then-current header” is undefined. If it includes expiry/status, the frozen Order schema lacks fields/meaning for that snapshot; no schema change is made pending decision.

Non-blocking implementation defect: Quotation header and lines are read in separate queries and can be non-snapshot-coherent during concurrent revision. This is fixable only after the blocker set is resolved and does not determine any policy.

## Stage 2 — resolved by HD-005 through HD-009

The blocked implementation remains historical, not adopted. No DDL amendment is authorized. A fresh resolution run must implement decisions and fix the non-policy coherent-snapshot defect before review.

## Stage 3 — HUMAN_BLOCKER

First observable stage: Stage 3 cross-activity review. No Stage 3 refactoring or Stage 4 work is authorized.

**HB-S3-01 — under-specification / performer authority and confirmation ownership**

- Affected activities: manager approval/rejection; Order confirmation.
- Affected data: `customer_order`, `order_approval`.
- Facts: Sales and manager are distinct performers; manager makes approval decisions; confirmation performer and meaning of distinction are unspecified. Current API has no confirmation performer and accepts supplied manager ID.
- Why not entailed: role-level separation externally enforced and individual-identity separation persisted/enforced are both compatible with current facts.
- Minimum decision: identify confirmation performer; state whether distinction is role-only or individual-level; state whether manager identity/authorization is supplied by an already-authorized surrounding system.
- Conditional schema impact: individual-level/persisted confirmation or Sales-vs-manager identity enforcement requires actor facts absent from frozen DDL. Role-level external authorization without audit can use current DDL.
- Code/schema intentionally not changed: no actor schema, authorization matrix, confirmer record, or identity comparison.
# Active blockers

## HB-S3-02 — High-value sourced Order initial state is inconsistent

- Stage: 3 resolution review
- Evidence head: `749f4b55ee17056891c681afd3e33c70fd690215` (implementation snapshot is unadopted pending decision)
- Classification: `HUMAN_BLOCKER — inconsistency`
- Discovery provenance: `latent_cross_activity`
- Affected activities: quotation-to-Order conversion, direct/sourced Order creation, approval-waiting search, manager decision, Sales confirmation.
- Affected Business Rules: sourced Order snapshot rule (new draft status), approval threshold/confirmation rule.
- Affected tables/data: `customer_order.status`, `customer_order.total_amount`, `order_approval`.
- Current DDL sufficiency: sufficient for either viable policy; existing status values include `draft` and `pending_approval`.
- Exact inconsistency: the active sourced-Order snapshot rule says conversion creates a new `draft` Order, while the Stage 3 implementation automatically makes every Order at or above 1000.00 `pending_approval`. If high-value Orders must begin `draft`, the process lacks a defined performer/activity/transition that submits them for approval; confirmation must also prevent a high-value draft from bypassing approval.
- Viable alternatives: (1) amend the sourced-Order snapshot rule so high-value Orders become `pending_approval` at creation; or (2) retain `draft` for all and define the required submission transition/authority and its confirmation precondition.
- Minimum Human Decision: define the initial status/transition for a high-value sourced Order and the corresponding confirmation eligibility invariant.
- Intentionally not performed: no code repair, DDL amendment, acceptance amendment, refactoring, or later-stage work.
- Current cumulative acceptance: 2/2 pass, but the review found incomplete coverage; it is not sufficient to resolve this contradiction.
- Adopted/unadopted status: `work/business-process-dogfood/runs/stage3/resolution-rerun-1/` is **unadopted**.

## HB-S3-03 — Order total amount has no representable upper bound

- Stage: 3 resolution review
- Evidence head: `749f4b55ee17056891c681afd3e33c70fd690215` (implementation snapshot is unadopted pending decision)
- Classification: `HUMAN_BLOCKER — data-model insufficiency`
- Discovery provenance: `latent_cross_activity`
- Affected activities: Quotation line creation, direct/sourced Order creation, approval threshold.
- Affected Business Rules: quotation and Order line cardinality/duplicate rules, Order total/approval rule.
- Affected tables/data: `quotation_line.quantity`, `quotation_line.unit_price`, `order_line.quantity`, `order_line.unit_price`, `customer_order.total_amount`.
- Current DDL sufficiency: insufficient for the currently uncapped valid line domain. Two valid `NUMERIC(14,2)` lines with quantity 1.00 and unit price 999999999999.99 total 1999999999999.98, which cannot be stored in `customer_order.total_amount NUMERIC(14,2)`.
- Exact unresolved facts: no business maximum for Order total, line count, quantity, or unit price exists; duplicate products are allowed and line count is unbounded.
- Viable alternatives: (1) widen `customer_order.total_amount`; or (2) define business limits that bound aggregate total and enforce them at every relevant entry. The choice cannot be made from the existing requirements.
- Minimum Human Decision: choose the business representation/range policy for Order total and, if limits are chosen, state the limits.
- Intentionally not performed: no code repair, DDL amendment, acceptance amendment, refactoring, or later-stage work.
- Current cumulative acceptance: 2/2 pass, but it lacks the numeric representation boundary.
- Adopted/unadopted status: `work/business-process-dogfood/runs/stage3/resolution-rerun-1/` is **unadopted**.

## Non-blocking defects retained for resolution after decisions

| finding | classification | provenance | action deferred |
| --- | --- | --- | --- |
| `confirm` currently permits any `draft` Order, so a high-value draft could bypass approval if the human selects a draft-first policy | implementation defect | latent_cross_activity | repair after HB-S3-02 determines the intended transition |
| fixed 2030/2031 success timestamps will eventually invalidate an otherwise correct frozen fixture | implementation defect | explicitly_cued | amend acceptance instrument after blocker decisions; no business rule change needed |
| current Stage 3 cumulative suite is not yet complete for all active rules (threshold boundary, approval search/role, high-value sourced state, full snapshot fields, expiry eligibility, association/atomicity, deterministic search, numeric boundary) | implementation defect | explicitly_cued | expand after both blockers are decided; do not infer policy while doing so |

## Screened non-finding

The trusted `{ id, role }` actor context is not classified as a business blocker in this fixture. HD-010 puts authentication/authorization at a trusted surrounding boundary; no untrusted transport is in scope. This is `non_business_false_positive` unless such a context is later exposed directly to an untrusted caller.

## HB-S4-01 — Approval validity after approved Order revision

- Stage: 4, exposed before implementation.
- Evidence head: `bd7453297283c2563e4fbea0cadb57779414a8bf`.
- Classification: `HUMAN_BLOCKER — under-specification`.
- Discovery provenance: `explicitly_cued`.
- Affected activities: Sales Order revision, manager approval, Sales confirmation.
- Affected rules/data: approval lifecycle (BR-011/BR-012/BR-013), `customer_order.total_amount/status`, `order_line`, `order_approval`.
- Current DDL sufficiency: conditional. Current schema records decisions but does not itself state whether a decision remains valid after line/total change; depending on the decision, revision/version/approval linkage data may become necessary.
- Exact unresolved fact: Stage 4 permits revision of an approved unconfirmed Order and says its total can change, but does not state whether the existing approval remains valid, is invalidated, or must be reacquired (including when value crosses the inclusive threshold).
- Viable alternatives: retain approval under stated conditions; invalidate and return to pending approval; or prohibit/limit revision. Exact policy and any required data must be decided by a human.
- Minimum Human Decision: define approval validity and required state transition after approved-Order revision, including threshold crossing.
- Intentionally not performed: Stage 4 implementation, DDL amendment, acceptance freeze for undecided policy, refactoring, and later-stage work.
- Current cumulative acceptance: Stage 3 v4 is 3/3 pass; Stage 4 has no executable acceptance for this undecided policy.
- Adopted/unadopted status: Stage 3 refactoring is adopted; Stage 4 has no implementation snapshot.

## HB-S5-01 — Reservation result semantics and authority

- Stage: 5, exposed before implementation.
- Evidence head: current Stage 4 adopted state.
- Classification: `HUMAN_BLOCKER — under-specification`.
- Discovery provenance: `explicitly_cued`.
- Affected activities: Sales confirmation, inventory reservation request, asynchronous reservation result handling.
- Affected rules/data: confirmation eligibility; `customer_order.status`; `inventory_reservation.status/requested_at`.
- Current DDL sufficiency: unknown until business outcome/authority are defined. State names alone do not define their meaning or transitions.
- Exact unresolved facts: who/what authority records asynchronous `reserved` or `failed`; what a failed reservation means for commercially confirmed Order; whether and how Order state changes after reserved/failed; permitted transitions from requested; required behavior if result arrives after other activity.
- Viable alternatives: retain commercial confirmation while recording reservation outcome; cancel/reopen/escalate Order; or another explicitly defined business process. No alternative is entailed by the packet.
- Minimum Human Decision: define reservation-result authority, allowed state transitions, and commercial Order consequences for `reserved` and `failed`.
- Intentionally not performed: Stage 5 acceptance freeze, implementation, schema amendment, refactoring, or later-stage work.
- Current cumulative acceptance: Stage 1–4 v2 is 4/4 pass. Stage 5 placeholder is not an executable acceptance test.
- Adopted/unadopted status: Stage 4 refactoring adopted; Stage 5 has no implementation snapshot.

## HB-S6-01 — Cancellation and inventory release semantics

- Stage: 6, exposed before implementation.
- Evidence head: current Stage 5 adopted state.
- Classification: `HUMAN_BLOCKER — under-specification`.
- Discovery provenance: `latent_cross_activity`.
- Affected activities: Order cancellation, inventory release request/result, asynchronous reservation result handling, shipment.
- Affected rules/data: `customer_order.status`, `shipment_at`, `inventory_reservation.status` including `requested/reserved/failed/release_requested/released`.
- Current DDL sufficiency: unknown until transitions, authority, and final-state semantics are defined.
- Exact unresolved facts: cancellation performer/eligibility; meaning of shipment and whether `shipment_at` is the cancellation boundary; who initiates/completes release; allowed release transitions; cancellation while reservation is requested; how a late reserved/failed result interacts with cancelled Order and required no-inventory outcome.
- Viable alternatives: cancellation may synchronously release, request async release, reject until reservation settles, or use another stated lifecycle. No option is entailed by the packet/DDL state names.
- Minimum Human Decision: define cancellation authority/eligibility, release-result authority/transitions, and race resolution guaranteeing the stated terminal inventory outcome.
- Intentionally not performed: Stage 6 acceptance freeze, implementation, DDL amendment, refactoring, or final review.
- Current cumulative acceptance: Stage 1–5 is 5/5 pass; Stage 6 placeholder is not executable.
- Adopted/unadopted status: Stage 5 refactoring adopted; Stage 6 has no implementation snapshot.

### Observer-only decomposition and provenance

| question | packet evidence | provenance |
| --- | --- | --- |
| A. cancellation performer/authority | omitted | uncertain |
| B. eligibility and authoritative meaning of “before shipment” | “before shipment” stated, fact mapping omitted | uncertain |
| C. release initiation/completion authority | release need stated, authority omitted | uncertain |
| D. reservation/release transition system | DDL names and release need stated, transitions omitted | uncertain |
| E. cancellation while requested | stated | explicitly_cued |
| F. late reservation result after cancellation | stated | explicitly_cued |
| G. environment assumptions behind “ultimately retain no inventory” | outcome stated, external progress assumptions omitted | uncertain |

This decomposition preserves the original blocker. The late-result race is not a latent discovery; the concrete authority/transition questions were not supplied by the packet.
