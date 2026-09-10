# Phase 6 factual review packet

## Research question

Does `Use Package by Component.` alone communicate information hiding at the narrowest sufficient visibility for current semantic owner and actual consumers, or does appending exactly one frozen judgment sentence produce a practical difference? This is not an architecture ranking and does not create/revise Scope-First Rules.

## Fixed research basis and arm difference

The Phase 5 fresh Sol/medium research advice is preserved in [PR #1 comment](https://github.com/mk3008/scope-semantics-across-architecture-labels/pull/1#issuecomment-5540081331). It supplied the two-arm proposal and Java/package-private rationale. Phase 3 remains `INVALID`; Phase 4 remains exploratory; neither is modified.

- Full preregistration: `preregistration.md`
- Exact prompts, hashes, fixture/task/test hashes, JDK image digest: `freeze-record.md`
- Arm A: `Use Package by Component.`
- Arm B: Arm A plus `Place each decision behind the narrowest enforceable boundary containing its current semantic owner and actual consumers.`

## Matched execution and snapshots

Implementation/refactoring source snapshots are retained in `work/phase6/runs/<arm>/implementation/` and `work/phase6/runs/<arm>/refactoring/`. Full diffs are in `evidence/diffs/`. Task and behavioral-only frozen test are in `task-packet.md` and `work/phase6/frozen-tests/`. Run metadata and raw completion summaries are in `RUN_RECORDS.md`.

Requested implementation/refactoring condition: fresh Terra / medium. Requested reviewer condition: fresh Sol / medium, read-only. Actual model/version/session metadata: unverified where the execution interface did not expose it.

## Observer evidence

- Visibility and consumer inventory: `VISIBILITY_AND_CONSUMER_INVENTORY.md`
- Generic source inventory and external compiler probes: `evidence/<arm>/refactoring/top-level-types.json` and `external-type-probes.json`
- Public binary-surface inventory: `evidence/<arm>/refactoring/javap-public.txt`
- Final independent frozen JDK 21 compile/acceptance verification: `RUN_RECORDS.md`

## Required independent reviewer questions

1. Did the fixture exert enough pressure to observe Information Hiding/minimum visibility?
2. Did Arm A form a boundary corresponding to semantic owner and actual consumers?
3. Did Arm B's extra sentence create a practical visibility/ownership difference rather than only a structural difference?
4. Were persistence/details internal to components in both arms?
5. Can a component client bypass the intended interface?
6. Was similar-but-different logic prematurely shared or kept with semantic ownership?
7. Was the cross-component invariant represented by one semantic authority?
8. Was application-wide visibility/sharing broader than actual consumers?
9. Was an unused anticipated abstraction added?
10. If arms are materially equivalent, is that evidence Package by Component communicated this tested property, and what limitations remain?
11. If a clear difference exists, which part of the added sentence plausibly accounts for it?
12. What threats arise from fixture bias, model uncertainty, freshness/isolation, and single-run design?

Interpretation boundary for the reviewer: equivalent visibility/ownership/invariant handling may be evidence that Package by Component communicated this tested property; Arm-B-only practical separation may be evidence that the explicit judgment is additionally needed. Neither is universal, an architecture ranking, or Scope-First normative text.
