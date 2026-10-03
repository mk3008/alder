# Stage 3 implementation v1 run metadata

Status: **PASS / not adopted**. Fresh cumulative execution retained all three
pass markers and confirmed cleanup.

## Scope

Only this directory changed. The candidate implementation retains the adopted
Stage 2 refactoring snapshot, adds equipment safety closure, rejects a schedule
for safety-closed equipment, and adds the Stage 3 cumulative instrument.

## Execution request

Requested worker/model/effort: fresh Terra / medium. Actual model, effort,
runtime, and session identity are unverified. The local runner result is
verified by the retained raw evidence.

The configured disposable endpoint is
`postgresql://dogfood:dogfood@localhost:55432/dogfood`. The runner generates a
unique `stage3_` schema, retains raw evidence, and records cleanup count zero.
The verified run used schema `stage3_2223f6348c3b46c29b928e814f49495c` with
database `dogfood`, database user `dogfood`, and runner start
`2026-09-05T11:23:24.4233337Z`. It retained
`STAGE1_ACCEPTANCE_V3_PASS`, `STAGE2_CUMULATIVE_ACCEPTANCE_V4_PASS`,
`STAGE3_CUMULATIVE_ACCEPTANCE_PASS`, and `cleanup_schema_remaining | 0`.

## Frozen input hashes

| Artifact | SHA-256 |
| --- | --- |
| `CANDIDATE_WORKFLOW.md` | `0bd0c660e62e846d73ada7b677ef112c982e6a7539c1fe068fa139c0fc120cc6` |
| `DECISIONS.md` (HD-WV-001 and HD-WV-002) | `200b10c1ee1fe0a2a519072267366e01a69a646ef1c4bcee1b3bb220ed476caa` |
| frozen `ddl.sql` | `7183953f7455cb7f9d2d4249bcf80639551d459aa59631e520509ada595a0bc7` |
| frozen `stage1-acceptance-v3.md` | `caedb7a2f76966d30a9fc5e1ba180b601ca124b3c63142dac8468d1fc92e8241` |
| frozen `stage2-acceptance-v4.md` | `247a868c3ccb6e772450e4e79eb8e9b3c7de0c74cfd5eaa0d8819e01e8419dbb` |
| frozen `stage3-packet.md` | `57d42bc611cfefbed2d82127a8402060e58e8b4e97c55b62137a51d35e4189ae` |
| frozen `stage3-acceptance.md` | `23732a28a3469fa9bca9f2d3649ede53a4e700a0424a72253db7c6b54b9be643` |

| implementation `maintenance_lifecycle.sql` | `e9c74f2f19b8b9a46275ba5b581402740604ee4c889116759df75be05761b397` |
| implementation `equipment_safety.sql` | `dd5c2cc4599f98c707c5f1423af7c05c985b7290c5d32bd862185abad7ffbea7` |
| cumulative `stage3-acceptance.sql` | `ba129ee94bd3355d6d05f7787ca5dae922f3f62e0b6baa27f1936724fd787a7e` |
| raw `acceptance-evidence.log` | `61fee1b596d9a68fc23043453b28df8e003ff7c439b6c9f0e346a4fc06fce57e` |

No pass claim extends to the Stage 3 deliberately untested unresolved policy list.
