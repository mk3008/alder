import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

class TwoViewPurchaseRegressionTest(unittest.TestCase):
    """Bounded saved-output regression, not a general Markdown/BD validator."""

    @classmethod
    def setUpClass(cls):
        cls.before = (ROOT / 'docs/examples/purchase-check-review.ja.md').read_text()
        cls.after = (ROOT / 'work/check-two-view/candidate-update.md').read_text()

    def assert_update(self, text):
        ids = re.findall(r'^### (JA-EX-[A-Z0-9]+) —', text, re.M)
        self.assertEqual(ids, ['JA-EX-01', 'JA-EX-02', 'JA-EX-Q01',
                               'JA-EX-03', 'JA-EX-04', 'JA-EX-05'])
        for check_id in ids:
            # Preserve every primary field and supplement byte for this update.
            fragment = re.escape('<a id="' + check_id.lower() + '"></a>')
            pattern = fragment + r'.*?</details>'
            self.assertEqual(re.search(pattern, text, re.S)[0],
                             re.search(pattern, self.before, re.S)[0])
        object_view = text.split('## Object 購入申請', 1)[1]
        for check_id in ids:
            self.assertIn('(#' + check_id.lower() + ')', object_view)
        # Explicit exclusion is different from a source-undefined combination.
        rows = [line for line in object_view.splitlines()
                if line.startswith('| `')]
        self.assertEqual(len(rows), 4)
        for row, marks in zip(rows, [('○', '○', '未定義エラー'),
                                    ('未定義エラー', '未定義エラー', '○'),
                                    ('未定義エラー', '未定義エラー', '×'),
                                    ('未定義エラー',) * 3]):
            cells = row.split('|')[2:-1]
            self.assertEqual(len(cells), 3)
            for cell, mark in zip(cells, marks):
                self.assertTrue(cell.strip().startswith(mark), cell)
        self.assertIn('実行時の例外や新たな禁止を定めるものではない', object_view)
        self.assertNotIn('P118-', text)
        self.assertNotIn('確認済み', text)

    def test_saved_update_preserves_all_six_items_and_state_categories(self):
        self.assert_update(self.after)

    def test_rejects_policy_invention_duplicate_body_and_lost_evidence(self):
        for text in [self.after.replace('未定義エラー', '×', 1),
                     self.after + '\n### JA-EX-04 — コピー\n',
                     self.after.replace('人間レビュー状態：未レビュー',
                                        '人間レビュー状態：確認済み', 1),
                     self.after.replace('AI確度：高', 'AI確度：不明', 1),
                     self.after.replace('#ja-ex-q01)', '#missing)', 2),
                     self.after.replace('実行時の例外や新たな禁止を定めるものではない', '')]:
            with self.subTest(change=text[-60:]), self.assertRaises(AssertionError):
                self.assert_update(text)

    def test_all_explicit_fragment_links_resolve_once(self):
        anchors = re.findall(r'<a id="([^"]+)"></a>', self.after)
        self.assertEqual(len(anchors), len(set(anchors)))
        targets = set(anchors) | {'使い方'}
        for target in re.findall(r'\]\(#([^)]+)\)', self.after):
            self.assertIn(target, targets)
        for activity in ['activity-4']:
            section = self.after.split('<a id="' + activity + '"></a>', 1)[1]
            section = section.split('\n## ', 2)[1]
            self.assertIn('[JA-EX-04](#ja-ex-04)', section)


if __name__ == '__main__':
    unittest.main()
