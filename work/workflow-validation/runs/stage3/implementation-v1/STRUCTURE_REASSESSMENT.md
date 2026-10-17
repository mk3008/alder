# Stage 3 structural reassessment — implementation v1

Status: Stage 3 placement assessment. It uses the Stage 1–3 inputs and adds
only the safety-closure boundary required by the current horizon.

## Inputs and guidance

The assessment used the candidate workflow, HD-WV-001/002, frozen DDL, Stage
1 v3, Stage 2 v4, the Stage 1–3 packets, and Stage 3 acceptance. It did not
use later-stage material.

Exact structural guidance:

> For physical placement, choose the narrowest meaningful semantic boundary
> that owns the decision and contains its current required consumers.

## Complete source tree

```text
implementation-v1/
  report_equipment_fault.sql
  maintenance_lifecycle.sql
  equipment_safety.sql
  stage1-acceptance.sql
  stage2-acceptance.sql
  stage3-acceptance.sql
  run-stage1-acceptance.ps1
  README.md
  run-metadata.md
  acceptance-evidence.log
  STRUCTURE_REASSESSMENT.md
```

The first three files are the business-operation implementation. The three
acceptance SQL files and PowerShell runner are test instrumentation; the other
files are run evidence. There are no imports, exported modules, directories,
or application-wide technical-role namespaces in this candidate.

## Ownership and current consumers

| Artifact | Semantic owner / decision | Current actual consumers | Apparent range | Decision |
| --- | --- | --- | --- | --- |
| `report_equipment_fault.sql` | Maintenance-request intake: a reporter records an observed equipment fault as an open request, preserving the supplied observation time and description. | Stage 1 acceptance and the Stage 1+2 cumulative acceptance runner. Stage 2 reads the resulting request data but does not call this operation. | feature-local to request intake, represented as its own operation file | Keep separate; it is not a reusable helper. |
| `maintenance_lifecycle.sql` | Maintenance-request lifecycle: authorized coordinator scheduling and authorized technician completion, including the HD-WV-002 DB-clock chronology decision and the Stage 3 scheduling safety check. | Stage 2 acceptance and the cumulative runner. | Request lifecycle | Keep together; the safety check is part of schedule's existing state-admission decision. |
| `equipment_safety.sql` | Equipment safety-state closure and its explicitly required inspector authority evidence. | Stage 3 acceptance and cumulative runner. | Equipment safety state | Separate; this owns the equipment-state decision and is not request lifecycle behavior. |
| `stage2_authorization_fixture` in `maintenance_lifecycle.sql` | Acceptance-only evidence of the two explicitly supplied actor authorities. | `schedule_maintenance`, `complete_maintenance`, and frozen acceptance cases in this isolated schema. | test-local | Keep colocated with its only consumers; it is not an application identity/role model. |

## No-diff rationale

For physical placement, choose the narrowest meaningful semantic boundary that owns the decision and contains its current required consumers.

The current horizon has maintenance-request intake/lifecycle and equipment
safety state. The Stage 3 closure decision changes equipment state, so it is
placed in `equipment_safety.sql`; the schedule admission check remains at the
request-lifecycle decision that consumes it. No general service, repository,
or shared abstraction has a narrower current semantic owner.

Creating a folder, facade, service, repository, interface, or shared helper
would therefore add topology without a currently distinct semantic owner or
consumer set. The physical structure remains flat because this small current
horizon is still legible as two business-named operation files; flatness here
is a recorded no-change decision, not evidence that later structure is
precluded.

## Structural diff

Stage 3 adds `equipment_safety.sql`, `stage3-acceptance.sql`, and the narrowly
necessary closed-equipment predicate in `schedule_maintenance`. The Stage 1
intake and Stage 2 completion behavior are otherwise retained.

## Metadata

Requested worker/model/effort: fresh Terra / medium. Actual model, version,
session identifier, and freshness: **unverified**. The executing environment
and input hashes are recorded in `run-metadata.md`; the fresh verification raw
output and disposable-schema cleanup observation are recorded in
`acceptance-evidence.log`.
