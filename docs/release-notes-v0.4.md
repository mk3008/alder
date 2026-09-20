# Alder v0.4 — functional consideration discovery and Check Items

**Release notes draft.** v0.4 is not yet published. The latest published release remains v0.3; research review knowledge remains v0.3.

## Optional functional consideration discovery

After Business Design and its business-correlation review, an AI can explore undocumented functional conditions before or alongside Check Item drafting. It uses relevant general knowledge to propose concrete situations with different observable outcomes, then checks existing Decisions, shared contracts and scope before returning genuinely unresolved questions to a person.

The authority flow remains:

**Unapproved candidate → human decision → Business Design update when needed → Check Item → Test.**

Business Design remains the SSOT. A Functional Interface is an optional responsibility group when it helps navigation. Candidate questions do not directly become requirements or test expectations. The workflow is optional, with no minimum finding count or completeness guarantee.

The [historical Velvet backtest](behavior-derivation/issue-71-historical.md) provides bounded evidence: one earlier-revision candidate anticipated the later human/Decision treatment of a Red-success/Black-failure boundary. The other three candidates were one conditional unresolved question and two already settled questions. This is one product and two historical snapshots selected with knowledge of later history, not a controlled estimate of prompt effect or a general detection rate. Earlier trials and their limits remain preserved.

See [functional consideration discovery](behavior-derivation/functional-considerations.md) and the [adoption guide](adoption.md#optional-explore-undocumented-functional-conditions).

## Atomic Check → Check Item

The current term is **Check Item**:

> One independently reviewable observable expectation.

The old name, **Atomic Check**, could be confused with DB/transaction atomicity. This is a terminology change, not a change to meaning or item granularity.

- Do not mechanically split items down to one assertion.
- Keep conditions and expected results together when separating them would break the meaning.
- Use Functional Interfaces only when an optional responsibility group adds value.
- Keep existing Check IDs, review states, evidence classifications and Test/Code mapping contracts.
- Existing products do not need to renumber their lists, rewrite tests or recreate mappings.

The current guide is [Check Item traceability](check-item-traceability.md). The old `docs/atomic-check-traceability.md` path retains a short migration notice for external links. Historical section-fragment links are not guaranteed to target the same section through that notice; use the corresponding heading in the new guide.

## Preserved historical evidence

v0.3 release notes, frozen experiment inputs/outputs, historical evaluations and filenames such as `stage5-atomic-checks.md` retain **Atomic Check**. Current documentation explains the terminology correspondence when referring to them. Preserved evaluation pages include `docs/behavior-derivation/conclusion.md`, `issue-71.md`, `issue-71-fresh-velvet.md` and `issue-71-historical.md`; frozen records under `work/` also retain their wording. The old adoption heading has a compatibility anchor so the preserved conclusion still resolves.

The hash-protected c3 input and verifier used by Issue #71 are retained byte-for-byte in `work/behavior-derivation/issue-71/frozen-baseline/`. The verifier reads the preserved c3 input; the later discovery verifier checks the preserved original verifier against its original hash. Original manifests and expected hashes are unchanged. This separates the current prompt from the historical evidence without relabeling old results.

## Version and compatibility

v0.4 adds an optional workflow alongside the existing derivation and traceability guidance, which warrants a minor release rather than a v0.3 documentation patch. The terminology cleanup ships with that workflow addition. It introduces no runtime/API migration, new framework or architecture requirement, nor a new version of the permanent review knowledge.

Publishing the release and creating its tag are separate from this preparation PR.
