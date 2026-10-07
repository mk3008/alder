# Step 12 — bounded product implementation and tests

## Result

Implemented one small Python-standard-library, in-memory example in the supplied workspace. Both actual test commands completed successfully: **20 discovered unittest cases, 0 failures, 0 errors, 0 skipped, process exit 0**. The initial stdout runner and normal unittest discovery exercised the same test IDs. This is a synthetic implementation/testing result, not real user business approval, an independent Alder review, or evidence for a broad benchmark.

The four fixed inputs were hash-checked after implementation and are unchanged. No Check-to-Test mappings, review states, or business requirements were written. Independent implementation review and evidence maintenance remain the next steps.

## README handoff and routing observation

The implementation instruction supplied to this worker, with the documented path substitution, was:

```text
docs/business-design/tool-return.md、docs/checks/tool-return.md、
プロダクトのシステム要件を読み、今回合意した範囲を実装・テストして。
```

The system-requirements input was `docs/system-requirements.md`; `docs/decisions.md` bounded the synthetic agreed scope and unresolved topics. The existing Check list contains TR-01–TR-09. All four inputs were read before code changes.

The only Alder routing source consulted was `../evidence/available-skills.txt`. None of its described Skills handles ordinary product implementation: drafting, business-design review, completed-implementation review, evidence maintenance, discovery, optimization, graph export, and drift detection have different scopes. **Selected route: ordinary Python implementation and unittest; no Alder Skill invoked.** In particular, the completed-implementation review Skill was not used to implement its own review target. Account c0/c11 Alder packages, historical experiment contents, and parent conclusions were not used. No fallback Alder route or forced Skill selection was needed.

A general software-engineering instruction was read, including its direction to execute in an already assigned engineering task. The first local instruction-file inventory also listed sibling AGENTS.md paths; none of those sibling files or historical experiment files was opened or used. Implementation changes stayed in the supplied workspace; explicitly requested evidence outputs were saved in its sibling evidence directory.

Requested worker configuration was native, inherited model, xhigh, no history. The task handoff states those requested settings; effective model/effort/context runtime settings were not independently verified. The actual local interpreter reported `Python 3.12.14`. The observed run was on 2026-10-05 UTC. No network, external account, dependencies, real data, UI, database, or background process was used by the product or its tests.

## Artifacts and implementation choices

- `tool_return.py`: `LoanRecord`, `ReceptionResult`, and one `receive_return` operation.
- `tests/test_tool_return.py`: 20 discoverable unittest cases, using two synthetic loan fixtures and parameterized subtests for documented failure combinations and technical boundaries.
- `run_tests.py`: ordinary unittest discovery with runner output explicitly directed to stdout.
- `docs/implementation-notes.md`: local interface, run commands, rationale, and excluded scope.

The caller selects one existing loan by dictionary key. Only that loan's recorded tool number and accessory tokens are comparison sources. The record embeds the borrowed group's return-state flags for this small memory-only fixture. Presence of the first return timestamp is the single source of truth for receipt confirmation; no redundant independent confirmation bit can diverge from it.

For a matching return, the first supplied timezone-aware datetime is normalized to UTC and recorded, the group becomes inspection-pending, and the group remains unavailable for lending. A number mismatch, pure shortage, or both returns 要確認 to the calling counter without writing the timestamp or changing inspection-pending state. The caller-visible return value represents delivery to the local counter interface, not an external notification. Replay leaves the first datetime object unchanged; an unsuccessful replay does not erase an earlier receipt or undo its state.

The accessory representation is deliberately fixture-local: distinct opaque tokens already present in the synthetic loan. Only a matching token collection or a pure omission of known tokens is supported. The code does not claim to determine real-world identity, equivalence, quantities, or substitution acceptability. Extra or substituted tokens, repeated labels, and an empty issued list raise `OutsideExampleScope` before any reception result or mutation. This exception is a technical limit of the callable example, **not an implemented business disposition or a new 要確認 policy**. It also excludes extras/substitutions combined with number mismatch instead of inventing precedence for an unresolved input. Unknown loans and malformed fixture tokens are likewise technical precondition failures; no missing-loan business workflow is added.

## Executed commands and results

Working directory for every implementation/test command:

```text
<dogfood><workspace-root>
```

The first test command was executed in a bash pipeline with `pipefail`, and the Python process status was read from `PIPESTATUS[0]`:

```sh
PYTHONDONTWRITEBYTECODE=1 python run_tests.py | tee ../evidence/12-unittest.stdout.log
```

Observed Python exit status: `0`. This runner explicitly uses `stream=sys.stdout`; the log below is actual runner stdout, not an invented transcript. No tests failed in this run.

The independent invocation of the standard runner was:

```sh
PYTHONDONTWRITEBYTECODE=1 python -m unittest discover -s tests -v > ../evidence/12-unittest-discovery.stdout.log 2> ../evidence/12-unittest-discovery.stderr.log
```

Observed process exit status: `0`, same 20 cases, `Ran 20 tests in 0.002s`, `OK`. Standard unittest writes its report to stderr: its stdout log is empty and its stderr log holds the report. This was a second command invocation of the same implementation-authored test suite, not an independent semantic review.

The four recorded pre-change SHA-256 values were passed to `sha256sum -c -` after the runs. Actual result:

```text
docs/business-design/tool-return.md: OK
docs/checks/tool-return.md: OK
docs/system-requirements.md: OK
docs/decisions.md: OK
```

`PYTHONDONTWRITEBYTECODE=1` avoided generated bytecode. The final workspace inventory contained only the four original inputs and four new artifacts listed above. No commit, push, or PR action was needed or performed.

## Actual unittest stdout

```text
test_empty_issued_list_is_not_given_new_business_meaning (test_tool_return.ExampleBoundaryTests.test_empty_issued_list_is_not_given_new_business_meaning) ... ok
test_extras_and_substitutions_have_no_business_outcome (test_tool_return.ExampleBoundaryTests.test_extras_and_substitutions_have_no_business_outcome) ... ok
test_other_loan_accessories_are_not_used_as_fallback (test_tool_return.ExampleBoundaryTests.test_other_loan_accessories_are_not_used_as_fallback) ... ok
test_repeated_accessory_labels_do_not_define_quantity_policy (test_tool_return.ExampleBoundaryTests.test_repeated_accessory_labels_do_not_define_quantity_policy) ... ok
test_unknown_loan_is_outside_the_fixture (test_tool_return.ExampleBoundaryTests.test_unknown_loan_is_outside_the_fixture) ... ok
test_failed_reception_does_not_confirm_receipt (test_tool_return.ReturnReceptionTests.test_failed_reception_does_not_confirm_receipt) ... ok
test_failed_reception_does_not_record_return_time (test_tool_return.ReturnReceptionTests.test_failed_reception_does_not_record_return_time) ... ok
test_failed_reception_does_not_set_inspection_pending (test_tool_return.ReturnReceptionTests.test_failed_reception_does_not_set_inspection_pending) ... ok
test_failed_reception_returns_needs_review_to_counter (test_tool_return.ReturnReceptionTests.test_failed_reception_returns_needs_review_to_counter) ... ok
test_first_receipt_records_time_on_selected_loan (test_tool_return.ReturnReceptionTests.test_first_receipt_records_time_on_selected_loan) ... ok
test_matching_reprocessing_preserves_first_return_time (test_tool_return.ReturnReceptionTests.test_matching_reprocessing_preserves_first_return_time) ... ok
test_matching_return_is_confirmed (test_tool_return.ReturnReceptionTests.test_matching_return_is_confirmed) ... ok
test_mismatching_reprocessing_keeps_existing_time_and_state (test_tool_return.ReturnReceptionTests.test_mismatching_reprocessing_keeps_existing_time_and_state) ... ok
test_naive_time_is_rejected_before_mutation (test_tool_return.ReturnReceptionTests.test_naive_time_is_rejected_before_mutation) ... ok
test_non_datetime_is_rejected_before_mutation (test_tool_return.ReturnReceptionTests.test_non_datetime_is_rejected_before_mutation) ... ok
test_received_group_is_not_available_for_loan (test_tool_return.ReturnReceptionTests.test_received_group_is_not_available_for_loan) ... ok
test_received_group_waits_for_inspection (test_tool_return.ReturnReceptionTests.test_received_group_waits_for_inspection) ... ok
test_selected_loan_is_the_comparison_source (test_tool_return.ReturnReceptionTests.test_selected_loan_is_the_comparison_source) ... ok
test_time_is_normalized_to_utc (test_tool_return.ReturnReceptionTests.test_time_is_normalized_to_utc) ... ok
test_timezone_without_offset_is_rejected_before_mutation (test_tool_return.ReturnReceptionTests.test_timezone_without_offset_is_rejected_before_mutation) ... ok

----------------------------------------------------------------------
Ran 20 tests in 0.002s

OK
```

## Remaining scope and limitations

Still unresolved and not implemented: actual responsibility/permission assignments; notification and storage responsibility; physical handoff; investigation or re-reception after 要確認; real-world accessory equivalence/quantity rules, extras, and substitutions. The fixed documents retain their original unresolved state. Registered-resident status and an existing loan with comparison data are fixture preconditions, not newly implemented registration/authentication rules. Lending, inspection work, repair, charging, persistence, concurrency, and production readiness are outside this example.

The tests provide observable assertion results for this implementation. No test evidence was promoted into a Check review state, no Check-to-Test mapping was updated, no independent Alder review was conducted, and no claim of complete real-world coverage or business acceptance is made. Subsequent review should inspect the code, assertions, fixture-domain limits, and untouched source documents directly.

## SHA-256 artifact manifest

The manifest was generated after both runs. Paths are relative to the workspace. It is also stored verbatim at `../evidence/12-artifacts.sha256`; this report intentionally does not self-hash.

```text
0980f2f430f217f22b7494958c61c474817c440e23166cdc6d40c4586df0b7a1  tool_return.py
4dfd53ba191ef48b6af4d7c891171905b104239fe5385208ad2845bc2a963d1d  tests/test_tool_return.py
7778146810d410f9758d49f8310f023fe68d204b990c8dd92894a7c3e451a0f1  run_tests.py
dbd27ac8e9650e4a4bfabca14c409a09a633a9a117eed99c12880d1110bd0fa1  docs/implementation-notes.md
ef86b2225a1479e64cb8f138fd073e4c789559b7e13e16add8bf8dd2d2f4cdd2  docs/business-design/tool-return.md
f5003361c073f3a17dfa3389ed6ef89ec3103c1185d0d6ae51e29aa1ceb08351  docs/checks/tool-return.md
5d1cf55b25b136efd74d52eb4403220e2671c7b128f55fb3a29428f5dc6cf63f  docs/system-requirements.md
402a106decdd3581cf3f949755ac52ae3b5e0627dbf38f5acbc65a636df91806  docs/decisions.md
e4b66c8464ecb8f5ed65ca99185140f6335b1753bddb482eccd866bc6cb41436  ../evidence/available-skills.txt
9deef4ef8a3b5288b979a4c01a71685686ffd1447700202e0f88dfcfa0acf2ac  ../evidence/12-unittest.stdout.log
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  ../evidence/12-unittest-discovery.stdout.log
9deef4ef8a3b5288b979a4c01a71685686ffd1447700202e0f88dfcfa0acf2ac  ../evidence/12-unittest-discovery.stderr.log
```
