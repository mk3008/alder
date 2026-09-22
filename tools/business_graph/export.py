#!/usr/bin/env python3
"""Export the opt-in Alder Business Design Markdown profile; stdlib only."""

import argparse
import json
import os
from pathlib import Path
import re
import sys
import tempfile

MARKER = '<!-- alder-business-graph: 1 -->'
ID = r'[a-z0-9]+(?:-[a-z0-9]+)*'
ENTITY = re.compile(rf'# (Activity|Object) ({ID}) — (\S.*)')
FIELDS = ('What', 'Why', 'When', 'Who', 'Where')
KINDS = ('input', 'output', 'business-exception', 'object-exception')


class DesignError(ValueError):
    """Invalid source profile or graph contract."""


def require(condition, message):
    if not condition:
        raise DesignError(message)


def nonempty(value):
    return isinstance(value, str) and bool(value.strip())


def validate_graph(graph):
    """Executable v1 specification, including constraints JSON Schema cannot express.

    Raises DesignError; does not mutate, infer, approve or repair the graph.
    """
    require(isinstance(graph, dict), 'graph must be an object')
    require(set(graph) in ({'version', 'nodes', 'relations'},
                           {'version', 'nodes', 'relations', 'scope'}), 'invalid graph fields')
    require(type(graph['version']) is int and graph['version'] == 1, 'unsupported graph version')
    if 'scope' in graph:
        require(nonempty(graph['scope']), 'scope must be nonempty text')
    require(isinstance(graph['nodes'], list) and graph['nodes'], 'nodes must be a nonempty list')
    require(isinstance(graph['relations'], list), 'relations must be a list')
    nodes = {}
    for node in graph['nodes']:
        require(isinstance(node, dict), 'node must be an object')
        kind = node.get('type')
        require(kind in ('business', 'object'), 'invalid node type')
        expected = {'id', 'type', 'name', 'what', 'why', 'when', 'who', 'where'} if kind == 'business' else {'id', 'type', 'name', 'icon'}
        require(set(node) == expected, f'invalid {kind} node fields')
        require(all(nonempty(v) for v in node.values()), 'node fields must be nonempty text')
        require(re.fullmatch(ID, node['id']) is not None, f'invalid node ID: {node["id"]}')
        require(node['id'] not in nodes, f'duplicate node ID: {node["id"]}')
        if kind == 'object':
            require(re.fullmatch(ID, node['icon']) is not None, 'icon must be a kebab-case Lucide name')
        nodes[node['id']] = kind
    require('business' in nodes.values(), 'at least one business is required')
    seen = set()
    endpoints = {'input': ('object', 'business'), 'output': ('business', 'object'),
                 'business-exception': ('business', 'business'),
                 'object-exception': ('object', 'object')}
    for relation in graph['relations']:
        require(isinstance(relation, dict) and set(relation) == {'kind', 'from', 'to', 'label'}, 'invalid relation fields')
        require(all(nonempty(v) for v in relation.values()), 'relation fields, including label, must be nonempty text')
        kind = relation['kind']
        require(kind in KINDS, f'unknown relation kind: {kind}')
        source, target = relation['from'], relation['to']
        require(source in nodes and target in nodes, f'dangling relation: {source} -> {target}')
        require((nodes[source], nodes[target]) == endpoints[kind], f'invalid {kind} endpoints: {source} -> {target}')
        identity = (kind, source, target, relation['label'])
        require(identity not in seen, f'duplicate relation: {identity}')
        seen.add(identity)


def headings(text):
    """Find ATX headings outside fenced code; preserve field text verbatim."""
    result = []
    fence = None
    for number, line in enumerate(text.splitlines()):
        match = re.match(r'^\s{0,3}(`{3,}|~{3,})(.*)$', line)
        if match:
            token, tail = match.groups()
            if fence is None:
                fence = token
            elif token[0] == fence[0] and len(token) >= len(fence) and not tail.strip():
                fence = None
            continue
        if fence is None and re.match(r'^#{1,6} ', line):
            result.append((number, line))
    require(fence is None, 'unclosed code fence')
    return result


def sections(body, expected, context, empty=()):
    """All headings at this level must be known and unique; no silent omission."""
    lines = body.splitlines()
    marks = headings(body)
    require(marks and not '\n'.join(lines[:marks[0][0]]).strip(), f'{context}: expected fields, not preamble')
    result = {}
    for i, (start, heading) in enumerate(marks):
        require(heading in expected, f'{context}: unsupported heading {heading}')
        require(heading not in result, f'{context}: duplicate field {heading}')
        end = marks[i + 1][0] if i + 1 < len(marks) else len(lines)
        result[heading] = '\n'.join(lines[start + 1:end]).strip()
        require(result[heading] or heading in empty, f'{context}: empty field {heading}')
    require(set(result) == set(expected), f'{context}: required fields are {", ".join(expected)}')
    return result


def parse_design(text):
    text = text.replace('\r\n', '\n')
    require(text.splitlines().count(MARKER) == 1, f'exactly one {MARKER} is required')
    lines = text.splitlines()
    roots = [(n, h) for n, h in headings(text) if h.startswith('# ')]
    require(roots, 'document title is required')
    require(not ENTITY.fullmatch(roots[0][1]) and roots[0][1] not in ('# Scope', '# Graph exceptions'), 'first H1 must be a document title')
    require(MARKER in '\n'.join(lines[:roots[1][0] if len(roots) > 1 else len(lines)]), 'profile marker must be in the document preamble')
    graph = {'version': 1, 'nodes': [], 'relations': []}
    special = set()
    for i, (start, heading) in enumerate(roots[1:], 1):
        end = roots[i + 1][0] if i + 1 < len(roots) else len(lines)
        body = '\n'.join(lines[start + 1:end]).strip()
        require(body, f'empty section: {heading}')
        if heading in ('# Scope', '# Graph exceptions'):
            require(heading not in special, f'duplicate {heading}')
            special.add(heading)
            if heading == '# Scope':
                require(not headings(body), 'Scope must be prose without headings')
                graph['scope'] = body
            else:
                for line in body.splitlines():
                    if not line.strip():
                        continue
                    match = re.fullmatch(rf'- (business-exception|object-exception) ({ID}) -> ({ID}): (\S.*)', line)
                    require(match, f'invalid exception: {line}')
                    kind, source, target, label = match.groups()
                    graph['relations'].append({'kind': kind, 'from': source, 'to': target, 'label': label.strip()})
            continue
        match = ENTITY.fullmatch(heading)
        require(match, f'unsupported top-level heading: {heading}')
        category, node_id, name = match.groups()
        if category == 'Object':
            icon = 'box'
            if body != '(generic icon)':
                values = sections(body, ('## Icon',), node_id)
                icon = values['## Icon']
            graph['nodes'].append({'id': node_id, 'type': 'object', 'name': name.strip(), 'icon': icon})
            continue
        expected = tuple('## ' + key for key in FIELDS) + ('## How', '### Input', '### Procedure', '### Output')
        values = sections(body, expected, node_id, empty=('## How',))
        require(not values['## How'], f'{node_id}: How must contain Input, Procedure, Output only')
        actual_headings = [h for _, h in headings(body)]
        require(actual_headings == list(expected), f'{node_id}: fields must follow What/Why/When/Who/Where/How/Input/Procedure/Output order')
        node = {'id': node_id, 'type': 'business', 'name': name.strip()}
        node.update({key.lower(): values['## ' + key] for key in FIELDS})
        graph['nodes'].append(node)
        for field, kind in (('Input', 'input'), ('Output', 'output')):
            contents = values['### ' + field]
            if contents == '(none)':
                continue
            for line in contents.splitlines():
                if not line.strip():
                    continue
                relation = re.fullmatch(rf'- \[({ID})\]: (\S.*)', line)
                require(relation, f'{node_id} {field}: expected - [object-id]: label, got {line}')
                object_id, label = relation.groups()
                source, target = (object_id, node_id) if kind == 'input' else (node_id, object_id)
                graph['relations'].append({'kind': kind, 'from': source, 'to': target, 'label': label.strip()})
    validate_graph(graph)
    graph['nodes'].sort(key=lambda node: node['id'])
    graph['relations'].sort(key=lambda relation: tuple(relation[key] for key in ('kind', 'from', 'to', 'label')))
    return graph


def render(graph):
    validate_graph(graph)
    return json.dumps(graph, ensure_ascii=False, indent=2) + '\n'


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('design', type=Path, help='UTF-8 Business Design Markdown (v1 opt-in profile)')
    parser.add_argument('-o', '--output', type=Path, help='JSON destination; default stdout')
    args = parser.parse_args(argv)
    temp = None
    try:
        if args.output:
            require(args.design.resolve() != args.output.resolve(), 'output must not overwrite Business Design')
            if args.output.exists():
                require(not args.design.samefile(args.output), 'output must not overwrite Business Design')
        result = render(parse_design(args.design.read_text(encoding='utf-8')))
        if args.output:
            # Validate before touching the destination; replace atomically in its directory.
            with tempfile.NamedTemporaryFile(mode='w', encoding='utf-8', newline='\n', dir=args.output.parent, delete=False) as handle:
                temp = Path(handle.name)
                handle.write(result)
            os.replace(temp, args.output)
            temp = None
        else:
            sys.stdout.write(result)
        return 0
    except (DesignError, OSError, UnicodeError) as error:
        print(f'business-graph: {error}', file=sys.stderr)
        return 2
    finally:
        if temp is not None:
            temp.unlink(missing_ok=True)


if __name__ == '__main__':
    sys.exit(main())
