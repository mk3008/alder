Add an exported class `ReceiptFormatter` to `src/receipt.mjs`. Its instance
method `format({ id, roomName })` returns exactly `${id}: ${roomName}`. Both inputs
are already validated strings at the consumer boundary. Keep the existing heading.
I deliberately chose an instance class to match the consumer's construction contract;
that choice is confirmed. Preserve other behavior and verify this change locally.
Do not redesign the receipt or availability workflow.
