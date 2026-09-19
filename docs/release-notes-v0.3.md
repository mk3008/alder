# Alder v0.3 — human-reviewable checks and traceability

Alder v0.3 adds an optional workflow for turning completed Business Design into **human-reviewable Atomic Checks** and tracing those checks through tests and code without changing the source of business authority.

The central rule remains unchanged:

> **Business Design is the source of truth for business meaning.**

Functional Interfaces, Atomic Checks, Decision Records, tests, and code are downstream artifacts. They may expose ambiguity, gaps, or implementation choices, but they do not redefine business meaning.

## Highlights

- Add **Atomic Check traceability** as an optional workflow for products where both people and AI need a lightweight path from Business Design to tests and implementation.
- Make Atomic Checks small enough for human review: normally one independently reviewable observable expectation per Check.
- Split the representation into two layers:
  - human-facing: ID, title, expected result, review state
  - AI/developer detail: precise condition, Business/Decision evidence, derivation classification/confidence, representative test assertions, primary code/SQL entry points, and evidence state
- Separate **human review state** from AI confidence and test evidence:
  - 未レビュー
  - 要確認
  - 確認済み
  - 要修正
- Keep **Functional Interfaces** as optional responsibility groups above Atomic Checks. They are observable operation contracts, not required functions, APIs, classes, files, or transactions.
- Support forward and reverse traceability:
  - Business Design → Interface → Check → Test → Code
  - Code/Test → Check → Interface → Business Design
- Keep meaning authority one-way even when traceability is bidirectional. Reverse tracing is diagnostic and must not promote current implementation behavior into Business Design.
- Add a **meaning-preservation audit** for Check splitting, renaming, regrouping, and regeneration so a readability improvement does not silently remove requirements.
- Preserve direct Business Design → Check → Test/Code mapping when a Functional Interface layer adds no value. Alder still does not require a complete traceability matrix.
- Add a Research Decision Index and explicit links to established software-engineering foundations, while keeping Alder's exact synthesis and evidence boundaries clear.
- Add limited guidance for preferring simple, error-resistant operational choices when a concrete predictable trap can be removed cheaply.
- Record that the existing review knowledge already provides sufficient support for requiring concrete establishing facts and direct evidence before closing a review finding; no additional review question was added.

## Human-readable behavior/check drafts

v0.3 retains the c3 behavior/check derivation workflow introduced after v0.2 and refines its output.

The AI reads the **whole completed Business Design**, then derives an initial Check list using:

- activity conditions and outcomes
- preceding Output → current Input/When → following start conditions
- Data / Role / Rule constraints
- representative zero/one/many, missing-target, duplicate, boundary, no-op, interruption, and continuation cases
- explicit / strong-derivation / consideration-candidate evidence levels

The draft is not approved merely because AI confidence is high. People review, correct, remove, and add Checks before the list is used as an implementation/test contract.

## Business Design remains the SSOT

Alder v0.3 makes the follow-up rule explicit.

If human review finds that an existing Check, Decision, test, or implementation reflects the wrong business meaning:

1. mark the affected Check for confirmation
2. update Business Design first
3. have the responsible human confirm the revised meaning
4. update affected Functional Interfaces and Atomic Checks
5. update Decisions where needed
6. update tests and code
7. re-check traceability

Existing code and tests are evidence of current behavior, not authority for what the business should mean.

## Why this is v0.3

v0.2 focused on AI-owned technical evaluation: how to choose what to measure, bound optional experiments, and stop at a sufficiently supported solution.

v0.3 materially expands the optional workflow around **pre-implementation human review and post-implementation traceability**. It introduces durable Check IDs, human review state, Functional Interface responsibility grouping, Test/Code mapping, reverse tracing, and meaning-preservation auditing.

That is a workflow-level change rather than a documentation-only patch, so it is released as v0.3.

The permanent review knowledge remains **v0.3** and is not renamed or replaced by this release.

## Evidence and limits

The behavior/check drafting work was first evaluated on Alder's resolved meeting-room Business Design. It then received a real-product application on Velvet's `execute-transfer` flow.

In that bounded application:

- the human reviewer found the Functional Interface + Atomic Check form substantially easier to review than the earlier compound Check rows
- AI probes traced representative Checks forward to Business/Decision evidence, tests, and code
- a multi-destination test was traced backward to its Check and Decision
- missing direct test evidence was distinguished from missing implementation
- a human-proposed meaning difference was traced to the exact existing Decision/test behavior without treating that behavior as business authority
- a meaning-preservation audit recovered guarantees that had disappeared during an intermediate formatting change

These observations come from one product slice and one human reviewer. They do **not** establish lower review time, higher defect-detection rates, completeness, general applicability, or an optimal title-writing style.

Atomic Check traceability remains optional. Functional Interfaces remain optional. Alder still requires human completion of business meaning and does not prescribe an architecture style.

## Other changes since v0.2

- Added guidance for removing cheap, predictable operational traps before relying on warnings or runbooks.
- Added the Research Decision Index and maintenance policy so adopted, rejected, deferred, and “existing knowledge sufficient” decisions remain reviewable.
- Added a source map that distinguishes established software-engineering foundations from Alder-specific wording and integration.
- Recorded a bounded sufficiency-evidence analysis showing no need for an additional permanent review principle in that area.

## Included artifacts

- [Practical adoption guide](https://github.com/mk3008/alder/blob/v0.3/docs/adoption.md)
- [Atomic Check traceability](https://github.com/mk3008/alder/blob/v0.3/docs/atomic-check-traceability.md)
- [Behavior/check draft prompt](https://github.com/mk3008/alder/blob/v0.3/docs/behavior-derivation/candidate-c3.md)
- [Functional Interface prompt](https://github.com/mk3008/alder/blob/v0.3/docs/functional-interface/prompt.md)
- [Research Decision Index](https://github.com/mk3008/alder/blob/v0.3/docs/research-decisions.md)
- [Sources and evidence boundaries](https://github.com/mk3008/alder/blob/v0.3/docs/sources.md)
- [Review knowledge v0.3](https://github.com/mk3008/alder/blob/v0.3/docs/phase2/review-knowledge-v0.3.md) — unchanged as the permanent review-knowledge version
- [Validation overview](https://github.com/mk3008/alder/blob/v0.3/docs/validation.md)

Alder remains a research candidate. It requires no framework, CLI, or runtime package.
