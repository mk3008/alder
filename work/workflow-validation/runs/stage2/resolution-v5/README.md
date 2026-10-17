# Cumulative Stage 1 + Stage 2 v4 acceptance run

Status: pending fresh execution.

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

This run directory is a new v5 evidence attempt. Earlier v3/v4 copies and
their output are historical and are not an execution result for this v5 run.

Run against a reachable PostgreSQL database:

```powershell
.\run-stage1-acceptance.ps1 -DatabaseUrl 'postgresql://user:password@host:5432/database'
```
