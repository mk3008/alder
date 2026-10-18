"""Current consultation fixture: graph handoff and preserved business boundaries."""
from pathlib import Path
import unittest
from export import parse_design, validate_graph

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'work/check-item-examples/fixtures/README.md'


class ConsultationFixtureTest(unittest.TestCase):
    def test_two_activities_connect_through_consultation_to_requester(self):
        graph = parse_design(SOURCE.read_text())
        validate_graph(graph)
        nodes = {n['id']: n for n in graph['nodes']}
        self.assertEqual(set(nodes), {'依頼者', '相談', '相談を受付する', '次の連絡方法を説明する'})
        self.assertFalse(nodes['依頼者']['scope'])
        for name in ['相談', '相談を受付する', '次の連絡方法を説明する']:
            self.assertTrue(nodes[name]['scope'])
        self.assertEqual({(e['kind'], e['from'], e['to']) for e in graph['relations']}, {
            ('input', '依頼者', '相談を受付する'),
            ('output', '相談を受付する', '相談'),
            ('input', '相談', '次の連絡方法を説明する'),
            ('output', '次の連絡方法を説明する', '依頼者'),
        })
        self.assertEqual(len(graph['relations']), 4)
        self.assertIn('その相談の依頼者', next(e['label'] for e in graph['relations']
                                            if e['kind'] == 'input' and e['to'] == '次の連絡方法を説明する'))

    def test_limits_and_undecided_outcomes_remain_explicit(self):
        source = SOURCE.read_text()
        for fact in ['同じ暦の日付', '0日以上30日以内（両端を含む）',
                     '両方の資格が成立してもよい', '利用停止中は受付条件を満たさない',
                     '条件不成立時の応答、記録の有無、再申請方法は未決',
                     '希望日の変更も未決', '固定の説明文や自動理解判定は規定しない']:
            with self.subTest(fact=fact):
                self.assertIn(fact, source)
