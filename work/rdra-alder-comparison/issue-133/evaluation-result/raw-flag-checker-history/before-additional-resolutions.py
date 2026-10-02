import pathlib,json,hashlib,datetime,sys
R=pathlib.Path(__file__).resolve().parent
def h(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def finish(case):
 d=R/'blind-evaluation'/case;mp=d/'metadata.json';m=json.loads(mp.read_text());errors=[]
 try:
  score=json.loads((d/'scores.json').read_text());o=json.loads((d/'raw-flag-dispositions.json').read_text());raw=json.loads((d/'raw-flag-response.md').read_text());claims={x['claim_id']:x for x in score['raw_check_resolutions']};ledger_path=R/'blind-raw-checks'/case/'raw-check-ledger.json';ledger=json.loads(ledger_path.read_text());claim_packets={x['claim_id']:x['packet_id'] for x in ledger['claims']}
  expected={(s['packet_id'],i) for s in score['scores'] for i,_ in enumerate(s.get('needs_raw_check',[]))};seen=set();fields={k for s in score['scores'] for k in s}
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
  allow=set(m['read_allowlist'])|{str(d/f) for f in ['scores.json','raw-response.md','read-log.jsonl','raw-flag-dispositions.json','raw-flag-response.md','raw-flag-read-log.jsonl']}
  for line in (d/'raw-flag-read-log.jsonl').read_text().splitlines():
   ev=json.loads(line);f=ev.get('path',ev.get('input_path',ev.get('file')))
   if not f or str(pathlib.Path(f).resolve() if pathlib.Path(f).is_absolute() else (d/f).resolve()) not in allow:errors.append('outside read '+str(f))
  for f,v in m['raw_flag_followup']['original_output_sha256'].items():
   if h(d/f)!=v:errors.append('original output changed '+f)
 except Exception as ex:errors.append(type(ex).__name__+': '+str(ex))
 now=datetime.datetime.now(datetime.timezone.utc).isoformat();m['raw_flag_followup'].update(status='success' if not errors else 'mechanical_failed',finished_at=now,mechanical_errors=errors,output_sha256={f:h(d/f) for f in ['raw-flag-dispositions.json','raw-flag-response.md','raw-flag-read-log.jsonl'] if (d/f).exists()});mp.write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n')
 if not errors:
  ledger['raw_flag_dispositions']=o['flags'];ledger['raw_flag_dispositions_mechanical_transfer_at']=now;ledger_path.write_text(json.dumps(ledger,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps({'case_id':case,'errors':errors},ensure_ascii=False))
if __name__=='__main__':finish(sys.argv[1])
