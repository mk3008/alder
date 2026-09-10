# Phase 3 Preregistration: Scope Semantics Across Architecture Labels

## Research question

When a coding agent receives an architecture label, does its resulting code naturally express the smallest required access/visibility scope? If an existing label already expresses this human requirement, a separate Scope-First definition may be unnecessary. This study does not rank architectures or make a product decision.

## Frozen model condition

Implementation and refactoring: requested model `gpt-5.6-terra`, requested reasoning effort `medium`, fresh agent/session for each run where dispatch is available. Third-party review: requested model `gpt-5.6-sol`, requested effort `medium`, fresh and read-only. Actual identifiers are recorded as `unverified` unless the execution surface returns them.

## Arms

| Arm | Directive appended to the common prompt |
| --- | --- |
| A `none` | *(none)* |
| B `ddd` | `Use Domain-Driven Design.` |
| C `clean` | `Use Clean Architecture.` |
| D `vsa` | `Use Vertical Slice Architecture.` |
| E `scope-first` | Exact bytes of `scope-first-candidate.txt` |

No other arm-specific explanation, template, or architecture hint is allowed.

## Fixture and task freeze

Fixture: `work/phase3/fixture-base`. It contains only a small lending business state in `app.js`, test runner metadata, and no directory named for an architecture, layer, feature, subsystem, or pattern. It is copied byte-for-byte into each arm at Stage 1. Subsequent stages start from the prior same-arm post-refactoring snapshot.

Task packets and acceptance tests are frozen in `task-packets.md` and `work/phase3/frozen-tests`. Tests assert business behavior only; they do not assert folder, class, module, layer, or architecture names.

## Stage procedure

For every arm and every stage:

1. Start a fresh Terra/medium implementation agent in a copy of that arm’s prior state.
2. Give the common task prompt plus only the arm directive.
3. Run the frozen acceptance test suite and snapshot the result.
4. Start a fresh Terra/medium refactoring agent on that same state. It may change structure but not observable behavior.
5. Run the same tests and snapshot the result.

The common refactoring prompt is: “Review all current business requirements and implementation. Do not preserve existing folders, packages, or modules merely because they exist. If needed, refactor the structure so the specified architecture is naturally expressed for the current requirements. Do not make unnecessary changes. Do not change observable behavior. Run the tests.”

## Evidence (not a score)

For every arm/stage/phase, retain source tree, root directories, changed files, diff, imports/exports, language visibility, actual consumers of shared elements, contents/usages of technical/root directories, raw agent output, functional output, start/final SHA, timestamps, and requested/actual model metadata. The presence of a Repository, Service, Interface, Domain Layer, shared directory, or root technical layer is recorded rather than scored.

## Protocol deviations

Any unavailable specified model, missing fresh agent, inability to snapshot, failed acceptance, or cross-arm exposure is recorded and not repaired by model substitution.
