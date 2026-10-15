"""Freeze a finished arm/stage; never alter implementation sources."""
import hashlib
import json
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
arm, stage = sys.argv[1:3]
assert arm in 'ABCD' and stage in ['S0', 'S1']
workspace = ROOT.parents[2] / ('boundary-' + arm.lower())
destination = ROOT / 'runs' / arm / stage
assert not destination.exists(), 'Snapshots are immutable; choose a correction-attempt path explicitly.'
for local, original in [('REQUEST.md', f'prompts/{arm}-{stage}.md'), ('acceptance.test.mjs', f'gates/{stage}.test.mjs'), ('check.py', 'tools/check.py')]:
    assert (workspace / local).read_bytes() == (ROOT / original).read_bytes(), f'evaluator file changed: {local}'
assert (workspace / 'REPORT.md').is_file()
destination.mkdir(parents=True)
source = destination / 'source'
source.mkdir()
for path in sorted(workspace.rglob('*')):
    rel = path.relative_to(workspace)
    if not path.is_file() or '.audit' in rel.parts or '__pycache__' in rel.parts or rel.parts[0] in ['REQUEST.md', 'acceptance.test.mjs', 'check.py', 'REPORT.md']:
        continue
    target = source / rel
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(path, target)
shutil.copyfile(workspace / 'REPORT.md', destination / 'report.md')
shutil.copytree(workspace / '.audit', destination / 'agent-checks')
# Separate evaluator verification from the agent's saved attempts.
result = subprocess.run(['python3', 'check.py'], cwd=workspace, text=True, capture_output=True)
latest = sorted((workspace / '.audit').glob('check-*.json'))[-1]
shutil.copyfile(latest, destination / 'evaluator-check.json')
metadata = {'arm': arm, 'stage': stage, 'frozen_at': datetime.now(timezone.utc).isoformat(), 'evaluator_exit_code': result.returncode, 'evaluator_stdout': result.stdout, 'evaluator_stderr': result.stderr, 'source_sha256': {str(p.relative_to(source)): hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(source.rglob('*')) if p.is_file()}}
(destination / 'manifest.json').write_text(json.dumps(metadata, indent=2) + '\n')
print(json.dumps(metadata))
raise SystemExit(result.returncode)
