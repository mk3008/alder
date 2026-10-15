"""Validate provenance and mapping references, not semantic entailment."""
from pathlib import Path
from collections import Counter
import ast
import hashlib
import json
import re
import subprocess

ROOT = Path(__file__).resolve().parents[2]
BASE = Path(__file__).resolve().parent
m = json.loads((BASE / 'records/manifest.json').read_text())
mp = json.loads((BASE / 'mapping.json').read_text())
for path, digest in m['sha256'].items():
    assert hashlib.sha256((ROOT / path).read_bytes()).hexdigest() == digest, path
source = {}
for path, digest in m['implementation_files'].items():
    data = subprocess.check_output(['git', 'show', f"{m['implementation_revision']}:{path}"], cwd=ROOT)
    assert hashlib.sha256(data).hexdigest() == digest
    source[path] = data.decode()
assert mp['implementation_revision'] == m['implementation_revision']
assert mp['design_revision'] == m['base_revision']
checks = set(re.findall(r'^### (MR-\d+) —', (ROOT / mp['checks_path']).read_text(), re.M))
ifs = {i['id'] for i in mp['interfaces']}
assert len(ifs) == len(mp['interfaces'])
assert {a['check'] for a in mp['assignments']} == checks
assert len(mp['assignments']) == len(checks)
for a in mp['assignments']:
    assert a['primary'] in ifs and set(a['related']) <= ifs
    assert a['primary'] not in a['related']
    if a['check'] == 'MR-09':
        assert a['approval'] == 'candidate_unapproved'

def reference(ref):
    text = source[ref['path']]
    lo, hi = ref['lines']
    assert 1 <= lo <= hi <= len(text.splitlines()), ref
    if ref['path'].endswith('.py'):
        nodes = ast.parse(text).body
        for part in ref['symbol'].split('.'):
            node = next(n for n in nodes if isinstance(n, (ast.FunctionDef, ast.ClassDef)) and n.name == part)
            nodes = node.body
        assert [node.lineno, node.end_lineno] == ref['lines'], ref

nlines = len((ROOT / mp['design_path']).read_text().splitlines())
assert len({c['id'] for c in mp['claims']}) == len(mp['claims'])
for c in mp['claims']:
    assert set(c['checks']) <= checks and set(c['interfaces']) <= ifs
    for lo, hi in c['business_lines']:
        assert 1 <= lo <= hi <= nlines
    for ref in c['implementation'] + c['tests'] + c.get('rejected_candidates', []):
        reference(ref)
    if c['status'] == 'mapped':
        assert c['implementation'] and c['tests'] and c['test_assertions'] and c['limit']
    if 'MR-09' in c['checks']:
        assert c['status'] == 'ambiguous_mapping' and c['approval'] == 'candidate_unapproved'
for r in mp['reverse_samples']:
    reference(r['code'])
    for ref in r['test']:
        reference(ref)
    assert set(r['interfaces']) <= ifs
for path in [ROOT / 'docs/adoption.md', ROOT / 'docs/research-decisions.md', *(ROOT / 'docs/functional-interface').glob('*.md')]:
    for link in re.findall(r'\]\(([^)]+)\)', path.read_text()):
        if '://' not in link and not link.startswith('#'):
            assert (path.parent / link.split('#')[0]).exists(), (path, link)
# Earlier research artifacts are immutable; only new Issue #64 work is added.
oldpaths = subprocess.check_output(['git', 'ls-tree', '-r', '--name-only', m['base_revision'], 'work/behavior-derivation'], cwd=ROOT, text=True).splitlines()
for path in oldpaths:
    assert (ROOT / path).read_bytes() == subprocess.check_output(['git', 'show', f"{m['base_revision']}:{path}"], cwd=ROOT), path
print(json.dumps({'integrity': 'PASS', 'interfaces': len(ifs), 'check_assignments': len(checks),
    'representative_claims': len(mp['claims']), 'claim_status_counts': dict(Counter(c['status'] for c in mp['claims'])),
    'related_interface_links': sum(len(a['related']) for a in mp['assignments']),
    'prior_evidence_unchanged': len(oldpaths),
    'semantic_verdict': 'manual; see docs/functional-interface/study.md; no completeness guarantee'}, ensure_ascii=False, indent=2))
