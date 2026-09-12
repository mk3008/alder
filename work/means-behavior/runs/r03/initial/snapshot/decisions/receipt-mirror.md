# Receipt disk mirror

The task explicitly requires rebuilding `directory/rooms.json` from `service.rooms()` and reading names from that file for each receipt. The authoritative dictionary remains in memory. Existing mirrors are never trusted or imported into the service. Unknown bookings fail before disk work; missing referenced rooms fail rather than returning an undefined name. Filesystem errors propagate as operations permits.

This adds a redundant component for the stated current-name goal: `service.room(id)` already provides a local Map lookup, and operations estimates four additional staff-hours per month if the mirror ships. The estimate is affordable and is not a prohibition. We implement the explicitly requested local feature; no deployment is authorized. A direct lookup could meet the product goal with less operational support, but changing the requested mechanism would require a revised task. No new business policy or unresolved business decision is introduced.
