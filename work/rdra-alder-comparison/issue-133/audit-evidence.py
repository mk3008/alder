import pathlib,json,hashlib,collections
ROOT=pathlib.Path(__file__).resolve().parent
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()

def audit():
    result={'alder':collections.Counter(),'rdra':collections.Counter(),'rdra_nodes':collections.Counter(),'issues':[],'limits':['Requested settings and self-reported read-log are not independent attestation.']}
    ap=ROOT/'primary-runs/alder/manifest.json'
    if ap.exists():
        m=json.loads(ap.read_text())
        for r in m.get('runs',[]):
            result['alder'][r.get('status','unknown')]+=1
            if r.get('status')!='success':continue
            base=ROOT/r['root']
            checks=[('artifact_sha256',base/'docs/business-design/design.md'),('raw_response_sha256',base/'raw-response.md'),('read_log_sha256',base/'read-log.jsonl')]
            for field,p in checks:
                if not p.exists() or (field in r and digest(p)!=r[field]):result['issues'].append({'run':r['root'],'field':field,'problem':'missing_or_hash_mismatch'})
            source=ROOT/r['source_fixture']
            if not source.exists() or digest(source)!=r['source_sha256']:result['issues'].append({'run':r['root'],'problem':'source_fixture_mismatch'})
    for p in sorted((ROOT/'primary-runs/rdra').glob('C*/r*/s*/manifest.json')):
        m=json.loads(p.read_text());result['rdra'][m.get('status','unknown')]+=1
        for name,n in m.get('nodes',{}).items():
            result['rdra_nodes'][n.get('status','unknown')]+=1
            for attr in ['unchanged_prompt_hash']:
                if n.get(attr) is False:result['issues'].append({'run':str(p.relative_to(ROOT)),'node':name,'problem':attr})
            if any(v is False for v in n.get('unchanged_input_hashes',{}).values()):result['issues'].append({'run':str(p.relative_to(ROOT)),'node':name,'problem':'changed_input'})
            if n.get('read_log_validity',{}).get('outside_allowlist'):result['issues'].append({'run':str(p.relative_to(ROOT)),'node':name,'problem':'outside_allowlist','paths':n['read_log_validity']['outside_allowlist']})
            if n.get('status')=='complete':
                for rel,expected in n.get('artifact_hashes',{}).items():
                    # Postprocessing may legitimately change the project copy; audit original node output.
                    original=pathlib.Path(n['root'])/rel
                    if not original.exists() or digest(original)!=expected:result['issues'].append({'run':str(p.relative_to(ROOT)),'node':name,'problem':'original_node_artifact_mismatch','path':rel})
    return result

if __name__=='__main__':print(json.dumps(audit(),ensure_ascii=False,indent=2))
