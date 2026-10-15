"""Read-only business verification and operator manifests. No business edits."""
import json, pathlib, hashlib, datetime
import orchestrate as op
import trace_audit
BASE=op.BASE;RUNS=op.RUNS
reports=[];invocations=[];scripts=[];metadata=[];unexpected=[];snapshots=[];aborts=[]
for mp in sorted(RUNS.glob('C*/r*/s[12]/manifest.json')):
 r=mp.parent;m=json.loads(mp.read_text())
 if m.get('operator_transport_abort'):aborts.append(m['operator_transport_abort'])
 if m.get('technical_complete'):
  op.audit(m['case'],m['replicate'],m['stage']);trace_audit.audit(r);m=json.loads(mp.read_text())
 for node,rec in m['nodes'].items():
  for a in m.get('node_attempt_history',{}).get(node,[])+[rec]:
   root=pathlib.Path(a['root']);ev=pathlib.Path(a['evidence']);allowed=set(a['read_allowlist']+a['outputs'])
   unexpected += [str(p) for p in root.rglob('*') if p.is_file() and str(p.relative_to(root)) not in allowed]
   invocations.append(dict(workflow=str(r.relative_to(RUNS)),node=node,attempt=a.get('attempt',1),agent_id=a.get('agent_id'),status=a['status'],prompt_sha256=a['prompt_sha256'],inputs=a['inputs'],settings=a.get('requested_settings',dict(model=m['requested_model'],reasoning_effort=m['requested_reasoning_effort'],fork_turns=m['fork_turns'])),envelope_path=a.get('envelope_path',str(ev/'envelope.txt')),evidence=str(ev),raw_sha256=op.sha(ev/'raw-final-response.txt') if (ev/'raw-final-response.txt').exists() else None,metadata_sha256=op.sha(ev/'metadata.json') if (ev/'metadata.json').exists() else None))
   if (ev/'metadata.json').exists():metadata.append(dict(workflow=str(r.relative_to(RUNS)),node=node,attempt=a.get('attempt',1),path=str(ev/'metadata.json'),sha256=op.sha(ev/'metadata.json'),metadata=json.loads((ev/'metadata.json').read_text())))
 for pp in [r/'postprocess.jsonl',r/'postprocess-attempt1.jsonl']:
  if pp.exists():
   for line in pp.read_text().splitlines():
    s=json.loads(line)
    if 'script' in s:scripts.append(dict(workflow=str(r.relative_to(RUNS)),attempt='initial_failed_setup' if 'attempt1' in str(pp) else 'successful_pipeline',**s))
 snap=r/'evidence/strict-failure-snapshot'
 if (snap/'SHA256-manifest.json').exists():
  hs=json.loads((snap/'SHA256-manifest.json').read_text());snapshots.append(dict(workflow=str(r.relative_to(RUNS)),snapshot=str(snap),hashes_unchanged=all((snap/p).exists() and op.sha(snap/p)==h for p,h in hs.items()),files=len(hs)))
 reports.append(dict(manifest_path=str(mp),case=m['case'],replicate=m['replicate'],stage=m['stage'],technical_complete=m.get('technical_complete',False),strict_protocol_eligible=m.get('strict_protocol_eligible',False),source_clean_exploratory_eligible=m.get('source_clean_exploratory_eligible',False),dag_all_pass=m.get('dag_run_trace_all_pass',False),validity_subset_all_pass=m.get('validity_all_pass'),guard_failures=m.get('guard_failures',[]),failure=m.get('failure'),status=m['status']))
ids=[i['agent_id'] for i in invocations if i['agent_id']];report=dict(recorded_utc=op.now(),planned_workflows=20,planned_ai_nodes=360,technical_complete=sum(r['technical_complete'] for r in reports),strict_protocol_eligible=sum(r['technical_complete'] and r['strict_protocol_eligible'] for r in reports),strict_protocol_failed=sum(r['status']=='protocol_failed' for r in reports),source_clean_exploratory_eligible=sum(r['technical_complete'] and r['source_clean_exploratory_eligible'] for r in reports),workflow_dag_all_pass=sum(r['dag_all_pass'] for r in reports),fresh_agent_calls=len(ids),unique_agent_ids=len(set(ids)),additional_aborted_transport_calls=len(aborts),all_fresh_agent_calls_including_aborted_transport=len(ids)+len(aborts),all_unique_agent_ids_including_aborted_transport=len(set(ids+[a['agent_id'] for a in aborts])),retained_retries=len(invocations)-sum(len(json.loads(pathlib.Path(r['manifest_path']).read_text())['nodes']) for r in reports),script_invocations=len(scripts),successful_script_invocations=sum(s['exit_code']==0 for s in scripts),failed_script_invocations=sum(s['exit_code']!=0 for s in scripts),metadata_records=len(metadata),unexpected_node_root_files=unexpected,strict_snapshot_integrity=snapshots,workflows=reports,limitations=['Shared filesystem allowlist is operational isolation, not security enforcement.','Source-clean is self-reported read-log/metadata only, without independent trace guarantee.','Effective provider model/reasoning/context isolation attestation unavailable.','RDRA wrapper allows own-output reads; other method wrappers may differ. Do not compare guard failure rate as method quality.','Source original Prompt/Knowledge copies excluded from publication; archive URL and original hashes permit reconstruction.'])
op.dump(RUNS/'operator/aborted-transport-invocations.json',aborts);op.dump(RUNS/'operator/final-verification.json',report);op.dump(RUNS/'operator/fresh-agent-invocations.json',invocations);op.dump(RUNS/'operator/all-metadata-audit.json',metadata);op.dump(RUNS/'operator/all-script-invocations.json',scripts)
print(json.dumps({k:v for k,v in report.items() if k not in ['workflows','strict_snapshot_integrity','limitations']},ensure_ascii=False))
