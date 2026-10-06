# Product System Requirements — approved synthetic revision SR-2026-10-A
Authority: product technical owner. Scope: support service, including the six supplied change candidates. These constraints are supplied, not inferred by the reviewer.
- SR1 Telemetry: acceptance events may contain event and opaque request_id only. Do not persist customer-derived identifiers, including hashes of email, in the telemetry collector.
- SR2 Identity boundary: continue using PlatformIdentity.resolve; use its tenant_id as the sole tenant authority. Request headers must never choose the authorized tenant.
- SR3 API: the existing unversioned acceptance response must retain id and case_id with equal values through this release; both fields are used by existing clients. status remains accepted. A future versioned endpoint may differ; this change has not introduced one.
- SR4 Migration: old and new readers must both work for the first 24 hours after the forward migration. Retain both legacy_title and subject during that period. A working down migration alone does not satisfy coexistence.
- SR5 Operation: a planned deployment may make the service unavailable for at most 15 minutes. Restore must complete within 30 minutes and lose at most 10 minutes of accepted data. Stated configuration is plan evidence only; production timing requires operation evidence.
The technical owner manages the correctness/completeness of this supplied set. No statement here guarantees that every relevant requirement has been discovered.
