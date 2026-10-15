from pathlib import Path
import json,hashlib,datetime,sys
b=Path('/workspace/scratch/62be7f260abb/primary-runs/alder');r=b/sys.argv[1];p=r/'metadata.json';d=json.loads(p.read_text());now=datetime.datetime.now(datetime.timezone.utc).isoformat()
if len(sys.argv)>2:d.update(agent_id=sys.argv[2],started_at=now,status='running',attempt=1)
else:
 d.update(status='success',finished_at=now,failures=[],retries=0)
 for key,name in [('artifact_sha256','docs/business-design/design.md'),('raw_response_sha256','raw-response.md'),('read_log_sha256','read-log.jsonl')]:d[key]=hashlib.sha256((r/name).read_bytes()).hexdigest()
p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n');m=json.loads((b/'manifest.json').read_text())
for entry in m['runs']:
 if entry['root']==str(r.relative_to(b.parent.parent)):
  for k in ['status','agent_id','started_at','finished_at','artifact_sha256','raw_response_sha256','read_log_sha256','failures','retries']:
   if k in d:entry[k]=d[k]
m['updated_at']=now;(b/'manifest.json').write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n');print(str(r.relative_to(b))+': '+d['status'])
