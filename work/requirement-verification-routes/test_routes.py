"""Acceptance assertions authored from frozen requirements, before implementation read."""
import copy
import json
from pathlib import Path
import sqlite3
import tempfile
import unittest

from app import ReservationApp
from maintenance import run_scan, watchdog, regression

ROOT = Path(__file__).resolve().parent
FIX = json.loads((ROOT / 'fixtures.json').read_text())
ORACLE = json.loads((ROOT / 'oracle.json').read_text())


class AppCase(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.db = str(Path(self.tmp.name) / 'app.db')
        self.app = ReservationApp(self.db)
        self.body = copy.deepcopy(FIX['reservation'])

    def rows(self):
        with sqlite3.connect(self.db) as conn:
            return conn.execute('SELECT * FROM reservations ORDER BY id').fetchall()

    def create(self, token='alice-token', **kwargs):
        return self.app.request('POST', '/reservations', token, self.body, **kwargs)


class SystemTests(AppCase):
    def test_SYS1_before_commit_cut_then_retry(self):
        with self.assertRaises(ConnectionError):
            self.create(fault='before_commit')
        self.assertEqual(len(self.rows()), ORACLE['SYS1']['before_commit_rows'])
        self.app = ReservationApp(self.db)
        status, receipt = self.create()
        self.assertEqual(status, ORACLE['SYS1']['retry_status'])
        self.assertEqual(len(self.rows()), ORACLE['SYS1']['retry_rows'])
        self.assertEqual(receipt['owner'], 'alice')

    def test_SYS1_after_commit_cut_then_same_receipt(self):
        with self.assertRaises(ConnectionError):
            self.create(fault='after_commit')
        committed = self.rows()
        self.assertEqual(len(committed), ORACLE['SYS1']['after_commit_rows'])
        with sqlite3.connect(self.db) as conn:
            conn.row_factory = sqlite3.Row
            expected_receipt = dict(conn.execute('SELECT * FROM reservations').fetchone())
            identifier = expected_receipt['id']
        self.app = ReservationApp(self.db)
        status, receipt = self.create()
        self.assertEqual(status, ORACLE['SYS1']['retry_status'])
        self.assertEqual(receipt['id'], identifier)
        self.assertEqual(receipt, expected_receipt)
        self.assertEqual(self.rows(), committed)

    def test_SYS1_changed_payload_is_not_replayed(self):
        status, _ = self.create()
        self.assertEqual(status, 201)
        before = self.rows()
        changed = {**self.body, 'room': 'B'}
        status, _ = self.app.request('POST', '/reservations', 'alice-token', changed)
        self.assertEqual(status, ORACLE['SYS1']['changed_payload_status'])
        self.assertEqual(self.rows(), before)

    def test_SYS1_request_id_is_owner_scoped(self):
        s1, r1 = self.create()
        s2, r2 = self.create('bob-token')
        self.assertEqual((s1, s2), (201, 201))
        self.assertNotEqual(r1['id'], r2['id'])
        self.assertEqual((r1['owner'], r2['owner']), ('alice', 'bob'))
        self.assertEqual(len(self.rows()), 2)


class SecurityTests(AppCase):
    def setUp(self):
        super().setUp()
        status, row = self.create()
        self.assertEqual(status, 201)
        self.path = '/reservations/' + str(row['id'])

    def denied(self, method, path, token, body, expected):
        before = self.rows()
        status, payload = self.app.request(method, path, token, body)
        self.assertEqual(status, expected)
        self.assertEqual(self.rows(), before)
        self.assertEqual(set(payload), {'error'})
        self.assertNotIn('alice', json.dumps(payload))
        self.assertNotIn('09:00', json.dumps(payload))

    def test_SEC1_other_owner_direct_read(self):
        self.denied('GET', self.path, 'bob-token', None, ORACLE['SEC1']['other_get'])

    def test_SEC1_other_owner_direct_cancel(self):
        self.denied('POST', self.path + '/cancel', 'bob-token', {}, ORACLE['SEC1']['other_cancel'])

    def test_SEC1_body_owner_spoof(self):
        self.denied('POST', self.path + '/cancel', 'bob-token', {'owner': 'alice'}, ORACLE['SEC1']['body_spoof_cancel'])

    def test_SEC1_unknown_or_anonymous(self):
        for token, expected in [(None, ORACLE['SEC1']['anonymous']), ('unrecognized', ORACLE['SEC1']['unknown_token'])]:
            for method, path, body in [('GET', self.path, None), ('POST', self.path + '/cancel', {}), ('POST', '/reservations', self.body)]:
                with self.subTest(token=token, method=method, path=path):
                    self.denied(method, path, token, body, expected)

    def test_SEC1_owner_can_read_and_cancel(self):
        status, payload = self.app.request('GET', self.path, 'alice-token')
        self.assertEqual(status, ORACLE['SEC1']['owner_get'])
        self.assertEqual(payload['owner'], 'alice')
        status, _ = self.app.request('POST', self.path + '/cancel', 'alice-token', {})
        self.assertEqual(status, ORACLE['SEC1']['owner_cancel'])
        with sqlite3.connect(self.db) as conn:
            self.assertEqual(conn.execute('SELECT cancelled FROM reservations').fetchone()[0], 1)


class MaintenanceTests(unittest.TestCase):
    def setUp(self):
        self.current = copy.deepcopy(FIX['current_dependency'])
        self.now = FIX['now']
        self.history = [{'status': 'success', 'at': self.now - 86400}]

    def scan(self, case, fail=False):
        current_before, history_before = copy.deepcopy(self.current), copy.deepcopy(self.history)
        result = run_scan(self.current, copy.deepcopy(FIX['advisories'][case]), self.now, self.history, fail=fail)
        self.assertEqual(self.current, current_before)
        self.assertEqual(self.history, history_before)
        self.assertEqual(result['current'], current_before)
        self.assertEqual(result['current']['version'], ORACLE['OPS1']['live_version_after_all_cases'])
        return result

    def event(self, result, kind):
        self.assertIn(kind, [e['type'] for e in result['events']])
        event = next(e for e in result['events'] if e['type'] == kind)
        self.assertEqual(event['at'], self.now)
        return event

    def test_OPS1_clean_scan_records_success(self):
        r = self.scan('clean')
        self.assertEqual(r['status'], ORACLE['OPS1']['clean'])
        self.assertIsNone(r['candidate'])
        self.assertEqual(r['history'][-1]['status'], 'success')
        self.assertEqual(r['history'][-1]['at'], self.now)

    def test_OPS1_fixable_runs_real_regression_without_apply(self):
        r = self.scan('fixable')
        self.assertEqual(r['status'], ORACLE['OPS1']['fixable'])
        event = self.event(r, 'candidate_ready')
        self.assertEqual(event['advisory_id'], 'SYN-001')
        self.assertEqual(event['version'], '1.1')
        self.assertEqual(event['regression'], r['candidate']['regression'])
        self.assertEqual(r['candidate']['advisory_id'], 'SYN-001')
        self.assertEqual(r['candidate']['version'], '1.1')
        probe = r['candidate']['regression']
        self.assertTrue(probe['passed'])
        self.assertEqual(probe['valid_status'], ORACLE['OPS1']['regression_valid_status'])
        self.assertEqual(probe['invalid_status'], ORACLE['OPS1']['regression_invalid_status'])

    def test_OPS1_failed_run_alert_and_no_false_success(self):
        r = self.scan('clean', fail=True)
        self.assertEqual(r['status'], ORACLE['OPS1']['failed'])
        self.event(r, 'scan_failed')
        self.assertEqual(r['history'][-1]['status'], 'failed')
        self.assertEqual(r['history'][-1]['at'], self.now)
        self.assertEqual([h for h in r['history'] if h['status'] == 'success'], self.history)
        self.assertIsNone(r['candidate'])

    def test_OPS1_missing_and_stale_execution_boundaries(self):
        age = FIX['interval_seconds'] + FIX['grace_seconds']
        for history in [[], [{'status': 'failed', 'at': self.now - 1}]]:
            with self.subTest(history=history):
                exact = watchdog(history, self.now, self.now - age)
                overdue = watchdog(history, self.now, self.now - age - 1)
                self.assertEqual(any(e['type'] == 'overdue' for e in exact), ORACLE['OPS1']['missing_exactly_25h'])
                self.assertEqual(any(e['type'] == 'overdue' for e in overdue), ORACLE['OPS1']['missing_25h_plus_one_second'])
                self.assertEqual(overdue[0]['at'], self.now)
                self.assertEqual(overdue[0]['due_at'], self.now - 1)
                self.assertIsNone(overdue[0]['last_success'])
        stale = [{'status': 'success', 'at': self.now - age - 1}, {'status': 'failed', 'at': self.now - 1}]
        self.assertIn('overdue', [e['type'] for e in watchdog(stale, self.now, self.now - 500000)])
        self.assertEqual(watchdog([{'status': 'success', 'at': self.now}], self.now, self.now - 500000), [])

    def test_OPS1_unfixable_stays_manual(self):
        r = self.scan('no_fix')
        self.assertEqual(r['status'], ORACLE['OPS1']['no_fix'])
        event = self.event(r, 'manual_action')
        self.assertEqual(event['advisory_id'], 'SYN-002')
        self.assertIsNone(r['candidate'])
        self.assertEqual(r['history'][-1]['status'], 'success')

    def test_OPS1_breaking_candidate_blocked_by_app_behavior(self):
        r = self.scan('breaking')
        self.assertEqual(r['status'], ORACLE['OPS1']['breaking'])
        event = self.event(r, 'candidate_blocked')
        self.assertEqual(event['advisory_id'], 'SYN-003')
        self.assertEqual(event['version'], '2.0')
        self.assertEqual(event['regression'], r['candidate']['regression'])
        self.assertEqual(r['candidate']['version'], '2.0')
        self.assertEqual(r['candidate']['advisory_id'], 'SYN-003')
        self.assertFalse(r['candidate']['regression']['passed'])
        self.assertNotEqual((r['candidate']['regression']['valid_status'], r['candidate']['regression']['invalid_status']), (201, 400))
        self.assertEqual(r['history'][-1]['status'], 'success')

    def test_OPS1_probe_uses_same_app_and_current_still_passes(self):
        with tempfile.TemporaryDirectory() as directory:
            for version, statuses in [('1.0', (201, 400)), ('1.1', (201, 400)), ('2.0', (400, 201))]:
                app = ReservationApp(str(Path(directory) / (version + '.db')), dependency_version=version)
                valid = app.request('POST', '/reservations', 'alice-token', FIX['reservation'])[0]
                invalid = app.request('POST', '/reservations', 'alice-token', {**FIX['reservation'], 'request_id': 'reverse', 'start': '10:00', 'end': '09:00'})[0]
                self.assertEqual((valid, invalid), statuses)
                observed = regression(version)
                self.assertEqual((observed['valid_status'], observed['invalid_status']), (valid, invalid))


if __name__ == '__main__':
    unittest.main(verbosity=2)
