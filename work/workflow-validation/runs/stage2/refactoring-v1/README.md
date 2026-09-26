# Cumulative Stage 1 + Stage 2 v4 acceptance run — post-acceptance refactoring v1

Status: **PASS / not adopted**. This is fresh post-acceptance refactoring
evidence. It made no implementation source change; adoption remains an
operator protocol decision.

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

The runner created schema `stage2_303b8437516745798397a5223224efd8`, retained
the full raw output in `acceptance-evidence.log`, then removed it. The final
`cleanup_schema_remaining` observation is `0`. The raw output contains both
`STAGE1_ACCEPTANCE_V3_PASS` and `STAGE2_CUMULATIVE_ACCEPTANCE_V4_PASS`.

This run directory is a fresh verification after a structural reassessment.
`STRUCTURE_REASSESSMENT.md` records the no-change decision, source tree,
owners, consumers, and empty implementation diff. Earlier attempts and their
output are historical and are not execution evidence for this refactoring
verification.

Run against a reachable PostgreSQL database:

```powershell
.\run-stage1-acceptance.ps1 -DatabaseUrl 'postgresql://user:password@host:5432/database'
```
