"""Isolated reservation boundary; tokens and dependency behavior are synthetic."""

import re
import sqlite3


class ReservationApp:
    PRINCIPALS = {"alice-token": "alice", "bob-token": "bob"}

    def __init__(self, db_path, dependency_version="1.0"):
        if dependency_version not in {"1.0", "1.1", "2.0"}:
            raise ValueError("Unsupported synthetic dependency version")
        self.db_path = str(db_path)
        self.dependency_version = dependency_version
        connection = self._connect()
        try:
            connection.execute("""
                CREATE TABLE IF NOT EXISTS reservations (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    owner TEXT NOT NULL,
                    request_id TEXT NOT NULL,
                    room TEXT NOT NULL,
                    start INTEGER NOT NULL,
                    end INTEGER NOT NULL,
                    cancelled INTEGER NOT NULL DEFAULT 0,
                    UNIQUE (owner, request_id)
                )
            """)
            connection.commit()
        finally:
            connection.close()

    def _connect(self):
        connection = sqlite3.connect(self.db_path)
        connection.row_factory = sqlite3.Row
        return connection

    @staticmethod
    def _minute(value):
        if not isinstance(value, str) or not re.fullmatch(r"[0-9]{2}:[0-9]{2}", value):
            raise ValueError("Invalid time")
        hour, minute = map(int, value.split(":"))
        if not 0 <= hour < 24 or not 0 <= minute < 60:
            raise ValueError("Invalid time")
        return hour * 60 + minute

    def _ordered(self, start, end):
        # fake-time 2.0 deliberately changes actual dependency behavior.
        return start > end if self.dependency_version == "2.0" else start < end

    @staticmethod
    def _lookup_request(connection, owner, request_id):
        # Mutation anchor: request lookup.
        return connection.execute(
            "SELECT * FROM reservations WHERE owner = ? AND request_id = ?",
            (owner, request_id),
        ).fetchone()

    @staticmethod
    def _authorized(row, principal):
        # Mutation anchor: owner authorization.
        return row["owner"] == principal

    def request(self, method, path, token, body=None, fault=None):
        principal = self.PRINCIPALS.get(token)
        if principal is None:
            return 401, {"error": "unauthenticated"}
        if fault not in {None, "before_commit", "after_commit"}:
            raise ValueError("Unknown fault")
        if method == "POST" and path == "/reservations":
            return self._create(principal, body, fault)
        route = re.fullmatch(r"/reservations/([0-9]+)(/cancel)?", path)
        if route is None:
            return 404, {"error": "not_found"}
        cancelling = method == "POST" and route.group(2) == "/cancel"
        reading = method == "GET" and route.group(2) is None
        if not (reading or cancelling):
            return 404, {"error": "not_found"}
        connection = self._connect()
        try:
            row = connection.execute(
                "SELECT * FROM reservations WHERE id = ?", (int(route.group(1)),)
            ).fetchone()
            if row is None:
                return 404, {"error": "not_found"}
            if not self._authorized(row, principal):
                return 403, {"error": "forbidden"}
            if cancelling:
                connection.execute(
                    "UPDATE reservations SET cancelled = 1 WHERE id = ?", (row["id"],)
                )
                self._commit(connection, fault)
                row = connection.execute(
                    "SELECT * FROM reservations WHERE id = ?", (row["id"],)
                ).fetchone()
            return 200, dict(row)
        finally:
            connection.close()

    def _create(self, principal, body, fault):
        if not isinstance(body, dict):
            return 400, {"error": "invalid_body"}
        request_id, room = body.get("request_id"), body.get("room")
        if not isinstance(request_id, str) or not request_id or not isinstance(room, str) or not room:
            return 400, {"error": "invalid_body"}
        try:
            start, end = self._minute(body.get("start")), self._minute(body.get("end"))
        except ValueError:
            return 400, {"error": "invalid_time"}
        if not self._ordered(start, end):
            return 400, {"error": "invalid_time"}
        connection = self._connect()
        try:
            existing = self._lookup_request(connection, principal, request_id)
            if existing is not None:
                if (existing["room"], existing["start"], existing["end"]) != (room, start, end):
                    return 409, {"error": "request_conflict"}
                return 201, dict(existing)
            try:
                cursor = connection.execute(
                    "INSERT INTO reservations (owner, request_id, room, start, end) VALUES (?, ?, ?, ?, ?)",
                    (principal, request_id, room, start, end),
                )
            except sqlite3.IntegrityError:
                connection.rollback()
                return 409, {"error": "request_conflict"}
            reservation_id = cursor.lastrowid
            self._commit(connection, fault)
            row = connection.execute(
                "SELECT * FROM reservations WHERE id = ?", (reservation_id,)
            ).fetchone()
            return 201, dict(row)
        finally:
            connection.close()

    @staticmethod
    def _commit(connection, fault):
        if fault == "before_commit":
            connection.close()  # Real SQLite close rolls back the uncommitted transaction.
            raise ConnectionError("Connection closed before commit")
        connection.commit()
        if fault == "after_commit":
            connection.close()  # Committed data survives loss of the response.
            raise ConnectionError("Connection closed after commit")
