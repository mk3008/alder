"""Validate one explicitly selected Alder product release before any GitHub write."""
import argparse
import json
from pathlib import Path
import re


def validate(root, version, revision, requested_version, requested_revision):
    if not re.fullmatch(r'(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)', version):
        raise ValueError('Use a stable X.Y.Z product version')
    if tuple(map(int, version.split('.'))) < (0, 4, 4):
        raise ValueError('Historical releases are immutable; use a new product version')
    if requested_version != version:
        raise ValueError('Approved version does not match the plugin manifest')
    if not re.fullmatch(r'[0-9a-f]{40}', requested_revision) or requested_revision != revision:
        raise ValueError('Approved revision does not match this exact workflow commit')
    notes = root / f'docs/release-notes-v{version}.md'
    body = notes.read_text()
    lines = body.splitlines()
    if not lines or not re.fullmatch(r'# Alder ' + re.escape(version) + r'(?: — .+)?', lines[0]):
        raise ValueError('Release notes must identify the exact Alder product version')
    if not '\n'.join(lines[1:]).strip():
        raise ValueError('Release notes need substantive content')
    market = json.loads((root / '.agents/plugins/marketplace.json').read_text())
    entry, = market['plugins']
    if Path(entry['source']['path']) != Path('plugins/alder'):
        raise ValueError('Marketplace must select the versioned plugin')
    return version


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--revision', required=True)
    parser.add_argument('--approved-version')
    parser.add_argument('--approved-revision')
    args = parser.parse_args()
    root = Path('.')
    version = json.loads((root / 'plugins/alder/plugin.json').read_text())['version']
    # PR validation checks candidate inputs; dispatch supplies explicit approval inputs.
    validate(root, version, args.revision,
             args.approved_version if args.approved_version is not None else version,
             args.approved_revision if args.approved_revision is not None else args.revision)
    print(f'Validated Alder {version} at {args.revision}')


if __name__ == '__main__':
    main()
