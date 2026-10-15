"""Record manually verified metadata read-attempt violations; never edit business output."""
import json, pathlib, sys
import orchestrate as op
case,rep,stage,node,bad=sys.argv[1:]
r=op.runpath(case,rep,stage);m=json.loads((r/'manifest.json').read_text());root=pathlib.Path(m['nodes'][node]['root']);meta=json.loads((pathlib.Path(m['nodes'][node]['evidence'])/'metadata.json').read_text())
if not any(f.get('node')==node and f.get('attempted_path')==str(root/bad) for f in m.get('guard_failures',[])):
 m.update(status='protocol_failed',strict_protocol_eligible=False,primary_quality_pool_eligible=False,failure='Metadata-reported outside-allowlist path attempt: '+node)
 m.setdefault('failed_nodes',[]).append(node)
 m.setdefault('guard_failures',[]).append(dict(node=node,classification='Manually verified metadata-reported outside-allowlist read attempt',attempted_path=str(root/bad),path_exists=(root/bad).exists(),metadata=meta,exposure='No content reportedly acquired' if not (root/bad).exists() else 'Existing attempted path requires content acquisition review'))
 op.dump(r/'manifest.json',m);op.strict_snapshot(r,m)
 m.update(strict_failure_snapshot='evidence/strict-failure-snapshot',source_clean_exploratory_eligible=m.get('source_clean_exploratory_eligible',True) and not (root/bad).exists(),source_clean_attestation='Self-reported read-log/metadata only; no independent trace guarantee.')
 if not m.get('technical_complete'):
  m.update(exploratory_continuation_status='running');m.setdefault('exploratory_continuation_started',op.now())
 op.dump(r/'manifest.json',m)
print(json.dumps(dict(run=str(r),node=node,path_exists=(root/bad).exists(),strict_protocol_eligible=False)))
