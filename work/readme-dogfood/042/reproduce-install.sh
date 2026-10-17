#!/usr/bin/env bash
set -euo pipefail

# Run only in a disposable test environment. This never uses the normal Codex home.
out="${1:-$(mktemp -d)}"
mkdir -p "$out/home" "$out/evidence"
out="$(cd "$out" && pwd)"
export CODEX_HOME="$out/home"

codex --version | tee "$out/evidence/version.txt"
codex plugin marketplace add mk3008/alder --ref plugin-v0.4.2 | tee "$out/evidence/marketplace.txt"
codex plugin add alder@alder-development --json | tee "$out/evidence/install.json"
codex plugin list --json | tee "$out/evidence/list.json"
git -C "$CODEX_HOME/.tmp/marketplaces/alder-development" rev-parse HEAD | tee "$out/evidence/source.txt"
test "$(cat "$out/evidence/source.txt")" = 6d30b93abf8ecdc8902fef5c16bfb53fda8617e9

python - "$CODEX_HOME" <<'PY'
import hashlib
import pathlib
import sys

home = pathlib.Path(sys.argv[1])
source = home / '.tmp/marketplaces/alder-development/plugins/alder'
cache = home / 'plugins/cache/alder-development/alder/0.4.2'

def hashes(root):
    return {str(path.relative_to(root)): hashlib.sha256(path.read_bytes()).hexdigest()
            for path in root.rglob('*') if path.is_file()}

a, b = hashes(source), hashes(cache)
assert a == b, 'Installed cache differs from the public tag'
assert len(list(cache.glob('skills/*/SKILL.md'))) == 10
print(f'{len(a)} package files match; 10 Skills present')
PY

printf '\nThis checks isolated CLI distribution/install only. Desktop UI and fresh model routing are separate tests.\n'
