# Stage 1 run metadata

Requested execution: Fresh Terra / medium.

Actual model, execution effort, runtime identity, and session identity: unverified.

## Frozen inputs read

| Input | SHA-256 |
| --- | --- |
| `docs/workflow-validation/pilot/CANDIDATE_WORKFLOW.md` | `3861AD03996F09DC54ADC2135CFC9F16580A1FD89B33D878F192139BBCD2425F` |
| `work/workflow-validation/frozen/ddl.sql` | `7183953F7455CB7F9D2D4249BCF80639551D459AA59631E520509ADA595A0BC7` |
| `work/workflow-validation/frozen/stage1-packet.md` | `495A33D0DFD48FC5649014A41F18E338AF614368957217753B6E1558B506DFC9` |
| `work/workflow-validation/frozen/acceptance-design.md` | `C945AB990871DF1DDE77765D1B48B4FF2F5BD267CF23ED3F2AA46472DD776F2C` |
| `work/workflow-validation/frozen/stage1-acceptance.md` | `D24363666660A4F133C41AF51403072C6541CFC2587E9EBB0E3C2DA93EF8F512` |

## Scope record

Only the current Stage 1 operation and its acceptance instrument were created
in this directory. Frozen inputs and documentation were not modified. No later
stage behavior was implemented.

## Verification record

Static review completed: the SQL operation and instrument cover S1-01 through
S1-04. Runtime acceptance is unverified because no PostgreSQL connection URL
or runnable database session was supplied to this isolated run.
