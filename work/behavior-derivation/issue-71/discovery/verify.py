"""Verify discovery-study evidence integrity, not discovery quality."""

import argparse
import hashlib
import json
import re
import subprocess
import sys
from collections import Counter
from pathlib import Path


AREA = Path(__file__).resolve().parent
ROOT = AREA.parents[3]


def require(ok, message):
    if not ok:
        raise SystemExit(message)


def table_rows(path, prefix):
    return [
        [cell.strip() for cell in line.split('|')[1:-1]]
        for line in path.read_text().splitlines()
        if re.match(rf'\| {prefix}\d\d \|', line)
    ]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--velvet', type=Path)
    args = parser.parse_args()
    manifest = json.loads((AREA / 'manifest.json').read_text())
    # Manifest keeps its original path/hash; the historical prompt now has a frozen copy.
    for group in ('sha256', 'protected_previous_study_sha256'):
        for name, expected in manifest[group].items():
            require(
                hashlib.sha256(
                    (AREA / 'prompt.md' if name == manifest['prompt'] else ROOT / name).read_bytes()
                ).hexdigest() == expected,
                f'hash mismatch: {name}',
            )
    previous_command = [sys.executable, str(AREA.parent / 'verify.py')]
    if args.velvet:
        previous_command += ['--velvet', str(args.velvet.resolve())]
    previous = json.loads(subprocess.check_output(previous_command, text=True))
    require(previous['integrity'] == 'pass', 'previous integrity check failed')

    candidates = manifest['candidates']
    ids = [candidate['id'] for candidate in candidates]
    require(len(ids) == len(set(ids)), 'duplicate candidate IDs')
    for name in ('output.md', 'assessment.md', 'control-output.md'):
        require([row[0] for row in table_rows(AREA / name, 'N')] == ids, f'ID coverage: {name}')
    source_ids = {row[0] for row in table_rows(AREA / 'sources.md', 'S')}
    output_rows = table_rows(AREA / 'output.md', 'N')
    control_rows = table_rows(AREA / 'control-output.md', 'N')
    for candidate, output, control in zip(candidates, output_rows, control_rows):
        require(candidate['human_status'] == 'unapproved', 'unexpected human approval')
        require('未承認' in output[-1] and '要確認' in output[-1], 'candidate status missing')
        require(set(candidate['sources']) <= source_ids, 'unregistered source')
        require(candidate['control'] == control[1], 'control disposition mismatch')
    for prefix, key in (('X', 'screened_out'), ('I', 'derived_existing')):
        require([row[0] for row in table_rows(AREA / 'output.md', prefix)] == manifest[key], f'{key} mismatch')
    source = (ROOT / manifest['input']).read_text().splitlines()
    require(len(source) == manifest['input_lines'], 'input changed')
    for start, end in re.findall(r'L(\d+)(?:[–-](\d+))?', (AREA / 'output.md').read_text()):
        require(1 <= int(start) <= int(end or start) <= len(source), 'invalid input reference')
    require(not manifest['fresh'] and not manifest['human_approval'], 'study limitation lost')
    require(manifest['source_selection_before_protocol'], 'source-selection timing lost')
    require(manifest['control_created_after_output'], 'control timing lost')
    print(json.dumps({
        'integrity': 'pass',
        'candidate_count': len(ids),
        'origin_counts': dict(Counter(candidate['origin'] for candidate in candidates)),
        'control_dispositions': dict(Counter(candidate['control'] for candidate in candidates)),
        'screened_out_count': len(manifest['screened_out']),
        'protected_previous_artifacts': len(manifest['protected_previous_study_sha256']),
        'previous_study_integrity': previous['integrity'],
        'protected_baseline_files': previous['protected_baseline_files'],
        'pinned_velvet_blobs_checked': previous['pinned_velvet_blobs_checked'],
        'semantic_quality': 'AI assessment is separate; not machine-proven',
        'independent_discovery_validated': False,
        'human_approval': False,
    }, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
