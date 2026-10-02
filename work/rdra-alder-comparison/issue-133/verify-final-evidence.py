"""Verify byte provenance without modifying business artifacts or anonymous inputs."""
import hashlib
import json
from pathlib import Path
import sys
import packetize

ROOT = Path(__file__).resolve().parent


def sha(data):
    return hashlib.sha256(data).hexdigest()


def assembled(row, handoff=False):
    files = packetize.files_for(row['arm'], row['case'], row['replicate'], row['stage'])
    if handoff and row['arm'] == 'rdra':
        files = [(p, rel) for p, rel in files if rel.startswith('1_RDRA/')]
    return '\n'.join(f'## Artifact {i:03d}\n' + packetize.anonymize(p.read_text())[0]
                     for i, (p, _) in enumerate(files, 1)).encode()


def verify(require_complete=False):
    canonical = []
    probes = []
    received = []
    errors = []
    for row in packetize.mapping:
        pid = row['blind_id']
        directory = ROOT / 'canonical-extractions' / pid
        meta = directory / 'metadata.json'
        if meta.exists() and json.loads(meta.read_text()).get('status') == 'success':
            expected = assembled(row)
            actual = (directory / 'packet.md').read_bytes()
            canonical.append({'packet_id': pid, 'matches_completed_artifacts': expected == actual,
                              'expected_sha256': sha(expected), 'actual_sha256': sha(actual)})
            if expected != actual:
                errors.append(pid + ': canonical input differs from complete artifact assembly')
        if row['stage'] != 's3':
            continue
        directory = ROOT / 'blind-probes' / pid
        meta = directory / 'metadata.json'
        if not meta.exists() or json.loads(meta.read_text()).get('status') != 'success':
            continue
        s2 = next(x for x in packetize.mapping if x['stage'] == 's2' and
                  all(x[k] == row[k] for k in ['arm', 'case', 'replicate']))
        expected = assembled(s2, handoff=True)
        actual = (directory / 'packet.md').read_bytes()
        m = json.loads(meta.read_text())
        matches = expected == actual
        probes.append({'packet_id': pid, 'matches_final_handoff_scope': matches,
                       'expected_sha256': sha(expected), 'actual_sha256': sha(actual)})
        if not matches:
            errors.append(pid + ': probe input differs from final handoff scope')
        # Validate recorded input hashes separately from reassembled content.
        recorded = {'packet.md': m['packet_sha256'],
                    'downstream-prompt.txt': m['prompt_sha256'],
                    'envelope.txt': m['envelope_sha256'], **m.get('output_sha256', {})}
        for name, digest in recorded.items():
            path = directory / name
            if not path.is_file() or sha(path.read_bytes()) != digest:
                errors.append(pid + ': recorded probe input hash differs: ' + name)
    index = ROOT / 'handoff-extractions' / 'handoff-index.json'
    if index.exists():
        for entry in json.loads(index.read_text())['entries']:
            if entry['canonical_status'] not in ['fresh_success', 'reused_byte_identical']:
                continue
            pid = entry['stage3_packet_id']
            actual = (ROOT / 'blind-probes' / pid / 'packet.md').read_bytes()
            cp = ROOT / entry['received_canonical_file']
            recorded_packet = cp.parent / 'packet.md'
            matches = (sha(actual) == entry['received_input_sha256'] == sha(recorded_packet.read_bytes())
                       and sha(cp.read_bytes()) == entry['received_canonical_sha256'])
            received.append({'packet_id': pid, 'matches_actual_received_input': matches,
                             'canonical_status': entry['canonical_status']})
            if not matches:
                errors.append(pid + ': received canonical provenance mismatch')
    if require_complete:
        for label, count, expected in [('canonical', len(canonical), 60), ('probes', len(probes), 20),
                                      ('received', len(received), 20)]:
            if count != expected:
                errors.append(f'{label}: expected {expected}, found {count}')
    result = {'scope': 'Byte provenance only; procedural isolation and semantic judgments are not independently proven.',
              'canonical_rows': canonical, 'probe_rows': probes, 'received_rows': received, 'errors': errors}
    (ROOT / 'evaluation-result' / 'final-byte-provenance.json').write_text(
        json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'canonical': len(canonical), 'probes': len(probes), 'received': len(received),
                      'errors': errors}, ensure_ascii=False))
    if errors:
        raise SystemExit(1)


if __name__ == '__main__':
    verify('--require-complete' in sys.argv)
