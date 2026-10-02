import pathlib,json,hashlib

ROOT=pathlib.Path(__file__).resolve().parent
PREFIX='work/rdra-alder-comparison/issue-133/'
EXCLUDED_PARTS={'method','root'}

def permitted(p):
    rel=p.relative_to(ROOT)
    if any(part in EXCLUDED_PARTS for part in rel.parts):return False
    if 'RDRA_Knowledge' in rel.parts:return False
    if p.name in {'source.txt','初期要望.txt','AGENTS.md','モデル設定.json'}:return False
    if p.suffix in {'.pyc','.zip'}:return False
    return True

def collect():
    xs=[]
    for folder in ['primary-runs','blind-packets','canonical-extractions','blind-evaluation','blind-probes','evaluation-result']:
        d=ROOT/folder
        if d.exists():
            for p in sorted(d.rglob('*')):
                if p.is_file() and permitted(p):
                    try:text=p.read_text()
                    except UnicodeDecodeError:continue
                    # Probe packet copies are reconstructible from blind-packets.
                    if folder=='blind-probes' and p.name=='packet.md':continue
                    xs.append({'path':PREFIX+str(p.relative_to(ROOT)),'mode':'100644','type':'blob','content':text})
    for name in ['rdra-orchestrate.py','alder-orchestrate.py','packetize.py','blind-mapping.json','audit-evidence.py','aggregate-scores.py','collect-evidence.py']:
        p=ROOT/name
        if p.exists():xs.append({'path':PREFIX+name,'mode':'100644','type':'blob','content':p.read_text()})
    return xs

if __name__=='__main__':
    xs=collect();out=ROOT/'publish-batches';out.mkdir(exist_ok=True)
    manifest=[];batch=[];size=0;bid=0
    for e in xs:
        estimate=len(json.dumps(e,ensure_ascii=False).encode())
        if batch and size+estimate>60000:
            (out/f'{bid:04d}.json').write_text(json.dumps(batch,ensure_ascii=False))
            bid+=1;batch=[];size=0
        batch.append(e);size+=estimate
        manifest.append({'path':e['path'],'sha256':hashlib.sha256(e['content'].encode()).hexdigest(),'bytes':len(e['content'].encode())})
    if batch:(out/f'{bid:04d}.json').write_text(json.dumps(batch,ensure_ascii=False));bid+=1
    (out/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'files':len(xs),'batches':bid,'bytes':sum(x['bytes'] for x in manifest)}))
