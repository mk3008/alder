"""Meeting-room activities, with one SQLite transaction per mutation."""

from contextlib import contextmanager
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
import re
import sqlite3
from uuid import uuid4


class Rejected(Exception):
    """Stable machine-readable rejection code."""


@dataclass(frozen=True)
class Actor:
    # Trusted caller context; never take a booker from reservation input.
    id: str
    roles: frozenset[str]

    def require(self, role):
        if not self.id or role not in self.roles:
            raise Rejected('forbidden')


EPOCH = datetime(1970, 1, 1, tzinfo=timezone.utc)


def instant(value):
    """Accept explicit offsets and up to microsecond precision, without rounding."""
    if not isinstance(value, str) or not re.fullmatch(
        r'\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)', value
    ):
        raise Rejected('invalid_datetime')
    try:
        delta = datetime.fromisoformat(value.replace('Z', '+00:00')) - EPOCH
    except (ValueError, OverflowError) as error:
        raise Rejected('invalid_datetime') from error
    return (delta.days * 86400 + delta.seconds) * 1_000_000 + delta.microseconds


def now_us():
    delta = datetime.now(timezone.utc) - EPOCH
    return (delta.days * 86400 + delta.seconds) * 1_000_000 + delta.microseconds


def interval(start, end):
    start, end = instant(start), instant(end)
    if start >= end:
        raise Rejected('invalid_interval')
    return start, end


def required_text(value):
    if not isinstance(value, str) or not value.strip():
        raise Rejected('required_text')
    return value


def connect(path):
    db = sqlite3.connect(path, timeout=5, isolation_level=None)
    db.row_factory = sqlite3.Row
    db.execute('PRAGMA foreign_keys = ON')
    return db


def initialize(path, rooms):
    """Offline provisioning, not an additional business activity. No overwrite."""
    # Atomic exclusive creation avoids accidentally resetting an existing database.
    with open(path, 'xb'):
        pass
    db = connect(path)
    try:
        db.executescript(Path(__file__).with_name('schema.sql').read_text())
        db.execute('BEGIN IMMEDIATE')
        for room in rooms:
            db.execute('INSERT INTO rooms VALUES (?, ?, ?, ?)', (
                required_text(room['id']), required_text(room['name']),
                required_text(room['location']), room['state']))
        db.commit()
    except BaseException:
        db.rollback()
        raise
    finally:
        db.close()


class MeetingRooms:
    def __init__(self, path, actor, clock=now_us):
        self.path, self.actor, self.clock = path, actor, clock

    @contextmanager
    def transaction(self, write=False):
        # mode=rw keeps a typo from creating a new, empty database.
        uri = Path(self.path).resolve().as_uri() + '?mode=rw'
        db = sqlite3.connect(uri, uri=True, timeout=5, isolation_level=None)
        db.row_factory = sqlite3.Row
        db.execute('PRAGMA foreign_keys = ON')
        try:
            db.execute('BEGIN IMMEDIATE' if write else 'BEGIN')
            yield db
            db.commit()
        except sqlite3.IntegrityError as error:
            db.rollback()
            raise Rejected(str(error)) from error
        except sqlite3.OperationalError as error:
            db.rollback()
            if getattr(error, 'sqlite_errorcode', None) in (sqlite3.SQLITE_BUSY, sqlite3.SQLITE_LOCKED):
                raise Rejected('busy_retry') from error
            raise
        except BaseException:
            db.rollback()
            raise
        finally:
            db.close()

    @staticmethod
    def room(db, room_id, available=False):
        row = db.execute('SELECT * FROM rooms WHERE id = ?', (room_id,)).fetchone()
        if row is None:
            raise Rejected('room_not_found')
        if available and row['state'] != 'available':
            raise Rejected('room_unavailable')
        return dict(row)

    def owned(self, db, reservation_id):
        self.actor.require('user')
        row = db.execute('SELECT * FROM reservations WHERE id = ?', (reservation_id,)).fetchone()
        if row is None:
            raise Rejected('reservation_not_found')
        if row['booker'] != self.actor.id:
            raise Rejected('forbidden')
        if row['state'] != 'reserved':
            raise Rejected('reservation_cancelled')
        return dict(row)

    @staticmethod
    def no_overlap(db, room_id, start, end, exclude=''):
        if db.execute('''SELECT 1 FROM reservations
                WHERE room_id = ? AND state = 'reserved' AND id != ?
                AND start_us < ? AND ? < end_us LIMIT 1''',
                (room_id, exclude, end, start)).fetchone():
            raise Rejected('overlap')

    def availability(self, start, end):
        self.actor.require('user')
        start, end = interval(start, end)
        with self.transaction() as db:
            return [dict(row) for row in db.execute('''
                SELECT * FROM rooms r WHERE r.state = 'available'
                AND NOT EXISTS (SELECT 1 FROM reservations b
                    WHERE b.room_id = r.id AND b.state = 'reserved'
                    AND b.start_us < ? AND ? < b.end_us)
                ORDER BY r.id''', (end, start))]

    def reserve(self, room_id, start, end, purpose):
        self.actor.require('user')
        start, end = interval(start, end)
        purpose = required_text(purpose)
        with self.transaction(write=True) as db:
            now = self.clock()  # Sample after obtaining the writer lock.
            self.room(db, room_id, available=True)
            if start <= now:
                raise Rejected('start_not_future')
            self.no_overlap(db, room_id, start, end)
            reservation_id = str(uuid4())
            db.execute('''INSERT INTO reservations VALUES
                (?, ?, ?, ?, ?, ?, 'reserved', ?, NULL)''',
                (reservation_id, room_id, self.actor.id, start, end, purpose, now))
            return dict(db.execute('SELECT * FROM reservations WHERE id = ?', (reservation_id,)).fetchone())

    def change(self, reservation_id, room_id, start, end):
        self.actor.require('user')
        start, end = interval(start, end)
        with self.transaction(write=True) as db:
            now = self.clock()
            self.owned(db, reservation_id)
            self.room(db, room_id, available=True)
            if start <= now:
                raise Rejected('start_not_future')
            self.no_overlap(db, room_id, start, end, exclude=reservation_id)
            db.execute('''UPDATE reservations SET room_id = ?, start_us = ?, end_us = ?
                WHERE id = ?''', (room_id, start, end, reservation_id))
            return dict(db.execute('SELECT * FROM reservations WHERE id = ?', (reservation_id,)).fetchone())

    def cancel(self, reservation_id):
        self.actor.require('user')
        with self.transaction(write=True) as db:
            self.owned(db, reservation_id)
            db.execute("UPDATE reservations SET state = 'cancelled', cancelled_us = ? WHERE id = ?",
                       (self.clock(), reservation_id))
            return dict(db.execute('SELECT * FROM reservations WHERE id = ?', (reservation_id,)).fetchone())

    def set_available(self, room_id, available):
        self.actor.require('manager')
        if type(available) is not bool:
            raise Rejected('invalid_availability')
        with self.transaction(write=True) as db:
            self.room(db, room_id)
            if not available and db.execute(
                "SELECT 1 FROM reservations WHERE room_id = ? AND state = 'reserved' LIMIT 1",
                (room_id,)).fetchone():
                # Pending Issue #25 Human Decision; this is NOT a business rejection policy.
                raise Rejected('human_decision_required')
            db.execute('UPDATE rooms SET state = ? WHERE id = ?',
                       ('available' if available else 'unavailable', room_id))
            return self.room(db, room_id)
