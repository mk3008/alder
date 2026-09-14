# Human-authorized DDL amendment 001

Original frozen DDL: commit `1e67a6f853985ffe9e50d37fb8c9efd9efc79257`.

Decision: `customer_order.quotation_id` is the sole canonical Quotation–Order association. The amended DDL removes `quotation.order_id` and its foreign key, retains nullable `customer_order.quotation_id`, and retains its unique constraint. Reverse navigation queries `customer_order.quotation_id`.

Reason: the original two independently writable nullable association columns did not guarantee reciprocal pairing and could not enforce BR-001.

This is an append-only human-authorized amendment. It is frozen before the required clean Stage 1 rerun.
