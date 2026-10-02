import pathlib,json,hashlib,datetime,shutil,sys,importlib.util
ROOT=pathlib.Path('/workspace/scratch/62be7f260abb')
def now():return datetime.datetime.now(datetime.timezone.utc).isoformat()
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def dump(p,v):p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
def prepare(case,rep):
 mapping=json.loads((ROOT/'blind-mapping.json').read_text());row=next(r for r in mapping if r['arm']=='rdra' and r['case']==case and r['replicate']==int(rep) and r['stage']=='s2');s3=next(r for r in mapping if r['arm']=='rdra' and r['case']==case and r['replicate']==int(rep) and r['stage']=='s3')
 run=ROOT/'primary-runs/rdra'/case/('r'+rep)/'s2';m=json.loads((run/'manifest.json').read_text())
 if m['status']!='complete':raise RuntimeError('Stage2 not complete')
 spec=importlib.util.spec_from_file_location('packetize',ROOT/'packetize.py');mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod);name=mod.make_packet(row,handoff=True)
 blind=s3['blind_id'];d=ROOT/'blind-probes'/blind;d.mkdir(parents=True,exist_ok=True)
 shutil.copyfile(ROOT/'blind-packets'/(name+'.md'),d/'packet.md');shutil.copyfile(ROOT/'benchmark-preparation/downstream-prompt.txt',d/'downstream-prompt.txt')
 envelope=f'''Cwd is {d}. Read exactly {d/'downstream-prompt.txt'} and {d/'packet.md'}; execute the unchanged task text in downstream-prompt.txt using only packet.md as the business material. This envelope is also permitted to read. Do not read parent directories, source inputs, human answers, oracle, rubric, method materials, other packets, conversation history, or other files. Write your full response to {d/'raw-response.md'}. Additionally write {d/'read-log.json'} with each exact read path in read order and {d/'metadata.json'} with start/end UTC, failures and any restrictions not met. Only these three outputs are allowed. You may read your own response to verify it. Do not modify task text or packet. Do not compensate for missing evidence.'''
 (d/'envelope.txt').write_text(envelope);message=f'Read and follow the orchestration envelope at {d/"envelope.txt"}. You are permitted to read that envelope. Execute its task using only the specified packet and unchanged task text.';(d/'spawn-message.txt').write_text(message)
 rec=dict(blind_id=blind,case=case,replicate=int(rep),stage='s3',status='prepared',prepared=now(),directory=str(d),requested_settings=dict(model='gpt-6-sol',reasoning_effort='medium',fork_turns='none'),effective_attestation='unavailable',packet_sha256=sha(d/'packet.md'),prompt_sha256=sha(d/'downstream-prompt.txt'),envelope=envelope,envelope_sha256=sha(d/'envelope.txt'),actual_spawn_message=message,spawn_message_sha256=sha(d/'spawn-message.txt'),packet_source=str(ROOT/'blind-packets'/(name+'.md')),anonymization_mapping=str(ROOT/'blind-packets'/(name+'-mapping.json')))
 dump(d/'invocation.json',rec);out=ROOT/'primary-runs/rdra'/case/('r'+rep)/'s3';dump(out/'manifest.json',rec);print(json.dumps(dict(blind_id=blind,message=message),ensure_ascii=False))
if __name__=='__main__':prepare(*sys.argv[1:])
