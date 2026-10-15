"""Verify frozen trial evidence; semantic classification remains an AI assessment."""
import argparse
import hashlib
import json
from pathlib import Path
import re
import subprocess
import tarfile
from collections import Counter

AREA = Path(__file__).resolve().parent
ROOT = AREA.parents[3]


def require(ok, message):
    if not ok:
        raise SystemExit(message)


def sha(data):
    return hashlib.sha256(data).hexdigest()


def read(name):
    return json.loads((AREA / name).read_text())


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--velvet', type=Path)
    args = parser.parse_args()
    run = read('records/run.json')
    manifest = read('records/input-manifest.json')
    log = read('records/read-log.json')
    evaluation = read('records/evaluation.json')
    for field, name in {
        'launch_sha256': 'records/launch.txt',
        'protocol_sha256': 'records/protocol.md',
        'inputs_archive_sha256': 'inputs.tar.gz',
        'output_sha256': 'outputs/raw.md',
        'read_log_sha256': 'records/read-log.json',
    }.items():
        require(sha((AREA / name).read_bytes()) == run[field], f'hash mismatch: {name}')
    with tarfile.open(AREA / 'inputs.tar.gz') as archive:
        members = archive.getmembers()
        require(all(m.isfile() for m in members), 'archive contains non-files')
        require(len(members) == 6, 'input count changed')
        packet = {m.name: archive.extractfile(m).read() for m in members}
    require(set(packet) == set(run['generator_local_allowlist']), 'allowlist mismatch')
    require({n: sha(b) for n, b in packet.items()} == manifest['packet_sha256'], 'input hash mismatch')
    logged = {Path(i['path']).name: i['sha256'] for i in log['local_inputs']}
    require(len(log['local_inputs']) == 6 and logged == manifest['packet_sha256'], 'read log mismatch')
    require(not log['external_urls'] and not log['other_references'], 'unrecorded references')
    require(run['fork_turns'] == 'none' and run['attempts'] == 1 and not run['feedback'], 'trial changed')
    require(run['status'] == 'completed', 'incomplete run')
    require(packet['functional-considerations.md'] == (AREA.parent / 'discovery/prompt.md').read_bytes(), 'prompt changed')
    ids = re.findall(r'^### (FC-\d+)[：:]', (AREA / 'outputs/raw.md').read_text(), re.M)
    require(ids == [c['id'] for c in evaluation['candidates']], 'candidate coverage mismatch')
    counts = Counter(c['category'] for c in evaluation['candidates'])
    require(all(evaluation['counts'][k] == counts[k] for k in 'ABCDE'), 'classification totals mismatch')
    require(sum(c['useful_unresolved'] for c in evaluation['candidates']) == evaluation['qualifying_unresolved_count'], 'qualification mismatch')
    require(evaluation['disposition'] == 'experimental' and not evaluation['human_approval'], 'disposition changed')
    checked = 0
    if args.velvet:
        def source(revision, name):
            return subprocess.check_output(['git', '-C', str(args.velvet.resolve()), 'show', revision + ':' + name])
        for name, expected in manifest['source_sha256'].items():
            data = source(manifest['velvet_revision'], name)
            require(sha(data) == expected, f'source changed: {name}')
            if name.endswith('/concept.json'):
                concept = json.loads(data)
                require(concept['lifecycle']['status'] == 'defined', 'non-defined Concept')
                text = packet['concepts.md'].decode()
                require(concept['definition']['summary'] in text, 'summary omitted')
                for statement in concept['definition']['statements']:
                    require(statement['id'] in text and statement['text'] in text, 'statement omitted')
                for relation in concept.get('externalRelationships', []):
                    require(all(str(relation[k]) in text for k in ('to', 'kind', 'reason')), 'relationship omitted')
            checked += 1
        for item in evaluation['evidence']:
            require(sha(source(item['revision'], item['path'])) == item['sha256'], 'evaluation evidence changed')
            checked += 1
    print(json.dumps(dict(integrity='pass', inputs=6, candidates=len(ids), counts=evaluation['counts'], qualifying_unresolved=evaluation['qualifying_unresolved_count'], disposition=evaluation['disposition'], pinned_velvet_blobs_checked=checked, semantic_quality='not machine-proven'), indent=2))


if __name__ == '__main__':
    main()
