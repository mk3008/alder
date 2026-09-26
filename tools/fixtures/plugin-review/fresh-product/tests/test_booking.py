import unittest
from src.booking import Booking, reserve

class BookingTest(unittest.TestCase):
    def test_adjacent_booking(self):
        self.assertTrue(reserve([Booking('A', 9, 10)], Booking('A', 10, 11)))

    def test_different_room(self):
        self.assertTrue(reserve([Booking('A', 9, 10)], Booking('B', 9, 10)))
