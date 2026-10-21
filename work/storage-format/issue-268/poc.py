"""Isolated storage experiment. No production format or migration writer."""
from pathlib import Path
import copy
import hashlib
import json
import re
import sys

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
sys.path.insert(0, str(ROOT / 'tools/business_graph'))
import export as graph_parser

FORMAT = 'alder-storage-poc'
VERSION = '0.1-poc'
SEPARATOR = '\n\n# 保存形式PoCのCheck文書境界\n\n'
SOURCES = {
    'purchase': ('6e55d98710a1d8757937ea268176929abcf49b2e', 'business-design/purchase-request/README.md'),
    'checks': ('9b4a3cbffe835cfa9c6a8ec7d602d9611a1a0285', 'work/check-item-examples/meaning-validation-20261018/purchase/final.md'),
}


def require(ok, message):
    if not ok:
        raise ValueError(message)


def strict_json(text):
    def pairs(items):
        result = {}
        for key, value in items:
            require(key not in result, 'duplicate JSON key: ' + key)
            result[key] = value
        return result
    return json.loads(text, object_pairs_hook=pairs)


def json_text(value, indent=None):
    return json.dumps(value, ensure_ascii=False, indent=indent, separators=None if indent else (',', ':'))


def fragment(title):
    # Restricted to this fixture's GitHub heading characters; NOT a general slugger.
    return re.sub(r'[^\w\-\s]', '', title.lower()).replace(' ', '-')


def split_records(text, document):
    require(text.endswith('\n') and '\r' not in text, 'PoC only supports LF with final newline')
    marks = graph_parser.headings(text)
    # Keep every byte in body lines, including blank lines. Check guarantees remain independent records.
    marks = [(n, h) for n, h in marks if (h.startswith('# ') if document == 'purchase' else len(h.split(' ')[0]) <= 3)]
    require(marks and marks[0][0] == 0, 'heading required at start')
    lines = text.splitlines(keepends=True)
    result = []
    for i, (start, h) in enumerate(marks):
        kind = 'section'
        if document == 'purchase':
            kind = 'activity' if h.startswith('# Activity ') else 'object' if h.startswith('# Object ') else 'section'
        elif re.match(r'^### [A-Za-z][\w-]* — ', h):
            kind = 'check'
        stable = h.split(' ')[1] if kind == 'check' else f'{document}-{i:04d}'
        result.append(dict(id=stable, document=document, kind=kind, heading=h,
                           body=lines[start+1:marks[i+1][0] if i+1 < len(marks) else len(lines)]))
    return result


def name(record):
    return record['heading'].split(' ', 2)[2]


def normalize_refs(records):
    names = {name(r): r['id'] for r in records if r['kind'] in ('activity', 'object')}
    for r in records:
        field = ''
        body = []
        for line in r['body']:
            if line.startswith('#'):
                field = line.strip()
            m = re.fullmatch(r'- (.+?) — (.+)\n', line)
            if r['document'] == 'purchase' and field in ('### Input', '### Output', '## Exception When') and m:
                require(m[1] in names, 'unresolved name: ' + m[1])
                body.append(dict(ref=names[m[1]], label=m[2]))
            elif r['heading'] == '# Graph exceptions' and line.startswith('- '):
                m = re.fullmatch(r'- (business-exception|object-exception) (.+?) → (.+?) — (.+)\n', line)
                require(m and m[2] in names and m[3] in names, 'invalid graph exception')
                body.append(dict(relation=m[1], source=names[m[2]], target=names[m[3]], label=m[4]))
            else:
                body.append(line)
        r['body'] = body


def from_markdown(text):
    require(text.count(SEPARATOR) <= 1, 'ambiguous bundle boundary')
    parts = text.split(SEPARATOR)
    records = split_records(parts[0], 'purchase')
    docs = [dict(id='purchase', role='business-design', revision=SOURCES['purchase'][0])]
    if len(parts) == 2:
        records += split_records(parts[1], 'checks')
        docs.append(dict(id='checks', role='check-items', revision=SOURCES['checks'][0]))
    normalize_refs(records)
    return dict(format=FORMAT, formatVersion=VERSION, documentRevision='fixture-1',
                documents=docs, recordCount=len(records), records=records)


def render_document(bundle, document):
    by_id = {r['id']: r for r in bundle['records']}
    output = []
    for r in bundle['records']:
        if r['document'] != document:
            continue
        output.append(r['heading'] + '\n')
        for line in r['body']:
            if isinstance(line, str):
                output.append(line)
            elif 'ref' in line:
                output.append(f"- {name(by_id[line['ref']])} — {line['label']}\n")
            else:
                output.append(f"- {line['relation']} {name(by_id[line['source']])} → {name(by_id[line['target']])} — {line['label']}\n")
    return ''.join(output)


def encode(bundle, fmt):
    if fmt == 'md':
        return SEPARATOR.join(render_document(bundle, d['id']) for d in bundle['documents'])
    if fmt == 'json':
        return json_text(bundle, 2) + '\n'
    header = {k: v for k, v in bundle.items() if k != 'records'}
    return '\n'.join([json_text(header)] + [json_text(r) for r in bundle['records']]) + '\n'


def decode(text, fmt):
    if fmt == 'md':
        return from_markdown(text)
    if fmt == 'json':
        return strict_json(text)
    require(text.endswith('\n'), 'JSONL incomplete final line')
    lines = text.splitlines()
    require(lines and all(lines), 'JSONL empty line')
    b = strict_json(lines[0])
    require('records' not in b, 'JSONL header contains records')
    b['records'] = [strict_json(line) for line in lines[1:]]
    return b


def index(bundle):
    return {r['id']: r for r in bundle['records']}


def validate(bundle):
    require(set(bundle) == {'format', 'formatVersion', 'documentRevision', 'documents', 'recordCount', 'records'}, 'invalid envelope')
    require(bundle['format'] == FORMAT and bundle['formatVersion'] == VERSION, 'unknown format/version')
    require(isinstance(bundle['documentRevision'], str) and bundle['documentRevision'], 'invalid revision')
    docs = bundle['documents']
    require(isinstance(docs, list) and docs and docs[0]['id'] == 'purchase', 'invalid documents')
    require(len({d['id'] for d in docs}) == len(docs), 'duplicate document')
    require(all(set(d) == {'id','role','revision'} and d['id'] in ('purchase','checks') and isinstance(d['revision'],str) and d['revision'] for d in docs), 'unknown document')
    require(all(d['role'] == {'purchase':'business-design','checks':'check-items'}[d['id']] for d in docs), 'document role mismatch')
    records = bundle['records']
    require(isinstance(records, list) and type(bundle['recordCount']) is int and len(records) == bundle['recordCount'], 'record count mismatch')
    seen = set()
    for r in records:
        require(isinstance(r,dict) and set(r) == {'id','document','kind','heading','body'}, 'invalid record')
        require(isinstance(r['id'],str) and r['id'] and r['id'] not in seen, 'duplicate/invalid ID')
        seen.add(r['id'])
        require(r['kind'] in ('activity','object','check','section'), 'unknown kind')
        require(r['document'] in {d['id'] for d in docs}, 'missing document')
        require(isinstance(r['heading'],str) and re.fullmatch(r'#{1,3} [^\n]+',r['heading']), 'invalid heading')
        expected = 'section'
        if r['document'] == 'purchase':
            expected = 'activity' if r['heading'].startswith('# Activity ') else 'object' if r['heading'].startswith('# Object ') else 'section'
        elif re.match(r'^### [A-Za-z][\w-]* — ', r['heading']):
            expected = 'check'
        require(r['kind'] == expected, 'kind/heading mismatch')
        if r['kind'] == 'check':
            require(r['id'] == r['heading'].split(' ')[1], 'Check ID mismatch')
        require(isinstance(r['body'], list), 'invalid body')
        for line in r['body']:
            if isinstance(line,str):
                require(line.endswith('\n') and line.count('\n') == 1 and '\r' not in line, 'invalid line')
            else:
                require(isinstance(line,dict) and set(line) in ({'ref','label'}, {'relation','source','target','label'}), 'invalid reference token')
                require(all(isinstance(v,str) and v and '\n' not in v for v in line.values()), 'invalid token text')
    by_id = index(bundle)
    for r in records:
        field = ''
        for line in r['body']:
            if isinstance(line,str):
                if line.startswith('#'):
                    field = line.strip()
                if r['kind']=='activity' and field in ('### Input','### Output','## Exception When'):
                    require(not re.fullmatch(r'- (.+?) — (.+)\n',line), 'name reference must be ID token')
                continue
            require(r['document'] == 'purchase', 'reference outside BD')
            if 'ref' in line:
                require(field in ('### Input','### Output','## Exception When'), 'reference outside I/O')
                target = by_id.get(line['ref'])
                require(target and target['document'] == 'purchase', 'dangling reference')
                require(target['kind'] == ('activity' if field == '## Exception When' else 'object'), 'reference kind mismatch')
            else:
                for key in ('source','target'):
                    require(line[key] in by_id, 'dangling exception')
    bd = render_document(bundle, 'purchase')
    # Pinned review draft contains experimental Medium, which main Graph v1 rejects.
    # Preserve it in storage; omit only this field in the explicitly lossy Graph projection.
    projection = re.sub(r'^## (?:Medium|SR Dependencies)\n.*?(?=^## |^# |\Z)', '', bd, flags=re.M|re.S)
    graph = graph_parser.parse_document(projection)
    checks = render_document(bundle, 'checks')
    diagnostics = ['GRAPH_PROJECTION_OMITS_DRAFT_FIELDS: 固定原典は現行parserでは未対応。Medium/SR Dependenciesを保持し、Graph投影時だけ除外。'] if projection != bd else []
    if checks:
        headings = graph_parser.headings(checks)
        slugs = [fragment(h.split(' ',1)[1]) for _, h in headings]
        require(len(set(slugs)) == len(slugs), 'ambiguous Check anchor')
        for link in re.findall(r'\]\(#([^)]*)\)', checks):
            require(link.lower() in slugs, 'missing Check fragment: ' + link)
        for r in records:
            if r['kind'] == 'check':
                body = ''.join(r['body'])
                require(re.search(r'^- 人間レビュー状態：(未レビュー|要確認|確認済み|要修正)$',body,re.M), 'missing review state')
        # Preserve disagreement; never remap an older Check to the current BD using names alone.
        diagnostics.append('CHECK_SOURCE_REVISION_MISMATCH: Check原典c2852531は購買固定原典6e55d987とは異なる。対応・業務合意は未確認。')
    return graph, diagnostics


def load(text, fmt):
    b = decode(text,fmt)
    validate(b)
    return b


def select(bundle, identifier):
    """Element plus all same-document fragment dependencies for Checks, I/O targets for Activity."""
    by_id = index(bundle)
    require(identifier in by_id, 'unknown ID')
    found = {identifier}
    queue = [identifier]
    slugs = {fragment(r['heading'].split(' ',1)[1]):r['id'] for r in bundle['records'] if r['document']=='checks'}
    while queue:
        r = by_id[queue.pop()]
        targets = []
        for line in r['body']:
            if isinstance(line,dict):
                targets.extend([line['ref']] if 'ref' in line else [line['source'],line['target']])
            elif r['document']=='checks':
                targets.extend(slugs[t.lower()] for t in re.findall(r'\]\(#([^)]*)\)',line))
        for target in targets:
            if target not in found:
                found.add(target)
                queue.append(target)
    return [r for r in bundle['records'] if r['id'] in found]


def write_fixtures():
    bd = (HERE/'inputs/purchase.md').read_text()
    checks = (HERE/'inputs/checks.md').read_text()
    b = load(bd+SEPARATOR+checks,'md')
    for fmt in ('md','json','jsonl'):
        (HERE/f'fixtures/purchase.{fmt}').write_text(encode(b,fmt))
    sources = []
    for doc,(revision,path) in SOURCES.items():
        data=(HERE/f'inputs/{doc}.md').read_bytes()
        sources.append(dict(document=doc,revision=revision,path=path,sha256=hashlib.sha256(data).hexdigest()))
    (HERE/'results/sources.json').write_text(json_text(dict(baseRevision='f3a045d9f55bb27b1289145fcdc5f6bd2df594a1', sources=sources),2)+'\n')
    return b


if __name__ == '__main__':
    write_fixtures()
