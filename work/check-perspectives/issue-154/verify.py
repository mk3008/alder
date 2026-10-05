#!/usr/bin/env python3
"""Recompute evidence integrity; this does not judge business meaning."""
from pathlib import Path
import hashlib,json,re
R=Path(__file__).resolve().parent
m=json.loads((R/'manifest.json').read_text())
for p,h in m['files'].items():
    assert hashlib.sha256((R/p).read_bytes()).hexdigest()==h, f'frozen input changed: {p}'
key=json.loads((R/'records/blinding-key.json').read_text())
metrics=json.loads((R/'records/raw-metrics.json').read_text())
scores=json.loads((R/'evaluation/masked-scores.json').read_text())
total=0
for masked,raw in key.items():
    case,label=masked.rsplit('-',1)
    s=(R/'raw'/f'{raw}.md').read_text()
    ids=[line.split('|')[1].strip() for line in s.splitlines() if line.startswith('| ') and '未レビュー' in line]
    assert len(ids)==len(set(ids)),raw
    metric=metrics[raw]
    assert metric['unicode_characters']==len(s)
    assert metric['check_count']==len(ids)
    assert metric['sha256']==hashlib.sha256((R/'raw'/f'{raw}.md').read_bytes()).hexdigest()
    masked_s=re.sub(r'prompts/(?:purchase-request|facilities-maintenance)-(?:control|treatment)\.md','prompts/assigned.md',s)
    assert masked_s==(R/'evaluation/blinded'/f'{masked}.md').read_text()
    items=scores['items'][case][label]
    assert set(ids)=={i['id'] for i in items if i['kind']=='check'}
    assert len(items)==len({i['id'] for i in items})
    assert all(i['category'] in {'direct','same-meaning-view','business-question','implementation-detail','duplicate-noise','unsupported'} for i in items)
    total+=len(items)
assert total==107,total
json.loads((R/'evaluation/masked-corrections.json').read_text())
for f in R.rglob('*.md'):
    # Private Control Plane or Slack details do not belong in public research files.
    assert 'github.com/mk3008/root/' not in f.read_text(),f
    assert 'C0C63T56P1V' not in f.read_text(),f
print('PASS: 11 frozen files, 4 immutable raw outputs, 104 Check IDs + 3 questions, masked transform, corrections JSON, private-link guard')
