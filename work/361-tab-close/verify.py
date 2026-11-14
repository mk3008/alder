"""Read-only reconciliation against the pre-implementation commit; no baseline regeneration."""
import copy
import hashlib
import json
import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
PIN = '4dc8f2a4'
MANIFEST = 'work/361-tab-close/frozen.json'

def original(path):
    return subprocess.check_output(['git', 'show', f'{PIN}:{path}'], cwd=ROOT)

def digest(data):
    return hashlib.sha256(data).hexdigest()

frozen_bytes = original(MANIFEST)
frozen = json.loads(frozen_bytes)

def invariants(authorities):
    assert (ROOT / MANIFEST).read_bytes() == frozen_bytes, 'frozen inventory changed'
    for path, expected in frozen['files'].items():
        assert digest((ROOT / path).read_bytes()) == expected, path
    for path, authority in frozen['authorities'].items():
        assert digest(authorities[path]) == authority['sha256'], path
    old = original('web-viewer/web/test-tab-strip-browser.mjs')
    current = (ROOT / 'web-viewer/web/test-tab-strip-browser.mjs').read_bytes()
    current = current.replace(b"import {verifyTabClose} from './test-tab-close-browser.mjs';\n", b'', 1)
    current = current.replace(b'  await verifyTabClose(browser);\n', b'', 1)
    assert old == current, 'existing tabStrip assertions changed'

def coverage(rows):
    required = {(check['id'], case) for a in frozen['authorities'].values()
                for check in a['checks'] for case in check.get('cases', ['default'])}
    observed = [(row['id'], row['case']) for row in rows]
    assert len(observed) == len(set(observed)), 'duplicate result'
    assert set(observed) == required, f'coverage mismatch: {required-set(observed)} / {set(observed)-required}'
    assert all(row['status'] == 'pass' and row.get('evidence') for row in rows), 'missing/failed evidence'
    return len(required)

def rejects(fn):
    try:
        fn()
    except AssertionError:
        return True
    raise AssertionError('negative example incorrectly accepted')

authorities = {p: (ROOT / p).read_bytes() for p in frozen['authorities']}
invariants(authorities)
rows = json.loads(pathlib.Path(sys.argv[1]).read_text())['results']
total = coverage(rows)
for mutation in ['id-deletion', 'case-deletion']:
    changed = copy.deepcopy(authorities)
    path = 'work/361-tab-close/acceptance.json'
    data = json.loads(changed[path])
    if mutation == 'id-deletion':
        data['checks'].pop()
    else:
        data['checks'][0]['cases'].pop()
    changed[path] = json.dumps(data).encode()
    rejects(lambda: invariants(changed))
rejects(lambda: coverage(rows[:-1]))
print(json.dumps({'protectedFiles': len(frozen['files']), 'checks': sum(len(a['checks']) for a in frozen['authorities'].values()), 'cases': total, 'bytesUnchanged': True, 'negativeExamples': ['id-deletion', 'case-deletion', 'result-omission'], 'candidate': subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT).decode().strip()}))
