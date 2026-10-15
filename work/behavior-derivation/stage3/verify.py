"""Stage-three integrity checks; semantic judgments remain in stage3.md."""
from pathlib import Path
import hashlib
import json
import re
import subprocess

ROOT = Path(__file__).resolve().parents[3]
BASE = ROOT / 'work/behavior-derivation/stage3'
manifest = json.loads((BASE / 'records/manifest.json').read_text())
digest = lambda path: hashlib.sha256((ROOT / path).read_bytes()).hexdigest()
for path, expected in manifest['sha256'].items():
    assert digest(path) == expected, path
# Preserve all prior raw evidence, including verification logs.
paths = subprocess.check_output(['git', 'ls-tree', '-r', '--name-only', manifest['base_revision'], 'work/behavior-derivation'], cwd=ROOT, text=True).splitlines()
for path in paths:
    original = subprocess.check_output(['git', 'show', f"{manifest['base_revision']}:{path}"], cwd=ROOT)
    assert (ROOT / path).read_bytes() == original, path
counts = {}
fields = ['対象業務', '条件・契機・入力', '期待する結果（観測対象）', '起きてはいけないこと', '根拠', '導出分類', '確度', '人間レビュー']
for run in manifest['runs']:
    name, source = run['case'], run['input']
    text = (BASE / f'outputs/{name}.md').read_text()
    blocks = re.findall(r'^### (\S*\d+) — ([\s\S]*?)(?=^#{1,3} |\Z)', text, re.M)
    assert blocks and len({key for key, _ in blocks}) == len(blocks)
    nlines = len((ROOT / source).read_text().splitlines())
    totals = {'items': len(blocks), '明示': 0, '強い導出': 0, '要確認': 0, '優先': 0}
    for key, block in blocks:
        values = {}
        for field in fields:
            match = re.search(r'^- ' + re.escape(field) + r': (.+)$', block, re.M)
            assert match, (key, field)
            values[field] = match.group(1)
        assert values['導出分類'] in ('明示', '強い導出', '要確認')
        totals[values['導出分類']] += 1
        assert values['確度'] in ('高', '要精査')
        assert values['人間レビュー'] in ('通常', '優先')
        totals['優先'] += values['人間レビュー'] == '優先'
        if values['導出分類'] == '要確認':
            assert '未確定' in values['期待する結果（観測対象）']
            assert values['確度'] == '要精査' and values['人間レビュー'] == '優先'
        refs = [n for group in re.findall(r'([0-9・–〜～,、 -]+)行', values['根拠']) for n in re.findall(r'\d+', group)]
        assert refs and all(1 <= int(n) <= nlines for n in refs), (key, refs)
    counts[name] = totals
print(json.dumps({'integrity': 'PASS', 'prior_evidence_unchanged': len(paths), 'counts': counts}, ensure_ascii=False, indent=2))
