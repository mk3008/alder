"""Mechanical verification of separate evaluator supplements; never apply score edits."""
import datetime, hashlib, json, pathlib, sys
root=pathlib.Path(__file__).resolve().parent
case=sys.argv[1];d=root/'blind-evaluation'/case
errors=[]
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def at(value,field):
 for key in field.split('.'):value=value[key]
 return value
try:
 score=json.loads((d/'scores.json').read_text());packets={x['packet_id']:x for x in score['scores']}
 index=json.loads((d/'packet-index.json').read_text());ids={x['packet_id']:{f['id'] for group in ['facts','questions'] for f in json.loads((d/x['canonical_file']).read_text())[group]} for x in index['packets']}
 filenames={'raw_flag_dispositions':'raw-flag-dispositions.json','additional_raw_check_resolutions':'additional-raw-check-resolutions.json','architecture_assessments':'architecture-assessments.json','score_correction':'score-correction.json'}
 bundle=json.loads((d/'supplement-response.md').read_text())
 for key,name in filenames.items():
  if bundle.get(key)!=json.loads((d/name).read_text()):errors.append('supplement bundle/file mismatch '+name)
 assessment=json.loads((d/'architecture-assessments.json').read_text());seen=set()
 if assessment.get('case_id')!=case:errors.append('architecture case mismatch')
 for x in assessment.get('assessments',[]):
  pid=x.get('packet_id')
  if pid not in packets or pid in seen:errors.append('architecture packet duplicate/unexpected');continue
  seen.add(pid)
  if x.get('assessment') not in ['applicability_omission','indeterminate','not_requested','requested'] or not x.get('judgment'):errors.append('architecture assessment schema '+pid)
  ev=x.get('evidence_ids')
  if not isinstance(ev,list) or not ev or set(ev)-ids[pid]:errors.append('architecture evidence IDs '+pid)
 if seen!=set(packets):errors.append('architecture packet coverage')
 patch=json.loads((d/'score-correction.json').read_text());seen=set()
 if patch.get('case_id')!=case:errors.append('patch case mismatch')
 for x in patch.get('corrections',[]):
  pid=x.get('packet_id');field=x.get('field');key=(pid,field)
  if pid not in packets or key in seen:errors.append('patch packet/field duplicate/unexpected');continue
  seen.add(key)
  if at(packets[pid],field)!=x.get('original_value'):errors.append('patch original mismatch '+pid+' '+field)
  if x.get('status')!='rubric_correction' or not x.get('reason'):errors.append('patch reason/status '+pid)
  ev=x.get('evidence_ids')
  if not isinstance(ev,list) or not ev or set(ev)-ids[pid]:errors.append('patch evidence IDs '+pid)
  if field=='architecture_input_required' and x.get('corrected_value') not in [True,False,None]:errors.append('patch architecture value '+pid)
except Exception as exc:errors.append(type(exc).__name__+': '+str(exc))
report={'checked_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'case_id':case,'errors':errors,'scope':'JSON identity, canonical ID membership, exact original field value, schema and count coverage only; no business semantic judgment or score mutation.','checker_sha256':sha(pathlib.Path(__file__)),'output_sha256':{f:sha(d/f) for f in ['raw-flag-dispositions.json','additional-raw-check-resolutions.json','architecture-assessments.json','score-correction.json','supplement-response.md'] if (d/f).exists()}}
(d/'supplement-verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'case_id':case,'errors':errors}));sys.exit(bool(errors))
