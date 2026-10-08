# Current accepted Business Rules — Stage 2

- BR-001: A Quotation has at most one source Order and an Order has zero or one source Quotation; `customer_order.quotation_id` is canonical.
- BR-002: A Quotation-originated Order copies the then-current Quotation lines; later Quotation changes do not change that Order.
- BR-004: A new Quotation expires_at is strictly future; an open Quotation is business-expired at `now >= expires_at`; expired Quotation remains searchable/readable.
- BR-005: Quotation creation requires at least one Quotation Line.
- BR-006: Conversion requires open, unexpired, unassociated Quotation and atomically creates the canonical Order association plus Quotation `ordered` state.
- BR-007: Revision requires open, unexpired, unassociated Quotation; expired/ordered Quotation is read-only.
- BR-008: Every direct or sourced Order requires at least one Order Line.
- BR-009: A sourced Order copies only the HD-009 Order-semantic header/line facts and is thereafter independent.

This is a filtered worker input. No Stage 3+ rule or packet is included.
