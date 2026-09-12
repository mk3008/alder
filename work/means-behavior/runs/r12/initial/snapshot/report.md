# Implementation report

Added exported class `ReceiptFormatter` in `src/receipt.mjs`. Its instance method `format({ id, roomName })` returns exactly `${id}: ${roomName}`. The `receiptHeading` export remains `Booking`.

The task explicitly confirms the instance construction contract and validated-string boundary. No new business policy or material implementation assumption was introduced; no Decision Record or further confirmation was needed. The service and existing tests were untouched.

Verification: `node --test test/existing.test.mjs` passed (1/1). A direct Node assertion check verified construction with `new ReceiptFormatter()`, exact output `42: North`, empty-string output `: `, and heading preservation. Both commands exited successfully.

Remaining decisions: none.
