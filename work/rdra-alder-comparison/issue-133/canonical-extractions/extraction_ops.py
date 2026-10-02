import json,pathlib,sys,hashlib,datetime,shutil
ROOT=pathlib.Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT));import packetize
BASE=ROOT/'canonical-extractions'
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def ready(row):
 run=ROOT/'primary-runs'/row['arm']/row['case']/f"r{row['replicate']}"/row['stage']
 if row['stage']=='s3':
  p=run/'metadata.json'
  if not p.exists():return False
  m=json.loads(p.read_text());return m.get('status') in ['success','complete'] and (run/'raw-response.md').exists()
 if row['arm']=='alder':
  m=json.loads((ROOT/'primary-runs/alder/manifest.json').read_text());entry=next(x for x in m['runs'] if all(x[k]==row[k] for k in ['case','replicate','stage']))
  return entry['status']=='success' and all((run/p).exists() for p in ['docs/business-design/design.md','raw-response.md'])
 p=run/'manifest.json';return p.exists() and json.loads(p.read_text()).get('status')=='complete' and bool(packetize.files_for(row['arm'],row['case'],row['replicate'],row['stage']))
def prepare():
 out=[]
 for row in packetize.mapping:
  d=BASE/row['blind_id']
  if (d/'metadata.json').exists() or not ready(row):continue
  d.mkdir(exist_ok=True)
  if not (d/'packet.md').exists():
   name=packetize.make_packet(row);shutil.copyfile(ROOT/'blind-packets'/f'{name}.md',d/'packet.md');shutil.copyfile(ROOT/'benchmark-preparation/extraction-prompt.txt',d/'extraction-prompt.txt')
  if not (d/'packet-provenance.json').exists():
   (d/'packet-provenance.json').write_text(json.dumps({'anonymization_script_sha256':sha(ROOT/'packetize.py'),'recording':'at packet creation'},indent=2)+'\n')
  out.append(row['blind_id'])
 print(json.dumps(out))
def setup(pid):
 d=BASE/pid
 envelope=f'''あなたは独立Fresh匿名canonical抽出者です。cwd={d}。入力read allowlistはこのdirectoryのpacket.mdとextraction-prompt.txtだけです。この2ファイル以外、他packet/source/oracle/rubric/method、親会話を取得しないでください。extraction-prompt.txtをそのまま実行し、packet_idは{pid}としてください。根拠line_start/line_endはpacket.md全体の物理行番号（1始まり）です。業務意味を補完せず、同一意味の全根拠位置を保持してください。canonical.jsonに正規化JSON、read-log.jsonlに実際に読んだinput pathとtimestampを保存してください。raw-response.mdへfinal responseと同一のJSON本文を保存し、finalではJSON本文を返してください。metadata.jsonやenvelope.txtを読まないでください。生成出力自身の整合性確認だけは許可します。採点・評価はしないでください。'''
 (d/'envelope.txt').write_text(envelope)
 m={'packet_id':pid,'status':'prepared','requested_settings':{'model':'gpt-6-sol','reasoning_effort':'medium','fork_turns':'none'},'effective_settings_attestation':'unavailable','anonymization_script_sha256':json.loads((d/'packet-provenance.json').read_text())['anonymization_script_sha256'],'started_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'packet_sha256':sha(d/'packet.md'),'prompt_sha256':sha(d/'extraction-prompt.txt'),'envelope_sha256':sha(d/'envelope.txt'),'read_allowlist':[str(d/'packet.md'),str(d/'extraction-prompt.txt')],'limitations':['Shared filesystem procedural allowlist, not security isolation. Requested settings lack independent attestation.']}
 (d/'metadata.json').write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n');print(envelope)
def update(pid,agent):
 d=BASE/pid;m=json.loads((d/'metadata.json').read_text());m.update(status='running',agent_id=agent,prepared_at=m['started_at'],started_at=datetime.datetime.now(datetime.timezone.utc).isoformat());(d/'metadata.json').write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n')
def verify(pid):
 d=BASE/pid;m=json.loads((d/'metadata.json').read_text());errors=[]
 try:
  j=json.loads((d/'canonical.json').read_text());lines=(d/'packet.md').read_text().splitlines();raw=(d/'raw-response.md').read_text();raw_json=json.loads(raw)
  if raw_json!=j:errors.append('raw-response JSON differs from canonical')
  required=['packet_id','facts','questions','contradictions','additional_human_inputs','limitations']
  for k in required:
   if k not in j:errors.append('missing '+k)
  if j.get('packet_id')!=pid:errors.append('packet_id mismatch')
  ids=[]
  for collection in ['facts','questions','additional_human_inputs']:
   for n,x in enumerate(j.get(collection,[])):
    if collection in ['facts','questions']:
     ids.append(x.get('id'))
     if not isinstance(x.get('meaning'),str):errors.append('meaning missing')
    if not x.get('evidence'):errors.append(f'{collection}:{n} evidence missing')
    if collection=='facts' and x.get('modality') not in ['asserted','provisional','unresolved','proposed']:errors.append('bad modality')
    for e in x.get('evidence',[]):
     a,b=e.get('line_start'),e.get('line_end');q=e.get('quote')
     if not isinstance(a,int) or not isinstance(b,int) or not 1<=a<=b<=len(lines):errors.append(f'{collection}:{n} line range invalid');continue
     if not isinstance(q,str) or q not in '\n'.join(lines[a-1:b]):errors.append(f'{collection}:{n} quote not in indicated lines')
  if len(ids)!=len(set(ids)) or None in ids:errors.append('duplicate or missing ID')
  for c in j.get('contradictions',[]):
   if any(i not in ids for i in c.get('fact_ids',[])):errors.append('bad contradiction IDs')
  for f in ['read-log.jsonl','raw-response.md']:
   if not (d/f).exists():errors.append('missing '+f)
  for log_line in (d/'read-log.jsonl').read_text().splitlines():
   log=json.loads(log_line);path=log.get('path',log.get('file',log.get('input_path')))
   if path is not None and str(path) not in m['read_allowlist'] and str(path) not in ['packet.md','extraction-prompt.txt']:errors.append('read-log outside allowlist: '+str(path))
  m['output_sha256']={f:sha(d/f) for f in ['canonical.json','raw-response.md','read-log.jsonl'] if (d/f).exists()}
 except Exception as e:errors.append(str(e))
 m.update(status='success' if not errors else 'needs_raw_check',finished_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),mechanical_validation={'errors':errors,'scope':'JSON structure, IDs, raw quote and line ranges only; no semantic correction'})
 (d/'metadata.json').write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'packet_id':pid,'errors':errors}))
if __name__=='__main__':
 {'prepare':prepare,'setup':lambda:setup(sys.argv[2]),'update':lambda:update(sys.argv[2],sys.argv[3]),'verify':lambda:verify(sys.argv[2])}[sys.argv[1]]()
