# Stage 2 resolution v5 run metadata

Status: **INCONCLUSIVE / not adopted**. The first fresh execution attempt did
not create a schema or execute an acceptance case: the locally supplied
PostgreSQL connection was rejected at authentication. Raw output is retained
in `acceptance-evidence.log`. No credential discovery was attempted.

## Scope and inputs

This v5 run uses the current candidate implementation, HD-WV-001/002, frozen
`ddl.sql`, Stage 1 v3 acceptance, Stage 2 packet, and frozen Stage 2 v4
acceptance. Only artifacts in this run directory are changed. The Stage 1
operation and acceptance script remain the adopted v3 copies. The v5
instrument adds the frozen S2-10 `db_after < scheduled_for` executable gate
and corrects local v4 labels only.

## Requested execution metadata

Requested worker/model/effort: fresh Terra / medium. Actual model, version,
session identifier, and freshness are unverified. The failed connection attempt
started at `2026-09-05T17:56:36+09:00` (local tool observation; precise
worker execution timestamp unverified) from repository SHA
`0416cd8ba1dae669c8805a009b64f14a28b6b5a3`; no final acceptance-run SHA is
available. The completed v4 run is historical and is not v5 evidence.

The attempt used `postgresql://dogfood:dogfood@localhost:5432/dogfood`, which
returned PostgreSQL authentication failure before `CREATE SCHEMA`. The cleanup
attempt also could not connect, so no schema existence observation is available;
because the create command did not authenticate, no test schema was created by
this attempt. A reachable approved test-database connection is required before
the frozen v4 contract can be executed.

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
