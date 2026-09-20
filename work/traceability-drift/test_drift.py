"""Boundary/regression checks for the detector's failure behavior."""
from copy import deepcopy
import json
from pathlib import Path
import tempfile
import unittest
from drift import detect, items, read_metadata, validate, fingerprint, check_fingerprint

ROOT = Path(__file__).resolve().parent / 'fixture'


class DetectorTests(unittest.TestCase):
    def setUp(self):
        self.business = items(ROOT / 'business-design.md')
        self.checks = items(ROOT / 'checks.md')
        self.meta = read_metadata(ROOT / 'trace.json')
        self.ids = set(self.meta['test_checks'])

    def test_many_to_many_source_propagation(self):
        self.meta['check_sources']['CHECK-02']['BD-01'] = fingerprint(self.business['BD-01'])
        self.meta['test_checks']['shared'] = {
            check: check_fingerprint(self.checks[check])
            for check in self.meta['check_sources']}
        self.business['BD-01'] += 'Changed meaning.\n'
        result = detect(self.business, self.checks, self.meta, self.ids | {'shared'})
        self.assertEqual(set(result['stale_checks']), {'CHECK-01', 'CHECK-02'})
        self.assertEqual(set(result['stale_tests']), {
            'test_product.BookingTests.test_limit', 'test_product.BookingTests.test_cancel', 'shared'})

    def test_empty_inventory_does_not_pass(self):
        result = detect(self.business, self.checks, self.meta, set())
        self.assertEqual(set(result['stale_tests']), self.ids)

    def test_no_mutation_or_implicit_acknowledgement(self):
        before = deepcopy(self.meta)
        self.business['BD-01'] += 'Changed meaning.\n'
        first = detect(self.business, self.checks, self.meta, self.ids)
        self.assertEqual(first, detect(self.business, self.checks, self.meta, self.ids))
        self.assertEqual(self.meta, before)

    def test_source_reconfirmation_keeps_unchanged_test_current(self):
        original_tests = deepcopy(self.meta['test_checks'])
        self.business['BD-01'] = self.business['BD-01'].replace('A booking', 'A reservation')
        before = detect(self.business, self.checks, self.meta, self.ids)
        self.assertEqual(before['stale_checks'], {'CHECK-01': ['source_changed:BD-01']})
        self.assertEqual(before['stale_tests'], {
            'test_product.BookingTests.test_limit': ['upstream_stale:CHECK-01']})

        # Review found no change to the Check's meaning or text. Reconcile only
        # its source edge; no Test pin or assertion is touched.
        self.meta['check_sources']['CHECK-01']['BD-01'] = fingerprint(self.business['BD-01'])
        after = detect(self.business, self.checks, self.meta, self.ids)
        self.assertFalse(any(after.values()), after)
        self.assertEqual(self.meta['test_checks'], original_tests)

    def test_source_reconfirmation_does_not_hide_changed_check(self):
        self.business['BD-01'] = self.business['BD-01'].replace('10 participants; 11', '20 participants; 21')
        self.checks['CHECK-01'] = self.checks['CHECK-01'].replace(
            '10 participants and reject 11', '20 participants and reject 21')
        self.meta['check_sources']['CHECK-01']['BD-01'] = fingerprint(self.business['BD-01'])
        result = detect(self.business, self.checks, self.meta, self.ids)
        self.assertFalse(result['stale_checks'])
        self.assertEqual(result['stale_tests'], {
            'test_product.BookingTests.test_limit': ['check_changed:CHECK-01']})

    def test_reject_unknown_fields_including_code_mapping(self):
        self.meta['code'] = {}
        with self.assertRaises(ValueError):
            validate(self.meta)

    def test_reject_empty_relations(self):
        self.meta['check_sources']['CHECK-01'] = {}
        with self.assertRaises(ValueError):
            validate(self.meta)

    def test_reject_malformed_pin(self):
        self.meta['check_sources']['CHECK-01']['BD-01'] = 'approved'
        with self.assertRaises(ValueError):
            validate(self.meta)

    def test_duplicate_json_keys(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / 'trace.json'
            path.write_text('{"version": 1, "version": 1}')
            with self.assertRaises(ValueError):
                read_metadata(path)

    def test_invalid_sections(self):
        for text in ('# Title\n\nUntracked prose.\n## BD-01\nRule\n',
                     '# Title\n## BD-01\nRule\n## BD-01\nOther\n',
                     '# Title\n## BD-01\n\n',
                     '# Title\n## BD-01\nRule\n## Unidentified rule\nOther\n'):
            with self.subTest(text=text), tempfile.TemporaryDirectory() as tmp:
                path = Path(tmp) / 'business.md'
                path.write_text(text)
                with self.assertRaises(ValueError):
                    items(path)

    def test_relation_order_is_not_a_revision(self):
        self.meta['check_sources']['CHECK-01']['BD-02'] = fingerprint(self.business['BD-02'])
        before = detect(self.business, self.checks, self.meta, self.ids)
        self.meta['check_sources']['CHECK-01'] = dict(
            reversed(list(self.meta['check_sources']['CHECK-01'].items())))
        self.assertFalse(any(before.values()), before)
        self.assertEqual(before, detect(self.business, self.checks, self.meta, self.ids))

    def test_non_string_pin_is_invalid(self):
        self.meta['check_sources']['CHECK-01']['BD-01'] = None
        with self.assertRaises(ValueError):
            validate(self.meta)


if __name__ == '__main__':
    unittest.main()
