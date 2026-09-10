# Phase 3 Protocol Blocker: Stage 4 Acceptance Contradiction

Status: **blocked pending human clarification**.

## Observed contradiction

The frozen Stage 4 requirement says that `listOverdue({ now })` returns every **open** loan with `dueAt < now`.

The frozen test creates two open loans, `old` and `recent`. It returns `old`, then calls `listOverdue({ now: recent.dueAt + 1 })` and expects `[]`. At that time `recent` remains open and `recent.dueAt < now`, so the stated requirement requires it in the result.

The contradiction was independently observed in the Stage 4 implementation attempts for arms `none`, `ddd`, `clean`, and `vsa`. The independent reproduction in `none` returned `loan-2`/`b1`/`m2`, while the test expected `[]`.

## Actions taken

- Stage 4 Scope-First implementation was **not started**.
- No Stage 4 architecture-refactoring phase was started in any arm.
- No acceptance test, task packet, candidate, or earlier research artifact was edited.
- The frozen candidate SHA-256 remains `6C992C617EDAD4833673A4087DF8AAD13D5F742C48B898E4356CE996E882F1BE`.

## Run matrix at block

| Stage | none | ddd | clean | vsa | scope-first |
| --- | --- | --- | --- | --- | --- |
| 1 implementation/refactoring | passed / passed | passed / passed | passed / passed | passed / passed | passed / passed |
| 2 implementation/refactoring | passed / passed | passed / passed | passed / passed | passed / passed | passed / passed |
| 3 implementation/refactoring | passed / passed | passed / passed | passed / passed | passed / passed | passed / passed |
| 4 implementation | requirement-conformant; frozen test fails | requirement-conformant; frozen test fails | requirement-conformant; frozen test fails | requirement-conformant; frozen test fails | not started |
| 4 refactoring | not started | not started | not started | not started | not started |

## Required human decision

Choose one unambiguous Stage 4 behavior before any new run:

1. Keep the stated overdue rule. Then the final test expectation must include `recent`.
2. Keep the final empty-array expectation. Then specify what business rule excludes `recent` despite it being open and overdue.

Either choice changes a frozen task/acceptance artifact. It requires a new Stage 4 freeze and a fresh matched Stage 4 run for **all five** arms; existing Stage 4 partial outputs must not be pooled as completed results.
