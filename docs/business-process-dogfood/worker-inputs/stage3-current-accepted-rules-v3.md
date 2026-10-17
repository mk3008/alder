# Current accepted Business Rules — Stage 3 (self-contained, HD-012)

This is complete active rule text for the fresh Stage 3 resolution worker. It excludes Stage 4+.

1. A Quotation has at most one source Order and an Order has zero or one source Quotation. `customer_order.quotation_id` is canonical.
2. New Quotation expiry is strictly future. An open Quotation is business-expired at `now >= expires_at`, remains readable/searchable, and cannot be used by an operation requiring an active Quotation.
3. Quotation creation requires at least one line. Duplicate product IDs are permitted; line order has no current business significance. Customer/product IDs are opaque nonblank authorized-system identifiers. Invalid numeric input including NaN is rejected.
4. Quotation-to-Order conversion requires an open, unexpired, unassociated Quotation. It atomically creates canonical association, copies the source snapshot, and makes the Quotation ordered. `quotation.status = ordered` iff an Order references it.
5. Quotation revision requires an open, unexpired, unassociated Quotation. Sales may change customer_id, expires_at, and lines, not identifier/status. Ordered and expired Quotations are read-only.
6. Every direct or sourced Order has at least one Order Line. Duplicate products are allowed; line order has no business significance.
7. A sourced Order copies customer_id, canonical source association, each product_id/quantity/unit_price, and a total from copied lines. It does not copy Quotation expiry/status. It is a conversion-time snapshot. Its initial status follows rule 10, superseding only HD-009's former universal draft wording.
8. Creator identity is opaque trusted Sales identity stored in `customer_order.created_by` for direct and sourced creation. An approval-required Order cannot be approved/rejected by a manager whose identity equals created_by. No confirmer identity or audit history is required.
9. Confirmation is a Sales activity. The confirmer need not be the creator. Trusted actor identity and role authorization come from a surrounding authenticated boundary.
10. Initial status derives from completed exact Order total: `pending_approval` for `total_amount >= 1000.00`; `draft` below 1000.00. Creation itself places high-value Orders into manager approval work; there is no separate submit-for-approval Activity.
11. A high-value Order cannot confirm while pending. A manager other than its creator may approve (`approved`) or reject (`rejected`). Confirmation is permitted only for an approval-satisfied high-value Order. A lower-value draft Order can confirm directly. A rejected Order cannot currently confirm. No resubmission/revision-after-rejection/automatic cancellation/new-approval policy is defined.
12. Every Order total is `round(sum(quantity * unit_price), 2)` using exact decimal arithmetic, is non-negative, has at most two fractional digits, and determines approval eligibility. No Business Rule sets a maximum aggregate Order total.

Applicable Human Decisions: HD-001 through HD-012. Exact deterministic search is sufficient; pagination/fuzzy/transport concerns are implementation freedom.
