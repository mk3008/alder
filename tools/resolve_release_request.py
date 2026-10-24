"""Resolve a manual dispatch or main-merged release request without publishing."""
import argparse
import json
from pathlib import Path
import re
import subprocess

REQUEST = '.github/alder-release-request.json'


def git(*args):
    return subprocess.check_output(['git', *args], text=True).strip()


def ancestor(revision, base):
    return subprocess.run(['git', 'merge-base', '--is-ancestor', revision, base],
                          capture_output=True).returncode == 0


def parse_request(text):
    def unique(pairs):
        result = {}
        for key, value in pairs:
            if key in result:
                raise ValueError('Duplicate release request key')
            result[key] = value
        return result
    request = json.loads(text, object_pairs_hook=unique)
    if not isinstance(request, dict) or set(request) != {'version', 'revision'}:
        raise ValueError('Release request requires only version and revision')
    if not isinstance(request['version'], str) or not re.fullmatch(
            r'(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)', request['version']):
        raise ValueError('Release request requires a stable X.Y.Z version')
    if not isinstance(request['revision'], str) or not re.fullmatch(r'[0-9a-f]{40}', request['revision']):
        raise ValueError('Release request requires a full commit SHA')
    return request


def validate_request(request, main_revision):
    revision = request['revision']
    if git('cat-file', '-t', revision) != 'commit' or not ancestor(revision, main_revision):
        raise ValueError('Release target must already belong to main history')
    manifest = json.loads(git('show', f'{revision}:plugins/alder/plugin.json'))
    if manifest['version'] != request['version']:
        raise ValueError('Requested version differs from the pinned target manifest')
    return request


def resolve(event_name, ref, revision, event):
    if git('rev-parse', 'HEAD') != revision:
        raise ValueError('Checkout must match the triggering revision')
    if event_name == 'pull_request':
        base = event['pull_request']['base']
        changed = git('diff', '--name-only', base['sha'], revision).splitlines()
        if REQUEST in changed:
            if base['ref'] != 'main':
                raise ValueError('Release requests must target main')
            validate_request(parse_request(Path(REQUEST).read_text()), base['sha'])
        version = json.loads(Path('plugins/alder/plugin.json').read_text())['version']
        return {'version': version, 'revision': revision, 'publish': 'false'}
    if ref != 'refs/heads/main':
        raise ValueError('Publication requires main')
    if event_name == 'workflow_dispatch':
        request = parse_request(json.dumps(event.get('inputs', {})))
        if request['revision'] != revision:
            raise ValueError('Manual dispatch must identify this exact main revision')
        validate_request(request, revision)
    elif event_name == 'push':
        before = event.get('before', '')
        if not re.fullmatch(r'[0-9a-f]{40}', before) or before == '0' * 40 or not ancestor(before, revision):
            raise ValueError('Release request requires an existing, fast-forward main history')
        if REQUEST not in git('diff', '--name-only', before, revision).splitlines():
            raise ValueError('This push did not change the release request')
        request = validate_request(parse_request(Path(REQUEST).read_text()), before)
    else:
        raise ValueError('Unsupported publication event')
    return {**request, 'publish': 'true'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--event-name', required=True)
    parser.add_argument('--event-path', required=True)
    parser.add_argument('--ref', required=True)
    parser.add_argument('--revision', required=True)
    parser.add_argument('--output', required=True)
    args = parser.parse_args()
    outputs = resolve(args.event_name, args.ref, args.revision,
                      json.loads(Path(args.event_path).read_text()))
    with open(args.output, 'a') as output:
        for key, value in outputs.items():
            output.write(f'{key}={value}\n')
    print(json.dumps(outputs))


if __name__ == '__main__':
    main()
