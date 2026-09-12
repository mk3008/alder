"""Reconstruct saved stages, verify frozen artifacts, and replay checks without agents."""
from pathlib import Path
import hashlib, json, os, shutil, subprocess, tempfile

ROOT=Path(__file__).resolve().parents[3]
W=ROOT/'work/means-behavior'
freeze=json.loads((W/'freeze.json').read_text())
for name,digest in freeze['sha256'].items():
    assert hashlib.sha256((ROOT/name).read_bytes()).hexdigest()==digest,name
manifest=json.loads((W/'manifest.json').read_text())
records=[]
for entry in manifest['runs']:
    for stage in ('initial','confirmed') if entry['case']=='cost' else ('initial',):
        saved=W/'runs'/entry['run']/stage
        capture=json.loads((saved/'capture.json').read_text())
        with tempfile.TemporaryDirectory(prefix='alder49-replay-') as d:
            p=Path(d)
            shutil.copytree(W/'fixtures'/entry['case'],p,dirs_exist_ok=True)
            for f in (W/'sources').iterdir(): shutil.copy2(f,p/'context'/f.name)
            instructions=(W/'router.txt').read_text()
            if entry['arm']=='T': instructions+='\n## Additional implementation guidance\n\n'+(ROOT/'docs/means-behavior/candidate.txt').read_text()
            (p/'AGENTS.md').write_text(instructions)
            initial={str(f.relative_to(p)):hashlib.sha256(f.read_bytes()).hexdigest() for f in p.rglob('*') if f.is_file()}
            assert initial==entry['initial_sha256'],(entry['run'],'initial hashes')
            shutil.copytree(saved/'snapshot',p,dirs_exist_ok=True)
            for name in initial:
                if name not in capture['hashes']: (p/name).unlink()
            actual={str(f.relative_to(p)):hashlib.sha256(f.read_bytes()).hexdigest() for f in p.rglob('*') if f.is_file()}
            assert actual==capture['hashes'],(entry['run'],stage,'snapshot hashes')
            outputs=[]
            for old in capture['commands']:
                cmd=[part.replace(entry['packet'],str(p)) for part in old['command']]
                # Saved evaluator paths may belong to a different checkout.
                for i,part in enumerate(cmd):
                    for script in ('gates.test.mjs','probe.mjs'):
                        if part.endswith('/work/means-behavior/tools/'+script): cmd[i]=str(W/'tools'/script)
                r=subprocess.run(cmd,cwd=p,env={**os.environ,'PACKET':str(p),'CASE':entry['case']},text=True,capture_output=True)
                assert r.returncode==old['exit_code'],(entry['run'],stage,r.stdout,r.stderr)
                if any(x.endswith('/probe.mjs') for x in cmd):
                    assert json.loads(r.stdout)==json.loads(old['stdout'])
                outputs.append({'command':cmd,'exit_code':r.returncode,'stdout':r.stdout,'stderr':r.stderr})
            records.append({'run':entry['run'],'stage':stage,'hashes_match':True,'commands':outputs})
out=W/'replay.json'
if out.exists():
    n=2
    while (W/f'replay-{n}.json').exists(): n+=1
    out=W/f'replay-{n}.json'
out.write_text(json.dumps({'frozen_files_verified':len(freeze['sha256']),'stages':records},indent=2)+'\n')
print(json.dumps({'output':str(out),'frozen_files':len(freeze['sha256']),'stages':len(records),'commands':sum(len(x['commands']) for x in records),'all_reproduced':True}))
