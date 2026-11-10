"""Separate, read-only checks against the pinned requirements and source bytes."""
import copy
import hashlib
import json
import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
PIN = '4d267b5f7f6cbbc8b39039b950fa7671e8dea95b'
MANIFEST = 'work/361-review-hypotheses/frozen.json'

def git(*args):
    return subprocess.check_output(['git', *args], cwd=ROOT)

def original(path):
    return git('show', f'{PIN}:{path}')

def digest(data):
    return hashlib.sha256(data).hexdigest()

frozen_bytes = original(MANIFEST)
frozen = json.loads(frozen_bytes)

def expected_test(path):
    text = original(path).decode()
    if pathlib.Path(path).name in ['test-structure-explorer-class-attributes.mjs', 'test-structure-explorer-sample-header.mjs', 'test-structure-review-feedback.mjs', 'test-structure-explorer-sample-header-browser.mjs']:
        text = text.replace("'用途'", "'使用目的'").replace("'用途：", "'使用目的：")
    adapter = "for(const item of snapshot.cases)item.full=item.full.replaceAll(' | 用途',' | 使用目的').replaceAll('\\n用途：','\\n使用目的：');\n"
    comment = '// Only the explicitly renamed UI caption differs from the frozen payload.\n'
    if path.endswith('/test-structure-copy-heading.mjs'):
        text = "import './test-structure-review-hypotheses.mjs';\n" + text
        text = text.replace('const model=', comment + adapter + 'const model=', 1)
    if path.endswith('/test-structure-copy-heading-browser.mjs'):
        text = text.replace(" const out='web/evidence/structure-copy-heading';", ' ' + comment + ' ' + adapter + " const out='web/evidence/structure-copy-heading';")
    if path.endswith('/test-structure-explorer-sample-header-browser.mjs'):
        text = "import {verifyStructureReviewHypotheses} from './test-structure-review-hypotheses-browser.mjs';\n" + text
        text = text.replace('return {browser:browser.version(),results,beta:', 'return {browser:browser.version(),results,hypotheses:await verifyStructureReviewHypotheses(browser),beta:')
    return text.encode()

def invariants(authorities):
    assert (ROOT / MANIFEST).read_bytes() == frozen_bytes, 'frozen inventory changed'
    for path, expected in frozen['protected'].items():
        assert digest((ROOT / path).read_bytes()) == expected, path
    for path, record in frozen['authorities'].items():
        assert digest(authorities[path]) == record['sha256'], path
    changed_tests = []
    for path, expected in frozen['existingTests'].items():
        current = (ROOT / path).read_bytes()
        if digest(current) != expected:
            assert current == expected_test(path), f'old assertion changed: {path}'
            changed_tests.append(path)
    css = (ROOT / 'web-viewer/src/viewer-shell.css').read_bytes()
    assert css.startswith(original('web-viewer/src/viewer-shell.css')), 'prior hover/copy CSS changed'
    allowed = set(frozen['allowedProductFiles']) | set(changed_tests) | {
        'web-viewer/src/structure-review-candidates.ts',
        'web-viewer/web/test-structure-review-hypotheses.mjs',
        'web-viewer/web/test-structure-review-hypotheses-browser.mjs'}
    for path in git('diff', '--name-only', PIN).decode().splitlines():
        assert path in allowed or path.startswith('work/361-review-hypotheses/'), f'outside scope: {path}'
    return changed_tests

def coverage(rows):
    required = {(c['id'], case) for a in frozen['authorities'].values() for c in a['checks'] for case in c['cases']}
    actual = [(r['id'], r['case']) for r in rows]
    assert len(actual) == len(set(actual)), 'duplicate result'
    assert set(actual) == required, f'missing/unknown results: {required-set(actual)} / {set(actual)-required}'
    assert all(r['status'] == 'pass' and r.get('evidence') for r in rows), 'failed/pending evidence'
    return len(required)

def rejects(fn):
    try:
        fn()
    except AssertionError:
        return
    raise AssertionError('negative example incorrectly accepted')

authorities = {p: (ROOT / p).read_bytes() for p in frozen['authorities']}
changed_tests = invariants(authorities)
rows = json.loads(pathlib.Path(sys.argv[1]).read_text())['results']
total = coverage(rows)
for mode in ['id-deletion', 'case-deletion']:
    mutated = copy.deepcopy(authorities)
    path = 'work/361-review-hypotheses/acceptance.json'
    data = json.loads(mutated[path])
    if mode == 'id-deletion':
        data['checks'].pop()
    else:
        data['checks'][0]['cases'].pop()
    mutated[path] = json.dumps(data).encode()
    rejects(lambda: invariants(mutated))
rejects(lambda: coverage(rows[:-1]))
print(json.dumps({'protectedFiles': len(frozen['protected']), 'existingTests': len(frozen['existingTests']), 'captionAndIntegrationAdapters': changed_tests, 'ids': 5, 'cases': total, 'bytesUnchanged': True, 'negativeExamples': ['id-deletion', 'case-deletion', 'result-omission'], 'candidate': git('rev-parse', 'HEAD').decode().strip()}))
