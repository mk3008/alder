# Cumulative Stage 1 + Stage 2 acceptance run

This PostgreSQL implementation preserves the Stage 1
`report_equipment_fault` operation and adds `schedule_maintenance` and
`complete_maintenance`. It implements only the accepted lifecycle horizon:
an open request may be scheduled by the coordinator fixture for a future time,
and a scheduled request may be completed by the technician fixture.

The Stage 2 authorization mechanism is deliberately only an executable
acceptance fixture: `stage2-coordinator-fixture` and
`stage2-technician-fixture` have the two expressly required authorities;
`reporter-stage1` has neither. It does not define enrollment, role management,
or any broader policy. Completion time is captured using PostgreSQL
`clock_timestamp()`; the acceptance evidence retains the call timing bracket
and observed value.

Run against a reachable PostgreSQL database. The script creates and removes a
unique disposable schema:

```powershell
.\run-stage1-acceptance.ps1 -DatabaseUrl 'postgresql://user:password@host:5432/database'
```

A passing run contains both `STAGE1_ACCEPTANCE_V3_PASS` and
`STAGE2_CUMULATIVE_ACCEPTANCE_PASS`. Per-case observations, rows, counts, and
cleanup observation are retained in `acceptance-evidence.log`. Missing `psql`,
database access, or setup is inconclusive rather than a pass.
