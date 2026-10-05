# Alder Plugin 0.4.3 — Portable adoption references

This patch packages the reference fixes from [PR #150](https://github.com/mk3008/alder/pull/150):

- Business Design authoring now explicitly reads the document-structure guide already bundled with the Business Design review Skill. The required local link resolves inside an installed package without an Alder source checkout.
- The adoption guide's repository navigation, examples and further reading use immutable source URLs instead of paths that break in flattened Skill bundles. Further reading requires web access; the required authoring, structure and graph guidance stays local.
- The three adoption-bearing Skills carry byte-identical canonical guidance with source-commit and digest records. A reproducible exporter and regression checks verify the recorded source, direct adoption links and authoring's installed-package references.

The package retains the same ten Skills and plugin identity. The intake clarification introduced in 0.4.1 and the combined implementation-review/record-follow-up route introduced in 0.4.2 remain included. This patch does not change their write boundaries or add a new workflow.

## Install

```sh
codex plugin marketplace add mk3008/alder --ref plugin-v0.4.3
codex plugin marketplace list
```

Install or refresh Alder from the configured marketplace and start a new chat. See [the Plugin guide](https://github.com/mk3008/alder/blob/plugin-v0.4.3/docs/plugin-adoption.md) for setup and supported workflows.

## Requirements and validation limits

Reference checks cover all direct links in the changed adoption guide, authoring's required local links in an isolated package, and reproduction of the three adoption-bearing Skills from their pinned source commits. They do not establish recursive link closure for unchanged graph/structure guides or unrelated Skills. See [reference reproduction and scope](https://github.com/mk3008/alder/blob/plugin-v0.4.3/docs/plugin-bundling.md).

Real-client automatic routing of all ten Skills, the combined review/follow-up route and agent-driven script execution remain unverified. The combined route still requires a separate agent or Fresh context and performs no combined-workflow writes if that review stage is unavailable. Graph export and the restricted drift pilot still require local Python 3.12+ execution. Tests and source digests do not approve business meaning, attest effective model settings, or establish real-user effort reduction.

Alder method releases and review knowledge v0.3 retain their separate versions. Existing release tags and historical validation records remain unchanged.
