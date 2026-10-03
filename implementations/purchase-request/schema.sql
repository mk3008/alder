CREATE TABLE IF NOT EXISTS purchase_request (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    applicant TEXT NOT NULL CHECK(length(trim(applicant)) > 0),
    item TEXT NOT NULL CHECK(length(trim(item)) > 0),
    quantity INTEGER NOT NULL CHECK(quantity > 0),
    requested_amount TEXT NOT NULL,
    reason TEXT NOT NULL CHECK(length(trim(reason)) > 0),
    submitted_at TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'submitted',
    approved_at TEXT,
    rejected_at TEXT,
    rejection_reason TEXT,
    purchased_at TEXT,
    actual_amount TEXT,
    CHECK (
        (status = 'submitted' AND approved_at IS NULL AND rejected_at IS NULL
         AND rejection_reason IS NULL AND purchased_at IS NULL AND actual_amount IS NULL)
        OR (status = 'approved' AND approved_at IS NOT NULL AND rejected_at IS NULL
         AND rejection_reason IS NULL AND purchased_at IS NULL AND actual_amount IS NULL)
        OR (status = 'rejected' AND approved_at IS NULL AND rejected_at IS NOT NULL
         AND rejection_reason IS NOT NULL AND length(trim(rejection_reason)) > 0
         AND purchased_at IS NULL AND actual_amount IS NULL)
        OR (status = 'purchased' AND approved_at IS NOT NULL AND rejected_at IS NULL
         AND rejection_reason IS NULL AND purchased_at IS NOT NULL AND actual_amount IS NOT NULL)
    )
) STRICT;
