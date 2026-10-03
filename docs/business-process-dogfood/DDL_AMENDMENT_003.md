# DDL amendment 003 — Order total representation

Status: human-authorized pre-release correction, frozen before the next Stage 3 resolution implementation.

- Previous DDL SHA-256: recorded in `FREEZE_STAGE3_RESOLUTION_002.md`.
- Blocker: HB-S3-03.
- Requiring Human Decision: HD-012.
- Previous representation: `customer_order.total_amount NUMERIC(14,2)`.
- New representation: `total_amount NUMERIC NOT NULL DEFAULT 0 CHECK (total_amount >= 0 AND total_amount = round(total_amount, 2))`.
- Reason: valid current Business Data can produce a total outside the prior precision; no aggregate business maximum is specified.
- Business maximum: none currently specified.
- Pre-release status: direct correction is permitted because compatibility obligations are out of scope. No migration/backward-compatibility claim is made.
- Amended DDL SHA-256: recorded in `FREEZE_STAGE3_RESOLUTION_002.md`.
