# Phase 2 Run Record and Invalidity Log

## Intended matrix

| Packet | Control | Treatment | Matched state |
| --- | --- | --- | --- |
| P1 `invoice-note` | not started | not started | no independent coding-agent dispatch |
| P2 `money-format` | not started | not started | no independent coding-agent dispatch |
| P3 `catalog-import` | not started | not started | no independent coding-agent dispatch |
| P4 `order-cancel` | not started | not started | no independent coding-agent dispatch |

## Attempted execution capability check

Date: 2026-09-04 (Asia/Tokyo)

Command: `codex login status`

Observed output: `Not logged in`

The locally available non-interactive coding-agent command is therefore unauthenticated. No configured model identifier, provider session, or executable independent agent was available to perform a pair under the frozen conditions.

## Invalidity / contamination assessment

The evaluator (the current interactive agent) is already aware of the candidate contract and Phase 1 documents. Using that evaluator to manually implement both arms would contaminate allocation and would not create independent Control/Treatment coding-agent outputs. Fabricating fixture patches or treating the evaluator’s own reasoning as two runs would also violate the frozen matched design.

No agent run was started. Consequently there are no raw agent outputs, patches, changed-file lists, test outputs, task-tree copies, or Control/Treatment diffs to save. This absence is an execution-blocking fact, not a negative result.

## Verification of the recorded invalidity

- `codex --help` confirmed that `codex exec` is the available non-interactive runner.
- `codex login status` returned `Not logged in` before any task dispatch.
- Candidate hash was recorded before this capability check and was not modified afterward.

## Supersession and completed alternative execution

The preceding unauthenticated-runner stop was superseded before dispatch by the user-authorized fresh-agent mechanism recorded in `alternative-execution.md`. Both arms then completed all four packets on separate copies of the same baseline. Both ran `npm test` successfully: 7 passed, 0 failed.

The raw final reports, exploration records, run-tree comparison, outcome table, and limitations are retained in `raw/` and `results.md`. The Phase 2 decision is `NO_PRACTICAL_SEPARATION_OBSERVED`.
