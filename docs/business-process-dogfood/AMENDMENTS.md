# Amendments

## 2026-09-05 — frozen acceptance-test path defect

Before worker dispatch, isolated run-copy inspection found that Stage 1–4 tests resolved `ddl.sql` one directory below repository root. Only the relative path changed from `../../../../docs/...` to `../../../../../docs/...`; business assertions, DDL, packets, and prompts are unchanged. The original freeze remains commit `1e67a6f853985ffe9e50d37fb8c9efd9efc79257`. No run had begun.

## 2026-09-05 — second path calculation correction

The first amendment used an incorrect ancestor count. The Stage 1 worker encountered `ENOENT` before application behavior ran; its source is not adopted. Mechanical `Resolve-Path` verification established six parent segments are required. Stage 1–4 tests change only the DDL path from five to six parent segments. A clean, fresh Stage 1 rerun is required.

## 2026-09-05 — Stage 2 acceptance-test defect

The pre-decision Stage 2 test required successful Quotation revision after sourced Order conversion. HD-007 explicitly makes an associated/ordered Quotation read-only. The original test and its hash remain in prior evidence. The amended test revises before conversion, verifies the copied total, and verifies post-conversion revision rejection. This is a test amendment required by the recorded human decision, not a new business decision.
