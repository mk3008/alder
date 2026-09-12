"""Derive inspectable evidence and observations from an append-only attempt log."""
import json,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
name=sys.argv[1] if len(sys.argv)>1 else 'run-001.json'
assert Path(name).name==name
record=json.loads((ROOT/'records/attempts'/name).read_text())
assert record['passed'], 'Cannot summarize a failing diagnostic as successful'
evidence=json.loads(record['commands'][0]['stdout'])
observations=[json.loads(line[2:]) for line in record['commands'][-1]['stdout'].splitlines() if line.startswith('# {')]
print(json.dumps({'source_attempt':'records/attempts/'+name,'evidence':evidence,'test_boundary_observations':observations,'note':'Deterministic extraction of saved outputs; not another execution or independent sample.'},indent=2))
