# Alder versions and releases

Alder has one user-facing product version: **Alder X.Y.Z**. Its source of truth is `plugins/alder/plugin.json`. A published `plugin-vX.Y.Z` tag fixes the documentation, source, marketplace and plugin together. The existing tag prefix is retained so installation commands and pinned references keep working; do not create a parallel `vX.Y.Z` product tag.

The currently published package is [0.4.3](https://github.com/mk3008/alder/releases/tag/plugin-v0.4.3). Version 0.4.4 on the development branch is an unpublished candidate containing version-guidance and reporting changes. Installing a branch requires recording its resolved commit. Do not describe an untagged manifest version as a release or change the stable installation command before publication is verified.

## Compatibility identifiers

Product versions do not replace independently consumed contracts:

- Business Graph JSON retains integer `version: 1`, its documented shape and the opt-in Markdown profile v1. Consumers must use the graph contract, not infer it from the product version.
- The restricted drift pilot retains its own input/sidecar/report versions.
- Review knowledge v0.3 and frozen research/evaluation identifiers retain their historical meaning. Record the relevant authority revision and digest when reproducing results.

Historical method tags (`v0.6` and earlier), plugin tags, release notes and research evidence remain unchanged. They are not a parallel current product line, and no independent method v0.7 release is planned. The older numeric `v0.6` and product `0.4.3` belong to different historical sequences; comparing them does not indicate a downgrade.

## Preparing and publishing a release

1. Change the canonical sources, then publish and verify the working-branch source commit before [refreshing bundled guidance](plugin-bundling.md). Released package contents remain immutable. Change the product version when changing distributed workflow or guidance, rather than relabeling a published package.
2. Add `docs/release-notes-vX.Y.Z.md`, headed `# Alder X.Y.Z` (an optional ` — subtitle` is allowed). Describe substantive changes, compatibility and validation limits. A version bump alone is not a reason to release.
3. Verify the final commit's package, graph and drift checks and obtain the required merge and release authorization. Merging this preparation does not publish it.
4. After the authorized commit is on `main`, manually dispatch **Alder release** with the manifest version and full approved commit SHA. The workflow rejects a mismatched version/revision, a non-main invocation and legacy version numbers. It does not run publication on push or PR events.
5. The workflow creates only the missing `plugin-vX.Y.Z` tag and release at that exact commit. It refuses to move an existing tag or rewrite an existing release. New stable product releases set GitHub **Latest** explicitly, so the historical method `v0.6` does not remain the default entry point. Existing releases are never relabeled by this workflow.
6. Verify the remote tag, release, commit and package before updating stable installation links. Update the current-release statements in this guide and the adoption guide only after that verification; do not rewrite historical release notes.

Before the first unified release is authorized and published, GitHub Latest may still show the historical method v0.6. Use the explicit current package link above.
