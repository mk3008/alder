#!/usr/bin/env python3
"""Read supplied UTF-8 materials and record the exact path and line range."""
from pathlib import Path
import sys, hashlib, json, datetime
base = Path(__file__).resolve().parent
root = base / 'input'
path = (root / sys.argv[1]).resolve()
if not path.is_relative_to(root.resolve()) or not path.is_file():
    raise SystemExit('Only supplied input files can be read.')
raw = path.read_bytes()
lines = raw.decode('utf-8').splitlines(keepends=True)
start = int(sys.argv[2]) if len(sys.argv) > 2 else 1
end = int(sys.argv[3]) if len(sys.argv) > 3 else len(lines)
event = {'utc': datetime.datetime.now(datetime.timezone.utc).isoformat(),
         'path': str(path.relative_to(root)), 'start_line': start,
         'end_line': min(end, len(lines)), 'total_lines': len(lines),
         'sha256': hashlib.sha256(raw).hexdigest()}
with (base / 'reads.jsonl').open('a') as log:
    log.write(json.dumps(event, ensure_ascii=False) + '\n')
print(''.join(lines[start-1:end]), end='')
