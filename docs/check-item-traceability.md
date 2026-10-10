# Check Item traceability

## Status

Called **Atomic Check** in v0.3; the current term is **Check Item**. The naming change avoids confusion with DB/transaction atomicity and does not change granularity, IDs or review states. v0.5 narrows permanent traceability to Business Design ↔ Check Item ↔ Automated Test; Code is verified by tests rather than maintained as a permanent mapping target.

**Historical v0.5:** Check Item drafting and traceability were optional; v0.5 limited the permanent mapping boundary to Test when that workflow was used. **Current workflow (included in Plugin 0.4.0 and later):** Check Item design and human review are required before the standard design business hands off to implementation. This changes the present method, not the meaning of the v0.5 release. AI creates and updates the list while preserving IDs and existing Business Design / Check / Test mappings; humans review expected results and return corrections and confirmation. Direct human edits are allowed, followed by a mapping consistency check. Business Design remains human-maintainable. Functional Interfaces and the drift pilot remain optional. See the [current workflow](adoption.md#draft-and-review-check-items-required).

The standard design business is complete at handoff of the agreed Business Design and Check Items, with their revisions and IDs. Newly written Tests and their assertion mappings do not yet exist at that point. The **separate, required post-implementation Alder review and follow-up** checks the Test oracle against confirmed Check expectations after Test execution and maintains the Check ↔ Test/assertion mapping and evidence gaps in the same Check Item. The independent Fresh review is read-only; its follow-up updates these records before accepting the implementation change. This later maintenance does not extend the bounded design business to Test execution or implementation review.

An evidence gap means missing or unreconciled Test verification for an expectation; it is not a Check review state and does not by itself mean the business expectation is undecided. The Check Item can retain such gaps, including for existing Tests, but complete evidence for newly created Tests is not part of the standard design handoff contract. Treat a concrete uncertainty about handing off a known gap as a human question, without adding a general handoff gate.

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
5. Collect the rationale for changed implementation choices or assumptions; record confirmed material choices in the Alder review/follow-up without treating them as business approval.
6. Update tests and code.
7. After implementation and test execution, use the separate Alder review/follow-up to check Test expectations against the confirmed Check Items, update Check → Test traceability and remaining evidence gaps, and re-check Business Design → Interface → Check → Test before accepting the implementation change.

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

Use the requester's working language for the original Check artifact and review response, following [language for agreement](adoption.md#language-for-agreement). This includes Activity names, Check titles, conditions, expected results, questions and supporting explanations, not just headings. For a Japanese review, write Japanese prose using the Business Design's business terms. Preserve IDs, technical identifiers and literal values. Retain source-established proper business names when translating them would change their identity; explain them in the review language when needed. Ask if the language is genuinely unclear. Verify the saved artifact itself; a later chat translation or an internal English fixture is not evidence of a Japanese reviewable output. Internal fixtures may use another language for their own test purpose.

Start with an index of the Business Design's Activity names, purposes and connections. Use the source-established full Activity names in visible references; do not invent aliases by shortening numbered headings or replacing names with positions. For a historical source without an explicit name/alias contract, quote its full heading rather than guessing an abbreviation. Preserve the source and existing link targets; this does not rename Activities or retrofit another Markdown profile. Let the requester choose the current Activity, then show its Checks one at a time or as a small review group. Read the whole Business Design when preparing the list; selecting an Activity only limits what is shown now. A list of names is enough when the source does not establish an order. Do not present ID order as business sequence.

Show each Check's condition, expected result and human review state **once** in the current review view. Use one readable item instead of repeating the same content in an overview table and a later detail block. Keep its stable ID visible. For a document, use an Activity index followed by same-level Activity headings in the same order, with each Check one heading level below its Activity (for example, H2 Activity and H3 Check). Do not split the document into a special current Activity and other Activities. Link shared IDs to one primary item; place a clearly related unresolved item within that Activity as an unresolved matter without changing its state or meaning, and keep genuinely unassigned items separate. A conversation can still show the selected Activity's items and offer the next Activity after the current discussion. This is presentation guidance, not a required document schema, viewer or additional ledger.

| Field | Purpose |
| --- | --- |
| ID | Stable reference within a versioned Check list |
| Title | Fast entry point: what behavior or guarantee is being reviewed |
| Condition | The precise circumstances in which the expectation applies |
| Expected result | Human-readable result that should hold |
| Review state | Where the item is in the human review loop |

For an unresolved item, state its kind on the item itself and keep it visible, for example `種別：未決事項（候補）`; a nearby heading is not sufficient when the item is read directly. Keep kind separate from derivation class, AI confidence and human review state. Preserve whether the issue comes from an undecided Business Design or an AI proposal; do not relabel one as the other without evidence. Retain unapproved wording in the expected result and the decision question. This is display guidance, not a new required schema or parser.

Related Activities reference the **same Check ID and item**, including the same human review state; they do not own independent copies. Keep cross-Activity relationships visible. Show unconnected items separately without guessing their Activity. Mark new candidates with unresolved meaning 要確認. If an existing item has an unresolved Activity link, identify that mapping question separately and preserve its human review state; missing navigation does not undo confirmed meaning. A reference count is not a Check count.

Ask which IDs the requester confirms, wants corrected or leaves open. Moving to another Activity, recording a resume position, opening an item or receiving no response is not approval. On resumption, retain the selected Activity and next ID as navigation context, separately from each Check's existing review state. Do not add a required resume artifact.

### Write conditions without changing their logic

When the source explicitly establishes the relationship, make it visible:

- **All of the following / すべて満たす (AND):** list the independent required conditions as bullets.
- **Any of the following / いずれか (OR):** keep the alternatives in one labelled group. Preserve whether more than one may hold; do not silently turn inclusive OR into exclusive OR or the reverse.
- **Mixed conditions:** preserve the source's groups and nesting. For `A AND (B OR C)`, show A and the entire B-or-C group under “all”, with B and C under “any”. Do not flatten it into three required conditions or `(A AND B) OR C`.

These symbols illustrate logical grouping, not additional business rules. Keep exact boundaries, negation, exceptions, exclusivity and priority. If the source leaves AND/OR or any of these relationships ambiguous, retain the original condition text and return a focused 要確認 question; do not infer a rule to make the bullets tidy. Presentation uncertainty does not silently overwrite a previously human-confirmed Check state. Keep that state, identify the uncertainty beside it, and use the Business Design review loop only if the meaning itself needs a decision or change.

The condition and expected result remain one reviewable Check. Do not split one Check merely because its condition contains several bullets. Source evidence, derivation class, AI confidence and Test evidence/gaps stay reachable under the same ID without repeating the primary condition/result/state.

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

The same Check ID keeps supporting detail for implementation and maintenance. Keep the precise condition in the primary item, including any internal names, DB state, model names or system terms needed to retain its meaning. Supporting detail should add evidence and context, not repeat the condition, expected result or human review state.

In GitHub Markdown, keep Check supplements in default-closed `<details><summary>` blocks under the same ID. Leave the ID/title, condition, expected result and human review state outside the block and always visible. Put a descriptive label in `<summary>`, omit the `open` attribute, and leave blank lines around the Markdown body. Keep Activity/Check anchors and shared references outside the block. For unresolved items, keep questions, alternatives and effects visible with the primary fields; collapse only supplemental source evidence, derivation class, AI confidence, related Activities and Test evidence. Never put a pending decision inside a collapsed block. Preserve every field when wrapping it. Other Markdown viewers may show the content without folding; verify the target view and keep all information readable.

The supporting detail may contain:

- Business Design / Concept / Decision evidence
- derivation classification: 明示 / 強い導出 / 考慮候補
- AI confidence: 高 / 要精査
- relevant Functional Interface
- representative automated test and the assertion that supports the Check
- evidence state or mapping gap

The human-facing view must not remove information the AI needs to preserve semantics. Keep every supporting field reachable when changing the presentation. This guidance does not establish an improvement in human comprehension or review time; those effects require separate observation.

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

### Before returning a draft or update

Every Check creation or update includes a quality check before return; the requester does not need to ask for a separate review or invoke another Skill. Re-read the actual candidate against the whole applicable Business Design and the current guidance, not just against the previous Check text or passing fixture tests.

- Check source names and references against the source itself, including any declared aliases; apply the [human-facing view](#3-human-facing-view) without inventing a naming rule. Check every occurrence, including folded supplements and link labels, not only the index and headings. Where the current view requires a full source heading, compare it directly with that heading rather than reconstructing a variant from its parts.
- Check independently reviewable condition/result pairs using [Check granularity](#2-functional-interface-and-check-item-have-different-roles). Separate independently decidable expectations, not every AND/OR bullet or Test assertion. Respect an explicitly limited example's scope instead of silently expanding it into a complete handoff.
- Check visible item kind, derivation, human review state, language and unresolved questions against the [human-facing view](#3-human-facing-view). Missing Test evidence is a separate gap, not evidence of unapproved business meaning.
- For updates, apply the meaning-preservation audit above to IDs, guarantees, conditions, review states, source links, shared items and existing Test mappings. The old output is a transformation baseline, not an authority for business meaning. Preserve established source revisions and URLs when the input is only a local or temporary copy. An unvisited or unavailable URL is not evidence of a wrong mapping: report the access limit instead of replacing the reference. Retarget only for an evidenced source change or mapping defect, keeping the old-to-new basis visible.

Correct a presentation or reference defect only when its repair is unambiguous from the source and stays within the requested scope. Preserve human review states for display-only changes. If business meaning is undecided or needs to change, retain that uncertainty and return the affected item as 要確認 / Business Designへ戻す事項 under [the Business Design loop](#1-business-design-is-the-ssot); continue independent items. Keep an outstanding human-requested correction as 要修正 until it is made; correcting it does not assert renewed confirmation. A correction already determined by confirmed Business Design is not itself a new business decision. Do not invent missing rules, promote a candidate to confirmed, or silently delete an unsupported expectation.

After any correction, re-read the final saved artifact and affected references, and repeat the relevant checks. Briefly report the scope actually checked, material corrections and retained guarantees, unresolved decisions and verification limits in the normal response. If a check could not be performed, say so; do not claim that the gate passed. No separate report, parser or mandatory data format is required. In consistency-review-only mode, perform the same checks and report findings without editing files or review states. AI quality checking never substitutes for human confirmation.

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

The Check Item design and human-review stage is required in the current workflow. Functional Interface grouping and the drift pilot remain optional aids; continue human review.

## 10. Optional item-level drift pilot

A passing test can remain aligned with an old Check after Business Design changes. For products with this concrete risk, an [optional drift pilot](traceability-drift/study.md) records the source-item fingerprint reconciled with each Check and the Check-body fingerprint reconciled with each Test. A source change selects related Checks and temporarily marks their Tests as impact candidates. Reconfirming sources without changing the Check body leaves matching Test pins current; only a changed Check body makes those pins stale until separately reconciled. Permanent traceability still stops at Test.

Treat freshness mismatches as **requires reconfirmation**, not defects or automatic changes to human review state. Preserve Business Design authority, inspect affected expectations/assertions, and update pins only after reconciliation. The [study](traceability-drift/study.md#reconfirmation-workflow-for-an-opt-in-pilot) defines the minimal artifact and workflow, including false positives, missing-edge and blind-acknowledgement limits. This is a bounded synthetic PoC, not a mandatory checker or a supported parser for existing product documents. Use it only where observed benefit justifies setup and reconfirmation cost; no Code mapping or bulk regeneration is introduced.
