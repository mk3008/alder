"""Verify frozen input/source hashes and rerun every captured stage in temp dirs."""
import hashlib
import json
import shutil
import subprocess
import tempfile
from pathlib import Path
from measure import measure

ROOT = Path(__file__).resolve().parents[1]
frozen = json.loads((ROOT / 'records/frozen-inputs.json').read_text())
for name, expected in frozen.items():
    assert hashlib.sha256((ROOT / name).read_bytes()).hexdigest() == expected, f'Frozen input changed: {name}'
settings = json.loads((ROOT / 'records/execution-settings.json').read_text())
assert hashlib.sha256((ROOT / 'tools/check.py').read_bytes()).hexdigest() == settings['check_script_sha256']
measurements = measure()
assert measurements == json.loads((ROOT / 'records/measurements.json').read_text()), 'Saved measurements differ from recomputation'
source_hunks = {h['id']: h for h in measurements['hunks'] if h['category'] == 'production'}
classified = json.loads((ROOT / 'records/classification.json').read_text())['entries']
assert len(classified) == len(source_hunks)
assert {e['hunk_id'] for e in classified} == source_hunks.keys(), 'Incomplete classification ledger'
for entry in classified:
    hunk = source_hunks[entry['hunk_id']]
    assert entry['classification'] in 'RMDX' and entry['churn'] == hunk['added'] + hunk['deleted']
results = []
for manifest_path in sorted((ROOT / 'runs').glob('*/*/manifest.json')):
    snapshot = manifest_path.parent
    manifest = json.loads(manifest_path.read_text())
    actual = {str(p.relative_to(snapshot / 'source')): hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted((snapshot / 'source').rglob('*')) if p.is_file()}
    assert actual == manifest['source_sha256'], f'Source changed: {snapshot}'
    with tempfile.TemporaryDirectory() as directory:
        work = Path(directory)
        shutil.copytree(snapshot / 'source', work, dirs_exist_ok=True)
        shutil.copyfile(ROOT / f"gates/{manifest['stage']}.test.mjs", work / 'acceptance.test.mjs')
        shutil.copyfile(ROOT / 'tools/check.py', work / 'check.py')
        run = subprocess.run(['python3', 'check.py'], cwd=work, capture_output=True, text=True)
        results.append({'arm': manifest['arm'], 'stage': manifest['stage'], 'exit_code': run.returncode, 'stdout': run.stdout, 'stderr': run.stderr})
print(json.dumps({'hashes_verified': True, 'results': results}, indent=2))
raise SystemExit(0 if results and all(r['exit_code'] == 0 for r in results) else 1)
