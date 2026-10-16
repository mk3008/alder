"""Study-output regression guard; does not evaluate generated business policy."""
import importlib.util
from pathlib import Path
import unittest
import re

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('audit_update', HERE / 'audit_update.py')
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)
ROOT = HERE.parents[1]


class PreservationTest(unittest.TestCase):
    def setUp(self):
        self.before = (ROOT / 'docs/examples/purchase-check-review.ja.md').read_text()
        self.after = (HERE / 'runs/candidate-v2-update.md').read_text()

    def test_retained_update_and_each_field_loss(self):
        self.assertEqual(audit.audit(self.before, self.after)['ids'], 6)
        for key, body in audit.items(self.before).items():
            for field in audit.FIELDS:
                # Mutate only the corresponding item, even for shared text.
                target = audit.items(self.after)[key]
                line = re.search(r'^(?:- )?' + field + r'：[^\n]+', target, re.M)[0]
                mutated = self.after.replace(target, target.replace(line, '', 1), 1)
                with self.subTest(key=key, field=field), self.assertRaises(ValueError):
                    audit.audit(self.before, mutated)

    def test_duplicate_body_and_broken_link_are_detected(self):
        for mutated in [self.after + '\n### JA-EX-04 — duplicate\n',
                        self.after + '\n[missing](#absent-target)\n']:
            with self.assertRaises(ValueError):
                audit.audit(self.before, mutated)

    def test_unnecessary_source_revision_change_is_detected(self):
        # The first actual candidate failed this requirement; retain that evidence.
        with self.assertRaisesRegex(ValueError, 'URLs/revisions'):
            audit.audit(self.before, (HERE / 'runs/candidate-update.md').read_text())
        with self.assertRaisesRegex(ValueError, 'URLs/revisions'):
            audit.audit(self.before, self.after.replace('c2852531ad62691c375e87818d8c3a49fd19803f', '0' * 40))

    def test_same_bound_target_wording_preserves_outcome_but_another_target_does_not(self):
        equivalent = self.after.replace('期待結果：対象購入申請が `approved`',
                                        '期待結果：その対象購入申請が `approved`')
        audit.audit(self.before, equivalent)
        for wrong in [equivalent.replace('その対象購入申請が `approved`', '別の対象購入申請が `approved`'),
                      equivalent.replace('その対象購入申請が `approved`', 'その対象購入申請が `rejected`')]:
            with self.assertRaisesRegex(ValueError, '期待結果'):
                audit.audit(self.before, wrong)


if __name__ == '__main__':
    unittest.main()
