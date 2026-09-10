# Phase 9 structural range inventory

Status: factual topology/consumer inventory. `Apparent structural range` is an observer classification derived from frozen packet semantics, observed current imports/consumers, and physical path. It is not a winner score or a uniquely correct placement claim.

## Final Stage 5 artifact inventory

| arm | artifact | semantic owner / meaning | current consumers | consumer areas | physical path | apparent structural range | technical role | introduced | last moved/promoted/demoted |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A | Licensing clearance | Licensing Board; high-risk permit issuance clearance | permit issuance | Licensing issuance | `src/licensing/building-permit-issuance.js` | feature-local | policy/state detail | S1 | S5 demotion/move |
| A | inspection scheduling | Licensing; inspection lifecycle | public entry | Licensing inspection | `src/licensing/building-inspection-scheduling.js` | feature-local | operation detail | S2 | S2 |
| A | Finance tax clearance | Finance Office; invoice approval clearance | invoice approval | Finance | `src/finance/vendor-invoice-approval.js` | feature-local | policy/state detail | S3 | S3 refactoring |
| A | emergency hold | City Operations; city emergency policy | permit issuance, invoice approval, reset | Licensing, Finance, application entry | `src/city-operations/emergency-hold.js` | application-wide | policy/state detail | S4 | S4 |
| B | Licensing clearance | Licensing Board; high-risk permit issuance clearance | permit issuance | Licensing issuance | `src/licensing/building-permits/permit-issuance/licensing-clearance.js` | feature-local | policy/state detail | S1 | S5 demotion/move |
| B | permit records | Licensing; permit lifecycle state | issuance, inspections | Licensing | `src/licensing/building-permits/permit-records.js` | subsystem-local/shared | repository-shaped state detail | S1 ref | S1 ref |
| B | Finance tax clearance | Finance Office; invoice approval clearance | invoice approval | Finance | `src/finance/vendor-tax-clearance/index.js` | feature-local | policy/state detail | S3 | S4 refactoring |
| B | emergency hold | City Operations; city emergency policy | permit issuance, invoice approval, reset | Licensing, Finance, application entry | `src/city-operations/emergency-hold.js` | application-wide | policy/state detail | S4 | S4 |

## Timeline / locality record

| arm | stage | observed topology or changed semantic areas |
| --- | --- | --- |
| A | S1 | root Licensing Board detail; refactor creates issuance-local operation file |
| A | S2 | Licensing-only change; refactor creates `licensing/` shared boundary |
| A | S3 | Finance plus public entry; Finance refactor localizes invoice approval |
| A | S4 | City Operations, Licensing issuance, Finance approval, public entry |
| A | S5 | Licensing inspection implementation; refactor changes Licensing issuance boundary |
| B | S1 | Licensing building-permits boundary plus Finance; refactor remains inside Licensing |
| B | S2 | Licensing-only shared Board authority inside building-permits |
| B | S3 | Finance plus public entry; refactor nests vendor-invoices |
| B | S4 | City Operations, Licensing issuance, Finance approval, public entry; refactor separates local component paths |
| B | S5 | Licensing inspection implementation; refactor moves issuance-local clearance |

Both final trees use business-named paths. Neither final tree contains root `repository`, `service`, `domain`, `application`, `infrastructure`, `adapter`, `common`, or `shared` directories. The Licensing and Finance clearances remain distinct in both arms. `src/municipal.js` is the fixed public entry point. Node ESM exports/imports are retained in snapshots as secondary evidence only.

Complete source snapshots are under `work/phase9/runs/`; full implementation/refactoring diffs are under `docs/phase9/evidence/diffs/`.
