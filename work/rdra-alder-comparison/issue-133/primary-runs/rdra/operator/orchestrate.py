import json, pathlib, shutil, hashlib, datetime, sys, subprocess
BASE=pathlib.Path('/workspace/scratch/62be7f260abb')
SOURCE=BASE/'rdra-source/RDRAAgent_v0.8'
RUNS=BASE/'primary-runs/rdra'
DAG=json.loads((BASE/'benchmark-preparation/dag.json').read_text())
def now(): return datetime.datetime.now(datetime.timezone.utc).isoformat()
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def dump(p,v): p.parent.mkdir(parents=True,exist_ok=True); p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
def append(p,v): p.parent.mkdir(parents=True,exist_ok=True); p.open('a').write(json.dumps(v,ensure_ascii=False)+'\n')
def cp(a,b): b.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(a,b)
def runpath(case,rep,stage): return RUNS/case/rep/stage
def init():
 for case in ['C1','C2','C3','C4','C5']:
  for rep in ['r1','r2']:
   for stage in ['s1','s2']:
    r=runpath(case,rep,stage); project=r/'project';project.mkdir(parents=True,exist_ok=True)
    for d in ['0_RDRAZeroOne','1_RDRA','2_RDRASpec','3_RDRASdd']:
     for x in [SOURCE/d]+list((SOURCE/d).rglob('*')):
      if x.is_dir():(project/x.relative_to(SOURCE)).mkdir(parents=True,exist_ok=True)
    cp(BASE/'primary-inputs'/case/(stage+'.txt'),project/'初期要望.txt')
    dump(r/'manifest.json',dict(case=case,replicate=rep,stage=stage,status='pending',source_sha256=sha(project/'初期要望.txt'),requested_model='gpt-6-sol',requested_reasoning_effort='medium',fork_turns='none',provider='ChatGPT Work collaboration',effective_attestation='unavailable',nodes={},deviations=['Shared filesystem read allowlist is operational isolation, not a security sandbox.'],started=now()))
def prepare(case,rep,stage,count=3):
 r=runpath(case,rep,stage);p=r/'project';m=json.loads((r/'manifest.json').read_text());result=[]
 if m['status'] in ['failed','complete']: return []
 m['status']='running'
 for n in DAG:
  if n['kind']!='ai':continue
  if all((p/x).exists() for x in n['outputs']):continue
  prior=m['nodes'].get(n['id'])
  if prior and prior['status']!='completed_without_output':continue
  attempt=(prior.get('attempt',1)+1) if prior else 1
  if prior:m.setdefault('node_attempt_history',{}).setdefault(n['id'],[]).append(prior)
  if not all((p/x).exists() for x in n['inputs']):continue
  suffix=[] if attempt==1 else ['attempt'+str(attempt)]
  root=r.joinpath('nodes',n['id'],*suffix,'root');ev=r.joinpath('evidence',n['id'],*suffix);ev.mkdir(parents=True,exist_ok=True)
  cp(SOURCE/'AGENTS.md',root/'AGENTS.md');cp(SOURCE/n['prompt'],root/n['prompt'])
  shutil.copytree(SOURCE/'RDRA_Knowledge/.rdracore',root/'RDRA_Knowledge/.rdracore',dirs_exist_ok=True)
  cp(SOURCE/'RDRA_Knowledge/.rdracore/RDRA.md',root/'RDRA_Knowledge/_1_RDRA/RDRA.md')
  for x in n['inputs']:cp(p/x,root/x)
  allowed=['AGENTS.md',n['prompt']]+['RDRA_Knowledge/.rdracore/'+x.name for x in (root/'RDRA_Knowledge/.rdracore').iterdir()]+['RDRA_Knowledge/_1_RDRA/RDRA.md']+n['inputs']
  message=f"Execute the exact original official Prompt at {root/n['prompt']}. Cwd/project root: {root}. Read the Prompt and AGENTS.md verbatim first. Read allowlist within root: AGENTS.md, this Prompt only, {', '.join(n['inputs'])}, RDRA_Knowledge/.rdracore/{{RDRA.md,RDRASheet.md,RDRAGraph.md}}, RDRA_Knowledge/_1_RDRA/RDRA.md (byte-identical alias). No reads outside this allowlist, other prompts, samples, parent directories, conversations, oracle, arms or runs. Write only {', '.join(n['outputs'])}, by hand; never generate a program for AI outputs. You may read your own output. Do not alter inputs/Prompt/Knowledge. Evidence-only writes additionally permitted: {ev/'read-log.json'} (every exact file path read, in read order) and metadata.json in that same evidence directory (start/end UTC, failures, unmet restrictions). Official Prompt determines the work. Preserve failures explicitly; final response may be brief or empty."
  (ev/'envelope.txt').write_text(message)
  actual_message=f"Read and follow the orchestration envelope at {ev/'envelope.txt'}. You are permitted to read that envelope. It specifies your independent project root, exact official Prompt, read allowlist, output paths and evidence paths. Execute the official Prompt from its unchanged file bytes."
  (ev/'spawn-message.txt').write_text(actual_message)
  rec=dict(attempt=attempt,actual_spawn_message=actual_message,envelope_path=str(ev/'envelope.txt'),envelope_sha256=sha(ev/'envelope.txt'),spawn_message_sha256=sha(ev/'spawn-message.txt'),node=n['id'],status='prepared',prepared=now(),root=str(root),evidence=str(ev),prompt_path=n['prompt'],prompt_sha256=sha(root/n['prompt']),prompt_source_url='https://drive.google.com/file/d/1ojI1f1tC4erawdZlkm7jtt3fnM0TTrs9/view',envelope=message,inputs={x:sha(root/x) for x in n['inputs']},outputs=n['outputs'],read_allowlist=allowed,alias=dict(source='RDRA_Knowledge/.rdracore/RDRA.md',target='RDRA_Knowledge/_1_RDRA/RDRA.md',source_sha256=sha(root/'RDRA_Knowledge/.rdracore/RDRA.md'),target_sha256=sha(root/'RDRA_Knowledge/_1_RDRA/RDRA.md')),source_hashes={x:sha(root/x) for x in allowed if x not in n['inputs']},requested_settings=dict(model='gpt-6-sol',reasoning_effort='medium',fork_turns='none'))
  dump(ev/'invocation.json',rec);append(r/'invocations.jsonl',rec);m['nodes'][n['id']]=rec;result.append(dict(node=n['id'],message=actual_message))
  if len(result)>=count:break
 dump(r/'manifest.json',m);return result
def started(case,rep,stage,node,agent):
 r=runpath(case,rep,stage);m=json.loads((r/'manifest.json').read_text());rec=m['nodes'][node];rec.update(agent_id=agent,status='running',started=now());dump(r/'manifest.json',m);append(r/'invocations.jsonl',dict(event='start',**rec))
def finish(case,rep,stage,node,response):
 r=runpath(case,rep,stage);m=json.loads((r/'manifest.json').read_text());rec=m['nodes'][node];root=pathlib.Path(rec['root']);ev=pathlib.Path(rec['evidence']);(ev/'raw-final-response.txt').write_text(response)
 rec.update(ended=now(),raw_final_response=response,artifact_hashes={x:sha(root/x) for x in rec['outputs'] if (root/x).exists()})
 readlog=ev/'read-log.json';rec['read_log']=json.loads(readlog.read_text()) if readlog.exists() else None
 rec['unchanged_input_hashes']={x:sha(root/x)==h for x,h in rec['inputs'].items()}
 rec['unchanged_official_hashes']={x:sha(root/x)==h for x,h in rec.get('source_hashes',{}).items()}
 rec['unchanged_prompt_hash']=sha(root/rec['prompt_path'])==rec['prompt_sha256']
 rec['allowed_evidence_read_paths']=[str(ev/'envelope.txt')] if 'envelope_path' in rec else []
 def extract_paths(obj):
  if isinstance(obj,str):return [obj] if ('/' in obj or obj.endswith('.txt') or obj.endswith('.md')) else []
  if isinstance(obj,list):return sum((extract_paths(x) for x in obj),[])
  if isinstance(obj,dict):
   for key in ['paths','files','reads','read_log','read_paths','read_order']:
    if key in obj:return extract_paths(obj[key])
   return sum((extract_paths(v) for v in obj.values()),[])
  return []
 paths=extract_paths(rec['read_log']);allowed={(root/x).resolve() for x in rec['read_allowlist']+rec['outputs']}|{(ev/'envelope.txt').resolve()}
 resolved=[(pathlib.Path(x) if pathlib.Path(x).is_absolute() else root/x).resolve() for x in paths]
 rec['read_log_validity']=dict(prompt_read=(root/rec['prompt_path']).resolve() in resolved,outside_allowlist=[str(x) for x in resolved if x not in allowed],reported_paths=paths)
 missing=[x for x in rec['outputs'] if not (root/x).exists()];rec['missing_outputs']=missing
 if not readlog.exists() or not rec['read_log_validity']['prompt_read'] or rec['read_log_validity']['outside_allowlist'] or not all(rec['unchanged_input_hashes'].values()) or not rec['unchanged_prompt_hash'] or not all(rec['unchanged_official_hashes'].values()):rec['status']='failed';m['status']='failed';m['failure']='Missing output or required read-log: '+node
 elif missing:
  rec['status']='completed_without_output';rec['failure']='Missing official artifact';m['status']='running';m.setdefault('retry_failures',[]).append(dict(node=node,attempt=rec.get('attempt',1),failure=rec['failure'],ended=rec['ended']))
 else:
  rec['status']='complete'
  for x in rec['outputs']:cp(root/x,r/'project'/x)
 append(r/'invocations.jsonl',dict(event='finish',**rec));dump(ev/'completed.json',rec);dump(r/'manifest.json',m)
 print(json.dumps(dict(run=str(r),node=node,status=rec['status']),ensure_ascii=False))
def snapshots(p): return {str(x.relative_to(p)):sha(x) for x in p.rglob('*') if x.is_file() and not str(x.relative_to(p)).startswith('RDRA_Knowledge/')}
def post(case,rep,stage):
 r=runpath(case,rep,stage);m=json.loads((r/'manifest.json').read_text());p=r/'project';ev=r/'evidence/postprocess';ev.mkdir(parents=True,exist_ok=True)
 if m['status']=='failed':print('failed');return
 if not all(m['nodes'].get(n['id'],{}).get('status')=='complete' for n in DAG if n['kind']=='ai'):print('not-ready');return
 shutil.copytree(SOURCE/'RDRA_Knowledge/helper_tools',p/'RDRA_Knowledge/helper_tools',dirs_exist_ok=True)
 shutil.copytree(SOURCE/'RDRA_Knowledge/.rdracore',p/'RDRA_Knowledge/.rdracore',dirs_exist_ok=True)
 for n in DAG:
  if n['kind']!='script':continue
  if not all((p/x).exists() for x in n['inputs']):m.update(status='failed',failure='Missing script input: '+n['id']);break
  for script in n['scripts']:
   name=pathlib.Path(script).stem;se=ev/name;se.mkdir(parents=True,exist_ok=True)
   for outdir in ['0_RDRAZeroOne','1_RDRA']:
    if (p/outdir).exists():shutil.copytree(p/outdir,se/'before'/outdir)
   before=snapshots(p);proc=subprocess.run(['node',str(p/script)],cwd=p,capture_output=True)
   (se/'stdout.txt').write_bytes(proc.stdout);(se/'stderr.txt').write_bytes(proc.stderr)
   for outdir in ['0_RDRAZeroOne','1_RDRA']:
    if (p/outdir).exists():shutil.copytree(p/outdir,se/'after'/outdir)
   rec=dict(script=script,script_sha256=sha(p/script),before=before,after=snapshots(p),exit_code=proc.returncode,ended=now());dump(se/'record.json',rec);append(r/'postprocess.jsonl',rec)
   if proc.returncode:m.update(status='failed',failure='Official script failed: '+script);break
  if m['status']=='failed':break
 if m['status']!='failed':m['status']='complete'
 m['ended']=now();m['artifacts']=snapshots(p);dump(r/'manifest.json',m);print(json.dumps(dict(run=str(r),status=m['status']),ensure_ascii=False))
if __name__=='__main__':
 cmd=sys.argv[1]
 if cmd=='init':init()
 elif cmd=='prepare':print(json.dumps(prepare(*sys.argv[2:5],int(sys.argv[5]) if len(sys.argv)>5 else 3),ensure_ascii=False))
 elif cmd=='started':started(*sys.argv[2:])
 elif cmd=='finish':finish(*sys.argv[2:6],pathlib.Path(sys.argv[6]).read_text())
 elif cmd=='post':post(*sys.argv[2:])
