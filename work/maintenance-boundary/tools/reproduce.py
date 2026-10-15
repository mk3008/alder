"""Verify frozen artifacts and replay all eight snapshots without model calls."""
import hashlib,json,shutil,subprocess,tempfile
from pathlib import Path
from measure import measure
ROOT=Path(__file__).resolve().parents[1]
REPO=ROOT.parents[1]
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
for name,expected in json.loads((ROOT/'records/frozen-inputs.json').read_text()).items():
 assert digest(ROOT/name)==expected, f'Frozen input changed: {name}'
first=json.loads((ROOT/'records/first-experiment-freeze.json').read_text())
actual={str(p.relative_to(REPO)):digest(p) for d in ['docs/maintenance-cost','work/maintenance-cost'] for p in sorted((REPO/d).rglob('*')) if p.is_file() and '__pycache__' not in p.parts}
assert first['files']==actual, 'First experiment changed'
measurements=measure()
assert measurements==json.loads((ROOT/'records/measurements.json').read_text())
hunks={h['id']:h for h in measurements['hunks'] if h['category']=='production'}
entries=json.loads((ROOT/'records/classification.json').read_text())['entries']
assert len(entries)==len(hunks) and {e['hunk_id'] for e in entries}==hunks.keys()
for e in entries:
 assert e['classification'] in 'RMDX' and e['churn']==hunks[e['hunk_id']]['added']+hunks[e['hunk_id']]['deleted']
results=[]
for arm in 'ABCD':
 for stage in ['S0','S1']:
  snap=ROOT/f'runs/{arm}/{stage}';manifest=json.loads((snap/'manifest.json').read_text())
  assert manifest['source_sha256']=={str(p.relative_to(snap/'source')):digest(p) for p in sorted((snap/'source').rglob('*')) if p.is_file()}
  with tempfile.TemporaryDirectory() as directory:
   work=Path(directory);shutil.copytree(snap/'source',work,dirs_exist_ok=True)
   shutil.copyfile(ROOT/f'gates/{stage}.test.mjs',work/'acceptance.test.mjs');shutil.copyfile(ROOT/'tools/check.py',work/'check.py')
   run=subprocess.run(['python3','check.py'],cwd=work,text=True,capture_output=True)
   checks=[json.loads(p.read_text()) for p in sorted((work/'.audit').glob('*.json'))]
   results.append({'arm':arm,'stage':stage,'exit_code':run.returncode,'stdout':run.stdout,'stderr':run.stderr,'checks':checks})
print(json.dumps({'first_experiment_unchanged':True,'hashes_verified':True,'results':results},indent=2))
raise SystemExit(0 if len(results)==8 and all(r['exit_code']==0 for r in results) else 1)
