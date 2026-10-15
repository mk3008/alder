# Phase 2 Alternative Execution Record

Date: 2026-09-04 (Asia/Tokyo)

The original execution attempt stopped because `codex exec` was unauthenticated. The user then explicitly authorized an alternative: dispatch two fresh Codex agents from this task, one for each arm. This changes the runner mechanism only; it does not alter the frozen candidate, common task prompt, fixture source, acceptance criteria, or intended measurements.

## Matched-run mechanism

- A fresh Control agent receives no Phase 1/Phase 2 history and receives only the common prompt plus the four task requests.
- A separate fresh Treatment agent receives no Phase 1/Phase 2 history and receives byte-identical common prompt/task text plus the exact frozen candidate bytes.
- Both agents use separate copies made from the same baseline fixture after this record.
- Both agents are instructed not to edit tests, task packets, candidate, or evaluation records; they may edit only their assigned run directory.

## Limitation recorded before dispatch

Each fresh agent completes all four packets serially. Thus this is a four-pair matched pilot, not eight independently re-sampled agent sessions. Results can reveal practical separation but cannot estimate a population effect or satisfy the larger Phase 1 sampling proposal.
