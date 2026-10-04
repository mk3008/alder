# Plugin 0.4.0 release-readiness review

## Task and scope

Fresh, read-only release-readiness review of the local Alder Plugin 0.4.0 candidate: main-only validated publishing, tag/commit safety, package integrity, tests, release-facing availability claims and the boundary between AI findings and human business decisions. Reviewed the release/package workflows, release-workflow test, release notes, English/Japanese READMEs, plugin/adoption guides, package metadata and bundled provenance. This is a local-only candidate; no GitHub publication or live-client validation was part of the review.

- Requested model: `gpt-6-sol`; requested effort: `medium`; fork: `none`. Effective runtime settings cannot be independently attested here.
- Supplied published-authority reference: `0c78a4d1c937174fb52d0668abc85ff0534f80c4`. This local candidate directory has no `.git`; commit ancestry, working-tree delta, remote tag/release state and CI could not be verified.

## Result

Release logic is appropriately gated on validation and `refs/heads/main`, and the new-release call targets `plugin-v0.4.0` at `context.sha`. The local tests and copied-source checks passed. No demonstrated blocker in the proposed new-release path. One release-integrity qualification should be resolved or explicitly accepted before interpreting a green run as proof of the tag’s target: an already-existing release causes an immediate success return without inspecting its tag or commit. This preserves the existing release but cannot establish that it is the intended artifact. The mocked test deliberately covers “released: true” only as a no-write case, not as an identity/target assertion. For a current clean first publication this does not alter the create path; verify absence of a pre-existing release/tag before the run, or change the workflow to report/validate existing-release identity (allowing legitimate old published commits when main later advances).

## Evidence and boundaries

- `.github/workflows/plugin-release-tag.yml`: `release` needs `validate`, excludes PRs, requires `refs/heads/main`, and alone gets `contents: write`. `validate` checks version 0.4.0, ten skill files, marketplace path, package/workflow tests, graph and drift suites. The `push` event is scoped to a change in the new release workflow file. `workflow_dispatch` can run from main; an ordinary later main push that does not alter the workflow will not rerun this fixed 0.4.0 publication job.
- On missing tag/release, `createRelease` supplies `tag_name: plugin-v0.4.0`, `target_commitish: context.sha`, published release fields and no tag-update operation. A pre-existing tag resolving to another commit throws rather than moves it. A pre-existing release is preserved, though not verified as described above. Remote state and GitHub API effects were not exercised here.
- Local command `python3 -m unittest tools.test_plugin_package tools.test_workflow_skills tools.test_plugin_release_workflow`: 12 passed. Graph discovery suite: 44 passed. Drift discovery suite: 12 passed. `work/traceability-drift/evaluate.py --output /tmp/alder-review-drift-observations.json`: 26 scenarios passed. These are local tests and mocks; no real GitHub Actions run or client install was performed.
- All ten skill provenance files were inspected. The six newly packaged skills’ reference copies match each declared source byte-for-byte and SHA256; the exporter and detector script copies likewise match their declared source/script digests. The other four reference copies also match their local declared sources. These checks establish snapshot integrity, not authenticity of historical revision labels; `.git` and remote verification were unavailable in this local directory.
- README, Japanese README, adoption and plugin guide present `plugin-v0.4.0` as the install target. That is appropriate release-facing copy after publication but is not current availability evidence for this local candidate. They disclose that 0.4.0 client routing and script execution remain unverified, Python 3.12+/local execution is needed for graph/drift, and method release/review-knowledge versions differ. Release notes similarly separate tested local behavior from client validation. The installation URL and tag need a post-publication live check.
- Reader-facing docs preserve the Design → human-agreed Checks → implementation → independent review/follow-up boundary and distinguish read-only reviews/discovery from requested record writes. They do not treat model confidence, test success, hashes or structural discovery as human approval. No material author-side reviewer-process leakage was found in the README journey.
- I did not independently rerun the prior six-Skill behavior evaluations, real-client routing, or product adapters; prior reports remain claims outside this review.

## Examined-file SHA256

- `AGENTS.md`: `64695a89498d762b0be086370d68c0423e524daa60237c0181407ed675ebce32`
- `.github/workflows/plugin-release-tag.yml`: `5f2772514d78e9c9fa953507cb7b8085dd5f3e6dd4c70d2fa2f09e9d66ffa69a`
- `.github/workflows/plugin-package.yml`: `2f90335475120be807813311ac1c0e2e2894923e85f61000b6b25ac6a7b235c6`
- `tools/test_plugin_package.py`: `2de0af6ccaeaa770c8a2ab6875dc484d1f25afabc8b4a196b6ea8ac4b6f2ec34`
- `tools/test_workflow_skills.py`: `2bf1ff194af7fa88710ac875697ae6c3f026a805edd43c5b8d04486ec8011a79`
- `tools/test_plugin_release_workflow.py`: `1d7ff2e39caaed861471ff57040af67e151a180955c50fa39376f8b7e4cf86fa`
- `docs/plugin-release-notes-v0.4.0.md`: `ef6e43ae10db8e29ffbc1aa65cd940cddf296700c11727559198e8cf185155d4`
- `README.md`: `9d484dbe91249517b7d7440c676e5ddd4ab6938b3371e3f216ac0474d17d8b8e`
- `README.ja.md`: `83662f76ee93ea6d120e8839d06b635a43c69d54ec38a5025abf7ff023fc00d1`
- `docs/plugin-adoption.md`: `5add5efa44508fffa708e96967f5ba100cb3c29c4ec652eb0c5e3ad2d1794a2b`
- `docs/adoption.md`: `bb0e35a4d330f3b0464233805483802f7e7e4d95dcece603dc2196852ed98759`
- `plugins/alder/plugin.json`: `0d5c3715c781bb7b3a34815050743b472c1a08cffc28fece10b59f748c917cb8`
- `.agents/plugins/marketplace.json`: `c5be4bc1442a6adfafd3f26948d25189e17f540b3b112024a58c8081b3e4f5e8`
- `plugins/alder/skills/alder-check-traceability-drift/references/provenance.json`: `9d503846fb28dbea3fde85d5c861f4810e61d1eb202c0c07f3d7394169c5c3a6`
- `plugins/alder/skills/alder-discover-business-questions/references/provenance.json`: `63a85785fb1477dfdc79c2e04fe85a4239d3e8b636456f2e02f493c9a42fa8b1`
- `plugins/alder/skills/alder-draft-business-design/references/provenance.json`: `86f7a82735a2f8ba98aa579b828315b1ad45b43c3443e3a187b2e7dabfe973d4`
- `plugins/alder/skills/alder-draft-check-items/references/provenance.json`: `888f046b287b690331d59c9b8ad280e7ec71e836f46d78c40984550e4f9f2a6f`
- `plugins/alder/skills/alder-explore-functional-conditions/references/provenance.json`: `fdb0276db026a0e665d4b3ebb0893c6e6cf30d1f3b1c80d59b7bee521b1fd24d`
- `plugins/alder/skills/alder-export-business-graph/references/provenance.json`: `8e2deda05a3c48003ebb112e9858e8d21e34bc32d5ad923fbb934691f8ec190a`
- `plugins/alder/skills/alder-follow-up-review/references/provenance.json`: `b36d0b5a0557a90e1f2cabf1cb503193c8c8d2e92e33421180f28d4ebc7fb75a`
- `plugins/alder/skills/alder-optimize-business/references/provenance.json`: `dd08e37b1b33ced101df64ccc6ed9821bfaaae80b051fcb98ec4a4b51efbfe67`
- `plugins/alder/skills/alder-review-business-design/references/provenance.json`: `939db5a3a0cfe3d637a9a175135bcfbbe0ff10004153903f943d98714def32bc`
- `plugins/alder/skills/alder-review-implementation/references/provenance.json`: `886140acae2262c6f1a7a4ce9c1a41c50ca6ca9ad100d5d2dfad235c7f3b1187`
- `plugins/alder/skills/alder-export-business-graph/scripts/export.py`: `4f5cf06d2c3795cded69ab751110a11807ea580586b12805e06e175ecd60a9ed`
- `plugins/alder/skills/alder-check-traceability-drift/scripts/drift.py`: `c5db8c5c878be26554f70394fd27a127411f2a10e8a0320ba26259eff6cff75e`

No source, release, GitHub or user settings were modified in this review.

## Correction assessment — existing-release path

The proposed workflow and its mocked test were updated after the initial review. The original existing-release qualification above records the earlier snapshot. In the corrected local snapshot, the script checks the existing `plugin-v0.4.0` tag even when `getReleaseByTag` returns a release. It dereferences annotated tags, requires a commit matching `context.sha`, and rejects a missing tag or draft release before treating the release as already published. The initial green-but-unverified existing-release path is closed for the tested states. This fixed-version workflow may fail on a later manual rerun from a newer main commit rather than silently accept the earlier release, a conservative outcome consistent with its immutability check. No tag-movement API call was added.

`python3 -m unittest tools.test_plugin_release_workflow` passed (2 test methods, 10 mocked release states). The correction was inspected locally only; no GitHub Actions execution, remote tag check, release publication or real client install was performed. A race with another independent publisher between tag inspection and `createRelease` is outside the mock and still requires a live post-publication tag/release check. No newly demonstrated blocker in the corrected local release logic.

Corrected-file SHA256:

- `.github/workflows/plugin-release-tag.yml`: `d01a310221d1f91460df53ff8e5d1a09ef7d8f5b16d68364594691101eff02df`
- `tools/test_plugin_release_workflow.py`: `49431bb499a148ac54c6185f15a6f881c21d70cf16b2d234068ffa925d1b219b`
