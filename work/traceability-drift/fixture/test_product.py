import unittest
from product import accepts, cancel, can_change


class BookingTests(unittest.TestCase):
    def test_limit(self):
        self.assertTrue(accepts(1))
        self.assertTrue(accepts(10))
        self.assertFalse(accepts(0))
        self.assertFalse(accepts(11))

    def test_cancel(self):
        self.assertFalse(cancel(True))

    def test_owner(self):
        self.assertTrue(can_change('owner', 'owner'))
        self.assertFalse(can_change('owner', 'other'))
