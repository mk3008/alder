"""Fetch exact public provenance commits, including sources outside main ancestry."""

import json
from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]


def source_revisions(root):
    paths = sorted((root / 'plugins/alder/skills').glob('*/references/provenance.json'))
    if not paths:
        raise ValueError('No plugin provenance records found')
    revisions = set()
    for path in paths:
        revision = json.loads(path.read_text())['alder_source_revision']
        if not isinstance(revision, str) or not re.fullmatch(r'[0-9a-f]{40}', revision):
            raise ValueError(f'{path}: expected a full commit SHA')
        revisions.add(revision)
    return sorted(revisions)


def fetch_sources(root):
    # Validate every input before any network operation. Never accept provenance URLs
    # or ref expressions; origin is the checkout's configured repository.
    revisions = source_revisions(root)
    subprocess.run(['git', '-C', str(root), 'fetch', '--no-tags', '--no-write-fetch-head',
                    'origin', *revisions], check=True)
    for revision in revisions:
        resolved = subprocess.check_output(
            ['git', '-C', str(root), 'rev-parse', '--verify', f'{revision}^{{commit}}'],
            text=True).strip()
        if resolved != revision:
            raise ValueError(f'{revision}: source must identify a commit directly')
    return revisions


if __name__ == '__main__':
    print(f'Fetched and verified {len(fetch_sources(ROOT))} exact plugin source commits.')
