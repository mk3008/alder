# Alder 0.4.4 — Unified product versioning

## Changes

- Use one Alder product version, shared with the plugin manifest. One `plugin-vX.Y.Z` tag fixes documentation, source and the plugin. The existing prefix preserves installation compatibility.
- Align bundled adoption and graph guidance with the published capabilities. Report the installed manifest version instead of hard-coded skill version strings.
- Replace the independent method release path with an explicitly dispatched, version-and-commit-checked product release. Newly authorized stable releases become GitHub Latest; existing releases and tags remain untouched.

- Distribute Alder under the MIT License, including the plugin and each installed Skill.

## Compatibility and migration

Installations pinned to `plugin-v0.4.3` remain unchanged. This version changes distributed guidance and version reporting, which requires a new package identity; it is not a release solely to change a number. Before publication, test only at a reviewed development commit and record that commit. Update stable installation links only after publication is verified.

The historical method `v0.6` kept Check Item drafting optional. The current standard workflow requires Check Item design and human review before implementation; it includes the design, optional Problem-driven improvement, and realization/review loops. These capabilities, the graph exporter and the restricted drift pilot were already included in Plugin 0.4.0 and later, rather than awaiting a separate method v0.7 release.

Business Graph JSON remains v1. The current exporter and its bundled script are unchanged. The older source validator at `plugin-v0.1.0` rejects optional `problem` / `pain_level` fields even though it reports v1; use the exporter from `plugin-v0.2.8` or a later compatible revision for graphs containing that pair. Existing graph names/IDs, Check IDs, human review states and drift formats are not migrated. Review knowledge v0.3 and historical research identifiers remain intact.

## Validation limits

Package, contract and mocked publication checks establish distribution consistency and bounded workflow behavior. They do not establish real-client routing or agent-driven script execution. The earlier 0.2.8 client evidence remains limited to its tested workflows. No business agreement or general quality improvement follows from a package check.
