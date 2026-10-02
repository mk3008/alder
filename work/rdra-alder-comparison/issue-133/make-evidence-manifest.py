"""Make bounded manifest chunks for the immutable collected-evidence snapshot."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PREFIX = 'work/rdra-alder-comparison/issue-133/'
source = ROOT / 'publish-batches' / 'all-manifest.json'
rows = json.loads(source.read_text())
destination = ROOT / 'evidence-manifest'
destination.mkdir(exist_ok=True)
batches = ROOT / 'manifest-publish-batches'
batches.mkdir(exist_ok=True)
parts = []
batch_rows = []
size = 0


def save_part(entries):
    index = len(parts)
    name = f'evidence-manifest/{index:04d}.json'
    content = json.dumps(entries, ensure_ascii=False, indent=2) + '\n'
    (ROOT / name).write_text(content)
    parts.append({'path': name, 'files': len(entries), 'sha256': hashlib.sha256(content.encode()).hexdigest()})
    payload = [{'path': PREFIX + name, 'mode': '100644', 'type': 'blob', 'content': content}]
    (batches / f'{index:04d}.json').write_text(json.dumps(payload, ensure_ascii=False))


for row in sorted(rows, key=lambda row: row['path']):
    row_size = len(json.dumps(row, ensure_ascii=False).encode()) + 40
    if batch_rows and size + row_size > 140000:
        save_part(batch_rows)
        batch_rows = []
        size = 0
    batch_rows.append(row)
    size += row_size
if batch_rows:
    save_part(batch_rows)
index = {'scope': 'Collected UTF-8 evidence files at this snapshot, including raw outputs, metadata and helpers. '
                  'Frozen protocol files use benchmark-preparation/SHA256SUMS. '
                  'This manifest excludes its own chunks and later report/navigation commits.',
         'snapshot_manifest_sha256': hashlib.sha256(source.read_bytes()).hexdigest(),
         'files': len(rows), 'bytes': sum(row['bytes'] for row in rows), 'parts': parts,
         'verification': 'At the evidence commit, concatenate these chunks and compare each listed file sha256/bytes. '
                         'Paths are repository-relative. Manifest chunks are checked by their sha256 above.'}
content = json.dumps(index, ensure_ascii=False, indent=2) + '\n'
(ROOT / 'EVIDENCE-MANIFEST.json').write_text(content)
(batches / f'{len(parts):04d}.json').write_text(json.dumps(
    [{'path': PREFIX + 'EVIDENCE-MANIFEST.json', 'mode': '100644', 'type': 'blob', 'content': content}], ensure_ascii=False))
print(json.dumps({'manifest_files': len(parts) + 1, 'evidence_files': len(rows), 'bytes': index['bytes']}))
