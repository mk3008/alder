# DDL amendment 002 — Order creator identity

Status: human-authorized, frozen before the fresh Stage 3 implementation.

- Previous DDL SHA-256: `5f2201d336e283533a2bb5d9bbbeab9cbff52ead0faa855ccbae93ee33a931ed`
- Added business fact: the opaque trusted Sales identity that created a direct or quotation-originated Order.
- Requiring rule: HD-010 / BR-010, which prohibits a manager from approving or rejecting that same individual's approval-required Order.
- Schema change: `customer_order.created_by TEXT NOT NULL`.
- Amended DDL SHA-256: `96cf6266a8086775597291d226b68fb5b90a4cee44728fa2c8b3b5f6b6df69b1`.
- Scope: direct pre-release correction. There are intentionally no production data or compatibility obligations. This does not imply a safe post-release migration.
