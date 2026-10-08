#!/usr/bin/env python3
"""Verify frozen evidence bytes, source quote links, and helper read scope."""
from pathlib import Path
import hashlib,json,re,sys
W=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
checks=[]
def check(name, condition):
 checks.append({'check':name,'passed':bool(condition)})
 if not condition: print('FAIL: '+name,file=sys.stderr)
txt=(W/'inputs/transcript.txt').read_text()
lines=txt.splitlines(); turns={x[:4]:x[5:] for x in lines if re.match(r'^T\d{3} ',x)}
check('82 unique sequential turns',list(turns)==[f'T{i:03d}' for i in range(1,83)])
o=json.loads((W/'preparation/requirement-oracle.json').read_text())
check('oracle input digest',o['input']['sha256']==sha(W/'inputs/transcript.txt'))
rows=o['requirements']; ids=[r['id'] for r in rows]
check('66 unique requirement ids',len(ids)==66 and len(set(ids))==66)
check('all exact oracle quotes exist in cited turn',all(s['turn'] in turns and s['quote'] in turns[s['turn']] for r in rows for s in r['sources']))
check('requirements have alternatives and must-retain details',all(r['valid_alternatives'] and r['must_retain_details'] and r['classification_ambiguity'] for r in rows))
m=json.loads((W/'provenance/package-manifest.json').read_text())
check('all pinned package digests',all(sha(W/'inputs/package'/f['path'])==f['sha256'] for f in m['files']))
for path in ['provenance/input-freeze.json','raw/output-freeze.json']:
 p=W/path
 if p.exists():
  j=json.loads(p.read_text());check(path+' file hashes',all((W/f['path']).exists() and sha(W/f['path'])==f['sha256'] for f in j['files']))
 else:checks.append({'check':path,'status':'not yet created'})
p=W/'raw/reads.jsonl'
if p.exists():
 reads=[json.loads(x) for x in p.read_text().splitlines() if x]
 check('all helper reads match allowed frozen input',all((W/'inputs'/r['path']).is_file() and sha(W/'inputs'/r['path'])==r['sha256'] for r in reads))
 check('transcript and required guidance were read',all(any(r['path']==p for r in reads) for p in ['transcript.txt','package/skills/alder-draft-business-design/SKILL.md','package/skills/alder-draft-business-design/references/adoption.md','package/skills/alder-review-business-design/references/business-design-structure.ja.md']))
else:checks.append({'check':'raw reads','status':'not yet created'})
p=W/'evaluation/mapping.json'
if p.exists():
 e=json.loads(p.read_text()); entries=e if isinstance(e,list) else e['requirements'];eid=[r['id'] for r in entries]
 check('evaluation covers exactly every oracle id',sorted(eid)==sorted(ids) and len(set(eid))==len(eid))
report={'all_passed':all(x.get('passed',True) for x in checks),'checks':checks,'limit':'Hash and helper logs do not attest all possible read channels or effective runtime settings.'}
print(json.dumps(report,ensure_ascii=False,indent=2))
sys.exit(0 if report['all_passed'] else 1)
