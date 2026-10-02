import pathlib,json,datetime,hashlib,shutil,sys
import packetize
R=pathlib.Path(__file__).resolve().parent
B=R/'blind-probes'
def h(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def setup(pid):
 row=next(x for x in packetize.mapping if x['blind_id']==pid);up=dict(row,stage='s2');up['blind_id']=next(x['blind_id'] for x in packetize.mapping if all(x[k]==up[k] for k in ['arm','case','replicate','stage']))
 n=packetize.make_packet(up,handoff=True);d=B/pid;d.mkdir(parents=True,exist_ok=True);shutil.copyfile(R/'blind-packets'/f'{n}.md',d/'packet.md');shutil.copyfile(R/'benchmark-preparation/downstream-prompt.txt',d/'downstream-prompt.txt')
 e=f'''あなたは独立Fresh中立downstream probeです。cwd={d}。入力read allowlistはこのdirectoryのpacket.mdとdownstream-prompt.txtのみです。それ以外のsource/Human answer/oracle/rubric/method/他packet/親会話やmetadata/envelopeを取得しないでください。downstream-prompt.txtを原文どおり実行してください。packet.md全体の1始まり物理行番号で各項目に根拠位置を付け、資料にない意味を補完しないでください。確認済み期待結果、未決、矛盾を分けてraw-response.mdへ回答全文を保存し、同じ全文をfinalで返してください。read-log.jsonlへ実際に読んだinput pathとtimestampを保存してください。生成出力自身の整合性確認だけ許可します。''' 
 (d/'envelope.txt').write_text(e);m={'packet_id':pid,'status':'prepared','started_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'requested_settings':{'model':'gpt-6-sol','reasoning_effort':'medium','fork_turns':'none'},'effective_settings_attestation':'unavailable','anonymization_script_sha256':h(R/'packetize.py'),'packet_sha256':h(d/'packet.md'),'prompt_sha256':h(d/'downstream-prompt.txt'),'envelope_sha256':h(d/'envelope.txt'),'observation_protocol_sha256':h(R/'benchmark-preparation/OBSERVATION.md'),'observation_frozen_before_first_probe':True,'read_allowlist':[str(d/'packet.md'),str(d/'downstream-prompt.txt')],'limitations':['Shared filesystem procedural read allowlist, not security isolation. Format may disclose method; single blind. Requested settings lack independent attestation.']};
 upstream=R/'primary-runs'/row['arm']/row['case']/f"r{row['replicate']}"/'s2'/'manifest.json'
 if upstream.exists():
  um=json.loads(upstream.read_text());m['upstream_strict_eligible']=um.get('primary_quality_pool_eligible',um.get('status')=='complete');m['exploratory_continuation']=um.get('exploratory_continuation_status') is not None or um.get('status')=='protocol_failed'
 (d/'metadata.json').write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n');print(e)
def update(pid,agent):
 d=B/pid;p=d/'metadata.json';m=json.loads(p.read_text());m.update(status='running',agent_id=agent,prepared_at=m['started_at'],started_at=datetime.datetime.now(datetime.timezone.utc).isoformat());p.write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n')
def finish(pid):
 d=B/pid;p=d/'metadata.json';m=json.loads(p.read_text());missing=[f for f in ['raw-response.md','read-log.jsonl'] if not (d/f).exists()]
 if missing:raise ValueError(missing)
 m.update(status='success',finished_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),output_sha256={f:h(d/f) for f in ['raw-response.md','read-log.jsonl']});p.write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n');row=next(x for x in packetize.mapping if x['blind_id']==pid);dst=R/'primary-runs'/row['arm']/row['case']/f"r{row['replicate']}"/'s3';dst.mkdir(parents=True,exist_ok=True)
 for f in ['raw-response.md','read-log.jsonl','metadata.json','envelope.txt']:shutil.copyfile(d/f,dst/f)
 print(pid+' success')
if __name__=='__main__':{'setup':lambda:setup(sys.argv[2]),'update':lambda:update(sys.argv[2],sys.argv[3]),'finish':lambda:finish(sys.argv[2])}[sys.argv[1]]()
