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
    def test_draft_review_loop_routes_to_actual_read_only_reviewer(self):
        # Distribution/instruction contract only: this does not run an agent.
        draft = (SKILLS / 'alder-draft-business-design/SKILL.md').read_text()
        review = (SKILLS / 'alder-review-business-design/SKILL.md').read_text()
        link = '../alder-review-business-design/SKILL.md'
        self.assertIn(link, draft)
        self.assertTrue((SKILLS / 'alder-draft-business-design' / link).resolve().is_file())
        for phrase in ['separate reviewer agent or fresh context',
                       'perform the review and return findings',
                       'distinct read-only review phase in the same agent',
                       'report that it was not independent',
                       'merely requesting a review is not completion',
                       "step 4's authoring self-check", 'review pending',
                       'After correction, run the read-only review again',
                       'whole requested boundary', 'business agreement with people',
                       'wording/structure defects grounded in the applicable guidance']:
            self.assertIn(phrase, draft)
        self.assertIn('Keep the review read-only', review)
        self.assertIn('Do not edit the Business Design', review)

    def test_draft_review_loop_scenario_contracts_are_distributed(self):
        # Synthetic review records + expected actions are static examples, not
        # observations of an agent choosing or executing those actions.
        fixtures = ROOT / 'tools/fixtures/plugin-draft-review-loop'
        cases = {c['scenario']: c for c in json.loads((fixtures / 'scenarios.json').read_text())}
        phrases = {
            'normal': ['no source-supported correction', 'Human agreement remains necessary'],
            'repairable_omission': ['Supported source fact omitted or distorted',
                                    'repair the draft from that evidence', 'actual read-only review'],
            'missing_fact': ['Information absent from the source', 'Do not turn absence into',
                             'specific missing fact or question'],
            'ambiguity': ['Source meaning ambiguous or contradictory',
                          'possible interpretations as candidates', 'Do not silently choose one'],
            'no_progress': ['substantially the same finding', 'without new evidence or improvement',
                            'rather than repeating or merely rewording'],
            'rereview_failure': ['review fails, is unavailable', 'runtime/context limit',
                                 'last version actually reviewed', 'unreviewed changes',
                                 'Never turn a failed or unperformed re-review'],
        }
        self.assertEqual(set(cases), set(phrases))
        guides = [ROOT / 'docs/adoption.md', *[
            SKILLS / name / 'references/adoption.md' for name in
            ['alder-draft-business-design', 'alder-draft-check-items', 'alder-follow-up-review']]]
        for guide in guides:
            section = guide.read_text().split('### Review and revise a draft before returning it', 1)[1]
            section = section.split('### Record operational Problems', 1)[0]
            for name, required in phrases.items():
                with self.subTest(guide=guide, scenario=name):
                    for phrase in required:
                        self.assertIn(phrase, section)
                    case = cases[name]
                    self.assertTrue(case['source'] and case['draft'])
                    self.assertFalse(case['expected']['human_agreed'])
        normal = cases['normal']
        self.assertEqual(normal['source'], normal['draft'])
        self.assertTrue(normal['review']['completed'])
        self.assertEqual(normal['review']['findings'], [])
        repair = cases['repairable_omission']
        evidence = repair['review']['findings'][0]['evidence']
        self.assertIn(evidence, repair['source'])
        self.assertNotIn(evidence, repair['draft'])
        self.assertIn(evidence, repair['expected']['revision'])
        self.assertEqual(repair['expected']['review_status'], 'pending_until_actual_rereview')
        self.assertFalse(cases['missing_fact']['expected']['new_transfer'])
        self.assertIsNone(cases['ambiguity']['expected']['selected_interpretation'])
        stalled = cases['no_progress']
        self.assertNotEqual(stalled['previous_finding'], stalled['current_finding'])
        self.assertFalse(stalled['new_evidence'] or stalled['improved'])
        self.assertEqual(stalled['expected']['action'], 'stop_report_unresolved')
        failed = cases['rereview_failure']
        self.assertFalse(failed['review']['completed'])
        self.assertIsNone(failed['review']['findings'])
        self.assertNotEqual(failed['last_reviewed_version'], failed['latest_version'])
        self.assertEqual(failed['expected']['review_status'], 'incomplete')
        self.assertTrue(failed['expected']['unreviewed_changes'])

    def test_security_intake_is_reachable_and_preserves_product_authority(self):
        guide = (ROOT / 'docs/adoption.md').read_text()
        start = guide.index('### Carry security requirements into implementation')
        end = guide.index('### Optional: explore undocumented functional conditions', start)
        section = guide[start:end]
        for term in ['**Provided:**', '**Not applicable:**', '**Unresolved:**',
                     'not provided, unreadable', 'I do not know',
                     'product remains responsible for SR creation, validity and completeness',
                     'Continue independent work', 'optional SR-authoring support',
                     'not a new required artifact', 'ordinary reversible']:
            self.assertIn(term.lower(), section.lower())
        skill = (SKILLS / 'alder-draft-check-items/SKILL.md').read_text()
        self.assertIn('references/adoption.md#carry-security-requirements-into-implementation', skill)
        self.assertIn('Check-only draft can continue without a complete SR', skill)
        for readme in ['README.md', 'README.ja.md']:
            self.assertIn('docs/adoption.md#carry-security-requirements-into-implementation',
                          (ROOT / readme).read_text())

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
