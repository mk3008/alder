# Receipt disk mirror

The task explicitly requires rebuilding `directory/rooms.json` from `service.rooms()` and reading names from that file for each receipt. The authoritative dictionary remains in memory. Existing mirrors are never trusted or imported into the service. Unknown bookings fail before disk work; missing referenced rooms fail rather than returning an undefined name. Filesystem errors propagate as operations permits.

The follow-up instruction confirms that the requester considered the local lookup alternative and the additional operational estimate, and explicitly requires exercising JSON serialization and rebuild behavior as an acceptance condition. Retain the requested disk mirror within local implementation/tests. Operations estimates four additional staff-hours per month if shipped; no deployment is authorized. No new business policy or unresolved business decision is introduced.
