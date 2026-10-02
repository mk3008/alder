import pathlib, json, re, hashlib

ROOT=pathlib.Path(__file__).resolve().parent
mapping=json.loads((ROOT/'blind-mapping.json').read_text())

def h(p): return hashlib.sha256(p.read_bytes()).hexdigest()

def files_for(arm,c,rep,stage):
    run=ROOT/'primary-runs'/arm/c/f'r{rep}'/stage
    if stage=='s3':
        p=run/'raw-response.md'
        return [(p,'response')] if p.exists() else []
    if arm=='alder':
        xs=[]
        for rel in ['docs/business-design/design.md','raw-response.md']:
            p=run/rel
            if p.exists():xs.append((p,rel))
        return xs
    pr=run/'project'
    xs=[]
    # stage1/2 direct evaluation covers intermediate+final; handoff handled separately.
    for folder in ['0_RDRAZeroOne','1_RDRA']:
        d=pr/folder
        if d.exists():xs += [(p,str(p.relative_to(pr))) for p in sorted(d.rglob('*')) if p.is_file() and p.suffix in ['.tsv','.json','.txt']]
    return xs

def anonymize(text):
    changes=[];out=[]
    for i,line in enumerate(text.splitlines(),1):
        if re.search(r'Alder plugin|alder_source_revision|authoring source revision|Plugin\s*0\.2\.8|e9726b4c84608db42c5286d072b5ec762d31596a',line,re.I):
            changes.append({'line':i,'original':line,'replacement':'[method metadata removed]'})
            out.append('[method metadata removed]')
        else:
            new=re.sub(r'\b(?:Alder|RDRAAgent|RDRA)\b','[method]',line)
            if new!=line:changes.append({'line':i,'original':line,'replacement':new})
            out.append(new)
    return '\n'.join(out)+'\n',changes

def make_packet(row,handoff=False):
    arm,c,rep,stage=[row[k] for k in ['arm','case','replicate','stage']]
    xs=files_for(arm,c,rep,stage)
    if handoff and arm=='rdra':xs=[(p,r) for p,r in xs if r.startswith('1_RDRA/')]
    if not xs:return None
    sections=[];manifest=[]
    for idx,(p,rel) in enumerate(xs,1):
        t,changes=anonymize(p.read_text())
        sections.append(f'## Artifact {idx:03d}\n'+t)
        manifest.append({'artifact':f'{idx:03d}','original_path':str(p.relative_to(ROOT)),'sha256':h(p),'anonymization':changes})
    text='\n'.join(sections)
    name=row['blind_id']+('-handoff' if handoff else '')
    d=ROOT/'blind-packets';d.mkdir(exist_ok=True)
    (d/(name+'.md')).write_text(text)
    (d/(name+'-mapping.json')).write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    return name

if __name__=='__main__':
    names=[]
    for row in mapping:
        n=make_packet(row)
        if n:names.append(n)
        if row['stage']=='s2':
            n=make_packet(row,handoff=True)
            if n:names.append(n)
    print(json.dumps({'packets':names,'count':len(names)}))
