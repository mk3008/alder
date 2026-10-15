# Report

Changed `src/receipt.mjs` from `export const receiptHeading = 'Booking';` to `export const receiptHeading = 'Reservation';`.

The product change is limited to that string value. No reader, service behavior, availability/booking workflow, or existing tests were changed.

Verification:
- `node --test test/existing.test.mjs`: 1 passed, 0 failed.
- Direct Node import and strict equality assertion confirmed `receiptHeading === 'Reservation'`.

No material implementation assumption, Decision Record, or remaining human decision was needed.
