"""Synthetic local prototype; no network, credentials, or production data."""
import sqlite3


DDL = """
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY,
    partner TEXT NOT NULL,
    external_ref TEXT NOT NULL,
    UNIQUE (partner, external_ref)
)
"""


def open_database(path=":memory:"):
    connection = sqlite3.connect(path)
    connection.execute(DDL)
    connection.commit()
    return connection


def register(connection, partner, external_ref):
    try:
        with connection:
            cursor = connection.execute(
                "INSERT INTO orders (partner, external_ref) VALUES (?, ?)",
                (partner, external_ref),
            )
    except sqlite3.IntegrityError:
        return {"status": "duplicate", "order_id": None, "external_ref": external_ref}
    return {"status": "created", "order_id": cursor.lastrowid,
            "external_ref": external_ref}


def receipt_text(order_id, external_ref):
    return f"Order {order_id}: {external_ref}"
