# Agent routing for Alder

## Fresh review settings

For a new independent Fresh agent review in this repository, request model `gpt-6-sol` with reasoning effort `medium` and no conversation-history fork (`fork_turns: none`). Give each agent the pinned source revision, readable input paths, the exact task prompt and the prohibited prior outputs. Record the requested model, effort, revision and full prompt with the review result. Do not claim independent verification of effective runtime settings when it is unavailable.

This is the default for future Fresh reviews, not a retroactive change to frozen historical research runs. If a specific experiment has preregistered model settings or the requester explicitly specifies different settings, use those settings and record the exception. A Fresh review reports evidence and questions; it does not approve business meaning or edit the source under review.

## User-facing documentation polish gate

When drafting, polishing, or reviewing README content and other user-facing documentation, check for **author-side meta information leaking into the reader-facing text** in addition to grammar and style.

Use audience, reading goals, time budgets, evaluation criteria, research provenance, and review instructions to design the document internally. Do not expose them in the final text unless they materially help the reader decide or act.

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

## Publishing research decisions

For adopted research that affects user behavior, apply [the evidence, user-facing explanation, and navigation policy](docs/research-publication.md) alongside [Research Decision Index maintenance](docs/evaluation-plan.md#research-decision-index-maintenance). Agent evidence must follow its public-revision and sensitive-output rules. Historical runs are not retroactively recategorized without checking their evidence.
