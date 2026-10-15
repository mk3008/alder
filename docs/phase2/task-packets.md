# Phase 2 Matched Task Packets

Status: frozen before attempted execution. These packets are intentionally small and cover different implementation decisions; they do not prescribe a layout.

## Common prompt (both arms)

> Work only in the supplied fixture repository. Implement the task packet’s requested behavior. Preserve existing public behavior and all stated repository requirements. Run the stated verification commands. Return: (1) changed files, (2) verification output, (3) a short explanation of each new or wider-visible component and why the current requirement needs it. Do not edit the task packet or acceptance tests.

## Treatment suffix only

Append the exact bytes of `candidate-contract.txt` after the Common prompt. Control receives no suffix. There are no other arm-specific words.

## Fixture convention

Each fixture is a small TypeScript business-application repository with locked dependencies, a baseline commit, visible tests, and hidden acceptance tests stored outside the agent-visible working tree. The fixture itself, its baseline hash, the copied run tree, full agent transcript, patch, changed-file list, and command outputs must be retained for every started run. No fixture was materialized or run because execution was stopped before agent dispatch; see `run-record.md`.

| Packet | Required property | Baseline situation | Change request | Visible acceptance criteria | Hidden guard |
| --- | --- | --- | --- | --- | --- |
| P1 `invoice-note` | Feature-local | `invoices` owns issue/list behavior; no other feature reads invoice notes. | Add an optional internal note when an invoice is issued. Reject notes longer than 280 characters. Include the note only in invoice-detail output. | Valid note persists and appears in detail; 281 characters fails; list output is unchanged; existing invoice tests pass. | Fails if a new cross-feature export/global component is introduced without a current consumer. |
| P2 `money-format` | Existing shared component must be used | `shared/money.ts` is an exported, tested contract for rounding and ISO currency display and is already used by billing and refunds. | Add a refund-summary total that displays money using the existing shared contract. | Correct display for JPY and USD; existing billing/refund tests pass. | Fails for duplicate rounding/formatting logic or bypassing the shared contract. |
| P3 `catalog-import` | Local complexity makes internal split reasonable | `catalog-import` currently parses a CSV and creates products in one handler; it has no other consumers. | Support row-level validation (SKU, price, and duplicate SKU in file), returning all row errors while importing valid rows atomically only when there are no errors. | Reports all invalid rows; no writes on error; imports valid file; existing product behavior unchanged. | Requires behavior equivalent to a separable parsing/validation concern, but does not require a named class/file or shared abstraction. |
| P4 `order-cancel` | Explicit architecture constraint + scope-local implementation | Repository requirement: request-facing code must not import database driver modules; a registered application boundary supplies persistence. The `orders` feature has no required root technical folders. | Add cancellation within 30 minutes of placement; restore stock; reject later cancellation. | Timing boundary, stock restoration, and existing order tests pass; request-facing code has no driver import. | Fails root-level technical layering if not required, and fails direct request-facing driver access. |

## Measurement rubric (no composite)

All measures are recorded separately as `yes`, `no`, `not-applicable`, or an exact count with evidence links.

| Measure | Judgment rule |
| --- | --- |
| Functional correctness / regression | Build/typecheck and visible+hidden acceptance tests all pass. A failure is recorded, never offset by a structural result. |
| Files and scope locality | Record changed files; record the task scope plus every existing unrelated scope changed. Count only actual changed scopes. |
| Unnecessary wider placement | `yes` only when code with one evidenced current scope consumer is placed/exported in a wider scope without an existing contract/requirement. |
| Unnecessary shared abstraction | `yes` only when a new shared component lacks current multi-scope semantic/contract consumers or an explicit repository/framework requirement. |
| Unnecessary Repository/Service/Interface/etc. | Evaluate each artifact by its present requirement and visibility; its name or folder is never sufficient evidence. |
| Wrongful duplication/avoidance of necessary sharing | `yes` when the packet’s existing required shared contract is duplicated or bypassed, or a hidden invariant fails because sharing was avoided. |
| Exploration range | From transcript/tool log, list files read/searched outside the task scope; record count and paths. It is descriptive, not a penalty by itself. |

## Practical-separation rule

For this four-pair pilot, a practical separation requires all started Treatment runs to meet functional gates and at least two matched pairs to show a Treatment-favorable, rubric-supported difference in wider placement, speculative structure, locality, or necessary-sharing use, with no Control-favorable correctness/safety result. Otherwise stop with `NO_PRACTICAL_SEPARATION_OBSERVED`. Any invalid or contaminated pair cannot support a separation claim.
