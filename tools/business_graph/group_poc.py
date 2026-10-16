"""Experimental read-only Group inspection for a single Business Design document.

The optional H2 Groups preamble leaves the published Graph v1 and exporter intact.
This helper is a PoC validator, not a required Alder authoring workflow.
"""

import argparse
import json
from pathlib import Path
import re
import sys

from export import DesignError, headings, parse_design, require, visible_name


def read_groups(source):
    """Validate explicit Group names and Activity membership without editing the graph."""
    source = source.replace('\r\n', '\n')
    graph = parse_design(source)
    lines = source.splitlines()
    marks = headings(source)
    roots = [(n, h) for n, h in marks if h.startswith('# ')]
    require(roots, 'document title required')
    preamble_end = roots[1][0] if len(roots) > 1 else len(lines)
    second_level = [(n, h) for n, h in marks
                    if roots[0][0] < n < preamble_end and h.startswith('## ')]
    sections = [(n, h) for n, h in second_level if h == '## Groups']
    require(len(sections) <= 1, 'duplicate Groups section')
    if not sections:
        return []

    first = sections[0][0] + 1
    end = next((n for n, _ in second_level if n >= first), preamble_end)
    members = [(n, h) for n, h in marks if first <= n < end and h.startswith('###')]
    require(members and not '\n'.join(lines[first:members[0][0]]).strip(),
            'Groups require Group headings, not unstructured content')

    groups, names, assigned = [], set(), set()
    node_types = {n['id']: n['type'] for n in graph['nodes']}
    for i, (start, heading) in enumerate(members):
        m = re.fullmatch(r'### Group (\S.*)', heading)
        require(m, f'invalid Group heading: {heading}')
        name = m.group(1)
        require(visible_name(name), 'invalid Group name')
        require(name not in names, f'duplicate Group name: {name}')
        names.add(name)
        end_of_group = members[i + 1][0] if i + 1 < len(members) else end
        activities = []
        for line in lines[start + 1:end_of_group]:
            if not line.strip():
                continue
            reference = re.fullmatch(r'- Activity (\S.*)', line)
            require(reference, f'invalid Group member in {name}: {line}')
            activity = reference.group(1)
            require(visible_name(activity), f'invalid Activity name: {activity}')
            require(node_types.get(activity) == 'business',
                    f'Group {name}: unknown Activity (or Object): {activity}')
            require(activity not in assigned, f'Activity in multiple Groups: {activity}')
            assigned.add(activity)
            activities.append(activity)
        require(activities, f'Group {name} requires at least one Activity')
        groups.append({'name': name, 'activities': activities})
    return groups


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('design', type=Path, help='Business Design Markdown file')
    args = parser.parse_args(argv)
    try:
        text = args.design.read_text(encoding='utf-8')
        groups = read_groups(text)
        business_names = {n['id'] for n in parse_design(text)['nodes'] if n['type'] == 'business'}
        assigned = {activity for group in groups for activity in group['activities']}
        print(json.dumps({'groups': groups, 'unclassified': sorted(business_names - assigned)},
                         ensure_ascii=False, indent=2))
        return 0
    except (DesignError, OSError, UnicodeError) as exc:
        print(f'group-poc: {exc}', file=sys.stderr)
        return 2


if __name__ == '__main__':
    raise SystemExit(main())
