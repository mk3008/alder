import pathlib,json,csv,collections
ROOT=pathlib.Path(__file__).resolve().parent
BASE=ROOT/'benchmark-preparation'
cases={c['id']:c for c in json.loads((BASE/'cases.json').read_text())['cases']}
mapping={r['blind_id']:r for r in json.loads((ROOT/'blind-mapping.json').read_text())}
downstream=json.loads((BASE/'downstream-denominators.json').read_text())['cases']

def checked_set(values,allowed,context):
    values=set(values or []);extras=values-set(allowed)
    if extras:raise ValueError(f'{context}: non-oracle IDs/facts {sorted(extras)}')
    return values

def compute():
    rows=[]
    for p in sorted((ROOT/'blind-evaluation').glob('C*/scores.json')):
        d=json.loads(p.read_text());case=cases[d['case_id']];o=case['oracle']
        unknowns=[x['id'] for x in o['critical_unknowns']]
        source=o['confirmed_source'];answers=o['answer_facts']
        pool=list(dict.fromkeys(source+answers))
        for s in d['scores']:
            link=mapping[s['packet_id']]
            assert link['case']==case['id'] and link['stage']==s['stage']
            u=checked_set(s.get('unknown_ids_found'),unknowns,s['packet_id'])
            q=checked_set(s.get('actionable_unknown_ids'),unknowns,s['packet_id'])
            f=checked_set(s.get('source_facts_preserved'),source,s['packet_id'])
            a=checked_set(s.get('answer_facts_preserved'),answers,s['packet_id'])
            ds_pool=downstream[case['id']]['included_facts']
            ds=checked_set(s.get('downstream_facts_preserved'),ds_pool,s['packet_id'])
            row={**link,'unknown_found':len(u),'unknown_total':len(unknowns),'actionable_found':len(q),'source_preserved':len(f),'source_total':len(source),'post_answer_preserved':len(f|a),'post_answer_total':len(pool),'downstream_preserved':len(ds),'downstream_total':len(pool),'unauthorized_decisions':len(s.get('unauthorized_decisions',[])),'unresolved_leakage':len(s.get('unresolved_leakage',[])),'unsupported_additions':len(s.get('unsupported_additions',[])),'redundant_questions':len(s.get('redundant_questions',[])),'probe_inventions':len(s.get('probe_inventions',[])),'correct_stop':s.get('correct_stop'),'needs_raw_check':len(s.get('needs_raw_check',[]))}
            row['downstream_total']=len(ds_pool)
            rows.append(row)
    return rows

if __name__=='__main__':
    rows=compute();out=ROOT/'evaluation-result';out.mkdir(exist_ok=True)
    (out/'unblinded-scores.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
    if rows:
        with (out/'scores.csv').open('w') as f:
            w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
    print(json.dumps({'scored_packets':len(rows)},ensure_ascii=False))
