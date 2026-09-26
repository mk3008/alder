# Acceptance instrument amendment 011 — cancellation eligibility probe

Date: 2026-09-05

The v3 Sol rereview found that its non-Sales cancellation assertion targeted an
already-cancelled Order. Lifecycle rejection could therefore mask a missing
Sales-role check. This is an acceptance-instrument defect, not a Business Rule,
DDL, or implementation amendment.

`cumulative-stage6-v4.test.js` retains every v3 scenario and adds a non-Sales
attempt while a different Order is still confirmed and unshipped, with a
non-mutation assertion. It also asserts non-mutation after shipped and draft
cancellation rejection. No Business Decision is added.

| artifact | SHA-256 |
| --- | --- |
| cumulative Stage 6 v3 | `2f2c4be1cdf35fb987d1d02fd0fb63293b802e3354f59ffbcbb17074e6a0794b` |
| cumulative Stage 6 v4 | `ff3503e9e5a33557ce675db9f3fc883ae377291be90534d1633040d539609e65` |
