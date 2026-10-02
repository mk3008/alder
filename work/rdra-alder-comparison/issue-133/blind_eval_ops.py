import pathlib,json,hashlib,datetime,shutil,sys
import packetize
R=pathlib.Path(__file__).resolve().parent
B=R/'blind-evaluation'
def h(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def setup(case):
 rows=[r for r in packetize.mapping if r['case']==case];ready=[];unavailable=[]
 for row in rows:
  p=R/'canonical-extractions'/row['blind_id']/'metadata.json'
  if not p.exists():raise ValueError('nonterminal '+row['blind_id'])
  m=json.loads(p.read_text())
  if m['status']=='success':ready.append(row)
  elif m['status']=='unavailable':unavailable.append(row)
  else:raise ValueError('nonterminal '+row['blind_id']+' '+m['status'])
 d=B/case;d.mkdir(parents=True,exist_ok=True)
 cases=json.loads((R/'benchmark-preparation/cases.json').read_text());c=next(x for x in cases['cases'] if x['id']==case)
 (d/'case-reference.json').write_text(json.dumps({'case_id':case,'source':c['source'],'human_answers':c['human_answers'],'oracle':c['oracle'],'resolved_source':c['resolved_source']},ensure_ascii=False,indent=2)+'\n')
 subsets=json.loads((R/'benchmark-preparation/downstream-denominators.json').read_text());(d/'downstream-subset.json').write_text(json.dumps(subsets['cases'][case],ensure_ascii=False,indent=2)+'\n')
 for f in ['rubric.md','evaluation-prompt.txt']:shutil.copyfile(R/'benchmark-preparation'/f,d/f)
 index={'packets':[],'s2_s3_correspondence':[],'unavailable_packet_ids':[r['blind_id'] for r in unavailable]}
 for row in ready:
  pid=row['blind_id'];shutil.copyfile(R/'canonical-extractions'/pid/'canonical.json',d/(pid+'.json'));index['packets'].append({'packet_id':pid,'stage':row['stage'],'canonical_file':pid+'.json'})
 for row in rows:
  if row['stage']!='s2':continue
  s3=next(x for x in rows if all(x[k]==row[k] for k in ['arm','case','replicate']) and x['stage']=='s3');index['s2_s3_correspondence'].append({'stage2_packet_id':row['blind_id'],'stage3_packet_id':s3['blind_id']})
 (d/'packet-index.json').write_text(json.dumps(index,ensure_ascii=False,indent=2)+'\n')
 allow=['case-reference.json','downstream-subset.json','rubric.md','evaluation-prompt.txt','packet-index.json']+[r['blind_id']+'.json' for r in ready]
 e=f'''あなたは独立Fresh匿名semantic score evaluatorです。cwd={d}。input read allowlistはこのdirectory内の{', '.join(allow)}だけです。それ以外のarm mapping/元業務artifact/手法情報/eligibility metadata/他case/親会話を取得しないでください。evaluation-prompt.txtを既定原文どおり実行し、case-reference.jsonの固定source/Human answer/oracle、rubric.mdとdownstream-subset.jsonの固定下流必要事実だけを使い、packet-index.jsonのstageと匿名s2→s3対応を参照してください。利用可能canonicalだけを独立採点し、unavailableは品質0にimputeせずscoresから除外してlimitsへ記録してください。全判定（保持事実、unknown_ids_found、actionable_unknown_idsを含む）にcanonical fact/question IDsを付けるため各scoreにcoverage_evidenceを追加してください: coverage_evidence={{unknown_ids_found:{{'oracle unknown ID':['F1','Q1']}}, actionable_unknown_ids:{{'oracle unknown ID':['Q1']}}, source_facts_preserved:{{'原oracle fact':['F1']}}, answer_facts_preserved:{{'原oracle fact':['F2']}}, downstream_facts_preserved:{{'原oracle fact':['F3']}}}}というobject形式です。found/preserved配列の全要素にnonempty evidence IDsを対応させ、当該packetcanonical内IDだけを使ってください。他count項目にも既定evidenceIDsを必須にしてください。C5 unapproved_architecture_promotionの全itemもmeaningとevidence_idsを必須にしてください。全体draft/未合意表記だけを根拠に発明0とせず、局所のasserted rule/proposal/未決を根拠付きで区別してください。stage1/2/3の適用外項目は空/nullとし、C4unknown recallはN/A、C5implementation_viabilityはnot_executedを維持してください。needs_raw_checkを0や確定へ強制せず曖昧さを残してください。各packet notesには有用な意味の保持/発見（関係・条件軸・活動間連続性・confirmed/未決境界等）がある場合にcanonical IDを添えた短い記述を残してください。長さ/形式やarm推測を得点にせず、新採点項目は設けません。probe発明は対応s2canonicalと比較し上流誤り伝達と区別してください。scores.jsonへJSON結果、raw-response.mdへfinalと同一のJSON全文、read-log.jsonlへ実際のinput読取pathとtimestampを保存し、finalはJSON本文を返してください。自分の生成output検証だけ追加許可します。metadata/envelopeを読まないでください。'''
 (d/'envelope.txt').write_text(e);m={'case_id':case,'status':'prepared','started_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'requested_settings':{'model':'gpt-6-sol','reasoning_effort':'medium','fork_turns':'none'},'effective_settings_attestation':'unavailable','input_sha256':{f:h(d/f) for f in allow},'envelope_sha256':h(d/'envelope.txt'),'read_allowlist':[str(d/f) for f in allow],'limitations':['Single blind; format may disclose arm. Shared filesystem procedural isolation only. Requested runtime lacks independent attestation.']};(d/'metadata.json').write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n');print(e)
def update(case,agent):
 p=B/case/'metadata.json';m=json.loads(p.read_text());m.update(status='running',agent_id=agent,prepared_at=m['started_at'],started_at=datetime.datetime.now(datetime.timezone.utc).isoformat());p.write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n')
def finish(case):
 d=B/case;p=d/'metadata.json';m=json.loads(p.read_text());errors=[]
 try:
  result=json.loads((d/'scores.json').read_text())
  if result!=json.loads((d/'raw-response.md').read_text()):errors.append('raw/canonical JSON mismatch')
  index=json.loads((d/'packet-index.json').read_text());expected={x['packet_id']:x for x in index['packets']}
  seen=set();nr=[]
  if result.get('case_id')!=case:errors.append('case_id mismatch')
  if not isinstance(result.get('limits'),list):errors.append('limits invalid')
  for score in result['scores']:
   pid=score['packet_id']
   if pid not in expected or pid in seen:errors.append('packet duplicate/unexpected '+pid);continue
   seen.add(pid)
   if score['stage']!=expected[pid]['stage']:errors.append('stage mismatch '+pid)
   canonical=json.loads((d/expected[pid]['canonical_file']).read_text());ids={x['id'] for group in ['facts','questions'] for x in canonical[group]}
   coverage=score.get('coverage_evidence',{})
   for key in ['unknown_ids_found','actionable_unknown_ids','source_facts_preserved','answer_facts_preserved','downstream_facts_preserved']:
    claims=score.get(key);evidence=coverage.get(key)
    if not isinstance(claims,list) or not isinstance(evidence,dict) or set(evidence)!=set(claims):errors.append(pid+' coverage keys '+key);continue
    for claim,eids in evidence.items():
     if not isinstance(eids,list) or not eids or set(eids)-ids:errors.append(pid+' coverage IDs '+key)
   for key in ['unauthorized_decisions','unsupported_additions','unresolved_leakage','redundant_questions','probe_inventions','unapproved_architecture_promotion']:
    values=score.get(key)
    if not isinstance(values,list):errors.append(pid+' invalid count list '+key);continue
    for item in values:
     eids=item.get('evidence_ids')
     if not item.get('meaning') or not isinstance(eids,list) or not eids or set(eids)-ids:errors.append(pid+' count evidence '+key)
   if not isinstance(score.get('needs_raw_check'),list):errors.append(pid+' invalid needs_raw_check')
   elif score['needs_raw_check']:nr.append({'packet_id':pid,'count':len(score['needs_raw_check'])})
   if not isinstance(score.get('notes'),list):errors.append(pid+' invalid notes')
   if case=='C5' and score.get('implementation_viability')!='not_executed':errors.append(pid+' implementation_viability')
   stage=score['stage']
   empty=['unknown_ids_found','actionable_unknown_ids','redundant_questions'] if stage!='s1' else []
   if stage!='s2':empty+=['answer_facts_preserved','unresolved_leakage'] if stage=='s1' else ['answer_facts_preserved']
   if stage!='s3':empty+=['downstream_facts_preserved','probe_inventions']
   for key in empty:
    if score.get(key):errors.append(pid+' stage-inapplicable '+key)
  if seen!=set(expected):errors.append('missing packets '+','.join(sorted(set(expected)-seen)))
  allow=set(m['read_allowlist'])|{str(d/f) for f in ['scores.json','raw-response.md','read-log.jsonl']}
  for line in (d/'read-log.jsonl').read_text().splitlines():
   entry=json.loads(line);f=entry.get('path',entry.get('input_path',entry.get('file')))
   if f and str((d/f).resolve() if not pathlib.Path(f).is_absolute() else pathlib.Path(f).resolve()) not in allow:errors.append('outside allowlist '+f)
  m['needs_raw_check_summary']=nr
 except Exception as ex:errors.append(type(ex).__name__+': '+str(ex))
 m.update(status='success' if not errors else 'mechanical_failed',finished_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),mechanical_errors=errors,output_sha256={f:h(d/f) for f in ['scores.json','raw-response.md','read-log.jsonl'] if (d/f).exists()})
 p.write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'case_id':case,'errors':errors,'needs_raw_check':m.get('needs_raw_check_summary',[])},ensure_ascii=False))
if __name__=='__main__':{'setup':lambda:setup(sys.argv[2]),'update':lambda:update(sys.argv[2],sys.argv[3]),'finish':lambda:finish(sys.argv[2])}[sys.argv[1]]()
