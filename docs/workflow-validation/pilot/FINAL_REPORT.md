# Alder pilot — final checkpoint, 2026-09-10

Status: **STAGE 1–4 ADOPTED — PLANNED PILOT CHECKPOINT COMPLETE**.
Final cumulative execution and independent re-review succeeded. The phase
owner adopts the current Stage 4 snapshot after that review; see
`work/workflow-validation/runs/stage4/implementation-v1/INDEPENDENT_REVIEW.md`.

## Current evidence and preservation

- Verified source head: `fd61d9c30761c1703e90af391c984d4e10e693a4`.
- [Corrected cumulative run 34462769183](https://github.com/mk3008/alder/actions/runs/34462769183).
- [Artifact 10146232671](https://github.com/mk3008/alder/actions/runs/34462769183/artifacts/10146232671):
  `alder-acceptance-34462769183-1`, 14,372 bytes, GitHub-reported SHA-256
  `3ee16c023064e914f29b8b8677c86bbd24ad9981449ceb505ee385e51c41feda`.
  It contains `stage4/inputs.sha256`, `stage4/acceptance-evidence.log`, and
  `stage4/cleanup.log`; the upload step confirmed three files and successful upload.
- Artifact retention is 90 days, with reported expiry 2026-12-09. The test
  step's raw timestamped console output is also committed as
  `work/workflow-validation/runs/stage4/implementation-v1/ci-evidence.log`,
  preserving hashes, observations and cleanup beyond artifact expiry.
- Artifact metadata/upload was verified through GitHub. Downloading ZIP bytes
  into this Work filesystem returned HTTP 403; no local archive integrity or
  extraction claim is made. The digest above is GitHub's reported value.

The run used PostgreSQL 18.6 / C.UTF-8 in an isolated CI service, schema
`alder_7ab3d9e55d334d50a28dea2d8b285e11`. All four actual cumulative pass rows
and cleanup count 0 were retained. Input hashes match the current source and
contracts. The final instrumentation satisfies the original business outcomes;
the repairs add missing gates/observations, not relaxed conditions.

CI replaces the unavailable local DB execution environment. It is a technical
execution adaptation, not a Business Rule change. Artifact preservation follows
the user's additional steering. No separate CI project or production deployment
was introduced. The workflow runs only on the pilot branch for relevant code
changes; each run uses its own disposable schema and service.

## What changed and what did not

1. HD-WV-003 explicitly keeps an existing request open when equipment closes.
   The Human Decision precedes the new Stage 3 acceptance freeze. The old
   contradiction and unadopted implementation remain historical evidence.
2. Stage 3 v2 integrates clock, fixture and exact preservation gates. It reuses
   the business source and existing DDL because both decided facts are already
   representable. The phase owner recorded adoption after its first successful
   run; the final review subsequently qualified that evidence as described below.
3. Stage 4 adds one inspector operation to clear equipment safety closure.
   An open request then becomes eligible for ordinary authorized future
   scheduling. Clearing does not schedule or otherwise mutate the request.
4. Final independent review found missing gates and recorded observations in
   inherited Stage 2 instrumentation, plus a Stage 3 pre-closure evidence gap.
   `frozen/final-instrument-amendment.md` was recorded before repairing the
   current Stage 4 snapshot. The corrected cumulative run verifies all stages
   against the current implementation. Earlier snapshots were not rewritten.

## Execution history and qualifications

| Evidence | Meaning |
| --- | --- |
| [34461758579](https://github.com/mk3008/alder/actions/runs/34461758579) | Initial Stage 3 CI stopped before DDL at an unsupported locale metadata query. Cleanup 0 retained; repaired via pg_database. Not a business failure. |
| [34461852280](https://github.com/mk3008/alder/actions/runs/34461852280) | Stage 1–3 executed successfully and Stage 3 was adopted at that point. Final review later found inherited instrument gaps; this run alone is not complete cumulative-contract evidence. |
| [34462310134](https://github.com/mk3008/alder/actions/runs/34462310134) | Initial Stage 4 execution passed before artifact steering; not the final corrected instrument. |
| [34462393587](https://github.com/mk3008/alder/actions/runs/34462393587) / [artifact 10146077782](https://github.com/mk3008/alder/actions/runs/34462393587/artifacts/10146077782) | Original Stage 3 and Stage 4 three-file bundles preserved after user steering. Successful runs with later-discovered instrument gaps; retained as historical, not promoted to final evidence. |
| [34462769183](https://github.com/mk3008/alder/actions/runs/34462769183) / [artifact 10146232671](https://github.com/mk3008/alder/actions/runs/34462769183/artifacts/10146232671) | Corrected Stage 1–4 cumulative execution, successful preservation and cleanup. Current evidence. |

Re-execution was caused by a runner defect, new Stage 4 behavior, explicit
artifact steering, and concrete review findings. Historical evidence remains
inspectable. Pass markers alone were insufficient to establish complete
instrument coverage; the final corrections address that distinction explicitly.

## Post-consistency structure and data reassessment

**No structural move justified.** Maintenance intake remains in
report_equipment_fault.sql; scheduling/completion remain in
maintenance_lifecycle.sql; closure and clearing share equipment_safety.sql
because both decisions belong to equipment safety and use the same inspector
authority. Scheduling consumes equipment status directly rather than calling
another service. The new operation adds a consumer of the existing safety
fixture within its current owner; it does not justify a common domain model,
repository or technical layer. No unused intermediary was found to remove.

DDL is unchanged. Request state and equipment eligibility are separate facts,
as HD-WV-003 explicitly decided. Three operation files express intended
business ownership; SQL schema visibility is not restricted by those files.
The actor tables are acceptance fixtures, not a production identity system.

## Observations and remaining limits

- Automatic: technical runner repair, acceptance repairs, existing-rule
  consequences and Stage 4 implementation; no new Human Decision after HD-WV-003.
- External: the original Astra handoff, HD-WV-003 and artifact-preservation
  steering. The recommendation's adoption is not evidence of automatic policy inference.
- Independent review found defects missed by the phase owner. The simpler
  orchestration worked through this bounded horizon, but the evidence does not
  establish fewer escalations, higher productivity or a causal model advantage.
- Earlier Terra/Sol-requested stages and the Astra-requested continuation are
  different conditions. Serving-model version/effort/session are unverified;
  the separate review is not a controlled model experiment.
- Unverified: concurrency, production authorization, unknown/repeated clearing,
  scheduled-at-closure policy, reporting while closed, audit/history/notification,
  offline completion and production migration. No new policy is inferred for them.
- One PostgreSQL/raw-SQL facilities case supports practical dogfooding only;
  no DDD/Clean/VSA ranking, new-theory claim or general architectural superiority.

The pilot stops at its planned final review. No Stage 5 or second scenario is
authorized by this report; PR #1/#2 and main remain unchanged.
