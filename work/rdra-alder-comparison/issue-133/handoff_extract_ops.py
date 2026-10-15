from pathlib import Path
import json,hashlib,shutil,sys,importlib.util,datetime
R=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('extraction_operations',R/'canonical-extractions/extraction_ops.py');ops=importlib.util.module_from_spec(spec);spec.loader.exec_module(ops);ops.BASE=R/'handoff-extractions';ops.BASE.mkdir(exist_ok=True)
import packetize

def h(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def setup(pid):
 hid='H'+pid[1:];d=ops.BASE/hid;d.mkdir(exist_ok=True);source=R/'blind-probes'/pid
 if not (source/'packet.md').exists():raise ValueError('received packet missing')
 if json.loads((source/'metadata.json').read_text()).get('status')!='success':raise ValueError('probe not successfully completed')
 if (d/'packet.md').exists() and h(d/'packet.md')!=h(source/'packet.md'):raise ValueError('existing packet immutable mismatch')
 if not (d/'packet.md').exists():shutil.copyfile(source/'packet.md',d/'packet.md');shutil.copyfile(R/'benchmark-preparation/extraction-prompt.txt',d/'extraction-prompt.txt')
 pm=json.loads((source/'metadata.json').read_text());(d/'packet-provenance.json').write_text(json.dumps({'anonymization_script_sha256':pm['anonymization_script_sha256'],'recording':'Bytecopy of actual received anonymous probe input; no repacketization','received_packet_sha256':h(source/'packet.md'),'probe_packet_id':pid},indent=2)+'\n');ops.setup(hid)
def index():
 entries=[]
 for row in packetize.mapping:
  if row['stage']!='s3':continue
  s2=next(x for x in packetize.mapping if all(x[k]==row[k] for k in ['arm','case','replicate']) and x['stage']=='s2');pid=row['blind_id'];hid='H'+pid[1:];received=R/'blind-probes'/pid/'packet.md';full=R/'canonical-extractions'/s2['blind_id']/'packet.md';entry={'stage2_packet_id':s2['blind_id'],'stage3_packet_id':pid,'received_packet_id':hid,'received_input_sha256':h(received) if received.exists() else None,'full_stage2_input_sha256':h(full) if full.exists() else None,'canonical_status':'pending'}
  probe_meta=received.parent/'metadata.json';probe_status=json.loads(probe_meta.read_text()).get('status') if probe_meta.exists() else 'pending';entry['probe_execution_status']=probe_status
  if probe_status!='success':entry['canonical_status']='probe_pending';entries.append(entry);continue
  if received.exists() and full.exists() and h(received)==h(full):
   entry.update(byte_identity_proof=True,canonical_status='reuse_pending_full_canonical')
   c=full.parent/'canonical.json';m=full.parent/'metadata.json'
   if c.exists() and m.exists() and json.loads(m.read_text())['status']=='success':entry.update(canonical_status='reused_byte_identical',received_canonical_packet_id=s2['blind_id'],received_canonical_file=str(c.relative_to(R)),received_canonical_sha256=h(c),byte_identity_proof=True)
  elif received.exists():
   c=ops.BASE/hid/'canonical.json';m=ops.BASE/hid/'metadata.json'
   if c.exists() and m.exists() and json.loads(m.read_text())['status']=='success':entry.update(canonical_status='fresh_success',received_canonical_packet_id=hid,received_canonical_file=str(c.relative_to(R)),received_canonical_sha256=h(c),byte_identity_proof=False)
   else:entry['canonical_status']='fresh_required'
  entries.append(entry)
 p=ops.BASE/'handoff-index.json';p.write_text(json.dumps({'recorded_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'entries':entries},ensure_ascii=False,indent=2)+'\n');print(json.dumps({'planned':len(entries),'status_counts':{s:sum(e['canonical_status']==s for e in entries) for s in sorted({x['canonical_status'] for x in entries})}},ensure_ascii=False))
def update(hid,agent):
 ops.update(hid,agent);d=ops.BASE/hid;(d/'invocation.json').write_text(json.dumps({'tool':'collaboration.spawn_agent','actual_arguments':{'task_name':agent.split('/')[-1],'model':'gpt-6-sol','reasoning_effort':'medium','fork_turns':'none','message':(d/'envelope.txt').read_text()},'returned_agent_id':agent,'recorded_at':datetime.datetime.now(datetime.timezone.utc).isoformat()},ensure_ascii=False,indent=2)+'\n')
if __name__=='__main__':{'setup':lambda:setup(sys.argv[2]),'update':lambda:update(sys.argv[2],sys.argv[3]),'verify':lambda:ops.verify(sys.argv[2]),'index':index}[sys.argv[1]]()
