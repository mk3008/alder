import pathlib,json,hashlib,datetime,shutil,sys
import packetize
R=pathlib.Path(__file__).resolve().parent
B=R/'blind-evaluation'
def h(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def setup(case,include_received=True):
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
 received_files=[]
 if include_received:
  hi=json.loads((R/'handoff-extractions/handoff-index.json').read_text());pids={r['blind_id'] for r in rows};received=[]
  for x in hi['entries']:
   if x['stage3_packet_id'] not in pids:continue
   if x['canonical_status'] not in ['fresh_success','reused_byte_identical']:raise ValueError('received canonical not ready '+x['stage3_packet_id'])
   y={k:v for k,v in x.items() if k not in ['received_canonical_file','probe_execution_status','canonical_status']};fname=x['received_canonical_packet_id']+'.json';y['received_canonical_file']=fname
   if not (d/fname).exists():shutil.copyfile(R/x['received_canonical_file'],d/fname)
   if fname not in [r['blind_id']+'.json' for r in ready] and fname not in received_files:received_files.append(fname)
   received.append(y)
  (d/'received-handoff-index.json').write_text(json.dumps({'entries':received},ensure_ascii=False,indent=2)+'\n');received_files.append('received-handoff-index.json')
 allow=['case-reference.json','downstream-subset.json','rubric.md','evaluation-prompt.txt','packet-index.json']+[r['blind_id']+'.json' for r in ready]+received_files
 e=f'''あなたは独立Fresh匿名semantic score evaluatorです。cwd={d}。input read allowlistはこのdirectory内の{', '.join(allow)}だけです。それ以外のarm mapping/元業務artifact/手法情報/eligibility metadata/他case/親会話を取得しないでください。evaluation-prompt.txtを既定原文どおり実行し、case-reference.jsonの固定source/Human answer/oracle、rubric.mdとdownstream-subset.jsonの固定下流必要事実だけを使い、packet-index.jsonのstageと匿名s2→s3対応を参照してください。利用可能canonicalだけを独立採点し、unavailableは品質0にimputeせずscoresから除外してlimitsへ記録してください。全判定（保持事実、unknown_ids_found、actionable_unknown_idsを含む）にcanonical fact/question IDsを付けるため各scoreにcoverage_evidenceを追加してください: coverage_evidence={{unknown_ids_found:{{'oracle unknown ID':['F1','Q1']}}, actionable_unknown_ids:{{'oracle unknown ID':['Q1']}}, source_facts_preserved:{{'原oracle fact':['F1']}}, answer_facts_preserved:{{'原oracle fact':['F2']}}, downstream_facts_preserved:{{'原oracle fact':['F3']}}}}というobject形式です。found/preserved配列の全要素にnonempty evidence IDsを対応させ、当該packetcanonical内IDだけを使ってください。他count項目にも既定evidenceIDsを必須にしてください。C5 unapproved_architecture_promotionの全itemもmeaningとevidence_idsを必須にしてください。固定rubricのQuestion actionabilityは具体的な質問を評価し、未決statementの発見とは区別してください。具体的な質問のcanonical根拠を示し、抽出欠落の可能性はneeds_raw_checkに残してください。全体draft/未合意表記だけを根拠に発明0とせず、局所のasserted rule/proposal/未決を根拠付きで区別してください。stage1/2/3の適用外項目は空/nullとし、C4unknown recallはN/A、C5implementation_viabilityはnot_executedを維持してください。needs_raw_checkを0や確定へ強制せず曖昧さを残してください。各packet notesには有用な意味の保持/発見（関係・条件軸・活動間連続性・confirmed/未決境界等）がある場合にcanonical IDを添えた短い記述を残してください。長さ/形式やarm推測を得点にせず、新採点項目は設けません。probe発明は対応s2canonicalと比較し上流誤り伝達と区別してください。scores.jsonへJSON結果、raw-response.mdへfinalと同一のJSON全文、read-log.jsonlへ実際のinput読取pathとtimestampを保存し、finalはJSON本文を返してください。自分の生成output検証だけ追加許可します。metadata/envelopeを読まないでください。'''
 if include_received:e+='received-handoff-index.jsonの実際受領canonicalをStage3 probe独自発明の比較基準にしてください。full Stage2 canonicalはStage2品質採点用に保持し、実handoffにない意味をfull Stage2だけで受領済みと扱わないでください。'
 (d/'envelope.txt').write_text(e);m={'case_id':case,'status':'prepared','attempt_number':1,'started_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'requested_settings':{'model':'gpt-6-sol','reasoning_effort':'medium','fork_turns':'none'},'effective_settings_attestation':'unavailable','input_sha256':{f:h(d/f) for f in allow},'envelope_sha256':h(d/'envelope.txt'),'read_allowlist':[str(d/f) for f in allow],'limitations':['Single blind; format may disclose arm. Shared filesystem procedural isolation only. Requested runtime lacks independent attestation.']};(d/'metadata.json').write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n');print(e)
def final_setup(case):
 d=B/case
 # Preserve all prior files before attaching contextual evidence; previous scores are not evaluator inputs.
 previous_attempt_number=json.loads((d/'metadata.json').read_text()).get('attempt_number',1)
 attempt=d/('attempt-'+str(previous_attempt_number).zfill(3))
 if attempt.exists():raise ValueError('archive already exists '+attempt.name)
 attempt.mkdir()
 for f in d.iterdir():
  if f.is_file():shutil.copyfile(f,attempt/f.name)
 (attempt/'SHA256.json').write_text(json.dumps({f.name:h(f) for f in attempt.iterdir() if f.is_file()},indent=2)+'\n')
 for f in ['scores.json','raw-response.md','read-log.jsonl','invocation.json']:
  if (d/f).exists():(d/f).unlink()
 setup(case,include_received=False)
 pids={x['blind_id'] for x in packetize.mapping if x['case']==case}
 hi=json.loads((R/'handoff-extractions/handoff-index.json').read_text());received=[];added=[]
 for x in hi['entries']:
  if x['stage3_packet_id'] not in pids:continue
  if x['canonical_status'] not in ['fresh_success','reused_byte_identical']:raise ValueError('received canonical not ready '+x['stage3_packet_id'])
  y={k:v for k,v in x.items() if k not in ['received_canonical_file','probe_execution_status','canonical_status']}
  fname=x['received_canonical_packet_id']+'.json';y['received_canonical_file']=fname
  if not (d/fname).exists():shutil.copyfile(R/x['received_canonical_file'],d/fname)
  if str(d/fname) not in json.loads((d/'metadata.json').read_text())['read_allowlist'] and fname not in added:added.append(fname)
  received.append(y)
 (d/'received-handoff-index.json').write_text(json.dumps({'entries':received},ensure_ascii=False,indent=2)+'\n');added.append('received-handoff-index.json')
 ledger=json.loads((R/'blind-raw-checks'/case/'raw-check-ledger.json').read_text());requests=[]
 for x in ledger['claims']:
  requests.append({'claim_id':x['claim_id'],'packet_id':x['packet_id'],'claim_question':x['claim'],'audit_target_ids':x['audit_target_ids'],'review_file':x['packet_id']+'-review.json'})
 (d/'raw-check-requests.json').write_text(json.dumps({'claims':requests},ensure_ascii=False,indent=2)+'\n');added.append('raw-check-requests.json')
 for pid in sorted({x['packet_id'] for x in ledger['claims']}):
  rm=json.loads((R/'blind-raw-checks'/pid/'metadata.json').read_text())
  if rm['status']!='success':raise ValueError('raw review not mechanically validated '+pid)
  fname=pid+'-review.json';shutil.copyfile(R/'blind-raw-checks'/pid/'review.json',d/fname);added.append(fname)
 e=(d/'envelope.txt').read_text();e+='追加input read allowlistは '+', '.join(added)+' です。received-handoff-index.jsonの実際受領canonicalをStage3 probe独自発明の比較基準にしてください。full Stage2 canonicalはStage2品質採点に保持し、実handoffにない意味をfull Stage2だけで受領済みと扱わないでください。匿名raw reviewerの局所引用は原canonicalのIDに対応する文脈補足です。raw-check-requests.jsonの全claim_idを各1回ずつ、別top-level raw_check_resolutionsへ返してください。schemaは各 {claim_id,status:"resolved"|"artifact_ambiguous"|"pending",judgment:"根拠付き判断",raw_quote_refs:[{review_file:"P035-review.json",canonical_id:"F19"}],affected_metrics:[]} です。根拠quote/IDに対応させ、本質的に曖昧ならartifact_ambiguousと影響metric名を残し、0/確定に強制しないでください。affected_metricsは元scores field名（source_facts_preserved, answer_facts_preserved, downstream_facts_preserved, probe_inventions, unauthorized_decisions, unsupported_additions, unresolved_leakage等）で返してください。数値の旧scoreは提供されていません。新しいpending concernは別に残し、同じ不明点を無限retryで消す運用をしないでください。元scores fieldsと固定metric/oracleは維持してください。'
 (d/'envelope.txt').write_text(e);mp=d/'metadata.json';m=json.loads(mp.read_text());m['read_allowlist']+=[str(d/f) for f in added];m['input_sha256'].update({f:h(d/f) for f in added});m.update(envelope_sha256=h(d/'envelope.txt'),final_contextual_score=True,attempt_number=previous_attempt_number+1,original_attempts=sorted(x.name for x in d.glob('attempt-*') if x.is_dir()));mp.write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n');print(e)
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
  if m.get('final_contextual_score'):
   requests=json.loads((d/'raw-check-requests.json').read_text())['claims'];claimids={x['claim_id'] for x in requests};resolvedids=[]
   for resolution in result.get('raw_check_resolutions',[]):
    cid=resolution.get('claim_id');resolvedids.append(cid)
    if cid not in claimids or resolution.get('status') not in ['resolved','artifact_ambiguous','pending'] or not resolution.get('judgment'):errors.append('invalid raw resolution '+str(cid))
    if not isinstance(resolution.get('affected_metrics'),list):errors.append('invalid affected_metrics '+str(cid))
    if resolution.get('status')=='artifact_ambiguous' and not resolution.get('affected_metrics'):errors.append('ambiguous without affected_metrics '+str(cid))
    refs=resolution.get('raw_quote_refs')
    if not isinstance(refs,list) or not refs:errors.append('missing resolution quote refs '+str(cid));continue
    for ref in refs:
     file=ref.get('review_file');path=d/str(file)
     if str(path) not in m['read_allowlist']:errors.append('invalid resolution review_file '+str(cid));continue
     review=json.loads(path.read_text());reviewids={x['canonical_id'] for x in review['checks'] if x.get('evidence')}
     if ref.get('canonical_id') not in reviewids:errors.append('invalid resolution canonical_id '+str(cid))
   if set(resolvedids)!=claimids or len(resolvedids)!=len(claimids):errors.append('raw resolution claim coverage mismatch')
  if not m.get('final_contextual_score'):
   ld=R/'blind-raw-checks'/case;ld.mkdir(parents=True,exist_ok=True);lp=ld/'raw-check-ledger.json'
   ledger=json.loads(lp.read_text()) if lp.exists() else {'case_id':case,'claims':[],'policy':'Initial and subsequent uncertainty remains pending until quote audit and evaluator resolution; judge replacement alone does not clear flags.'}
   seenclaims={x['claim_id'] for x in ledger['claims']};attempt='attempt-'+str(m.get('attempt_number',1)).zfill(3)
   for score in result['scores']:
    for n,claim in enumerate(score['needs_raw_check'],1):
     cid=attempt+'-'+score['packet_id']+'-'+str(n)
     if cid not in seenclaims:ledger['claims'].append({'claim_id':cid,'source_attempt':attempt,'packet_id':score['packet_id'],'claim':claim,'audit_target_ids':[],'raw_audit_evidence':[],'resolution_status':'pending','final_evaluator_resolution':None})
   lp.write_text(json.dumps(ledger,ensure_ascii=False,indent=2)+'\n')
  m['needs_raw_check_summary']=nr
 except Exception as ex:errors.append(type(ex).__name__+': '+str(ex))
 m.update(status='success' if not errors else 'mechanical_failed',finished_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),mechanical_errors=errors,output_sha256={f:h(d/f) for f in ['scores.json','raw-response.md','read-log.jsonl'] if (d/f).exists()})
 p.write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'case_id':case,'errors':errors,'needs_raw_check':m.get('needs_raw_check_summary',[])},ensure_ascii=False))
if __name__=='__main__':{'final_setup':lambda:final_setup(sys.argv[2]),'setup':lambda:setup(sys.argv[2]),'update':lambda:update(sys.argv[2],sys.argv[3]),'finish':lambda:finish(sys.argv[2])}[sys.argv[1]]()
