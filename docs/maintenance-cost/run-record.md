# Execution record — Issue #45

Date: 2026-09-12. Status: **BLOCKED_BEFORE_ARM_EXECUTION**.

## Completed

- Read Issue #45 and its comments (none at inspection).
- Inspected the main tree at `d4e6395ebf02c5c1fed7334d2dde73ae5d2255b2`, current philosophy, frozen evaluation, Phase 2 runner/fixture, research sources, and purchase-request/meeting-room Business Designs.
- Created branch `research/45-maintenance-cost` from that main commit.
- Prepared a four-arm, five-stage design, concrete packets, Gate specification, measurement rubric, and bounded execution budget in this directory.
- No old research/fixture file was modified. No application implementation, acceptance harness, or measurement result has been fabricated.

## Capability and fairness blocker

The local environment exposes Node and Python, but `command -v codex` found no independent Codex CLI. The current interactive evaluator has already read the Issue's hypotheses and future changes. It cannot become a genuine no-foresight implementer merely by writing a different prompt for itself. Authoring all four arms here would therefore contaminate the central A/B contrast.

Fresh sub-agent tools exist in this session, but the session's controlling instruction prohibits spawning sub-agents unless the user or an applicable AGENTS.md/skill explicitly requests sub-agent/delegated/parallel work. There is no repository AGENTS.md. The Issue requests agent implementation but does not explicitly request sub-agent delegation. The earlier Phase 2 authorization is a record of a different task, not permission for this execution.

The smallest correction is explicit user authorization for four fresh implementation sub-agents, receiving only their assigned current packet and later changes. No paid external runner, larger sample, new architecture condition, or alternative research goal is required. The evaluator can then prepare/freeze tests, dispatch the arms and collect actual evidence. This is an instruction-boundary pause, not an automatic approval-review rejection.

## Actual execution matrix

| Arm | S0 | U1 | U2 | F1 | F2 |
| --- | --- | --- | --- | --- | --- |
| A — current requirements | not run | not run | not run | not run | not run |
| B — concrete foresight | not run | not run | not run | not run | not run |
| C — VSA | not run | not run | not run | not run | not run |
| D — Clean Architecture | not run | not run | not run | not run | not run |

Requirement Gates, raw/cumulative maintenance costs, prepayment recovery and H1–H5: **unknown, no arm observations**. The prospective Gate cases in `packets.md` have not been implemented or executed. This record must not be cited as evidence for or against any architecture.

## Cost and resume point

Actual implementation runs: **0**. Actual comparison test runs: **0**. Preparation consists of repository inspection and three documents; token/currency cost is unavailable and is not estimated. Proposed ceiling is four initial agent tasks plus sixteen continuations, with at most two correction rounds per stage. Runtime-only syntax/tests avoid dependency installation and external I/O.

Keep the PR Draft and Issue #45 open. Resume by confirming fresh-context authorization, preparing/fixing and freezing the common acceptance harness before S0, then executing the packet sequence without exposing future packets. Add actual source snapshots, logs, measured diffs and findings to this same branch; only then mark the research complete.
