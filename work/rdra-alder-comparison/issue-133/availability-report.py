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
            classification=ROOT/'blind-probes'/m['blind_id']/'metadata.json'
        elif m['arm']=='alder':
            d=ar.get((m['case'],m['replicate'],m['stage']),{})
            classification=ROOT/'primary-runs/alder/manifest.json'
        else:
            d=read(base/'manifest.json')
            classification=base/'manifest.json'
        status=d.get('status','pending')
        complete=bool(d.get('technical_complete',status in ['success','complete']))
        strict=bool(d.get('strict_protocol_eligible',status in ['success','complete']))
        source_clean=bool(d.get('source_clean_exploratory_eligible',status in ['success','complete']))
        continuation=d.get('exploratory_continuation_status')
        if m['stage']=='s3':
            if m['arm']=='alder':up=ar.get((m['case'],m['replicate'],'s2'),{})
            else:up=read(base.parent/'s2/manifest.json')
            strict=strict and bool(up.get('strict_protocol_eligible',up.get('status') in ['success','complete']))
            source_clean=source_clean and bool(up.get('source_clean_exploratory_eligible',up.get('status') in ['success','complete']))
            if not complete and up.get('exploratory_continuation_status')=='running':continuation='pending_upstream_continuation'
        extraction=read(ROOT/'canonical-extractions'/m['blind_id']/'metadata.json')
        generation_strict=complete and strict
        extraction_strict=extraction.get('strict_delivery_protocol_eligible',True) and extraction.get('strict_protocol_eligible',True)
        source_clean=source_clean and extraction.get('source_clean_exploratory_eligible',True)
        upstream=(ROOT/'primary-runs/alder/manifest.json' if m['arm']=='alder' else base.parent/'s2/manifest.json') if m['stage']=='s3' else None
        rows.append({**m,'execution_status':status,'continuation_status':continuation,'technical_complete':complete,'generation_primary_eligible':generation_strict,'primary_quality_eligible':generation_strict and extraction_strict,'source_clean_exploratory_eligible':complete and source_clean,'canonical_status':extraction.get('status','pending'),'canonical_strict_delivery_protocol_eligible':extraction.get('strict_delivery_protocol_eligible',True),'reason':d.get('reason') or d.get('failure_reason'),'classification_metadata_path':str(classification.relative_to(ROOT)),'canonical_classification_metadata_path':str((ROOT/'canonical-extractions'/m['blind_id']/'metadata.json').relative_to(ROOT)),'upstream_classification_metadata_path':str(upstream.relative_to(ROOT)) if upstream else None})
    counts=collections.Counter((r['arm'],r['stage'],r['execution_status']) for r in rows)
    groups=collections.defaultdict(list)
    for r in rows:groups[(r['arm'],r['stage'])].append(r)
    eligibility_counts=[{'arm':a,'stage':s,'planned':len(rs),'technical_complete':sum(r['technical_complete'] for r in rs),'strict_primary_eligible':sum(r['primary_quality_eligible'] for r in rs),'source_clean_exploratory_eligible':sum(r['source_clean_exploratory_eligible'] for r in rs)} for (a,s),rs in sorted(groups.items())]
    return {'planned_packets':len(rows),'rows':rows,'counts':[{'arm':a,'stage':s,'status':t,'count':n} for (a,s,t),n in sorted(counts.items())],'eligibility_counts':eligibility_counts,'limits':['Failed/unavailable slots are retained in availability denominator, never silently scored as zero coverage. A protocol violation is not proof of business-quality or native-method failure.']}

if __name__=='__main__':
    d=report();out=ROOT/'evaluation-result';out.mkdir(exist_ok=True)
    (out/'availability.json').write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'planned_packets':d['planned_packets'],'counts':d['counts']},ensure_ascii=False))
