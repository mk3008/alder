"""Old presentation annotations never alter Business Graph v1."""
from pathlib import Path
import unittest
from export import parse_design

class LegacyAnnotationTests(unittest.TestCase):
    def test_retired_groups_are_nonsemantic_preamble(self):
        raw = (Path(__file__).resolve().parents[2] / 'business-design/alder/README.md').read_text()
        legacy = raw.replace('\n# Scope', '\n## Groups\n\n### Group Old\n\n- Activity Missing\n\n# Scope', 1)
        self.assertEqual(parse_design(legacy), parse_design(raw))
