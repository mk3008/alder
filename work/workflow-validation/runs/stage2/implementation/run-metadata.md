# Stage 2 implementation run metadata

Status: **PASS** — cumulative Stage 1 v3 and Stage 2 acceptance executed in a
fresh disposable PostgreSQL schema.

## Inputs and scope

The implementation used the current candidate workflow, HD-WV-001, frozen
initial DDL, Stage 1 packet and acceptance v3, and frozen Stage 2 packet and
acceptance. Frozen inputs and the adopted Stage 1 artifacts were not changed.

| Input | SHA-256 |
| --- | --- |
| `docs/workflow-validation/pilot/CANDIDATE_WORKFLOW.md` | `0BD0C660E62E846D73ADA7B677EF112C982E6A7539C1FE068FA139C0FC120CC6` |
| `docs/workflow-validation/pilot/DECISIONS.md` | `335C6827C25AE685BAA7BA6947C9DD8DCCA2B3F5341B1AD74E3DE48EF2714C80` |
| `frozen/ddl.sql` | `7183953F7455CB7F9D2D4249BCF80639551D459AA59631E520509ADA595A0BC7` |
| `frozen/stage1-packet.md` | `495A33D0DFD48FC5649014A41F18E338AF614368957217753B6E1558B506DFC9` |
| `frozen/stage1-acceptance-v3.md` | `CAEDB7A2F76966D30A9FC5E1BA180B601CA124B3C63142DAC8468D1FC92E8241` |
| `frozen/stage2-packet.md` | `4DC03D2565ABABD6C46B4D54AAC3AAAA719B07AF25715307598F492DD8D2F687` |
| `frozen/stage2-acceptance.md` | `73C80622D34A2258692E2A74B0A3BB9D5AFD15051F85628609F3647D3E875F68` |

## Implementation decision

Stage 1 reporting remains a separate database function, preserving its
observable behavior. Stage 2 adds two narrow lifecycle operations. A local
authorization-fixture table maps only `stage2-coordinator-fixture` to
coordinator and `stage2-technician-fixture` to technician. This is the minimum
demonstrable fixture authorized by the acceptance contract; it makes no claim
about a production identity model. Completion uses database `clock_timestamp()`
and therefore the evidence records a timing bracket rather than asserting an
unspecified business time authority.

| Artifact | SHA-256 |
| --- | --- |
| `report_equipment_fault.sql` (unchanged Stage 1) | `D85BA068C03F70B2B521182265078378653449B4C48AB687FA73C051795727A3` |
| `maintenance_lifecycle.sql` | `6078E4A7EF761537800A6B3355F599E510F093ADAA76209A71087F6C26F58D83` |
| `stage1-acceptance.sql` (unchanged Stage 1) | `394E1C63A395F3D2114A0F966E5FCA8777D5C0EEDF1A331508A17AF62510E1C6` |
| `stage2-acceptance.sql` | `6AEA6D585178A1926E2BEF092957CA99FA152926D3AC69905CE5B4B4A8EFEA4C` |
| `run-stage1-acceptance.ps1` | `DBC47FD6F47FA03A2466D23589EECD5C412BC9674A2C62A54098201CC220C83A` |
| `README.md` | `DB7015CAD3474E03E063C4D91AEEA86F81B79DCE83C2249F710553E3D7891878` |
| `acceptance-evidence.log` | `90E62896BE8EF6E48462FB01EC8A863CD99E0BE19FB199E249BAE81DA0E596E2` |

## Execution evidence

Runner: PostgreSQL 18.1 `psql`; database `dogfood`; URL used locally:
`postgres://dogfood:dogfood@localhost:55432/dogfood`. Disposable schema:
`stage2_298384c48f7745c0b038157d2a1526be`.

Observed pass signals: `STAGE1_ACCEPTANCE_V3_PASS` and
`STAGE2_CUMULATIVE_ACCEPTANCE_PASS`. The runner's cleanup query recorded
`cleanup_schema_remaining | 0`. `acceptance-evidence.log` retains the full
case output, actor fixtures, input timestamps, observed rows, counts, gates,
and cleanup result.
