# Current accepted Business Rules — Stage 3 (self-contained)

This is the complete active rule text for Stage 3 workers. It excludes Stage 4+ packets and rules.

1. A Quotation has at most one source Order and an Order has zero or one source Quotation. `customer_order.quotation_id` is canonical.
2. New Quotation `expires_at` is strictly future. An open Quotation is business-expired when `now >= expires_at`, based on `expires_at` rather than a stale persisted status. Expired Quotations remain searchable/readable and cannot be used by an operation requiring an active Quotation.
3. Quotation creation requires at least one line. Duplicate product IDs are permitted; line order has no business significance.
4. Quotation-to-Order conversion requires an open, unexpired, unassociated Quotation. It atomically creates one canonical Order association, copies the snapshot below, and makes the Quotation `ordered`. `quotation.status = ordered` iff an Order references it; open/expired Quotations have no associated Order.
5. Quotation revision requires an open, unexpired, unassociated Quotation. Sales may change customer_id, expires_at, and lines, not quotation_id/status. Ordered or expired Quotations are read-only.
6. Every direct or sourced Order has at least one Order Line. Duplicate products are allowed; order has no line-order significance.
7. A sourced Order copies source customer_id, canonical source association, a new draft status, total from copied lines, and each line's product_id, quantity, and unit_price. Source expiry/status are not copied. The Order is a conversion-time snapshot.
8. An Order with total_amount at or above 1000.00 requires manager approval before Sales may confirm it. An Order below that threshold may be confirmed by Sales without manager approval. Approval/rejection is a manager activity.
9. The Order creator is an opaque trusted Sales identity stored in `customer_order.created_by` for direct and sourced Order creation. For an approval-required Order, a manager may not approve or reject it when `manager_id == created_by`. Another authorized manager may. Manager identity and role authorization come from a trusted authenticated surrounding boundary.
10. Confirmation is a Sales activity. The confirmer need not be the creator. Do not persist confirmer identity or add general audit history under current requirements.

Applicable Human Decisions: HD-001 through HD-010. `customer_id` and `product_id` remain opaque nonblank identifiers from an authorized surrounding system; invalid numeric values including NaN are rejected; exact deterministic search is sufficient.
