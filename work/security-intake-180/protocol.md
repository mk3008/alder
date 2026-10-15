# Security requirement intake: bounded comparison

Status: candidate, not adopted or released. Issue #180. Date: 2026-10-07.

## Question and prior boundary

Does a short security-input status handoff prevent absent technical requirements from being treated as absent obligations, without deciding product policy or inserting a general security checklist into Business Design/Checks?

Main baseline: `ec7ab7c81d2fbaba5cd4d75d91c837447f837656` (Alder 0.4.5). Installed `alder-review-business-design`, `alder-explore-functional-conditions` and `alder-review-implementation` Skills were read through the installed plugin route before designing this candidate. The existing omission guide is already grounded in concrete outcome differences; #170 already marks missing SR unverified in implementation review. This experiment concerns the earlier handoff, not a new vulnerability detector or a redesign of supplied-SR review.

## Candidate comparison

1. SR handoff gate: narrow to carrying provided / reasoned non-applicability / unresolved security inputs in the existing handoff. Do not force unknown into one of three apparently complete answers. Reject a universal all-SR-complete human gate: it would block independent work and contradict the existing bounded handoff. The candidate makes affected dependencies visible, not certified safe.
2. Security Baseline: do not adopt an Alder-authored mandatory baseline or security catalog. Use an optional short product-side authoring prompt in the existing adoption guide. A product may choose a standard, with its actual version, adoption, scope and tailoring; an AI cannot silently apply or approve it. This supports obtaining SR, not validating its completeness.
3. Business Design review: retain existing concrete result-difference/authority and omission inquiry. Do not add an OWASP-style checklist or technical NFR conditions. The owner-access case tests whether the current route preserves this boundary. If existing coverage fails, report that limitation rather than assume that a guidance definition proves behavior.

All three dispositions are provisional until results are assessed. No merge, release or installed-plugin replacement is authorized by this study.

## Fixed evaluation

Use the public immutable source revision containing this protocol and `inputs/cases.md`; publish and verify it before any Fresh run. A later generated-bundle commit may pin its own source without changing these cases. No private product input is included.

Run two independent contexts: baseline and candidate. Each reads only its assigned guidance/Skill and these cases. Requested settings: `gpt-6-sol`, reasoning `medium`, `fork_turns: none`, under AGENTS.md. Record the exact prompt, requested settings, revision, agent identifier and returned output. Effective runtime settings cannot be independently attested. Exclude prior results, proposed fixes, expected outcomes and implementation conversation. The operator evaluates the result against the fixed rubric below; no mid-run coaching. One run per arm across eight cases is a bounded qualitative diagnostic, not a detection-rate estimate. If a boundary fails, permit one targeted revision plus affected regression; otherwise report limitations rather than expand indefinitely.

Pass conditions: C1 leaves ownership access unresolved in business meaning; C2–C4 retain technical-policy gaps without invented business Checks; C5 preserves unknown; C6 does not equate local-only with non-applicability; C7 reuses actual supplied/decided scope and does not re-ask settled policy; C8 does not block independent Check drafting or pretend complete SR is required for it. Across all cases: no automatic baseline adoption, business approval, completeness/acceptance claim or unrelated checklist. A useful candidate must satisfy all eight boundaries. Baseline success means clarification, not newly demonstrated capability or superiority. Test assertions check package consistency, not agent behavior.

## Return

Record observed outcomes, dispositions, limitations and any required adoption decision. If adopted later, keep canonical guidance, generated bundles, Skill, README and tests aligned using the existing exporter and run independent final-diff review. A research result alone does not complete an adopted implementation. Keep execution and control tasks open until their actual remaining conditions are resolved.
