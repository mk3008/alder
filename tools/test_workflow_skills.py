"""Distribution integrity and real CLI behavior; not client routing evidence."""
import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
SKILLS = ROOT / 'plugins/alder/skills'
NEW = ['alder-draft-check-items', 'alder-explore-functional-conditions',
       'alder-discover-business-questions', 'alder-follow-up-review',
       'alder-export-business-graph', 'alder-check-traceability-drift']


class WorkflowSkillsTest(unittest.TestCase):
    def test_all_new_authorities_and_scripts_match_canonical_sources(self):
        for name in NEW:
            d = SKILLS / name
            p = json.loads((d / 'references/provenance.json').read_text())
            self.assertRegex(p['alder_source_revision'], r'^[0-9a-f]{40}$')
            for group, directory in [('sources', 'references'), ('scripts', 'scripts')]:
                for source, digest in p.get(group, {}).items():
                    with self.subTest(skill=name, source=source):
                        original = (ROOT / source).read_bytes()
                        copy = (d / directory / Path(source).name).read_bytes()
                        self.assertEqual(original, copy)
                        self.assertEqual(hashlib.sha256(copy).hexdigest(), digest)

    def test_installed_exporter_matches_source_and_preserves_files_on_error(self):
        cli = SKILLS / 'alder-export-business-graph/scripts/export.py'
        design = ROOT / 'business-design/alder/README.md'
        source_cli = ROOT / 'tools/business_graph/export.py'
        packaged = subprocess.run([sys.executable, str(cli), str(design)], capture_output=True)
        source = subprocess.run([sys.executable, str(source_cli), str(design)], capture_output=True)
        self.assertEqual(packaged.returncode, 0, packaged.stderr)
        self.assertEqual(packaged.stdout, source.stdout)
        self.assertEqual(packaged.stdout, (ROOT / 'business-design/alder/graph.generated.json').read_bytes())
        with tempfile.TemporaryDirectory() as tmp:
            design = Path(tmp) / 'design.md'
            output = Path(tmp) / 'graph.json'
            design.write_text('not the supported profile\n')
            output.write_text('previous output\n')
            result = subprocess.run([sys.executable, str(cli), str(design), '-o', str(output)], capture_output=True)
            self.assertEqual(result.returncode, 2)
            self.assertEqual(output.read_text(), 'previous output\n')
            result = subprocess.run([sys.executable, str(cli), str(design), '-o', str(design)], capture_output=True)
            self.assertEqual(result.returncode, 2)
            self.assertEqual(design.read_text(), 'not the supported profile\n')

    def test_packaged_detector_is_read_only_and_requires_inventory(self):
        cli = SKILLS / 'alder-check-traceability-drift/scripts/drift.py'
        # Deliberately missing mandatory inventory, not an invented current product inventory.
        with tempfile.TemporaryDirectory() as tmp:
            paths = [Path(tmp)/n for n in ['business.md', 'checks.md', 'trace.json']]
            for p, text in zip(paths, ['# Design\n\n## BD-01\nRule.\n', '# Checks\n\n## CHECK-01\nExpectation.\n', '{}\n']):
                p.write_text(text)
            before = [p.read_bytes() for p in paths]
            result = subprocess.run([sys.executable, str(cli), *map(str,paths)], capture_output=True)
            self.assertEqual(result.returncode, 2)
            self.assertEqual([p.read_bytes() for p in paths], before)


if __name__ == '__main__':
    unittest.main()
