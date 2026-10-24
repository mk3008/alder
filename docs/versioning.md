# Alder versions and releases

Alder has one user-facing product version: **Alder X.Y.Z**. Its source of truth is `plugins/alder/plugin.json`. A published `plugin-vX.Y.Z` tag fixes the documentation, source, marketplace and plugin together. The existing tag prefix is retained so installation commands and pinned references keep working; do not create a parallel `vX.Y.Z` product tag.

A manifest version on a branch identifies the package content; it does not prove that a release exists. For installation, verify the selected `plugin-vX.Y.Z` tag and its release on [GitHub Releases](https://github.com/mk3008/alder/releases). Installing a development branch requires recording its resolved commit. A candidate PR may keep the last verified installation tag while its package changes are reviewed. Publication requires the final documentation and installation commands to match the selected version.

## Compatibility identifiers

Product versions do not replace independently consumed contracts:

- Business Graph JSON retains integer `version: 1`, its documented shape and the opt-in Markdown profile v1. Consumers must use the graph contract, not infer it from the product version.
- The restricted drift pilot retains its own input/sidecar/report versions.
- Review knowledge v0.3 and frozen research/evaluation identifiers retain their historical meaning. Record the relevant authority revision and digest when reproducing results.

Historical method tags (`v0.6` and earlier), plugin tags, release notes and research evidence remain unchanged. They are not a parallel current product line, and no independent method v0.7 release is planned. The older numeric `v0.6` and product `0.4.3` belong to different historical sequences; comparing them does not indicate a downgrade.

## Release note review gate

Before preparing a release, compare the **last actually published** `plugin-vX.Y.Z` tag with the approved candidate commit. Use the merged PRs, their accepted results and the bundled Plugin/Skills as evidence. Commit titles and Conventional Commit prefixes (`feat:`, `fix:` or `BREAKING CHANGE`) are optional discovery hints, **not** an automatic classification of user impact or a substitute for reviewing the diff. A release number is chosen explicitly from `plugins/alder/plugin.json`; do not infer or bump major/minor/patch from commit names alone.

Before writing the public note, **audit coverage**: make a compact working inventory of major plugin-visible differences with the merged PR/source change, affected Skill or bundled tool, old behavior, new behavior, and the proposed entry or reason for omission. Review this list against the actual tag-to-candidate diff, including work that arrived through an unreleased intermediate version. Do not require a separate public inventory artifact; it can be kept in the release PR review record. Confirm that each significant addition or behavior change appears as its **own recognizable entry**, not hidden inside a generic “authoring improved” sentence. Lead with the largest user-facing change, not the last implementation step. Completeness means coverage of meaningful plugin-user changes, not a line for every commit or internal change.

For each proposed entry, identify the affected **plugin user workflow**, what the user could do before, what changes after, and whether they must update anything. Group only relevant entries under **Added / Changed / Fixed / Removed / Breaking or migration**, using Japanese `追加／変更／修正／削除／互換性` for a Japanese note; omit categories with no noteworthy change. Describe capabilities and behavior rather than work performed by maintainers. Include bundled tools and optional formats only when their change affects how the plugin is used. Keep release notes scoped to the distributed Alder plugin: exclude fixture/sample migrations, evaluation and CI counts, internal architecture and research notes, and Viewer-only UI work unless it directly affects the plugin's supported use. Link to separate technical evidence if necessary, rather than reproducing it in the notes.

Write a short, natural-language summary first, followed by concise entries; keep installation/migration instructions only when a reader needs them. Check each entry against its source PR and actual packaged behavior. Do not promise comprehension gains, full correctness, independent agents, release availability or automatic upgrades without evidence. The author prepares this from PR/commit evidence; a human reviews the rendered release note before approving the exact version.

The source Markdown retains a first `# Alder X.Y.Z` heading (optional subtitle) for identity and version validation, but GitHub Release uses **`Alder X.Y.Z` as its separate name and the source text after that H1 as its body**. The body must start with an actual summary paragraph, not another H1/H2. The publication workflow enforces this separation to avoid duplicating the title; never revise a published tag to edit prose. A release description correction after publication is a GitHub Release metadata edit and does not alter the versioned source snapshot.

## Preparing and publishing a release

1. Change the canonical sources, then publish and verify the working-branch source commit before [refreshing bundled guidance](plugin-bundling.md). Released package contents remain immutable. Change the product version when changing distributed workflow or guidance, rather than relabeling a published package.
2. Add `docs/release-notes-vX.Y.Z.md`, headed `# Alder X.Y.Z` (an optional ` — subtitle` is allowed), and apply the [release note review gate](#release-note-review-gate). The H1 is source metadata: published release body starts **after** the H1 with a reader-facing summary paragraph. A version bump alone is not a reason to release.
3. Before selecting the publication commit, align the installation commands in both READMEs and the plugin adoption guide with the candidate version. Keep wording conditional on successful publication; do not call an untagged version released. Remove transient current-release/candidate statements that would become false inside the published tag. Verify package, graph, drift and documentation checks, then obtain the required merge and release authorization for the final exact commit. Merging this preparation does not publish it.
4. After the authorized commit is on `main`, submit a release-request PR that changes only `.github/alder-release-request.json` to the approved version and full commit SHA (see below). Merging that request to `main` starts **Alder release** at the pinned target, even when the request merge is a later commit. A manual dispatch remains available and requires the exact triggering main SHA. Both paths reject mismatched version/revision or installation references, non-main publication and legacy versions. Candidate PR validation never publishes. Ordinary pushes that do not change the request never publish.
5. The workflow creates only the missing `plugin-vX.Y.Z` tag and release at that exact commit. It uses `Alder X.Y.Z` as the GitHub Release title and excludes the file H1 from the published body. It refuses to move an existing tag or rewrite an existing release. New stable product releases set GitHub **Latest** explicitly, so the historical method `v0.6` does not remain the default entry point. Existing releases are never relabeled by this workflow.
6. Verify the remote tag, release, commit and package before announcing the version as available. The tagged documentation already describes that version; do not rely on post-release edits to repair it or rewrite historical release notes.

When comparing historical entries, select the explicit `plugin-vX.Y.Z` tag rather than inferring the product version from the largest-looking number or from an older method release marked Latest.

## Release requests from Work

After receiving explicit authorization for the exact version, source commit and publication, Work can create and merge a dedicated release-request PR through the GitHub connector. No personal access token or local GitHub CLI credentials are required. Creating or merging a request is not a substitute for human release authorization; link that authorization in the PR description. Review the source changes first, then submit a request-only PR against `main`:

```json
{
  "version": "X.Y.Z",
  "revision": "<approved full 40-character commit SHA already on main>"
}
```

The request file is `.github/alder-release-request.json`. PR CI checks its syntax, target ancestry and manifest version without publishing. Its main-branch change triggers publication only after the common package, release-note and installation checks succeed. The tag targets the requested source commit, not the request merge commit. The requested source must already belong to main history before that push. Release-job write permission is limited to `contents: write`; validation jobs remain read-only. Existing tags and releases are not moved or overwritten. A failed run can be retried through Actions, or by an explicitly authorized request-only PR that changes the request file again while keeping the same target; the existing tag checks still apply.

After merging, Work checks the actual workflow run, tag resolution, GitHub Release body and Latest version before recording completion. A merged request alone is not proof of publication. Viewer publication remains a separate operation. If the connector cannot edit workflow files or merge the infrastructure PR, report that capability boundary without claiming the release ran.
