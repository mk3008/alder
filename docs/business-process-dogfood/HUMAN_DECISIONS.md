# Human decisions

## HD-001 — Stage 1 quotation expiry

New Quotation `expires_at` must be strictly later than now. An open Quotation is business-expired when `now >= expires_at`; expiry is determined by `expires_at`, not stale persisted `status`. Expired Quotations remain searchable/readable but are unusable for an operation that requires an active Quotation. No other expiry effects are inferred. Materializing `status = expired` is implementation choice. A terminal/business state is not retroactively reinterpreted solely by clock passage.

## HD-002 — Stage 1 quotation lines

Quotation creation requires at least one line. Duplicate product IDs are permitted; line order has no current business significance.

## HD-003 — identifiers and performer scope

`customer_id` and `product_id` are opaque identifiers from an already-authorized surrounding system. Empty/whitespace-only values are invalid; no normalization or master-data validation is added. Sales is already authenticated and authorized. No audit matrix/trail is required absent later requirement.

## HD-004 — search and result contract

Search needs only the smallest deterministic contract required by current acceptance and cumulative activities: exact search by modeled identifiers and deterministic ordering. Pagination, fuzzy search, formatting, DTO/transport shape are implementation choices, not Business Rules.

## HD-005 — Quotation eligibility for Order creation

Quotation-to-Order conversion requires `status = open`, `now < expires_at`, and no existing `customer_order` reference. Conversion neither revives nor extends expiry.

## HD-006 — Post-conversion Quotation state and association invariant

Conversion atomically creates one canonical `customer_order.quotation_id` reference, copies HD-009 data, and sets Quotation status to `ordered`. `quotation.status = ordered` iff an Order references it; open/expired Quotations have no associated Order. The operation must not be partly visible. No DDL amendment is authorized merely because this cross-table invariant is not a simple FK constraint.

## HD-007 — Quotation revision policy

Revision requires open status, future expiry, and no associated Order. Expired/ordered Quotations are read-only. Sales may change customer_id, expires_at, and lines but not quotation_id/status. Existing line, expiry, identifier, duplicate, and order decisions continue to apply.

## HD-008 — Order line cardinality

Every direct or sourced Order has at least one Order Line. Duplicate product IDs are allowed; Order Line order has no business significance.

## HD-009 — sourced Order snapshot projection

Copy Quotation customer_id to Order customer_id; set canonical source association; create draft Order; compute total from copied lines; copy product_id, quantity, unit_price. Do not copy Quotation expires_at/status. Later Quotation changes never change the Order/lines. No DDL amendment is required.

## HD-010 — Order approval separation of duties

`confirmOrder` is a Sales activity. An authorized Sales performer confirms an Order after all applicable approval requirements are satisfied. An authorized Sales performer may confirm an Order below the approval threshold without manager approval. The confirmer need not be the Sales individual who created the Order.

Approval/rejection is a manager activity. Manager identity and manager-role authorization are supplied by a trusted, already-authenticated surrounding boundary. `manager_id` must not be accepted as an arbitrary impersonatable value from an untrusted caller.

For an Order requiring manager approval, the manager who approves or rejects it must not be the same individual who created it. Role names alone are insufficient: a person with both Sales and manager roles may not decide an Order that person created; another authorized manager may.

Order creator identity is required Business Data. `customer_order.created_by` records the opaque external identifier supplied by trusted authenticated Sales actor context for direct Order creation and Quotation-to-Order creation. No identity/user master data is created.

`order_approval.manager_id` records the trusted manager who decided. Approval/rejection is rejected when it equals `customer_order.created_by`. Current requirements do not require persisted confirmer identity, a creator/confirmer relation, general audit history, or `confirmed_by`.

## HD-011 — Approval-required Order enters pending approval at creation

Approval requirement is determined from the completed Order total when an Order is created. For direct Order creation and Quotation-to-Order creation, initial status is `pending_approval` when `total_amount >= 1000.00`, and `draft` when `total_amount < 1000.00`. Creating an approval-required Order itself places it into the manager's approval-waiting work; there is no separate Sales submit-for-approval Activity. This applies equally to direct and quotation-originated Orders unless a later requirement distinguishes them.

HD-011 supersedes only the initial-status portion of HD-009 that said every sourced Order is created `draft`. HD-009's customer, canonical association, copied-line, calculated-total, source-field-exclusion, and snapshot semantics remain active.

For high-value Orders, creation yields `pending_approval`; it cannot confirm while pending; an authorized manager other than its creator may approve/reject; approval yields `approved`; rejection yields `rejected`; confirmation requires approval and approval-satisfied status. For lower-value Orders, creation yields `draft`, manager approval is not required, and authorized Sales may confirm directly. The inclusive threshold is `total_amount >= 1000.00`. `rejected` cannot currently confirm; resubmission, revision-after-rejection, automatic cancellation, and new approval are not defined.

## HD-012 — No current business maximum for Order total

Current requirements set no business maximum for Order line count or aggregate total. Do not invent a maximum to fit the schema. Existing line constraints remain (`quantity > 0`, `unit_price >= 0`, with their current numeric input precision), but the aggregate must represent any total produced by otherwise-valid current Order Lines within PostgreSQL numeric capabilities.

Order total is `round(sum(quantity * unit_price), 2)` using exact decimal arithmetic: round once after summing exact line extensions. It is non-negative with at most two fractional digits. Approval eligibility compares this stored total to `1000.00`. JavaScript binary floating point is not authoritative.

For every Order, `total_amount` equals the rounded exact sum of its current Order Lines, is never negative, and determines approval eligibility. No Business Rule imposes a maximum Order total; PostgreSQL technical capacity is not a business maximum.

## HD-013 — Revising an approved Order invalidates its approval

Manager approval applies to the Order content present when it was made, including Order Lines, quantity, unit_price, and resulting total_amount. An effective revision of approved but unconfirmed Order content invalidates the approval even if total remains unchanged or remains above threshold. A no-op request need not invalidate approval.

After effective revision, total >= 1000.00 yields `pending_approval` and requires a new approval; total < 1000.00 yields `draft` and needs no approval. The threshold is inclusive. Delete/invalidate the current approval record within the revision transaction; current requirements do not require approval history, version numbers, audit tables, or new Business Data. Revision is only for approved, unconfirmed Orders by authorized Sales. It does not change a source Quotation or Quotation Lines. Rejected, draft, pending, confirmed, and cancelled lifecycle edits are not broadened.

## HD-014 — Inventory reservation result semantics

Commercial confirmation and inventory reservation are separate facts. Once `confirmOrder` succeeds, `customer_order.status = confirmed` is commercially final for Stage 5. Later reservation `reserved` or `failed` never cancels, reopens, rejects, redrafts, repends, or changes approval state.

Confirmation atomically leaves a confirmed Order with exactly one `inventory_reservation` in `requested`. `requested` means no authoritative result yet; `reserved` and `failed` mean trusted inventory-system success/failure respectively. Only trusted inventory-result context records either result; no persisted actor identity is required.

Stage 5 allows only `requested -> reserved` and `requested -> failed`. A conflicting later result cannot overwrite a terminal Stage 5 result. No retry, duplicate-delivery contract, recovery, re-request, release, failure reason, or post-failure commercial resolution is defined. `release_requested` and `released` are not current activities merely because they appear in DDL. Future interaction with later Activities is deferred.

## HD-015 — Sales may cancel an unshipped confirmed Order

Cancellation is a Sales activity. Authorized Sales may cancel only when `customer_order.status = confirmed` and `shipment_at IS NULL`. `shipment_at IS NOT NULL` is the authoritative local fact that actual shipment occurred; it is supplied by a trusted surrounding shipment/fulfillment boundary. Cancellation immediately makes the Order `cancelled`; it does not wait for inventory cleanup. No cancellation for draft, pending, approved, rejected, already-cancelled, or shipped confirmed Orders; no restore/reopen/uncancel behavior is defined.

## HD-016 — Inventory release semantics

A cancelled Order must not permanently retain inventory. Release is asynchronous from commercial cancellation. Cancelling a reserved reservation changes it to `release_requested`; cancellation after `failed` leaves it failed; cancellation while `requested` leaves it requested. A late trusted `failed` result on a cancelled requested reservation yields `failed`; a late trusted `reserved` result yields `release_requested`, never restores the Order to confirmed. Only trusted inventory context completes `release_requested -> released`.

Safety: cancelled Orders never return from cancelled due to inventory result; late reservation success is not ignored; outstanding cleanup remains represented until authoritative completion. Conditional liveness: subject to the external inventory boundary eventually producing requested results, completing processable release requests, and the application continuing to process events, each cancelled Order reaches failed or released. Permanent external outage is not claimed to release physical inventory; local release obligation must remain represented.
