# Fresh read-only Alder implementation review

## Request, route, and provenance

- Exact README prompt: 「Alderで実装をレビューして、チェックとテストの対応も更新して。」
- This document is the independent **read-only review stage**. It makes no Check-to-Test mapping, review-state, source, or implementation changes. The original prompt authorizes a later, separately executed bounded record update; this stage does not perform it.
- I inspected the ten manually injected descriptors in `evidence/available-skills.txt` and selected the pinned `alder-review-implementation` skill. Its descriptor explicitly covers the combined Japanese prompt, whereas `alder-follow-up-review` is for record-only follow-up and the other descriptors address different work. I read its `SKILL.md`, `references/read-only-review.md`, the full `references/review-knowledge-v0.3.md`, and `references/provenance.json`. The injected catalog is diagnostic evidence of this selection, **not proof that an unassisted real client would naturally route here**.
- Alder plugin **0.4.2**, installed source commit **`6d30b93abf8ecdc8902fef5c16bfb53fda8617e9`**. Bundled review knowledge v0.3 identifies authority source `6fce51884963422eb4713aec9a5698b46fc84700` and SHA-256 `564c52831d438d9b49f4ca098dd1884167f2be096cc56f959c7847002ffe0351` (`references/provenance.json`). Accepted README commit supplied for this dogfood: `00600974872ff6cce41ecb6a0d4786d82b922f5d`; the synthetic product workspace is a separate uncommitted file snapshot, not that README commit.
- Repository `AGENTS.md` requested a Fresh agent with `gpt-6-sol`, reasoning effort `medium`, `fork_turns: none`. Those were the **requested** settings for this context. Effective runtime model and effort could not be independently verified; no claim is made about them.
- Review scope is one registered resident's selected existing loan and one returned tool group in a bounded Python in-memory fixture. Business Design is the authority for the agreed simulated meaning; `docs/decisions.md` and the Check list are simulated review evidence, not real user business approval. No prior implementation-review outputs or orchestrator conclusions were used.

## Pinned inputs and execution

The source workspace has no Git repository; the following file hashes define the reviewed product snapshot. Paths are relative to `workspace/` unless stated. No product files were modified during this review.

| Input | SHA-256 |
| --- | --- |
| `docs/business-design/tool-return.md` | `ef86b2225a1479e64cb8f138fd073e4c789559b7e13e16add8bf8dd2d2f4cdd2` |
| `docs/checks/tool-return.md` | `f5003361c073f3a17dfa3389ed6ef89ec3103c1185d0d6ae51e29aa1ceb08351` |
| `docs/decisions.md` | `402a106decdd3581cf3f949755ac52ae3b5e0627dbf38f5acbc65a636df91806` |
| `docs/system-requirements.md` | `5d1cf55b25b136efd74d52eb4403220e2671c7b128f55fb3a29428f5dc6cf63f` |
| `docs/implementation-notes.md` | `dbd27ac8e9650e4a4bfabca14c409a09a633a9a117eed99c12880d1110bd0fa1` |
| `tool_return.py` | `0980f2f430f217f22b7494958c61c474817c440e23166cdc6d40c4586df0b7a1` |
| `tests/test_tool_return.py` | `4dfd53ba191ef48b6af4d7c891171905b104239fe5385208ad2845bc2a963d1d` |
| `run_tests.py` | `7778146810d410f9758d49f8310f023fe68d204b990c8dd92894a7c3e451a0f1` |
| Injected `evidence/available-skills.txt` | `e4b66c8464ecb8f5ed65ca99185140f6335b1753bddb482eccd866bc6cb41436` |
| Installed review `SKILL.md` | `2ab6eb8f5ac42d9f78911d7bb33b2d975ab681edf46eec06a8967e974694faa7` |
| Installed `references/read-only-review.md` | `19a200d0961c68028a575d2f0b7c292400683c5bda1e44ba0045305d9f8ea689` |
| Installed `references/review-knowledge-v0.3.md` | `564c52831d438d9b49f4ca098dd1884167f2be096cc56f959c7847002ffe0351` |
| Installed `references/provenance.json` | `886140acae2262c6f1a7a4ce9c1a41c50ca6ca9ad100d5d2dfad235c7f3b1187` |
| Installed `plugin.json` | `3cf8d0d957b4535c019689f55b2199eb3eb51cb155d64279a22e5b5c9790b80c` |

I ran `PYTHONDONTWRITEBYTECODE=1 python run_tests.py` from `workspace/`. Result: **20 tests, 0 failures/errors, exit 0**. SHA-256 of the merged stdout/stderr from a repeat of that command was `9deef4ef8a3b5288b979a4c01a71685686ffd1447700202e0f88dfcfa0acf2ac`. These are observed tests for this snapshot, not human acceptance or production validation.

## Business walk and semantic findings

**Sufficient for the bounded fixture (Q1–Q3, P1/P2).** The Business Design specifies a registered resident's return against the *selected loan's* recorded tool number and issued accessories, confirmation only on a match, a first return timestamp, inspection-pending/non-loanable state, and a needs-review result to the counter on number mismatch or shortage (`docs/business-design/tool-return.md:37–41, 90–138`). The code reads exactly the selected record before comparison (`tool_return.py:79–93`), returns `NEEDS_REVIEW` with recipient `窓口` before any mutation on in-scope mismatch/shortage (`:93–95`), and on a match records the first timestamp and sets the state (`:96–100`). A result object is returned to the calling counter; no notification delivery is asserted (`docs/implementation-notes.md:15–23`). There is no definite Business Design/Check/code mismatch in these in-scope paths.

From the return clerk's perspective, a first matching return produces confirmation, the timestamp in the selected loan, inspection pending, and non-loanable status (`tests/test_tool_return.py:42–62`). A number mismatch, pure shortage, both, or all missing accessories gives a needs-review result without a new timestamp or inspection-pending change (`:32–38, 64–88`). From the counter's perspective, the returned result is directly available with recipient `窓口` (`:83–88`); who performs the subsequent investigation and any re-reception remain unconfirmed (`docs/business-design/tool-return.md:27–31, 126–129`). On matching replay, the original timestamp remains even with a later or earlier supplied time (`tool_return.py:96–97`; `tests/test_tool_return.py:90–96`). On mismatching replay, the current attempt returns needs-review while the prior confirmed receipt and timestamp remain; that does not recast the prior receipt as unconfirmed (`:98–107`). This is a coherent bounded continuation after changed information, not a new business approval.

**Scope boundary, not a business outcome.** The simulated decision explicitly excludes extra/substituted accessories; the Check list keeps BD-Q04 unresolved (`docs/decisions.md:13`; `docs/checks/tool-return.md:146–151`). Code rejects any supplied token outside the selected loan's expected tokens via `OutsideExampleScope` before comparing the tool number or mutating state (`tool_return.py:64–71, 90–95`). Tests assert that extras/substitutions, including alongside a mismatching tool number, have no business result and no mutation (`tests/test_tool_return.py:157–169`). This correctly avoids quietly treating unresolved input as confirmation or `要確認`. The fixture's distinct-token and nonempty-list restrictions (`tool_return.py:46–53, 82–91`) are explicit technical test-domain boundaries, not adopted accessory identity, quantity, surplus, or substitution policies. Do not infer what a real counter should do with those returns.

**Technical evidence limitation, no observed behavior defect.** `test_received_group_is_not_available_for_loan` asserts `False` after receipt, but fixture `LoanRecord.available_for_loan` starts `False` (`tool_return.py:25–37`; `tests/test_tool_return.py:15–20, 60–62`). That test alone would pass if the success path omitted its assignment. Direct code inspection shows the required `False` assignment (`tool_return.py:96–100`), so TR-04 is semantically implemented for the snapshot, but the assertion is weaker than a transition/negative-mutation test. Similarly, TR-07's fresh failure test starts `inspection_pending=False` (`tests/test_tool_return.py:77–81`), though the early return at `tool_return.py:93–95` and replay test `:98–107` demonstrate no change to an already pending record. A future test-strengthening task could add explicit before/after sentinel states; this is not required to record the existing assertions honestly and is outside the authorized mapping-only follow-up.

**Business confirmation still open, with no invented rules.** BD-Q01 (real receipt/counter roles), BD-Q02 (notification and custody), BD-Q03 (investigation/re-reception), and BD-Q04 (surplus/substitution/quantity semantics) remain unresolved; physical handoff is expressly deferred (`docs/checks/tool-return.md:123–155`; `docs/business-design/tool-return.md:23–33`). None is a reason to mark the bounded nine Checks as failed, nor may passing tests close those business questions. The system requirements explicitly exclude UI, authentication, persistence, concurrency, and production operation (`docs/system-requirements.md:1`). No DDL exists in the reviewed workspace. A synchronous in-memory fixture has no evidence about durable recovery after interruption, delivery to a separate counter, actual physical custody, real-person authority, or post-inspection loan eligibility. The design itself stops before those downstream contracts (`docs/business-design/tool-return.md:25–33, 136–138`).

## Evidence sufficient for a later bounded Check-to-Test update

The table identifies *actual test methods and assertions* for the existing Check IDs. It is an evidence map for the orchestrator, not a write to `docs/checks/tool-return.md`. Keep existing IDs, expectation wording, and `確認済み（模擬）` review states. Test success is separate from those simulated states.

| Check | Direct execution evidence | Qualification |
| --- | --- | --- |
| TR-01 | `test_matching_return_is_confirmed` (`tests/test_tool_return.py:42–45`) asserts `CONFIRMED` and receipt property; `test_selected_loan_is_the_comparison_source` (`:143–151`) asserts selection by loan. | In-scope distinct-token match only; no surplus/substitution policy. |
| TR-02 | `test_first_receipt_records_time_on_selected_loan` (`:47–54`) asserts selected record UTC time and other record unchanged; `test_time_is_normalized_to_utc` (`:109–119`) checks supplied timezone variants. | UTC normalization is a fixture requirement, not added business meaning. |
| TR-03 | `test_received_group_waits_for_inspection` (`:56–58`) asserts pending after confirmed reception. | Does not prove notification or physical handoff. |
| TR-04 | `test_received_group_is_not_available_for_loan` (`:60–62`) asserts non-loanable after reception. | Initial flag is already false; code's assignment at `tool_return.py:99` is additional inspected evidence. Do not describe this test as proving a transition from true. |
| TR-05 | `test_failed_reception_does_not_confirm_receipt` (`:64–70`) covers number mismatch, pure shortage, both and all missing (`:32–38`); status checked separately by TR-08 test. | Fresh attempt; an earlier completed receipt is not undone by a later failed attempt (`:98–107`). |
| TR-06 | `test_failed_reception_does_not_record_return_time` (`:71–75`) covers the four failure inputs; `test_mismatching_reprocessing_keeps_existing_time_and_state` (`:98–107`) checks an existing first time remains. | “No timestamp from this attempt,” not “erase all preexisting timestamps.” |
| TR-07 | `test_failed_reception_does_not_set_inspection_pending` (`:77–81`) covers the four inputs; replay assertions at `:98–107` check already-pending state remains. | Fresh test starts false; code early return is necessary supporting evidence for no change. |
| TR-08 | `test_failed_reception_returns_needs_review_to_counter` (`:83–88`) asserts both `NEEDS_REVIEW` and recipient `窓口` for all four failure inputs. | A returned value, not an external notification or subsequent investigation. |
| TR-09 | `test_matching_reprocessing_preserves_first_return_time` (`:90–96`) asserts object-identical first time after later and earlier supplied times; mismatching replay at `:98–107` preserves it too. | Does not establish general idempotence or all replay response semantics. |

The test methods above were actually run successfully in the stated snapshot. Boundary tests (`tests/test_tool_return.py:154–194`) establish fixture exclusions and should not be mapped as new approved business Check outcomes. The existing Check document still says all Test evidence was uncreated/unrun (`docs/checks/tool-return.md:40`), so that statement is stale *relative to this verified run* and is a suitable narrowly scoped follow-up update. Before doing so, compare current source/design/check hashes against these pins; if relevant inputs changed, do not attach this run as evidence for the changed revision.

## Classification and stop condition

- **Definite mismatch:** none observed in the explicitly simulated, in-scope single-loan fixture.
- **Business confirmation:** BD-Q01–Q04 and physical handoff remain deferred/excluded. No new decision was requested or supplied by this review.
- **Technical improvement candidate:** strengthen TR-04 and optionally TR-07 tests to prove changes against deliberately nondefault prior states; no code change or test addition is part of this stage.
- **Sufficient:** the nine existing Check outcomes have bounded implementation correspondence and identifiable passing assertions, subject to the qualifications above.

The review stops at the documented in-memory boundary and at the actual output meaning. It does not demand missing UI/DDL, notification, persistence, a full error workflow, or an accessory policy that the simulated design did not settle. No source or Check record was edited by this Fresh reviewer.
