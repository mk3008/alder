import json
import multiprocessing
import os
from pathlib import Path
import sqlite3
import subprocess
import sys
import tempfile
import unittest

from meeting_room import Actor, MeetingRooms, Rejected, initialize, instant


NOW = instant('2030-01-01T00:00:00Z')
START = '2030-01-02T10:00:00Z'
END = '2030-01-02T11:00:00Z'
LATER = '2030-01-02T12:00:00Z'
ALICE = Actor('alice', frozenset({'user'}))
BOB = Actor('bob', frozenset({'user'}))
MANAGER = Actor('manager', frozenset({'manager'}))
ROOMS = [{'id': r, 'name': r.upper(), 'location': '2F', 'state': 'available'} for r in ('a', 'b', 'c')]


def competing_request(path, barrier, queue, operation, reservation=None):
    app = MeetingRooms(path, ALICE if operation != 'disable' else MANAGER, clock=lambda: NOW)
    try:
        barrier.wait(timeout=10)
        if operation == 'reserve':
            app.reserve('a', START, END, 'Concurrent meeting')
        elif operation == 'change':
            app.change(reservation, 'a', START, END)
        else:
            app.set_available('a', False)
        queue.put('ok')
    except Rejected as error:
        queue.put(str(error))
    except BaseException as error:
        queue.put('unexpected:' + repr(error))


class BookingTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.path = str(Path(self.temp.name) / 'rooms.sqlite')
        initialize(self.path, ROOMS)
        self.app = MeetingRooms(self.path, ALICE, clock=lambda: NOW)
        self.manager = MeetingRooms(self.path, MANAGER, clock=lambda: NOW)

    def rows(self):
        with sqlite3.connect(self.path) as db:
            db.row_factory = sqlite3.Row
            return [dict(row) for row in db.execute('SELECT * FROM reservations ORDER BY id')]

    def reserve(self, room='a', start=START, end=END):
        return self.app.reserve(room, start, end, 'Design review')

    def rejected(self, code, operation):
        before = self.rows()
        with self.assertRaisesRegex(Rejected, '^' + code + '$'):
            operation()
        self.assertEqual(before, self.rows(), 'Failed operation must preserve all reservations')

    def test_full_lifecycle_persistence_and_released_slots(self):
        self.assertEqual(3, len(self.app.availability(START, END)))
        reservation = self.reserve()
        self.assertEqual('alice', reservation['booker'])
        self.assertEqual(NOW, reservation['registered_us'])
        self.assertIsNone(reservation['cancelled_us'])
        self.assertEqual(['b', 'c'], [r['id'] for r in self.app.availability(START, END)])
        reopened = MeetingRooms(self.path, ALICE, clock=lambda: NOW + 10)
        changed = reopened.change(reservation['id'], 'b', END, LATER)
        for key in ('id', 'booker', 'purpose', 'registered_us', 'state'):
            self.assertEqual(reservation[key], changed[key])
        self.assertEqual(3, len(self.app.availability(START, END)))
        self.assertEqual(['a', 'c'], [r['id'] for r in self.app.availability(END, LATER)])
        cancelled = reopened.cancel(reservation['id'])
        self.assertEqual('cancelled', cancelled['state'])
        self.assertEqual(NOW + 10, cancelled['cancelled_us'])
        self.assertEqual(3, len(self.app.availability(END, LATER)))
        self.reserve('b', END, LATER)

    def test_all_overlap_shapes_and_touching_boundaries(self):
        self.reserve()
        for start, end in [
            (START, END), ('2030-01-02T09:00:00Z', LATER),
            ('2030-01-02T10:15:00Z', '2030-01-02T10:45:00Z'),
            ('2030-01-02T09:00:00Z', '2030-01-02T10:15:00Z'),
            ('2030-01-02T10:45:00Z', LATER),
            ('2030-01-02T19:00:00+09:00', '2030-01-02T20:00:00+09:00')]:
            with self.subTest(start=start, end=end):
                self.rejected('overlap', lambda: self.reserve(start=start, end=end))
                self.assertNotIn('a', [r['id'] for r in self.app.availability(start, end)])
        self.reserve(start='2030-01-02T09:00:00Z', end=START)
        self.reserve(start=END, end=LATER)
        self.reserve('b')

    def test_change_excludes_self_and_failed_change_preserves_original(self):
        original = self.reserve()
        self.assertEqual(original, self.app.change(original['id'], 'a', START, END))
        self.reserve('b')
        self.rejected('overlap', lambda: self.app.change(original['id'], 'b', START, END))
        self.manager.set_available('c', False)
        self.rejected('room_unavailable', lambda: self.app.change(original['id'], 'c', START, END))
        self.rejected('room_not_found', lambda: self.app.change(original['id'], 'missing', START, END))
        self.rejected('start_not_future', lambda: self.app.change(original['id'], 'a', '2030-01-01T00:00:00Z', END))

    def test_authority_and_cancelled_terminal_state(self):
        reservation = self.reserve()
        bob = MeetingRooms(self.path, BOB, clock=lambda: NOW)
        self.rejected('forbidden', lambda: bob.cancel(reservation['id']))
        self.rejected('forbidden', lambda: bob.change(reservation['id'], 'b', START, END))
        self.rejected('forbidden', lambda: self.manager.cancel(reservation['id']))
        self.rejected('forbidden', lambda: self.app.set_available('a', False))
        self.rejected('forbidden', lambda: self.manager.reserve('a', START, END, 'X'))
        self.rejected('forbidden', lambda: self.manager.availability(START, END))
        self.app.cancel(reservation['id'])
        self.rejected('reservation_cancelled', lambda: self.app.cancel(reservation['id']))
        self.rejected('reservation_cancelled', lambda: self.app.change(reservation['id'], 'b', START, END))

    def test_interval_validation_and_past_availability(self):
        for start, end, error in [
            (END, START, 'invalid_interval'), (START, START, 'invalid_interval'),
            ('2030-01-02T10:00:00', END, 'invalid_datetime'),
            ('2030-02-30T10:00:00Z', END, 'invalid_datetime'),
            ('2030-01-02T10:00:00+00:60', END, 'invalid_datetime'),
            ('2030-01-02T10:00:00.0000001Z', END, 'invalid_datetime')]:
            for operation in (lambda: self.app.availability(start, end), lambda: self.reserve(start=start, end=end)):
                self.rejected(error, operation)
        for start in ('2029-12-31T23:59:59Z', '2030-01-01T00:00:00Z'):
            self.rejected('start_not_future', lambda: self.reserve(start=start))
        self.assertEqual(3, len(self.app.availability('2020-01-01T00:00:00Z', '2020-01-01T01:00:00Z')))
        self.reserve(start='2030-01-01T00:00:00.000001Z')

    def test_missing_inputs_and_records(self):
        self.rejected('required_text', lambda: self.app.reserve('a', START, END, '  '))
        self.rejected('room_not_found', lambda: self.reserve('missing'))
        self.rejected('reservation_not_found', lambda: self.app.cancel('missing'))
        self.rejected('reservation_not_found', lambda: self.app.change('missing', 'a', START, END))
        self.rejected('room_not_found', lambda: self.manager.set_available('missing', False))

    def test_empty_room_unavailability_and_resume(self):
        self.assertEqual('unavailable', self.manager.set_available('a', False)['state'])
        self.assertEqual('unavailable', self.manager.set_available('a', False)['state'])
        self.assertNotIn('a', [r['id'] for r in self.app.availability(START, END)])
        self.rejected('room_unavailable', self.reserve)
        original = self.reserve('b')
        self.rejected('room_unavailable', lambda: self.app.change(original['id'], 'a', START, END))
        self.assertEqual('available', self.manager.set_available('a', True)['state'])
        self.app.change(original['id'], 'a', START, END)

    def test_unavailable_preserves_all_reservations_and_resume_occupancy(self):
        original = self.reserve()
        self.reserve(start=END, end=LATER)
        # The decision applies to past, ongoing and future reservations alike.
        self.reserve(start='2030-01-01T01:00:00Z', end='2030-01-01T02:00:00Z')
        cancelled = self.reserve('b')
        self.app.cancel(cancelled['id'])
        before = self.rows()
        manager = MeetingRooms(self.path, MANAGER, clock=lambda: instant('2030-01-02T10:30:00Z'))
        for _ in range(2):
            self.assertEqual('unavailable', manager.set_available('a', False)['state'])
            self.assertEqual(before, self.rows())
        self.assertNotIn('a', [r['id'] for r in self.app.availability(START, END)])
        self.rejected('room_unavailable', self.reserve)
        self.rejected('room_unavailable', lambda: self.app.change(original['id'], 'a', END, LATER))
        manager.set_available('a', True)
        self.assertEqual(before, self.rows())
        self.assertNotIn('a', [r['id'] for r in self.app.availability(START, END)])
        self.rejected('overlap', self.reserve)
        self.assertIn('a', [r['id'] for r in self.app.availability(LATER, '2030-01-02T13:00:00Z')])

    def test_move_from_unavailable_room_preserves_facts_and_checks_destination(self):
        original = self.reserve()
        self.reserve('b')
        self.manager.set_available('a', False)
        self.manager.set_available('c', False)
        self.rejected('overlap', lambda: self.app.change(original['id'], 'b', START, END))
        self.rejected('room_unavailable', lambda: self.app.change(original['id'], 'c', START, END))
        bob = MeetingRooms(self.path, BOB, clock=lambda: NOW)
        self.rejected('forbidden', lambda: bob.change(original['id'], 'b', END, LATER))
        changed = self.app.change(original['id'], 'b', END, LATER)
        for key in ('id', 'booker', 'purpose', 'registered_us', 'state', 'cancelled_us'):
            self.assertEqual(original[key], changed[key])
        self.manager.set_available('a', True)
        self.assertIn('a', [r['id'] for r in self.app.availability(START, END)])
        self.assertNotIn('b', [r['id'] for r in self.app.availability(END, LATER)])

    def test_cancel_while_unavailable_remains_cancelled_after_resume(self):
        original = self.reserve()
        self.manager.set_available('a', False)
        bob = MeetingRooms(self.path, BOB, clock=lambda: NOW)
        self.rejected('forbidden', lambda: bob.cancel(original['id']))
        cancelled = self.app.cancel(original['id'])
        self.assertEqual('cancelled', cancelled['state'])
        self.assertEqual(NOW, cancelled['cancelled_us'])
        self.assertNotIn('a', [r['id'] for r in self.app.availability(START, END)])
        self.manager.set_available('a', True)
        self.assertEqual([cancelled], self.rows())
        self.assertIn('a', [r['id'] for r in self.app.availability(START, END)])
        self.reserve()

    def test_no_unrequested_cutoff_for_existing_reservations(self):
        reservation = self.reserve()
        after = MeetingRooms(self.path, ALICE, clock=lambda: instant(LATER))
        # Design only restricts the new start, not the old reservation's start.
        after.change(reservation['id'], 'b', '2030-01-03T10:00:00Z', '2030-01-03T11:00:00Z')
        after.cancel(reservation['id'])
        self.assertEqual('cancelled', self.rows()[0]['state'])

    def test_sql_parameters_and_database_guards(self):
        reservation = self.app.reserve('a', START, END, "'); DROP TABLE rooms; --")
        self.assertEqual("'); DROP TABLE rooms; --", reservation['purpose'])
        with sqlite3.connect(self.path) as db:
            with self.assertRaisesRegex(sqlite3.IntegrityError, 'overlap'):
                db.execute('''INSERT INTO reservations SELECT 'other', room_id, booker,
                    start_us, end_us, purpose, state, registered_us, cancelled_us
                    FROM reservations WHERE id = ?''', (reservation['id'],))
        self.app.cancel(reservation['id'])
        with sqlite3.connect(self.path) as db:
            with self.assertRaisesRegex(sqlite3.IntegrityError, 'reservation_cancelled'):
                db.execute("UPDATE reservations SET state = 'reserved', cancelled_us = NULL")

    def race(self, operations):
        context = multiprocessing.get_context('spawn')
        barrier, queue = context.Barrier(len(operations)), context.Queue()
        processes = [context.Process(target=competing_request, args=(self.path, barrier, queue, op, rid)) for op, rid in operations]
        try:
            for process in processes:
                process.start()
            results = [queue.get(timeout=15) for _ in processes]
            for process in processes:
                process.join(timeout=10)
                self.assertEqual(0, process.exitcode)
            return sorted(results)
        finally:
            for process in processes:
                if process.is_alive():
                    process.terminate()
                    process.join(timeout=5)
            queue.close()

    def test_concurrent_reservations_have_one_winner(self):
        self.assertEqual(['ok', 'overlap', 'overlap', 'overlap'], self.race([('reserve', None)] * 4))
        self.assertEqual(1, len(self.rows()))

    def test_concurrent_changes_keep_loser_original(self):
        first, second = self.reserve('b'), self.reserve('c')
        self.assertEqual(['ok', 'overlap'], self.race([('change', first['id']), ('change', second['id'])]))
        rows = {r['id']: r for r in self.rows()}
        self.assertEqual(1, sum(r['room_id'] == 'a' for r in rows.values()))
        for original in (first, second):
            if rows[original['id']]['room_id'] != 'a':
                self.assertEqual(original, rows[original['id']])

    def test_concurrent_reserve_and_change(self):
        original = self.reserve('b')
        self.assertEqual(['ok', 'overlap'], self.race([('reserve', None), ('change', original['id'])]))
        rows = self.rows()
        self.assertEqual(1, sum(r['room_id'] == 'a' for r in rows))
        unchanged = next(r for r in rows if r['id'] == original['id'])
        if unchanged['room_id'] == 'b':
            self.assertEqual(original, unchanged)

    def test_disable_and_reserve_are_serialized(self):
        outcomes = self.race([('reserve', None), ('disable', None)])
        self.assertIn(outcomes, [['ok', 'ok'], ['ok', 'room_unavailable']])
        with sqlite3.connect(self.path) as db:
            self.assertEqual('unavailable', db.execute("SELECT state FROM rooms WHERE id = 'a'").fetchone()[0])
        self.assertEqual(outcomes.count('ok') - 1, len(self.rows()))
        self.manager.set_available('a', True)
        self.assertEqual(not bool(self.rows()), 'a' in [r['id'] for r in self.app.availability(START, END)])

    def test_disable_and_change_preserve_original_or_successful_change(self):
        original = self.reserve('b')
        outcomes = self.race([('change', original['id']), ('disable', None)])
        self.assertIn(outcomes, [['ok', 'ok'], ['ok', 'room_unavailable']])
        expected = dict(original)
        if outcomes == ['ok', 'ok']:
            expected['room_id'] = 'a'
        self.assertEqual([expected], self.rows())
        with sqlite3.connect(self.path) as db:
            self.assertEqual('unavailable', db.execute("SELECT state FROM rooms WHERE id = 'a'").fetchone()[0])
        self.manager.set_available('a', True)
        available = [r['id'] for r in self.app.availability(START, END)]
        self.assertNotIn(expected['room_id'], available)

    def test_clock_is_sampled_after_write_lock(self):
        def clock():
            # Another connection must be unable to acquire a writer lock now.
            with sqlite3.connect(self.path, timeout=0) as other:
                with self.assertRaises(sqlite3.OperationalError):
                    other.execute('BEGIN IMMEDIATE')
            return instant(START)
        app = MeetingRooms(self.path, ALICE, clock=clock)
        self.rejected('start_not_future', lambda: app.reserve('a', START, END, 'X'))

    def test_initialization_never_overwrites(self):
        self.reserve()
        before = Path(self.path).read_bytes()
        with self.assertRaises(FileExistsError):
            initialize(self.path, ROOMS)
        self.assertEqual(before, Path(self.path).read_bytes())

    def test_cli_real_process_flow_and_identity(self):
        root = Path(__file__).resolve().parents[1]
        identity_path = Path(self.temp.name) / 'identity.json'
        identity_path.write_text(json.dumps({str(os.getuid()): {'id': 'cli-user', 'roles': ['user', 'manager']}}))
        def run(*args, expected=0, identity_file=identity_path):
            result = subprocess.run([sys.executable, str(root / 'cli.py'), '--db', self.path,
                '--identity', str(identity_file), *args], text=True, capture_output=True)
            self.assertEqual(expected, result.returncode, result.stderr)
            return json.loads(result.stdout if expected == 0 else result.stderr)
        start, end = '2090-01-02T10:00:00Z', '2090-01-02T11:00:00Z'
        self.assertEqual(3, len(run('availability', '--start', start, '--end', end)))
        reservation = run('reserve', '--room', 'a', '--start', start, '--end', end, '--purpose', 'CLI test')
        self.assertEqual('cli-user', reservation['booker'])
        run('change', '--reservation', reservation['id'], '--room', 'b', '--start', start, '--end', end)
        run('cancel', '--reservation', reservation['id'])
        run('unavailable', '--room', 'b')
        run('resume', '--room', 'b')
        self.assertEqual('reservation_cancelled', run('cancel', '--reservation', reservation['id'], expected=2)['error'])
        identity_path.write_text('{}')
        self.assertEqual('forbidden', run('availability', '--start', start, '--end', end, expected=2)['error'])


if __name__ == '__main__':
    unittest.main()
