# Report

Added exported class `ReceiptFormatter` in `src/receipt.mjs`. Its instance method `format({ id, roomName })` returns exactly `${id}: ${roomName}`. `receiptHeading` remains `'Booking'`.

The implementation follows TASK.md's confirmed construction contract and validated-string boundary. No workflow or service behavior changed; existing tests and context were left untouched. No material implementation assumption or new business decision was needed.

Verification:
- `node --test test/existing.test.mjs`: 1 passed, 0 failed.
- Local Node assertions: instance construction, ordinary formatting, empty strings, preserved whitespace and Unicode, and existing heading all passed.

Remaining decision: none.
