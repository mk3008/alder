# REVIEW_PACKET — Scope Semantics Across Architecture Labels

## Question

This packet supports independent review of whether coding agents given each label express code use/visibility as the smallest semantic scope currently needing it. It does not rank architectures or recommend a product decision.

## Scope definition and human requirement

Scope is the smallest access/visibility boundary that currently needs code: function, file/module, feature, category, subsystem, or application-wide. It may be hierarchical and may evolve. The review concern is whether code is placed/visible at the smallest necessary scope, not whether a named folder, class, or layer exists.

## Protocol and arms

See `preregistration.md`, `task-packets.md`, `freeze-record.md`, `stage4-option1-amendment.md`, and `stage4-option1-freeze.md`.

Arms: `none`, `ddd` (`Use Domain-Driven Design.`), `clean` (`Use Clean Architecture.`), `vsa` (`Use Vertical Slice Architecture.`), and `scope-first` (frozen candidate SHA-256 `6C992C617EDAD4833673A4087DF8AAD13D5F742C48B898E4356CE996E882F1BE`).

Requested implementation/refactoring model/effort: Terra/medium, fresh sessions. Actual model/version is `unverified` because the execution surface did not return it. See `RUN_MATRIX.md`.

## Evidence index

- Baseline fixture: `work/phase3/fixture-base/`
- Frozen original task tests: `work/phase3/frozen-tests/`
- Corrected Stage 4 acceptance: `work/phase3/amendments/stage4-option1.test.js`
- Per-arm, per-stage tree snapshots: `work/phase3/runs/<arm>/<stage>/<implementation|refactoring>/`
- Final valid Stage 4 snapshots: `work/phase3/runs/<arm>/stage4-option1/refactoring/`
- Original Stage 4 defect evidence: `work/phase3/runs/<arm>/stage4/implementation/` and `protocol-blocker-stage4.md`
- Run status: `RUN_MATRIX.md`

For each snapshot, inspect root directories, tree, imports/exports, language visibility, changed files, and the usage scope of components named `common`, `shared`, `domain`, `repository`, `service`, `application`, `infrastructure`, or `features` if present. Do not treat their existence alone as an error.

## Functional verification

The final corrected Stage 4 test was rerun by the study operator in all five final refactoring snapshots: all five passed (1/1). Earlier stage agents reported their respective frozen tests passing; their trees are retained. No hidden test suite exists.

## Deviations and limitations

1. Original Stage 4 acceptance had a confirmed requirement/test contradiction. It is retained unchanged; Option 1 correction is a separately frozen amendment. Old partial Stage 4 runs are excluded.
2. Raw agent final messages are retained in the Codex task transcript, while tree/test artifacts are committed here. Exact model/version and agent session IDs were not exposed by the execution surface and are therefore recorded as `unverified`.
3. This is one fresh implementation/refactoring session per arm/stage, not a sample-size estimate. Agents were necessarily aware of their arm directive. There is no blinded scoring and no composite score.

## Questions for the fresh Sol/medium reviewer

1. For each arm, how do semantic scope and visibility appear in the tree and imports/exports?
2. Do DDD, Clean, or VSA structures distinguish feature-private, subsystem-private, and application-wide concerns in the evidence?
3. Does any root technical layer flatten feature-private or subsystem-private elements at the observed stages? State evidence, not a verdict.
4. Does the Scope-First reference arm express the stated scope requirement?
5. After each refactoring phase, did the observed structure persist or change?
6. At Stage 3, how did each arm represent the cross-workflow member-suspension constraint independently of a Domain Layer’s presence?
7. Does any existing-label arm provide evidence sufficient to express the human scope requirement without a separate definition? What remains indeterminate?
8. What protocol contamination, fixture bias, architecture priming, model/run inconsistency, or other validity threats limit interpretation?
9. Which claims cannot be answered from the retained evidence?

The reviewer must cite concrete files/trees/diffs and must not produce an overall architecture ranking or composite score.
