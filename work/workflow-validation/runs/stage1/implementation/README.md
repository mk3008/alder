# Stage 1 implementation — report equipment fault

This isolated implementation exposes one PostgreSQL business operation:
`report_equipment_fault(request_id, equipment_id, reported_by, reported_at, description)`.
It creates an `open` request, rejects an unknown equipment id, and rejects an
empty description. It deliberately has no authorization, deduplication, safety
closure, scheduling, or completion behavior.

Run the frozen-contract acceptance instrument against a reachable PostgreSQL
database (the script creates and drops a unique schema):

```powershell
.\run-stage1-acceptance.ps1 -DatabaseUrl 'postgresql://user:password@host:5432/database'
```

The resulting `STAGE1_ACCEPTANCE_PASS` line is the pass signal. A missing
`psql`, unavailable database, or setup failure is inconclusive rather than a
pass.
