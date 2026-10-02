#!/usr/bin/env python3
"""Read existing primary metadata only; no rerun or score mutation."""
from pathlib import Path
from datetime import datetime
import json

base = Path(__file__).resolve().parents[1]
def dt(value):
    return datetime.fromisoformat(value.replace('Z', '+00:00'))

alder = []
rdra = []
for path in sorted((base / 'primary-runs/alder').glob('*/r*/s[12]/metadata.json')):
    data = json.loads(path.read_text())
    alder.append({'path': str(path.relative_to(base)), 'start': data['started_at'], 'end': data['finished_at']})
for path in sorted((base / 'primary-runs/rdra').glob('*/r*/s[12]/manifest.json')):
    data = json.loads(path.read_text())
    for name, node in data['nodes'].items():
        rdra.append({'path': str(path.relative_to(base)), 'node': name, 'start': node['started'], 'end': node['ended']})
assert len(alder) == 20 and len(rdra) == 360
def summarize(rows):
    starts = [dt(x['start']) for x in rows]
    ends = [dt(x['end']) for x in rows]
    events = sorted([(dt(x['start']), 1) for x in rows] + [(dt(x['end']), -1) for x in rows])
    active = peak = 0
    for _, delta in events:
        active += delta
        peak = max(peak, active)
    return {'count': len(rows), 'start': min(starts).isoformat(), 'end': max(ends).isoformat(),
            'wall_seconds': (max(ends) - min(starts)).total_seconds(),
            'summed_active_seconds': sum((dt(x['end'])-dt(x['start'])).total_seconds() for x in rows),
            'max_concurrent': peak}
cutoff = max(dt(x['end']) for x in alder)
workflows = []
for path in sorted((base / 'primary-runs/rdra').glob('*/r*/s[12]/manifest.json')):
    data = json.loads(path.read_text())
    workflows.append({'path': str(path.relative_to(base)), 'last_node_end': max(dt(x['ended']) for x in data['nodes'].values()).isoformat()})
result = {'kind': 'post-hoc execution timeline observation', 'source_revision': '9098b43276f40e3c8adf62e6c8cb6194c4a528f3',
          'alder': summarize(alder), 'rdra': summarize(rdra),
          'rdra_at_alder_finish': {'nodes_started': sum(dt(x['start']) <= cutoff for x in rdra),
                                  'nodes_finished': sum(dt(x['end']) <= cutoff for x in rdra),
                                  'workflows_last_node_finished': sum(dt(x['last_node_end']) <= cutoff for x in workflows)},
          'alder_calls': alder, 'rdra_nodes': rdra, 'rdra_workflows': workflows,
          'limits': ['Agent timestamps are saved operator metadata, not independently attested runtime.',
                     'Coordinator scheduling, shared resources and scripts are not controlled.',
                     'Summed active duration is not token, credit, billing or human work time.']}
surface = []
for arm in ['alder', 'rdra']:
    for root in sorted((base / 'primary-runs' / arm).glob('C*/r*/s[12]')):
        artifact_root = root / ('docs' if arm == 'alder' else 'project')
        files = [p for p in artifact_root.rglob('*') if p.is_file() and
                 (arm == 'alder' or p.relative_to(artifact_root).parts[0] in ['0_RDRAZeroOne', '1_RDRA'])]
        surface.append({'arm': arm, 'case': root.parent.parent.name,
                        'replicate': root.parent.name, 'stage': root.name,
                        'files': len(files), 'bytes': sum(p.stat().st_size for p in files)})
result['artifact_surface'] = surface
(Path(__file__).parent / 'execution-timeline.json').write_text(json.dumps(result, ensure_ascii=False, indent=2)+'\n')
print(json.dumps({key: result[key] for key in ['alder', 'rdra', 'rdra_at_alder_finish']}, ensure_ascii=False, indent=2))
