# Stage 2 resolution v3 run metadata

Status: **INCONCLUSIVE / not passed**.

## Scope and inputs

This run used the current candidate implementation, HD-WV-001/002, frozen
`ddl.sql`, Stage 1 v3 acceptance, Stage 2 packet, and frozen Stage 2 v3
acceptance. Only artifacts in this run directory were changed. The Stage 1
operation and acceptance script remain the adopted v3 copies.

## Fresh execution

Runner: PostgreSQL 18 `psql`; database: `dogfood`; disposable schema:
`stage2_9945af39e97649b5bda46e55e1f9b2b3`.

`acceptance-evidence.log` records `STAGE1_ACCEPTANCE_V3_PASS`, authorization
fixture mappings, exact inputs, rows, counts, outcomes, DB-clock brackets,
and cleanup. The cleanup observation is `cleanup_schema_remaining | 0`.

S2-01 through S2-07 recorded the v3 time-aligned report prerequisite and use
the retained DB instant as `reported_at`. S2-01 through S2-09 and S2-11
executed with their required gates. S2-10 supplied `reported_at` 24 hours in
the future and was immediately rejected because the HD-WV-002 operation clock
was before it. The final marker is
`STAGE2_CUMULATIVE_ACCEPTANCE_V3_INCONCLUSIVE_S2-10`, followed by a deliberate
non-zero exit. Consequently no Stage 2 cumulative pass is claimed.
