import pathlib,json,csv,collections,sys,importlib.util
ROOT=pathlib.Path(__file__).resolve().parent
BASE=ROOT/'benchmark-preparation'
cases={c['id']:c for c in json.loads((BASE/'cases.json').read_text())['cases']}
mapping={r['blind_id']:r for r in json.loads((ROOT/'blind-mapping.json').read_text())}
downstream=json.loads((BASE/'downstream-denominators.json').read_text())['cases']
spec=importlib.util.spec_from_file_location('availability',ROOT/'availability-report.py')
availability=importlib.util.module_from_spec(spec);spec.loader.exec_module(availability)

def checked_set(values,allowed,context):
    values=set(values or []);extras=values-set(allowed)
    if extras:raise ValueError(f'{context}: non-oracle IDs/facts {sorted(extras)}')
    return values

def compute():
    rows=[];seen=set();eligibility={r['blind_id']:r for r in availability.report()['rows']}
    for p in sorted((ROOT/'blind-evaluation').glob('C*/scores.json')):
        d=json.loads(p.read_text());case=cases[d['case_id']];o=case['oracle']
        ledger_file=ROOT/'blind-raw-checks'/case['id']/'raw-check-ledger.json'
        claims=json.loads(ledger_file.read_text()).get('claims',[]) if ledger_file.exists() else []
        resolutions=d.get('raw_check_resolutions',[])
        resolution_ids=[x['claim_id'] for x in resolutions]
        if len(resolution_ids)!=len(set(resolution_ids)):raise ValueError('duplicate raw-check resolution')
        if set(resolution_ids)-{x['claim_id'] for x in claims}:raise ValueError('unknown raw-check resolution')
        resolution_by_id={x['claim_id']:x for x in resolutions}
        for resolution in resolutions:
            if resolution.get('status') not in ['resolved','artifact_ambiguous','pending']:raise ValueError('invalid raw-check resolution status')
            if resolution['status']=='pending':continue
            if not resolution.get('judgment') or not resolution.get('raw_quote_refs'):raise ValueError('raw-check resolution lacks evidence')
            for ref in resolution['raw_quote_refs']:
                ref_file=p.parent/ref['review_file']
                if not ref_file.resolve().is_relative_to(p.parent.resolve()) or not ref_file.is_file() or not ref.get('canonical_id'):
                    raise ValueError('invalid raw-review reference')
        unknowns=[x['id'] for x in o['critical_unknowns']]
        source=o['confirmed_source'];answers=o['answer_facts']
        pool=list(dict.fromkeys(source+answers))
        for s in d['scores']:
            if s['packet_id'] in seen:raise ValueError('duplicate scored packet '+s['packet_id'])
            seen.add(s['packet_id'])
            link=mapping[s['packet_id']]
            assert link['case']==case['id'] and link['stage']==s['stage']
            required=['unknown_ids_found','actionable_unknown_ids','source_facts_preserved','answer_facts_preserved','unauthorized_decisions','unsupported_additions','unresolved_leakage','redundant_questions','downstream_facts_preserved','probe_inventions','needs_raw_check']
            for key in required:
                if key not in s or not isinstance(s[key],list):raise ValueError(f'{s["packet_id"]}: missing/invalid {key}')
            cp=ROOT/'canonical-extractions'/s['packet_id']/'canonical.json'
            canonical=json.loads(cp.read_text())
            ids={x['id'] for group in ['facts','questions'] for x in canonical.get(group,[])}
            coverage=s.get('coverage_evidence')
            coverage_keys=['unknown_ids_found','actionable_unknown_ids','source_facts_preserved','answer_facts_preserved','downstream_facts_preserved']
            if not isinstance(coverage,dict):raise ValueError(f'{s["packet_id"]}: missing coverage_evidence object')
            for key in coverage_keys:
                evidence=coverage.get(key)
                if not isinstance(evidence,dict) or set(evidence)!=set(s[key]):
                    raise ValueError(f'{s["packet_id"]}: coverage evidence keys mismatch for {key}')
                for claim,claim_ids in evidence.items():
                    if not isinstance(claim_ids,list) or not claim_ids or set(claim_ids)-ids:
                        raise ValueError(f'{s["packet_id"]}: invalid coverage evidence for {key}: {claim}')
            count_keys=['unauthorized_decisions','unsupported_additions','unresolved_leakage','redundant_questions','probe_inventions']
            if case['id']=='C5':
                if not isinstance(s.get('unapproved_architecture_promotion'),list):raise ValueError(f'{s["packet_id"]}: missing architecture promotion list')
                if s.get('implementation_viability')!='not_executed':raise ValueError(f'{s["packet_id"]}: implementation was not tested')
                count_keys.append('unapproved_architecture_promotion')
            for key in count_keys:
                for item in s[key]:
                    if not item.get('meaning') or not item.get('evidence_ids') or set(item['evidence_ids'])-ids:
                        raise ValueError(f'{s["packet_id"]}: invalid evidence for {key}')
            u=checked_set(s.get('unknown_ids_found'),unknowns,s['packet_id'])
            q=checked_set(s.get('actionable_unknown_ids'),unknowns,s['packet_id'])
            f=checked_set(s.get('source_facts_preserved'),source,s['packet_id'])
            a=checked_set(s.get('answer_facts_preserved'),answers,s['packet_id'])
            ds_pool=downstream[case['id']]['included_facts']
            ds=checked_set(s.get('downstream_facts_preserved'),ds_pool,s['packet_id'])
            row={**link,'unknown_found':len(u),'unknown_total':len(unknowns),'actionable_found':len(q),'source_preserved':len(f),'source_total':len(source),'post_answer_preserved':len(f|a),'post_answer_total':len(pool),'downstream_preserved':len(ds),'downstream_total':len(pool),'unauthorized_decisions':len(s.get('unauthorized_decisions',[])),'unresolved_leakage':len(s.get('unresolved_leakage',[])),'unsupported_additions':len(s.get('unsupported_additions',[])),'redundant_questions':len(s.get('redundant_questions',[])),'probe_inventions':len(s.get('probe_inventions',[])),'correct_stop':s.get('correct_stop'),'needs_raw_check':len(s.get('needs_raw_check',[]))}
            row['downstream_total']=len(ds_pool)
            row['score_status']='needs_raw_check' if s['needs_raw_check'] else 'scored'
            packet_claims=[x for x in claims if x['packet_id']==s['packet_id']]
            pending_claims=[x['claim_id'] for x in packet_claims if resolution_by_id.get(x['claim_id'],{}).get('status','pending')=='pending']
            ambiguous=[]
            for claim in packet_claims:
                resolution=resolution_by_id.get(claim['claim_id'],{})
                if resolution.get('status')=='artifact_ambiguous':
                    if not resolution.get('affected_metrics'):raise ValueError('ambiguous judgment lacks affected metrics')
                    ambiguous.extend(resolution['affected_metrics'])
            row['pending_raw_claims']=pending_claims
            row['ambiguous_metrics']=sorted(set(ambiguous))
            if pending_claims:row['score_status']='needs_raw_check'
            elif ambiguous and not s['needs_raw_check']:row['score_status']='scored_with_ambiguity'
            row['strict_primary_eligible']=eligibility[s['packet_id']]['primary_quality_eligible']
            row['source_clean_exploratory_eligible']=eligibility[s['packet_id']]['source_clean_exploratory_eligible']
            stage=s['stage']
            if stage!='s1':
                for key in ['unknown_found','unknown_total','actionable_found','source_preserved','source_total','redundant_questions','correct_stop']:row[key]=None
            elif not unknowns:
                row['unknown_found']=row['unknown_total']=row['actionable_found']=None
            if stage!='s2':row['post_answer_preserved']=row['post_answer_total']=None
            if stage!='s3':row['downstream_preserved']=row['downstream_total']=row['probe_inventions']=None
            if stage=='s1':row['unresolved_leakage']=None
            if case['id']!='C4' or stage!='s1':row['correct_stop']=None
            row['architecture_input_required']=s.get('architecture_input_required') if case['id']=='C5' else None
            row['unapproved_architecture_promotion']=len(s.get('unapproved_architecture_promotion',[])) if case['id']=='C5' else None
            row['handoff_readiness']=s.get('handoff_readiness') if case['id']=='C5' else None
            row['implementation_viability']='not_executed' if case['id']=='C5' else None
            metric_columns={'unknown_ids_found':['unknown_found'],'actionable_unknown_ids':['actionable_found'],'source_facts_preserved':['source_preserved','post_answer_preserved'],'answer_facts_preserved':['post_answer_preserved'],'downstream_facts_preserved':['downstream_preserved'],'unauthorized_decisions':['unauthorized_decisions'],'unsupported_additions':['unsupported_additions'],'unresolved_leakage':['unresolved_leakage'],'probe_inventions':['probe_inventions'],'redundant_questions':['redundant_questions'],'correct_stop':['correct_stop'],'architecture_input_required':['architecture_input_required'],'unapproved_architecture_promotion':['unapproved_architecture_promotion'],'handoff_readiness':['handoff_readiness']}
            for metric in row['ambiguous_metrics']:
                if metric not in metric_columns:raise ValueError('unknown ambiguous metric '+metric)
                for column in metric_columns[metric]:row[column]=None
            files=__import__('packetize').files_for(link['arm'],case['id'],link['replicate'],stage)
            artifacts=[p for p,rel in files if rel not in ['raw-response.md','response']]
            responses=[p for p,rel in files if rel in ['raw-response.md','response']]
            row['artifact_bytes']=sum(p.stat().st_size for p in artifacts)
            row['artifact_files']=len(artifacts)
            row['response_bytes']=sum(p.stat().st_size for p in responses)
            rows.append(row)
    return rows

if __name__=='__main__':
    rows=compute();out=ROOT/'evaluation-result';out.mkdir(exist_ok=True)
    if '--require-complete' in sys.argv:
        planned=availability.report()['rows']
        incomplete=[r['blind_id'] for r in planned if not r['technical_complete'] and (r['execution_status'] in ['pending','running','prepared','unknown'] or r['continuation_status'] in ['pending','running','pending_upstream_continuation'])]
        if incomplete:raise ValueError('incomplete planned slots: '+','.join(incomplete))
        expected={r['blind_id'] for r in planned if r['source_clean_exploratory_eligible']}
        found={r['blind_id'] for r in rows}
        if expected!=found:raise ValueError(f'score coverage mismatch: missing={sorted(expected-found)}, extra={sorted(found-expected)}')
        unresolved=[r['blind_id'] for r in rows if r['score_status'] not in ['scored','scored_with_ambiguity']]
        if unresolved:raise ValueError('unresolved raw checks: '+','.join(unresolved))
    (out/'unblinded-scores.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
    if rows:
        with (out/'scores.csv').open('w') as f:
            w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
        pairs=[];strict_pairs=[]
        groups=collections.defaultdict(dict)
        for r in rows:groups[(r['case'],r['replicate'],r['stage'])][r['arm']]=r
        for (case,replicate,stage),arms in sorted(groups.items()):
            if set(arms)!= {'alder','rdra'}:continue
            if any(r['score_status'] not in ['scored','scored_with_ambiguity'] for r in arms.values()):continue
            pair={'case':case,'replicate':replicate,'stage':stage,'alder':arms['alder'],'rdra':arms['rdra']}
            if all(r['source_clean_exploratory_eligible'] for r in arms.values()):pairs.append(pair)
            if all(r['strict_primary_eligible'] for r in arms.values()):strict_pairs.append(pair)
        (out/'exploratory-paired-scores.json').write_text(json.dumps(pairs,ensure_ascii=False,indent=2)+'\n')
        (out/'strict-primary-paired-scores.json').write_text(json.dumps(strict_pairs,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'scored_packets':len(rows)},ensure_ascii=False))
