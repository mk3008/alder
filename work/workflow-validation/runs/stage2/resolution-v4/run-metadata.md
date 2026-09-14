# Stage 2 resolution v4 run metadata

Status: **PASS / eligible for independent read-only review; not yet adopted**.

## Scope and inputs

This run uses the current candidate implementation, HD-WV-001/002, frozen
`ddl.sql`, Stage 1 v3 acceptance, Stage 2 packet, and frozen Stage 2 v4
acceptance. Only artifacts in this run directory are changed. The Stage 1
operation and acceptance script remain the adopted v3 copies.

## Requested execution metadata

Requested worker/model/effort: fresh Terra / medium. Actual model, version,
session identifier, and runtime are unverified. The execution began at
`2026-09-05T08:51:40.5056680Z`; the source-run start and end repository SHA
were both `ea638363fc873dd9ca38f700f40d8881d1b231db` (the evidence directory
had not yet been committed).

Runner: PostgreSQL 18 `psql`; database/user: `dogfood` / `dogfood`; backend
pid: `1382`; disposable schema: `stage2_6e7380c60de7425f9d179ff5bd9873ae`.
`acceptance-evidence.log` is the full raw output, including all case inputs,
actor evidence, operation outcomes, post-rows, counts, DB-clock brackets, and
cleanup. Its final markers are `STAGE1_ACCEPTANCE_V3_PASS` and
`STAGE2_CUMULATIVE_ACCEPTANCE_V4_PASS`; the cleanup observation is
`cleanup_schema_remaining | 0`.

S2-10 retained report time `2026-09-05 08:51:40.953417+00`, scheduled for
`2026-09-06 08:51:40.959156+00`, and stored completion
`2026-09-05 08:51:40.968324+00`, bounded by the recorded completion bracket
`2026-09-05 08:51:40.966305+00` through
`2026-09-05 08:51:40.969683+00`. This is both after the report time and before
the schedule. S2-11 separately recorded the rejected future-report-time call
and complete-row non-mutation gate.

## Exact input and artifact hashes

| Artifact | SHA-256 |
| --- | --- |
| `CANDIDATE_WORKFLOW.md` | `0bd0c660e62e846d73ada7b677ef112c982e6a7539c1fe068fa139c0fc120cc6` |
| `DECISIONS.md` | `200b10c1ee1fe0a2a519072267366e01a69a646ef1c4bcee1b3bb220ed476caa` |
| frozen `ddl.sql` | `7183953f7455cb7f9d2d4249bcf80639551d459aa59631e520509ada595a0bc7` |
| frozen `stage1-acceptance-v3.md` | `caedb7a2f76966d30a9fc5e1ba180b601ca124b3c63142dac8468d1fc92e8241` |
| frozen `stage2-packet.md` | `4dc03d2565ababd6c46b4d54aac3aaaa719b07af25715307598f492dd8d2f687` |
| frozen `stage2-acceptance-v4.md` | `247a868c3ccb6e772450e4e79eb8e9b3c7de0c74cfd5eaa0d8819e01e8419dbb` |
| `report_equipment_fault.sql` | `d85ba068c03f70b2b521182265078378653449b4c48ab687fa73c051795727a3` |
| `maintenance_lifecycle.sql` | `b2918811b4ca5e7eaa9c4b273b4d8fa586bf1e9159458ebeae5a419a5c616441` |
| `stage1-acceptance.sql` | `394e1c63a395f3d2114a0f966e5fca8777d5c0eedf1a331508a17af62510e1c6` |
| `stage2-acceptance.sql` | `f47de4ebcd130e9cf12fe3f91f9b88bc24cb9d7caaa1b364ca1c7b3185d417d3` |
| `run-stage1-acceptance.ps1` | `fde281295311574468a9472849309e3fce58c944e5a5289d98c61be66ad6b3f6` |
