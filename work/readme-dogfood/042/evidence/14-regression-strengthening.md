# Bounded regression strengthening after implementation review

## Result

Added exactly one test. The unchanged product implementation passes **21 tests, exit 0**. A mutation removing only `record.available_for_loan = False` in memory passes the original **20 tests, exit 0**, but the strengthened suite detects it: **21 tests, exactly one failure, exit 1**. The failure is the new assertion, `True is not False`. No implementation behavior defect was observed or fixed.

## Request and provenance

The task-specific prompt is preserved as a safe abstraction in `14-task-prompt.txt`; administrative coordination was omitted from the public copy. The original prompt hash remains in this report. This is the explicitly authorized test-strengthening step following `13-implementation-review.md`, not the read-only review itself or a Check mapping update. Requested worker settings: **inherited, no explicit model or reasoning-effort override**. Effective runtime model and reasoning effort are **unverified**. Do not transfer the prior review's requested Fresh-agent settings to this step.

Inspected the existing implementation, all test methods, test runner, system requirements, implementation notes, Business Design, Checks, decisions, and prior review. Source workspace has no Git repository; SHA-256 snapshots below identify the exact files. Only `tests/test_tool_return.py` changed within the product workspace. Original test bytes are preserved as `14-tests.before.py`, with the exact original hash verified.

## New test and bounded meaning

Runner test ID:

`test_tool_return.ReturnReceptionTests.test_matching_return_clears_artificial_available_sentinel`

The test deliberately seeds `available_for_loan=True`, invokes the existing matching-return fixture, asserts `ReceptionStatus.CONFIRMED`, and asserts the flag is exactly `False`. Both its docstring and inline comments identify the initial value as an **artificial technical regression sentinel**, not a legitimate real-world loan state, a new business precondition, or lending policy. It strengthens evidence for the existing TR-04 implementation write; it neither changes the business outcome nor makes a real-world state-validity claim.

The original test `test_tool_return.ReturnReceptionTests.test_received_group_is_not_available_for_loan` remains unchanged. Its default-false limitation remains accurately described by the earlier review. The mutation comparison shows the precise extra detection provided by the new probe.

No optional TR-07 test was added: existing fresh failure coverage and successful-then-mismatching replay already cover false and true inspection-pending values for all four failure inputs. Another Boolean matrix would largely repeat that evidence and would not add a distinct bounded regression target here.

## Commands and recorded outcomes

Working directory for all commands:

`<dogfood><workspace-root>`

1. `PYTHONDONTWRITEBYTECODE=1 python run_tests.py > ../evidence/14-full-tests.stdout.txt 2> ../evidence/14-full-tests.stderr.txt; printf '%s\n' "$?" > ../evidence/14-full-tests.exit.txt`
   - 21 tests, all passing; process exit 0.
2. `PYTHONDONTWRITEBYTECODE=1 python ../evidence/14-mutation-probe.py original > ../evidence/14-mutation-original.stdout.txt 2> ../evidence/14-mutation-original.stderr.txt; printf '%s\n' "$?" > ../evidence/14-mutation-original.exit.txt`
   - Original 20 tests against the in-memory mutant: all passing; process exit 0. This demonstrates the original evidence gap.
3. `PYTHONDONTWRITEBYTECODE=1 python ../evidence/14-mutation-probe.py strengthened > ../evidence/14-mutation-strengthened.stdout.txt 2> ../evidence/14-mutation-strengthened.stderr.txt; printf '%s\n' "$?" > ../evidence/14-mutation-strengthened.exit.txt`
   - Strengthened 21 tests against the same in-memory mutant: exactly the new test fails; 0 errors; process exit 1, expected for mutant detection.

All three stderr captures are empty. Test output is intentionally directed to stdout by the runners. Full runner-discovered test IDs are preserved in each stdout log.

The reproducible mutation script asserts the target assignment occurs exactly once, removes that line from a string, executes the compiled string in a process-local module, and loads either the original test bytes or the strengthened tests. It never writes `tool_return.py` and never changes the dataclass's default value. Each run is a separate process; the normal module is unaffected. This is one targeted mutation check, not a broad mutation score or exhaustive correctness claim.

The exact additive test diff is saved as `14-tests.diff`. The before/after JSON hash manifests are also saved separately.

## Exact before/after SHA-256

| Workspace file | Before | After |
| --- | --- | --- |
| `tool_return.py` | `0980f2f430f217f22b7494958c61c474817c440e23166cdc6d40c4586df0b7a1` | `0980f2f430f217f22b7494958c61c474817c440e23166cdc6d40c4586df0b7a1` |
| `tests/test_tool_return.py` | `4dfd53ba191ef48b6af4d7c891171905b104239fe5385208ad2845bc2a963d1d` | `0ff16b58155d6d0c6f30a9261bdd5c35519b800880612db41764a40a773ce5c7` |
| `run_tests.py` | `7778146810d410f9758d49f8310f023fe68d204b990c8dd92894a7c3e451a0f1` | `7778146810d410f9758d49f8310f023fe68d204b990c8dd92894a7c3e451a0f1` |
| `docs/business-design/tool-return.md` | `ef86b2225a1479e64cb8f138fd073e4c789559b7e13e16add8bf8dd2d2f4cdd2` | `ef86b2225a1479e64cb8f138fd073e4c789559b7e13e16add8bf8dd2d2f4cdd2` |
| `docs/checks/tool-return.md` | `f5003361c073f3a17dfa3389ed6ef89ec3103c1185d0d6ae51e29aa1ceb08351` | `f5003361c073f3a17dfa3389ed6ef89ec3103c1185d0d6ae51e29aa1ceb08351` |
| `docs/decisions.md` | `402a106decdd3581cf3f949755ac52ae3b5e0627dbf38f5acbc65a636df91806` | `402a106decdd3581cf3f949755ac52ae3b5e0627dbf38f5acbc65a636df91806` |
| `docs/implementation-notes.md` | `dbd27ac8e9650e4a4bfabca14c409a09a633a9a117eed99c12880d1110bd0fa1` | `dbd27ac8e9650e4a4bfabca14c409a09a633a9a117eed99c12880d1110bd0fa1` |
| `docs/system-requirements.md` | `5d1cf55b25b136efd74d52eb4403220e2671c7b128f55fb3a29428f5dc6cf63f` | `5d1cf55b25b136efd74d52eb4403220e2671c7b128f55fb3a29428f5dc6cf63f` |

## Evidence artifact hashes

| Artifact | SHA-256 |
| --- | --- |
| `14-after-hashes.json` | `be1489bb8be72290fd5367ebbb51e85155171d7f6282d0418a9de6bdc1c322a4` |
| `14-before-hashes.json` | `7c028c4b49861d50d0feca79326a4eb90da1eb03a8b7eea91b6d6c5c27cebbab` |
| `14-full-tests.exit.txt` | `9a271f2a916b0b6ee6cecb2426f0b3206ef074578be55d9bc94f6f3fe3ab86aa` |
| `14-full-tests.stderr.txt` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `14-full-tests.stdout.txt` | `8220feaee76cef05b02cf0d590938b1e153d6973b70b7df7ae38f5fb88d102c4` |
| `14-mutation-original.exit.txt` | `9a271f2a916b0b6ee6cecb2426f0b3206ef074578be55d9bc94f6f3fe3ab86aa` |
| `14-mutation-original.stderr.txt` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `14-mutation-original.stdout.txt` | `faddd774e96f21e06fe0465b921c5246f9c4e7367de7ce34aaf59d41a91975d0` |
| `14-mutation-probe.py` | `33fcfe930b355af1fed6b427b042b08ac1951b99a5a84380ed216ebd136584ef` |
| `14-mutation-strengthened.exit.txt` | `4355a46b19d348dc2f57c046f8ef63d4538ebb936000f3c9ee954a27460dd865` |
| `14-mutation-strengthened.stderr.txt` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `14-mutation-strengthened.stdout.txt` | `11952ef18dcc76fcbd68ee1cce1c6c751b710d22cbf6161ea0ecbe4885fe80a5` |
| `14-task-prompt.txt` | `46c87c88ff5b34c64e60a71b00090d7d517dde770b7590c914bfa07de73c0a72` |
| `14-tests.before.py` | `4dfd53ba191ef48b6af4d7c891171905b104239fe5385208ad2845bc2a963d1d` |
| `14-tests.diff` | `3f18045214aa177e3035544b48ae039a14e3e41c588764181fc89041582b9e38` |

## Scope and stopping condition

Product source, test runner, Business Design, Checks, decisions, and requirements are byte-identical to the starting snapshot. No Check IDs, expectations, review states, or Test mappings were changed. No authentication, credential handling, external network activity, dependency installation, publication, or business approval occurred. The prior review remains evidence of its original 20-test snapshot; this report supplies the separately verified 21-test snapshot. A later authorized mapping step should cite the correct new test hash and this run while preserving simulated review states and all unresolved business questions.

The authorized stopping condition is satisfied: one targeted test added, original tests preserved, full suite passed, the specified mutation detected, and reproducible logs/hashes recorded.
