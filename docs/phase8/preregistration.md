# Phase 8 preregistration — structural topology under Package by Component

## Question and boundary

Question: does `Use Package by Component.` alone lead an agent to express feature-only, subsystem-shared, and application-wide structural dependency ranges as requirements change, or does appending the Phase 7 measurement sentence cause a practical structural difference?

Phase 8 evaluates `information-hiding modular decomposition` with primary evidence ordered semantic scope, structural scope, then enforced visibility. It is not an architecture ranking, Scope-First candidate revision, or normative rule process. Phase 3 remains `INVALID`; Phase 4 remains exploratory; Phase 5 and 7 remain research advice; Phase 6 evidence remains unchanged.

## Language/toolchain

Node.js ESM with `node --test` is fixed for both arms. ESM exposes imports/exports but provides no package-private mechanism; this intentionally prevents language-specific compiler access control from being the primary outcome. Physical source tree, topology, imports, actual consumers, ownership, and change locality are primary evidence. Visibility remains secondary inventory evidence only.

## Arms

| arm | exact directive |
| --- | --- |
| A `package-by-component` | exact bytes of `prompts/arm-a.txt` |
| B `package-by-component-plus-placement` | exact bytes of `prompts/arm-b.txt` |

The only intended arm difference is the second sentence in Arm B, copied exactly from Phase 7 advice. It is an experimental measurement instrument, not normative Scope-First wording.

## Frozen longitudinal procedure

Fixture, all five packets, all behavior-only tests, common prompts, arm prompts, and acceptance command are frozen before dispatch. Each arm begins from the same fixture, then its Stage 1–5 implementation/refactoring snapshots proceed sequentially from its own prior final snapshot. Each implementation and refactoring is a separately requested fresh `gpt-5.6-terra` / `medium` task. No arm may inspect the other arm. Independent review is requested fresh `gpt-5.6-sol` / `medium`, read-only.

Acceptance command in every run directory: `npm test`.

Actual model/version/session ID, run/session identifier, start/end timestamp, and per-run final Git SHA are recorded `unverified` unless exposed by the execution interface. The root protocol SHA at dispatch is recorded separately.

## Evidence, not score

Retain complete source trees, root/nested topology, full diffs, imports/dependency evidence, actual consumers, semantic owner/invariant/change reason, path, apparent structural range, technical role, promotion/demotion stage, verification, and unrelated-file impact. No composite score or winner is emitted.
