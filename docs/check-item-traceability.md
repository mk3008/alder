# Check Item traceability

## Status

Called **Atomic Check** in v0.3; the current term is **Check Item**. The naming change avoids confusion with DB/transaction atomicity and does not change granularity, IDs or review states. v0.5 narrows permanent traceability to Business Design ↔ Check Item ↔ Automated Test; Code is verified by tests rather than maintained as a permanent mapping target.

Check Item traceability is an **optional Alder workflow** for products where people and AI both need to trace business meaning through checks and automated tests.

It does not add a new source of business truth, require a standalone Functional Design phase, prescribe an architecture, or require complete line-by-line traceability.

The workflow combines:

```text
Business Design
  ↓
Functional Interface (optional)
  ↓
Check Item
  ↓
Automated Test
  │
  └─ verifies → Code
```

The arrows above show **meaning authority**. Business Design is the source of truth for business meaning.

For review and maintenance, the links are also traversed in both directions:

```text
Business Design ↔ Functional Interface (optional) ↔ Check Item ↔ Automated Test

Automated Test ─ verifies → Code
```

Bidirectional traceability does **not** make these artifacts equally authoritative.

## 1. Business Design is the SSOT

Business Design is the authoritative source for business meaning.

Functional Interfaces, Check Items, Decision Records, tests, and code are downstream artifacts. They can expose ambiguity, inconsistency, missing evidence, or an implementation choice, but they do not acquire authority to redefine business meaning.

When a human review reveals that the current meaning is wrong, incomplete, or not decided:

1. Mark the affected Check as **要確認** or return it as **Business Designへ戻す事項**.
2. Update Business Design first.
3. Have the responsible human confirm the revised business meaning.
4. Re-derive or update affected Functional Interfaces and Check Items from that confirmed Business Design revision.
5. Update Decision Records when implementation choices or assumptions change.
6. Update tests and code.
7. Re-check Business Design → Interface → Check → Test traceability, then run the relevant tests against the implementation.

Do not infer a business rule from existing code, tests, or a Decision Record and then silently treat that inferred rule as approved Business Design.

Existing implementation is useful evidence of **what the system currently does**. It is not authority for **what the business should mean**.

If Business Design does not decide the meaning, stop at a review question instead of classifying the implementation as correct or defective.

## 2. Functional Interface and Check Item have different roles

A **Functional Interface** is an observable responsibility or capability boundary. It is useful when one responsibility spans several Checks, tests, files, SQL statements, or implementation paths.

It is not necessarily:

- one function
- one API
- one class
- one file
- one transaction

A **Check Item** is **one independently reviewable observable expectation**. A Functional Interface may group such items when that responsibility layer helps.

As a default:

> One Check Item represents one independently reviewable observable expectation.

Do not mechanically split an indivisible rule into assertion-sized fragments. Keep a condition and its expected result in one Item when separating them would break the meaning. Split when a human could reasonably accept, reject, or revise one expected result without changing the others.

A product can use direct Business Design → Check → Test traceability where a Functional Interface adds no navigation value.

## 3. Human-facing view

The primary human-facing view is intentionally small.

| Field | Purpose |
| --- | --- |
| ID | Stable reference within a versioned Check list |
| Title | Fast entry point: what behavior or guarantee is being reviewed |
| Expected result | Human-readable result that should hold |
| Review state | Where the item is in the human review loop |

Recommended review states:

| State | Meaning |
| --- | --- |
| 未レビュー | AI draft; a human has not reviewed the item yet |
| 要確認 | A human decision or clarification is still needed |
| 確認済み | A human reviewed the title, expected result, and any necessary condition |
| 要修正 | Human review found that the Check needs correction |

Review state is **not** AI confidence and is **not** test evidence state.

A Check can be human-confirmed while its automated test evidence is incomplete. A Check can also have strong test coverage while still being unreviewed by a human.

### Titles

The title is a reading aid, not a second specification.

It should help a person recognize the behavior or guarantee before reading implementation-level detail.

Current guidance is deliberately light:

- avoid broad labels such as “invalid”, “ambiguous”, or “late” when the object is not obvious without reading the condition
- use a capability form such as “〜できる” when it reads naturally
- use an invariant form such as “〜変わらない” or “〜書き換わらない” when that is clearer
- do not force one grammatical template across all Checks

Alder does not currently prescribe a universal title-writing grammar. Improve titles through human review and retain concrete examples for later refinement.

## 4. AI / developer detail

The same Check ID keeps precise detail for implementation and maintenance.

The supporting detail may contain:

- exact condition / precondition, including internal names, DB state, model names, and system terms
- Business Design / Concept / Decision evidence
- derivation classification: 明示 / 強い導出 / 考慮候補
- AI confidence: 高 / 要精査
- relevant Functional Interface
- representative automated test and the assertion that supports the Check
- evidence state or mapping gap

The human-facing summary must not remove information the AI needs to preserve semantics.

The detail is not required to be one wide table. It may be an appendix, generated mapping, machine-readable sidecar, or nearby section, as long as the Check ID keeps the relation unambiguous.

## 5. Evidence and mapping states

Separate the meaning of the Check from the strength of implementation evidence.

Useful mapping states include:

- **mapped** — Business meaning, Check, and representative test assertion can be traced for the stated condition
- **partial / missing test evidence** — implementation exists, but direct regression evidence is incomplete
- **conflicting behavior** — test-observed behavior contradicts approved Business Design
- **ambiguous mapping** — a candidate mapping exists but the semantic match is not established
- **candidate / unapproved** — the Check itself is not yet approved, so it cannot establish a product defect

A passing test does not prove a Check unless its assertions cover the relevant condition and expected result.

A matching symbol or name does not establish a semantic mapping.

## 6. Forward and reverse traceability

Maintain permanent traceability only through the test boundary.

### Forward

```text
Business Design
→ Functional Interface (optional)
→ Check Item
→ Automated Test
```

Use this to ask:

- Which Check expresses this business meaning?
- Which test proves this particular expectation?

### Reverse

```text
Automated Test
→ Check Item
→ Functional Interface (optional)
→ Business Design
```

Use this to ask:

- Why does this test exist?
- Which approved business expectation justifies this assertion?

Tests then verify the implementation by execution. Do not maintain a permanent Check Item ↔ Code, file, symbol, SQL-entry-point, or line mapping. Code structure is allowed to change under refactoring or human maintenance without creating a second traceability artifact that must be kept in sync.

When review needs to inspect an implementation choice, locate the relevant code from the current test/runtime path or by fresh repository exploration. That investigation is temporary diagnostic work, not a maintained mapping and not authority to redefine Business Design.

## 7. Meaning-preservation audit

Changing the presentation of Checks can accidentally delete meaning even when the product code does not change.

When splitting, renaming, regrouping, or regenerating Checks:

1. Compare each independent guarantee in the previous Check set with the new Check set.
2. Confirm that every retained guarantee maps to at least one new Check or explicit supporting detail.
3. If a guarantee is intentionally removed, record why.
4. Re-check against Business Design, because the previous Check set is not the SSOT.
5. Use the previous Check set only as a regression oracle for the transformation.

This audit is especially important when converting a broad Check into smaller Check Items.

## 8. Maintenance and stopping

Keep the index lighter than the codebase it describes.

Prefer:

- a small set of Functional Interfaces
- Check Items that correspond to meaningful human review decisions
- representative test assertions
- updates only to affected mappings

Avoid:

- a complete code-line matrix
- one Check per assertion
- duplicated specifications that must be edited in parallel
- treating every helper, SQL fragment, or adapter as a Functional Interface (optional)
- preserving stale physical-code mappings; permanent Code mapping is intentionally out of scope

If direct Business Design → Check → Test traceability is already clear, do not add a Functional Interface layer solely for formality.

## 9. Evidence and limits

The human-readable form was refined through the Velvet execute-transfer application in [Issue #43](https://github.com/mk3008/velvet/issues/43) / [PR #44](https://github.com/mk3008/velvet/pull/44) after the earlier Functional Interface study.

Observed in that bounded case:

- the human reviewer found the Functional Interface responsibility groups and Check Item presentation substantially easier to review than the earlier compound Check rows
- Check Items made individual expectations easier to discuss
- an AI could trace representative Checks to tests and trace a multi-destination test backward to its Check and Decision; the historical evaluation also recorded code locations, which v0.5 no longer adopts as permanent traceability
- the mapping distinguished transaction atomicity from per-Link no-op behavior
- the AI could identify direct-test evidence gaps separately from implementation gaps
- a meaning-preservation audit recovered guarantees that had disappeared during an earlier formatting change

This is evidence that the format can be useful for one real product slice. It is not proof of lower review time, higher defect-detection rate, general applicability, or optimal title wording.

Use it as an optional traceability aid and continue human review.

## 10. Optional item-level drift pilot

A passing test can remain aligned with an old Check after Business Design changes. For products with this concrete risk, an [optional drift pilot](traceability-drift/study.md) records the source-item fingerprint reconciled with each Check and the Check snapshot reconciled with each Test. A source change selects related Checks and Tests; a Check update leaves old Test evidence stale until separately reconciled. Permanent traceability still stops at Test.

Treat freshness mismatches as **requires reconfirmation**, not defects or automatic changes to human review state. Preserve Business Design authority, inspect affected expectations/assertions, and update pins only after reconciliation. The [study](traceability-drift/study.md#reconfirmation-workflow-for-an-opt-in-pilot) defines the minimal artifact and workflow, including false positives, missing-edge and blind-acknowledgement limits. This is a bounded synthetic PoC, not a mandatory checker or a supported parser for existing product documents. Use it only where observed benefit justifies setup and reconfirmation cost; no Code mapping or bulk regeneration is introduced.
