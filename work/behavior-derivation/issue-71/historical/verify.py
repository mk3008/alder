"""Check historical trial evidence integrity, not semantic usefulness."""
import argparse
from collections import Counter
import hashlib
import json
from pathlib import Path
import subprocess
import tarfile

AREA = Path(__file__).resolve().parent
ROOT = AREA.parents[3]

def sha(data):
    return hashlib.sha256(data).hexdigest()

def check(ok, label):
    if not ok:
        raise SystemExit(label)

def read(path):
    return json.loads(path.read_text())

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--velvet', type=Path, required=True)
    args = parser.parse_args()
    run = read(AREA / 'run.json')
    check(sha((AREA / 'protocol.md').read_bytes()) == run['protocol_sha256'], 'protocol changed')
    check(run['status'] == 'completed' and not run['feedback'], 'run incomplete or feedback added')
    check(run['fork_turns'] == 'none' and run['attempts_per_snapshot'] == 1, 'trial configuration changed')
    total = Counter()
    evidence_count = 0
    def source(rev, path):
        return subprocess.check_output(['git', '-C', str(args.velvet.resolve()), 'show', rev + ':' + path])
    for snapshot in run['snapshots']:
        area = AREA / snapshot['id']
        manifest = read(area / 'input-manifest.json')
        for path, field in [('inputs.tar.gz', 'archive_sha256'), ('launch.txt', 'launch_sha256')]:
            check(sha((area / path).read_bytes()) == manifest[field], path + ' changed')
        with tarfile.open(area / 'inputs.tar.gz') as archive:
            members = archive.getmembers()
            check(len(members) == 6 and all(m.isfile() for m in members), 'unexpected archive members')
            packet = {m.name: archive.extractfile(m).read() for m in members}
        check({name: sha(data) for name, data in packet.items()} == manifest['packet_sha256'], 'packet changed')
        check(packet['functional-considerations.md'] == (AREA.parent / 'discovery/prompt.md').read_bytes(), 'prompt changed')
        concepts = []
        for path, expected in manifest['source_sha256'].items():
            data = source(manifest['velvet_revision'], path)
            check(sha(data) == expected, 'historical source changed: ' + path)
            if path.endswith('/concept.json'):
                c = json.loads(data)
                check(c['lifecycle']['status'] == 'defined', 'non-defined Concept')
                concepts.append(dict(id=c['id'], lifecycle=c['lifecycle'], definition=c['definition'], externalRelationships=c.get('externalRelationships', [])))
            evidence_count += 1
        check(concepts == json.loads(packet['concepts.json']), 'Concept projection changed')
        for path in ('raw.md', 'read-log.json'):
            check(sha((area / path).read_bytes()) == snapshot['output_sha256'][path], 'raw output changed')
        log = read(area / 'read-log.json')
        check({f['name']: f['sha256'] for f in log['files']} == manifest['packet_sha256'], 'read log mismatch')
        check(all(f['read'] == 'full' for f in log['files']), 'incomplete input reading')
        evaluation = read(area / 'evaluation.json')
        for candidate in evaluation['candidates']:
            check(candidate['id'] in (area / 'raw.md').read_text(), 'unknown candidate ID')
            check(candidate['category'] in 'ABCDE', 'invalid category')
        counts = Counter(c['category'] for c in evaluation['candidates'])
        check(dict(counts) == evaluation['counts'], 'classification count mismatch')
        total.update(counts)
    evidence = read(AREA / 'evaluator/evidence.json')
    for item in evidence['git_sources']:
        check(sha(source(item['revision'], item['path'])) == item['sha256'], 'evaluation source changed')
        evidence_count += 1
    for path, expected in evidence['local_sha256'].items():
        check(sha((AREA / path).read_bytes()) == expected, 'evaluation capture changed')
    print(json.dumps(dict(integrity='pass', snapshots=2, counts=dict(total), pinned_blobs_checked=evidence_count, semantic_quality='separate evaluator judgment, not machine proven'), ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main()
