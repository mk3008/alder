import json
import sqlite3
import unittest
from implementation import *

class BusinessTests(unittest.TestCase):
    def test_accept(self):
        logs=[]
        self.assertEqual(case01_accept({"id":"c1","request_id":"r1","email":"synthetic@example.invalid"}, logs.append), {"case_id":"c1","status":"accepted"})
        self.assertEqual(len(logs),1)
    def test_read_own(self):
        code, data=case02_read({"session":"valid","tenant_id":"tenant-a"},{"id":"c1","tenant_id":"tenant-a","subject":"Help"},PlatformIdentity())
        self.assertEqual(code,200)
    def test_read_foreign(self):
        code, data=case02_read({"session":"valid","tenant_id":"tenant-a"},{"id":"c2","tenant_id":"tenant-b","subject":"Other"},PlatformIdentity())
        self.assertEqual(code,403)
    def test_subject(self):
        self.assertEqual(case06_subject("  Help  "),"Help")
    def test_migration_forward(self):
        db=sqlite3.connect(":memory:")
        db.executescript("CREATE TABLE cases (id TEXT PRIMARY KEY, legacy_title TEXT); INSERT INTO cases VALUES ('c1', 'Help');")
        db.executescript(CASE04_UP)
        self.assertEqual(db.execute("SELECT id, subject FROM cases").fetchall(),[("c1","Help")])
