"""Count recorded successful dispatches, not repeated lifecycle log entries."""
import pathlib,json
ROOT=pathlib.Path(__file__).resolve().parent

def read(p):return json.loads(p.read_text()) if p.exists() else {}

def count():
    ids={k:set() for k in ['alder_authoring','rdra_nodes','downstream_probes','canonical_extractions','score_evaluators','raw_reviewers','handoff_extractions']}
    for r in read(ROOT/'primary-runs/alder/manifest.json').get('runs',[]):
        if r.get('agent_id'):ids['alder_authoring'].add(r['agent_id'])
    for p in (ROOT/'primary-runs/rdra').glob('C*/r*/s[12]/invocations.jsonl'):
        for line in p.read_text().splitlines():
            r=json.loads(line)
            if r.get('agent_id'):ids['rdra_nodes'].add(r['agent_id'])
    for p in (ROOT/'primary-runs/rdra').glob('C*/r*/s[12]/manifest.json'):
        for r in read(p).get('nodes',{}).values():
            if r.get('agent_id'):ids['rdra_nodes'].add(r['agent_id'])
    for folder,key,pattern in [('blind-probes','downstream_probes','P*/metadata.json'),('canonical-extractions','canonical_extractions','P*/metadata.json'),('blind-evaluation','score_evaluators','C*/metadata.json'),('blind-raw-checks','raw_reviewers','P*/metadata.json'),('handoff-extractions','handoff_extractions','H*/metadata.json')]:
        paths=set((ROOT/folder).glob(pattern))
        paths.update(p for p in (ROOT/folder).rglob('*.json') if 'metadata' in p.name)
        for p in paths:
            d=read(p)
            if d.get('agent_id'):ids[key].add(d['agent_id'])
    return {'recorded_dispatch_counts':{k:len(v) for k,v in ids.items()},'agent_ids':{k:sorted(v) for k,v in ids.items()},'planned_authoring_nodes':{'alder':20,'rdra':360},'planned_probes':20,'limits':['Counts are unique recorded agent identifiers (Fresh spawns), not total model turns: output-return followups on an existing agent are not new Fresh identifiers. They are not independently attested provider token use, billing, or effective runtime settings. Dispatch failures without an agent identifier are reported in separate failure metadata. Coordinator calls and native preflight are not business generation calls.']}

if __name__=='__main__':
    d=count();out=ROOT/'evaluation-result';out.mkdir(exist_ok=True)
    (out/'call-counts.json').write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(d['recorded_dispatch_counts']))
