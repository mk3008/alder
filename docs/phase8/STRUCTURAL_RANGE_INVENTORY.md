# Phase 8 structural range inventory

Status: factual topology/consumer inventory. Apparent range is an observer label derived from the frozen business packet, observed current consumers, and physical path; it is not a winner score or a claim that a placement is uniquely correct.

## Timeline of final refactoring snapshots

| arm | stage | relevant physical topology and observed change |
| --- | --- | --- |
| A | 1 | `src/licensing/` contains issuance-local clearance, permit records, permits, and inspections; Finance is `src/finance/vendor-invoices.js`. |
| A | 2 | Licensing Board clearance remains at `src/licensing/licensing-board.js`, imported by both `building-permits.js` and `building-inspections.js`. |
| A | 3 | Finance tax clearance is `src/finance/tax-clearances.js`; no shared clearance artifact spans Licensing and Finance. |
| A | 4 | City policy is `src/city-operations/emergency-hold.js`, imported by Licensing permit issuance and Finance invoice approval. |
| A | 5 | inspection module no longer imports Licensing clearance; clearance remains at `src/licensing/licensing-board.js`; refactoring reports no physical move. |
| B | 1 | issuance-local clearance is physically under `src/licensing/buildingPermits/`, alongside issuance and permit records; inspections are sibling feature detail. |
| B | 2 | clearance moves to `src/licensing/buildingPermits/contractorLicensingClearance.js`, imported by issuance and inspections. |
| B | 3 | Finance tax clearance moves to `src/finance/vendorInvoices/vendorTaxClearance.js`; it remains distinct from Licensing. |
| B | 4 | City policy is `src/cityOperations/emergencyHold/index.js`, imported by high-risk issuance and invoice approval. |
| B | 5 | issuance decision and Licensing clearance move to `src/licensing/buildingPermits/highRiskPermitIssuance/`; inspections no longer import clearance. |

## Final Stage 5 artifact inventory

| arm | artifact | semantic owner / business meaning | actual current consumers | consumer semantic areas | physical path | apparent structural range | technical role if any | introduced | last moved/promoted/demoted |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A | Licensing Board clearance | Licensing Board; high-risk permit issuance clearance | building permits | Licensing issuance | `src/licensing/licensing-board.js` | subsystem-local/shared path, one current consumer | state/policy detail | S1 | no move after S2 consumer contraction |
| A | permit records | Licensing; permit lifecycle state | permit issuance, inspections | Licensing | `src/licensing/permit-records.js` | subsystem-local/shared | repository-shaped state detail | S1 ref | S1 ref |
| A | Finance tax clearance | Finance Office; vendor tax clearance | vendor invoice approval | Finance | `src/finance/tax-clearances.js` | feature-local path within Finance | state/policy detail | S3 | S3 |
| A | emergency hold | City Operations; city-wide emergency policy | permit issuance, invoice approval, municipal reset | Licensing, Finance, application entry | `src/city-operations/emergency-hold.js` | application-wide | policy/state detail | S4 | S4 |
| B | Licensing clearance | Licensing Board; high-risk permit issuance clearance | high-risk issuance | Licensing issuance | `src/licensing/buildingPermits/highRiskPermitIssuance/contractorLicensingClearance.js` | feature-local | state/policy detail | S1 | S5 demotion/move |
| B | permit records | Licensing; permit lifecycle state | high-risk issuance, inspections | Licensing | `src/licensing/buildingPermits/permitRecords.js` | subsystem-local/shared | repository-shaped state detail | S1 | S1 |
| B | Finance tax clearance | Finance Office; vendor tax clearance | vendor invoice approval | Finance | `src/finance/vendorInvoices/vendorTaxClearance.js` | feature-local | state/policy detail | S3 | S3 ref move |
| B | emergency hold | City Operations; city-wide emergency policy | high-risk issuance, invoice approval, municipal reset | Licensing, Finance, application entry | `src/cityOperations/emergencyHold/index.js` | application-wide | policy/state detail | S4 | S4 ref move |

## Related structural observations

- Both final trees use business-named paths (`licensing`, `finance`, and City Operations) rather than root `repository`, `service`, `domain`, `adapter`, `infrastructure`, `common`, or `shared` directories.
- Both arms retain distinct Licensing and Finance clearance artifacts when the Stage 3 packet says their authority and meaning differ.
- The Stage 4 city policy has observed imports from both Licensing and Finance decision paths; the Stage 5 Licensing clearance has no observed import from inspections in either arm.
- `src/municipal.js` is the fixed public application entry point in every snapshot. It composes/re-exports business boundary entry points.
- Node ESM exports are recorded in source snapshots but are secondary evidence for this phase.

## Change locality record

| arm / stage | changed semantic areas observed from implementation/refactoring diffs |
| --- | --- |
| A1 | Licensing, Finance, public entry; refactoring Licensing only |
| A2 | Licensing only |
| A3 | Finance and public entry |
| A4 | City Operations, Licensing issuance, Finance approval, public entry |
| A5 | Licensing inspections only |
| B1 | Licensing, Finance, public entry |
| B2 | Licensing only |
| B3 | Finance and public entry; refactoring Finance only |
| B4 | City Operations, Licensing issuance, Finance approval, public entry |
| B5 | Licensing inspections; refactoring Licensing issuance boundary |

Full source trees, imports, and diffs are retained under `work/phase8/runs/` and `evidence/diffs/` for third-party inspection.
