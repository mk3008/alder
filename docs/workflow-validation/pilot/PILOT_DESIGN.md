# Pilot design — facilities maintenance

One pre-release PostgreSQL/raw-SQL case. A site reporter records an equipment
fault; a maintenance coordinator schedules and completes work; a later safety
inspection can close the same equipment to new maintenance requests. This is
not the order scenario from PR #2.

Two semantic areas exist: **maintenance requests** and **safety inspections**.
They connect through equipment data. Initial DDL deliberately includes only
equipment and maintenance-request facts; whether later inspection facts require
DDL is evaluated from the stated requirements, not inferred from table names.

| stage | activity / purpose | pressure |
| --- | --- | --- |
| 1 | Reporter records an open fault for equipment. | genuinely local request intake. |
| 2 | Coordinator schedules and technician completes a request. | request lifecycle and ownership grow. |
| 3 | Inspector records an unsafe result that closes equipment and blocks further scheduling. | cross-area invariant and current shared equipment authority. |
| 4 | Inspector clears the safety closure; scheduling is again permitted. | consumer/range re-evaluation without a prescribed move. |

No required folder tree, class, module, common location, layer, or visibility
mechanism is part of the business packet.
