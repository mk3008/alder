# One-request implementation review and record follow-up

## Result

Implemented an unreleased Plugin 0.4.2 candidate in [PR #148](https://github.com/mk3008/alder/pull/148), retaining the existing ten Skills. A combined natural-language request selects the existing implementation-review entry, runs a separate read-only Fresh review, compares pinned inputs, and continues authorized record maintenance through the existing follow-up procedure. The read-only reviewer does not write. No coding loop, automatic business approval, new runtime or MCP dependency was added.

The practical entry is:

> Alderで実装をレビューして、チェックとテストの対応も更新して。

“レビューだけ” and a bare review request without update permission remain read-only. Existing-review record maintenance remains separately usable without another review. Undecided business meaning stays open while independent confirmed records can be updated. This candidate was published for review, not merged, released or installed into a user's account.

## Observed verification

Test input and package revision: `cb6e9301b4c71eeef08ecda76d3c9b1073b9aee7`. Subsequent evidence/navigation changes do not alter the tested package. See [fixed inputs, safe task prompts and reproduction commands](PROTOCOL.md).

| Case | Actual observation | Evidence |
| --- | --- | --- |
| Combined request | Orchestrator dispatched a separate no-history read-only reviewer, received findings, rechecked input hashes, then changed only checks.md without another user invocation. CK-02 mapping added, CK-01 partial, CK-03 missing, CK-04 remained unapproved despite its passing test. | [Observation and diff](evidence/combined-observation.md), [resulting Checks](evidence/combined-checks.md) |
| Explicit read-only | Separate reviewer returned findings; every fixture input hash remained unchanged. | [Case A](evidence/boundary-observation.md#a-read-only-implementation-review) |
| Record-only | Existing synthetic review used directly; no Fresh review added. Only requested Check evidence changed; IDs, expectations and human review states preserved. | [Case B](evidence/boundary-observation.md#b-existing-review-record-follow-up), [resulting Checks](evidence/follow-up-checks.md) |
| Missing separate-context capability | Simulated capability restriction produced a pending independent stage, no substitute self-review and no writes. This is not a real-client capability observation. | [Case C](evidence/boundary-observation.md#c-simulated-no-separate-context-host) |
| Bare review without write permission | New independent context completed review; no Check/Test record update and all five input hashes unchanged. | [Observation](evidence/bare-observation.md) |
| Independent package review | No material blocking finding; checked changed instructions, stage separation, references, provenance and tests without prior test outputs. | [Review](evidence/candidate-review.md) |

The publisher independently compared fixture outcomes with the original public fixture: only combined/checks.md and follow-up/checks.md changed. Other product files were unchanged. Temporary Python bytecode from two test executions was removed. All observed fixture test executions passed 3/3; that does not validate missing assertions or undecided business policy.

Package/CLI/release tests: **14 passed**. Graph regression: **44 passed**. Drift regression: **12 passed**. All **10 Skill validators passed**. The first Graph invocation used the wrong module import path and failed; the documented discovery/direct-file invocation then passed all 44 tests. No product code was changed to make it pass.

Codex CLI **0.159.2**, fresh temporary CODEX_HOME, local marketplace: add/install/list succeeded; installed/enabled version **0.4.2**, **10 Skills / 45 files** with byte-for-byte cache/source equality. This did not touch the user's actual configuration/account/desktop. CLI emitted its usual warning about helper binaries under a temporary home; commands and cache checks succeeded.

[Candidate package CI](https://github.com/mk3008/alder/actions/runs/37244399997) and [release-input validation](https://github.com/mk3008/alder/actions/runs/37244399915) succeeded. The release job was skipped. These are pull_request workflows, with candidate head cb6e9301 recorded, not a manual direct-head checkout claim.

## Limits and decision

- Native-agent dispatch and fixture record edits are real execution observations after explicitly selecting the candidate Skill. Client automatic natural-language routing, desktop/mobile runtime behavior and installed-account operation were not tested.
- Requested Fresh settings were gpt-6-sol / medium / no history fork. Effective runtime model/effort could not be independently attested. No-host case is a simulation.
- Inputs were published at an immutable commit before the behavioral runs. Public artifact outcomes and safe prompt abstractions are inspectable; original full host/session transcripts are not published. See the [protocol's publication boundary](PROTOCOL.md).
- This is one small synthetic product and a few non-repeated runs. Reviewers differed in individual findings: combined and bare runs called out missing equipment identity; explicit read-only's summarized result did not. This is not evidence of identical review output, comparative detection performance or measured user-effort reduction.
- Concurrent input-change behavior is specified and source-reviewed but was not fault-injected in these runs. No general correctness or zero-contamination guarantee follows from these tests.
- Separate-context support is necessary for the combined route. When unavailable, the Skill reports the remaining independent stage and does not perform combined-workflow writes. A Skill cannot provision that capability.

The adopted direction is to remove mandatory user-level two-Skill invocation while retaining independent review and authorization boundaries. The implemented candidate supports that direction in the tested native-agent environment. Merge, release, user-account update and observed real-use benefit remain separate decisions/work.

## Retrospective

The distinction that matters is the independently scoped review stage versus authorized record maintenance, not making users remember two internal names. Reusing the existing entry and follow-up avoided a new Skill and duplicated maintenance rules. The principal risk was treating a bare review as write permission; explicit and bare read-only exercises therefore checked file hashes. Host capability claims are bounded rather than inferred from prose instructions or package tests.
