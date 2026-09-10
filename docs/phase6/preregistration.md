# Phase 6 preregistration — Package by Component and semantic scope

## Status and question

Status: preregistered matched experiment. This phase leaves Phase 3 `INVALID`, Phase 4 exploratory, and Phase 5 research-design advice unchanged.

Question: does the existing directive `Use Package by Component.` alone communicate information hiding at the narrowest sufficient visibility for the current semantic owner and actual consumers, or does adding the frozen Phase 5 judgment sentence cause a practical difference?

This is not an architecture ranking and does not create or revise Scope-First Rules.

## Fixed basis

Phase 5 independent advice is retained in [PR #1 comment](https://github.com/mk3008/scope-semantics-across-architecture-labels/pull/1#issuecomment-5540081331). It proposed Java/package-private visibility and exactly these two directives. The advice itself is not edited here.

## Arms

| arm | frozen candidate-facing directive |
| --- | --- |
| A `package-by-component` | exact bytes of `prompts/arm-a.txt` |
| B `package-by-component-plus-judgment` | exact bytes of `prompts/arm-b.txt` |

The only intended arm difference is the second sentence in Arm B. The sentence is a measurement instrument, not normative Scope-First wording.

## Frozen inputs and execution

Fixture: `work/phase6/fixture-base/`. Frozen behavioral test: `work/phase6/frozen-tests/`. Frozen change packet: `task-packet.md`. The initial fixture contains no architecture/layer/feature/component/common/shared directory. Tests use only the public `study.MunicipalApplication` API and do not inspect structure or visibility.

Each arm begins from a byte-for-byte fixture copy. Its implementation and then its refactoring are separate fresh tasks requested as `gpt-5.6-terra` / `medium`. Both receive byte-identical common prompt text, fixture bytes, change packet, test, Java toolchain command, and acceptance criterion; only frozen directive text differs. A fresh independent reviewer is requested as `gpt-5.6-sol` / `medium`, read-only.

Actual model/version/session identifiers, timestamps, and session IDs are recorded as `unverified` unless surfaced by the execution interface. No substitute model may be used.

## Evidence, not scores

Evidence includes source snapshots, full diffs, build/test results, public/package-private/private visibility inventory, actual consumers, component interfaces/details/bypass surface, similar-but-different handling, shared-invariant authority, unused structures, generic compiler visibility probes, and deviations. No composite score or winner is produced.

## Interpretation boundary

Equivalent Arm A/B visibility, ownership, and invariant handling is evidence that Package by Component may have communicated this tested property under this fixture. A practical Arm-B-only separation is evidence that the explicit judgment may be needed in addition to the label. Neither outcome is universal, validates Phase 3, ranks architectures, or produces a normative Scope-First text.
