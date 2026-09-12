"""Replay frozen diagnostics and append a raw attempt log, never overwrite one."""
from pathlib import Path
import hashlib,json,subprocess,sys
from datetime import datetime,timezone
ROOT=Path(__file__).resolve().parents[1]
REPO=ROOT.parents[1]
freeze=json.loads((ROOT/'records/diagnostic-freeze.json').read_text())
for name,sha in freeze['files'].items():assert hashlib.sha256((REPO/name).read_bytes()).hexdigest()==sha,f'Diagnostic input changed: {name}'
attempts=ROOT/'records/attempts';attempts.mkdir(exist_ok=True)
number=len(list(attempts.glob('run-*.json')))+1
out=attempts/f'run-{number:03}.json';assert not out.exists()
record={'started_at':datetime.now(timezone.utc).isoformat(),'commands':[]}
commands=[['python3','work/maintenance-risk-review/tools/evidence.py'],['node','--check','work/maintenance-risk-review/tools/test-boundary.test.mjs'],['node','--test','--test-reporter=tap','work/maintenance-risk-review/tools/test-boundary.test.mjs']]
for command in commands:
 run=subprocess.run(command,cwd=REPO,text=True,capture_output=True)
 record['commands'].append({'argv':command,'exit_code':run.returncode,'stdout':run.stdout,'stderr':run.stderr})
record['finished_at']=datetime.now(timezone.utc).isoformat();record['passed']=all(c['exit_code']==0 for c in record['commands'])
out.write_text(json.dumps(record,indent=2)+'\n')
print(json.dumps({'attempt':str(out.relative_to(REPO)),'passed':record['passed']}))
for c in record['commands']:
 if c['exit_code']:print(c['stdout'],c['stderr'])
raise SystemExit(0 if record['passed'] else 1)
