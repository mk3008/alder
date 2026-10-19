"""Object media metadata and Graph-only compatibility."""
from pathlib import Path
import json
import re
import subprocess
import sys
import unittest
from export import DesignError, parse_document, parse_design, validate_graph
ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'tools/fixtures/object-medium/example.md'
class MediumTests(unittest.TestCase):
    def test_projection_and_cli(self):
        raw = SOURCE.read_text()
        doc = parse_document(raw)
        self.assertEqual(doc['objectMedia']['受付情報'], 'PDF')
        self.assertIn('shared.employee_roles', doc['objectMedia']['外部台帳'])
        old = re.sub(r'## Medium\n\n[^\n]+\n', '', raw)
        self.assertEqual(doc['graph'], parse_design(old))
        self.assertNotIn('objectMedia', parse_document(old))
        result = subprocess.run([sys.executable, str(ROOT/'tools/business_graph/export.py'), str(SOURCE)], capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('Medium omitted', result.stderr)
        self.assertEqual(json.loads(result.stdout), doc['graph'])
        doc['graph']['nodes'][0]['medium'] = 'PDF'
        with self.assertRaises(DesignError): validate_graph(doc['graph'])
    def test_invalid(self):
        raw = SOURCE.read_text()
        for value in ['', 'PDF\nCSV', 'PDF\n\n## Medium\n\nCSV']:
            with self.subTest(value=value), self.assertRaises(DesignError):
                parse_document(raw.replace('## Medium\n\nPDF', '## Medium\n\n'+value))
        with self.assertRaises(DesignError):
            parse_document(raw.replace('## Who\n', '## Medium\n\nCSV\n\n## Who\n'))
