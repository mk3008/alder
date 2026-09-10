# Phase 4 factual observations

Status: exploratory observation log. This document does not characterize any placement as correct, too broad, or a winning candidate.

## Source snapshots and tests

Every implementation and refactoring snapshot is retained under `work/phase4/runs/<arm>/<stage>/<phase>/`. Frozen behavioral tests are in `work/phase4/frozen-tests/`; they assert behavior only and do not name directories, modules, layers, or abstractions.

| stage | introduced pressure | observation from retained final refactoring snapshots |
| --- | --- | --- |
| A | local purchase submission | all arms retained one `app.js`; the refactoring tasks removed the unused future `expenseClaims` fixture state. |
| B | sibling procurement approval | all arms retained one `app.js`; no refactoring structural change was recorded. |
| C | procurement-local lifecycle contract | `none`, `nearest-common`, and `semantic-first` retained a single module with non-exported draft-check helpers; `p3-baseline` used a non-exported helper in the same module. |
| D | second semantic subsystem | `p3-baseline` refactoring created `purchase-requests.js` and `expense-claims.js`; the other three refactorings recorded no structural change. |
| E | similar but distinct approval-message contracts | `none` and `semantic-first` refactorings created separate `purchase-requests.js` and `expense-claims.js` with an `app.js` facade; `p3-baseline` retained its Stage D modules; `nearest-common` retained one module. |
| F | cross-feature annual-budget invariant | final `none`, `p3-baseline`, and `semantic-first` snapshots have `annual-budget.js` plus the two workflow modules and `app.js`; `nearest-common` retains all logic in `app.js`. |

## Reusable-looking artifact evidence table (final Stage F refactoring snapshots)

| arm | artifact | physical location | declared visibility | actual consumers | consumer semantic areas | created/promoted stage |
| --- | --- | --- | --- | --- | --- | --- |
| none | annual-budget operations | `annual-budget.js` | exported from internal module; `setAnnualBudget` re-exported by `app.js` | `purchase-requests.js`, `expense-claims.js`, `app.js` | procurement, expense, public application API | F implementation |
| none | procurement workflow | `purchase-requests.js` | exported internally and re-exported by `app.js` | `app.js`; frozen test via public API | procurement | E refactoring |
| none | expense workflow | `expense-claims.js` | exported internally and re-exported by `app.js` | `app.js`; frozen test via public API | expense | E refactoring |
| p3-baseline | annual-budget operations | `annual-budget.js` | exported from internal module; `setAnnualBudget` exported by `app.js` | `purchase-requests.js`, `expense-claims.js`, `app.js` | procurement, expense, public application API | F implementation |
| p3-baseline | procurement workflow | `purchase-requests.js` | exported internally and re-exported by `app.js` | `app.js`; frozen test via public API | procurement | D refactoring |
| p3-baseline | expense workflow | `expense-claims.js` | exported internally and re-exported by `app.js` | `app.js`; frozen test via public API | expense | D refactoring |
| nearest-common | lifecycle and budget helpers | `app.js` | non-exported helpers; public functions exported from same module | public operation functions in `app.js`; frozen test | procurement, expense, public application API | C/F implementation |
| semantic-first | annual-budget operations | `annual-budget.js` | exported from internal module; `setAnnualBudget` re-exported by `app.js` | `purchase-requests.js`, `expense-claims.js`, `app.js` | procurement, expense, public application API | F implementation |
| semantic-first | procurement workflow | `purchase-requests.js` | exported internally and re-exported by `app.js` | `app.js`; frozen test via public API | procurement | E refactoring |
| semantic-first | expense workflow | `expense-claims.js` | exported internally and re-exported by `app.js` | `app.js`; frozen test via public API | expense | E refactoring |

The table describes module-level ESM exports. JavaScript has no package-private access modifier here; `app.js` remains the fixture's public entry point, while test imports use it only.

## Per-stage task record

For every arm and every stage, implementation and refactoring were separate fresh tasks with requested `gpt-5.6-terra` / `medium`; actual model/version/session identifier: **unverified**. Completion summaries and test results are represented by the source snapshot plus `RUN_MATRIX.md`.

Refactoring task result summaries: A removed future-only unused expense state in all arms; B made no structural change in all arms; C made no change in `none`/`nearest-common` and added a private draft helper in `p3-baseline`/`semantic-first`; D split only `p3-baseline`; E split `none` and `semantic-first`; F retained current structure except `none` consolidated local validation helpers. All reported `npm test` pass after the Stage D placement correction.
