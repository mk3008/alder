# Structure timeline

## Stage 1 clean implementation snapshot — adopted

Snapshot: `work/business-process-dogfood/runs/stage1/implementation-rerun-2/`.

- Complete source tree: `src/app.js`.
- Relevant path: `src/app.js`.
- Current semantic owner: Sales Quotation creation and search, including Quotation Line persistence and expiry determination.
- Current consumers: the fixed application entry/cumulative Stage 1 acceptance test only.
- Apparent physical scope: feature-local / single-file; no folder structure is inferred as required at this state.
- Changed from baseline: the fixed entry now exposes the Stage 1 application behavior through raw PostgreSQL access.

## Stage 1 post-defect-resolution snapshot — adopted

Snapshot: `work/business-process-dogfood/runs/stage1/consistency-resolution/`.

- Complete source tree: `src/app.js`.
- Relevant path and semantic owner remain `src/app.js` / Sales Quotation creation and search.
- Current consumers remain the Stage 1 caller and test.
- Changed from clean implementation: statement-time expiry validation and numeric-NaN rejection; no physical move, promotion, or demotion.

## Stage 1 refactoring

Adopted snapshot: `work/business-process-dogfood/runs/stage1/refactoring-rerun-1/`.

- Complete source tree: `src/app.js`.
- Relevant physical path remains `src/app.js`; no directory was introduced.
- Current semantic owner and consumer set are unchanged: Sales Quotation creation/search and the fixed Stage 1 caller/test.
- Structural change: validation/read helpers are colocated in the `QuotationStore` boundary inside the existing file. No promotion/demotion or cross-scope sharing was introduced.
- Diff: `evidence/diffs/stage1-refactoring.diff`.
- Verification: PostgreSQL cumulative acceptance tests 2/2 pass.

Stage 1 status: **complete**.

## Stage 2 — complete

- Adopted post-resolution snapshot: `work/business-process-dogfood/runs/stage2/consistency-resolution/`.
- Adopted refactoring snapshot: `work/business-process-dogfood/runs/stage2/refactoring-rerun-1/`.
- Complete source tree remains `src/app.js`; current semantic owners are Quotation lifecycle and Order creation with their present consumers.
- Refactoring moved shared input validation to module functions and removed OrderStore dependence on QuotationStore internals. No file/directory move, promotion, or demotion occurred.
- Diff: `evidence/diffs/stage2-refactoring.diff`; behavior verification 1/1 pass.

## Stage 1+2 post-review cumulative-repair baseline — adopted evaluation evidence

- Source evaluated: `work/business-process-dogfood/runs/stage2/refactoring-rerun-1/src/app.js`.
- Complete source tree remains `src/app.js`; no structure change was made by the repair.
- Semantic owners: Sales Quotation lifecycle (creation, exact search, revision) and Order creation/snapshot conversion.
- Consumers: fixed application entry and repaired cumulative Stage 1+2 acceptance suite.
- Verification: `work/business-process-dogfood/frozen-tests/cumulative-stage2-repair.test.js`, PostgreSQL 2/2 pass.
- This is an instrument-repair baseline, not a retroactive claim about original Stage 1/2 cumulative verification.

## Stage 3 HD-010 resolution implementation — unadopted

- Snapshot: `work/business-process-dogfood/runs/stage3/resolution-rerun-1/`.
- Complete source tree: `src/app.js`.
- Added semantic responsibilities: trusted actor-context validation, Order creator identity, approval waiting/decision, and Sales confirmation.
- Consumers: fixed application entry and frozen Stage 3 cumulative acceptance only.
- Apparent physical scope: single file; no move/promotion/demotion was performed.
- Verification: full currently frozen cumulative Stage 3 test 2/2 pass.
- Status: **unadopted**. The fresh Sol review found HB-S3-02 and HB-S3-03; no structural interpretation is adopted and refactoring has not occurred.

## Stage 3 — complete

- Adopted implementation snapshot: `work/business-process-dogfood/runs/stage3/consistency-resolution-rerun-3/`.
- Adopted refactoring snapshot: `work/business-process-dogfood/runs/stage3/refactoring-rerun-1/`.
- Complete source tree remains `src/app.js`. Current semantic owners are Quotation lifecycle, Order creation/snapshot, approval lifecycle, actor separation, and coherent search results; current consumers are the fixed application entry and cumulative acceptance.
- Refactoring colocated total calculation and initial approval-state determination in `OrderStore.initializeOrder`; no directory or module move, promotion, demotion, split, or speculative structure occurred.
- Verification: full Stage 1–3 cumulative v4 PostgreSQL acceptance 3/3 pass after refactoring.

## Stage 4 — complete

- Adopted implementation snapshot: `work/business-process-dogfood/runs/stage4/consistency-resolution/`.
- Adopted refactoring snapshot: `work/business-process-dogfood/runs/stage4/refactoring-rerun-1/`.
- Refactoring introduced `OrderStore.writeOrderLines` for its two current Order consumers (direct creation and approved-Order revision); no directory/module move or speculative structure.
- Verification: full Stage 1–4 cumulative v2 PostgreSQL acceptance 4/4 pass after refactoring.

## Stage 5 — complete

- Adopted implementation snapshot: `work/business-process-dogfood/runs/stage5/implementation/`.
- Adopted refactoring snapshot: `work/business-process-dogfood/runs/stage5/refactoring-rerun-1/`.
- Refactoring extracted the current reservation request/result boundary to `InventoryReservationStore`; Order confirmation remains its current consumer through a transaction-scoped request operation.
- Verification: full Stage 1–5 cumulative PostgreSQL acceptance 5/5 pass after refactoring.

## Stage 6 — complete

- Adopted implementation snapshot: `work/business-process-dogfood/runs/stage6/verification-v4/`; adopted refactoring snapshot: `work/business-process-dogfood/runs/stage6/refactoring-rerun-1/`.
- Complete source tree remains `src/app.js`. The file contains Sales cancellation, reservation-result reconciliation, and trusted release-completion behavior alongside the existing Order/Inventory semantic owners.
- Current consumers: the fixed application entry and frozen cumulative Stage 1–6 acceptance; release completion is only called through the trusted inventory-context input in the application boundary.
- Refactoring colocated repeated Order-line validation in `OrderStore.requireOrderLines`; no directory/module move, promotion, demotion, or new physical structural boundary occurred.
- Verification: cumulative Stage 1–6 v4 PostgreSQL acceptance 6/6 pass after refactoring. Language-level enforcement and exhaustive concurrent interleavings are not claimed.
