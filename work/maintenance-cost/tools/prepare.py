"""Generate evaluator suites and stage packets before any implementation run."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPO = ROOT.parents[1]
STAGES = ['S0', 'U1', 'U2', 'F1', 'F2']
packets = (REPO / 'docs/maintenance-cost/packets.md').read_text()
sections = {}
for section in packets.split('\n## ')[1:]:
    title, body = section.split('\n', 1)
    sections[title] = body.strip()

for index, stage in enumerate(STAGES):
    suite = (ROOT / 'gates/base.txt').read_text().replace('__NOTE__', ", note: ''" if index else '')
    if index >= 1:
        suite += (ROOT / 'gates/note.txt').read_text()
    if index >= 2:
        suite += (ROOT / 'gates/filter.txt').read_text()
    if index >= 3:
        suite += (ROOT / 'gates/authority.txt').read_text().replace('__THRESHOLD__', '100000' if stage == 'F1' else '50000').replace('__AMOUNTS__', '[49999, 50000, 99999, 100000]')
    (ROOT / f'gates/{stage}.test.mjs').write_text(suite)
    for arm in 'ABCD':
        body = sections['Common current packet — S0'] if index == 0 else next(v for k, v in sections.items() if k.startswith(stage + ' —'))
        if index == 0 and arm != 'A':
            body += '\n\n' + sections[f'Additional initial instruction — {arm} only']
        body += '''\n\nExecution and evidence instructions:
Work only inside your assigned absolute workspace, including for searches. Do not inspect parent directories, other workspaces, GitHub, personal context, research materials or external sources. The current REQUEST.md and acceptance.test.mjs are the complete assigned requirements and evaluator tests. No other repository instructions apply to this isolated fixture. You may inspect standard runtime help. Do not spawn agents, use skills, publish, commit or push.
Implement the requested behavior in this workspace. Keep evaluator files REQUEST.md, acceptance.test.mjs and check.py unchanged. You may add your own *.test.mjs files. Run python3 check.py for every verification attempt; it saves commands, output and exit codes under .audit/. If any test fails, preserve that attempt and fix without weakening tests; at most two correction rounds after the first check. Record untested intermediate failures honestly too. Write REPORT.md for this stage describing actual files read, design decisions, changes, tests, failures/corrections, and accidental outside-context exposure (or none). Do not estimate tokens or time. Stop after the current stage and return a brief final report.
'''
        (ROOT / f'prompts/{arm}-{stage}.md').write_text(body)

hashes = {str(p.relative_to(ROOT)): hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(ROOT.rglob('*')) if p.is_file() and p.parts[-2] in ('gates', 'prompts')}
(ROOT / 'records/frozen-inputs.json').write_text(json.dumps(hashes, indent=2) + '\n')
print(f'Prepared {len(STAGES)} suites and 20 packets; hashed {len(hashes)} files.')
