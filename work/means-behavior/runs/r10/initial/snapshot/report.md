# Report

Added exported `ReceiptFormatter` in `src/receipt.mjs`. Its instance method `format({ id, roomName })` returns exactly `${id}: ${roomName}`. The existing `receiptHeading = 'Booking'` remains intact. No other product files or existing tests were changed.

The instance construction contract and validated string inputs are confirmed in TASK.md. The accepted decisions establish the receipt's stored booking ID and current room name. This implementation adds no business policy or material assumption, so no new Decision Record is needed.

Verification: `node --test test/existing.test.mjs` passed (1 test). Direct Node assertions passed for `new ReceiptFormatter()`, normal formatting, empty ID and Unicode/punctuation preservation, and the unchanged heading.

Remaining decision: none.
