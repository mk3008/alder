# Current accepted Business Rules — Stage 5

All Stage 1–4 accepted rules remain active. Stage 5 adds only these rules; no Stage 6 material is included.

1. Successful Sales confirmation atomically leaves Order status `confirmed` and exactly one linked inventory reservation with status `requested`.
2. A trusted inventory-system boundary, not Sales/manager/arbitrary caller, may record `requested -> reserved` or `requested -> failed`.
3. Both `reserved` and `failed` leave Order `confirmed`; failure means inventory was not reserved, not that commercial confirmation was undone.
4. Terminal Stage 5 reservation results cannot be overwritten by a conflicting later result. No retry, duplicate-delivery, recovery, release, or future transition is defined.
