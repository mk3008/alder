"""Pinned-source importer for the experiment. No general MD migration is claimed."""
from pathlib import Path
import hashlib,json,re,sys,uuid
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[2]
sys.path.insert(0,str(ROOT/'tools/business_graph'))
import export as legacy
REGISTRY=HERE/'identity-map.json'
ids=json.loads(REGISTRY.read_text()) if REGISTRY.exists() else {}
def identity(key):
    if key not in ids: ids[key]=str(uuid.uuid4())
    return ids[key]
def digest(s):return hashlib.sha256(s.encode()).hexdigest()
def fields(text,level=2):
    lines=text.splitlines(); marks=[(n,h) for n,h in legacy.headings(text) if h.startswith('#'*level+' ')]
    return {h[level+1:]:'\n'.join(lines[n+1:marks[i+1][0] if i+1<len(marks) else len(lines)]).strip() for i,(n,h) in enumerate(marks)}
def roots(text):
    ls=text.splitlines(); marks=[(n,h) for n,h in legacy.headings(text) if h.startswith('# ')]
    return [(h[2:],'\n'.join(ls[n+1:marks[i+1][0] if i+1<len(marks) else len(ls)]).strip()) for i,(n,h) in enumerate(marks)]
def bd(text,key,revision):
    rr=roots(text); docid=identity(key); names={}
    for heading,body in rr[1:]:
        if heading.startswith(('Object ','Activity ')): names[heading.split(' ',1)[1]]=identity(key+':'+heading)
    objects=[];activities=[]
    for heading,body in rr[1:]:
        if not heading.startswith(('Object ','Activity ')):continue
        kind,name=heading.split(' ',1); f=fields(body)
        if kind=='Object':
            known={'Scope','Icon','Information','Medium','SR Dependencies'};assert not(set(f)-known)
            objects.append(dict(id=names[name],name=name,scope=f['Scope']=='true',icon='box' if f['Icon']=='(generic icon)' else f['Icon'],
                information=[l[2:] for l in f.get('Information','').splitlines() if l],
                draftAnnotations={k:f[k] for k in ('Medium','SR Dependencies') if k in f}))
        else:
            # How is a container; extract H3 fields independently.
            h=fields(f['How'],3)
            known={'Scope','Why','When','Exception When','Who','Where','How','Result','Problem','Pain level'};assert not(set(f)-known)
            assert not(set(h)-{'Input','Procedure','Exception','Output'})
            activities.append(dict(id=names[name],name=name,scope=f['Scope']=='true',why=f['Why'],when=f['When'],who=f['Who'],where=f['Where'],
                procedure=h['Procedure'],exception=h.get('Exception'),result=f['Result'],problem=f.get('Problem'),painLevel=f.get('Pain level')))
    projection=re.sub(r'^## (?:Medium|SR Dependencies)\n.*?(?=^## |^# |\Z)','',text,flags=re.M|re.S)
    parsed=legacy.parse_document(projection)
    relations=[]
    for i,r in enumerate(parsed['graph']['relations']):
        relations.append(dict(id=identity(key+':relation:'+str(i)),kind=r['kind'],fromId=names[r['from']],toId=names[r['to']],label=r['label']))
    findings=[]
    for f in parsed['findings']:
        findings.append(dict(id=identity(key+':finding:'+f['id']),sourceId=f['id'],kind=f['kind'],status=f['status'],scope=f['scope'],
            targetIds=[names[t] for t in f['targets'] if t in names],unresolvedTargets=f['unresolvedTargets'],summary=f['summary'],content=f['content']))
    return dict(id=docid,kind='businessDesign',revision=revision,title=rr[0][0],preface=rr[0][1],scope=dict(rr).get('Scope',''),
                objects=objects,activities=activities,relations=relations,findings=findings),names

def slug(s):return re.sub(r'[^\w\-\s]','',s.lower()).replace(' ','-')
LINK=re.compile(r'\[([^\]]+)\]\(([^)]+)\)')
def rich(s,anchors):
    result=[];pos=0
    for m in LINK.finditer(s):
        if m.start()>pos:result.append(dict(kind='text',value=s[pos:m.start()]))
        if m[2].startswith('#'):
            assert m[2][1:].lower() in anchors,m[2]
            result.append(dict(kind='reference',targetId=anchors[m[2][1:].lower()],label=m[1]))
        else:result.append(dict(kind='link',uri=m[2],label=m[1]))
        pos=m.end()
    if pos<len(s):result.append(dict(kind='text',value=s[pos:]))
    return result

def checkdoc(text,old,oldnames):
    key='checks-048'; docid=identity(key)
    ls=text.splitlines(); marks=legacy.headings(text)
    anchors={}; sections=[];guarantees=[];items=[];examples=[];notes=[]; activity=None;section=None
    for _,h in marks:
        title=h.split(' ',1)[1]
        anchors[slug(title)]=(title.split(' — ')[0] if re.match(r'^JA-EX-[\w-]+ — ',title) else identity(key+':heading:'+title))
    # Archive the actual Check claim, without asserting it is the current BD.
    based=dict(documentId=old['id'],revision=old['revision'],sourceClaimRevision='c2852531ad62691c375e87818d8c3a49fd19803f',verification='unverified')
    index=[]
    for i,(start,h) in enumerate(marks):
        title=h.split(' ',1)[1]; body='\n'.join(ls[start+1:marks[i+1][0] if i+1<len(marks) else len(ls)]).strip(); eid=anchors[slug(title)]
        if h.startswith('# '): continue
        if h=='## 業務一覧':
            for line in body.splitlines():
                if not line.startswith('| ['):continue
                cells=[s.strip() for s in line.split('|')[1:-1]];assert len(cells)==4
                name=LINK.search(cells[0])[1]
                index.append(dict(activityId=oldnames[name],purpose=cells[1],connections=cells[2],checkIds=[m[1] for m in LINK.finditer(cells[3])]))
            continue
        if h.startswith('## '):
            if title in oldnames:
                activity=oldnames[title];section=eid
                sections.append(dict(id=eid,activityId=activity,preamble=rich(body,anchors)))
            else:notes.append(dict(id=eid,title=title,content=rich(body,anchors)))
            continue
        if re.match(r'^JA-EX-[\w-]+ — ',title):
            pairs={}; label=None
            for line in body.splitlines():
                m=re.match(r'^- ([^：]+)：(.*)$',line)
                if m:label=m[1];assert label not in pairs;pairs[label]=m[2]
                elif label:pairs[label]+='\n'+line
                else:assert not line.strip(),line
            mapping={'種別':'classification','条件':'condition','期待結果':'expectedResult','条件・期待結果':'guarantee','根拠':'evidence','導出分類':'derivation','関連業務':'related','テスト証拠':'testEvidence','確認事項':'question','選択肢と影響':'alternatives'}
            assert not(set(pairs)-set(mapping)-{'人間レビュー状態'})
            data={prop:rich(pairs[label].strip(),anchors) for label,prop in mapping.items() if label in pairs}
            items.append(dict(id=eid,title=title.split(' — ',1)[1],sectionId=section,reviewState=pairs['人間レビュー状態'],fields=data))
        else:
            content=[]; lines=body.splitlines();j=0; paragraphs=[]
            def flush():
                if paragraphs:
                    content.append(dict(kind='prose',content=rich('\n'.join(paragraphs).strip(),anchors)));paragraphs.clear()
            while j<len(lines):
                if lines[j].startswith('|'):
                    flush(); table=[]
                    while j<len(lines) and lines[j].startswith('|'):
                        table.append([c.strip() for c in lines[j].split('|')[1:-1]]);j+=1
                    assert len(table)>=2
                    exid=identity(key+':example:'+title+':'+str(len(examples)))
                    examples.append(dict(id=exid,guaranteeId=eid,columns=table[0],rows=[[rich(c,anchors) for c in row] for row in table[2:]]))
                    content.append(dict(kind='example',exampleId=exid))
                else:paragraphs.append(lines[j]);j+=1
            flush();guarantees.append(dict(id=eid,sectionId=section,title=title,blocks=content))
    intro='\n'.join(ls[1:marks[1][0]]).strip()
    return dict(id=docid,kind='checkItems',revision='checks-import-1',title=marks[0][1][2:],basedOn=based,intro=rich(intro,anchors),
                index=index,sections=sections,guarantees=guarantees,examples=examples,items=items,notes=notes)

def main():
    for source in json.loads((HERE/'inputs/manifest.json').read_text()):
        assert hashlib.sha256((HERE/'inputs'/source['path']).read_bytes()).hexdigest()==source['sha256'], 'Frozen source mismatch; no inferred ID reconciliation'
    current=(HERE/'inputs/purchase.md').read_text();old=(HERE/'inputs/check-source.md').read_text();checks=(HERE/'inputs/checks.md').read_text()
    currentdoc,names=bd(current,'bd-current','6e55d98710a1d8757937ea268176929abcf49b2e')
    olddoc,oldnames=bd(old,'bd-check-source','9b4a3cbffe835cfa9c6a8ec7d602d9611a1a0285')
    check=checkdoc(checks,olddoc,oldnames)
    package=dict(format='alder-typed-storage-poc',formatVersion='0.2-poc',revision='package-import-1',documents=[currentdoc,olddoc,check],
      archives=[dict(documentId=d['id'],revision=d['revision'],sha256=digest(text),mediaType='text/markdown',text=text) for d,text in [(currentdoc,current),(olddoc,old),(check,checks)]],
      diagnostics=['Checkの原典主張c2852531と凍結snapshot9b4a3cbの意味対応は未確認。現在の購買草案への適合を示さない。','Medium/SR Dependenciesは草案注記として保持。Graph v1には投影しない。'])
    (HERE/'fixtures/purchase.json').write_text(json.dumps(package,ensure_ascii=False,indent=2)+'\n')
    REGISTRY.write_text(json.dumps(ids,ensure_ascii=False,indent=2)+'\n')
    (HERE/'results/import.json').write_text(json.dumps(dict(sourcePhase1='a2e841d049fa45a795e99b16ff4a053805474180',counts=[{k:len(d[k]) for k in ('objects','activities','relations','findings','items','guarantees','examples') if k in d} for d in package['documents']],unparsedFields=0,sourceArchives='exact original UTF-8, immutable import evidence; edited display uses typed fields'),ensure_ascii=False,indent=2)+'\n')
if __name__=='__main__':main()
