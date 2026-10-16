"""Group PoC regression checks; the published Graph v1 remains unchanged."""

from pathlib import Path
import unittest

from export import DesignError, parse_design, render
from group_poc import read_groups

ROOT = Path(__file__).resolve().parents[2]
DESIGN = ROOT / 'business-design/alder/README.md'
GRAPH_FIXTURE = ROOT / 'business-design/alder/graph.generated.json'


class GroupPocTests(unittest.TestCase):
    def test_group_preamble_preserves_existing_graph(self):
        raw = DESIGN.read_text(encoding='utf-8')
        groups = read_groups(raw)
        self.assertEqual(groups, [
            {'name': '業務設計', 'activities': ['業務設計']},
            {'name': '業務改善', 'activities': ['業務改善レビュー']},
            {'name': '検査項目設計', 'activities': ['検査項目の設計']},
            {'name': '実装', 'activities': ['実装']},
        ])
        ungrouped = raw[:raw.index('## Groups\n')] + raw[raw.index('\n# Scope\n', raw.index('## Groups\n')):]
        self.assertEqual(render(parse_design(raw)), render(parse_design(ungrouped)))
        self.assertEqual(render(parse_design(raw)), GRAPH_FIXTURE.read_text(encoding='utf-8'))
        self.assertEqual(read_groups(ungrouped), [])
        # Scope:false businesses and optional diagnostics remain, not forcibly assigned.
        activity_names = {n['id'] for n in parse_design(raw)['nodes'] if n['type'] == 'business'}
        assigned = {a for g in groups for a in g['activities']}
        self.assertIn('画面設計', activity_names - assigned)
        self.assertIn('同期漏れ検査', activity_names - assigned)
        self.assertNotIn('改善案の確認', activity_names)  # Still pending in separate PR #228.

    def test_group_validation_rejects_invalid_references(self):
        raw = DESIGN.read_text(encoding='utf-8')
        cases = {
            'unknown Activity': raw.replace('- Activity 実装', '- Activity 未定義の業務'),
            'Object not Activity': raw.replace('- Activity 実装', '- Activity 判断記録'),
            'duplicate Activity': raw.replace('- Activity 業務改善レビュー', '- Activity 業務設計'),
            'duplicate Group name': raw.replace('### Group 実装', '### Group 業務改善'),
            'empty Group': raw.replace('- Activity 実装', ''),
            'malformed member': raw.replace('- Activity 実装', '- 実装'),
            'malformed heading': raw.replace('### Group 実装', '### Process 実装'),
            'duplicate Groups section': raw.replace('### Group 実装', '## Groups\n\n### Group 実装'),
        }
        for name, altered in cases.items():
            with self.subTest(case=name), self.assertRaises(DesignError):
                read_groups(altered)

    def test_groups_do_not_create_entities_or_graph_relations(self):
        raw = DESIGN.read_text(encoding='utf-8')
        with_extra = raw.replace('\n# Scope\n', '\n### Group ダミー\n\n- Activity 実装\n\n# Scope\n', 1)
        with self.assertRaises(DesignError):
            read_groups(with_extra)  # An extra Group not under the Groups section is invalid as source.
        self.assertEqual(parse_design(raw)['version'], 1)
        self.assertEqual({node['type'] for node in parse_design(raw)['nodes']}, {'business', 'object'})


if __name__ == '__main__':
    unittest.main()
