"""Report every planned slot, including unavailable outputs, without semantic imputation."""
import json,pathlib,collections
ROOT=pathlib.Path(__file__).resolve().parent
mapping=json.loads((ROOT/'blind-mapping.json').read_text())

def read(p):
    return json.loads(p.read_text()) if p.exists() else {}

def report():
    alder=read(ROOT/'primary-runs/alder/manifest.json')
    ar={(x['case'],x['replicate'],x['stage']):x for x in alder.get('runs',[])}
    rows=[]
    for m in mapping:
        base=ROOT/'primary-runs'/m['arm']/m['case']/f'r{m["replicate"]}'/m['stage']
        if m['stage']=='s3':
            d=read(ROOT/'blind-probes'/m['blind_id']/'metadata.json') or read(base/'manifest.json')
        elif m['arm']=='alder':
            d=ar.get((m['case'],m['replicate'],m['stage']),{})
        else:d=read(base/'manifest.json')
        status=d.get('status','pending')
        valid=status in ['success','complete']
        extraction=read(ROOT/'canonical-extractions'/m['blind_id']/'metadata.json')
        rows.append({**m,'execution_status':status,'primary_quality_eligible':valid,'canonical_status':extraction.get('status','pending'),'reason':d.get('reason') or d.get('failure_reason')})
    counts=collections.Counter((r['arm'],r['stage'],r['execution_status']) for r in rows)
    return {'planned_packets':len(rows),'rows':rows,'counts':[{'arm':a,'stage':s,'status':t,'count':n} for (a,s,t),n in sorted(counts.items())],'limits':['Failed/unavailable slots are retained in availability denominator, never silently scored as zero coverage. A protocol violation is not proof of business-quality or native-method failure.']}

if __name__=='__main__':
    d=report();out=ROOT/'evaluation-result';out.mkdir(exist_ok=True)
    (out/'availability.json').write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'planned_packets':d['planned_packets'],'counts':d['counts']},ensure_ascii=False))
