import pathlib,json,hashlib,datetime,sys
R=pathlib.Path(__file__).resolve().parent
def h(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def finish(case):
 d=R/'blind-evaluation'/case;mp=d/'metadata.json';m=json.loads(mp.read_text());errors=[]
 try:
  score=json.loads((d/'scores.json').read_text());o=json.loads((d/'raw-flag-dispositions.json').read_text());raw=json.loads((d/'raw-flag-response.md').read_text());claims={x['claim_id']:x for x in score['raw_check_resolutions']};ledger_path=R/'blind-raw-checks'/case/'raw-check-ledger.json';ledger=json.loads(ledger_path.read_text());claim_packets={x['claim_id']:x['packet_id'] for x in ledger['claims']}
  fields={k for s in score['scores'] for k in s}
  extra=d/'additional-raw-check-resolutions.json'
  if extra.exists():
   supplement=json.loads(extra.read_text());requests=json.loads((d/'additional-raw-check-requests.json').read_text())['claims'];requested={x['claim_id']:x for x in requests};extra_seen=set()
   if supplement.get('case_id')!=case:errors.append('additional resolution case mismatch')
   for x in supplement.get('raw_check_resolutions',[]):
    cid=x.get('claim_id')
    if cid in claims or cid in extra_seen or cid not in requested:errors.append('duplicate/unexpected additional claim '+str(cid));continue
    extra_seen.add(cid)
    if cid not in claim_packets or x.get('status') not in ['resolved','artifact_ambiguous','pending'] or not x.get('judgment'):errors.append('invalid additional resolution '+str(cid))
    if not isinstance(x.get('affected_metrics'),list) or set(x.get('affected_metrics',[]))-fields:errors.append('invalid additional affected metrics '+str(cid))
    if x.get('status')=='artifact_ambiguous' and not x.get('affected_metrics'):errors.append('additional ambiguity without metrics')
    if not x.get('raw_quote_refs'):errors.append('additional resolution without quote refs')
    for ref in x.get('raw_quote_refs',[]):
     rp=d/str(ref.get('review_file'))
     if str(rp) not in m['read_allowlist']:errors.append('additional review outside allowlist');continue
     review=json.loads(rp.read_text());valid={c['canonical_id'] for c in review['checks'] if c.get('evidence')}
     if review.get('packet_id')!=claim_packets.get(cid) or ref.get('canonical_id') not in valid:errors.append('additional review ID/packet mismatch')
    claims[cid]=x
   if extra_seen!=set(requested):errors.append('additional claim coverage mismatch')
  expected={(s['packet_id'],i) for s in score['scores'] for i,_ in enumerate(s.get('needs_raw_check',[]))};seen=set()
  if o!=raw or o.get('case_id')!=case:errors.append('response mismatch')
  for x in o['flags']:
   key=(x['packet_id'],x['flag_index'])
   if key not in expected or key in seen:errors.append('unexpected/duplicate flag '+str(key))
   seen.add(key)
   if x['disposition'] not in ['resolved_context_note','artifact_ambiguous','new_pending'] or not x.get('judgment'):errors.append('invalid disposition/judgment')
   if not x.get('claim_ids'):errors.append('empty claim IDs')
   for c in x['claim_ids']:
    if c not in claims or claim_packets.get(c)!=x['packet_id']:errors.append('unknown/outside packet claim '+c)
   for f in x.get('affected_metrics',[]):
    if f not in fields:errors.append('unknown metric '+f)
   if x['disposition']=='artifact_ambiguous' and not x.get('affected_metrics'):errors.append('missing ambiguity metrics')
  if seen!=expected:errors.append('flag coverage mismatch')
  allow=set(m['read_allowlist'])|{str(d/f) for f in ['scores.json','raw-response.md','read-log.jsonl','raw-flag-dispositions.json','raw-flag-response.md','raw-flag-read-log.jsonl','additional-raw-check-resolutions.json','architecture-assessments.json','score-correction.json','supplement-response.md']}
  for line in (d/'raw-flag-read-log.jsonl').read_text().splitlines():
   ev=json.loads(line);f=ev.get('path',ev.get('input_path',ev.get('file')))
   if not f or str(pathlib.Path(f).resolve() if pathlib.Path(f).is_absolute() else (d/f).resolve()) not in allow:errors.append('outside read '+str(f))
  for f,v in m['raw_flag_followup']['original_output_sha256'].items():
   if h(d/f)!=v:errors.append('original output changed '+f)
 except Exception as ex:errors.append(type(ex).__name__+': '+str(ex))
 now=datetime.datetime.now(datetime.timezone.utc).isoformat();m['raw_flag_followup'].update(status='success' if not errors else 'mechanical_failed',finished_at=now,mechanical_errors=errors,output_sha256={f:h(d/f) for f in ['raw-flag-dispositions.json','raw-flag-response.md','raw-flag-read-log.jsonl','additional-raw-check-resolutions.json','architecture-assessments.json','score-correction.json','supplement-response.md'] if (d/f).exists()});mp.write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n')
 if not errors:
  ledger['raw_flag_dispositions']=o['flags'];ledger['raw_flag_dispositions_mechanical_transfer_at']=now;ledger_path.write_text(json.dumps(ledger,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps({'case_id':case,'errors':errors},ensure_ascii=False))
if __name__=='__main__':finish(sys.argv[1])
