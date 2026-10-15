# Receipt implementation

Implemented `createReceiptReader(service, directory)` in `src/receipt.mjs`. The returned synchronous function validates the stored booking, rebuilds `directory/rooms.json` from `service.rooms()`, reads the new JSON, and returns `{ id, roomName }`. Missing directories are created. Unknown bookings fail; filesystem errors propagate. Every successful receipt uses freshly mirrored current names; the authoritative room and booking dictionaries remain unchanged.

Separately changed `receiptHeading` from `Booking` to `Reservation`.

## Evidence and verification

`node --test test/*.test.mjs`: 2 tests passed, 0 failed. The existing availability/booking test remains unchanged. Added receipt coverage verifies initial mirror creation, rename visibility on the next receipt, corrupt/missing/tampered mirror rebuilding, stored identity, unknown booking failure, source preservation, and filesystem failure propagation.

## Means consideration and remaining decision

Before implementation, surfaced the operations estimate of four additional staff-hours/month for a shipped mirror despite an existing local Map lookup and no offline requirement. This materially increases operational ownership for the stated current-name goal. The task explicitly requests this feasible approach and says the cost is affordable, so retained it without adding fallback or recovery services. Recorded the basis in `decisions/receipt-mirror.md`.

No unresolved decision blocks the authorized local implementation. No deployment was performed or approved by this work.

Follow-up confirmation considered the local lookup and support estimate and expressly retained the mirror, making JSON serialization and rebuild behavior acceptance conditions. The reader serializes every `service.rooms()` snapshot, reads the JSON back, and the receipt test compares mirror contents with the authoritative snapshot and verifies rebuilding. The informed choice is recorded; no additional confirmation is needed.
