"""Distribution, CLI behavior and static display contracts; not agent/client evidence."""
import hashlib
import importlib.util
import json
from pathlib import Path
import re
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
SKILLS = ROOT / 'plugins/alder/skills'
NEW = ['alder-draft-check-items', 'alder-explore-functional-conditions',
       'alder-discover-business-questions', 'alder-follow-up-review',
       'alder-export-business-graph', 'alder-check-traceability-drift']
CHECK_FIXTURES = ROOT / 'tools/fixtures/check-presentation'


class WorkflowSkillsTest(unittest.TestCase):
    def test_current_check_presentation_guidance_is_reachable(self):
        guide = (ROOT / 'docs/check-item-traceability.md').read_text()
        section = guide[guide.index('## 3. Human-facing view'):guide.index('## 5. Evidence and mapping states')]
        for term in ["Show each Check's condition, expected result and human review state **once**",
                     'same Check ID and item', 'A reference count is not a Check count',
                     'Moving to another Activity', 'is not approval',
                     '### Write conditions without changing their logic',
                     'All of the following', 'Any of the following', 'Mixed conditions',
                     'negation, exceptions, exclusivity and priority',
                     'retain the original condition text',
                     'Presentation uncertainty does not silently overwrite a previously human-confirmed Check state',
                     'Test evidence/gaps stay reachable under the same ID',
                     'not a required document schema', 'require separate observation']:
            self.assertIn(term, section)
        skill = (SKILLS / 'alder-draft-check-items/SKILL.md').read_text()
        for term in ['references/check-item-traceability.md',
                     "rather than copying historical c3's table/detail layout",
                     'current Activity', 'Shared Checks keep one ID, item and review state',
                     'nested groups for mixed conditions', 'retain the original wording',
                     'resuming are not approval', 'no mandatory schema, viewer or ledger']:
            self.assertIn(term, skill)

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


class CheckPresentationContractTest(unittest.TestCase):
    """Fixed Markdown examples, not a renderer, product schema or agent evaluation."""

    # Explicit source-to-display examples are deliberately local to this test.
    # Their indentation is part of the fixture contract, not an Alder file format.
    CONDITIONS = {
        'CHECK-001': ('Request supplied AND required fields complete',
                      '- Condition: all of (AND)\n'
                      '  - Request supplied\n  - Required fields complete'),
        'CHECK-002': ('Registered address available OR delegated inbox available',
                      '- Condition: any of (OR; one or more)\n'
                      '  - Registered address available\n  - Delegated inbox available'),
        'CHECK-003': ('Request active AND (recipient available OR queue monitored)',
                      '- Condition: all of (AND)\n  - Request active\n'
                      '  - Any of (OR; one or more)\n'
                      '    - Recipient available\n    - Queue monitored'),
        'CHECK-004': ('Review complete; owner assigned', None),
        'CHECK-005': ('Reviewer or delegate exclusively accepts; urgent requests first; '
                      'blocked requests cannot proceed except with emergency approval', None),
        'CHECK-006': ('Receipt stored', '- Condition: Receipt stored'),
    }

    @classmethod
    def setUpClass(cls):
        rows = [line.strip('|').split('|') for line in
                (CHECK_FIXTURES / 'source.md').read_text().splitlines()
                if line.startswith('|')]
        fields = [cell.strip() for cell in rows[0]]
        cls.source = {row[0].strip(): dict(zip(fields, map(str.strip, row)))
                      for row in rows[2:]}
        cls.presentation = (CHECK_FIXTURES / 'checks.md').read_text()
        cls.resume = (CHECK_FIXTURES / 'resume.md').read_text()

    def section(self, text, heading):
        match = re.search(r'^#{2,3} ' + re.escape(heading) +
                          r'\n(.*?)(?=^#{1,3} |\Z)', text, re.M | re.S)
        self.assertIsNotNone(match, heading)
        return match[1].strip()

    def check_links(self, section, prefix=''):
        links = re.findall(r'\[(CHECK-\d+)\]\(([^)]+)\)', section)
        for check_id, target in links:
            self.assertIn(check_id, self.source)
            self.assertEqual(target, prefix + '#' + check_id.lower())
        return [check_id for check_id, _ in links]

    def activity_ids(self, activity):
        return [check_id for check_id, row in self.source.items()
                if activity in row['Activities'].split('; ')]

    def assert_presentation_contract(self, text):
        self.assertEqual(set(self.source), set(self.CONDITIONS))
        self.assertEqual(re.findall(r'^### (CHECK-\d+)$', text, re.M),
                         list(self.source))
        self.assertEqual(re.findall(r'^### Detail (CHECK-\d+)$', text, re.M),
                         list(self.source))
        self.assertEqual(text.count('- Human review state:'), len(self.source))
        self.assertEqual(text.count('- Expected result:'), len(self.source))
        self.assertEqual(text.count('- Condition'), len(self.source))
        for check_id, row in self.source.items():
            item = self.section(text, check_id)
            detail = self.section(text, 'Detail ' + check_id)
            source_condition, display_condition = self.CONDITIONS[check_id]
            self.assertEqual(row['Condition'], source_condition)
            if display_condition is None:
                display_condition = '- Condition (relationship unresolved): ' + source_condition
            actual_condition = re.search(r'^- Condition.*?(?=\n- Expected result:)',
                                         item, re.M | re.S)
            self.assertIsNotNone(actual_condition)
            self.assertEqual(actual_condition[0], display_condition, check_id)
            condition_lines = display_condition.splitlines()
            atoms = ([line.strip()[2:] for line in condition_lines[1:]
                      if 'Any of (OR;' not in line] if len(condition_lines) > 1
                     else [source_condition])
            for atom in atoms:
                self.assertEqual(text.count(atom), 1, (check_id, atom))
            for field in ['Title', 'Expected result', 'Human review state']:
                line = '- ' + field + ': ' + row[field]
                self.assertEqual(item.count(line), 1)
                self.assertNotIn(line, detail)
            self.assertEqual(text.count(row['Expected result']), 1)
            self.assertIn(f'[Supporting detail for {check_id}](#detail-{check_id.lower()})', item)
            for field in ['Business Design', 'Derivation', 'AI confidence',
                          'Test/assertion', 'Evidence gap']:
                self.assertIn('- ' + field + ': ' + row[field], detail.splitlines())
        for activity in ['ACT-RECEIVE', 'ACT-ROUTE', 'unassigned']:
            heading = 'Unassigned' if activity == 'unassigned' else activity
            self.assertEqual(self.check_links(self.section(text, heading)),
                             self.activity_ids(activity))
        current = re.findall(r'^Current Activity: (.+)$', text, re.M)
        self.assertEqual(len(current), 1)
        self.assertIn(current[0], ['ACT-RECEIVE', 'ACT-ROUTE'])
        self.assertEqual(self.check_links(self.section(text, 'Current review')),
                         self.activity_ids(current[0]))

    def test_fixture_preserves_single_items_logic_states_and_supporting_detail(self):
        self.assert_presentation_contract(self.presentation)
        # Two Activity groups each reference both shared Checks (N:M), while
        # assert_presentation_contract requires only one item/state per Check.
        self.assertEqual(set(self.activity_ids('ACT-RECEIVE')) &
                         set(self.activity_ids('ACT-ROUTE')), {'CHECK-002', 'CHECK-003'})

    def test_activity_selection_and_resume_are_navigation_not_confirmation(self):
        for text, activity, prefix in [(self.presentation, 'ACT-RECEIVE', ''),
                                       (self.resume, 'ACT-ROUTE', 'checks.md')]:
            with self.subTest(activity=activity):
                self.assertEqual(re.findall(r'^Current Activity: (.+)$', text, re.M), [activity])
                index = self.section(text, 'Business index')
                for anchor in ['act-receive', 'act-route', 'unassigned']:
                    self.assertIn(f']({prefix}#{anchor})', index)
                self.assertEqual(self.check_links(self.section(text, 'Current review'), prefix),
                                 self.activity_ids(activity))
                next_line, = re.findall(r'^Next Check: (.+)$', text, re.M)
                next_id, = self.check_links(next_line, prefix)
                self.assertIn(next_id, self.activity_ids(activity))
        self.assertNotIn('Human review state:', self.resume)
        self.assertNotIn('Expected result:', self.resume)
        self.assertNotIn('Condition:', self.resume)
        self.assertIn('Moving or resuming does not record human confirmation.', self.resume)
        self.assert_presentation_contract(self.presentation)

    def test_unassigned_business_uncertainty_and_presentation_questions_stay_distinct(self):
        self.assertEqual(self.source['CHECK-006']['Activities'], 'unassigned')
        self.assertEqual(self.source['CHECK-006']['Human review state'], '未レビュー')
        self.assertIn('Mapping question (要確認):',
                      self.section(self.presentation, 'Detail CHECK-006'))
        self.assertEqual(self.source['CHECK-004']['Activities'], 'ACT-ROUTE')
        self.assertEqual(self.source['CHECK-004']['Human review state'], '要確認')
        self.assertIn('Open question:', self.section(self.presentation, 'Detail CHECK-004'))
        self.assertEqual(self.source['CHECK-005']['Human review state'], '確認済み')
        self.assertIn('Presentation question (要確認):',
                      self.section(self.presentation, 'Detail CHECK-005'))
        self.assertEqual(self.source['CHECK-002']['Human review state'], '確認済み')
        self.assertTrue(self.source['CHECK-002']['Evidence gap'].startswith('partial:'))

    def test_static_contract_rejects_loss_duplication_and_logic_changes(self):
        mutations = {
            'duplicate overview': self.presentation + '\n| The request is accepted. | 未レビュー |\n',
            'missing condition': self.presentation.replace('  - Required fields complete\n', ''),
            'flattened mixed OR': self.presentation.replace('    - Recipient available',
                                                           '  - Recipient available'),
            'inclusive changed to exclusive': self.presentation.replace('OR; one or more', 'OR; exactly one'),
            'guessed relationship': self.presentation.replace(
                'Condition (relationship unresolved): Review complete; owner assigned',
                'Condition: all of (AND)\n  - Review complete\n  - Owner assigned'),
            'new ID': self.presentation.replace('### CHECK-001\n', '### CHECK-101\n'),
            'state promoted': self.presentation.replace('Human review state: 未レビュー',
                                                        'Human review state: 確認済み', 1),
            'mapping changed': self.presentation.replace('Business Design: BD-03', 'Business Design: BD-02'),
            'support removed': self.presentation.replace('AI confidence: 要精査', 'AI confidence: 高', 1),
            'detail mislinked': self.presentation.replace('](#detail-check-001)', '](#detail-check-002)'),
            'shared item omitted': self.presentation.replace('- [CHECK-002](#check-002)\n', '', 1),
        }
        for name, mutated in mutations.items():
            with self.subTest(mutation=name), self.assertRaises(AssertionError):
                self.assert_presentation_contract(mutated)


if __name__ == '__main__':
    unittest.main()
