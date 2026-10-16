"""Read-only literal name check for declared-Activity / four-column Check Markdown.

Diagnostic only: no semantic coverage, alias resolution, link or shared-Check audit.
Exit 2 means this narrow profile was not verified; it is never a passing review.
"""
import argparse
from collections import Counter
import json
import re
from pathlib import Path


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


def compare(design, checks):
    source = list(visible_lines(design))
    target = list(visible_lines(checks))
    declared = [m.group(1) for line in source
                if (m := re.fullmatch(r'# Activity (.+)', line))]
    objects = [m.group(1) for line in source
               if (m := re.fullmatch(r'# Object (.+)', line))]

    def non_activity_heading(name):
        # Recognize navigation and source-named Object views only. Never filter
        # by declared Activity membership: that would conceal misspelled names.
        if name in declared:
            return False
        if name in {'業務一覧', '使い方'}:
            return True
        return any(re.fullmatch(r'(?:Object )?' + re.escape(obj) +
                                r'(?:\s+.*|[:：・].*)?', name)
                   for obj in objects)

    headings = [m.group(1) for line in target
                if (m := re.fullmatch(r'## (.+)', line))
                and not non_activity_heading(m.group(1))]
    labels = []
    for line in target:
        cells = line.split('|')
        if len(cells) == 6 and (m := re.fullmatch(r'\s*\[([^]]+)\]\([^)]+\)\s*', cells[1])):
            labels.append(m.group(1))
    supported = bool(declared and headings and labels) and len(set(declared)) == len(declared)
    mismatches = [name for name, values in [('headings', headings), ('index', labels)]
                  if Counter(values) != Counter(declared)] if supported else []
    if supported and headings != labels:
        mismatches.append('index-heading-order')
    return {'status': ('mismatch' if mismatches else 'match') if supported else 'not-verified',
            'declared': declared, 'headings': headings, 'index': labels,
            'mismatches': mismatches}


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
