"""Reveal one next-stage packet after the previous four snapshots pass."""
import shutil
import sys
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STAGES = ['S0', 'U1', 'U2', 'F1', 'F2']
stage = sys.argv[1]
index = STAGES.index(stage)
assert index > 0
for arm in 'ABCD':
    prior = ROOT / 'runs' / arm / STAGES[index - 1]
    assert json.loads((prior / 'manifest.json').read_text())['evaluator_exit_code'] == 0
for arm in 'ABCD':
    workspace = ROOT.parents[2] / ('pilot-' + arm.lower())
    shutil.copyfile(ROOT / f'prompts/{arm}-{stage}.md', workspace / 'REQUEST.md')
    shutil.copyfile(ROOT / f'gates/{stage}.test.mjs', workspace / 'acceptance.test.mjs')
    # Checks are already archived in the preceding immutable snapshot.
    shutil.rmtree(workspace / '.audit')
    (workspace / 'REPORT.md').unlink()
print('Revealed', stage, 'to four workspaces; previous stage preserved.')
