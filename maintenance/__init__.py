"""Facilities maintenance application; Python standard library only."""
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4


class BusinessError(ValueError):
    pass


def timestamp(value):
    try:
        date = datetime.fromisoformat(value)
        if date.utcoffset() is None:
            raise ValueError()
        return date.astimezone(timezone.utc).isoformat(timespec='microseconds')
    except (TypeError, ValueError, OverflowError):
        raise BusinessError('Timestamp must be ISO 8601 with a timezone') from None


def required(value):
    if not isinstance(value, str) or not value.strip():
        raise BusinessError('Required text must not be blank')
    return value


class Application:
    def __init__(self, database, clock=None):
        self.db = sqlite3.connect(database, isolation_level=None, timeout=10)
        self.db.row_factory = sqlite3.Row
        self.db.execute('PRAGMA foreign_keys = ON')
        self.clock = clock or (lambda: datetime.now(timezone.utc).isoformat())

    def close(self):
        self.db.close()

    def initialize(self):
        self.db.executescript(Path(__file__).with_name('schema.sql').read_text())

    @contextmanager
    def transaction(self):
        self.db.execute('BEGIN IMMEDIATE')
        try:
            yield
            self.db.execute('COMMIT')
        except BaseException:
            self.db.execute('ROLLBACK')
            raise

    def authorize(self, role, expected):
        if role != expected:
            raise BusinessError('Forbidden: requires ' + expected)

    def equipment(self, identifier):
        row = self.db.execute('SELECT * FROM equipment WHERE equipment_id = ?', (identifier,)).fetchone()
        if row is None:
            raise BusinessError('Equipment not found; no change made')
        return dict(row)

    def request(self, identifier):
        row = self.db.execute('SELECT * FROM maintenance_request WHERE request_id = ?', (identifier,)).fetchone()
        if row is None:
            raise BusinessError('Request not found')
        return dict(row)

    def provision(self, identifier):
        """Local setup command, outside the five business operations."""
        with self.transaction():
            self.db.execute('INSERT INTO equipment VALUES (?, ?)', (required(identifier), 'available'))
        return self.equipment(identifier)

    def report(self, role, equipment_id, reported_at, reported_by, description):
        self.authorize(role, 'reporter')
        with self.transaction():
            if self.equipment(equipment_id)['status'] == 'safety_closed':
                raise BusinessError('Undefined business policy: report on closed equipment')
            identifier = str(uuid4())
            self.db.execute('INSERT INTO maintenance_request VALUES (?, ?, ?, ?, ?, ?, NULL, NULL)',
                            (identifier, equipment_id, required(reported_by), timestamp(reported_at), required(description), 'open'))
            result = self.request(identifier)
        return result

    def schedule(self, role, request_id, scheduled_for):
        self.authorize(role, 'coordinator')
        with self.transaction():
            request = self.request(request_id)
            if request['status'] != 'open':
                raise BusinessError('Only open requests can be scheduled')
            if self.equipment(request['equipment_id'])['status'] != 'available':
                raise BusinessError('Equipment is safety closed')
            planned = timestamp(scheduled_for)
            if planned <= timestamp(self.clock()):
                raise BusinessError('Schedule must be strictly in the future')
            self.db.execute("UPDATE maintenance_request SET status = 'scheduled', scheduled_for = ? WHERE request_id = ?", (planned, request_id))
            result = self.request(request_id)
        return result

    def complete(self, role, request_id):
        self.authorize(role, 'technician')
        with self.transaction():
            request = self.request(request_id)
            if request['status'] != 'scheduled':
                raise BusinessError('Only scheduled requests can be completed')
            if self.equipment(request['equipment_id'])['status'] == 'safety_closed':
                raise BusinessError('Undefined business policy: scheduled request on closed equipment')
            completed = timestamp(self.clock())
            if completed < request['reported_at']:
                raise BusinessError('Completion cannot precede report')
            self.db.execute("UPDATE maintenance_request SET status = 'completed', completed_at = ? WHERE request_id = ?", (completed, request_id))
            result = self.request(request_id)
        return result

    def safety(self, role, equipment_id, release=False):
        self.authorize(role, 'inspector')
        with self.transaction():
            equipment = self.equipment(equipment_id)
            expected = 'safety_closed' if release else 'available'
            if equipment['status'] != expected:
                raise BusinessError('Undefined or invalid repeated safety operation')
            if not release and self.db.execute("SELECT 1 FROM maintenance_request WHERE equipment_id = ? AND status = 'scheduled'", (equipment_id,)).fetchone():
                raise BusinessError('Undefined business policy: closure with scheduled requests')
            self.db.execute('UPDATE equipment SET status = ? WHERE equipment_id = ?', ('available' if release else 'safety_closed', equipment_id))
            result = self.equipment(equipment_id)
        return result

    def inspect(self):
        # One read transaction gives a consistent view of both tables.
        self.db.execute('BEGIN')
        try:
            return {table: [dict(row) for row in self.db.execute('SELECT * FROM ' + table + ' ORDER BY 1')]
                    for table in ('equipment', 'maintenance_request')}
        finally:
            self.db.execute('ROLLBACK')
