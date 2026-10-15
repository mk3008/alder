# Phase 2 Freeze Record

Date: 2026-09-04 (Asia/Tokyo)

## Preconditions checked

- Repository instructions: no repository-local `AGENTS.md` was present. The applicable user-level guidance requires Japanese conversation, English repository artifacts, and honest status reporting.
- Phase 1 artifacts: `README.md`, `docs/research.md`, `docs/proposal.md`, `docs/evaluation-plan.md`, and `docs/sources.md` were read before this freeze.
- Git history: the repository has no commits. There is consequently no earlier experimental state to reuse.
- Phase 1 boundary: unchanged. Scope-First is not being evaluated as a new architecture and no normative rule is being published.

## Phase 2 sampling amendment

Phase 1 proposed 480 runs across 12 tasks and two model strata. That is superseded **only for this Phase 2 execution** by the user-requested small matched evaluation: four task packets × Control/Treatment, one configured coding-agent service, for eight planned runs. This avoids seeking a difference by sample size. It does not change Phase 1’s conclusion or conceptual boundary.

## Frozen candidate

File: `docs/phase2/candidate-contract.txt`

Algorithm: SHA-256

Digest: `1714CAC1C7E8962ED622A01CB2FFF3A53A203693EFE607BE9287E910F22C19E1`

The digest was computed over the 371 bytes of the file as stored. No candidate edit is permitted after this record. The candidate contains no named architecture, framework, package/folder convention, or prescribed abstraction type.

## Execution conditions frozen

- Same task packet and baseline repository state per matched pair.
- Same model identifier, reasoning/configuration, sandbox, tools, time budget, and acceptance criteria per matched pair.
- Control contains the common prompt only.
- Treatment is the exact same common prompt followed by the exact frozen candidate file, with no other wording change.
- No composite score. Results are retained as per-measure differences and raw artifacts.

## Stop condition

If an independent, authenticated coding-agent execution cannot be started under these matched conditions, no substitute run by the evaluator may be presented as a Control/Treatment result. Record the invalidity and stop rather than contaminate the comparison.
