# Stage 1 resolution v3 run metadata

Requested execution: fresh Terra / medium.

Actual model, execution effort, runtime identity, and session identity: unverified.

## Observed inputs and executable artifacts

| Input or artifact | SHA-256 |
| --- | --- |
| `docs/workflow-validation/pilot/CANDIDATE_WORKFLOW.md` | `0BD0C660E62E846D73ADA7B677EF112C982E6A7539C1FE068FA139C0FC120CC6` |
| `docs/workflow-validation/pilot/DECISIONS.md` (HD-WV-001) | `335C6827C25AE685BAA7BA6947C9DD8DCCA2B3F5341B1AD74E3DE48EF2714C80` |
| `work/workflow-validation/frozen/ddl.sql` | `7183953F7455CB7F9D2D4249BCF80639551D459AA59631E520509ADA595A0BC7` |
| `work/workflow-validation/frozen/stage1-packet.md` | `495A33D0DFD48FC5649014A41F18E338AF614368957217753B6E1558B506DFC9` |
| `work/workflow-validation/frozen/stage1-acceptance-v3.md` | `CAEDB7A2F76966D30A9FC5E1BA180B601CA124B3C63142DAC8468D1FC92E8241` |
| `report_equipment_fault.sql` | `D85BA068C03F70B2B521182265078378653449B4C48AB687FA73C051795727A3` |
| `stage1-acceptance.sql` | `394E1C63A395F3D2114A0F966E5FCA8777D5C0EEDF1A331508A17AF62510E1C6` |
| `run-stage1-acceptance.ps1` | `C92397804EF7C910585C5B89B5AF72B0A4CEFD2FD5589F776B7E5821CBA3BBED` |
| `acceptance-evidence.log` | `4A8D62AFA780B52E8A0531C1EF2D2FF45B0D2FB903C15D75F6934CA0662EC0EB` |

## Observed environment and result

The runner used `postgres://dogfood:dogfood@localhost:55432/dogfood` and the
disposable schema `stage1_539100fb15d148e1b2a7f1aa9eebd45c`. Observed server:
PostgreSQL 16.11 on x86_64-pc-linux-musl (Alpine), UTF8; database collation and
ctype were both `en_US.utf8`. The runner's `psql.exe` was PostgreSQL 18 client.

Result: **PASS** — `STAGE1_ACCEPTANCE_V3_PASS`.

`acceptance-evidence.log` retains each case's actor evidence, exact input
description as UTF-8 hex, correlation id, observed outcome, selected row(s),
and asserted count observations. The final cleanup query in that log observed
`cleanup_schema_remaining | 0` after `DROP SCHEMA ... CASCADE`.

## v3 instrument repair

The executable gate now asserts all stated fields (`request_id`,
`equipment_id`, `reported_by`, `reported_at`, `description`, `status`,
`scheduled_for`, and `completed_at`) plus the required total for every accepted
row, including both S1-04 rows. It independently asserts every required count
for S1-02 and each of S1-03/S1-05 through S1-09. No operation behavior or
frozen input was changed.
