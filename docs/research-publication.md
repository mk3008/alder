# Publishing Alder research decisions

[Back to Alder](../README.md) · [Research Decision Index](research-decisions.md) · [Evaluation plan](evaluation-plan.md)

Alder keeps the evidence for a research decision and the explanation a user needs in different places. When an adopted decision changes how someone prepares, reviews, or implements a product, the research record alone is not the user guidance. Summarize the adopted behavior and its reasons in a durable user-facing document, then link to the evidence and its limits.

## Three roles

| Place | Purpose | Typical content |
| --- | --- | --- |
| Evidence / research record | Let others inspect the basis and challenge the conclusion. | Hypothesis, comparison conditions, input revisions, prompts, observations, limitations, decision. |
| User-facing rationale / guidance | Explain the behavior people should expect and the reason for it. | What Alder requires, what remains optional, why a familiar stage or field is absent, how to use another method when appropriate, relevant limits; links to evidence. |
| README / navigation | Let readers reach important explanations when a question arises. | A short description and a link to the user-facing page or the relevant section of an existing guide. |

The [Research Decision Index](research-decisions.md) tracks candidate-level adoption and limits; [validation](validation.md) summarizes demonstrated scope and open questions. They do not replace the explanation of what a user should do. Keep one authoritative description of each rule: user-facing documents summarize the implications rather than copying experimental logs or maintaining the same rule in several places.

## When to write a user-facing explanation

Add or update one when an adopted decision:

- differs from a familiar development stage or deliverable, especially if a missing stage may be mistaken for omitted design;
- intentionally has no separate stage, field, or artifact;
- changes what a user must prepare, review, or hand to implementation;
- could be mistaken for a ban, an automatic AI decision, or an unsupported shortcut; or
- raises a recurring question for readers across projects.

Prefer a short addition to an existing user-facing guide when it answers the question in context. Use a standalone page for a substantial position that needs to be read independently, and link it from the README. An internal negative result or minor decision with no effect on user behavior may stay in the evidence and decision index. Do not create a new page per experiment.

The explanation should answer the applicable questions: What does Alder require, and what does it leave optional? Why is a particular stage or field present or absent? What design principle remains the same as in established practice, and what changes in an AI-assisted workflow? How can users retain a familiar optional practice? Which study supports the decision, and what has not been verified? Avoid claiming a general benefit from a single qualitative comparison.

## Example: data modeling

The [data-modeling position](data-modeling.md) is the first explicit application of this pattern. It explains why a separate table-design stage and a dedicated Business Design field are not required, while allowing people to model data and to use database constraints. The [Issue #114 study](data-structure-requirements-study.md) and the [Issue #116 public-revision rerun](../work/data-structure-requirements/public-repeat.md) supply evidence and limits; the [adoption guide](adoption.md#business-structure-requirements-follow-the-work-they-change) explains where to write the actual business requirements. Both README languages link to the user-facing position. The single synthetic Fresh comparison does not establish performance in real projects or rule out every benefit of a dedicated field.

## Reproducible and safe agent evidence

When a Fresh or other agent comparison is used to decide whether to adopt a change, prefer **publicly reproducible evidence from safe inputs**:

1. Use synthetic fixtures or already public material where possible. Before the run, publish safe guidance, fixtures, and comparison inputs at an immutable commit; confirm a third party can retrieve that SHA and its files. A local-only commit SHA is not a usable public evidence revision.
2. Record the requested model, reasoning effort, fork settings, agent identifier, full task prompt, permitted and prohibited inputs, paths and revisions read, results, decision, and limits. If the effective runtime settings cannot be independently attested, say so. Do not publish a prompt containing sensitive material merely to satisfy the full-prompt convention: publish a safe abstraction and describe what could not be released.
3. Keep results distinguishable from source facts. If an input revision cannot be retrieved or the agent read prohibited material, remove that run from public-reproducibility claims. Keep a correction note explaining the invalid run and its replacement; rerun with public revisions when possible.

**Raw agent output is not required in a public repository.** It may repeat personal or customer information, internal URLs, code, paths, or secrets. Publish raw output only when both the inputs and the output have been checked as safe to release. For real cases, private repositories, or confidential material, do not publish raw output; retain it privately only with an authorized, suitable storage location. Public records can contain retrievable safe fixtures, revisions, prompts or safe abstractions, structured or summarized observations, small safe excerpts, and explicit limitations. Do not publish a mapping that would reconstruct redacted secrets. If no public raw output is available, state that the summary cannot be independently audited against the original output.

Distinguish the strength of the evidence:

| Category | What can be checked |
| --- | --- |
| Publicly reproducible | A third party can retrieve safe inputs and pinned revisions, read the prompt and conditions, and rerun the comparison. A rerun need not produce byte-identical stochastic output. |
| Privately auditable | Authorized reviewers can inspect original outputs in private storage; the public cannot inspect them. |
| Summary-only observation | Only the summary survives; original output cannot be checked. Use as supporting context, not the sole basis for a consequential adoption decision. |

For consequential decisions, prefer public reproduction; when only private cases can establish a property, keep an authorized private audit trail and consider a safe synthetic reproduction. Redaction or abstraction must describe what changed and why the decision-relevant meaning remains intact. This policy follows the [Issue #116 correction](../work/data-structure-requirements/public-repeat.md): its first comparison used local-only SHAs and was excluded from reproducible evidence; the public-revision rerun is the decision record. Safety takes precedence over publishing raw outputs.
