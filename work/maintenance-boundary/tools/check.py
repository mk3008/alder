"""Copied unchanged into each workspace; capture every syntax/test attempt."""
import json
import subprocess
from datetime import datetime, timezone
from pathlib import Path

root = Path(__file__).resolve().parent
audit = root / '.audit'
audit.mkdir(exist_ok=True)
number = len(list(audit.glob('check-*.json'))) + 1
commands = [['node', '--check', str(p.relative_to(root))] for p in sorted(root.rglob('*.mjs')) if '.audit' not in p.parts]
commands.append(['node', '--test', '--test-reporter=tap', *[str(p.relative_to(root)) for p in sorted(root.rglob('*.test.mjs')) if '.audit' not in p.parts]])
record = {'started_at': datetime.now(timezone.utc).isoformat(), 'commands': []}
for command in commands:
    run = subprocess.run(command, cwd=root, text=True, capture_output=True)
    record['commands'].append({'argv': command, 'exit_code': run.returncode, 'stdout': run.stdout, 'stderr': run.stderr})
record['finished_at'] = datetime.now(timezone.utc).isoformat()
record['passed'] = all(c['exit_code'] == 0 for c in record['commands'])
(audit / f'check-{number:03}.json').write_text(json.dumps(record, indent=2) + '\n')
print(json.dumps({'record': f'.audit/check-{number:03}.json', 'passed': record['passed']}))
for c in record['commands']:
    if c['exit_code']:
        print(c['stdout'], c['stderr'])
raise SystemExit(0 if record['passed'] else 1)
