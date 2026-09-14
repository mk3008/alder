# Stage 1 v3 acceptance run — report equipment fault

This isolated implementation exposes one PostgreSQL business operation:
`report_equipment_fault(request_id, equipment_id, reported_by, reported_at, description)`.
It creates an `open` request, rejects an unknown equipment id, and rejects an
empty or whitespace-only description. It deliberately has no authorization,
deduplication, safety closure, scheduling, or completion behavior. The chosen
predicate is PostgreSQL POSIX `^[[:space:]]*$`; it validates only and never
trims or normalizes a stored description.

Run the frozen-contract acceptance instrument against a reachable PostgreSQL
database (the script creates and drops a unique schema):

```powershell
.\run-stage1-acceptance.ps1 -DatabaseUrl 'postgresql://user:password@host:5432/database'
```

The resulting `STAGE1_ACCEPTANCE_V3_PASS` line is the pass signal. The runner
retains per-case observations in `acceptance-evidence.log` and drops its unique
schema after the run. A missing
`psql`, unavailable database, or setup failure is inconclusive rather than a
pass.
