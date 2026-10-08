# Protocol amendment 001 — cumulative acceptance and pre-release scope

Status: adopted prospectively. This is append-only; it does not alter historical freezes, hashes, results, or claims.

## Study positioning

This is an **exploratory longitudinal case study**. It observes rule discovery, cross-activity consistency, human-decision return, data-model evolution, physical code structure, affected evidence sets, and run burden. It does not establish lower cognitive load, productivity, architecture superiority, universal applicability, or a new methodology.

## Pre-release scope

The study concerns **pre-release application development** only. There is no deployed production version or production data, no external production consumers, no backward/rolling-version obligation, no migration compatibility window, no online backfill, zero-downtime, rollback, or coexistence constraint. When current business semantics show that DDL or source structure is insufficient or wrong, direct pre-release correction is permitted. This does not establish that the same correction is safe post-release.

Post-release schema evolution, compatibility, migration ordering, production rollback, availability, and long-lived-consumer obligations are out of scope.

Future research gap: **transition from unconstrained pre-release evolution to compatibility-constrained post-release evolution**. This study does not define that transition. Open cases include pre-release external consumers, emerging production data, dependent teams, version coexistence, and whether wholly internal unused structures remain freely changeable after release.

## Correction to the original cumulative-acceptance claim

The preregistration said that cumulative acceptance tests were frozen before Stage 1. In fact, Stage 1 and Stage 2 acceptance was not cumulatively executed against current later source. Stage 5 and Stage 6 test files are placeholders, not executable frozen acceptance criteria. Those historical files remain preserved and are not retrospectively relabeled as cumulative evidence.

The Stage 1+2 cumulative suite created after this amendment is a **post-review evaluation-instrument repair**, not original preregistered evidence. It tests the current adopted Stage 2 source against all still-active Stage 1+2 conditions. If it fails, its repair is kept separate from Stage 3 work.

## Prospective cumulative acceptance

For every later adopted snapshot, execute acceptance conditions for all still-active business requirements, business rules, and applicable human decisions through that stage against the current implementation. A prior snapshot's historical passing result is not current regression verification.

When a human decision supersedes a prior acceptance condition, preserve the old condition and record the old requirement, superseding decision, new condition, why the old condition is no longer required, and the property removed from study scope. A policy that is not yet decided is not called a frozen acceptance test: freeze only known requirements after the required human decision and before implementation.

## Worker-input correction

Every current worker packet must be self-contained: exact current DDL, cumulative requirements, complete active Business Rule text, applicable Human Decisions, current adopted source, current cumulative acceptance suite, current stage packet, and the fixed placement sentence. The historical ledger, future packets/rules, prior worker output, and prior study results are not worker input. The initial DDL intentionally contains future-activity tables; this is future-concept leakage and limits the study to incrementally implementing activities on an already-designed relational data model, not deriving a schema from prose.

## Finding provenance and evidence

Observer records classify findings as `implementation defect`, `logically entailed Business Rule / invariant`, `HUMAN_BLOCKER — under-specification`, `HUMAN_BLOCKER — inconsistency`, or `HUMAN_BLOCKER — data-model insufficiency`; provenance is `explicitly_cued`, `latent_cross_activity`, `non_business_false_positive`, or `uncertain`. These labels are observer evidence, not worker instructions.

For each stage, record the target activity, supplied rules, relevant data/tables, changed source, DDL changes, actually implicated activities/rules/data, unrelated areas not implicated, human decisions, blockers, defects, and repository-observable burden indicators. Do not infer token use, human time, or cognitive load.
