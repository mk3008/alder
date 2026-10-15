"""Recompute physical-line churn and a zero-context hunk ledger from snapshots.

No model calls or packages required. Moves count as delete+add in raw churn;
exact-content moves are reported separately rather than hidden by heuristics.
"""
import difflib
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STAGES = ['S0', 'S1']

def files(path):
    return {str(p.relative_to(path)): p.read_text().splitlines(keepends=True) for p in sorted(path.rglob('*')) if p.is_file()}

def kind(path):
    if '.test.' in path or path.startswith(('test/', 'tests/')):
        return 'tests'
    return 'production' if Path(path).suffix in ['.mjs', '.js', '.cjs'] else 'support'

def nonblank_noncomment(lines):
    # Sensitivity only: omit blank lines and standalone // comments, not JS parsing.
    return sum(bool(line.strip()) and not line.lstrip().startswith('//') for line in lines)

def measure():
    rows, ledger = [], []
    for arm in 'ABCD':
        previous = {}
        seen_checks = set()
        cumulative = {'production': 0, 'tests': 0, 'support': 0}
        cumulative_filtered = {'production': 0, 'tests': 0, 'support': 0}
        for stage in STAGES:
            snapshot = ROOT / 'runs' / arm / stage
            if not snapshot.exists():
                break
            current = files(snapshot / 'source')
            stats = {k: {'added': 0, 'deleted': 0, 'nonblank_noncomment_churn': 0, 'changed_files': 0, 'new_files': 0, 'deleted_files': 0} for k in cumulative}
            changed = []
            for name in sorted(previous.keys() | current.keys()):
                old, new = previous.get(name, []), current.get(name, [])
                if old == new:
                    continue
                category = kind(name)
                stats[category]['changed_files'] += 1
                stats[category]['new_files'] += int(name not in previous)
                stats[category]['deleted_files'] += int(name not in current)
                changed.append(name)
                opcodes = difflib.SequenceMatcher(a=old, b=new, autojunk=False).get_opcodes()
                for n, (tag, a, b, c, d) in enumerate(opcodes):
                    if tag == 'equal':
                        continue
                    added, deleted = d-c, b-a
                    stats[category]['added'] += added
                    stats[category]['deleted'] += deleted
                    stats[category]['nonblank_noncomment_churn'] += nonblank_noncomment(old[a:b]) + nonblank_noncomment(new[c:d])
                    ledger.append({'id': f'{arm}/{stage}/{name}:{a}:{b}:{c}:{d}', 'arm': arm, 'stage': stage, 'path': name, 'category': category, 'old_range': [a, b], 'new_range': [c, d], 'added': added, 'deleted': deleted, 'old': ''.join(old[a:b]), 'new': ''.join(new[c:d])})
            moves = [{'from': old, 'to': new} for old in sorted(previous.keys()-current.keys()) for new in sorted(current.keys()-previous.keys()) if previous[old] == current[new]]
            for category in cumulative:
                cumulative[category] += stats[category]['added'] + stats[category]['deleted']
                cumulative_filtered[category] += stats[category]['nonblank_noncomment_churn']
            checks, inherited = [], []
            for p in sorted((snapshot / 'agent-checks').glob('check-*.json')):
                digest = hashlib.sha256(p.read_bytes()).hexdigest()
                if digest in seen_checks:
                    inherited.append({'file': p.name, 'sha256': digest})
                else:
                    checks.append(json.loads(p.read_text()))
                    seen_checks.add(digest)
            rows.append({'arm': arm, 'stage': stage, 'gate_passed': json.loads((snapshot / 'evaluator-check.json').read_text())['passed'], 'agent_check_attempts': len(checks), 'inherited_check_records_not_recounted': inherited, 'failed_agent_checks': sum(not c['passed'] for c in checks), 'stats': stats, 'cumulative_churn': cumulative.copy(), 'cumulative_nonblank_noncomment_churn': cumulative_filtered.copy(), 'changed_paths': changed, 'exact_content_moves': moves, 'production_lines_present': sum(len(lines) for name, lines in current.items() if kind(name) == 'production')})
            previous = current
    return {'algorithm': 'Python difflib.SequenceMatcher, autojunk=False, physical lines including whitespace, zero-context non-equal opcodes', 'rows': rows, 'hunks': ledger}

if __name__ == '__main__':
    print(json.dumps(measure(), indent=2))
