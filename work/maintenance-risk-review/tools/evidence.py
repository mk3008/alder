"""Focused retrospective source evidence; no model calls or production mutation.
Regions are manually selected exact markers, not a general JS parser.
"""
import hashlib,json,sys,re
from pathlib import Path
REPO=Path(__file__).resolve().parents[3]
REVIEW=REPO/'work/maintenance-risk-review'
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def source(experiment,arm,stage,name):return REPO/f'work/{experiment}/runs/{arm}/{stage}/source/{name}'
def region(path,start,end):
 text=path.read_text();assert text.count(start)==1,(path,start)
 a=text.index(start); b=text.index(end,a)
 return {'path':str(path.relative_to(REPO)),'start_marker':start,'end_marker_exclusive':end,'first_line':text[:a].count('\n')+1,'text':text[a:b],'sha256':hashlib.sha256(text[a:b].encode()).hexdigest()}
def compare(experiment,arm,before,after,name,start,end,label):
 a=region(source(experiment,arm,before,name),start,end);b=region(source(experiment,arm,after,name),start,end)
 return {'label':label,'arm':arm,'before':a,'after':b,'byte_identical':a['sha256']==b['sha256']}
def collect():
 baseline=json.loads((REVIEW/'records/baseline.json').read_text())
 for name,sha in baseline['files'].items():assert digest(REPO/name)==sha,f'Existing evidence changed: {name}'
 regions=[]
 for a in 'AB':
  regions.append(compare('maintenance-cost',a,'U2','F1','entry.mjs','    approve(id, actor, now) {','    reject(id, reason, actor, now) {','E1 approval use-case body'))
 regions.append(compare('maintenance-cost','A','U2','F1','entry.mjs','  function transition(','\n  return {','E1 A existing shared transition'))
 regions.append(compare('maintenance-cost','B','U2','F1','entry.mjs','function requireApprovalAuthority(','\nexport function createApp','E1 B local authority helper'))
 regions.append(compare('maintenance-boundary','A','S0','S1','entry.mjs','  function find(','\n  async function book','E2 A lookup'))
 regions.append(compare('maintenance-boundary','A','S0','S1','entry.mjs','  function detail(','\n  return {book','E2 A detail query'))
 regions.append(compare('maintenance-boundary','B','S0','S1','entry.mjs','  function requireRecord(','\n  return {','E2 B lookup'))
 regions.append(compare('maintenance-boundary','B','S0','S1','entry.mjs','    detail(id) {','\n  };','E2 B detail query'))
 regions.append(compare('maintenance-boundary','D','S0','S1','booking.mjs','  function detail(','\n  return {','E2 D detail query'))
 modules=[]
 for a in 'ABCD':
  old=source('maintenance-boundary',a,'S0','');new=source('maintenance-boundary',a,'S1','')
  paths=sorted({str(p.relative_to(old)) for p in old.rglob('*.mjs')}|{str(p.relative_to(new)) for p in new.rglob('*.mjs')})
  modules.append({'arm':a,'files':[{'path':p,'before_sha256':digest(old/p) if (old/p).exists() else None,'after_sha256':digest(new/p) if (new/p).exists() else None,'byte_identical':(old/p).exists() and (new/p).exists() and (old/p).read_bytes()==(new/p).read_bytes()} for p in paths],
   'imports_and_exports':{str(p.relative_to(new)):{'imports':re.findall(r"^import .*? from ['\"](.+?)['\"]",p.read_text(),re.M),'exports':re.findall(r'^export (?:async )?function (\w+)\(([^\n]*)',p.read_text(),re.M),'uses_fetch':'fetch(' in p.read_text()} for p in sorted(new.rglob('*.mjs'))}})
 metrics={}
 for experiment in ['maintenance-cost','maintenance-boundary']:
  # Separate module namespace so the reused ROOT/STAGES do not mix experiments.
  namespace={'__name__':'evidence_measure','__file__':str(REPO/f'work/{experiment}/tools/measure.py')}
  exec(compile(Path(namespace['__file__']).read_text(),namespace['__file__'],'exec'),namespace)
  measured=namespace['measure']();assert measured==json.loads((REPO/f'work/{experiment}/records/measurements.json').read_text())
  metrics[experiment]=[{k:r[k] for k in ['arm','stage','gate_passed','agent_check_attempts','failed_agent_checks','stats','cumulative_churn','cumulative_nonblank_noncomment_churn']} for r in measured['rows']]
 return {'baseline_commit':baseline['commit'],'baseline_file_hashes_verified':len(baseline['files']),'method':'Manual exact source-region markers and complete E2 production file hashes/import/export inventory; byte equality is not semantic equivalence or independent causal evidence. Existing measurement algorithms recomputed unchanged.','region_comparisons':regions,'experiment2_modules':modules,'metrics':metrics}
if __name__=='__main__':print(json.dumps(collect(),indent=2))
