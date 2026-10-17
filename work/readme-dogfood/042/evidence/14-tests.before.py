"""Executable evidence for the bounded synthetic fixture, not business approval."""

from copy import deepcopy
from datetime import datetime, timedelta, timezone, tzinfo
import unittest

from tool_return import (
    LoanRecord,
    OutsideExampleScope,
    ReceptionStatus,
    receive_return,
)


class ReturnFixture:
    def setUp(self):
        self.records = {
            "loan-A": LoanRecord("tool-A", ("case-A", "charger-A")),
            "loan-B": LoanRecord("tool-B", ("case-B", "battery-B")),
        }
        self.when = datetime(2026, 10, 5, 10, 30, tzinfo=timezone(timedelta(hours=9)))

    def process(self, **changes):
        arguments = {
            "tool_number": "tool-A",
            "accessories": ("case-A", "charger-A"),
            "received_at": self.when,
        }
        arguments.update(changes)
        return receive_return(self.records, "loan-A", **arguments)

    def failure_inputs(self):
        return (
            ("number mismatch", {"tool_number": "tool-B"}),
            ("accessory shortage", {"accessories": ("case-A",)}),
            ("both", {"tool_number": "tool-B", "accessories": ("case-A",)}),
            ("all accessories missing", {"accessories": ()}),
        )


class ReturnReceptionTests(ReturnFixture, unittest.TestCase):
    def test_matching_return_is_confirmed(self):
        result = self.process()
        self.assertEqual(result.status, ReceptionStatus.CONFIRMED)
        self.assertTrue(self.records["loan-A"].receipt_confirmed)

    def test_first_receipt_records_time_on_selected_loan(self):
        other_before = deepcopy(self.records["loan-B"])
        self.process()
        self.assertEqual(
            self.records["loan-A"].returned_at,
            datetime(2026, 10, 5, 1, 30, tzinfo=timezone.utc),
        )
        self.assertEqual(self.records["loan-B"], other_before)

    def test_received_group_waits_for_inspection(self):
        self.process()
        self.assertTrue(self.records["loan-A"].inspection_pending)

    def test_received_group_is_not_available_for_loan(self):
        self.process()
        self.assertFalse(self.records["loan-A"].available_for_loan)

    def test_failed_reception_does_not_confirm_receipt(self):
        for name, arguments in self.failure_inputs():
            with self.subTest(case=name):
                result = self.process(**arguments)
                self.assertNotEqual(result.status, ReceptionStatus.CONFIRMED)
                self.assertFalse(self.records["loan-A"].receipt_confirmed)

    def test_failed_reception_does_not_record_return_time(self):
        for name, arguments in self.failure_inputs():
            with self.subTest(case=name):
                self.process(**arguments)
                self.assertIsNone(self.records["loan-A"].returned_at)

    def test_failed_reception_does_not_set_inspection_pending(self):
        for name, arguments in self.failure_inputs():
            with self.subTest(case=name):
                self.process(**arguments)
                self.assertFalse(self.records["loan-A"].inspection_pending)

    def test_failed_reception_returns_needs_review_to_counter(self):
        for name, arguments in self.failure_inputs():
            with self.subTest(case=name):
                result = self.process(**arguments)
                self.assertEqual(result.status, ReceptionStatus.NEEDS_REVIEW)
                self.assertEqual(result.recipient, "窓口")

    def test_matching_reprocessing_preserves_first_return_time(self):
        self.process()
        first_time = self.records["loan-A"].returned_at
        for later_time in (self.when + timedelta(days=1), self.when - timedelta(days=1)):
            with self.subTest(received_at=later_time):
                self.process(received_at=later_time)
                self.assertIs(self.records["loan-A"].returned_at, first_time)

    def test_mismatching_reprocessing_keeps_existing_time_and_state(self):
        self.process()
        first_time = self.records["loan-A"].returned_at
        for name, arguments in self.failure_inputs():
            with self.subTest(case=name):
                result = self.process(received_at=self.when + timedelta(days=1), **arguments)
                self.assertEqual(result.status, ReceptionStatus.NEEDS_REVIEW)
                self.assertIs(self.records["loan-A"].returned_at, first_time)
                self.assertTrue(self.records["loan-A"].inspection_pending)
                self.assertTrue(self.records["loan-A"].receipt_confirmed)

    def test_time_is_normalized_to_utc(self):
        for hours in (-5, 0, 9):
            with self.subTest(utc_offset=hours):
                self.setUp()
                supplied = datetime(2026, 10, 5, 12, 15, 0, 42,
                                    tzinfo=timezone(timedelta(hours=hours)))
                self.process(received_at=supplied)
                recorded = self.records["loan-A"].returned_at
                self.assertEqual(recorded, supplied)
                self.assertIs(recorded.tzinfo, timezone.utc)
                self.assertEqual(recorded.microsecond, 42)

    def test_naive_time_is_rejected_before_mutation(self):
        before = deepcopy(self.records)
        with self.assertRaisesRegex(ValueError, "timezone"):
            self.process(received_at=datetime(2026, 10, 5, 12, 15))
        self.assertEqual(self.records, before)

    def test_timezone_without_offset_is_rejected_before_mutation(self):
        class NoOffset(tzinfo):
            def utcoffset(self, dt):
                return None

        before = deepcopy(self.records)
        with self.assertRaisesRegex(ValueError, "timezone"):
            self.process(received_at=datetime(2026, 10, 5, tzinfo=NoOffset()))
        self.assertEqual(self.records, before)

    def test_non_datetime_is_rejected_before_mutation(self):
        before = deepcopy(self.records)
        with self.assertRaises(TypeError):
            self.process(received_at="2026-10-05T00:00:00Z")
        self.assertEqual(self.records, before)

    def test_selected_loan_is_the_comparison_source(self):
        other_before = deepcopy(self.records["loan-A"])
        result = receive_return(
            self.records, "loan-B", tool_number="tool-B",
            accessories=("case-B", "battery-B"), received_at=self.when,
        )
        self.assertEqual(result.status, ReceptionStatus.CONFIRMED)
        self.assertTrue(self.records["loan-B"].receipt_confirmed)
        self.assertEqual(self.records["loan-A"], other_before)


class ExampleBoundaryTests(ReturnFixture, unittest.TestCase):
    """Boundary checks ensure excluded topics never become reception outcomes."""

    def test_extras_and_substitutions_have_no_business_outcome(self):
        for items in (
            ("case-A", "charger-A", "extra-item"),
            ("case-A", "replacement-charger"),
            ("replacement-case", "replacement-charger"),
        ):
            for number in ("tool-A", "tool-B"):
                with self.subTest(accessories=items, tool_number=number):
                    before = deepcopy(self.records)
                    with self.assertRaises(OutsideExampleScope):
                        self.process(tool_number=number, accessories=items)
                    self.assertEqual(self.records, before)

    def test_repeated_accessory_labels_do_not_define_quantity_policy(self):
        before = deepcopy(self.records)
        with self.assertRaises(OutsideExampleScope):
            self.process(accessories=("case-A", "case-A", "charger-A"))
        self.assertEqual(self.records, before)

    def test_unknown_loan_is_outside_the_fixture(self):
        before = deepcopy(self.records)
        with self.assertRaises(OutsideExampleScope):
            receive_return(self.records, "unknown", tool_number="tool-A",
                           accessories=("case-A", "charger-A"), received_at=self.when)
        self.assertEqual(self.records, before)

    def test_other_loan_accessories_are_not_used_as_fallback(self):
        before = deepcopy(self.records)
        with self.assertRaises(OutsideExampleScope):
            self.process(accessories=("case-B", "battery-B"))
        self.assertEqual(self.records, before)

    def test_empty_issued_list_is_not_given_new_business_meaning(self):
        self.records["loan-A"].issued_accessories = ()
        before = deepcopy(self.records)
        with self.assertRaises(OutsideExampleScope):
            self.process(accessories=())
        self.assertEqual(self.records, before)


if __name__ == "__main__":
    unittest.main()
