# Meeting-room booking — SQLite implementation

Requirements: [meeting-room Business Design](../../business-design/meeting-room/README.md),
initial source blob `59d185f89535ee0414b9e51b4ed1bb435baf838e`, updated with the Human Decision below, and [Issue #25](https://github.com/mk3008/alder/issues/25).
No other Business Design, implementation, past issue/PR, or research findings were used.

All six activities are implemented, including the
[approved treatment of existing reservations](https://github.com/mk3008/alder/pull/26#issuecomment-5627605137).
Making a room unavailable preserves reservations. Owners can move to another
available room or cancel while the original room is unavailable. On resume,
retained reserved bookings still occupy their intervals. **Reserved does not
mean the room is guaranteed to be usable.** See [Decision Record](DECISIONS.md#dr-1-existing-reservations-when-a-room-becomes-unavailable).

## Run

Python 3.10+ on a POSIX operating system, with the standard-library SQLite module.
No package installation, server, or external service is needed.

```sh
cd apps/meeting-room
python3 cli.py --db rooms.sqlite init --rooms rooms.example.json

# Development identity: map the current real OS UID to a stable business identity.
python3 - <<'PY'
import json, os
from pathlib import Path
Path('identity.local.json').write_text(json.dumps({
    str(os.getuid()): {'id': 'alice', 'roles': ['user', 'manager']}
}))
PY

python3 cli.py --db rooms.sqlite --identity identity.local.json availability \
  --start 2090-01-02T10:00:00+09:00 --end 2090-01-02T11:00:00+09:00

python3 cli.py --db rooms.sqlite --identity identity.local.json reserve \
  --room room-a --start 2090-01-02T10:00:00+09:00 \
  --end 2090-01-02T11:00:00+09:00 --purpose 'Design review'
```

Use the returned reservation `id` as `<reservation-id>` below:

```sh
python3 cli.py --db rooms.sqlite --identity identity.local.json change \
  --reservation '<reservation-id>' --room room-b \
  --start 2090-01-02T11:00:00+09:00 --end 2090-01-02T12:00:00+09:00
python3 cli.py --db rooms.sqlite --identity identity.local.json cancel \
  --reservation '<reservation-id>'
python3 cli.py --db rooms.sqlite --identity identity.local.json unavailable --room room-b
python3 cli.py --db rooms.sqlite --identity identity.local.json resume --room room-b
```

Initialization is offline provisioning, not a room-registration business workflow.
Supply a JSON array with unique `id`, `name`, `location`, and an explicitly chosen
`state` (`available` or `unavailable`). Initialization never overwrites an existing
file. If provisioning fails, a newly created incomplete file may remain; inspect
that file before removing it and retrying. Other commands require an existing DB.

Inputs require `YYYY-MM-DDTHH:MM:SS[.ffffff]Z` or an explicit `±HH:MM` offset.
Output is JSON; `start_us`, `end_us`, `registered_us`, and `cancelled_us` are integer
UTC microseconds since 1970-01-01 (`cancelled_us` is null until cancellation).
Success exits 0. Rejections exit 2 and emit `{"error":"code"}` on stderr;
configuration/storage errors exit 3 (argument syntax errors exit 2).
`busy_retry` means the SQLite writer lock could not be acquired in five seconds;
the operation did not complete. Availability is a snapshot, not a held slot.

## Identity and execution boundary

Each identity mapping entry has a stable `id` and roles `user`, `manager`, or both.
The CLI resolves the actual OS UID, not a supplied reservation owner or environment
username. The business operations check roles; change/cancel additionally check
that the current identity equals the original booker. Managers receive no implicit
proxy reservation authority. User IDs are opaque, case-sensitive identifiers.

This is a **trusted local CLI**, not a secure multi-user service. The operator
controls the identity mapping, database file, executable and command line. Anyone
who can replace these or execute arbitrary Python/SQL can bypass the checks.
The example deliberately gives one local operator both roles for demonstration.
An untrusted deployment must supply an authenticated adapter, trusted role mapping
and file/process isolation; this implementation does not claim that boundary.
The Python `Actor` is trusted caller context with the same limitation.

## Data and transactions

- `rooms`: stable room ID, name, location and availability state.
- `reservations`: stable UUID, one room foreign key, booker identity, interval,
  purpose, reservation state, registration time, optional cancellation time.
- Index and triggers enforce non-overlap of reserved half-open intervals
  `[start, end)`, availability on reservation insert/update and terminal cancellation.
- Reserve/change/cancel/availability changes use `BEGIN IMMEDIATE`. Validation,
  clock sampling and mutations happen while holding the same writer lock.
  A rejected change rolls back without releasing or modifying the old reservation.
- SQLite handles process coordination on a local database file. Direct database
  writes are outside the application contract; triggers are additional safeguards,
  not an authorization system or a full replacement for operation validation.

## Verification

```sh
python3 -m unittest discover -s tests -v
```

Verified with Python 3.12.14: **20 tests passed**. Tests use temporary on-disk SQLite
databases, separate processes for concurrent writers and actual CLI subprocesses.

| Requirements | Evidence |
| --- | --- |
| Activities 1–4 | Reservation → change → cancellation → released slots, reopen persistence, stable identity/purpose/registration time |
| Roles and ownership | Another user and manager-only actor cannot change/cancel someone else's reservation; user cannot manage room state |
| Time and occupancy | All overlap shapes, adjacent intervals, same instant in different offsets, equal/reversed intervals, future boundary, self-exclusion |
| Activity 5 (no reserved bookings) and 6 | Unavailable room excluded; reserve/change into it rejected; resume restores eligibility; cancelled reservations stay cancelled |
| Activity 5 (reserved bookings exist) | Past/ongoing/future bookings retained; owners can move/cancel while unavailable; failed moves preserve facts; resume restores retained occupancy |
| Atomicity and concurrency | Four competing bookings, two changes, booking versus change, booking/change versus unavailable; one valid serialization, loser retains original facts |
| Technical boundaries | Clock sampled after lock, parameterized SQL, SQL trigger guards, initialization refuses overwrite, unknown/malformed inputs |

Remaining Business Design exclusions (recurrence, participants, capacity/equipment,
proxy actions, actual usage, booking horizon/duration limits, notifications and
history) remain undecided and unimplemented. No additional business decision is
needed for these to run the independent scope above.
