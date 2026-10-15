import json,pathlib,datetime,sys
BASE=pathlib.Path('/workspace/scratch/62be7f260abb');DAG=json.loads((BASE/'benchmark-preparation/dag.json').read_text());producers={x:n['id'] for n in DAG for x in n['outputs']}
def audit(r):
 m=json.loads((r/'manifest.json').read_text());checks=[]
 for node,rec in m['nodes'].items():
  for path,h in rec['inputs'].items():
   producer=producers.get(path)
   if producer and producer in m['nodes']:
    pr=m['nodes'][producer];checks.append(dict(consumer=node,input=path,producer=producer,input_byte_hash_equals_producer_output=h==pr.get('artifact_hashes',{}).get(path),input_producer_finished_before_consumer_prepared=pr.get('ended','')<=rec['prepared']))
   elif path=='初期要望.txt':checks.append(dict(consumer=node,input=path,input_byte_hash_equals_frozen_stage_source=h==m['source_sha256']))
 scripts=[]
 p=r/'postprocess.jsonl'
 if p.exists():scripts=[json.loads(l) for l in p.read_text().splitlines() if l]
 expected=[s for n in DAG if n['kind']=='script' for s in n['scripts']];actual=[s['script'] for s in scripts if 'script' in s]
 first=next((s for s in scripts if 'before' in s),None)
 ai_artifacts=[x for n in DAG if n['kind']=='ai' for x in n['outputs']]
 report=dict(checked_utc=datetime.datetime.now(datetime.timezone.utc).isoformat(),dependencies=checks,all_dependency_hashes_and_order_pass=all(all(v for k,v in c.items() if k.startswith('input_')) for c in checks),official_script_order=expected,observed_successful_pipeline_order=actual,script_order_equals_official=actual==expected,all_18_ai_artifacts_present_before_first_pipeline_script=bool(first) and all(x in first['before'] for x in ai_artifacts),no_ai_declared_input_from_pipeline_outputs=not any(x.startswith('1_RDRA/') for n in DAG if n['kind']=='ai' for x in n['inputs']),scope='Operator staging and recorded snapshots; no independent provider access trace.')
 (r/'evidence/dag-run-trace-audit.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');m['dag_run_trace_audit']='evidence/dag-run-trace-audit.json';m['dag_run_trace_all_pass']=report['all_dependency_hashes_and_order_pass'] and report['script_order_equals_official'] and report['all_18_ai_artifacts_present_before_first_pipeline_script'];(r/'manifest.json').write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n');return m['dag_run_trace_all_pass']
if __name__=='__main__':
 if len(sys.argv)==4:print(audit(BASE/'primary-runs/rdra'/sys.argv[1]/sys.argv[2]/sys.argv[3]))
 else:
  for p in (BASE/'primary-runs/rdra').glob('C*/r*/s[12]/manifest.json'):
   if json.loads(p.read_text()).get('technical_complete'):print(str(p.parent),audit(p.parent))
