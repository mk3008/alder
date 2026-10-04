# Isolated Codex CLI installation smoke test

2026-10-04. Codex CLI 0.159.2, Linux, Python 3.12.14. This test used a temporary CODEX_HOME and the local release-candidate marketplace. It did not change the user's account, desktop installation or normal Codex configuration. It did not test remote-tag download or automatic natural-language Skill selection.

Commands (replace `<checkout>` with the candidate repository path):

```sh
mkdir -p /tmp/alder-plugin-install-smoke
CODEX_HOME=/tmp/alder-plugin-install-smoke codex plugin marketplace add <checkout> --json
CODEX_HOME=/tmp/alder-plugin-install-smoke codex plugin add alder@alder-development --json
CODEX_HOME=/tmp/alder-plugin-install-smoke codex plugin list --json
```

Observed:
- marketplace `alder-development` added successfully from the local source.
- `alder@alder-development` version `0.4.0` installed to the isolated cache.
- Plugin list reported `installed: true`, `enabled: true`, install policy `AVAILABLE`.
- The installed cache contained all ten Skills; 44 package files matched the candidate source byte-for-byte.
- Executing the cached `alder-export-business-graph/scripts/export.py` on `business-design/alder/README.md` produced bytes identical to `business-design/alder/graph.generated.json`.

The CLI warned that it would not create PATH helper binaries beneath a temporary CODEX_HOME; all marketplace/install/list commands returned success and package contents were available. The warning did not prevent this bounded install test.

This establishes compatibility of the local package and marketplace metadata with this CLI version. It does not establish desktop/mobile installation, GitHub tag retrieval, client routing, or agent-driven script execution. Those claims remain separate from publishing the fixed tag.
