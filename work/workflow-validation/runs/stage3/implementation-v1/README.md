# Cumulative Stage 1–3 acceptance run — safety closure implementation v1

Status: pending fresh execution. The runner creates a unique disposable
PostgreSQL schema, loads the frozen DDL and the Stage 1, Stage 2, and Stage 3
operations, then runs the unchanged Stage 1 v3 and Stage 2 v4 instruments
followed by Stage 3 safety-closure coverage in one psql session.

The Stage 3 operation records `safety_closed` only under demonstrated
safety-inspector authority. Scheduling additionally requires the request's
equipment not to be safety closed. The Stage 3 instrument proves accepted
closure, rejected scheduling of an open request after closure, preservation of
a completed request after closure, and a non-inspector rejection. It does not
claim behavior for the deliberately untested unresolved policy list.

Raw inputs, actor evidence, outcomes, rows, counts, temporal brackets, pass
markers, database/schema identity, and cleanup output are retained in
`acceptance-evidence.log`. Actual model metadata remains unverified.

Run against a reachable PostgreSQL database:

```powershell
.\run-stage1-acceptance.ps1 -DatabaseUrl 'postgresql://user:password@host:5432/database'
```
