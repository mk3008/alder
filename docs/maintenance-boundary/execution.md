# Execution and independent verification

This second experiment was requested in [PR #46](https://github.com/mk3008/alder/pull/46#issuecomment-5643502093). The existing authorization for four independent implementers and requested minimum Astra effort was retained. No additional model or replica was introduced.

## Inputs and contexts

- Requested model: `gpt-6-astra`; requested reasoning effort: `low`; initial `fork_turns: none` for all four agents.
- Returned task identities: `/root/boundary_a`, `/root/boundary_b`, `/root/boundary_c`, `/root/boundary_d`. These are the identities exposed by the runner; no additional provider ID is invented.
- Initial and continuation arguments are stored in [records](../../work/maintenance-boundary/records). Exact delivered task packets are in [prompts](../../work/maintenance-boundary/prompts).
- The supplied S0 suite contains Alpha only. The evaluator's S1 suite/template and future packets stayed outside every assigned workspace until all S0 outputs passed and were captured. No first-experiment implementations were given to the new agents.
- Model/effort values are requested runner settings, not backend attestations. Effective provider model/effort, seed, temperature, token/currency costs and evaluator runtime identity are unavailable. Node version is recorded in `execution-settings.json`.
- Agents had separate workspaces and explicit read boundaries on a shared filesystem. This is instruction-based isolation, not an OS access guarantee. Reports record self-reported files read and exposure. The evaluator is unblinded.

Inputs were hashed before dispatch. Preparation included replacing an unpublished draft S0 suite that contained disabled Beta branches with an Alpha-only suite; no implementer was started until this replacement and the final hashes were complete. S0 sources and their evaluator checks were committed as `75241d0` before revealing S1. The preparation commit includes a replay script whose full-run prerequisites are intentionally satisfied only by the final commit.

All functional and syntax verification attempts used the unchanged `check.py`. Capture copies agent logs before a separate evaluator check; S0 workspace audit logs were cleared only after archival, before S1. Capture does not edit production sources. Each snapshot stores a report, agent checks, evaluator check, source hashes and timestamp. Intermediate edits between checks are not automatically snapshotted; failures reported outside checks would be documented separately.

S1 preserves the original Alpha cases and adds Beta contract/failure/routing cases. Expected records gain the newly required `provider` field. The suite organization changes from Alpha-only to provider-parameterized tests; that is a pre-frozen requirement update, not a test relaxation after observing implementation. Tests use real ephemeral loopback HTTP servers, including intentional connection drops. This verifies local HTTP integration, not a commercial provider or deployed service.

## Reproduction

From the repository root, with Python 3 and Node supporting the built-ins used here:

```sh
python3 work/maintenance-boundary/tools/reproduce.py
python3 work/maintenance-boundary/tools/measure.py
python3 work/maintenance-boundary/tools/export_diffs.py
```

`reproduce.py` checks frozen inputs and source hashes, exact first-experiment preservation, saved-versus-recomputed measurements and complete hunk classifications, then replays each of the eight snapshots in temporary directories. Output includes the raw replay commands, stdout/stderr and exit codes. No agent call or package installation is required to replay saved behavior. Regenerating the implementations themselves requires a new model run and is not guaranteed to reproduce identical code.

`measure.py` and `export_diffs.py` reuse the first experiment's algorithms; only the root/stage list changes. Production, optional tests and support files remain separate. Raw line churn includes moves as deletion plus addition; exact-content file moves are separately reported. Filtered churn removes blank lines and standalone `//` comments only; it does not parse semantics. The hunk ledger's R/M/D/X assignments are evaluator judgments with explicit ambiguity and are not machine-proven cost attribution.

The first experiment's entire `docs/maintenance-cost` and `work/maintenance-cost` trees are checked against a file/hash manifest from `fb2bded27f58711187c552b29a0e9baf26b3e643`. No first-experiment result, input, measurement, conclusion or execution record is edited. The new [synthesis](../maintenance-cost-synthesis.md) updates Issue #45's overall assessment separately.
