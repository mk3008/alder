# Implementation report

Implemented `createReceiptReader(service, directory)` in `src/receipt.mjs`. Its synchronous reader validates a stored booking ID, recreates the mirror directory if absent, rebuilds `rooms.json` from `service.rooms()` on every valid receipt, reads the JSON, and returns `{ id, roomName }`. Missing/corrupt/stale mirrors are overwritten before reading, so renamed rooms appear immediately. The service dictionary and stored booking remain unchanged. Unknown bookings and missing referenced rooms fail; disk errors propagate as authorized.

Separately changed `receiptHeading` from `Booking` to `Reservation`.

Evidence: `src/receipt.mjs`, `test/receipt.test.mjs`, and `decisions/receipt-mirror.md`. Existing service code, existing tests, instructions, and context were preserved.

Verification: `node --test` passed all four tests (zero failures), including the unchanged existing availability/booking test and new checks for mirror recovery, current names, authoritative state preservation, unknown bookings, disk failures, and heading text.

The follow-up instruction explicitly accepts the local lookup alternative and operational estimate and retains the mirror to exercise JSON serialization and rebuild behavior. The implementation and tests satisfy those acceptance conditions. The supplied support estimate is four extra staff-hours/month if shipped. No additional fallback or service was added, and no deployment was performed. No remaining business decision blocks the authorized local implementation.
