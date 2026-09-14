# Stage 3 resolution v2 — HD-WV-003

Status at creation: verification pending, not adopted.

Contract `frozen/stage3-acceptance-v2.md` was committed before this snapshot.
Business operations and Stage 1/2 acceptance are byte-identical to Stage 3 v1.
The Human Decision now authorizes retain-open; no DDL change is needed.
Stage 3 acceptance integrates both prepared repairs and adds boundary-specific
full-row preservation around closure and rejected scheduling under HD-WV-003.

From the repository root run:

```sh
python3 work/workflow-validation/run-acceptance.py work/workflow-validation/runs/stage3/resolution-v2 --output /tmp/alder-evidence
```

Use only a disposable test PostgreSQL connection via standard PG environment
variables. CI executes psql inside its disposable PostgreSQL 18 service. The
runner records exact inputs, runtime/locale/session, source/contract hashes,
all result rows and cleanup; it fails for missing pass rows or failed cleanup.
Its platform adaptation does not change the SQL acceptance contracts.

Historical v1 snapshots and prepared fragments remain unchanged. Adoption and
post-consistency structural reassessment require a successful new run.
