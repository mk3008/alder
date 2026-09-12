"""Save a completed stage and replay fixed evaluator gates, without changing the packet."""
from pathlib import Path
import difflib, hashlib, json, os, shutil, subprocess, sys
ROOT=Path(__file__).resolve().parents[3]
W=ROOT/'work/means-behavior'
manifest=json.loads((W/'manifest.json').read_text())
run, stage=sys.argv[1:3]
entry=next(r for r in manifest['runs'] if r['run']==run)
p=Path(entry['packet']); out=W/'runs'/run/stage
if out.exists(): raise SystemExit('Stage already captured')
out.mkdir(parents=True)
hashes={str(f.relative_to(p)):hashlib.sha256(f.read_bytes()).hexdigest() for f in sorted(p.rglob('*')) if f.is_file()}
changes=[name for name in sorted(set(hashes)|set(entry['initial_sha256'])) if hashes.get(name)!=entry['initial_sha256'].get(name)]
protected=[name for name in changes if name in entry['initial_sha256'] and (name.startswith(('context/','test/')) or name in ('AGENTS.md','TASK.md'))]
for f in sorted(p.rglob('*')):
    if f.is_file() and (str(f.relative_to(p)) in changes or str(f.relative_to(p)).startswith(('src/','test/','decisions/'))):
        target=out/'snapshot'/f.relative_to(p); target.parent.mkdir(parents=True,exist_ok=True); shutil.copy2(f,target)
patch=[]
for name in changes:
    original=W/'fixtures'/entry['case']/name
    before=original.read_text().splitlines(True) if original.is_file() else []
    after=(p/name).read_text().splitlines(True) if (p/name).is_file() else []
    patch.extend(difflib.unified_diff(before,after,fromfile='baseline/'+name,tofile='packet/'+name))
(out/'changes.diff').write_text(''.join(patch))
commands=[['node','--test',str(p/'test/existing.test.mjs')]]
if entry['case'] in ('small','choice') or (entry['case']=='cost' and stage=='confirmed'):
    commands.append(['node','--test',str(W/'tools/gates.test.mjs')])
if entry['case'] in ('defect','meaning','sufficient'):
    commands.append(['node',str(W/'tools/probe.mjs'),str(p)])
outputs=[]
for cmd in commands:
    r=subprocess.run(cmd,cwd=p,env={**os.environ,'PACKET':str(p),'CASE':entry['case']},text=True,capture_output=True)
    outputs.append({'command':cmd,'exit_code':r.returncode,'stdout':r.stdout,'stderr':r.stderr})
result={'run':run,'stage':stage,'case':entry['case'],'arm':entry['arm'],'hashes':hashes,'changed_paths':changes,'protected_mutations':protected,'commands':outputs}
(out/'capture.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({'run':run,'stage':stage,'changes':changes,'protected_mutations':protected,'exit_codes':[o['exit_code'] for o in outputs]},indent=2))
