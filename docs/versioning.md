# Alder versions and releases

Alder has one user-facing product version: **Alder X.Y.Z**. Its source of truth is `plugins/alder/plugin.json`. A published `plugin-vX.Y.Z` tag fixes the documentation, source, marketplace and plugin together. The existing tag prefix is retained so installation commands and pinned references keep working; do not create a parallel `vX.Y.Z` product tag.

A manifest version on a branch identifies the package content; it does not prove that a release exists. For installation, verify the selected `plugin-vX.Y.Z` tag and its release on [GitHub Releases](https://github.com/mk3008/alder/releases). Installing a development branch requires recording its resolved commit. A candidate PR may keep the last verified installation tag while its package changes are reviewed. Publication requires the final documentation and installation commands to match the selected version.

## Compatibility identifiers

Product versions do not replace independently consumed contracts:

- Business Graph JSON retains integer `version: 1`, its documented shape and the opt-in Markdown profile v1. Consumers must use the graph contract, not infer it from the product version.
- The restricted drift pilot retains its own input/sidecar/report versions.
- Review knowledge v0.3 and frozen research/evaluation identifiers retain their historical meaning. Record the relevant authority revision and digest when reproducing results.

Historical method tags (`v0.6` and earlier), plugin tags, release notes and research evidence remain unchanged. They are not a parallel current product line, and no independent method v0.7 release is planned. The older numeric `v0.6` and product `0.4.3` belong to different historical sequences; comparing them does not indicate a downgrade.

## Preparing and publishing a release

1. Change the canonical sources, then publish and verify the working-branch source commit before [refreshing bundled guidance](plugin-bundling.md). Released package contents remain immutable. Change the product version when changing distributed workflow or guidance, rather than relabeling a published package.
2. Add `docs/release-notes-vX.Y.Z.md`, headed `# Alder X.Y.Z` (an optional ` — subtitle` is allowed). Describe substantive changes, compatibility and validation limits. A version bump alone is not a reason to release.
3. Before selecting the publication commit, align the installation commands in both READMEs and the plugin adoption guide with the candidate version. Keep wording conditional on successful publication; do not call an untagged version released. Remove transient current-release/candidate statements that would become false inside the published tag. Verify package, graph, drift and documentation checks, then obtain the required merge and release authorization for the final exact commit. Merging this preparation does not publish it.
4. After the authorized commit is on `main`, manually dispatch **Alder release** with the manifest version and full approved commit SHA. The workflow rejects mismatched version/revision or installation references, a non-main invocation and legacy version numbers. Candidate PR validation permits last-verified installation references; dispatch does not. It does not run publication on push or PR events.
5. The workflow creates only the missing `plugin-vX.Y.Z` tag and release at that exact commit. It refuses to move an existing tag or rewrite an existing release. New stable product releases set GitHub **Latest** explicitly, so the historical method `v0.6` does not remain the default entry point. Existing releases are never relabeled by this workflow.
6. Verify the remote tag, release, commit and package before announcing the version as available. The tagged documentation already describes that version; do not rely on post-release edits to repair it or rewrite historical release notes.

When comparing historical entries, select the explicit `plugin-vX.Y.Z` tag rather than inferring the product version from the largest-looking number or from an older method release marked Latest.
