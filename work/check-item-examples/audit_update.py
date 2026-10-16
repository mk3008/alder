"""Bounded preservation audit for this study's six purchase Check Items.

This is not a product parser, semantic evaluator or approval mechanism.
"""
import argparse
import json
from pathlib import Path
import re
from collections import Counter

IDS = {'JA-EX-01', 'JA-EX-02', 'JA-EX-Q01', 'JA-EX-03', 'JA-EX-04', 'JA-EX-05'}
FIELDS = ['人間レビュー状態', '期待結果', '導出分類', 'AI確度', '関連業務', 'テスト証拠']


def items(text):
    entries = re.findall(r'^### (JA-EX-(?:Q)?\d+) —[^\n]*\n(.*?)(?=^### |^## |\Z)', text, re.M | re.S)
    if len(entries) != 6 or {key for key, _ in entries} != IDS:
        raise ValueError('Expected six unique, unchanged purchase IDs')
    return dict(entries)


def audit(source, candidate):
    before, after = items(source), items(candidate)
    checks = 0
    for key in IDS:
        for field in FIELDS:
            pattern = r'^(?:- )?' + field + r'：([^\n]+)'
            matches = re.findall(pattern, before[key], re.M)
            retained = re.findall(pattern, after[key], re.M)
            def normalize(values):
                values = [value.strip().replace('**', '') for value in values]
                if field == '期待結果':
                    # In this source each Check already binds its selected target.
                    # A demonstrative does not change that target or the outcome.
                    values = [value.replace('その対象購入申請', '対象購入申請') for value in values]
                return values
            if len(matches) != 1 or normalize(retained) != normalize(matches):
                raise ValueError(f'{key}: changed or missing {field}')
            checks += 1
    source_url = r'https://github.com/mk3008/alder/blob/[0-9a-f]{40}/business-design/purchase-request/README.md(?:#[^)]*)?'
    if Counter(re.findall(source_url, source)) != Counter(re.findall(source_url, candidate)):
        raise ValueError('Source evidence URLs/revisions changed')
    checks += 1
    if '<details' in candidate or '<a ' in candidate:
        raise ValueError('Shared view must use ordinary Markdown')
    headings = re.findall(r'^#{1,6} (.+)$', candidate, re.M)
    slugs = {re.sub(r'[^\w\- ]', '', title.lower()).replace(' ', '-') for title in headings}
    for target in re.findall(r'\]\(#([^)]*)\)', candidate):
        if target not in slugs:
            raise ValueError(f'Missing local heading: {target}')
        checks += 1
    return {'checks': checks, 'ids': len(IDS), 'scope': 'exact retained fields, shared body and local heading targets only'}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source', type=Path)
    parser.add_argument('candidate', type=Path)
    args = parser.parse_args()
    print(json.dumps(audit(args.source.read_text(), args.candidate.read_text()), ensure_ascii=False))
