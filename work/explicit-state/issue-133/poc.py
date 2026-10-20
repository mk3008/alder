"""Isolated explicit-declaration experiment; no natural-language inference."""
import json
import re
import sys
from pathlib import Path

FIELDS = ('id', 'from', 'activity', 'condition', 'to', 'effect', 'path', 'evidence', 'note')
META = {'object', 'states', 'start', 'terminal', 'completeness', 'source'}

def parse(text):
    blocks = re.findall(r'^```state-(json|meta)\n(.*?)\n```$', text, re.M | re.S)
    if len(blocks) != 1:
        raise ValueError('exactly one explicit declaration block required')
    kind, body = blocks[0]
    data = json.loads(body)
    if kind == 'meta':
        lines = [x for x in text.splitlines() if x.startswith('|')]
        if len(lines) < 3 or tuple(x.strip() for x in lines[0].strip('|').split('|')) != FIELDS:
            raise ValueError('transition table header missing or invalid')
        if not re.fullmatch(r'\|(?:\s*-+\s*\|){9}', lines[1]):
            raise ValueError('invalid separator')
        data['transitions'] = []
        for line in lines[2:]:
            cells = [x.strip() for x in line.strip('|').split('|')]
            if len(cells) != len(FIELDS):
                raise ValueError('invalid column count; literal pipe unsupported in PoC')
            data['transitions'].append(dict(zip(FIELDS, cells)))
    validate(data)
    return data

def validate(data):
    if set(data) != META | {'transitions'}:
        raise ValueError('unknown or missing top-level field')
    if not all(isinstance(data[k], str) and data[k] for k in META - {'states'}):
        raise ValueError('metadata must be nonempty strings')
    states = data['states']
    if not isinstance(states, list) or not states or any(not isinstance(s, str) or not s or s.startswith('@') for s in states) or len(set(states)) != len(states):
        raise ValueError('invalid state registry')
    if data['start'] != '@new' or data['terminal'] != '@unknown' or data['completeness'] != 'partial':
        raise ValueError('this PoC supports only an open lifecycle with unknown termination')
    if not isinstance(data['transitions'], list):
        raise ValueError('transitions must be a list')
    seen = set()
    for row in data['transitions']:
        if set(row) != set(FIELDS) or any(not isinstance(v, str) or not v for v in row.values()):
            raise ValueError('invalid transition fields')
        if not re.fullmatch(r'T[0-9]+', row['id']) or row['id'] in seen:
            raise ValueError('invalid or duplicate transition ID')
        seen.add(row['id'])
        if row['from'] not in states + ['@new'] or row['to'] not in states + ['@unknown', '@none']:
            raise ValueError('unregistered endpoint')
        if row['effect'] not in {'change', 'unchanged', 'no-create', 'constraint'} or row['path'] not in {'normal', 'exception'}:
            raise ValueError('invalid effect/path')
        if row['effect'] == 'unchanged' and row['from'] != row['to']:
            raise ValueError('unchanged requires explicit equal endpoints')
        if row['effect'] == 'no-create' and (row['from'], row['to']) != ('@new', '@none'):
            raise ValueError('no-create requires new/none')
        if row['effect'] == 'change' and (row['to'].startswith('@') or row['to'] == row['from']):
            raise ValueError('change requires a different registered target')
        if row['effect'] == 'constraint' and row['to'] != '@unknown':
            raise ValueError('constraint must preserve unknown target')

def render(data):
    # Text is emitted as JSON-quoted Mermaid labels; endpoints use generated IDs.
    labels = {'@new': '開始候補：記録作成前（非保存状態）', '@none': '申請不成立（記録を作成しない）'}
    nodes = {s: f'S{i}' for i, s in enumerate(data['states'])}
    nodes.update({'@new': 'START', '@none': 'NONE'})
    out = ['# 宣言から生成した状態遷移', '', '部分定義。未記載の操作は未決。終端は未決。条件の真偽・業務整合性は判定しない。', '', '```mermaid', 'flowchart TD']
    q = lambda s: json.dumps(s, ensure_ascii=False)
    for s, node in nodes.items():
        out.append(f'  {node}[{q(labels.get(s, s))}]')
    for row in data['transitions']:
        target = nodes.get(row['to'])
        if target is None:
            target = f"U{row['id'][1:]}"
            out.append(f'  {target}[{q(row["id"] + "：遷移先未決（保存状態ではない）")}]')
        arrow = '-.->' if row['to'] == '@unknown' else '-->'
        out.append(f'  {nodes[row["from"]]} {arrow}|{q(row["id"] + " " + row["activity"])}| {target}')
    out += ['```', '', '| ID | 遷移元 | 操作・条件 | 遷移先 | 明示効果 | 根拠 | 注記 |', '| --- | --- | --- | --- | --- | --- | --- |']
    for r in data['transitions']:
        cells = [r['id'], r['from'], r['activity'] + '：' + r['condition'], r['to'], r['effect'], r['evidence'], r['note']]
        out.append('| ' + ' | '.join(c.replace('|', '&#124;').replace('\n', ' ') for c in cells) + ' |')
    return '\n'.join(out) + '\n'

if __name__ == '__main__':
    data = parse(Path(sys.argv[1]).read_text())
    print(render(data), end='')
