import json
from pathlib import Path
import subprocess
import sys
import unittest
from export import DesignError, parse_design, parse_document, render

ROOT = Path(__file__).resolve().parents[2]
FIXTURE = ROOT / 'tools/fixtures/design-findings/example.md'


class FindingsTest(unittest.TestCase):
    def test_projection_and_annotations(self):
        raw = FIXTURE.read_text()
        document = parse_document(raw)
        legacy = raw.split('# Findings')[0]
        self.assertEqual(render(parse_design(raw)), render(parse_design(legacy)))
        self.assertEqual(len(document['findings']), 4)
        self.assertEqual(document['findings'][0]['targets'], ['受付情報', '依頼を受け付ける'])
        self.assertEqual(document['findings'][1]['unresolvedTargets'], ['名前が変更された項目'])
        self.assertEqual(document['findings'][2]['scope'], 'unassigned')
        self.assertEqual(document['findings'][3]['status'], 'resolved')
        self.assertEqual(parse_document(legacy)['findings'], [])

    def test_invalid_shared_cases(self):
        raw = FIXTURE.read_text()
        for case in json.loads((FIXTURE.parent / 'invalid.json').read_text()):
            with self.subTest(case=case['name']), self.assertRaises(DesignError):
                parse_document(raw.replace(case['from'], case['to'], 1))
        with self.assertRaises(DesignError):
            parse_document(raw + '\n# Findings\n' + raw.split('# Findings', 1)[1])

    def test_public_library_sample(self):
        document = parse_document((ROOT/'examples/design-findings/library-lending.md').read_text())
        self.assertEqual(len(document['graph']['nodes']), 3)
        self.assertEqual(len(document['findings']), 5)
        self.assertFalse(any(f['unresolvedTargets'] for f in document['findings']))
        self.assertEqual({f['scope'] for f in document['findings']}, {'items', 'document', 'unassigned'})
        self.assertEqual({f['status'] for f in document['findings']}, {'open', 'resolved'})

    def test_cli_warning_is_not_json(self):
        result = subprocess.run([sys.executable, str(ROOT/'tools/business_graph/export.py'), str(FIXTURE)], capture_output=True, text=True)
        self.assertEqual(result.returncode, 0)
        self.assertIn('4 findings omitted', result.stderr)
        self.assertEqual(json.loads(result.stdout), parse_design(FIXTURE.read_text()))


if __name__ == '__main__':
    unittest.main()
