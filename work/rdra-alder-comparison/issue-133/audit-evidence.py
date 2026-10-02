import pathlib,json,hashlib,collections
ROOT=pathlib.Path(__file__).resolve().parent
SOURCE=json.loads((ROOT/'benchmark-preparation/source-manifest.json').read_text())
RDRA_PINS={x['path'].removeprefix('RDRAAgent_v0.8/'):x['sha256'] for x in SOURCE['files']}
ALDER_PINS={x['path'].removeprefix('plugins/alder/skills/alder-draft-business-design/'):x['sha256'] for x in SOURCE['alder']['files']}
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()

def audit():
    result={'alder':collections.Counter(),'rdra':collections.Counter(),'rdra_stage3':collections.Counter(),'rdra_nodes':collections.Counter(),'reported_strict_guard_deviations':[],'issues':[],'limits':['Requested settings and self-reported read-log are not independent attestation.']}
    ap=ROOT/'primary-runs/alder/manifest.json'
    if ap.exists():
        m=json.loads(ap.read_text())
        for r in m.get('runs',[]):
            result['alder'][r.get('status','unknown')]+=1
            if r.get('status')!='success':continue
            if r.get('strict_protocol_eligible') is False:result['reported_strict_guard_deviations'].append({'run':r['root'],'kind':'self_generated_output_read','source_clean_exploratory_eligible':r.get('source_clean_exploratory_eligible')})
            base=ROOT/r['root']
            checks=[('artifact_sha256',base/'docs/business-design/design.md'),('raw_response_sha256',base/'raw-response.md'),('read_log_sha256',base/'read-log.jsonl')]
            for field,p in checks:
                if not p.exists() or (field in r and digest(p)!=r[field]):result['issues'].append({'run':r['root'],'field':field,'problem':'missing_or_hash_mismatch'})
            source=ROOT/r['source_fixture']
            if not source.exists() or digest(source)!=r['source_sha256']:result['issues'].append({'run':r['root'],'problem':'source_fixture_mismatch'})
            if digest(base/'source.txt')!=r['source_sha256']:result['issues'].append({'run':r['root'],'problem':'source_copy_mismatch'})
            for rel,expected in r.get('method_sha256',{}).items():
                if expected!=ALDER_PINS.get(rel):result['issues'].append({'run':r['root'],'problem':'method_pin_mismatch','path':rel})
                f=base/'method/alder-draft-business-design'/rel
                if not f.exists() or digest(f)!=expected:result['issues'].append({'run':r['root'],'problem':'method_copy_mismatch','path':rel})
    for p in sorted((ROOT/'primary-runs/rdra').glob('C*/r*/s*/manifest.json')):
        m=json.loads(p.read_text())
        if p.parent.name=='s3':
            result['rdra_stage3'][m.get('status','unknown')]+=1
            continue
        result['rdra'][m.get('status','unknown')]+=1
        if m.get('strict_protocol_eligible') is False and m.get('status')=='protocol_failed':result['reported_strict_guard_deviations'].append({'run':str(p.relative_to(ROOT)),'kind':'reported_wrapper_deviation','source_clean_exploratory_eligible':m.get('source_clean_exploratory_eligible')})
        for name,n in m.get('nodes',{}).items():
            result['rdra_nodes'][n.get('status','unknown')]+=1
            for attr in ['unchanged_prompt_hash']:
                if n.get(attr) is False:result['issues'].append({'run':str(p.relative_to(ROOT)),'node':name,'problem':attr})
            if any(v is False for v in n.get('unchanged_input_hashes',{}).values()):result['issues'].append({'run':str(p.relative_to(ROOT)),'node':name,'problem':'changed_input'})
            if n.get('read_log_validity',{}).get('outside_allowlist'):result['issues'].append({'run':str(p.relative_to(ROOT)),'node':name,'problem':'outside_allowlist','paths':n['read_log_validity']['outside_allowlist']})
            if n.get('status') in ['complete','failed','protocol_failed']:
                nr=pathlib.Path(n['root'])
                checks={n['prompt_path']:n['prompt_sha256'],**n.get('inputs',{})}
                if '初期要望.txt' in n.get('inputs',{}):
                    fixture=ROOT/'primary-inputs'/p.parent.parent.parent.name/(p.parent.name+'.txt')
                    if n['inputs']['初期要望.txt']!=digest(fixture):result['issues'].append({'run':str(p.relative_to(ROOT)),'node':name,'problem':'frozen_case_input_mismatch'})
                if n['prompt_sha256']!=RDRA_PINS.get(n['prompt_path']):result['issues'].append({'run':str(p.relative_to(ROOT)),'node':name,'problem':'official_prompt_pin_mismatch'})
                for rel in ['AGENTS.md','RDRA_Knowledge/.rdracore/RDRA.md','RDRA_Knowledge/.rdracore/RDRASheet.md','RDRA_Knowledge/.rdracore/RDRAGraph.md']:
                    if rel in RDRA_PINS:checks[rel]=RDRA_PINS[rel]
                alias=n.get('alias') or {}
                for key in ['source','target']:
                    if key in alias:checks[alias[key]]=alias[key+'_sha256']
                for rel,expected in checks.items():
                    f=nr/rel
                    if not f.exists() or digest(f)!=expected:result['issues'].append({'run':str(p.relative_to(ROOT)),'node':name,'problem':'actual_input_or_prompt_mismatch','path':rel})
                for rel,expected in n.get('artifact_hashes',{}).items():
                    # Postprocessing may legitimately change the project copy; audit original node output.
                    original=pathlib.Path(n['root'])/rel
                    if not original.exists() or digest(original)!=expected:result['issues'].append({'run':str(p.relative_to(ROOT)),'node':name,'problem':'original_node_artifact_mismatch','path':rel})
    return result

if __name__=='__main__':print(json.dumps(audit(),ensure_ascii=False,indent=2))
