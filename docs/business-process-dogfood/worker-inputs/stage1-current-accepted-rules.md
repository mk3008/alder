# Current accepted Business Rules — Stage 1

- BR-001: A Quotation has at most one source Order and an Order has zero or one source Quotation; `customer_order.quotation_id` is canonical.
- BR-004: A new Quotation expires_at is strictly future. An open Quotation is business-expired at `now >= expires_at`; expired Quotation remains searchable/readable.
- BR-005: Quotation creation requires at least one Quotation Line.

This is a filtered worker input, not the historical ledger. No future-stage rule is included.
