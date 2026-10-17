#!/usr/bin/env python3
from pathlib import Path
import hashlib,json,subprocess,sys
W=Path(__file__).resolve().parent
base=subprocess.run([sys.executable,str(W/'verify_evidence.py')],capture_output=True,text=True)
checks=json.loads(base.stdout)['checks']
def check(name,condition): checks.append({'check':name,'passed':bool(condition)})
for name in ['initial-evaluation-freeze.json','result-freeze.json']:
 p=W/'provenance'/name
 if p.exists():
  j=json.loads(p.read_text());check(name+' hashes',all(hashlib.sha256((W/f['path']).read_bytes()).hexdigest()==f['sha256'] for f in j['files']))
for label in ['mapping.json','original/mapping.json']:
 j=json.loads((W/'evaluation'/label).read_text()); good=True; total=0
 for r in j['requirements']:
  for e in r['evidence']:
   total+=1;p=(W/e['file']).resolve()
   if not p.is_relative_to(W) or not p.is_file():good=False;continue
   lines=p.read_text().splitlines();a=e['start_line'];b=e['end_line'];q=e.get('quote','')
   if not (1<=a<=b<=len(lines)):good=False
   segment='\n'.join(lines[a-1:b]); quotes=q if isinstance(q,list) else [q]
   if not all(x in segment for x in quotes):good=False
 check(label+f' {total} exact evidence quotes and ranges',good)
records=[]
for p in (W/'raw').iterdir():
 if p.is_file() and p.name!='output-freeze.json':records.append(p.name)
check('all five expected raw files',set(records)=={'draft.md','author-final-reply.txt','author-progress-messages.txt','reads.jsonl','access-report.json'})
neutral=Path('/workspace/shared/session-q8/input/transcript.txt')
if neutral.exists(): check('neutral transcript unchanged',hashlib.sha256((W/'inputs/transcript.txt').read_bytes()).digest()==hashlib.sha256(neutral.read_bytes()).digest())
else: checks.append({'check':'neutral runtime transcript','status':'not present in this reproduction environment'})
report={'all_passed':base.returncode==0 and all(x.get('passed',True) for x in checks),'checks':checks,'scope':'Evidence integrity and exact source/line references; no product implementation or general capability validation.'}
print(json.dumps(report,ensure_ascii=False,indent=2));sys.exit(0 if report['all_passed'] else 1)
