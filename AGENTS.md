# Agent routing for Alder

## Fresh review settings

For a new independent Fresh agent review in this repository, request model `gpt-6-sol` with reasoning effort `medium` and no conversation-history fork (`fork_turns: none`). Give each agent the pinned source revision, readable input paths, the exact task prompt and the prohibited prior outputs. Record the requested model, effort, revision and full prompt with the review result. Do not claim independent verification of effective runtime settings when it is unavailable.

This is the default for future Fresh reviews, not a retroactive change to frozen historical research runs. If a specific experiment has preregistered model settings or the requester explicitly specifies different settings, use those settings and record the exception. A Fresh review reports evidence and questions; it does not approve business meaning or edit the source under review.

## User-facing documentation polish gate

When drafting, polishing, or reviewing README content and other user-facing documentation, check for **author-side meta information leaking into the reader-facing text** in addition to grammar and style.

Use audience, reading goals, time budgets, evaluation criteria, research provenance, and review instructions to design the document internally. Do not expose them in the final text unless they materially help the reader decide or act.

Persona is a Reader Walkthrough test condition. Fix the reader's prior knowledge, interaction environment, and goal internally, then verify that this persona can complete the intended path from the README alone. Do not narrate the persona in the README unless the reader truly needs that information.

Do not add knowledge about the thing being tested merely to make the walkthrough easier. For example, when testing plugin installation, do not add "knows basic plugin operations" unless that was part of the original persona. Preserve persona fidelity so setup friction remains observable.

Before accepting user-facing documentation, explicitly check that:

- headings describe the subject itself rather than internal reading-time targets such as “1 minute”, “3 minutes”, or “5–10 minutes”;
- the prose does not explain the intended persona, authoring strategy, document plan, reviewer instructions, or why a section was written;
- research / benchmark / Fresh-run provenance does not occupy reader-facing space when only the verified fact or limitation is needed;
- worker prompts, evaluation criteria, Done conditions, and review notes have not leaked into the artifact;
- necessary capability, version, validation, safety, or operational limitations remain visible when they can change user behavior.

Research evidence and reproduction details normally belong in Issues, Decisions, or research records. Reader-facing documents should state the supported claim and the limitation that matters to use.

If a Japanese polishing or other writing/polish skill is used, this meta-leakage check is still a mandatory final pass even when the skill does not perform it itself.

As a final test, ask of each sentence: **would this still help the target reader if they knew nothing about how this document was produced?** If not, remove it or rewrite it as direct reader-facing content.

Before changing headings, identify and preserve the document's existing **reader journey / progressive-disclosure axis**. For a README, a useful visible axis is often `Install / Setup` → `Getting Started / Quick Start` → `Golden Path` → `Advanced` → `Reference`, moving from setup to first success, standard adoption, and then optional depth. Task-oriented / user-goal-oriented headings support this axis; they do not replace it with a flat list of feature names or process steps. Persona, reading goals, time budgets, and evaluation criteria are secondary design inputs used to choose what belongs inside each section, and should normally remain invisible to readers.

In the Golden Path, prefer **one recommended path** over completeness. Do not surface every valid alternative, legacy version, compatibility detail, fallback, or validation caveat unless it changes the reader's immediate action. Move those details to Advanced or Reference. Evaluate each sentence not only by whether it is true, but by whether the reader needs it now to take the next step.

Apply this to the **entire README**, not only the Golden Path. The README's primary job is not to summarize the full specification; it is to help a reader understand what the project is, whether it matters to them, and how to reach the first successful use. Before writing, define the single most important message and the first outcome the reader should achieve. Add sections or detail only when they strengthen that message or help the reader start. Completeness, version matrices, alternatives, edge cases, and exhaustive caveats belong in Advanced, Reference, or dedicated documentation when they would obscure the onboarding path. Treat the README as an entry point, not a compressed specification. In the final pass, skim headings alone and confirm that they form one coherent journey from first use through standard use to optional depth.

### Do not assume unstated reader context

In user-facing documentation, do not use connective wording that treats an idea as already shared unless the document has actually introduced it. Expressions equivalent to “not only”, “on the other hand”, “furthermore”, “also”, “of course”, “already”, or “conversely” should only be used when the required prior proposition is explicit in the preceding text.

For example, do not introduce existing-work analysis for the first time as “not only existing-work analysis, but also new-work hypotheses.” State both uses directly instead.

During polishing, ask for every connective: **what prior statement is this adding to, contrasting with, or continuing, and has the reader actually seen that statement in this document?** Context from Issues, chats, author intent, or other documents does not count as reader-shared context.

### Bridge Getting Started into the first action

In Getting Started / Quick Start, do not jump directly from the heading to a command or instruction. Guide the first success as **Goal → Material → Action → Observation → Next**.

Briefly tell the reader what they are about to try, what sample/input to use, what action to take, what result to expect, and where that experience leads next. This is not extra exposition; it is the minimum context needed to keep the first action from feeling abrupt.

## Publishing research decisions

For adopted research that affects user behavior, apply [the evidence, user-facing explanation, and navigation policy](docs/research-publication.md) alongside [Research Decision Index maintenance](docs/evaluation-plan.md#research-decision-index-maintenance). Agent evidence must follow its public-revision and sensitive-output rules. Historical runs are not retroactively recategorized without checking their evidence.
