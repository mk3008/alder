import copy
import json
import unittest
from pathlib import Path
from poc import parse, render, validate

HERE = Path(__file__).parent

class ExplicitStateTests(unittest.TestCase):
    def setUp(self):
        self.a = (HERE / 'candidate-a.md').read_text()
        self.data = parse(self.a)

    def test_alternative_notations_produce_same_model_and_render(self):
        b = parse((HERE / 'candidate-b.md').read_text())
        self.assertEqual(self.data, b)
        self.assertEqual(render(self.data), render(b))
        self.assertEqual(render(b), (HERE / 'generated.md').read_text())

    def test_prose_does_not_create_edges(self):
        extra = '\n購入申請は approved から 下書き に変更する。\n'
        self.assertEqual(self.data, parse(self.a + extra))

    def test_absence_is_not_a_prohibition(self):
        data = copy.deepcopy(self.data)
        data['transitions'] = []
        validate(data)
        self.assertIn('未記載の操作は未決', render(data))
        self.assertNotIn('禁止', render(data))

    def test_unknown_does_not_become_stored_state_or_self_loop(self):
        unknown = [r for r in self.data['transitions'] if r['to'] == '@unknown']
        self.assertEqual(5, len(unknown))
        self.assertNotIn('破棄', self.data['states'])
        self.assertEqual('@unknown', self.data['terminal'])
        for r in unknown:
            self.assertEqual('constraint', r['effect'])
            self.assertIn('遷移先未決', render(self.data))

    def test_no_create_differs_from_unchanged(self):
        row = next(r for r in self.data['transitions'] if r['effect'] == 'no-create')
        self.assertEqual(('@new', '@none'), (row['from'], row['to']))

    def test_explicit_unchanged_is_supported_without_inference(self):
        data = copy.deepcopy(self.data)
        row = next(r for r in data['transitions'] if r['activity'] == '購入を準備する')
        row.update(to='approved', effect='unchanged')
        validate(data)
        self.assertIn('S3 -->', render(data))
        # Synthetic grammar test only; not an adopted business declaration.
        self.assertNotEqual(data, self.data)

    def test_invalid_endpoints_ids_effects_and_fields_fail(self):
        changes = [{'to':'discarded'}, {'from':'missing'}, {'id':'T02'},
                   {'effect':'unchanged'}, {'effect':'no-create'},
                   {'to':'@unknown'}, {'path':'guessed'}, {'extra':'x'}]
        for patch in changes:
            with self.subTest(patch=patch):
                data = copy.deepcopy(self.data)
                data['transitions'][0].update(patch)
                with self.assertRaises(ValueError): validate(data)

    def test_declarations_are_required_and_not_duplicated(self):
        for text in ['approvedへ変更する', self.a + '\n```state-json\n{}\n```']:
            with self.assertRaises(ValueError): parse(text)

    def test_deterministic_and_json_roundtrip(self):
        text = '```state-json\n' + json.dumps(self.data, ensure_ascii=False) + '\n```'
        self.assertEqual(self.data, parse(text))
        self.assertEqual(render(self.data), render(parse(text)))

    def test_invalid_table_width_fails(self):
        with self.assertRaises(ValueError): parse(self.a.replace('| T01 |', '| T01 | extra |'))

if __name__ == '__main__': unittest.main()
