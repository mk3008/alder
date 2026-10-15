"""Assertions for confirmed business expectations, not operational certification."""
import unittest
from order_register import open_database, receipt_text, register


class RegistrationTests(unittest.TestCase):
    def setUp(self):
        self.connection = open_database()

    def tearDown(self):
        self.connection.close()

    def test_same_partner_reference_is_rejected(self):
        # CHK-01: the rejected attempt does not add another order.
        first = register(self.connection, "partner-a", "PO-17")
        second = register(self.connection, "partner-a", "PO-17")
        self.assertEqual(first["status"], "created")
        self.assertIsInstance(first["order_id"], int)
        self.assertEqual(second["status"], "duplicate")
        self.assertIsNone(second["order_id"])
        self.assertEqual(self.connection.execute("SELECT COUNT(*) FROM orders").fetchone()[0], 1)

    def test_other_partner_may_reuse_reference(self):
        # CHK-02: rejection scope is the partner, not all orders.
        first = register(self.connection, "partner-a", "PO-17")
        second = register(self.connection, "partner-b", "PO-17")
        self.assertEqual((first["status"], second["status"]), ("created", "created"))
        self.assertNotEqual(first["order_id"], second["order_id"])
        self.assertEqual(self.connection.execute("SELECT COUNT(*) FROM orders").fetchone()[0], 2)


class ReceiptTests(unittest.TestCase):
    def test_receipt_preserves_saved_identifiers(self):
        # CHK-03: independently testable without opening a database.
        self.assertEqual(receipt_text(17, "PO-17"), "Order 17: PO-17")
        self.assertEqual(receipt_text(23, "B-004"), "Order 23: B-004")


if __name__ == "__main__":
    unittest.main()
