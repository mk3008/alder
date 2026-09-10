# Phase 9 factual review packet

## Question and boundary

Does the Phase 7 physical-placement sentence alone express the frozen Phase 8 sequence's feature/subsystem/application structural ranges, or does adding exactly `Use Package by Component.` produce a practical structural difference? No architecture ranking, Scope-First text, new rules, or recommendation is requested.

## Frozen inputs and matched condition

- `preregistration.md`
- `freeze-record.md`
- `task-packets.md` (exact Phase 8 copy)
- `prompts/` (common inputs and Arm B are exact Phase 8 copies)
- `work/phase9/fixture-base/` and `work/phase9/frozen-tests/` (exact Phase 8 copies)

Arm A is the placement sentence alone. Arm B is `Use Package by Component.` followed by the same placement sentence. The component label is the sole intended difference.

## Evidence

- source snapshots: `work/phase9/runs/<arm>/stage<1-5>/{implementation,refactoring}/`
- full diffs: `evidence/diffs/<arm>/stage<1-5>-{implementation,refactoring}.diff`
- worker conditions, verification, deviations: `RUN_RECORDS.md`
- topology, consumers, range, locality: `STRUCTURAL_RANGE_INVENTORY.md`

Requested workers: fresh Terra / medium. Requested independent reviewer: fresh Sol / medium / read-only. Actual model/version/session metadata is `unverified` where unavailable.

## Required reviewer questions

1. Does the matched design isolate the added value of the Package by Component label?
2. Did Arm A express feature/subsystem/application structural range in physical topology?
3. Did Arm B have a practical structural benefit absent in Arm A?
4. Was there a Stage 1 feature-local placement difference?
5. Was there a Stage 2 promotion/intermediate-scope difference?
6. Was there a Stage 3 similar-but-different separation difference?
7. Was there a Stage 4 application-wide-authority difference?
8. Was there a Stage 5 demotion/reconsideration difference?
9. Was there a technical-role-flattening difference?
10. Is third-party tree readability of ownership/dependency range different?
11. Is change locality meaningfully different?
12. Does the assessment remain when language visibility is excluded?
13. If effectively equivalent, how strong is the narrow evidence that the label is unnecessary for this tested property?
14. If Arm B is clearer, what specifically did the label add?
15. What threats arise from one trajectory, model metadata, fixture reuse, task wording, and prior-study history?

The reviewer must distinguish direct observations from inferences, must not rank architectures, and must not create Scope-First normative text.
