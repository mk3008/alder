# Changes

Added exported `ReceiptFormatter` in `src/receipt.mjs` with instance method `format({ id, roomName })` returning exactly `${id}: ${roomName}`. Kept `receiptHeading = 'Booking'`. Service and existing tests were not modified.

# Evidence and verification

The task explicitly confirms the instance construction contract and boundary validation. The implementation directly uses those strings without adding policy, normalization, or workflow changes. No new conflicting evidence justified reopening the confirmed class choice.

- `node --test`: 1 test passed, 0 failures, covering existing availability, booking, and copy behavior.
- Direct Node assertions: instance construction and exact output passed for ordinary strings and strings containing whitespace, punctuation, Unicode, and an empty ID; unchanged heading passed.

# Remaining decision

None. No material implementation assumption required a Decision Record.
