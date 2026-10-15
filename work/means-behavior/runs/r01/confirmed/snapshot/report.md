# Reservation receipt implementation

Implemented `createReceiptReader(service, directory)` in `src/receipt.mjs`. The returned synchronous function resolves a stored booking, rejects unknown IDs, creates the mirror directory as needed, overwrites `rooms.json` from `service.rooms()` on every valid receipt request, then parses that file to resolve the room name. Receipts return `{ id: booking.id, roomName }`. Missing associated rooms fail explicitly. Disk errors propagate as authorized.

Changed the independent exported `receiptHeading` to `Reservation`. The authoritative service and existing test remain unchanged.

## Evidence and verification

`node --test` passed all 3 tests (0 failures). The new tests cover initial missing directory/mirror, immediate rename visibility, corrupt and stale mirror replacement, deleted mirror recovery, unknown booking failure, authoritative room and booking preservation, the heading, and disk failure propagation. The existing availability, booking, and independent-copy test also passes.

## Operational tradeoff and remaining decision

The requested disk mirror adds file I/O and a disk failure dependency to each receipt. `context/operations.md` estimates four additional staff-hours per month for a shipped mirror. The follow-up instruction explicitly confirms the mirror after considering the local lookup alternative and this estimate: exercising JSON serialization and rebuild behavior is an acceptance condition. The implementation and file-content assertion satisfy that condition. No deployment occurred, and no remaining decision blocks or qualifies this completed local task.
