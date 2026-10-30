"""Replay the saved Agent candidates through the bundled CLI in a disposable directory.

Run from any directory: python3 work/plugin-json/issue-310/replay.py
This reproduces storage results, not stochastic Agent inference or human agreement.
"""
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import tempfile

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
RUNTIME = ROOT / 'plugins/alder/skills/alder-manage-json-documents/scripts/document_storage'


def invoke(script, *args):
    result = subprocess.run(['node', str(RUNTIME / script), *map(str, args)], capture_output=True, text=True)
    return result


with tempfile.TemporaryDirectory(prefix='alder-phase-b-replay-') as temp:
    work = Path(temp)
    target = work / 'design.json'
    empty = work / 'empty.json'
    empty.write_text('{}')
    stages = [
        ('create', 'create', empty, '35f8a538f13832a3ecacecd4903c6ba96ca626fcf33acfb2ef5deedeaf7f38c1'),
        ('update', 'commit', HERE / 'agent/update/operation.json', '741f88eb8ce891451c63c39d4e02b8800b094033314b466aee3a402c0895fc78'),
        ('review-revision', 'commit', HERE / 'agent/review-revision/operation.json', 'b520831a2869c2bb045bb370b82dd26fb94ec4cbac6f2b29e4e4d4050ac12cfe'),
    ]
    for stage, command, operation, expected in stages:
        candidate = HERE / 'agent' / stage / 'candidate.json'
        args = [candidate, target, operation] if command == 'create' else [target, candidate, operation]
        saved = invoke('author-cli.mjs', command, *args)
        assert saved.returncode == 0, saved.stderr
        assert hashlib.sha256(target.read_bytes()).hexdigest() == expected
        inspected = invoke('author-cli.mjs', 'inspect', target)
        assert inspected.returncode == 0, inspected.stderr
        assert json.loads(inspected.stdout)['sha256'] == expected
        checked = invoke('cli.mjs', 'validate', target)
        assert checked.returncode == 0, checked.stderr
        print(f'{stage}: save/inspect/validate OK, sha256={expected}')

    for case in ['malformed-json', 'external-lock', 'stale-hash', 'existing-create-target']:
        copied = work / case
        shutil.copytree(HERE / 'agent/failure-probes' / case, copied)
        before = {p.name: p.read_bytes() for p in copied.iterdir() if p.is_file()}
        target = copied / 'target.json'
        candidate = copied / 'candidate.json'
        operation = copied / 'operation.json'
        args = [candidate, target, operation] if case == 'existing-create-target' else [target, candidate, operation]
        denied = invoke('author-cli.mjs', 'create' if case == 'existing-create-target' else 'commit', *args)
        assert denied.returncode == 2, (case, denied.stdout, denied.stderr)
        after = {p.name: p.read_bytes() for p in copied.iterdir() if p.is_file()}
        assert before == after, case
        print(f'{case}: exit 2, all input/target/foreign-lock bytes preserved')

print('Replay completed. Agent reasoning, actual human agreement and account Plugin loading are not replayed.')
