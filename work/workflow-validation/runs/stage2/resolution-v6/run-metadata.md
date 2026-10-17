# Stage 2 resolution v6 run metadata

Status: **PASS / not adopted**. The fresh retry executed the frozen cumulative
Stage 1 v3 + Stage 2 v4 acceptance instrument and recorded
`STAGE1_ACCEPTANCE_V3_PASS`, `STAGE2_CUMULATIVE_ACCEPTANCE_V4_PASS`, and
`cleanup_schema_remaining = 0`.

## Scope and inputs

This v6 run uses the current candidate implementation, HD-WV-001/002, frozen
`ddl.sql`, Stage 1 v3 acceptance, Stage 2 packet, and frozen Stage 2 v4
acceptance. Only artifacts in this run directory are changed. The Stage 1
operation and acceptance script remain the adopted v3 copies. The v6 copy
retains the frozen S2-10 `db_after < scheduled_for` executable gate; no
business behavior, frozen artifact, or policy was changed.

## Requested execution metadata

Requested worker/model/effort: fresh Terra / medium. Actual model, version,
session identifier, and freshness are unverified. The local runner recorded
`runner_started_utc=2026-09-05T09:00:23.1740135Z`; its worker timestamp is
unverified. Starting and final repository SHA observed by the operator:
`54cd27990cc00c5970b35080271357ef5efd23d6` (the execution changed only this
v6 evidence directory).

The retry used the already study-configured disposable endpoint, created only
schema `stage2_b225f14151bc440290464d5d97c094ad`, then dropped it. The raw log
retains the runner-session observation, all required case input/outcome/row/
count/clock evidence, both pass markers, and cleanup. No credential discovery
was performed.

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
| `stage2-acceptance.sql` | `3e8088f7330586be0ace38b66375b0e0e3cc4809def8d21116a060734752b9a9` |
| `run-stage1-acceptance.ps1` | `fde281295311574468a9472849309e3fce58c944e5a5289d98c61be66ad6b3f6` |
