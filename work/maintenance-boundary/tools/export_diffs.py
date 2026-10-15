"""Export reviewable stage patches and per-file numstats from saved snapshots."""
import difflib
import json
from pathlib import Path
from measure import ROOT, STAGES, files, measure

out = ROOT / 'diffs'
out.mkdir(exist_ok=True)
for arm in 'ABCD':
    old = {}
    for stage in STAGES:
        source = ROOT / 'runs' / arm / stage / 'source'
        if not source.exists():
            break
        new = files(source)
        if stage != 'S0':
            patch = []
            for name in sorted(old.keys() | new.keys()):
                patch.extend(difflib.unified_diff(old.get(name, []), new.get(name, []), fromfile='before/' + name, tofile='after/' + name))
            (out / f'{arm}-{stage}.patch').write_text(''.join(patch))
        old = new
summary = {}
for h in measure()['hunks']:
    key = (h['arm'], h['stage'], h['path'])
    row = summary.setdefault(key, {'arm': h['arm'], 'stage': h['stage'], 'path': h['path'], 'category': h['category'], 'added': 0, 'deleted': 0})
    row['added'] += h['added']
    row['deleted'] += h['deleted']
(out / 'numstat.json').write_text(json.dumps(list(summary.values()), indent=2) + '\n')
print('Exported stage patches and per-file numstats.')
