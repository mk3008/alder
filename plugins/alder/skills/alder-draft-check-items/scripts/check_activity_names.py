"""Read-only names/navigation diagnostic for a four-column Activity index.

Resolve local index links to H2 sections (heading slugs or adjacent explicit
anchors). Other H2s are explanatory, unless they duplicate a declared Activity.
This narrow Markdown profile is not a semantic, shared-Check or approval audit.
Exit 2 means the profile was not verified, never a passing review.
"""
import argparse
from collections import Counter, defaultdict
import json
import re
from pathlib import Path
from urllib.parse import unquote


INDEX_HEADERS = (
    ['業務（Activity）', '目的', '業務設計に記載された接続', 'チェック項目'],
    ['Activity', 'Purpose', 'Connections stated in Business Design', 'Check Items'],
)


def visible_lines(text):
    fence = None
    for line in text.splitlines():
        marker = re.match(r'^\s*(`{3,}|~{3,})', line)
        if marker:
            token = marker.group(1)
            if fence is None:
                fence = token
            elif token[0] == fence[0] and len(token) >= len(fence):
                fence = None
            continue
        if fence is None:
            yield line


def cells(line):
    # Escaped pipes and multiline cells are outside this narrow profile.
    if '\\|' in line or not line.strip().startswith('|'):
        return None
    parts = line.strip().split('|')
    return [part.strip() for part in parts[1:-1]] if len(parts) == 6 and not parts[-1] else None


def compare(design, checks):
    source = list(visible_lines(design))
    target = list(visible_lines(checks))
    declared = [m.group(1) for line in source
                if (m := re.fullmatch(r'# Activity (.+)', line))]
    indexes = []
    for i, line in enumerate(target[:-1]):
        if cells(line) in INDEX_HEADERS:
            separator = cells(target[i + 1])
            if separator and all(re.fullmatch(r':?-{3,}:?', cell) for cell in separator):
                rows = []
                for row in target[i + 2:]:
                    if not row.strip().startswith('|'):
                        break
                    value = cells(row)
                    if value is None:
                        rows = None
                        break
                    rows.append(value)
                indexes.append(rows)
    result = {'status': 'not-verified', 'declared': declared, 'headings': [],
              'index': [], 'mismatches': []}
    if not declared or len(set(declared)) != len(declared) or len(indexes) != 1 or not indexes[0]:
        return result

    headings, destinations, slugs, pending = [], defaultdict(set), Counter(), []
    for i, line in enumerate(target):
        anchor = re.fullmatch(r'''<a\s+id=["']([^"']+)["']\s*>\s*</a>''', line)
        if anchor:
            pending.append(anchor.group(1))
            continue
        heading = re.fullmatch(r'(#{1,6}) (.+)', line)
        if heading:
            level, name = len(heading.group(1)), heading.group(2)
            slug = re.sub(r'[^\w\- ]', '', name.lower()).replace(' ', '-')
            key = slug if not slugs[slug] else f'{slug}-{slugs[slug]}'
            slugs[slug] += 1
            headings.append((i, level, name))
            for destination in {key, *pending}:
                destinations[destination].add(len(headings) - 1)
        if line.strip():
            pending = []

    labels, selected, issues = [], set(), []
    linked_positions = []
    for row in indexes[0]:
        link = re.fullmatch(r'\[([^]]+)\]\(([^)]+)\)', row[0])
        if not link:
            issues.append('invalid-index-link')
            labels.append(row[0])
            continue
        label, href = link.groups()
        labels.append(label)
        if not href.startswith('#'):
            # Cross-file/external links cannot identify a local section here.
            result['index'] = labels
            return result
        matches = destinations.get(unquote(href[1:]), set())
        if len(matches) != 1:
            issues.append('missing-or-ambiguous-target')
            continue
        number = next(iter(matches))
        position, level, name = headings[number]
        if level != 2:
            issues.append('target-is-not-h2')
            continue
        if number in selected:
            issues.append('reused-target')
        selected.add(number)
        linked_positions.append(position)
        if name != label:
            issues.append('index-target-name')

    # A second, unindexed body for a source Activity is still a duplicate;
    # explanatory headings are not selected merely because they are H2.
    for number, (_, level, name) in enumerate(headings):
        if level == 2 and (name in declared or any(name == 'Activity ' + n for n in declared)):
            selected.add(number)
    names = [name for number, (_, _, name) in enumerate(headings) if number in selected]
    mismatches = [key for key, values in [('headings', names), ('index', labels)]
                  if Counter(values) != Counter(declared)]
    if issues:
        mismatches.append('targets')
    if linked_positions != sorted(linked_positions):
        mismatches.append('index-heading-order')
    result.update(status='mismatch' if mismatches else 'match', headings=names,
                  index=labels, mismatches=mismatches, target_issues=issues)
    return result


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--design', required=True)
    parser.add_argument('--checks', required=True)
    args = parser.parse_args(argv)
    result = compare(Path(args.design).read_text(), Path(args.checks).read_text())
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return {'match': 0, 'mismatch': 1, 'not-verified': 2}[result['status']]


if __name__ == '__main__':
    raise SystemExit(main())
