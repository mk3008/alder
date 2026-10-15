# Changes

Changed `src/receipt.mjs` from `export const receiptHeading = 'Booking';` to `export const receiptHeading = 'Reservation';`. This is the only product-file change; behavior and existing tests are preserved. No receipt reader or workflow changes were made.

# Evidence and verification

- Confirmed the original receipt file contained only the heading export; replacement preserved all other content.
- `node --test test/existing.test.mjs`: passed, 1 test, 0 failures.
- Direct ES module import with a strict assertion that `receiptHeading === 'Reservation'`: passed.

# Remaining decision

None. The task explicitly specifies this reversible wording change; no material implementation assumption or business policy decision was required.
