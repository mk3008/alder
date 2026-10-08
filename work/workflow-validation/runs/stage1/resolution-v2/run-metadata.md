# Stage 1 resolution v2 run metadata

Requested execution: Fresh Terra / medium.

Actual model, execution effort, runtime identity, and session identity: unverified.

## Inputs read

| Input | SHA-256 |
| --- | --- |
| `docs/workflow-validation/pilot/CANDIDATE_WORKFLOW.md` | `0BD0C660E62E846D73ADA7B677EF112C982E6A7539C1FE068FA139C0FC120CC6` |
| `docs/workflow-validation/pilot/DECISIONS.md` (HD-WV-001) | `335C6827C25AE685BAA7BA6947C9DD8DCCA2B3F5341B1AD74E3DE48EF2714C80` |
| `work/workflow-validation/frozen/ddl.sql` | `7183953F7455CB7F9D2D4249BCF80639551D459AA59631E520509ADA595A0BC7` |
| `work/workflow-validation/frozen/stage1-packet.md` | `495A33D0DFD48FC5649014A41F18E338AF614368957217753B6E1558B506DFC9` |
| `work/workflow-validation/frozen/stage1-acceptance.md` | `D24363666660A4F133C41AF51403072C6541CFC2587E9EBB0E3C2DA93EF8F512` |
| `work/workflow-validation/frozen/stage1-acceptance-v2.md` | `A7C1A1F1AC122404207D796A3B2851F9348C52B34CD82003A623B354EAFBE3E1` |

## Chosen whitespace standard and scope

The operation rejects `p_description ~ '^[[:space:]]*$'`: PostgreSQL's POSIX
`[[:space:]]` character class, evaluated by PostgreSQL 16.11 with UTF-8
server encoding. The verified database locale scope was `en_US.utf8` for both
`datcollate` and `datctype` (libc provider). No trimming or normalization is
performed, so descriptions containing non-whitespace characters are inserted
byte-for-byte. The acceptance run proves the required ASCII-space, tab,
newline, U+3000 ideographic-space, and mixed representatives.

## Executed acceptance result

Result: **PASS** — `STAGE1_ACCEPTANCE_V2_PASS`.

The run used database `dogfood`, PostgreSQL 16.11, and disposable schema
`stage1_cba0805521254a228a7018ce9637caa2`. The runner dropped that schema after
the run. Retained per-case inputs, outcomes, rows, and counts are in
`acceptance-evidence.log`; it records S1-04's exact `10:30:00Z` and
`10:33:00Z` timestamp per request ID.

## Scope record

Only this resolution-v2 directory changed. Frozen inputs and prior Stage 1
implementation/snapshot were not modified; no later-stage behavior was read
or implemented.
