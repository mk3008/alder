"""Compare the baseline and current npm-test commands; no test files are edited."""
import argparse,json,platform,resource,shlex,subprocess,time
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--baseline',required=True);p.add_argument('--output',required=True);args=p.parse_args()
repo=Path(__file__).resolve().parents[3];cwd=repo/'web-viewer'
baseline=json.loads(subprocess.check_output(['git','show',args.baseline+':web-viewer/package.json'],cwd=repo,text=True));candidate=json.loads((cwd/'package.json').read_text())
def commands(package):return [shlex.split(c) for c in package['scripts']['test'].split(' && ')]
def entries(package):
 result=[]
 for cmd in commands(package):
  if cmd[:2]==['npm','run']:cmd=shlex.split(package['scripts'][cmd[2]])
  assert cmd[0]=='node',cmd
  if '--test' in cmd:result.extend((f,()) for f in cmd[1:] if not f.startswith('--'))
  else:
   files=[f for f in cmd[1:] if not f.startswith('--')];assert len(files)==1,cmd
   result.append((files[0],tuple(x for x in cmd[1:] if x=='--preflight')))
 return sorted(result)
old,new=entries(baseline),entries(candidate);extra=[e for e in new if e not in old]
assert len(old)==57 and all(new.count(e)==old.count(e) for e in old)
assert extra==[('web/test-node-execution.mjs',())],extra
out=Path(args.output).resolve();out.parent.mkdir(parents=True,exist_ok=True)
rows=[];data={'baseline':args.baseline,'node':subprocess.check_output(['node','--version'],text=True).strip(),'platform':platform.platform(),'order':['serial','parallel','parallel','serial','serial','parallel'],'retainedEntries':old,'additionalRegression':extra,'results':rows}
for name in ['cpu.max','memory.max']:
 path=Path('/sys/fs/cgroup')/name
 if path.exists():data[name]=path.read_text().strip()
for i,mode in enumerate(data['order'],1):
 before=resource.getrusage(resource.RUSAGE_CHILDREN);start=time.monotonic();exitcode=0
 with (out.parent/(out.stem+f'-{i}-{mode}.log')).open('w') as log:
  for cmd in commands(baseline if mode=='serial' else candidate):
   result=subprocess.run(cmd,cwd=cwd,stdout=log,stderr=subprocess.STDOUT)
   if result.returncode:exitcode=result.returncode;break
 after=resource.getrusage(resource.RUSAGE_CHILDREN)
 row={'sample':i,'mode':mode,'seconds':round(time.monotonic()-start,3),'exit':exitcode,'cpuSeconds':round(after.ru_utime+after.ru_stime-before.ru_utime-before.ru_stime,3),'maxChildRssKiB':after.ru_maxrss};rows.append(row)
 out.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n');print(json.dumps(row),flush=True)
 if exitcode:raise SystemExit(exitcode)
