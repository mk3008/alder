"""Check study integrity, not semantic correctness or human approval.

Run from any directory. Optionally verify pinned reference blobs against a
local, read-only Velvet checkout: python verify.py --velvet /path/to/velvet
"""

import argparse
import csv
import hashlib
import json
import re
import subprocess
from collections import Counter
from pathlib import Path


AREA = Path(__file__).resolve().parent
ROOT = AREA.parents[2]


def require(condition, message):
    if not condition:
        raise SystemExit(message)


def digest(data):
    return hashlib.sha256(data).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--velvet', type=Path)
    args = parser.parse_args()
    manifest = json.loads((AREA / 'records/manifest.json').read_text())
    for group in ('sha256', 'protected_baseline_sha256'):
        for name, expected in manifest[group].items():
            require(digest((ROOT / name).read_bytes()) == expected, f'hash mismatch: {name}')

    source = (ROOT / manifest['input']).read_text().splitlines()
    require(len(source) == manifest['input_lines'], 'input line count changed')
    output = (AREA / 'outputs/meeting-room.md').read_text()
    main_text, detail_text = output.split('## 詳細\n', 1)
    detail_text = detail_text.split('## Business Designへ戻す事項', 1)[0]

    def rows(text):
        return [
            [cell.strip() for cell in line.split('|')[1:-1]]
            for line in text.splitlines() if re.match(r'\| [A-F]\d\d \|', line)
        ]

    primary, detail = rows(main_text), rows(detail_text)
    ids = [row[0] for row in primary]
    require(len(ids) == len(set(ids)), 'duplicate primary ID')
    require(ids == [row[0] for row in detail], 'primary/detail ID mismatch')
    require(all(len(row) == 4 for row in primary + detail), 'invalid table shape')
    require(all(row[3] in ('未レビュー', '要確認') for row in primary), 'unexpected approval')
    references = 0
    for row in detail:
        refs = re.findall(r'L(\d+)(?:[–-](\d+))?', row[1])
        require(bool(refs), f'missing source reference: {row[0]}')
        for start, end in refs:
            require(1 <= int(start) <= int(end or start) <= len(source), f'invalid range: {row[0]}')
            references += 1

    with (AREA / 'records/audit.tsv').open() as stream:
        audit = list(csv.DictReader(stream, delimiter='\t'))
    require([row['id'] for row in audit] == ids + ['Q01'], 'audit coverage mismatch')
    for row, checked in zip(detail, audit):
        require(row[2] == checked['classification'], f'audit classification mismatch: {row[0]}')
    require(not manifest['fresh'] and not manifest['input_isolation_met'], 'isolation limit lost')
    require(not manifest['human_approval'], 'approval limit lost')

    reference_files = None
    if args.velvet:
        for name, expected in manifest['velvet_sha256'].items():
            blob = subprocess.check_output(
                ['git', 'show', f"{manifest['velvet_revision']}:{name}"], cwd=args.velvet
            )
            require(digest(blob) == expected, f'Velvet reference mismatch: {name}')
        reference_files = len(manifest['velvet_sha256'])

    result = {
        'integrity': 'pass',
        'checks': len(ids),
        'classifications': dict(Counter(row[2] for row in detail)),
        'source_ranges': references,
        'audited_items_including_Q01': len(audit),
        'retained_wording_findings': [row['id'] for row in audit if row['assessment'] == 'wording_revision_needed'],
        'protected_baseline_files': len(manifest['protected_baseline_sha256']),
        'pinned_velvet_blobs_checked': reference_files,
        'semantic_validation': 'not performed by this script; see audit and study',
        'isolated_generation_validated': False,
        'human_approval': False,
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
