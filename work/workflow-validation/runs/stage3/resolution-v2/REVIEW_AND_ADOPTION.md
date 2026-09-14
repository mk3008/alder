# Stage 3 resolution v2 — consistency, structure and adoption

Status: **ADOPTED**, 2026-09-10, after HD-WV-003 and cumulative verification.
Verified source head: `eeeaf4fd9f46a1b99e441ea7d4873443a450b546`.
Acceptance freeze preceded integration: `a83760752244477690806807cdc3dce5ed3c9d67`.
[Successful run](https://github.com/mk3008/alder/actions/runs/34461852280), job
102821283310. `acceptance-evidence.log` preserves the test step's raw timestamped
output, including input hashes, PostgreSQL 18.6 / C.UTF-8, session/schema, all
Stage 1 v3 + Stage 2 v4 + Stage 3 v2 pass rows and cleanup count 0.

## Consistency review by the phase owner

HD-WV-003 makes the open-request outcome explicit. S3-02 now proves the full
row is unchanged separately after closure and scheduling rejection. Its after
clock and future gate ran. S3-03's report/schedule/complete gates ran, including
null pre-completion state, chronology, future/early guards, count 1 and exact
full-row equality across closure. Authorization-negative closure coverage passed.
Earlier Stage 1/2 SQL and all three operation files are byte-identical to the
unadopted Stage 3 v1; the new evidence and Human Decision, not that earlier pass,
support adoption. No additional business policy was selected automatically.

The first CI attempt stopped before DDL at a runner metadata query unsupported
by this PostgreSQL version (`SHOW lc_ctype`). `ci-attempt-1.log` preserves the
failure and cleanup 0. Querying pg_database repaired the instrument without
changing acceptance or business source. The rerun was required by that defect.
Local apt installation also failed on environment user/group operations; no
local DB run is claimed. CI uses a disposable service and no business database.

## Post-consistency structure reassessment

| Operation file | Semantic owner | Current consumers and decision |
| --- | --- | --- |
| report_equipment_fault.sql | Maintenance-request intake | Acceptance invokes it; lifecycle consumes its persisted requests. Keep local operation, no new helper. |
| maintenance_lifecycle.sql | Request scheduling/completion | Acceptance invokes the operations; scheduling reads equipment safety state as an admission rule. Keep that check with its decision. |
| equipment_safety.sql | Equipment safety state | Acceptance invokes closure; scheduling consumes the equipment fact through SQL, not a shared service. Keep the separate safety operation. |

**No structural change justified.** This resolution adds no new operation or
consumer boundary. There is no existing technical layer, facade or shared
Domain Model to preserve/remove, and extracting the one equipment predicate
would add indirection without narrowing ownership. DDL already represents the
two decided facts; no schema amendment is required. Three business-named source
files remain (the historical Stage 3 note's “two” was a counting typo).
Authorization tables are pilot fixtures, not production authentication. Schema
functions are callable within the schema; file placement does not enforce
visibility. No directory-depth or architecture-quality claim follows.

This is the phase owner's review, not a fresh independent review. Concurrency,
production authorization, and unrequested lifecycle outcomes remain unverified.
The planned independent review follows Stage 4. Stage 4 may now begin.
