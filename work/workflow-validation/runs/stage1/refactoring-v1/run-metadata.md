# Stage 1 refactoring v1 run metadata

Requested execution: fresh Terra / medium.

Actual model, execution effort, runtime identity, and session identity: unverified.

## Reassessment and structural decision

The applicable candidate-workflow instruction is: “Place a decision at the
narrowest meaningful semantic boundary owning it and containing current
required consumers.”

Stage 1 has one owned decision boundary: reporting an equipment fault. Its
only current required consumers are the `report_equipment_fault` PostgreSQL
operation and the Stage 1 acceptance runner that invokes it. The database
function is already the narrowest meaningful executable boundary for the
validation and creation decisions; the runner is verification-only and is not
a business consumer. There is no second current business operation, no shared
invariant that requires a separate authority, and no present consumer that
justifies extracting, combining, moving, or exposing another physical unit.

Decision: **no physical refactoring**. The existing single-operation placement
and local acceptance artifacts remain unchanged. This is a structural
reassessment, not a preservation-by-habit decision; later stages and their
potential consumers were intentionally not considered.

## Frozen-input and implementation diff

All frozen inputs are unchanged. The executable implementation and acceptance
artifacts are byte-identical to the adopted `runs/stage1/resolution-v3`
snapshot:

| Artifact | SHA-256 | Diff from `resolution-v3` |
| --- | --- | --- |
| `report_equipment_fault.sql` | `D85BA068C03F70B2B521182265078378653449B4C48AB687FA73C051795727A3` | none |
| `stage1-acceptance.sql` | `394E1C63A395F3D2114A0F966E5FCA8777D5C0EEDF1A331508A17AF62510E1C6` | none |
| `run-stage1-acceptance.ps1` | `C92397804EF7C910585C5B89B5AF72B0A4CEFD2FD5589F776B7E5821CBA3BBED` | none |
| `README.md` | `367BDBC273F814A55EE353A413C0A69E1695C5319120AE39D4C6E0B0C48A88C1` | none |

| Frozen input | SHA-256 |
| --- | --- |
| `docs/workflow-validation/pilot/CANDIDATE_WORKFLOW.md` | `0BD0C660E62E846D73ADA7B677EF112C982E6A7539C1FE068FA139C0FC120CC6` |
| `docs/workflow-validation/pilot/DECISIONS.md` (HD-WV-001) | `335C6827C25AE685BAA7BA6947C9DD8DCCA2B3F5341B1AD74E3DE48EF2714C80` |
| `work/workflow-validation/frozen/ddl.sql` | `7183953F7455CB7F9D2D4249BCF80639551D459AA59631E520509ADA595A0BC7` |
| `work/workflow-validation/frozen/stage1-packet.md` | `495A33D0DFD48FC5649014A41F18E338AF614368957217753B6E1558B506DFC9` |
| `work/workflow-validation/frozen/stage1-acceptance-v3.md` | `CAEDB7A2F76966D30A9FC5E1BA180B601CA124B3C63142DAC8468D1FC92E8241` |

The only refreshed runtime artifact is `acceptance-evidence.log`; its new
schema name, start timestamp, and resulting log hash are expected to differ.

## Fresh v3 acceptance result

The runner used `postgres://dogfood:dogfood@localhost:55432/dogfood` and the
new disposable schema `stage1_063544231741471384cf36fd979fe7c5`. Result:
**PASS** — `STAGE1_ACCEPTANCE_V3_PASS`.

The evidence log's SHA-256 is
`FA44E01022141C993F85E1F12E598338927642F1F27E971A54BCFE92413D88A1`.
It retains each case's actor evidence, exact input description as UTF-8 hex,
correlation id, outcome, selected rows, and asserted counts. The final cleanup
query observed `cleanup_schema_remaining | 0`, proving the disposable schema
was removed.

No behavior, frozen input, or future-stage artifact was changed.
