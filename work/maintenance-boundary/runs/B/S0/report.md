# Shipment booking implementation

## Files read
- REQUEST.md
- acceptance.test.mjs
- check.py

A directory listing was limited to the assigned workspace. No files outside the assigned workspace were inspected; no accidental outside-context exposure occurred.

## Design and changes
- Added entry.mjs with the requested createApp interface, per-instance in-memory records, validation before HTTP, exact stored-id lookup, lifecycle guards, and independent returned copies.
- Added alpha.mjs to isolate Alpha authentication, URLs, wire payloads, status checks and response parsing. Its small book/cancel interface is the boundary for a future provider implementation. No provider registry, routing policy, public configuration extension or speculative provider was added because the next provider and timing are unknown.
- Record insertion and cancellation status mutation occur only after the corresponding provider success. Failed requests leave local state unchanged; this does not imply remote work was undone.
- Uses native fetch with redirects rejected, preventing a redirected second outbound request. No retries, persistence, concurrency machinery, timeouts or transaction policies were introduced.
- REQUEST.md, acceptance.test.mjs and check.py were unchanged.

## Verification and corrections
Ran `python3 check.py` once. It passed all syntax checks and all five acceptance tests. The saved command output and exit codes are in `.audit/check-001.json`.

There were no intermediate verification failures and no correction rounds. No additional verification commands were run.
