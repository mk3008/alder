# Name-first reader check: one bounded comparison

**Later acceptance result:** the unchanged candidate 3 still missed the original issue in its final fresh check; the existing eight-case regression passed. See [Final acceptance: not met](../acceptance/RESULT.md). The limited observations below remain valid but do not establish resolution of the original requirement.

## Result

Candidate 3 produced a useful **limited clarity-review observation**. Under a generic request to review the design, it identified two concrete configuration-versus-execution readings and proposed meaning-preserving names. The installed arm did not report those name ambiguities. Both preserved the two necessary target qualifiers.

This is not proof that the original issue is fixed, that a person will understand the names, or that candidate 3 is generally superior. One run per arm was performed. The original private case and the earlier eight-case suite were not rerun with candidate 3. Keep the PR as an unadopted candidate for parent review; no further tuning or retries were performed in this comparison.

## Intervention and frozen inputs

- Candidate package: `d0ed8850fa9823b2dad39fe275a628d8d3a00897`; canonical review source: `d3c17aedb6ec411680c00dcdf1ca1e8eead21577`.
- Inputs and intended judgments frozen before dispatch: `d3344965020bb2101227d5208a71be8380629f10`.
- Input SHA-256: `3857ce392ed2749f87f7ae79e2a7181aa5bb395cb15ee70b8f02fee19957401a`.
- `names.md` is a fixture-author check, not a reviewer input. Only `designs.md` and each arm's required Skill materials were allowed. Neither reviewer received `expected.md`, prior outputs or the other arm's guidance.
- Both received the same generic Japanese review task, differing only in guidance acquisition and evidence destinations. The parent prompt did not tell the candidate to perform a name-first pass. The Skill itself supplies that intervention.
- Requested settings: `gpt-6-sol`, `medium`, `fork_turns: none`, following repository AGENTS. Effective runtime was not independently attested.

Candidate 3 **replaces and shortens** the earlier setting-specific paragraphs rather than stacking another checklist on top. Its placement is the existing description-quality guide's reader/actor perspective and review Skill step 2. Read the names before the body, retain their apparent work briefly, then compare with the actual scene. Formal consistency, source fidelity and reader clarity remain separate checks. Required target/time modifiers are preserved. No permanent worksheet or extra approval stage is required.

## Findings against the fixed expectations

| Case | Installed arm | Candidate 3 |
| --- | --- | --- |
| 1: 閉館後の入館を制限する | No name-clarity finding | Distinguished configuring a future access policy from performing individual access restriction; proposed a setting-oriented name |
| 2: 休業日の着信先を切り替える | No name-clarity finding | Distinguished registering a future holiday destination from switching/routing actual calls; proposed a setting-oriented name |
| 3: 来月開始の講座を募集一覧に載せる | Preserved the target month | Explicitly retained the necessary target-month qualifier |
| 4: 保存済みの見積書を複製する | Preserved the saved-state target | Explicitly retained the necessary saved-state qualifier |

The candidate did not declare these names grammatically forbidden or require all time words to be removed. Its proposals retained the scope of the future-setting target. Literal agreement with the fixture author's proposed wording was not scored.

Other findings were retained rather than suppressed. Both noticed the fixture's missing Object Icon fields. The installed arm also asked about the relation between policy and selected access categories in Case 1, and updating/confirming the holiday list in Case 2; the candidate considered the principal flows coherent. These are additional fixture/interpretation questions, not evidence of naming success or automatic false-positive labels. The fixture was not edited after seeing the outputs. These differences limit a claim that name-first reading alone caused every output difference.

## What the acquisition record establishes

The installed arm's acquisition log reports a full-file read after loading its installed Skill and four required guides. The candidate log reports loading its own Skill/guides, requesting only Activity headings with `grep`, then requesting the full document. The logs were written by the agents during the run; they are **not an independently captured, complete tool trace**.

The candidate's final answer says it provisionally read the names before the body. No externally preserved pre-body interpretation is included in the run evidence. Therefore the first interpretations and whether an initial misreading occurred are **unobserved**, not assumed correct or inferred retrospectively. The supported observation is a recorded headings-first acquisition sequence and the final concrete clarity findings. This does not establish a measured two-stage human comprehension improvement.

The source-level candidate and installed retrieval paths differ, and execution was sequential because of a concurrency limit. Each arm has one fresh agent; outputs are stochastic. Neither route is a host UI / short-prompt routing E2E test.

## Authority and evidence

- Installed arm used actual `skills.read` of `alder-review-business-design` and the four mandatory references. Its reported provenance is `9cf192c5bced1eeb872795eec8ced21b7bcbf492`; `plugin.json` could not be read, so that run's installed version is unknown.
- Candidate arm used the pinned package snapshot and verified the four guide digests against provenance. Its manifest remains `0.4.5`, but these changed bytes are unpublished and were not installed as a released plugin.
- Full prompts, responses and acquisition logs are under `runs/installed/` and `runs/candidate/`. Source attribution and the input bytes were separately retrieved from their published commits by the coordinator; the reviewers accurately limited their own independent verification claims.
- The original failed candidates and tied eight-case comparison remain in [the first result](../RESULT.md). Their evidence is not retroactively reclassified as candidate 3 success.

## Verification and next decision

The official exporter reproduced all five review-bundle files from the published candidate 3 source. Local package/workflow/exporter checks passed (25 tests). Full-history Plugin package and Alder release PR validation CI passed at candidate 3 and the frozen-input commit. PR validation does not publish a release.

The concrete improvement location is **Business Design description-quality review**, where names must communicate the present work as well as remain consistent with the body. Authoring remains a separate responsibility: these tests neither prove nor exclude its contribution to unclear wording. No transcript-to-draft trial, authoring change or unrelated documentation edit was added.

Return this bounded result for parent review. If considering adoption, retain the remaining original-case and regression-coverage gaps instead of calling the whole problem resolved. Do not start another candidate iteration merely to increase the score.
