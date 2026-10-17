import json
import sqlite3
import subprocess
import sys
import tempfile
import unittest
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from threading import Barrier

from maintenance import Application, BusinessError

NOW = '2026-09-10T12:00:00+00:00'
PAST = '2026-09-10T11:00:00+00:00'
FUTURE = '2026-09-11T12:00:00+00:00'


class MaintenanceTest(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.path = str(Path(self.directory.name) / 'test.db')
        self.app = Application(self.path, clock=lambda: NOW)
        self.app.initialize()
        self.app.provision('pump')

    def tearDown(self):
        self.app.close()
        self.directory.cleanup()

    def report(self, **overrides):
        values = dict(role='reporter', equipment_id='pump', reported_at=PAST, reported_by='Alice', description='Leak')
        values.update(overrides)
        return self.app.report(**values)['request_id']

    def unchanged(self, action):
        before = self.app.inspect()
        with self.assertRaises(BusinessError):
            action()
        self.assertEqual(before, self.app.inspect())

    def test_lifecycle_and_reopen(self):
        first, second = self.report(), self.report()
        self.assertNotEqual(first, second)
        before = self.app.request(first)
        self.assertEqual(before['status'], 'open')
        self.assertEqual((before['reported_by'], before['description']), ('Alice', 'Leak'))
        self.app.safety('inspector', 'pump')
        self.assertEqual(before, self.app.request(first))
        self.unchanged(lambda: self.app.schedule('coordinator', first, FUTURE))
        self.app.safety('inspector', 'pump', release=True)
        self.assertEqual(before, self.app.request(first))
        scheduled = self.app.schedule('coordinator', first, FUTURE)
        done = self.app.complete('technician', first)
        self.assertEqual(done['status'], 'completed')
        self.assertEqual(done['scheduled_for'], scheduled['scheduled_for'])
        self.assertEqual(done['completed_at'], '2026-09-10T12:00:00.000000+00:00')
        self.assertLess(done['completed_at'], done['scheduled_for'])
        self.app.safety('inspector', 'pump')
        self.assertEqual(done, self.app.request(first))
        self.assertEqual(self.app.request(second)['status'], 'open')
        reopened = Application(self.path)
        try:
            self.assertEqual(reopened.request(first), done)
        finally:
            reopened.close()

    def test_role_matrix(self):
        identifier = self.report()
        operations = [
            ('reporter', lambda r: self.app.report(r, 'pump', PAST, 'Alice', 'Leak')),
            ('coordinator', lambda r: self.app.schedule(r, identifier, FUTURE)),
            ('technician', lambda r: self.app.complete(r, identifier)),
            ('inspector', lambda r: self.app.safety(r, 'pump')),
            ('inspector', lambda r: self.app.safety(r, 'pump', True)),
        ]
        for expected, operation in operations:
            for role in ['reporter', 'coordinator', 'technician', 'inspector', 'unknown']:
                if role != expected:
                    with self.subTest(expected=expected, role=role):
                        self.unchanged(lambda: operation(role))

    def test_state_transitions(self):
        identifier = self.report()
        self.unchanged(lambda: self.app.complete('technician', identifier))
        self.app.schedule('coordinator', identifier, FUTURE)
        self.unchanged(lambda: self.app.schedule('coordinator', identifier, FUTURE))
        self.app.complete('technician', identifier)
        self.unchanged(lambda: self.app.complete('technician', identifier))
        self.unchanged(lambda: self.app.schedule('coordinator', identifier, FUTURE))

    def test_time_boundaries(self):
        identifier = self.report()
        for date in [PAST, NOW, '2026-09-10T21:00:00+09:00', '2026-09-11', 'invalid']:
            with self.subTest(date=date):
                self.unchanged(lambda: self.app.schedule('coordinator', identifier, date))
        self.app.schedule('coordinator', identifier, '2026-09-10T21:00:00.000001+09:00')
        self.assertEqual(self.app.request(identifier)['scheduled_for'], '2026-09-10T12:00:00.000001+00:00')
        self.app.complete('technician', identifier)
        future_report = self.report(reported_at=FUTURE)
        self.app.schedule('coordinator', future_report, FUTURE)
        self.unchanged(lambda: self.app.complete('technician', future_report))
        self.app.clock = lambda: FUTURE
        self.assertEqual(self.app.complete('technician', future_report)['status'], 'completed')

    def test_undefined_cases_have_no_side_effects(self):
        self.unchanged(lambda: self.app.safety('inspector', 'pump', True))
        for release in [False, True]:
            self.unchanged(lambda: self.app.safety('inspector', 'missing', release))
        self.app.safety('inspector', 'pump')
        self.unchanged(lambda: self.report())
        self.unchanged(lambda: self.app.safety('inspector', 'pump'))
        self.app.safety('inspector', 'pump', True)
        identifier = self.report()
        self.app.schedule('coordinator', identifier, FUTURE)
        self.unchanged(lambda: self.app.safety('inspector', 'pump'))

    def test_required_values_and_missing_records(self):
        for field, value in [('reported_by', ' '), ('description', ''), ('reported_at', 'bad'), ('equipment_id', 'missing')]:
            with self.subTest(field=field):
                self.unchanged(lambda: self.report(**{field: value}))
        self.unchanged(lambda: self.app.schedule('coordinator', 'missing', FUTURE))
        self.unchanged(lambda: self.app.complete('technician', 'missing'))
        identifier = self.report(description="'; DROP TABLE equipment; --")
        self.assertIn('DROP TABLE', self.app.request(identifier)['description'])
        self.assertEqual(self.app.equipment('pump')['status'], 'available')

    def test_database_constraints(self):
        identifier = self.report()
        for statement, parameters in [
            ("UPDATE maintenance_request SET status = 'completed' WHERE request_id = ?", (identifier,)),
            ("UPDATE maintenance_request SET equipment_id = 'missing' WHERE request_id = ?", (identifier,)),
            ("INSERT INTO equipment VALUES (NULL, 'available')", ()),
        ]:
            with self.assertRaises(sqlite3.IntegrityError):
                self.app.db.execute(statement, parameters)
        self.assertEqual(self.app.request(identifier)['status'], 'open')

    def test_schedule_closure_race(self):
        identifier = self.report()
        barrier = Barrier(2)
        def run(schedule):
            app = Application(self.path, clock=lambda: NOW)
            try:
                barrier.wait(timeout=5)
                try:
                    if schedule:
                        app.schedule('coordinator', identifier, FUTURE)
                    else:
                        app.safety('inspector', 'pump')
                    return True
                except BusinessError:
                    return False
            finally:
                app.close()
        with ThreadPoolExecutor(max_workers=2) as pool:
            results = list(pool.map(run, [True, False]))
        self.assertEqual(sum(results), 1)
        self.assertIn((self.app.equipment('pump')['status'], self.app.request(identifier)['status']),
                      [('available', 'scheduled'), ('safety_closed', 'open')])

    def test_competing_completion_preserves_first_timestamp(self):
        identifier = self.report()
        self.app.schedule('coordinator', identifier, FUTURE)
        done = self.app.complete('technician', identifier)
        other = Application(self.path, clock=lambda: FUTURE)
        try:
            with self.assertRaises(BusinessError):
                other.complete('technician', identifier)
            self.assertEqual(other.request(identifier), done)
        finally:
            other.close()

    def test_cli(self):
        path = str(Path(self.directory.name) / 'cli.db')
        def cli(*args, success=True):
            result = subprocess.run([sys.executable, '-m', 'maintenance', '--db', path, *args], capture_output=True, text=True)
            self.assertEqual(result.returncode, 0 if success else 1, result.stderr)
            return json.loads(result.stdout if success else result.stderr)
        cli('init')
        cli('init')
        cli('provision', 'pump')
        identifier = cli('report', '--role', 'reporter', 'pump', PAST, 'Alice', 'Leak')['request_id']
        cli('close', '--role', 'inspector', 'pump')
        cli('schedule', '--role', 'coordinator', identifier, '9999-01-01T00:00:00Z', success=False)
        cli('release', '--role', 'inspector', 'pump')
        cli('schedule', '--role', 'coordinator', identifier, '9999-01-01T00:00:00Z')
        cli('complete', '--role', 'reporter', identifier, success=False)
        cli('complete', '--role', 'technician', identifier)
        self.assertEqual(cli('list')['maintenance_request'][0]['status'], 'completed')


if __name__ == '__main__':
    unittest.main()
