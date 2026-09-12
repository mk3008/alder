# Business-process consistency dogfood preregistration

This longitudinal research-only study observes a PostgreSQL-backed business application as activities are added. It does not create an architecture, a DDD alternative, terminology, rules, or a product decision.

The model uses established terms: business process, activity, performer, data model, business rule, precondition, postcondition, invariant, integrity constraint, consistency, satisfiability, under-specification, reachability, and soundness. No Domain/DDD premise applies.

## Stack

Node.js ESM, the `pg` PostgreSQL driver, raw SQL, PostgreSQL 16, Docker Compose, and Node integration tests are fixed. This uses actual relational DDL and avoids ORM/query-builder/schema-generation behavior. Docker is available in this environment; no simpler substitute is used.

## Study procedure

All DDL, stage packets, common prompts, and cumulative acceptance tests are frozen before Stage 1. Each implementation and refactoring task is a fresh Terra/medium task. Each cross-activity review is a fresh Sol/medium, read-only task. Workers receive only their current cumulative state and current-stage packet; they do not receive future packets, prior research conclusions, or other-arm material.

The historical Business Rule timeline is never passed wholesale to a worker. Before every Stage, only the then-current active rules are copied to a `current accepted Business Rules` worker-input snapshot; future pending rules are excluded.

Structural guidance is exactly:

`For physical placement, choose the narrowest meaningful semantic boundary that owns the decision and contains its current required consumers.`

No expected tree, layer, or shared-code objective is supplied. After every implementation: behavior verification, cross-activity consistency review, then (if no blocker) fresh refactoring. A consistency review must exhaust all discoverable current-snapshot blockers; under-specification, inconsistency, or data-model insufficiency stops later stages pending an appended human decision.

## Prospective blocker calibration

An omitted detail is a HUMAN_BLOCKER only when its resolution changes a Business Process/Activity outcome, allowed/forbidden business state or transition, Business Rule/invariant/consistency constraint, performer authority, Business Data meaning/cardinality/identity, cross-activity consistency, or ability of frozen Data Model to represent required facts. Implementation/API/UI/query/formatting/performance/logging/naming/pagination/serialization choices are made minimally and reversibly, and recorded as implementation assumptions only if material.

## Historical correction and prospective protocol

See [PROTOCOL_AMENDMENT_001.md](PROTOCOL_AMENDMENT_001.md). The original statement that all cumulative acceptance tests were frozen before Stage 1 was not realized: Stage 1 and Stage 2 tests were not run cumulatively against later source, and the Stage 5 and Stage 6 files are placeholders rather than executable acceptance tests. Historical artifacts and results remain unchanged. From the Stage 1+2 repair onward, every adopted snapshot must pass executable acceptance conditions for every still-active requirement, rule, and applicable human decision through that stage.
