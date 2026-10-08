"""Local purchase-request CLI; Python standard library only."""
import argparse
from datetime import datetime, timezone
from decimal import Decimal, InvalidOperation
import json
from pathlib import Path
import re
import sqlite3
import sys


class BusinessError(ValueError):
    pass


def required(value):
    if not isinstance(value, str) or not value.strip():
        raise BusinessError('A nonblank value is required')
    return value.strip()


def amount(value):
    value = required(value)
    if not re.fullmatch(r'[0-9]+(?:\.[0-9]+)?', value):
        raise BusinessError('Amount must be a nonnegative decimal (no exponent)')
    try:
        return format(Decimal(value), 'f')
    except InvalidOperation as exc:
        raise BusinessError('Invalid amount') from exc


class Application:
    def __init__(self, database):
        self.db = sqlite3.connect(database, timeout=10)
        self.db.row_factory = sqlite3.Row
        self.db.executescript(Path(__file__).with_name('schema.sql').read_text())

    def close(self):
        self.db.close()

    def execute(self, actor, role, command, **data):
        actor = required(actor)
        roles = {'submit': 'applicant', 'approve': 'approver',
                 'reject': 'approver', 'purchase': 'buyer'}
        if role not in ('applicant', 'approver', 'buyer'):
            raise BusinessError('Unknown role')
        if command in roles and role != roles[command]:
            raise BusinessError('Role is not permitted for this operation')
        if command == 'list':
            # Role-specific work queues, including the applicant\'s own history.
            if role == 'applicant':
                rows = self.db.execute('SELECT * FROM purchase_request WHERE applicant = ? ORDER BY id', (actor,))
            else:
                rows = self.db.execute('SELECT * FROM purchase_request WHERE status = ? ORDER BY id',
                                       ('submitted' if role == 'approver' else 'approved',))
            return [dict(row) for row in rows]
        if command == 'show':
            row = self.get(data['id'])
            if role == 'applicant' and row['applicant'] != actor:
                raise BusinessError('Cannot view another applicant\'s request')
            return row
        if command not in roles:
            raise BusinessError('Unknown operation')
        # Acquire the writer lock before checking the current state. Any error
        # rolls back, including errors after a state change but before returning.
        with self.db:
            self.db.execute('BEGIN IMMEDIATE')
            now = datetime.now(timezone.utc).isoformat()
            if command == 'submit':
                quantity = data['quantity']
                if type(quantity) is not int or not 0 < quantity <= 9223372036854775807:
                    raise BusinessError('Quantity must be a positive SQLite integer')
                cursor = self.db.execute(
                    'INSERT INTO purchase_request (applicant,item,quantity,requested_amount,reason,submitted_at) VALUES (?,?,?,?,?,?)',
                    (actor, required(data['item']), quantity, amount(data['amount']), required(data['reason']), now))
                request_id = cursor.lastrowid
            else:
                request_id = data['id']
                current = self.get(request_id)
                expected = 'approved' if command == 'purchase' else 'submitted'
                if current['status'] != expected:
                    raise BusinessError(f'Expected {expected}; found {current["status"]}')
                if command == 'approve':
                    self.db.execute("UPDATE purchase_request SET status='approved', approved_at=? WHERE id=?", (now, request_id))
                elif command == 'reject':
                    self.db.execute("UPDATE purchase_request SET status='rejected', rejected_at=?, rejection_reason=? WHERE id=?",
                                    (now, required(data['reason']), request_id))
                else:
                    self.db.execute("UPDATE purchase_request SET status='purchased', purchased_at=?, actual_amount=? WHERE id=?",
                                    (now, amount(data['amount']), request_id))
            return self.get(request_id)

    def get(self, request_id):
        if type(request_id) is not int or not 0 < request_id <= 9223372036854775807:
            raise BusinessError('Invalid request id')
        row = self.db.execute('SELECT * FROM purchase_request WHERE id=?', (request_id,)).fetchone()
        if row is None:
            raise BusinessError('Request not found')
        return dict(row)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--db', required=True)
    parser.add_argument('--actor', required=True)
    parser.add_argument('--role', required=True, choices=['applicant', 'approver', 'buyer'])
    commands = parser.add_subparsers(dest='command', required=True)
    submit = commands.add_parser('submit')
    submit.add_argument('--item', required=True)
    submit.add_argument('--quantity', type=int, required=True)
    submit.add_argument('--amount', required=True)
    submit.add_argument('--reason', required=True)
    commands.add_parser('list')
    for name in ('show', 'approve', 'reject', 'purchase'):
        command = commands.add_parser(name)
        command.add_argument('id', type=int)
        if name == 'reject':
            command.add_argument('--reason', required=True)
        if name == 'purchase':
            command.add_argument('--amount', required=True)
    args = vars(parser.parse_args())
    app = None
    try:
        app = Application(args.pop('db'))
        print(json.dumps(app.execute(**args), ensure_ascii=False, indent=2))
        return 0
    except (BusinessError, sqlite3.Error) as exc:
        print(json.dumps({'error': str(exc)}, ensure_ascii=False), file=sys.stderr)
        return 1
    finally:
        if app is not None:
            app.close()


if __name__ == '__main__':
    sys.exit(main())
