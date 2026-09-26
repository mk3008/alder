# Cumulative Stage 1 + Stage 2 v3 acceptance run

Status: **inconclusive / not passed**.

The runner creates a unique disposable PostgreSQL schema, runs the unchanged
Stage 1 v3 instrument and the Stage 2 v3 instrument in one psql session, and
records all output plus cleanup in `acceptance-evidence.log`.

S2-01 through S2-07 use the v3 lifecycle prerequisite: immediately before the
report operation, the same session captures `clock_timestamp()` and supplies
that retained instant as `reported_at`. This makes the HD-WV-002 rule
`completed_at >= reported_at` satisfiable for ordinary lifecycle completion.

The fresh run passed Stage 1 v3 and executed every Stage 2 case. S2-01 through
S2-09 and S2-11 met their stated gates. S2-10 did not: its retained frozen v2
chronology fixture still reports at `DB clock + 24 hours` and asks for an
immediate accepted completion. HD-WV-002 requires rejection before that
reported time. The instrument records that observed rejection, executes S2-11,
then deliberately exits non-zero. It does not claim a cumulative pass.

Run against a reachable PostgreSQL database:

```powershell
.\run-stage1-acceptance.ps1 -DatabaseUrl 'postgresql://user:password@host:5432/database'
```
