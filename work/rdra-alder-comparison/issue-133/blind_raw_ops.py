from pathlib import Path
import json,datetime,hashlib,sys
R=Path(__file__).resolve().parent

def now():return datetime.datetime.now(datetime.timezone.utc).isoformat()
def h(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def update(pid,agent):
 d=R/'blind-raw-checks'/pid;p=d/'metadata.json';m=json.loads(p.read_text());m.update(status='running',agent_id=agent,started_at=now());p.write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n');(d/'invocation.json').write_text(json.dumps({'tool':'collaboration.spawn_agent','actual_arguments':{'task_name':agent.split('/')[-1],'model':'gpt-6-sol','reasoning_effort':'medium','fork_turns':'none','message':(d/'envelope.txt').read_text()},'returned_agent_id':agent,'recorded_at':now()},ensure_ascii=False,indent=2)+'\n')
def finish(pid):
 d=R/'blind-raw-checks'/pid;p=d/'metadata.json';m=json.loads(p.read_text());errors=[]
 try:
  out=json.loads((d/'review.json').read_text());raw=json.loads((d/'raw-response.md').read_text());t=json.loads((d/'review-targets.json').read_text());expected=set(t['target_ids']);seen=set()
  if out!=raw:errors.append('review/raw JSON mismatch')
  if out.get('packet_id')!=pid:errors.append('packet_id mismatch')
  packets={pid}
  if t.get('stage2_correspondence_packet_id'):packets.add(t['stage2_correspondence_packet_id'])
  for item in out['checks']:
   id=item['canonical_id']
   if id not in expected or id in seen:errors.append('duplicate/unexpected ID '+id)
   seen.add(id)
   for k in ['local_meaning','local_modality','scope']:
    if not item.get(k):errors.append('missing '+k+' '+id)
   if item.get('local_modality') not in ['asserted','provisional','proposed','unresolved','ambiguous']:errors.append('invalid modality '+id)
   if not isinstance(item.get('evidence'),list) or not item['evidence']:errors.append('missing evidence '+id)
   for key in ['evidence','correspondence_evidence']:
    for ev in item.get(key,[]):
     packet=ev['packet_id']
     if packet not in packets:errors.append('outside packet evidence '+packet);continue
     source_file=ev.get('source_file',packet+'-packet.md');source_path=d/source_file
     if str(source_path.resolve()) not in m['read_allowlist']:errors.append('outside evidence source '+source_file);continue
     if ev.get('input_sha256') and ev['input_sha256']!=h(source_path):errors.append('evidence input hash mismatch '+id)
     lines=source_path.read_text().splitlines();a=ev['line_start'];b=ev['line_end'];q=ev['quote']
     if not isinstance(a,int) or not isinstance(b,int) or not (1<=a<=b<=len(lines)) or not q or q not in '\n'.join(lines[a-1:b]):errors.append('invalid quote/range '+id)
   for k in ['explicit_unknowns','ambiguities','correspondence_evidence']:
    if not isinstance(item.get(k),list):errors.append('invalid '+k+' '+id)
  if seen!=expected:errors.append('target coverage mismatch')
  allow=set(m['read_allowlist'])|{str(d/f) for f in ['review.json','raw-response.md','read-log.jsonl']}
  for line in (d/'read-log.jsonl').read_text().splitlines():
   ev=json.loads(line);f=ev.get('path',ev.get('input_path',ev.get('file')))
   if not f:errors.append('read-log missing path');continue
   if str(Path(f).resolve() if Path(f).is_absolute() else (d/f).resolve()) not in allow:errors.append('outside read '+f)
 except Exception as ex:errors.append(type(ex).__name__+': '+str(ex))
 m.update(status='success' if not errors else 'mechanical_failed',finished_at=now(),mechanical_errors=errors,output_sha256={f:h(d/f) for f in ['review.json','raw-response.md','read-log.jsonl'] if (d/f).exists()});p.write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'packet_id':pid,'errors':errors},ensure_ascii=False))
if __name__=='__main__':{'update':lambda:update(sys.argv[2],sys.argv[3]),'finish':lambda:finish(sys.argv[2])}[sys.argv[1]]()
