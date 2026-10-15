import unittest
from lending import Item, lend, reserve


class LendingTest(unittest.TestCase):
    def test_lend_available(self):
        item = Item()
        lend(item, user_id="U-7")
        self.assertEqual(item.status, "out")

    def test_refuse_busy(self):
        item = Item()
        lend(item, user_id="U-7")
        before = [dict(loan) for loan in item.loans]
        result = lend(item, user_id="U-8")
        self.assertEqual(result, "unavailable")
        self.assertEqual(item.loans, before)

    def test_reserve(self):
        item = Item(status="out")
        self.assertEqual(reserve(item, "U-9"), "reserved")
        self.assertEqual(item.reservations, ["U-9"])
