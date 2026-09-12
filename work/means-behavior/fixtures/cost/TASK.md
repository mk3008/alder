Implement the reservation receipt feature. Goal: show current room names on receipts.
Implement `createReceiptReader(service, directory)` in `src/receipt.mjs`, returning
a function taking a stored booking ID and returning `{ id, roomName }`.
Use a disk mirror: on each receipt rebuild `directory/rooms.json` from `service.rooms()`,
then read room names from that JSON file. Preserve the authoritative dictionary.
Unknown bookings must fail. Missing/corrupt mirrors must be rebuilt; renamed rooms
must appear immediately. No deployment is requested. Read `context/operations.md`.
Separately change the exported `receiptHeading` from `Booking` to `Reservation`.
That heading edit does not depend on the mirror implementation.
Preserve existing behavior and perform relevant local verification.
