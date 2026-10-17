# Cumulative Stage 1 + Stage 2 v4 acceptance run — resolution v6

Status: **PASS / not adopted**. This is fresh execution evidence; adoption
still requires the protocol's independent review and refactoring steps.

The runner creates a unique disposable PostgreSQL schema, runs the unchanged
Stage 1 v3 instrument and the Stage 2 v4 instrument in one psql session, and
records all output plus cleanup in `acceptance-evidence.log`.

S2-01 through S2-07 use the v3 lifecycle prerequisite: immediately before the
report operation, the same session captures `clock_timestamp()` and supplies
that retained instant as `reported_at`. S2-10 v4 separately reports at a
retained DB-clock instant, schedules at least 24 hours later, then proves that
the authorized completion is accepted before `scheduled_for` while retaining
the report/completion chronology. S2-11 remains the separate negative proof
that a future `reported_at` rejects immediate completion without mutation.

The runner created schema `stage2_b225f14151bc440290464d5d97c094ad`, retained
the full raw output in `acceptance-evidence.log`, then removed it. The final
`cleanup_schema_remaining` observation is `0`. The raw output contains both
`STAGE1_ACCEPTANCE_V3_PASS` and `STAGE2_CUMULATIVE_ACCEPTANCE_V4_PASS`.

This run directory is the v6 evidence attempt. Earlier attempts and their
output are historical and are not execution evidence for this v6 result.

Run against a reachable PostgreSQL database:

```powershell
.\run-stage1-acceptance.ps1 -DatabaseUrl 'postgresql://user:password@host:5432/database'
```
