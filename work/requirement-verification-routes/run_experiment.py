"""Run normal -> mutated -> restored checks without changing acceptance assertions."""
import argparse
import datetime
import difflib
import hashlib
import json
from pathlib import Path
import platform
import re
import shutil
import sqlite3
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parent
SOURCES = ['app.py', 'maintenance.py', 'test_routes.py', 'fixtures.json', 'oracle.json',
           'protocol.ja.md', 'interface-addendum.ja.md', 'run_experiment.py']
MUTATIONS = [
    {'id': 'system_corrupt_replay_receipt', 'domain': 'system', 'suite': 'SystemTests', 'file': 'app.py',
     'old': 'return 201, dict(existing)', 'new': 'return 201, {**dict(existing), \'room\': \'wrong-room\'}',
     'expected_failure': 'test_SYS1_after_commit_cut_then_same_receipt'},
    {'id': 'system_skip_replay', 'domain': 'system', 'suite': 'SystemTests', 'file': 'app.py',
     'old': '''return connection.execute(
            "SELECT * FROM reservations WHERE owner = ? AND request_id = ?",
            (owner, request_id),
        ).fetchone()''', 'new': 'return None',
     'expected_failure': 'test_SYS1_after_commit_cut_then_same_receipt'},
    {'id': 'security_allow_other_owner', 'domain': 'security', 'suite': 'SecurityTests', 'file': 'app.py',
     'old': 'return row["owner"] == principal', 'new': 'return True',
     'expected_failure': 'test_SEC1_other_owner_direct_read'},
    {'id': 'maintenance_skip_regression', 'domain': 'maintenance', 'suite': 'MaintenanceTests', 'file': 'maintenance.py',
     'old': 'if probe["passed"]:', 'new': 'if True:',
     'expected_failure': 'test_OPS1_breaking_candidate_blocked_by_app_behavior'},
    {'id': 'maintenance_hide_failed_run', 'domain': 'maintenance', 'suite': 'MaintenanceTests', 'file': 'maintenance.py',
     'old': 'result["events"].append({"type": "scan_failed", "at": now})', 'new': 'pass',
     'expected_failure': 'test_OPS1_failed_run_alert_and_no_false_success'},
    {'id': 'maintenance_hide_missing_run', 'domain': 'maintenance', 'suite': 'MaintenanceTests', 'file': 'maintenance.py',
     'old': '''events.append({"type": "overdue", "at": now, "last_success": max(successes) if successes else None,
                       "due_at": reference + interval + grace})''', 'new': 'pass',
     'expected_failure': 'test_OPS1_missing_and_stale_execution_boundaries'},
]


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def hashes(directory):
    return {name: sha(directory / name) for name in SOURCES}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--source-revision', required=True, help='Verified immutable commit used for this run')
    parser.add_argument('--output', required=True, help='New output directory (must not already exist)')
    args = parser.parse_args()
    output = Path(args.output).resolve()
    output.mkdir(parents=True, exist_ok=False)
    manifest = {
        'started_at_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(),
        'protocol_revision': 'a85c9e56e767071a45a59ac68a90c1836c8a9e53',
        'source_revision': args.source_revision,
        'revision_claim': 'Caller-provided revision; verify source_sha256 against that commit.',
        'environment': {'python': platform.python_version(), 'implementation': platform.python_implementation(),
                        'sqlite': sqlite3.sqlite_version, 'os': platform.system(), 'machine': platform.machine()},
        'source_sha256': hashes(ROOT), 'runs': [],
        'log_redaction': 'Only disposable scenario directory replaced with <scenario>; application payloads are synthetic.',
    }
    for mutation in MUTATIONS:
        with tempfile.TemporaryDirectory(prefix='verification-scenario-') as temporary:
            scenario = Path(temporary)
            for name in SOURCES:
                shutil.copyfile(ROOT / name, scenario / name)
            target = scenario / mutation['file']
            original = target.read_text()
            if original.count(mutation['old']) != 1:
                raise RuntimeError('Mutation anchor missing or ambiguous: ' + mutation['id'])
            mutated = original.replace(mutation['old'], mutation['new'])
            diff = ''.join(difflib.unified_diff(original.splitlines(True), mutated.splitlines(True),
                                              fromfile=mutation['file'], tofile=mutation['file']))
            (output / (mutation['id'] + '.diff')).write_text(diff)
            for phase, code in [('normal', original), ('violated', mutated), ('repaired', original)]:
                target.write_text(code)
                # Avoid stale timestamp/size-sensitive bytecode across rapid repairs.
                shutil.rmtree(scenario / '__pycache__', ignore_errors=True)
                command = [sys.executable, '-B', '-m', 'unittest', '-v', 'test_routes.' + mutation['suite']]
                proc = subprocess.run(command, cwd=scenario, capture_output=True, text=True)
                log = (proc.stdout + proc.stderr).replace(str(scenario), '<scenario>')
                log_name = mutation['id'] + '-' + phase + '.log'
                (output / log_name).write_text(log)
                failure_names = re.findall(r'^FAIL: (\S+)', log, flags=re.MULTILINE)
                errors = re.findall(r'^ERROR: (\S+)', log, flags=re.MULTILINE)
                expected_exit = 1 if phase == 'violated' else 0
                correct = proc.returncode == expected_exit and not errors
                if phase == 'violated':
                    correct = correct and mutation['expected_failure'] in failure_names and 'AssertionError' in log
                run = {
                    'mutation': mutation['id'], 'domain': mutation['domain'], 'phase': phase,
                    'command': ['python3', '-B'] + command[2:], 'exit_code': proc.returncode,
                    'expected_exit_code': expected_exit, 'failure_tests': failure_names, 'error_tests': errors,
                    'expected_failure_test': mutation['expected_failure'] if phase == 'violated' else None,
                    'experiment_expectation_met': bool(correct), 'log': log_name,
                    'log_sha256': sha(output / log_name), 'source_sha256': hashes(scenario),
                }
                manifest['runs'].append(run)
                print(mutation['id'], phase, 'exit=' + str(proc.returncode), 'expected=' + str(expected_exit), 'OK' if correct else 'UNEXPECTED')
    manifest['finished_at_utc'] = datetime.datetime.now(datetime.timezone.utc).isoformat()
    manifest['all_expectations_met'] = all(r['experiment_expectation_met'] for r in manifest['runs'])
    manifest['source_unchanged'] = manifest['source_sha256'] == hashes(ROOT)
    (output / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
    return 0 if manifest['all_expectations_met'] and manifest['source_unchanged'] else 1


if __name__ == '__main__':
    sys.exit(main())
