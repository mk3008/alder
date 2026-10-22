"""Strict Markdown profile adapter. Receives one conversion request over stdin; no file writes."""
from pathlib import Path
import hashlib,json,re,sys,uuid
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'business_graph'))
import export as legacy

def require(ok,message):
    if not ok: raise ValueError(message)
DOC_ID=''
def identity(key):return str(uuid.uuid5(uuid.NAMESPACE_URL,'alder-storage:'+DOC_ID+':'+key))
def digest(s):return hashlib.sha256(s.encode()).hexdigest()
def fields(text,level=2):
    lines=text.splitlines(); marks=[(n,h) for n,h in legacy.headings(text) if h.startswith('#'*level+' ')]
    return {h[level+1:]:'\n'.join(lines[n+1:marks[i+1][0] if i+1<len(marks) else len(lines)]).strip() for i,(n,h) in enumerate(marks)}
def roots(text):
    ls=text.splitlines(); marks=[(n,h) for n,h in legacy.headings(text) if h.startswith('# ')]
    return [(h[2:],'\n'.join(ls[n+1:marks[i+1][0] if i+1<len(marks) else len(ls)]).strip()) for i,(n,h) in enumerate(marks)]
def bd(text,key,revision):
    parsed=legacy.parse_document(text)
    require(not any(f['unresolvedTargets'] for f in parsed['findings']),'Unresolved Finding target')
    rr=roots(text); docid=DOC_ID; names={}
    for heading,body in rr[1:]:
        if heading.startswith(('Object ','Activity ')): names[heading.split(' ',1)[1]]=identity(key+':'+heading)
    objects=[];activities=[]
    for heading,body in rr[1:]:
        if not heading.startswith(('Object ','Activity ')):continue
        kind,name=heading.split(' ',1); f=fields(body)
        if kind=='Object':
            known={'Scope','Icon','Information'};require(not(set(f)-known),'Unknown BD field')
            objects.append(dict(id=names[name],name=name,scope=f['Scope']=='true',icon='box' if f['Icon']=='(generic icon)' else f['Icon'],
                information=[l[2:] for l in f.get('Information','').splitlines() if l]))
        else:
            # How is a container; extract H3 fields independently.
            h=fields(f['How'],3)
            known={'Scope','Why','When','Exception When','Who','Where','How','Result','Problem','Pain level'};require(not(set(f)-known),'Unknown BD field')
            require(not(set(h)-{'Input','Procedure','Exception','Output'}),'Unknown How field')
            activities.append(dict(id=names[name],name=name,scope=f['Scope']=='true',why=f['Why'],when=f['When'],who=f['Who'],where=f['Where'],
                procedure=h['Procedure'],exception=h.get('Exception'),result=f['Result'],problem=f.get('Problem'),painLevel=f.get('Pain level')))
    relations=[]
    for i,r in enumerate(parsed['graph']['relations']):
        relations.append(dict(id=identity(key+':relation:'+json.dumps(r,ensure_ascii=False,sort_keys=True)),kind=r['kind'],fromId=names[r['from']],toId=names[r['to']],label=r['label']))
    findings=[]
    for f in parsed['findings']:
        findings.append(dict(id=identity(key+':finding:'+f['id']),sourceId=f['id'],kind=f['kind'],status=f['status'],scope=f['scope'],
            targetIds=[names[t] for t in f['targets'] if t in names],unresolvedTargets=f['unresolvedTargets'],summary=f['summary'],content=f['content']))
    return dict(id=docid,schemaVersion='0.1',kind='businessDesign',revision=revision,title=rr[0][0],preface=rr[0][1],scope=dict(rr).get('Scope',''),
                objects=objects,activities=activities,relations=relations,findings=findings),names

def slug(s):return re.sub(r'[^\w\-\s]','',s.lower()).replace(' ','-')
LINK=re.compile(r'\[([^\]]+)\]\(([^)]+)\)')
def rich(s,anchors):
    require(not re.search(r'<[A-Za-z/][^>]*>',s),'Unsupported HTML in Check text')
    require('![' not in s and not re.search(r'\[[^\]]+\]\[',s),'Unsupported rich link notation')
    result=[];pos=0
    for m in LINK.finditer(s):
        if m.start()>pos:result.append(dict(kind='text',value=s[pos:m.start()]))
        if m[2].startswith('#'):
            require(m[2][1:].lower() in anchors,'Unknown fragment: '+m[2])
            result.append(dict(kind='reference',targetId=anchors[m[2][1:].lower()],label=m[1]))
        else:result.append(dict(kind='link',uri=m[2],label=m[1]))
        pos=m.end()
    if pos<len(s):result.append(dict(kind='text',value=s[pos:]))
    return result


def normalize_check(text):
    lines=text.splitlines();aliases={};pending=[];out=[]
    for line in lines:
        m=re.fullmatch(r'<a id=["\']([^"\']+)["\']></a>',line)
        if m:pending.append(m[1].lower());continue
        h=re.match(r'^#{1,3} (.+)',line)
        if h:
            for alias in pending:
                require(alias not in aliases,'Duplicate explicit anchor')
                aliases[alias]=h[1]
            pending=[]
        elif line.strip():require(not pending,'Anchor must directly precede heading')
        out.append(line)
    require(not pending,'Orphan explicit anchor')
    return '\n'.join(out),aliases

def strip_details(body):
    # Legacy folding is layout; retain its summary separately and every field inside.
    summaries=re.findall(r'^<summary>([^<]+)</summary>$',body,re.M)
    require(body.count('<details>')==body.count('</details>')==len(summaries)<=1,'Unsupported details block')
    body=re.sub(r'^</?details>\s*$|^<summary>[^<]+</summary>\s*$','',body,flags=re.M)
    require(not re.search(r'<(?:details|summary|a)\b',body),'Unsupported HTML layout')
    return body,'\n'.join(summaries)

def checkdoc(text,old,oldnames):
    key='checks'; docid=DOC_ID
    require('\\|' not in text,'Escaped table pipes are unsupported')
    text,aliases=normalize_check(text)
    ls=text.splitlines(); marks=legacy.headings(text)
    require(marks and marks[0][0]==0 and marks[0][1].startswith('# '),'Check title required')
    require(all(h.startswith(('# ','## ','### ')) for _,h in marks),'Unsupported Check heading depth')
    require(sum(h.startswith('# ') for _,h in marks)==1,'One Check title required')
    anchors={}; sections=[];guarantees=[];items=[];examples=[];notes=[]; activity=None;section=None
    for _,h in marks:
        title=h.split(' ',1)[1]
        require(slug(title) not in anchors,'Ambiguous duplicate Check heading: '+title)
        anchors[slug(title)]=DOC_ID if h.startswith('# ') else (identity(key+':check:'+title.split(' — ')[0]) if re.match(r'^[A-Za-z][A-Za-z0-9_-]* — ',title) else identity(key+':heading:'+title))
    for alias,title in aliases.items():
        require(alias not in anchors or anchors[alias]==anchors[slug(title)],'Ambiguous anchor: '+alias)
        anchors[alias]=anchors[slug(title)]
    # Preserve the actual Check claim, without asserting it is the current BD.
    based=dict(documentId=old['id'],revision=old['revision'],verification='unverified')
    index=[]
    for i,(start,h) in enumerate(marks):
        title=h.split(' ',1)[1]; body='\n'.join(ls[start+1:marks[i+1][0] if i+1<len(marks) else len(ls)]).strip(); eid=anchors[slug(title)]
        if h.startswith('# '): continue
        if h in ('## 業務一覧','## Business index'):
            for line in body.splitlines():
                if not line.strip():continue
                if line.startswith('|') and not line.startswith('| ['):
                    require(line in ('| 業務（Activity） | 目的 | 業務設計に記載された接続 | チェック項目 |','| Activity | Purpose | Connections stated in Business Design | Check Items |') or re.fullmatch(r'\|[ :|\-]+',line),'Unsupported index row')
                    continue
                require(line.startswith('| ['),'Unsupported index content')
                cells=[s.strip() for s in line.split('|')[1:-1]];require(len(cells)==4,'Four index cells required')
                match=LINK.fullmatch(cells[0]);require(match,'Activity index cell must be one link')
                name=match[1];require(name in oldnames,'Unknown Activity: '+name)
                require(match[2].startswith('#') and anchors.get(match[2][1:].lower())==anchors.get(slug(name)),'Activity link mismatch')
                index.append(dict(activityId=oldnames[name],purpose=cells[1],connections=cells[2],checkIds=[anchors[m[2][1:].lower()] for m in LINK.finditer(cells[3])]))
            continue
        if h.startswith('## '):
            if title in oldnames or title in ('未割当','Unassigned'):
                activity=oldnames.get(title);section=eid
                sections.append(dict(id=eid,activityId=activity,title=title,preamble=rich(body,anchors)))
            else:
                section=None
                notes.append(dict(id=eid,title=title,content=rich(body,anchors)))
            continue
        if re.match(r'^[A-Za-z][A-Za-z0-9_-]* — ',title):
            require(section is not None,'Check has no Activity section')
            body,detail_summary=strip_details(body)
            pairs={}; label=None
            for line in body.splitlines():
                m=re.match(r'^- ([^：]+)：(.*)$',line)
                if m:label=m[1];require(label not in pairs,'Duplicate Check field: '+label);pairs[label]=m[2]
                elif label:pairs[label]+='\n'+line
                else:require(not line.strip(),'Unrecognised Check content: '+line)
            mapping={'種別':'classification','条件':'condition','期待結果':'expectedResult','条件・期待結果':'guarantee','根拠':'evidence','導出分類':'derivation','関連業務':'related','テスト証拠':'testEvidence','確認事項':'question','選択肢と影響':'alternatives','AI確度':'confidence'}
            require(not(set(pairs)-set(mapping)-{'人間レビュー状態'}),'Unknown Check field')
            data={prop:rich(pairs[label].strip(),anchors) for label,prop in mapping.items() if label in pairs}
            items.append(dict(id=eid,checkId=title.split(' — ')[0],detailSummary=detail_summary,title=title.split(' — ',1)[1],sectionId=section,reviewState=pairs['人間レビュー状態'].strip(),fields=data))
        else:
            require(section is not None,'Unknown nested section: '+title)
            content=[]; lines=body.splitlines();j=0; paragraphs=[];fence=None
            def flush():
                if paragraphs:
                    content.append(dict(kind='prose',content=rich('\n'.join(paragraphs).strip(),anchors)));paragraphs.clear()
            while j<len(lines):
                marker=re.match(r'^ {0,3}(`{3,}|~{3,})(.*)$',lines[j])
                if marker:
                    if fence is None:fence=marker[1]
                    elif marker[1][0]==fence[0] and len(marker[1])>=len(fence) and not marker[2].strip():fence=None
                    paragraphs.append(lines[j]);j+=1;continue
                if fence is None and lines[j].startswith('|'):
                    flush(); table=[]
                    while j<len(lines) and lines[j].startswith('|'):
                        table.append([c.strip() for c in lines[j].split('|')[1:-1]]);j+=1
                    require(len(table)>=2 and len(table[1])==len(table[0]) and all(re.fullmatch(r':?-{3,}:?',c) for c in table[1]),'Invalid example table separator')
                    exid=identity(key+':example:'+title+':'+str(len(content)))
                    examples.append(dict(id=exid,guaranteeId=eid,columns=table[0],rows=[[rich(c,anchors) for c in row] for row in table[2:]]))
                    content.append(dict(kind='example',exampleId=exid))
                else:paragraphs.append(lines[j]);j+=1
            flush();guarantees.append(dict(id=eid,sectionId=section,title=title,blocks=content))
    require(sum(h in ('## 業務一覧','## Business index') for _,h in marks)==1,'One business index required')
    intro='\n'.join(ls[1:marks[1][0]]).strip()
    return dict(id=docid,schemaVersion='0.1',kind='checkItems',revision=REVISION,title=marks[0][1][2:],basedOn=based,intro=rich(intro,anchors),
                index=index,sections=sections,guarantees=guarantees,examples=examples,items=items,notes=notes)

if __name__=='__main__':
    try:
        req=json.load(sys.stdin);DOC_ID=req['documentId'];REVISION=req['revision']
        if req['kind']=='businessDesign': result=bd(req['text'],'bd',REVISION)[0]
        elif req['kind']=='checkItems':
            source=req['source'];names={a['name']:a['id'] for a in source['activities']}
            require(len(names)==len(source['activities']),'Ambiguous source Activity names')
            result=checkdoc(req['text'],source,names)
        else:raise ValueError('Unsupported kind')
        print(json.dumps(result,ensure_ascii=False))
    except (ValueError,KeyError,AssertionError,TypeError) as e:
        print(json.dumps({'code':'MARKDOWN_PROFILE','message':str(e) or 'Unsupported or duplicate Markdown field'}),file=sys.stderr)
        sys.exit(2)
