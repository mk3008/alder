# Stage 4 Amendment: Option 1

Date: 2026-09-04 (Asia/Tokyo)

The human selected Option 1 after the recorded Stage 4 blocker. The business rule remains: `listOverdue({ now })` returns each open loan whose `dueAt < now`.

The original frozen file `work/phase3/frozen-tests/stage4.test.js`, prior task packet, candidate, blocker record, and old partial Stage 4 run trees remain unmodified. A new acceptance test was created at `work/phase3/amendments/stage4-option1.test.js`; its final assertion includes the still-open overdue `recent` loan.

The old Stage 4 implementation attempts are excluded from comparison. The new Stage 4 run matrix starts from the preserved Stage 3 refactoring snapshots and uses fresh implementation and refactoring agents for all five arms.
