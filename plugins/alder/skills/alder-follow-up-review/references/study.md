# Item-level traceability drift — Issue #76

## Decision

**Adopt the item-level fingerprint approach only as an optional, bounded pilot. Do not adopt a mandatory Alder checker, repository-wide migration, or automatic acknowledgement.** The runnable implementation remains a research PoC, not a supported product parser/runtime. Existing Business Design ↔ Check Item ↔ Test guidance and human approval authority remain intact.

A saved edge can record the upstream version last checked against its downstream artifact. When that version changes, report **stale / requires reconfirmation**, not a business defect. The study demonstrates deterministic detection of omitted updates in the stored graph. It does not establish that a mapping is semantically correct or that a test proves its Check.

Reason: in the synthetic local-change case, one of three Checks and its one test were selected, instead of all three with a document hash. A completed expectation change required two fingerprint-field updates. A wording-only source change with an unchanged Check required one source-pin update and zero Test-pin updates. Code refactoring required zero trace metadata edits. This supports a small opt-in trial, not a claim that lifetime savings exceed maintenance cost. Human review time and real missed-update frequency were not measured. If a product's reconfirmation cost exceeds the avoided omissions, do not adopt or discontinue the pilot.

Evidence: [reproducible observations](observations.json), [PoC and execution instructions](../../work/traceability-drift/README.md), [Issue #76](https://github.com/mk3008/alder/issues/76). Evaluated against Alder main `90dd8985cc8f4e0391b772bbba570ac8110bf04e`, using Python 3.12.14. No fresh-agent or blind evaluation is claimed.

## Candidate comparison

| Candidate | Local change | Meaning-preserving edit | Maintenance / failure mode | Disposition |
| --- | --- | --- | --- | --- |
| Whole-document content fingerprint / commit pin | All dependent Checks become candidates | Unrelated text edits invalidate the same document pin | One pin per edge, but broad reconfirmation; a document hash detects content, not semantics | Rejected as the default granularity; baseline measured 3/3 Checks |
| Git revision per identified item | Can be local if item extraction already exists | Textual changes still require judgment | Requires accessible history and extraction rules; commit identity may vary across cherry-picks/rebases; a manually maintained revision pin can be forgotten | Not implemented; no advantage for this bounded history-independent PoC |
| Explicit semantic revision per item | Local when revision is correctly advanced | Editor can leave revision unchanged | Lowest cosmetic noise, but forgetting to advance the revision hides the exact omission being studied | Not selected as sole detector; document-based judgment, not an OFT benchmark |
| Stable item ID + automatic content fingerprint | Local to saved edges | Section reorder / CRLF ignored; wording edits flagged | No manual revision bump; content extraction and explicit edge reconfirmation remain | Selected for bounded pilot; 26 runnable scenarios |
| AI-only semantic comparison | Potentially local | Can judge semantic equivalence | No durable revision signal, repeat reading/inference cost and nondeterminism | Rejected as sole detector; use after deterministic candidate detection |

[OpenFastTrace's Specification Item Revision](https://github.com/itsallcode/openfasttrace/blob/main/doc/user_guide/introduction/concepts_and_terms.md) describes semantic revisions that invalidate existing coverage references, while edits without meaning changes need not advance revision. Read source blob: `d62d7654194ee6ce21966dcb599446ade5367248`. This supplies the established versioned-link concept. Alder's narrower graph, content-derived signal, Check-bounded test invalidation and pilot decision are this study's choices. OFT was not installed, run or evaluated; no OFT graph or Code markers are adopted.

## Experiment boundary

Use a deliberately synthetic booking fixture with three independent rules, three Checks and three executable Python tests. The 10 → 20 participant limit is **not a new rule for Alder's existing meeting-room Business Design**, which explicitly leaves capacity policy undecided. No original benchmark or historical evidence is modified. This tiny fixture isolates revision drift; it does not evaluate business-requirement discovery and does not add a new Alder business benchmark.

`business-design.md` is the fixture's authoritative meaning. `checks.md` holds downstream expectations; `trace.json` contains relations and pins, not a second copy of the design. The fixture metadata represents a simulated reviewed starting point, not human approval of a real product. Inventory comes from actual unittest discovery. Tests import and execute the small product; the detector never reads product source or stores Code locations.

All scenario changes run in temporary directories. The evaluator compares exact expected Check/Test sets and mapping candidates, executes the product tests, invokes the read-only CLI and verifies its output/exit status. The evaluator's mutations of pins simulate separately completed review; they are not a production approval mechanism.

## Minimal artifact contract

Use stable IDs for independently meaningful source units. Prefer an existing Activity / Rule / Data identifier if stable. The PoC accepts one restricted Markdown source document and one Check document with `## BD-01` / `## CHECK-01` sections. It is **not** a general adapter for Alder's existing Markdown documents.

Each section's entire UTF-8 body is hashed, including any text describing conditions, title or expected result. The section order and ID are outside the body fingerprint. Only CRLF → LF normalization is applied. Internal whitespace, punctuation, bullet order and trailing blank lines are deliberately retained; aggressive normalization could hide meaningful changes. The H1 is a nonnormative document label only. Normative context must be inside identified sections and included in the saved relationships. Other preamble prose, duplicate IDs, empty sections and unidentified H2 headings are rejected.

The sidecar's complete schema is illustrated by [trace.json](../../work/traceability-drift/fixture/trace.json):

- `version: 1` identifies this PoC format.
- `check_sources[Check ID][Business ID]` stores the source body fingerprint last reconciled with the Check.
- `test_checks[runner Test ID][Check ID]` stores the fingerprint of the **Check body only** last reconciled with the test assertion. Source pins are not part of the Test fingerprint.

Fingerprints use SHA-256 over UTF-8 canonical JSON (`sort_keys=True`, compact separators, `ensure_ascii=False`). Both source and Check bodies are encoded as JSON strings; the Test pin contains no source-review metadata. Pins in the example are real computed values, not placeholders. JSON object ordering is irrelevant. Renaming a stable ID requires repairing edges; renaming a display title without changing the ID is a content edit.

Tests verify Check expectations, not their source-review history. While a Check has unreconciled sources, its Tests can appear as `upstream_stale` impact candidates. After those sources are reconciled, an unchanged Check body leaves previously matching Test pins current without Test review or pin updates. A changed Check body still produces `check_changed`; source reconfirmation cannot clear that mismatch or a missing Test. A single test can cover multiple Checks and a Check can have multiple sources/tests; regression tests exercise this propagation. This is a versioned directed graph with only the two existing relation types, not permanent Code traceability.

The [PR #77 review](https://github.com/mk3008/alder/pull/77#pullrequestreview-5262152918) corrected the initial proposal, which mixed source pins into Test identity and required unnecessary Test reconfirmation. The current implementation and observations supersede that behavior; the [pre-review record](https://github.com/mk3008/alder/blob/bdaad49a8f38b08c5061ebb7b5e69b969d14c488/docs/traceability-drift/observations.json) remains in Git history. This narrows propagation at the existing Check boundary rather than adding a new review obligation.

The detector returns `stale_checks`, `stale_tests` with reasons, and `mapping_candidates`. Removed sources/Checks and missing discovered tests are reported. New unmapped sources and Checks without test edges are mapping candidates, not proof that a new test is required. Extra unrelated discovered tests are permitted. Malformed inputs fail separately from stale candidates. A current fingerprint is **not** a human review state or test-evidence state.

## Observed behavior

| Scenario | Check candidates | Test candidates | Product tests | Interpretation |
| --- | --- | --- | --- | --- |
| Baseline | 0 | 0 | 3 pass | Pins match the simulated reviewed fixture |
| A/C: only BD-01 changes from 10 to 20 | CHECK-01 | limit test | 3 pass | Old Check, test and Code agree with each other; stored source pin exposes drift |
| Whole-document baseline for same edit | All 3 | Would require following all 3 mappings | Same fixture | Item boundary narrows the candidate set from 3 to 1 |
| B: section reorder or CRLF | 0 | 0 | 3 pass | These edits do not alter section fingerprints |
| B: rewording or clause-order change | CHECK-01 | limit test | 3 pass | Conservative false positive for business meaning; review rather than automatic correction |
| D: Business Design + Check + source pin updated, Test untouched | 0 | limit test | 3 pass | Old Test pin detects the second boundary's omitted update |
| Source reconfirmed, Check text unchanged | 0 | 0 | 3 pass | Existing Test pins stay current; only the source pin changes |
| Design, Check, Test, Code and reviewed pins updated | 0 | 0 | 3 pass | Completed local reconciliation |
| Test updated to new expectation, Code left old | 0 | 0 | 1 fails | Test runner owns implementation verification; no Code map is needed |
| Pins blindly refreshed, Test and Code left old | 0 | 0 | 3 pass | Deliberately reproduced false negative: hashes cannot attest review |
| Wrong source mapping consistently pinned | Wrong CHECK-03 selected; CHECK-01 missed | Wrong owner test selected | 3 pass | Reproduced semantic mapping false negative; saved links need review |

The machine-readable record contains all 26 scenarios, including missing relationships, deletion, rename, add, split, merge and refactor. Twelve additional detector regression tests cover many-to-many propagation, malformed pins/IDs/sections, duplicate JSON keys, absent runner inventory, no implicit acknowledgement, unchanged-Check reconfirmation and continued detection when the Check body changes. The unchanged-Check reconfirmation regression failed on the pre-review implementation and passed after the correction; the changed-Check regression still requires the old Test to be stale. Counts describe authored scenarios, not a measured detection rate.

## Maintenance measurements

Counts are changed JSON scalar leaves: a renamed key counts as one removal plus one addition per attached leaf. Each observed scenario also reports `test_pin_leaf_edits` to distinguish Test metadata work from source-pin updates. They measure artifact churn, **not keystrokes, time or human decision effort**. The scenarios include normal business/test edits but the counts below concern additional trace metadata only.

| Operation on this fixture | Metadata leaf edits | Extra work / scope |
| --- | ---: | --- |
| Initial setup | 6 relation pins + format version | Identify 3 source IDs and 3 Check IDs; review 3 source edges and 3 Test edges |
| Business Design edit, before reconciliation | 0 | Detector computes current content; no manual revision bump |
| Change one Check body against changed source | 1 | Review the source → Check relation; affected Test stays stale because the Check body changed |
| Complete local Design/Check/Test reconciliation | 2 | One source pin and one Test pin; unrelated edges untouched |
| Reconfirm wording-only source edit, Check unchanged | 1 total | Source pin only; 0 Test-pin edits and no Test reconfirmation |
| Add one Check using existing test | 2 | Add source and Test edges |
| Split CHECK-01 into two Checks | 3 | Add two edges and refresh the changed original Check's Test pin |
| Merge two Checks | 5 | Remove one source edge, add another source to retained Check, redirect/refresh Test edges |
| Rename one Check ID | 4 | Two endpoint-key renames; preserve ID for ordinary title edits |
| Rename one test | 2 | One Test key rename |
| Move test file with all 3 tests | 6 | unittest IDs include module name, so three keys change |
| Move product code file and repair test import | 0 | Test IDs and semantic expectations remain stable |

The merge scenario is a mechanical churn probe, not a recommendation to combine unrelated expectations; real splitting/merging must still pass Alder's meaning-preservation audit.

Initial `trace.json`: **803 bytes**, including six 64-character fingerprints (**384 bytes** of hex). After adding or splitting one Check: **996 bytes**. No service, DB, daemon or third-party package is used; running this PoC requires Python 3.12+ and a test inventory. A real product still needs an adapter for its actual source format and test runner; that integration cost is unmeasured and must not be described as zero. A persistent logical Test ID may reduce move churn, but introducing a second ID registry is not justified by this experiment.

## Reconfirmation workflow for an opt-in pilot

1. Change and, when needed, obtain the responsible human's confirmation of Business Design first. Run the read-only detector using current test discovery. Missing meaning returns to Business Design, as in existing Alder guidance.
2. AI compares each affected source with its Check, proposes a correction or records why its meaning is preserved. Review this narrow diff. Update the source pin only with completed reconciliation; leave undecided items stale. Do not convert freshness to `確認済み` automatically.
3. Follow saved Test edges when the Check body changed or an independent Test-evidence gap remains. Check assertions against the current Check, including boundary cases. Update tests if needed and run relevant tests against Code. Update only reconciled Test pins; test execution alone is not evidence of meaning alignment. If the Check body is unchanged after source reconciliation, leave matching Test pins untouched: source reconfirmation alone does not require Test review.
4. Preserve the reason for unchanged downstream text or changed mappings in the normal reviewed PR/Decision evidence. No separate approval database is introduced. Business decisions belong to the responsible human; AI can extract, compute, draft and execute, but cannot infer approval from a matching hash.
5. Run detection again. Keep unrelated items intact; no full regeneration. A project may make stale candidates a review gate, but this study does not impose a mandatory gate on Alder or block legitimate unmapped design scope automatically.

There is intentionally no bulk `accept`, baseline-regeneration or automatic acknowledgement command. Fixture construction and scenario helpers demonstrate calculations; copying their automatic pin updates into a product watcher would defeat the workflow.

## False positives, false negatives and stopping boundary

- **False positives:** punctuation, wording, internal layout and within-item reorder; large source units select more Checks; cosmetic source edits select related Tests only while their Check remains unreconciled. Reconfirmation without a Check body change ends that upstream impact; it does not require a Test-pin refresh. Use existing stable semantic units, not one ID per sentence solely to improve counts. Meaning-aware normalization is deferred because its complexity and false-negative risk are not justified here.
- **False negatives:** missing/wrong semantic edges, normative context outside the declared units, blindly accepted pins, a weakened/misinterpreted test with unchanged Check, changes in external rules or undeclared dependencies. An unmapped-source warning helps discovery but cannot identify every missing edge when a source is already mapped elsewhere. Test inventory proves existence, not assertion adequacy.
- A content change reverted before detection produces the original fingerprint; there is no history audit. Content identity, not chronological revision tracking, is the goal. The H1 label is intentionally excluded; putting policy there violates the fixture contract and can be missed.
- Passing detection means no known freshness/mapping candidate in the supplied inventory; it does not prove business correctness, complete traceability, test quality or approval. Human review and existing test evidence remain necessary.
- Real adoption is deferred beyond the optional pilot: no modification of existing product metadata, no supported universal parser, no mandatory CI gate, no Code/source annotations, no full OFT installation, no exhaustive graph, and no automatic semantic approval.

Reconsider broader adoption after a real product slice records missed updates caught, false-positive reviews, actual setup/reconfirmation time and test-move churn. If those costs dominate the avoided omissions, stop using the mechanism rather than adding more metadata or widening the graph.
