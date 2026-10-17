import concurrent.futures
import json
from pathlib import Path
import sqlite3
import subprocess
import sys
import tempfile
import unittest
from app import Application, BusinessError


class WorkflowTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.path = str(Path(self.temp.name) / 'test.db')
        self.app = Application(self.path)

    def tearDown(self):
        self.app.close()
        self.temp.cleanup()

    def submit(self, **changes):
        data = dict(item='モニター', quantity=2, amount='12345.67', reason='業務用')
        data.update(changes)
        return self.app.execute('alice', 'applicant', 'submit', **data)

    def test_purchase_and_persistence(self):
        row = self.submit()
        self.assertEqual(row['status'], 'submitted')
        approved = self.app.execute('bob', 'approver', 'approve', id=row['id'])
        purchased = self.app.execute('carol', 'buyer', 'purchase', id=row['id'], amount='15000.123')
        self.assertEqual(purchased['approved_at'], approved['approved_at'])
        self.assertEqual(purchased['actual_amount'], '15000.123')
        self.assertEqual(purchased['status'], 'purchased')
        self.assertIsNotNone(purchased['purchased_at'])
        for key in ('applicant', 'item', 'quantity', 'requested_amount', 'reason', 'submitted_at'):
            self.assertEqual(purchased[key], row[key])
        other = Application(self.path)
        try:
            self.assertEqual(other.get(row['id']), purchased)
        finally:
            other.close()

    def test_rejection(self):
        row = self.submit()
        rejected = self.app.execute('bob', 'approver', 'reject', id=row['id'], reason='予算不足')
        self.assertEqual(rejected['rejection_reason'], '予算不足')
        self.assertIsNotNone(rejected['rejected_at'])
        self.assertEqual(self.app.execute('carol', 'buyer', 'list'), [])
        with self.assertRaises(BusinessError):
            self.app.execute('carol', 'buyer', 'purchase', id=row['id'], amount='1')
        self.assertEqual(self.app.get(row['id']), rejected)

    def test_all_transition_pairs(self):
        for state in ('submitted', 'approved', 'rejected', 'purchased'):
            for command, role in (('approve', 'approver'), ('reject', 'approver'), ('purchase', 'buyer')):
                with self.subTest(state=state, command=command):
                    row = self.submit()
                    rid = row['id']
                    if state in ('approved', 'purchased'):
                        self.app.execute('bob', 'approver', 'approve', id=rid)
                    if state == 'rejected':
                        self.app.execute('bob', 'approver', 'reject', id=rid, reason='no')
                    if state == 'purchased':
                        self.app.execute('carol', 'buyer', 'purchase', id=rid, amount='0')
                    before = self.app.get(rid)
                    allowed = (state == 'submitted' and command != 'purchase') or (state == 'approved' and command == 'purchase')
                    if allowed:
                        self.app.execute('actor', role, command, id=rid, amount='0', reason='no')
                    else:
                        with self.assertRaises(BusinessError):
                            self.app.execute('actor', role, command, id=rid, amount='0', reason='no')
                        self.assertEqual(self.app.get(rid), before)

    def test_input_validation_and_rollback(self):
        for field, values in {'quantity': [0, -1, 1.5, True, 2**63], 'item': ['', ' \t'],
                              'reason': ['', '\n'], 'amount': ['', '-1', 'NaN', 'Infinity', '1e3', '1,000']}.items():
            for value in values:
                with self.subTest(field=field, value=value), self.assertRaises(BusinessError):
                    self.submit(**{field: value})
        self.assertEqual(self.app.execute('alice', 'applicant', 'list'), [])
        row = self.submit()
        with self.assertRaises(BusinessError):
            self.app.execute('bob', 'approver', 'reject', id=row['id'], reason='  ')
        self.assertEqual(self.app.get(row['id']), row)
        self.app.execute('bob', 'approver', 'approve', id=row['id'])
        before = self.app.get(row['id'])
        with self.assertRaises(BusinessError):
            self.app.execute('carol', 'buyer', 'purchase', id=row['id'], amount='-1')
        self.assertEqual(self.app.get(row['id']), before)

    def test_roles_and_work_queues(self):
        row = self.submit()
        for command, allowed in [('submit', 'applicant'), ('approve', 'approver'), ('reject', 'approver'), ('purchase', 'buyer')]:
            for role in {'applicant', 'approver', 'buyer'} - {allowed}:
                with self.assertRaises(BusinessError):
                    self.app.execute('actor', role, command, id=row['id'])
        self.assertEqual(self.app.execute('bob', 'approver', 'list'), [row])
        self.assertEqual(self.app.execute('other', 'applicant', 'list'), [])
        with self.assertRaises(BusinessError):
            self.app.execute('other', 'applicant', 'show', id=row['id'])
        approved = self.app.execute('bob', 'approver', 'approve', id=row['id'])
        self.assertEqual(self.app.execute('bob', 'approver', 'list'), [])
        self.assertEqual(self.app.execute('carol', 'buyer', 'list'), [approved])
        with self.assertRaises(BusinessError):
            self.app.execute('bob', 'approver', 'approve', id=9999)

    def test_competing_approval_and_rejection(self):
        rid = self.submit()['id']
        def run(command):
            app = Application(self.path)
            try:
                app.execute('bob', 'approver', command, id=rid, reason='no')
                return 'ok'
            except BusinessError:
                return 'conflict'
            finally:
                app.close()
        with concurrent.futures.ThreadPoolExecutor(2) as pool:
            results = list(pool.map(run, ['approve', 'reject']))
        self.assertCountEqual(results, ['ok', 'conflict'])
        self.assertIn(self.app.get(rid)['status'], ['approved', 'rejected'])

    def test_schema_rejects_inconsistent_snapshot(self):
        rid = self.submit()['id']
        with self.assertRaises(sqlite3.IntegrityError), self.app.db:
            self.app.db.execute("UPDATE purchase_request SET status='purchased' WHERE id=?", (rid,))
        self.assertEqual(self.app.get(rid)['status'], 'submitted')

    def test_cli(self):
        base = [sys.executable, str(Path(__file__).with_name('app.py')), '--db', self.path, '--actor', 'alice']
        def cli(role, *args):
            return subprocess.run(base + ['--role', role, *args], capture_output=True, text=True)
        result = cli('applicant', 'submit', '--item', "desk'; DROP TABLE purchase_request;--", '--quantity', '1', '--amount', '0', '--reason', 'work')
        self.assertEqual(result.returncode, 0, result.stderr)
        rid = str(json.loads(result.stdout)['id'])
        self.assertEqual(cli('approver', 'approve', rid).returncode, 0)
        result = cli('buyer', 'purchase', rid, '--amount', '10.50')
        self.assertEqual(json.loads(result.stdout)['status'], 'purchased')
        failure = cli('buyer', 'purchase', rid, '--amount', '10.50')
        self.assertEqual(failure.returncode, 1)
        self.assertIn('error', json.loads(failure.stderr))
        self.assertEqual(len(json.loads(cli('applicant', 'list').stdout)), 1)


if __name__ == '__main__':
    unittest.main()
