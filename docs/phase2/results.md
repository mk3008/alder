# Phase 2 Pilot Results

## Decision

**NO_PRACTICAL_SEPARATION_OBSERVED**

This is a stop decision for this small matched pilot. It is not a claim that Scope-First is false, nor a justification for promoting the candidate to normative rules.

## Matched outcomes

| Measure | Control | Treatment | Observed difference |
| --- | --- | --- | --- |
| Functional correctness | `npm test`: 7/7 passed | `npm test`: 7/7 passed | None |
| Existing regression | 3 existing tests passed | 3 existing tests passed | None |
| Changed files | Four task-scope files | Same four task-scope files | None |
| Unrelated existing scopes changed | 0 | 0 | None |
| Feature-private code placed wider | No | No | None |
| New shared abstraction | No | No | None |
| New Repository/Service/Interface/etc. | No | No | None |
| Required shared contract use (P2) | Used `src/shared/money.js` | Used `src/shared/money.js` | None |
| Wrongful duplication/avoidance | No | No | None |
| P3 internal structure | Kept local implementation in its existing file | Same | None; neither chose an extra split |
| P4 explicit architecture requirement | Request-facing code did not import a driver | Same | None |
| Exploration | 10 named files; assigned tree enumerated | Same 10 named files; assigned tree enumerated | No practical difference |

The two run-tree implementations were not byte-identical, but their differences were local coding choices only. Neither arm created a wider-visible component, technical root folder, shared abstraction, Repository, Service, or Interface. That absence is not scored as a failure: no current requirement justified one.

## Evidence retained

- Frozen candidate and hash: `candidate-contract.txt`, `freeze-record.md`
- Task packets and rubric: `task-packets.md`
- Fresh-agent execution protocol and limitation: `alternative-execution.md`
- Raw agent reports: `raw/control-final.md`, `raw/treatment-final.md`
- Run trees: `work/phase2/runs/control`, `work/phase2/runs/treatment`
- Tree comparison: `raw/control-vs-treatment.diff.md`

## Validity and contamination

1. The runner substitution was user-authorized and recorded before dispatch. Each arm used a fresh agent and a separate copy of the same baseline.
2. This is one fresh agent per arm completing four packets serially, not independently resampled runs. Within-agent learning can affect later packets.
3. The agents were not blinded to arm; Treatment necessarily saw the candidate. Review was performed after output and was not independently blinded.
4. The fixture had visible acceptance tests. No separately materialized hidden tests were run; therefore the result establishes visible functional correctness only.
5. Treatment’s post-edit `git status` discovered parent `.git` metadata and failed on ownership protection; it reported no external content read. This is a minor non-content exposure asymmetry.
6. The candidate was not altered; its SHA-256 digest was rechecked after execution and remained `1714CAC1C7E8962ED622A01CB2FFF3A53A203693EFE607BE9287E910F22C19E1`.

These limitations mean the pilot cannot support `PROCEED_TO_NORMATIVE_DRAFT` even if a small difference had appeared. With no rubric-supported practical difference at all, the preregistered stop condition applies.
