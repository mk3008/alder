# Business Design field-role review: bounded regression result

This file records candidates 1–2 and their initial comparison. A later, separately authorized candidate 3 simplifies the intervention around reader clarity; its one four-case comparison and remaining gaps are recorded in [Name-first reader check](reader-check/RESULT.md). The failures below remain unchanged.

## Decision

**Do not call this correction validated or ready for adoption.** The two guidance candidates did not recover the motivating naming issue in fresh reviews. The synthetic comparison is tied: both installed guidance and candidate 2 detected all four designed defects and preserved all four normal cases. There is no observed detection improvement in this set.

The draft changes remain a reviewable proposal. No release, version change, installed-plugin update or merge was performed. Authoring was not changed: these runs test review, not independent drafting behavior.

## Attribution by stage

The motivating work began from requirements and conversation, not a controlled transcript-to-draft experiment. Initial drafting already received human corrections to several fields. The particular name at issue was present after a later whole-document revision using the authoring Skill, and the subsequent quality review did not surface it. The repeated review trials here establish that miss for these runs; they do not establish why drafting produced the wording, exonerate authoring, or prove a defect specific to transcription. These are separate responsibilities: creating a clear draft, revising it without reducing clarity, and detecting remaining problems. A dedicated authoring comparison is unperformed and is not silently added to this task.

## What changed

- Candidate 1, package `0938ee320f6036ab664ff970c3561dd39d914de4`, source `948de82a61c7298488ee991d643a0cc8b30e2101`: apply existing field definitions by tracing each Activity's actual scene in both directions, separately from source fidelity; distinguish configuration from later execution.
- Candidate 2, package `6b3d53082d53f1bfecdb7a069d5775175e103001`, source `71116bb6a90250249314810f27d9f022c659bd62`: additionally inspect the name's verb, object and modifier, distinguishing the present work from a later operation's start condition. Preserve meaningful target qualifiers and do not impose a time-word ban.
- Canonical guidance is `docs/business-design-quality-check.ja.md`; the review Skill invokes it. The package copies are generated from the published source commit. The existing pinned-source test now includes this review bundle.

## Synthetic comparison

Inputs and intended judgments were published before dispatch at `f8c25e68561b730dc35a3927eb9d75c35ede2205`. They are fully synthetic, not a redacted copy of the motivating private design. The evaluator-only expectations were kept out of the reviewers' input directory. Each arm received the same two input files and the same review request apart from guidance acquisition and evidence destinations.

| Case | Intended probe | Installed | Candidate 2 |
| --- | --- | --- | --- |
| S01 | Name places configuration at the later execution event | Detected | Detected |
| S02 | When borrows the later operation's trigger | Detected | Detected |
| S03 | Result claims the later operation is already complete | Detected | Detected |
| S04 | A second Activity swaps Who and Where | Detected | Detected |
| S05 | Valid save trigger and time-qualified setting target | Preserved | Preserved |
| S06 | Saved-state target, UI viewing work, display-based result | Preserved | Preserved |
| S07 | Explicitly unresolved business choice | Preserved | Preserved |
| S08 | Separate setting and later execution, meaningful time qualifiers | Preserved | Preserved |

Neither arm added a mandatory correction to S05–S08, resolved the open choice, added an approval or guaranteed a person's understanding. Both located all four intended defects. These are evaluator judgments against designed expectations, not objective business approval or a statistical quality estimate. Ten Activities across eight small cases do not prove exhaustive field coverage or a model's hidden checking process.

The S01 phrase explicitly locates the setting action at the wrong time. This is a stronger semantic contradiction than a name whose modifier may grammatically describe its setting target. Consequently, success on S01 cannot establish that a subtle naming/readability problem has been solved.

## Guidance acquisition and evidence

- Installed arm: actual `skills.read` of `alder-review-business-design` and its four required references, with source provenance `9cf192c5bced1eeb872795eec8ced21b7bcbf492`. The reviewer could not retrieve `plugin.json` or a usable version from available metadata, and correctly reported the installed version as unknown for this run. Do not infer its manifest version from a different run. Repository files were not substituted for installed guidance.
- Candidate arm: the published candidate 2 package bytes in an isolated local snapshot. Its manifest still says `0.4.5`, but these are unpublished changed bytes, not an installed 0.4.5 release. Four reference digests matched the candidate provenance.
- Requested settings for both arms: `gpt-6-sol`, `medium`, `fork_turns: none`, following repository AGENTS. Effective runtime settings were not independently attested.
- Full dispatched prompts and final responses are retained in `runs/installed/` and `runs/candidate/`. The source-level candidate path and installed acquisition route differ; this is not a randomized or host-routing experiment.
- Input SHA-256: designs-a `ed183f52cfc2f5abc8bf0702760bd12a8bc1c8a85c29b5665e3bf02f5e36e9a4`; designs-b `07a17a8ed41907fc1e5f94e509dfd44d463b666626496d9ab5dffbd147b48443`.

## Motivating case: bounded private observation

The original input and outputs are private and are not included or mapped to the synthetic cases here. An installed-guidance fresh review missed a human-reported naming problem. Candidate 1 also missed it. Candidate 2's first run accessed prohibited prior-review material and was invalidated, with the deviation retained privately. A replacement fresh run using only three allowlisted, isolated source documents again missed the naming issue. No result was rewritten or silently discarded.

These private observations are not publicly auditable from this repository. The public synthetic comparison is supporting evidence about nearby clear contradictions and counterexamples; it is not a substitute for the unresolved original issue. Each valid condition was run once, so variation, reliability and failure rates remain unmeasured. No claim about usual short-prompt plugin routing, installed-client E2E, business approval or real-world benefit follows.

One subsequent **non-blind diagnostic**, after the human finding was supplied, distinguished two layers: the modifier can be interpreted consistently with the body, yet the name alone can still confuse the present configuration work with its later operation. This does not dismiss the human's difficulty as a preference. It identifies a clarity defect that a semantic-consistency gate may miss. The diagnostic is a hypothesis about the improvement layer, not independent detection evidence.

## Verification and remaining work

- Official reference exporter reproduced all five files in the review bundle from the published candidate 2 source commit.
- Local package/workflow/exporter tests: 25 passed; Business Graph: 44 passed; drift: 12 passed.
- The full 28-test local package/reference suite had one error because an unrelated historical adoption source commit was unavailable locally. Full-history GitHub CI passed both Plugin package and Alder release validation at candidate 2 and the fixture commit. The release publication job is not run on a PR.
- The next review decision is whether to test naming clarity as a reader task, separately from semantic contradiction detection. A reader should be able to identify the present actor's work and distinguish the subsequent operation without reconstructing the title from the entire Procedure. That is a proposal for the next bounded check, not an implemented or validated new requirement.

Do not expand the guidance indefinitely to force one wording to become an error. Preserve the human-reported clarity problem while distinguishing it from what these semantic tests can establish.

## Proposed next check, awaiting review

Use the existing quality guide's purpose (a person can understand and correct the work) and its `読み手と主体` viewpoint, together with the repository's reader-understanding/document-polish principles. Keep field-role consistency as one check; additionally observe whether the name actually communicates the present work. This belongs in Business Design description-quality review, not a parser or an external blanket Japanese-language rule. Do not copy general operating rules into Alder or invent a mandatory new report.

A minimal proposed change would ask for the reading of the name before relying on the body to repair it, then compare that reading with the described work. If a plausible reading confuses setting a behavior with executing it, report the concrete competing readings and a meaning-preserving name. Do not require a name to encode all fields, and preserve qualifiers that identify distinct objects or activities.

At this initial checkpoint, the proposal was to prepare a small discriminating comparison: names alone (what action and target do they suggest?) followed by their full designs (does that reading match?). Include grammatically valid but confusing modifiers as well as clear contradictions and necessary target/time qualifiers. Freeze expected distinctions before the run, retain disagreements, and compare with the installed baseline. No candidate 3 had been run at that checkpoint; the subsequent authorized check is linked above. No additional authoring trial or larger benchmark was added.
