# Alder Plugin 0.4.1 — Clarify only background that can change a decision

Before drafting a proposed business change, Alder checks missing background when learning it could change whether the proposed means should be adopted. It reuses context already supplied, does not reopen settled decisions or externally fixed means, and asks whether a means is a candidate or a decision only when that distinction is unclear. Known work can still be drafted with deferrable questions left open.

This release updates the existing Authoring Skill and its pinned guidance. It keeps the ten Skills from 0.4.0; no new required artifact, field, lifecycle state or Skill is introduced. People still decide business meaning and adopt improvements.

## Install

```sh
codex plugin marketplace add mk3008/alder --ref plugin-v0.4.1
```

Restart the supported desktop client, open Plugins Directory, choose Alder development, install or refresh Alder, and start a new chat. A source release does not automatically update an already installed plugin. See the [installation guide](https://github.com/mk3008/alder/blob/plugin-v0.4.1/docs/plugin-adoption.md).

## Validation and limits

The implementation's six synthetic first responses exercised unclear means, known background, settled decisions, deferred questions, fixed external constraints and a concrete contradiction. They were generated in one fresh context, not six independent trials. Requested settings were gpt-6-sol / medium / no history; effective runtime was not independently attested. An independent source review found no blocking defect. These checks do not prove reliable routing in a desktop/chat client or universal decision quality.

Package/CLI/release-boundary tests, graph tests and drift regressions are run again on the release tree before publication. The release workflow is scoped to 0.4.1 and refuses to move an existing release tag. Public-tag installation and package-byte verification are recorded after publication in the [release verification record](https://github.com/mk3008/alder/issues/145).

Graph and restricted drift tooling still require Python 3.12+ and local script execution. The earlier 0.2.8 client-routing evidence remains limited to its tested workflows. This is a Plugin release, not Alder method v0.7 or a change to review knowledge v0.3. The immutable 0.4.0 release and its historical evidence remain available.
