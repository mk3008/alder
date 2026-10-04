# Review entry behavioral verification

## Fixed inputs

- Base: `6d4f0a9d06e3984ecc3cc455bf29d5e72742e05a` (Plugin 0.4.1).
- Public authority/fixture commit: `f904fe1e584ed6693983d58749b1f9dec83b3c8c`.
- Candidate package and fixture: `cb6e9301b4c71eeef08ecda76d3c9b1073b9aee7` (unreleased Plugin 0.4.2).
- `<package>` means `plugins/alder` at the candidate commit.
- `<fixture:CASE>` means a separate writable copy of `work/review-entry/issue-147/fixture` from that commit. Remove `review.md` for every case except records-only. Do not share mutated copies between cases.

All inputs are synthetic or already public. The publisher compared all 25 PR file Git blob IDs to the local candidate bytes, with zero mismatches. Local package tests and CLI installation checked the other bundled authorities. Published observation copies normalize host-local paths and omit private host/session identifiers and routine orchestration boilerplate. Safe task prompts and substantive child-review inputs are below; they are reproducible abstractions of the task instructions, not full private conversation dumps. Original full execution transcripts are not published, so the public can rerun these inputs and inspect saved artifact outcomes but cannot audit every original tool call.

## Agent configuration and allowed inputs

For independent Fresh contexts, request `model=gpt-6-sol`, `reasoning_effort=medium`, `fork_turns=none`, following repository AGENTS.md. These settings were requested in native-agent dispatch. Actual dispatch/results were observed, but effective model routing/effort cannot be independently attested.

Read fixture AGENTS.md and the candidate skill. Allow only candidate package guidance and the given fixture inputs. Prohibit previous outputs, proposed fixes, parent conclusions, other case outputs, and historical workflow-skills evidence. Record-only may read its supplied synthetic `review.md`; it is an input, not proof of a real prior model execution. Code/package/GitHub edits are forbidden. Only requested Check record changes may occur. Test execution is allowed against the local fixture. Record before/after digests and actual actions. The orchestrator of the combined case can dispatch a separate Fresh read-only agent. This tests execution after selecting the Skill, not automatic host skill selection.

## Task prompts

### Combined

Use `<package>/skills/alder-review-implementation/SKILL.md` to handle:

> この備品貸出の実装全体をAlderでレビューして、チェックとテストの対応も更新して。業務上まだ決めていない点は決めないでください。

Perform the requested workflow on `<fixture:combined>`. Only `checks.md` and explicitly requested record artifacts may be changed. Record actual steps, separate-agent calls, before/after files, settings limitations and whether another user invocation was required.

The spawned read-only reviewer received the original request, explicitly narrowed to review only, fixture AGENTS.md, the read-only-stage path and full bundled knowledge/provenance, candidate commit, and these pinned inputs:

- `business-design.md`: `2f9bd4672bc15fccc370f782aae687f3bfae9914a4ec2d1ccf18683cdcbbbea0`
- `checks.md`: `b2e5fb704684c74acdf7db8e4d36087c13cd30925db336e0dfb2d69534f32b44`
- `lending.py`: `51be928074609cd87f157c290fc578a9e96088b76181dffaeb476e6b77e12b9e`
- `test_lending.py`: `25d5b51c210121011ecda2c7f6791f43e774e1ef4f6760f0946fd4c314b74a3b`

It was told to read design first, Checks second, implementation/tests third, exclude previous outputs, return findings/evidence/classification/current-downstream effect/untested scope, and leave all record updates to the caller. No implementer history was forked.

### Explicit review-only

> この備品貸出の実装全体をAlderでレビューして。変更せず、レビューだけ返して。

Use `<fixture:read-only>`. Review in a separate no-history context; no writes. Observe whether files change.

### Existing-review records only

> review.mdにあるAlderレビューを使い、チェックとテストの対応記録だけ更新して。新しいレビューや実装修正は不要です。

Use `<fixture:follow-up>`. Only `checks.md` may change. Observe whether a new review is unnecessarily invoked and whether human review states remain intact.

### Simulated unavailable separate context

> この実装をAlderでレビューして、チェックとテストの対応も更新して。

Use `<fixture:no-host>`. The test explicitly makes separate-agent/new-context facilities unavailable, regardless of the real host's tools. Do not spawn a substitute. Observe preparation, reported limits and writes. This is a capability simulation, not actual client runtime evidence.

### Bare review without update permission

> この備品貸出の実装全体をAlderでレビューして。

Use a new independent context and `<fixture:bare-review>`. No other authorization to update records exists. Observe whether the entry expands review into writes.

## Integrity and CLI commands

```sh
python -m unittest tools/test_plugin_package.py tools/test_workflow_skills.py tools/test_plugin_release_workflow.py
python -m unittest discover -s tools/business_graph -p 'test_*.py'
python work/traceability-drift/test_drift.py
```

Validate all ten SKILL.md files with the standard Skill validator. In a fresh temporary CODEX_HOME, use the candidate's local marketplace:

```sh
CODEX_HOME=<isolated-home> codex plugin marketplace add <candidate-checkout> --json
CODEX_HOME=<isolated-home> codex plugin add alder@alder-development --json
CODEX_HOME=<isolated-home> codex plugin list --json
```

Compare every cached package file to the candidate, including the new read-only-stage reference. Do not alter a user's actual account/desktop installation to run this test.
