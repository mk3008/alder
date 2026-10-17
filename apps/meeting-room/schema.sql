PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS rooms (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    state TEXT NOT NULL CHECK (state IN ('available', 'unavailable'))
);

-- Times are UTC microseconds since 1970-01-01, not local-time strings.
CREATE TABLE IF NOT EXISTS reservations (
    id TEXT PRIMARY KEY NOT NULL,
    room_id TEXT NOT NULL REFERENCES rooms(id),
    booker TEXT NOT NULL,
    start_us INTEGER NOT NULL CHECK (typeof(start_us) = 'integer'),
    end_us INTEGER NOT NULL CHECK (typeof(end_us) = 'integer' AND start_us < end_us),
    purpose TEXT NOT NULL,
    state TEXT NOT NULL CHECK (state IN ('reserved', 'cancelled')),
    registered_us INTEGER NOT NULL,
    cancelled_us INTEGER,
    CHECK ((state = 'reserved' AND cancelled_us IS NULL)
        OR (state = 'cancelled' AND cancelled_us IS NOT NULL))
);

CREATE INDEX IF NOT EXISTS reserved_room_time
    ON reservations(room_id, start_us, end_us) WHERE state = 'reserved';

CREATE TRIGGER IF NOT EXISTS reservation_insert_guard
BEFORE INSERT ON reservations WHEN NEW.state = 'reserved'
BEGIN
    SELECT RAISE(ABORT, 'room_unavailable') WHERE NOT EXISTS (
        SELECT 1 FROM rooms WHERE id = NEW.room_id AND state = 'available');
    SELECT RAISE(ABORT, 'overlap') WHERE EXISTS (
        SELECT 1 FROM reservations WHERE room_id = NEW.room_id AND state = 'reserved'
        AND start_us < NEW.end_us AND NEW.start_us < end_us);
END;

CREATE TRIGGER IF NOT EXISTS reservation_update_guard
BEFORE UPDATE ON reservations WHEN NEW.state = 'reserved'
BEGIN
    SELECT RAISE(ABORT, 'room_unavailable') WHERE NOT EXISTS (
        SELECT 1 FROM rooms WHERE id = NEW.room_id AND state = 'available');
    SELECT RAISE(ABORT, 'overlap') WHERE EXISTS (
        SELECT 1 FROM reservations WHERE room_id = NEW.room_id AND state = 'reserved'
        AND id != OLD.id AND start_us < NEW.end_us AND NEW.start_us < end_us);
END;

CREATE TRIGGER IF NOT EXISTS cancelled_is_terminal
BEFORE UPDATE ON reservations WHEN OLD.state = 'cancelled'
BEGIN
    SELECT RAISE(ABORT, 'reservation_cancelled');
END;
