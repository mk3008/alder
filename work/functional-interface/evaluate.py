"""Reproduce historical tests and bounded observations; never modifies product code."""
from pathlib import Path
import hashlib
import importlib.util
import json
import os
import platform
import sqlite3
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[2]
BASE = Path(__file__).resolve().parent
REV = '94f6f639b850a92ce5ad55812a4899e7a2c7bc33'
PREFIX = 'apps/meeting-room/'


def source(path):
    return subprocess.check_output(['git', 'show', f'{REV}:{path}'], cwd=ROOT)


def main():
    manifest = json.loads((BASE / 'records/manifest.json').read_text())
    paths = manifest['implementation_files']
    for path, expected in manifest['sha256'].items():
        assert hashlib.sha256((ROOT / path).read_bytes()).hexdigest() == expected, path
    with tempfile.TemporaryDirectory(prefix='alder-interface-64-') as temp:
        target = Path(temp)
        appdir = target / 'app'
        for path in paths:
            data = source(path)
            assert hashlib.sha256(data).hexdigest() == manifest['implementation_files'][path], path
            dest = appdir / path.removeprefix(PREFIX)
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_bytes(data)
        env = dict(os.environ, PYTHONDONTWRITEBYTECODE='1')
        baseline = subprocess.run([sys.executable, '-m', 'unittest', 'discover', '-s', 'tests', '-v'],
                                  cwd=appdir, env=env, text=True, capture_output=True, timeout=90)
        result = {'python': platform.python_version(), 'sqlite': sqlite3.sqlite_version,
                  'implementation_revision': REV,
                  'baseline': {'exit_code': baseline.returncode, 'output': baseline.stdout + baseline.stderr}}
        if baseline.returncode:
            print(json.dumps(result, ensure_ascii=False, indent=2))
            return baseline.returncode
        spec = importlib.util.spec_from_file_location('issue64_meeting_room', appdir / 'meeting_room.py')
        module = importlib.util.module_from_spec(spec)
        sys.modules[spec.name] = module
        spec.loader.exec_module(module)
        m = module
        now = m.instant('2030-01-01T00:00:00Z')
        start, end = '2030-01-02T10:00:00Z', '2030-01-02T11:00:00Z'
        alice, manager = m.Actor('alice', frozenset({'user'})), m.Actor('manager', frozenset({'manager'}))
        def setup(name, count):
            path = target / (name + '.sqlite')
            m.initialize(path, [{'id': str(i), 'name': 'Room ' + str(i), 'location': '2F', 'state': 'available'} for i in range(count)])
            return path, m.MeetingRooms(path, alice, clock=lambda: now), m.MeetingRooms(path, manager, clock=lambda: now)
        observations = {}
        path, app, admin = setup('future', 1)
        observations['P1_future_boundary'] = []
        for lower, upper in [('2020-01-01T00:00:00Z', '2020-01-01T01:00:00Z'),
                             ('2030-01-01T00:00:00Z', '2030-01-01T01:00:00Z'), (start, end)]:
            rooms = app.availability(lower, upper)
            observations['P1_future_boundary'].append({'start': lower, 'candidate_count': len(rooms),
                'resolved_M1_requires_no_candidates': m.instant(lower) <= now,
                'resolved_M1_satisfied': not rooms if m.instant(lower) <= now else len(rooms) == 1})
        observations['P2_cardinality'] = []
        for count in [0, 1, 3]:
            _, candidate_app, _ = setup('count' + str(count), count)
            observations['P2_cardinality'].append({'configured_rooms': count,
                'returned_candidates': len(candidate_app.availability(start, end))})
        def rejected(call):
            try:
                call()
                return 'operation_completed'
            except m.Rejected as e:
                return str(e)
        observations['P3_missing_targets'] = {
            'reserve': rejected(lambda: app.reserve('absent', start, end, 'Meeting')),
            'change': rejected(lambda: app.change('absent', '0', start, end)),
            'cancel': rejected(lambda: app.cancel('absent')),
            'disable': rejected(lambda: admin.set_available('absent', False)),
            'resume': rejected(lambda: admin.set_available('absent', True))}
        path, app, admin = setup('lost_result', 1)
        app.reserve('0', start, end, 'Meeting')  # Deliberately discard the returned identity.
        retry = rejected(lambda: app.reserve('0', start, end, 'Meeting'))
        with sqlite3.connect(path) as db:
            saved = db.execute('SELECT COUNT(*) FROM reservations').fetchone()[0]
        # Catalog concrete command names via the actual argparse parser in a subprocess.
        command = "import cli,json; p=cli.parser(); print(json.dumps(sorted(next(a for a in p._actions if hasattr(a,'choices') and isinstance(a.choices,dict)).choices)))"
        catalog = subprocess.run([sys.executable, '-c', command], cwd=appdir, env=env,
                                 text=True, capture_output=True, check=True)
        observations['P4_lost_result'] = {'reservation_count_observed_by_evaluator_SQL_only': saved,
            'retry_result': retry, 'cli_commands': json.loads(catalog.stdout),
            'semantic_note': 'SQL is evaluator evidence, not a supported user reconciliation route. Code inspection is needed to conclude the route is missing.'}
        path, app, admin = setup('continuation', 2)
        original = app.reserve('0', start, end, 'Meeting')
        admin.set_available('1', False)
        failure = rejected(lambda: app.change(original['id'], '1', start, end))
        with sqlite3.connect(path) as db:
            db.row_factory = sqlite3.Row
            after_failure = dict(db.execute('SELECT * FROM reservations WHERE id=?', (original['id'],)).fetchone())
        cancelled = app.cancel(original['id'])
        observations['P5_failure_to_cancel'] = {'change_result': failure,
            'original_preserved': after_failure == original, 'same_id_after_cancel': cancelled['id'] == original['id'],
            'cancelled_state': cancelled['state'], 'released_candidate_ids': [r['id'] for r in app.availability(start, end)]}
        result['observations'] = observations
        result['interpretation'] = 'Historical tests can pass while resolved-design mappings fail. Probes report observations, not product acceptance.'
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 0


if __name__ == '__main__':
    raise SystemExit(main())
