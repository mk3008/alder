# Installed-plugin decomposition baseline

## Purpose and fixed scope

Observe three stages separately: draft creation, one bounded revision, and quality review. The required concerns are document-level Scope overextension and What/When mixing, with source meaning, legitimate qualifiers, start events, procedure and unresolved matters preserved. This is a current-state baseline, not a candidate comparison or a test of exact wording.

There are two short synthetic authoring inputs, one change request for input A, and two independent review cases from other domains. The review control is not a corrected rewrite of its defect-containing counterpart. The evaluator-only `expected.md` is fixed before dispatch and is excluded from all worker input directories.

## Execution

1. Create separate fresh contexts for authoring A, authoring B, and review. Request `gpt-6-sol`, reasoning `medium`, and no conversation-history fork, consistent with the repository's Fresh evaluation settings. These are requested settings, not independent runtime attestations.
2. A and B use the actual installed `alder-draft-business-design` Skill through `skills.read`, including its required authoring guidance, format specification, structure guidance and separate provenance. The review context uses the actual installed `alder-review-business-design` Skill and its four required references. Do not substitute candidate or repository guidance.
3. Request an ordinary draft or review. Do not tell the workers the expected field errors, scoring criteria, another worker's output, or prior experimental results. Each receives only its allowlisted source input and required installed package materials.
4. Save A's initial draft and response before giving it the one fixed change request in the same context. Write the revised draft separately so the initial output remains inspectable. B has no revision. Review receives both independent cases but no authoring output.
5. Preserve full dispatch prompts, returned outputs, requested settings, sources and acquisition limits. No business meanings are approved and no real operations are executed.

## Coordinator checks and limits

Before dispatch, the coordinator directly inspected the selected plugin metadata: version `0.4.5`, release `pluginrel_6ac5b2ea5e908191bd97df6d00ba208f` on 2026-10-07 at approximately 06:22 UTC. Workers must still record the guidance they actually read; this metadata observation is not a substitute for acquisition evidence or host-routing validation.

Inputs and expectations are published at an immutable working-branch commit before dispatch. Results belong to a separate later commit. The authoring and review source revisions may differ within the installed package; record each without silently treating them as one canonical revision.

The fixture author checked required fields, Object/I/O references and separation of evaluator material. These mechanical checks do not establish business correctness. Evaluate source facts and field roles from `expected.md`, permit equivalent formulations, and retain grounded disagreement instead of forcing a score. Do not use character count, a forbidden-word list, Activity count or one literal answer as the oracle.

One execution of each input and one revision cannot establish failure rates or general quality. Passing the synthetic baseline does not erase an observed real-case failure. A failure identifies an observed stage and symptom; it does not by itself prove the prompt, guide or model is the sole cause.

## Stopping condition

After these fixed baseline outputs are evaluated, report which stage showed a deficiency, the evidence, what remains unknown, and the smallest justified change proposal. No new candidate, extra fixture, repeated baseline, large benchmark, merge, release or installed-plugin update is included. Parent review decides further work.
