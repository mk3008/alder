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


    def test_diagram_keeps_conditions_items_table_and_only_source_edges(self):
        text = (ROOT / 'work/check-two-view/candidate-update-diagram.md').read_text()
        self.assert_update(text)
        diagram = re.search(r'```mermaid\n(.*?)```', text, re.S)[1]
        self.assertTrue(diagram.startswith('stateDiagram-v2\n'))
        self.assertEqual(re.findall(r'^    (.+?) --> (.+?):', diagram, re.M),
                         [('[*]', 'submitted'), ('submitted', 'approved'),
                          ('submitted', 'rejected'), ('approved', 'purchased')])
        self.assertEqual([x for x in text.splitlines() if x.startswith('|')],
                         [x for x in self.after.splitlines() if x.startswith('|')])

    def test_stateless_object_handoff_does_not_invent_a_state_machine(self):
        text = (ROOT / 'work/check-two-view/candidate-stateless.md').read_text()
        self.assertIn('## Object 結果説明・確認結果', text)
        self.assertNotIn('```mermaid', text)
        self.assertNotIn('未定義エラー', text)
        self.assertNotIn('確認済み', text)
        self.assertNotIn('現在の状態', text)
        self.assertIn('これらの Object に状態遷移は定義されていない', text)


    def test_activity_diagnostic_accepts_object_view_but_not_misspelled_activity(self):
        from tools.check_activity_names import compare
        design = (ROOT / 'business-design/purchase-request/README.md').read_text()
        self.assertEqual(compare(design, self.after)['status'], 'match')
        for heading in ['## 購入申請', '## Object 購入申請: 引継ぎ',
                        '## 購入申請 — 引継ぎ']:
            changed = re.sub(r'^## Object 購入申請.*$', heading, self.after, flags=re.M)
            self.assertEqual(compare(design, changed)['status'], 'match')
        changed = self.after.replace('## 購入申請を承認する', '## 承認')
        self.assertEqual(compare(design, changed)['status'], 'mismatch')
        changed = self.after.replace('## Object 購入申請', '## Object 未知')
        self.assertEqual(compare(design, changed)['status'], 'mismatch')
        # An actual declared Activity with a navigation-like name stays checked.
        design += '\n# Activity 使い方\n'
        self.assertEqual(compare(design, self.after)['status'], 'mismatch')


    def test_reviewed_state_and_synthetic_test_mapping_survive_heading_update(self):
        previous = (ROOT / 'work/check-two-view/synthetic-reviewed-input.md').read_text()
        updated = (ROOT / 'work/check-two-view/synthetic-reviewed-output.md').read_text()
        fields = r'^- (?:条件|期待結果|人間レビュー状態|根拠|導出分類|AI確度|関連業務|テスト証拠)：.*$'
        self.assertEqual(re.findall(fields, previous, re.M),
                         re.findall(fields, updated, re.M))
        self.assertEqual(updated.count('人間レビュー状態：確認済み'), 1)
        self.assertIn('test_request_submitted::assert_status_submitted', updated)
        self.assertIn('証拠状態：mapped、実行結果：未収集', updated)
        self.assertEqual(len(re.findall(r'^### JA-EX-', updated, re.M)), 6)


    def test_stateful_diagram_only_view_does_not_require_a_state_table(self):
        text = (ROOT / 'work/check-two-view/candidate-diagram-only.md').read_text()
        diagrammed = (ROOT / 'work/check-two-view/candidate-update-diagram.md').read_text()
        self.assertNotIn('| 購入申請の現在の状態 |', text)
        self.assertEqual(re.search(r'```mermaid\n.*?```', text, re.S)[0],
                         re.search(r'```mermaid\n.*?```', diagrammed, re.S)[0])
        for check_id in ['JA-EX-01', 'JA-EX-02', 'JA-EX-Q01',
                         'JA-EX-03', 'JA-EX-04', 'JA-EX-05']:
            pattern = re.escape('<a id="' + check_id.lower() + '"></a>') + r'.*?</details>'
            self.assertEqual(re.search(pattern, text, re.S)[0],
                             re.search(pattern, self.before, re.S)[0])


    def test_integrated_saved_outputs_preserve_meaning_and_source_navigation(self):
        initial = (ROOT / 'work/check-two-view/combined-initial-repaired.md').read_text()
        update = (ROOT / 'work/check-two-view/combined-update-repaired.md').read_text()
        fields = r'^- (?:条件|期待結果|根拠|導出分類|AI確度|関連業務|テスト証拠)：.*$'
        # New internal navigation can wrap an unchanged business label.
        visible_update = re.sub(r'\[([^]]+)\]\(#[^)]+\)', r'\1', update)
        self.assertEqual(re.findall(fields, self.before, re.M),
                         re.findall(fields, visible_update, re.M))
        self.assertEqual(len(re.findall(r'^### JA-EX-', update, re.M)), 6)
        self.assertNotIn('stack-source/business-design/', initial)
        self.assertNotIn('この説明は既存Checkの期待結果を拡張しない', update)
        for row in initial.splitlines():
            if row.startswith('| `approved`'):
                self.assertNotIn('PR-07', row)
        for text in [initial, update]:
            slugs = set()
            counts = {}
            for heading in re.findall(r'^#{1,6} (.+)$', text, re.M):
                slug = re.sub(r'[^\w -]', '', heading.lower()).replace(' ', '-')
                n = counts.get(slug, 0)
                counts[slug] = n + 1
                slugs.add(slug if n == 0 else slug + '-' + str(n))
            for fragment in re.findall(r'\]\(#([^)]+)\)', text):
                self.assertIn(fragment, slugs)


if __name__ == '__main__':
    unittest.main()
