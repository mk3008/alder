# Execution and verification evidence

## Authorization and configured runner

On 2026-09-12 the user explicitly authorized four fresh implementation sub-agents, requested third-party-verifiable records of their purpose/model/effort, then requested Astra's lowest available effort before any dispatch. All four were started with `model: gpt-6-astra`, `reasoning_effort: low`, `fork_turns: none`. The earlier proposed `medium` setting was **not used**.

| Arm | Task returned by runner | Use |
| --- | --- | --- |
| A | `/root/implement_a` | Current requirements only |
| B | `/root/implement_b` | Current requirements plus concrete foresight |
| C | `/root/implement_c` | Current requirements plus VSA |
| D | `/root/implement_d` | Current requirements plus Clean Architecture |

Each task continues in the same context for later stages. Four agents, not twenty independent samples. No extra reviewer agent is used. The parent evaluator prepares common tests, gates/freezes stages, classifies patches and interprets findings; it does not implement arm code. Its exact runtime model/effort is not exposed by an independent receipt and is recorded as unknown. Sub-agent model/effort are **explicit request settings**, not independently attested backend versions. Temperature, seed, backend revision and token/currency usage are unavailable and are not invented.

Exact spawn/continuation arguments, returned task names and the runtime version are under `work/maintenance-cost/records/`. Those record times are capture times after successful dispatch, not provider start timestamps. Test commands have their own observed UTC start/end times in check logs; these are not total implementation time.

## What was frozen and delivered

- `gates/`: evaluator-owned stage suites plus their source fragments.
- `prompts/`: exact extracted current packet and arm-specific instruction. Later packets are identical across arms.
- `records/frozen-inputs.json`: SHA-256 of all gate/prompt files, written before dispatch. `execution-settings.json` also hashes the unchanged per-workspace check runner.
- `records/harness-smoke.json`: five suite syntax checks plus an intentionally broken, always-throwing S0 probe rejected by all twelve S0 tests. This demonstrates a non-vacuous gate, not comprehensive mutation coverage.
- Each implementer sees only its assigned current `REQUEST.md`, current cumulative `acceptance.test.mjs`, `check.py`, and its own implementation history. The root evaluator retains future packets. Workspace isolation is enforced by instructions, **not an OS sandbox**. Arm reports state files read and any exposure; no full provider tool transcript or independent filesystem-access audit is available. Do not describe these self-reports as external proof of non-exposure.

All suites were prepared before S0. F2 replaces superseded threshold expectations; the non-approval regressions remain. Arm-added tests may be updated when a requirement supersedes their assertion, but evaluator suites must remain byte-identical to the appropriate frozen stage. Any such arm test amendment is visible in the snapshots/diffs.

## Prospective scope clarification at execution

The in-memory public API has no persistence loader or hot-upgrade mechanism. Therefore neither cross-version pending data migration nor cross-version historical data preservation can be dynamically demonstrated without introducing an extra product contract. The gate checks current behavior, subsequent-command preservation of prior records and review of the relevant patch; it does **not** claim to run a live state upgrade between snapshots. This narrows the historical cases described in the design and is an explicit coverage limitation, shared across all arms. No migration-specific advantage is assessed.

## Inspecting an actual run

For each captured `runs/<arm>/<stage>/`:

- `source/` contains the exact implementation and agent-authored tests after that stage, including retained existing tests.
- `manifest.json` contains every source-file SHA-256 and the evaluator gate exit code.
- `report.md` is the implementer's stage report, unedited by the evaluator.
- `agent-checks/` retains all recorded syntax/test attempts (including failures); `evaluator-check.json` is a separate verification after the implementer stopped.

The check runner records argv, stdout, stderr and exit status for syntax checks and the complete Node test invocation. Reports describe intermediate failures that did not reach the checker; those are self-reported, not reconstructed execution logs. Final-source churn does not measure discarded intermediate edits. Unrecorded model reasoning or provider-internal events cannot be independently replayed.

## Reproduction

From the repository root, with Python 3 and Node 24 available:

```sh
python3 work/maintenance-cost/tools/reproduce.py
python3 work/maintenance-cost/tools/measure.py > /tmp/alder-maintenance-measurements.json
diff -u work/maintenance-cost/records/measurements.json /tmp/alder-maintenance-measurements.json
```

The first command verifies frozen input/source hashes, reproduces the saved measurements, checks that the classification ledger covers each production hunk exactly once, and reruns all captured stages in temporary directories. The second independently recomputes raw per-file changes, physical line additions/deletions, cumulative totals and zero-context diff hunks. No package install, network access or model call is required. The classification ledger is a separate evaluator judgment that can be challenged against these hunks; executing scripts does not make that judgment objective. `export_diffs.py` regenerates reviewable stage patches and per-file numstats from the same sources.

The full replay was run once across all 20 snapshots and saved in `records/reproduction.json`. Later additions to ledger-integrity validation were checked directly against the saved measurements without needlessly rerunning unchanged product tests; a new invocation of this command performs both checks together.

`prepare.py` regenerates test/packet files from the recorded specification; it is for preparing another run, **not** necessary to replay this one. Do not overwrite frozen manifests to excuse changed inputs. A new agent experiment should preserve the same delivery boundaries and record new runner settings and outputs. Exact stochastic regeneration of the same implementation is not promised.
