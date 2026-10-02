#!/usr/bin/env python3
"""Measure captured before/after artifacts; never mutate experiment outputs."""
from pathlib import Path
from datetime import datetime
import hashlib, json, difflib

base = Path(__file__).resolve().parent
def dt(s):
    return datetime.fromisoformat(s.replace('Z', '+00:00'))
result = {'kind': 'post-hoc exploratory one-change observation', 'arms': {}}
for arm in ['alder', 'rdra']:
    root = base / arm
    before = {str(p.relative_to(root/'before')): p.read_bytes() for p in (root/'before').rglob('*') if p.is_file()}
    after = {str(p.relative_to(root/'after')): p.read_bytes() for p in (root/'after').rglob('*') if p.is_file()}
    assert after, f'missing final {arm} output'
    changes = []
    for name in sorted(before.keys() | after.keys()):
        old, new = before.get(name, b''), after.get(name, b'')
        if old == new:
            continue
        diff = list(difflib.unified_diff(old.decode().splitlines(), new.decode().splitlines(), fromfile='before/'+name, tofile='after/'+name, lineterm=''))
        added = [x[1:] for x in diff if x.startswith('+') and not x.startswith('+++')]
        removed = [x[1:] for x in diff if x.startswith('-') and not x.startswith('---')]
        changes.append({'path': name, 'before_bytes': len(old), 'after_bytes': len(new),
                        'before_sha256': hashlib.sha256(old).hexdigest(), 'after_sha256': hashlib.sha256(new).hexdigest(),
                        'added_lines': len(added), 'deleted_lines': len(removed),
                        'added_utf8_bytes_including_lf': sum(len((x+'\n').encode()) for x in added),
                        'deleted_utf8_bytes_including_lf': sum(len((x+'\n').encode()) for x in removed),
                        'diff': '\n'.join(diff)+'\n'})
    meta = json.loads((root/'evidence/metadata.json').read_text())
    def artifact_name(path):
        marker = '/change-run/'+arm+'/'
        name = path.split(marker, 1)[-1]
        return name if name in before or name in after else None
    targets = sorted({n for p in meta['update_target_paths'] if (n:=artifact_name(p))})
    checks = sorted({n for p in meta.get('consistency_checked_paths', meta.get('checked_paths', [])) if (n:=artifact_name(p))})
    checks_actual = sorted({n for p in meta.get('read_artifact_paths',[]) if (n:=artifact_name(p))})
    output = {'before_file_count': len(before), 'after_file_count': len(after),
              'before_total_bytes': sum(map(len,before.values())), 'after_total_bytes': sum(map(len,after.values())),
              'changed_file_count': len(changes), 'update_target_count_self_reported': len(targets),
              'update_targets_self_reported': targets, 'consistency_checked_count_self_reported': len(checks),
              'consistency_checked_self_reported': checks, 'read_artifact_count_self_reported': len(checks_actual),
              'read_artifacts_self_reported': checks_actual,
              'added_lines': sum(x['added_lines'] for x in changes), 'deleted_lines': sum(x['deleted_lines'] for x in changes),
              'added_utf8_bytes_including_lf': sum(x['added_utf8_bytes_including_lf'] for x in changes),
              'deleted_utf8_bytes_including_lf': sum(x['deleted_utf8_bytes_including_lf'] for x in changes),
              'start_utc': meta['start_utc'], 'end_utc': meta['end_utc'],
              'wall_seconds_including_interruptions': (dt(meta['end_utc'])-dt(meta['start_utc'])).total_seconds(),
              'changes': changes}
    result['arms'][arm] = output
    (root/'DIFF.patch').write_text('\n'.join(x['diff'] for x in changes))
(base/'change-metrics.json').write_text(json.dumps(result, ensure_ascii=False, indent=2)+'\n')
print(json.dumps({k:{f:v for f,v in val.items() if f!='changes'} for k,val in result['arms'].items()}, ensure_ascii=False, indent=2))
