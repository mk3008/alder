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

Use **task-oriented / user-goal-oriented headings**. Headings are navigation, not a taxonomy or summary of the prose. Prefer the reader's goal or next action (for example, “Quick start”, “Install”, “Hand off to implementation”, “Review”) over author-side topic labels or feature descriptions. In the final pass, skim headings alone and confirm that a reader can choose the right section by intent.

## Publishing research decisions

For adopted research that affects user behavior, apply [the evidence, user-facing explanation, and navigation policy](docs/research-publication.md) alongside [Research Decision Index maintenance](docs/evaluation-plan.md#research-decision-index-maintenance). Agent evidence must follow its public-revision and sensitive-output rules. Historical runs are not retroactively recategorized without checking their evidence.
