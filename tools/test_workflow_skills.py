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
    def test_requester_language_reaches_canonical_guidance_and_check_skill(self):
        # These are authored guidance checks, not a language detector or proof
        # that an agent follows the guidance or a person comprehends its output.
        expected = {
            'docs/adoption.md': [
                '### Language for agreement', 'human-facing **Check Items**',
                'Activity names, Check titles, conditions, expected results, review questions and supporting explanations',
                'original saved artifact and the conversational review',
                "requester's working language", 'Headings alone being Japanese is insufficient',
                'Preserve stable IDs, technical identifiers and literal values',
                'review language is genuinely unclear', 'internal English test fixture may remain English',
                'later chat translation does not establish'],
            'docs/check-item-traceability.md': [
                '[language for agreement](adoption.md#language-for-agreement)',
                "requester's working language for the original Check artifact and review response",
                'Activity names, Check titles, conditions, expected results, questions and supporting explanations',
                'not just headings', "Business Design's business terms",
                'Preserve IDs, technical identifiers and literal values',
                'Ask if the language is genuinely unclear', 'Verify the saved artifact itself',
                'later chat translation or an internal English fixture is not evidence'],
            'plugins/alder/skills/alder-draft-check-items/SKILL.md': [
                '[language for agreement](references/adoption.md#language-for-agreement)',
                "requester's working language", 'original saved artifact and review response',
                'Activity names, Check titles, conditions, expected results, questions and supporting explanations in Japanese',
                'not just headings', 'Preserve stable IDs, technical identifiers and literal values',
                'do not change meaning or human review states when adjusting language',
                'review language is genuinely unclear', 'inspect the saved artifact itself',
                'internal English fixture may remain English',
                'later chat translation is not evidence'],
        }
        for path, terms in expected.items():
            text = (ROOT / path).read_text(encoding='utf-8')
            for term in terms:
                with self.subTest(path=path, term=term):
                    self.assertIn(term, text)

    def test_current_check_presentation_guidance_is_reachable(self):
        guide = (ROOT / 'docs/check-item-traceability.md').read_text()
        section = guide[guide.index('## 3. Human-facing view'):guide.index('## 5. Evidence and mapping states')]
        for term in ["Show each Check's condition, expected result and human review state **once**",
                     'source-established full Activity names in visible references',
                     'do not invent aliases by shortening numbered headings',
                     'quote its full heading rather than guessing an abbreviation',
                     'Preserve the source and existing link targets',
                     'state its kind on the item itself and keep it visible', '種別：未決事項（候補）',
                     'Keep kind separate from derivation class, AI confidence and human review state',
                     'do not relabel one as the other without evidence',
                     'Retain unapproved wording in the expected result',
                     'not a new required schema or parser',
                     'same-level Activity headings in the same order',
                     'H2 Activity and H3 Check',
                     'Do not split the document into a special current Activity and other Activities',
                     'same Check ID and item', 'A reference count is not a Check count',
                     'Moving to another Activity', 'is not approval',
                     '### Write conditions without changing their logic',
                     'All of the following', 'Any of the following', 'Mixed conditions',
                     'negation, exceptions, exclusivity and priority',
                     'retain the original condition text',
                     'Presentation uncertainty does not silently overwrite a previously human-confirmed Check state',
                     'Test evidence/gaps stay reachable under the same ID',
                     'default-closed `<details><summary>` blocks under the same ID',
                     'outside the block and always visible', 'omit the `open` attribute',
                     'blank lines around the Markdown body',
                     'Activity/Check anchors and shared references outside the block',
                     'For unresolved items, keep questions, alternatives and effects visible with the primary fields',
                     'collapse only supplemental source evidence, derivation class, AI confidence, related Activities and Test evidence',
                     'Never put a pending decision inside a collapsed block',
                     'Other Markdown viewers may show the content without folding',
                     'not a required document schema', 'require separate observation']:
            self.assertIn(term, section)
        skill = (SKILLS / 'alder-draft-check-items/SKILL.md').read_text()
        for term in ['references/check-item-traceability.md',
                     'Use source-established full Activity names in visible references',
                     'do not invent shortened aliases or position-based names',
                     'quote its full heading while retaining the existing source and link targets',
                     'Give each unresolved item its own visible kind', '種別：未決事項（候補）',
                     'Keep kind distinct from derivation class, AI confidence and human review state',
                     'Preserve source-undecided versus AI-proposed origin and the unapproved expected result',
                     'no required schema or parser',
                     "rather than copying historical c3's table/detail layout",
                     'Activity index and Activity sections in the same order',
                     'H2 Activity and H3 Check',
                     'Do not split the document into current versus other Activities',
                     'current Activity', 'Shared Checks keep one ID, item and review state',
                     'nested groups for mixed conditions', 'retain the original wording',
                     'resuming are not approval', 'no mandatory schema, viewer or ledger',
                     'default-closed `<details><summary>` blocks without an `open` attribute',
                     'human review state, anchors and shared references outside',
                     'For unresolved items, keep questions, alternatives and effects visible with the primary fields',
                     'collapse only supplemental source evidence, derivation class, AI confidence, related Activities and Test evidence',
                     'Never put a pending decision inside a collapsed block',
                     'Other Markdown viewers may not fold the content']:
            self.assertIn(term, skill)
        adoption = (ROOT / 'docs/adoption.md').read_text()
        for term in ['Check supplements in default-closed `<details><summary>` blocks',
                     'condition, expected result and human review state remain visible',
                     'For unresolved items, keep questions, alternatives and effects visible with the primary fields',
                     'collapse only supplemental source evidence, derivation class, AI confidence, related Activities and Test evidence',
                     'Never put a pending decision inside a collapsed block',
                     'Preserve every field and navigation link',
                     'other Markdown viewers may display the content without folding']:
            self.assertIn(term, adoption)

    def test_default_check_return_gate_reaches_bundled_canonical_guidance(self):
        # Static routing/packaging contract, not evidence that an agent runs
        # the gate or correctly judges a product's business meaning.
        skill_path = SKILLS / 'alder-draft-check-items/SKILL.md'
        skill = skill_path.read_text(encoding='utf-8')
        heading = '## Before returning Check Items'
        self.assertEqual(skill.count(heading), 1)
        start = skill.index(heading)
        end = skill.index('## Optional Functional Interface index')
        self.assertLess(skill.index('- Initial draft:'), start)
        self.assertLess(skill.index('- Update:'), start)
        self.assertLess(skill.index('- Consistency review only:'), start)
        self.assertLess(start, end)
        gate = skill[start:end]
        for term in ['For every initial draft and update',
                     'as part of the ordinary request',
                     'without asking the requester to invoke another review Skill',
                     'Check applicable description-rule conformance first',
                     'report evidenced NG findings separately from undecided business meaning and optional wording suggestions',
                     'without making NG a human review state',
                     'For consistency-review-only requests, use the same gate without edits',
                     'An Interface-only request still does not authorize generating or changing Checks']:
            self.assertIn(term, gate)
        link = re.search(r'\[return-time quality check\]\(([^)#]+)#([^)]+)\)', gate)
        self.assertIsNotNone(link)
        target, anchor = link.groups()
        self.assertEqual(target, 'references/check-item-traceability.md')
        bundled = (skill_path.parent / target).read_text(encoding='utf-8')
        canonical = (ROOT / 'docs/check-item-traceability.md').read_text(encoding='utf-8')
        self.assertEqual(bundled, canonical)
        # This fixed ASCII heading uses the normal GitHub Markdown anchor.
        title = 'Before returning a draft or update'
        self.assertEqual(anchor, title.lower().replace(' ', '-'))
        self.assertIn('### ' + title + '\n', bundled)

    def test_default_check_return_gate_documents_safeguards_and_limits(self):
        # Pin the authored obligations only; phrase presence cannot establish
        # their execution, semantic correctness or nonmutation by an agent.
        guide = (ROOT / 'docs/check-item-traceability.md').read_text(encoding='utf-8')
        start = guide.index('### Before returning a draft or update')
        gate = guide[start:guide.index('## 8. Maintenance and stopping', start)]
        for term in ['Every Check creation or update includes a quality check before return',
                     'whole applicable Business Design and the current guidance',
                     'Start with conformance to the existing description rules that apply to this artifact',
                     "do not create a rule or impose one format's syntax on every output",
                     'For each clear nonconformance (NG), identify the affected location, cite the applicable rule and source evidence, and explain the violation',
                     'An undeclared Activity abbreviation is NG even when its meaning is understandable',
                     'structure, heading relationships, visible ID and primary fields, unresolved-item kind and shared-item identity',
                     'Apply heading or folding conventions only where the target format calls for them',
                     'source names and references against the source itself',
                     'Check every occurrence, including folded supplements and link labels',
                     'compare it directly with that heading rather than reconstructing a variant from its parts',
                     'independently reviewable condition/result pairs',
                     'not every AND/OR bullet or Test assertion',
                     "Respect an explicitly limited example's scope",
                     'visible item kind, derivation, human review state, language and unresolved questions',
                     'Missing Test evidence is a separate gap',
                     'IDs, guarantees, conditions, review states, source links, shared items and existing Test mappings',
                     'not an authority for business meaning',
                     'Preserve established source revisions and URLs when the input is only a local or temporary copy',
                     'An unvisited or unavailable URL is not evidence of a wrong mapping',
                     'Retarget only for an evidenced source change or mapping defect',
                     'Keep rule nonconformance (NG), undecided business meaning (要確認 / Business Designへ戻す事項), and optional wording suggestions distinct',
                     'NG is a diagnostic finding, not a new human review state; never write it into that field',
                     'A style preference or an unspecified requirement is not an NG',
                     'If rule applicability or evidence cannot be established, report that verification limit instead of asserting a violation or a pass',
                     'do not treat description conformance as a score for business policy, complete coverage, or human approval',
                     'repair is unambiguous from the source and stays within the requested scope',
                     'Preserve human review states for display-only changes',
                     'If business meaning is undecided or needs to change, retain that uncertainty',
                     '要確認 / Business Designへ戻す事項', 'continue independent items',
                     'Keep an outstanding human-requested correction as 要修正 until it is made',
                     'correcting it does not assert renewed confirmation',
                     'A correction already determined by confirmed Business Design is not itself a new business decision',
                     'Do not invent missing rules, promote a candidate to confirmed, or silently delete an unsupported expectation',
                     're-read the final saved artifact and affected references, and repeat the relevant checks',
                     'scope actually checked, material corrections and retained guarantees, unresolved decisions and verification limits',
                     'If a check could not be performed, say so; do not claim that the gate passed',
                     'No separate report, parser or mandatory data format is required',
                     'In consistency-review-only mode, perform the same checks and report findings without editing files or review states',
                     'AI quality checking never substitutes for human confirmation']:
            with self.subTest(term=term):
                self.assertIn(term, gate)

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
        cls.source_text = (CHECK_FIXTURES / 'source.md').read_text()
        rows = [line.strip('|').split('|') for line in
                cls.source_text.splitlines()
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

    def assert_activity_index(self, text, prefix=''):
        activities = {
            'ACT-ROUTE': ('Route request', 'Send accepted requests to an eligible destination.'),
            'ACT-RECEIVE': ('Receive request', 'Capture requests and establish their completeness.'),
        }
        source = self.section(self.source_text, 'Activity context')
        expected = [f'- [Unassigned]({prefix}#unassigned)']
        for activity, (name, purpose) in activities.items():
            self.assertIn(f'- {activity}: {name}. Purpose: {purpose}', source.splitlines())
            expected.append(f'- [{activity} {name}]({prefix}#{activity.lower()}): {purpose}')
        for line in ['- Connection: ACT-RECEIVE supplies accepted requests to ACT-ROUTE.',
                     '- No total Activity order is established.']:
            self.assertIn(line, source.splitlines())
            expected.append(line)
        # Index order may vary; it must not invent an ordered business sequence.
        self.assertCountEqual(self.section(text, 'Business index').splitlines(), expected)

    def assert_presentation_contract(self, text):
        self.assert_activity_index(text)
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
        self.assertIn('- [Presentation question (要確認) for CHECK-005](#detail-check-005)',
                      self.section(text, 'CHECK-005').splitlines())
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
                self.assert_activity_index(text, prefix)
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
            'primary question hidden': self.presentation.replace(
                '- [Presentation question (要確認) for CHECK-005](#detail-check-005)\n', ''),
            'Activity purpose changed': self.presentation.replace(
                'Capture requests and establish their completeness.', 'Approve every request.'),
            'Activity connection reversed': self.presentation.replace(
                'ACT-RECEIVE supplies accepted requests to ACT-ROUTE.',
                'ACT-ROUTE supplies accepted requests to ACT-RECEIVE.'),
        }
        for name, mutated in mutations.items():
            with self.subTest(mutation=name), self.assertRaises(AssertionError):
                self.assert_presentation_contract(mutated)


class JapaneseCheckExampleTest(unittest.TestCase):
    """Bounded authored-example regressions, not a schema or Japanese detector.

    This checks the saved original, not a chat translation. Passing says nothing
    about arbitrary agent output, human comprehension or review-time gains.
    """

    BASELINE_REVISION = '12b18600bb7d64cb3495671df1d127c98c1e44d5'
    PRE_Q01_FOLD_REVISION = '1d9730c3c0d4501d9a8b2530b3aa10c299a49c05'
    PRE_A12_REVISION = 'a9c9b5aac1218fd0c43a61477c8050511c1ffd00'
    PRE_A3_REVISION = 'dbec3ba462ae13782533a31df94ceeb3c2949432'
    EXAMPLE_PATH = 'docs/examples/purchase-check-review.ja.md'
    SOURCE_REVISION = '587cbce54afa261810e10eeb819d9935055de13d'
    SOURCE_PATH = 'business-design/purchase-request/README.md'
    SOURCE = f'https://github.com/mk3008/alder/blob/{SOURCE_REVISION}/{SOURCE_PATH}'
    # Specific Japanese expectations from this limited purchase example only.
    ITEMS = {
        'JA-EX-03': ('対象の申請が却下済みになる',
                     '承認者が `submitted` の購入申請について購入を認めないと判断し、次の必須入力をすべて与えて却下する。\n'
                     '  - 却下する対象購入申請\n  - 却下理由',
                     '対象購入申請が `rejected` になる。', 'L154-L187'),
        'JA-EX-04': ('却下済みの申請は購買対象にならない',
                     '購入申請の状態が `rejected` である。',
                     'その申請は購買担当者の購入対象にならない。', 'L183-L187'),
        'JA-EX-01': ('新しい購入申請が提出済みになる',
                     '申請者が業務上必要な備品を購入したいと判断し、次の必須入力をすべて与えて新しい購入申請として登録する。\n'
                     '  - 品名\n  - 数量\n  - 希望購入金額\n  - 購入理由',
                     '購入要求が `submitted` の購入申請として記録される。', 'L61-L95'),
        'JA-EX-02': ('対象の申請が承認済みになる',
                     '承認者が `submitted` の購入申請について購入してよいと判断し、対象購入申請を選択して承認する。'
                     '金額により承認者や承認段階が変わる場合の扱いは JA-EX-Q01 に残す。',
                     '対象購入申請が `approved` になる。', 'L109-L140'),
        'JA-EX-05': ('購入した対象の申請が購入済みになる',
                     '購買担当者が `approved` の購入申請に基づいて対象備品を購入し、対象購入申請と実購入金額を選択・入力して購入結果を登録する。',
                     '対象購入申請が `purchased` になる。', 'L201-L234'),
        'JA-EX-Q01': ('金額によって承認者や承認段階が変わる場合の扱い',
                      '申請金額によって承認者や承認段階が変わる場合。',
                      '候補・未承認。どの承認者・承認段階を経て、いつ承認済みとするかは未決定。', 'L248-L259'),
    }
    LEGACY_ACTIVITY_NAMES = ('備品購入を申請する', '購入申請を承認する',
                             '購入申請を却下する', '承認済み備品を購入する')
    ACTIVITY_ITEMS = (('JA-EX-01',), ('JA-EX-02', 'JA-EX-Q01'),
                      ('JA-EX-03', 'JA-EX-04'), ('JA-EX-05',))
    LEGACY_UNRESOLVED_CONTEXT = ('次の候補は、業務2「購入申請を承認する」に関わる未決事項です。'
                                 '通常のチェック項目と分けて残します。'
                                 '元の業務設計で未決定とされているため、この文書では判断を保留します。')
    SHARED_REFERENCE = '共有項目は [JA-EX-04](#ja-ex-04) を参照してください。'
    REVIEW_INSTRUCTION = ('確認する場合は、IDを指定して「確認」「修正」「保留」を伝えてください。'
                          '業務を切り替えたり項目を開いたりしても、確認済みにはなりません。'
                          '返答がない場合も状態は変えません。')
    QUESTION = ('- 確認事項：金額別の承認経路を今回の業務設計で扱う必要が生じた場合、'
                'どの金額条件で誰の承認を必要とし、何をもって承認完了とするか。')
    OPTIONS = ('- 選択肢と影響：保留を続ける場合、この候補を実装上の合否条件に使わない。'
               '扱いを決める場合は、業務設計に条件と結果を記載して人間が確認した後、'
               '影響するチェック項目を更新する。金額境界や承認者をこの項目だけで決めない。')
    Q01_OLD_LABEL = 'JA-EX-Q01 の根拠・確認事項・テスト証拠'
    Q01_LABEL = 'JA-EX-Q01 の根拠・関連業務・テスト証拠'
    Q01_KIND = '- 種別：未決事項（候補）'
    GAP = '- テスト証拠：対応する自動テスト・検証内容・実行結果は未収集。'
    SOURCE_SHA256 = '2692b564fd44eb64005f6d595008afdf3ec62660ba81bfa99f6c90165c518fdc'

    @classmethod
    def setUpClass(cls):
        # Decode raw bytes without newline normalization for the byte audit.
        cls.example = (ROOT / cls.EXAMPLE_PATH).read_bytes().decode('utf-8')
        cls.baseline = subprocess.run(
            ['git', 'show', f'{cls.BASELINE_REVISION}:{cls.EXAMPLE_PATH}'],
            cwd=ROOT, capture_output=True, encoding='utf-8', check=True).stdout
        cls.pre_q01_fold = subprocess.run(
            ['git', 'show', f'{cls.PRE_Q01_FOLD_REVISION}:{cls.EXAMPLE_PATH}'],
            cwd=ROOT, capture_output=True, check=True).stdout.decode('utf-8')
        cls.pre_a12 = subprocess.run(
            ['git', 'show', f'{cls.PRE_A12_REVISION}:{cls.EXAMPLE_PATH}'],
            cwd=ROOT, capture_output=True, check=True).stdout.decode('utf-8')
        cls.pre_a3 = subprocess.run(
            ['git', 'show', f'{cls.PRE_A3_REVISION}:{cls.EXAMPLE_PATH}'],
            cwd=ROOT, capture_output=True, check=True).stdout.decode('utf-8')
        # The full-history workflow supplies the pinned revisions. Later changes
        # to the working-tree design do not redefine this historical example.
        cls.design = subprocess.run(
            ['git', 'show', f'{cls.SOURCE_REVISION}:{cls.SOURCE_PATH}'],
            cwd=ROOT, capture_output=True, encoding='utf-8', check=True).stdout
        # The historical source has numbered headings, not declared aliases or
        # a later Graph schema. Use its literal heading text as the local oracle.
        cls.ACTIVITIES = tuple(re.findall(r'^## (業務[1-4] — .+)$', cls.design, re.M))
        cls.PRE_A3_CONTEXT = cls.LEGACY_UNRESOLVED_CONTEXT.replace(
            '業務2「購入申請を承認する」', '「' + cls.ACTIVITIES[1] + '」')

    def approved_a12_text(self, historical):
        """Apply the two approved fixture edits only to pinned expected text."""
        text = historical
        for number, (old, full) in enumerate(zip(self.LEGACY_ACTIVITY_NAMES, self.ACTIVITIES), 1):
            alias = f'業務{number}'
            text = text.replace(f'## {old}\n', f'## {full}\n')
            text = text.replace(f'[{old}](#activity-{number})', f'[{full}](#activity-{number})')
            text = text.replace(f'{alias}「{old}」', f'「{full}」')
            text = text.replace(f'[{alias}]({self.SOURCE}', f'[{full}]({self.SOURCE}')
            text = text.replace(f'[{alias}の', f'[「{full}」の')
            # This runs on frozen fixture bytes, never on the candidate being
            # checked. It changes the remaining numeric references only.
            text = re.sub(re.escape(alias) + r'(?! — )', '「' + full + '」', text)
        condition = '- 条件：' + self.ITEMS['JA-EX-Q01'][1]
        self.assertEqual(text.count(condition), 1)
        self.assertNotIn(self.Q01_KIND, text)
        return text.replace(condition, self.Q01_KIND + '\n' + condition, 1)

    def approved_a3_text(self, historical, *, has_label=True):
        """Remove only the approved preface from pinned expected text."""
        label = '**未決事項**\n\n'
        context = self.PRE_A3_CONTEXT + '\n\n'
        self.assertEqual(historical.count(label), int(has_label))
        self.assertEqual(historical.count(context), 1)
        if has_label:
            self.assertIn(label + context + '<a id="ja-ex-q01"></a>', historical)
        return historical.replace(label, '', 1).replace(context, '', 1)

    def assert_source_design_unchanged(self, design):
        # This A-1/A-2 example change does not authorize repairing its source by
        # inventing aliases/IDs, or otherwise changing the historical design.
        self.assertEqual(hashlib.sha256(design.encode('utf-8')).hexdigest(), self.SOURCE_SHA256)
        self.assertEqual(re.findall(r'^## (業務[1-4] — .+)$', design, re.M), list(self.ACTIVITIES))

    def assert_source_activity_references(self, text):
        self.assert_source_design_unchanged(self.design)
        self.assertEqual(len(self.ACTIVITIES), 4)
        self.assertEqual([heading.split(' — ', 1)[1] for heading in self.ACTIVITIES],
                         list(self.LEGACY_ACTIVITY_NAMES))
        for match in re.finditer(r'業務[0-9０-９]+', text):
            matches = [heading for heading in self.ACTIVITIES
                       if text.startswith(heading, match.start())]
            self.assertEqual(len(matches), 1, text[match.start():match.start() + 50])
        for number, old in enumerate(self.LEGACY_ACTIVITY_NAMES, 1):
            prefix = f'業務{number} — '
            for match in re.finditer(re.escape(old), text):
                self.assertEqual(text[max(0, match.start() - len(prefix)):match.start()], prefix)
        # Literal source label/target pairs, including the five per-Check
        # evidence spans. A correct heading linked to another Activity fails.
        evidence = [(0, 'L51-L67', ''), (1, 'L99-L115', ''),
                    (2, 'L144-L160', ''), (3, 'L191-L207', ''),
                    (0, 'L61-L95', 'の開始条件・担当者・入力・手順・出力'),
                    (1, 'L109-L140', 'の開始条件・担当者・入力・手順・出力'),
                    (2, 'L154-L187', 'の開始条件・担当者・入力・手順・出力'),
                    (2, 'L183-L187', 'の出力'),
                    (3, 'L201-L234', 'の開始条件・担当者・入力・手順・出力')]
        expected = []
        for index, span, suffix in evidence:
            heading = self.ACTIVITIES[index]
            label = '「' + heading + '」' + suffix if suffix else heading
            expected.append((label, self.SOURCE + '#' + span))
        links = re.findall(r'\[([^]\n]+)\]\(([^)\n]+)\)', text)
        self.assertCountEqual([(label, target) for label, target in links
                               if re.search(r'業務[0-9０-９]+', label) and target.startswith('https://')],
                              expected)

    def assert_q01_kind(self, text):
        q01 = re.search(r'^### JA-EX-Q01 — [^\n]+\n(.*?)(?=^#{1,3} |\Z)',
                        text, re.M | re.S)
        self.assertIsNotNone(q01)
        self.assertEqual(text.count('- 種別：'), 1)
        self.assertEqual(text.count(self.Q01_KIND), 1)
        self.assertIn('\n\n' + self.Q01_KIND + '\n- 条件：' + self.ITEMS['JA-EX-Q01'][1], q01[0])
        visible = re.sub(r'<details>.*?</details>', '', q01[0], flags=re.S)
        self.assertIn(self.Q01_KIND, visible)
        self.assertIn('- 期待結果：' + self.ITEMS['JA-EX-Q01'][2], visible)
        self.assertIn('- 人間レビュー状態：要確認\n', visible)
        self.assertIn('- 導出分類：考慮候補\n', q01[0])
        self.assertEqual(q01[0].count('- 導出分類：'), 1)
        self.assertEqual(q01[0].count('- 人間レビュー状態：'), 1)
        self.assertIn(f'- 関連業務：「{self.ACTIVITIES[1]}」。新しい承認段階やActivityは定義しない。', q01[0])

    def assert_original_example(self, text):
        self.assert_source_activity_references(text)
        self.assert_q01_kind(text)
        self.assertCountEqual(re.findall(r'^### (JA-EX-\w+) — ', text, re.M), self.ITEMS)
        self.assertEqual(set(re.findall(r'JA-EX-(?:Q)?\d+', text)), set(self.ITEMS))
        for field in ['条件', '期待結果', '人間レビュー状態', '根拠', '導出分類', 'AI確度', 'テスト証拠']:
            self.assertEqual(text.count('- ' + field + '：'), len(self.ITEMS), field)
        for check_id, (title, condition, result, lines) in self.ITEMS.items():
            match = re.search(r'^### ' + re.escape(check_id + ' — ' + title) +
                              r'\n(.*?)(?=^#{1,3} |\Z)', text, re.M | re.S)
            self.assertIsNotNone(match, check_id)
            item = match[1]
            state = '要確認' if check_id == 'JA-EX-Q01' else '未レビュー'
            primary = f'- 条件：{condition}\n- 期待結果：{result}\n- 人間レビュー状態：{state}'
            self.assertEqual(text.count(primary), 1, check_id)
            self.assertIn(primary, item)
            self.assertIn(self.SOURCE + '#' + lines, item)
            self.assertIn(self.GAP, item)
            self.assertIn('- 導出分類：' + ('考慮候補' if state == '要確認' else '明示'), item)
            self.assertIn('- AI確度：' + ('要精査' if state == '要確認' else '高'), item)
            self.assertEqual(text.count(f'<a id="{check_id.lower()}"></a>'), 1)
        urls = re.findall(r'https://github.com/[^)\s]+', text)
        self.assertTrue(urls)
        for url in urls:
            self.assertRegex(url, '^' + re.escape(self.SOURCE) + r'(?:#L\d+-L\d+)?$')
        for number, name in enumerate(self.ACTIVITIES, 1):
            self.assertIn(f'[{name}](#activity-{number})', text)
            self.assertIn('## ' + name + '\n', self.design)
        for term in ['人間レビュー前の参考たたき台', '合意済みとは扱っていません',
                     '実装への引き渡し用の完成版でもありません',
                     'これは読み進める位置であり、項目の確認状況を表すものではありません。',
                     '業務を切り替えたり項目を開いたりしても、確認済みにはなりません。返答がない場合も状態は変えません。',
                     '共有項目 [JA-EX-04](#ja-ex-04)',
                     '共有項目は [JA-EX-04](#ja-ex-04) を参照してください。',
                     f'「{self.ACTIVITIES[3]}」からもこの項目を参照し、別のIDやレビュー状態は持たない。',
                     '新しい承認段階やActivityは定義しない', self.QUESTION,
                     '保留を続ける場合、この候補を実装上の合否条件に使わない',
                     '金額境界や承認者をこの項目だけで決めない',
                     '未決定の結果を、確定したテストの期待結果にしない']:
            self.assertIn(term, text)

    def assert_activity_layout(self, text):
        self.assertEqual(re.findall(r'^## (.+)$', text, re.M),
                         ['業務一覧', *self.ACTIVITIES, 'この例の範囲'])
        sections = dict(re.findall(r'^## ([^\n]+)\n(.*?)(?=^## |\Z)', text, re.M | re.S))
        index_rows = re.findall(r'^\| \[([^]]+)\]\(#activity-(\d)\)(.*)$',
                                sections['業務一覧'], re.M)
        self.assertEqual([(name, number) for name, number, _ in index_rows],
                         [(name, str(number)) for number, name in enumerate(self.ACTIVITIES, 1)])
        ordered_ids = [check_id for ids in self.ACTIVITY_ITEMS for check_id in ids]
        self.assertEqual(re.findall(r'^### (.+)$', text, re.M),
                         [f'{check_id} — {self.ITEMS[check_id][0]}' for check_id in ordered_ids])
        for number, (name, ids) in enumerate(zip(self.ACTIVITIES, self.ACTIVITY_ITEMS), 1):
            section = sections[name]
            self.assertEqual(text.count(f'<a id="activity-{number}"></a>'), 1)
            self.assertIn(f'<a id="activity-{number}"></a>\n\n## {name}\n', text)
            self.assertEqual(re.findall(r'^### (JA-EX-\w+) — ', section, re.M), list(ids))
            for check_id in ids:
                self.assertIn(f'<a id="{check_id.lower()}"></a>', section)
            index_ids = re.findall(r'\[(JA-EX-\w+)\]\(([^)]+)\)', index_rows[number - 1][2])
            expected_ids = [*ids, 'JA-EX-04'] if number == 4 else list(ids)
            self.assertEqual(index_ids, [(check_id, '#' + check_id.lower()) for check_id in expected_ids])
        approval = sections[self.ACTIVITIES[1]]
        self.assertLess(approval.index('### JA-EX-02'), approval.index('### JA-EX-Q01'))
        self.assert_q01_kind(approval)
        self.assertIn('未決事項 [JA-EX-Q01](#ja-ex-q01)', index_rows[1][2])
        self.assertIn(self.SHARED_REFERENCE, sections[self.ACTIVITIES[3]])
        self.assert_supplement_folding(text)
        self.assertNotIn('## 現在の業務', text)
        self.assertNotIn('## ほかの業務', text)

    def assert_supplement_folding(self, text):
        # An exact, test-only contract for these six authored supplements, not
        # a Markdown renderer or a product parser. Bare tags keep them closed by
        # default; blank lines let GitHub render the unchanged Markdown body.
        supplement = re.compile(
            r'^<details>\n<summary>(JA-EX-(?:Q)?\d+) の根拠・関連業務・テスト証拠</summary>\n\n'
            r'((?:- (?:根拠|導出分類|AI確度|関連業務|テスト証拠)：[^\n]+\n)+)'
            r'\n</details>(?=\n\n|\Z)', re.M)
        blocks = list(supplement.finditer(text))
        ordered_ids = [check_id for ids in self.ACTIVITY_ITEMS for check_id in ids]
        self.assertEqual([block[1] for block in blocks], ordered_ids)
        folding_tag = r'(?i)<\s*/?\s*(?:details|summary)\b'
        for block in blocks:
            check_id, body = block.groups()
            self.assertEqual(re.findall(r'^- ([^：]+)：', body, re.M),
                             ['根拠', '導出分類', 'AI確度', '関連業務', 'テスト証拠'])
            self.assertNotRegex(body, folding_tag)
            item = re.search(r'^### ' + check_id + r' — [^\n]+\n.*?(?=^#{1,3} |\Z)',
                             text, re.M | re.S)
            self.assertIsNotNone(item, check_id)
            self.assertTrue(item.start() < block.start() < block.end() <= item.end(), check_id)
        visible = supplement.sub('', text)
        # Reject any unmatched, attributed, nested, malformed or extra wrapper,
        # including one around an entire Activity, Check or unresolved item.
        self.assertNotRegex(visible, folding_tag)
        for check_id, (_, condition, result, _) in self.ITEMS.items():
            state = '要確認' if check_id == 'JA-EX-Q01' else '未レビュー'
            primary = f'- 条件：{condition}\n- 期待結果：{result}\n- 人間レビュー状態：{state}'
            self.assertEqual(visible.count(primary), 1, check_id)
        for pattern in [r'^#{2,3} .+$', r'<a id="[^"<>]+"></a>']:
            self.assertEqual(re.findall(pattern, visible, re.M), re.findall(pattern, text, re.M))
        unresolved = r'^### JA-EX-Q01 — .*?(?=^#{1,3} |\Z)'
        visible_unresolved = re.search(unresolved, visible, re.M | re.S)
        self.assertIsNotNone(visible_unresolved)
        self.assert_q01_kind(text)
        self.assertIn(self.Q01_KIND, visible_unresolved[0])
        # The approved change folds Q01's five supporting fields, while its
        # question and alternatives/effects follow the still-visible state.
        decision = '- 人間レビュー状態：要確認\n\n' + self.QUESTION + '\n' + self.OPTIONS
        self.assertIn(decision, visible_unresolved[0])
        self.assertEqual(visible.count(self.QUESTION), 1)
        self.assertEqual(visible.count(self.OPTIONS), 1)
        for context in [self.SHARED_REFERENCE, self.REVIEW_INSTRUCTION]:
            self.assertIn(context, visible)

    def content_lines(self, text, item=False):
        # Normalize only this authored example's known presentation changes.
        # Keep complete field/support text, links, literals and bullet nesting;
        # this is a test-only baseline audit, not an accepted product format.
        layout_lines = {
            '## 業務から選ぶ', '## 業務一覧', '## 現在の業務：購入申請を却下する',
            '## ほかの業務の項目', '## 業務設計へ戻す候補',
            '現在の確認対象は JA-EX-03 と JA-EX-04 です。次に読むIDは JA-EX-03。'
            'これは読み進める位置であり、項目の確認状況を表すものではありません。',
            '再開する際は、業務と次に読むIDを指定できます。'
            'これは読み進める位置であり、項目の確認状況を表すものではありません。',
            '<summary>備品購入を申請する：JA-EX-01</summary>',
            '<summary>購入申請を承認する：JA-EX-02</summary>',
            '<summary>承認済み備品を購入する：JA-EX-05、共有項目 JA-EX-04</summary>',
            '<details>', '</details>',
            *(f'## {name}' for name in self.ACTIVITIES),
            *(f'## {name}' for name in self.LEGACY_ACTIVITY_NAMES),
        }
        if item:
            # These paragraphs moved across Check boundaries, but remain in the
            # full-document audit below; they are not evidence for the last ID.
            layout_lines.update((self.SHARED_REFERENCE, self.REVIEW_INSTRUCTION))
        lines = []
        for line in text.splitlines():
            if not line or line in layout_lines or re.fullmatch(r'<a id="[^"<>]+"></a>', line):
                continue
            if line.startswith(f'| [{self.ACTIVITIES[1]}](#activity-2) |'):
                line = line.replace('、未決事項 [JA-EX-Q01](#ja-ex-q01)', '')
            line = re.sub(r'^<summary>(.*)</summary>$', r'\1', line)
            line = re.sub(r'^#{1,4} ', '', line)
            lines.append(line)
        return lines

    def assert_baseline_content_preserved(self, text):
        pattern = r'^### (JA-EX-\w+) — (.*?)(?=^#{1,3} |\Z)'
        # A-1/A-2 replace historical reference labels and add one kind line;
        # A-3 removes only the old preface. This oldest baseline has no bold
        # label. Candidate content is never normalized to hide regressions.
        allowed_baseline = self.approved_a3_text(self.approved_a12_text(self.baseline), has_label=False)
        baseline_items = re.findall(pattern, allowed_baseline, re.M | re.S)
        actual_items = re.findall(pattern, text, re.M | re.S)
        self.assertCountEqual([check_id for check_id, _ in actual_items], self.ITEMS)
        expected = {check_id: self.content_lines(body, item=True)
                    for check_id, body in baseline_items}
        # Only Q01's approved question/options relocation and support label
        # change differ from the old ordered per-ID content. Do not weaken
        # every item to an unordered comparison to accommodate this exception.
        q01 = expected['JA-EX-Q01']
        self.assertEqual(q01.count(self.Q01_OLD_LABEL), 1)
        for line in (self.QUESTION, self.OPTIONS):
            self.assertEqual(q01.count(line), 1)
            q01.remove(line)
        after_state = q01.index('- 人間レビュー状態：要確認') + 1
        q01[after_state:after_state] = [self.QUESTION, self.OPTIONS]
        q01[q01.index(self.Q01_OLD_LABEL)] = self.Q01_LABEL
        actual = {check_id: self.content_lines(body, item=True)
                  for check_id, body in actual_items}
        self.assertEqual(actual, expected)
        # Also preserve context, all purpose/connection cells and scope text,
        # allowing block reordering and the explicitly added Q01 index link.
        baseline_lines = self.content_lines(allowed_baseline)
        self.assertEqual(baseline_lines.count(self.Q01_OLD_LABEL), 1)
        baseline_lines[baseline_lines.index(self.Q01_OLD_LABEL)] = self.Q01_LABEL
        self.assertCountEqual(self.content_lines(text), baseline_lines)
        self.assertCountEqual(re.findall(r'https://github.com/[^)\s]+', text),
                              re.findall(r'https://github.com/[^)\s]+', self.baseline))

    def assert_only_approved_q01_change(self, text):
        # Exact transformation of the last pre-change artifact. It permits only
        # Q01's two moved lines, renamed support label and wrapper/spacing
        # lines plus the separately pinned A-1/A-2/A-3 changes, not arbitrary
        # normalization elsewhere in the document.
        start = self.pre_q01_fold.index('<a id="ja-ex-q01"></a>')
        end = self.pre_q01_fold.index('<a id="activity-3"></a>', start)
        before = self.pre_q01_fold[start:end]
        primary, support = before.split('#### ' + self.Q01_OLD_LABEL + '\n\n')
        for line in (self.QUESTION, self.OPTIONS):
            self.assertEqual(support.count(line + '\n'), 1)
            support = support.replace(line + '\n', '', 1)
        after = (primary + self.QUESTION + '\n' + self.OPTIONS + '\n\n'
                 '<details>\n<summary>' + self.Q01_LABEL + '</summary>\n\n' +
                 support.rstrip('\n') + '\n\n</details>\n\n')
        expected = self.pre_q01_fold[:start] + after + self.pre_q01_fold[end:]
        expected = self.approved_a12_text(expected)
        self.assertEqual(self.pre_a3.encode('utf-8'), expected.encode('utf-8'))
        self.assert_only_approved_a3_changes(text)

    def assert_only_approved_a12_changes(self, text):
        self.assertEqual(self.pre_a3.encode('utf-8'), self.approved_a12_text(self.pre_a12).encode('utf-8'))
        self.assert_only_approved_a3_changes(text)

    def assert_only_approved_a3_changes(self, text):
        self.assertEqual(text.encode('utf-8'), self.approved_a3_text(self.pre_a3).encode('utf-8'))

    def test_pinned_prechange_allows_q01_fold_and_only_a12_edits_to_normal_five_bytes(self):
        self.assertEqual(hashlib.sha256(self.pre_q01_fold.encode('utf-8')).hexdigest(),
                         '816db14883e9792e7d0dcd89cd8852adbc5e6354197576313e4d519e28e75819')
        self.assert_only_approved_q01_change(self.example)
        for check_id in self.ITEMS:
            if check_id == 'JA-EX-Q01':
                continue
            pattern = (r'^<a id="' + check_id.lower() + r'"></a>\n\n'
                       r'### ' + check_id + r' — .*?'
                       r'(?=^<a id=|^## |\Z)')
            before = re.search(pattern, self.approved_a3_text(self.approved_a12_text(self.pre_q01_fold)),
                               re.M | re.S)
            after = re.search(pattern, self.example, re.M | re.S)
            with self.subTest(check_id=check_id):
                self.assertIsNotNone(before)
                self.assertIsNotNone(after)
                self.assertEqual(after[0].encode('utf-8'), before[0].encode('utf-8'))

    def test_pinned_a12_change_allows_only_source_names_and_visible_q01_kind(self):
        self.assertEqual(hashlib.sha256(self.pre_a12.encode('utf-8')).hexdigest(),
                         'b7f7338587a9f6dd31757c2daf200de6692098b88c82d5568f8dd03bff218c82')
        self.assert_only_approved_a12_changes(self.example)
        self.assert_source_activity_references(self.example)
        self.assert_q01_kind(self.example)
        with self.assertRaises(AssertionError):
            self.assert_source_activity_references(self.pre_a12)
        with self.assertRaises(AssertionError):
            self.assert_q01_kind(self.pre_a12)

    def test_pinned_a3_change_removes_only_preface_and_preserves_all_item_bytes(self):
        self.assertEqual(hashlib.sha256(self.pre_a3.encode('utf-8')).hexdigest(),
                         'c57630bf0045a81aa8f8a6bf85f934a86d21511c4dc4be60dc866f0fc4f24c90')
        self.assert_only_approved_a3_changes(self.example)
        for check_id in self.ITEMS:
            # Include the whole item from its anchor through its supplement,
            # but not the removed prose between the approval and Q01 items.
            pattern = r'^<a id="' + check_id.lower() + r'"></a>\n.*?^</details>\n'
            before = re.search(pattern, self.pre_a3, re.M | re.S)
            after = re.search(pattern, self.example, re.M | re.S)
            with self.subTest(check_id=check_id):
                self.assertIsNotNone(before)
                self.assertIsNotNone(after)
                self.assertEqual(after[0].encode('utf-8'), before[0].encode('utf-8'))
        for restored in ['**未決事項**\n\n', self.PRE_A3_CONTEXT + '\n\n']:
            with self.subTest(restored_preface=restored):
                mutated = self.example.replace('<a id="ja-ex-q01"></a>',
                                               restored + '<a id="ja-ex-q01"></a>', 1)
                with self.assertRaises(AssertionError):
                    self.assert_only_approved_a3_changes(mutated)

    def test_source_name_oracle_rejects_every_numeric_alias_and_truncated_reference(self):
        text = self.example
        for number, heading in enumerate(self.ACTIVITIES, 1):
            occurrences = list(re.finditer(re.escape(heading), text))
            self.assertTrue(occurrences)
            for occurrence in occurrences:
                # Exercise visible prose, headings, index and evidence labels,
                # as well as references in the closed supporting details.
                for label, replacement in [('bare numeric alias', f'業務{number}'),
                                           ('missing source numbering', self.LEGACY_ACTIVITY_NAMES[number - 1])]:
                    with self.subTest(activity=heading, position=occurrence.start(), mutation=label):
                        mutated = text[:occurrence.start()] + replacement + text[occurrence.end():]
                        with self.assertRaises(AssertionError):
                            self.assert_source_activity_references(mutated)
                        with self.assertRaises(AssertionError):
                            self.assert_only_approved_a12_changes(mutated)
        for alias in ['業務1〜4', '業務１', '業務２', '業務３', '業務４', '業務5']:
            with self.subTest(alias=alias), self.assertRaises(AssertionError):
                self.assert_source_activity_references(text + '\n' + alias + '\n')

    def test_source_name_oracle_rejects_wrong_source_link_labels_and_targets(self):
        text = self.example
        links = re.findall(r'\[([^]\n]*業務[1-4][^]\n]*)\]\((https://[^)\n]+)\)', text)
        self.assertEqual(len(links), 9)
        for label, target in links:
            number = next(i for i, heading in enumerate(self.ACTIVITIES) if heading in label)
            other = self.ACTIVITIES[(number + 1) % len(self.ACTIVITIES)]
            original = f'[{label}]({target})'
            wrong_label = label.replace(self.ACTIVITIES[number], other)
            wrong_target = self.SOURCE + ('#L99-L115' if '#L51-L67' in target else '#L51-L67')
            for name, replacement in [('wrong source label', f'[{wrong_label}]({target})'),
                                      ('wrong source target', f'[{label}]({wrong_target})')]:
                with self.subTest(link=original, mutation=name):
                    mutated = text.replace(original, replacement, 1)
                    self.assertNotEqual(mutated, text)
                    with self.assertRaises(AssertionError):
                        self.assert_source_activity_references(mutated)
                    with self.assertRaises(AssertionError):
                        self.assert_only_approved_a12_changes(mutated)

    def test_q01_kind_contract_rejects_missing_hidden_misclassified_or_conflated_fields(self):
        text = self.example
        kind = self.Q01_KIND
        q01 = text[text.index('<a id="ja-ex-q01">'):text.index('<a id="activity-3">')]
        condition = '- 条件：' + self.ITEMS['JA-EX-Q01'][1]
        hidden = q01.replace(kind + '\n', '', 1).replace(
            '- 関連業務：', '- 関連業務：' + kind, 1)
        mutations = {
            'kind missing': text.replace(kind + '\n', '', 1),
            'kind hidden in supporting field': text.replace(q01, hidden, 1),
            'kind hidden in HTML comment': text.replace(kind, '<!-- ' + kind + ' -->', 1),
            'kind hidden in additional details': text.replace(kind,
                '<details>\n<summary>補足</summary>\n\n' + kind + '\n\n</details>', 1),
            'kind moved after condition': text.replace(kind + '\n' + condition, condition + '\n' + kind, 1),
            'kind moved above Q01 heading': text.replace(kind + '\n', '', 1).replace(
                '<a id="ja-ex-q01"></a>', kind + '\n\n<a id="ja-ex-q01"></a>', 1),
            'kind misclassified as AI proposal': text.replace(kind, '- 種別：AI提案（候補）', 1),
            'kind replaced with derivation': text.replace(kind, '- 種別：考慮候補', 1),
            'kind replaced with review state': text.replace(kind, '- 種別：要確認', 1),
            'kind copied into derivation': text.replace('- 導出分類：考慮候補', '- 導出分類：未決事項（候補）', 1),
            'kind copied into state': text.replace('- 人間レビュー状態：要確認', '- 人間レビュー状態：未決事項（候補）', 1),
            'diagnostic NG overwrites human review state': text.replace(
                '- 人間レビュー状態：要確認', '- 人間レビュー状態：NG', 1),
            'derivation copied into state': text.replace('- 人間レビュー状態：要確認', '- 人間レビュー状態：考慮候補', 1),
            'state copied into derivation': text.replace('- 導出分類：考慮候補', '- 導出分類：要確認', 1),
            'candidate result used instead of kind': text.replace(kind, '- 種別：候補・未承認', 1),
            'candidate and unapproved result removed': text.replace('候補・未承認。', '', 1),
        }
        for name, mutated in mutations.items():
            with self.subTest(mutation=name):
                self.assertNotEqual(mutated, text)
                with self.assertRaises(AssertionError):
                    self.assert_q01_kind(mutated)
                with self.assertRaises(AssertionError):
                    self.assert_only_approved_a12_changes(mutated)

    def test_source_design_audit_rejects_edits_and_retroactive_alias_or_graph_definitions(self):
        mutations = {
            'source heading changed': self.design.replace(self.ACTIVITIES[0], '業務1 — 備品購入を申し込む', 1),
            'source alias definition added': self.design + '\n業務1 = 備品購入を申請する\n',
            'source Graph ID retrofitted': self.design.replace('## ' + self.ACTIVITIES[0],
                '## ACT-01 — 備品購入を申請する', 1),
            'source business result changed': self.design.replace('`submitted`', '`approved`', 1),
        }
        for name, mutated in mutations.items():
            with self.subTest(mutation=name):
                self.assertNotEqual(mutated, self.design)
                with self.assertRaises(AssertionError):
                    self.assert_source_design_unchanged(mutated)

    def test_approved_q01_requirement_supersedes_only_old_support_visibility(self):
        # This is an explicit requirement change, not evidence that the old
        # five-fold artifact already met the new six-fold contract.
        self.assertEqual(self.pre_q01_fold.count('<details>'), 5)
        self.assertIn('#### ' + self.Q01_OLD_LABEL, self.pre_q01_fold)
        with self.assertRaises(AssertionError):
            self.assert_supplement_folding(self.pre_q01_fold)
        self.assert_supplement_folding(self.example)

    def test_q01_change_audit_rejects_reordering_and_out_of_scope_changes(self):
        text = self.example
        q01_start = text.index('<a id="ja-ex-q01"></a>')
        q01_end = text.index('<a id="activity-3"></a>', q01_start)
        q01 = text[q01_start:q01_end]
        ordered_mutations = {
            'unresolved question and effects reordered': text.replace(
                self.QUESTION + '\n' + self.OPTIONS, self.OPTIONS + '\n' + self.QUESTION),
            'unresolved support fields reordered': text.replace(q01, q01.replace(
                '- 導出分類：考慮候補\n- AI確度：要精査', '- AI確度：要精査\n- 導出分類：考慮候補')),
            'normal support fields reordered': text.replace(
                '- 導出分類：明示\n- AI確度：高\n', '- AI確度：高\n- 導出分類：明示\n', 1),
        }
        for name, mutated in ordered_mutations.items():
            with self.subTest(mutation=name):
                self.assertNotEqual(mutated, text)
                # Every line still exists; only ordered per-ID checks catch it.
                self.assertCountEqual(self.content_lines(mutated), self.content_lines(text))
                with self.assertRaises(AssertionError):
                    self.assert_baseline_content_preserved(mutated)
                with self.assertRaises(AssertionError):
                    self.assert_only_approved_q01_change(mutated)
        for name, mutated in {
            'normal whitespace changed': text.replace('- 人間レビュー状態：未レビュー\n',
                                                       '- 人間レビュー状態：未レビュー\n\n', 1),
            'unresolved supplement text changed': text.replace('- AI確度：要精査', '- AI確度：高'),
            'document context changed': text.replace('## この例の範囲', '## 今回の範囲'),
            'newline bytes changed': text.replace('\n', '\r\n'),
        }.items():
            with self.subTest(mutation=name):
                self.assertNotEqual(mutated, text)
                with self.assertRaises(AssertionError):
                    self.assert_only_approved_q01_change(mutated)

    def test_saved_example_uses_index_ordered_activity_and_check_hierarchy(self):
        self.assert_activity_layout(self.example)

    def test_layout_only_change_preserves_baseline_content_under_the_same_ids(self):
        self.assertEqual(hashlib.sha256(self.baseline.encode('utf-8')).hexdigest(),
                         '0956cad2c2ddbe1bbd25d37042a4a669e56ce440fa94b6f800f95ca7e375ace2')
        self.assert_baseline_content_preserved(self.example)

    def test_layout_contract_rejects_misgrouping_and_duplicate_or_lost_shared_items(self):
        text = self.example
        activity_one = text[text.index('<a id="activity-1">'):text.index('<a id="activity-2">')]
        activity_two = text[text.index('<a id="activity-2">'):text.index('<a id="activity-3">')]
        unresolved = text[text.index('<a id="ja-ex-q01">'):text.index('<a id="activity-3">')]
        shared = text[text.index('<a id="ja-ex-04">'):text.index('<a id="activity-4">')]
        rows = re.findall(r'^\| \[[^]]+\]\(#activity-\d\).*$', text, re.M)
        mutations = {
            'Activity hierarchy demoted': text.replace('## ' + self.ACTIVITIES[2], '### ' + self.ACTIVITIES[2]),
            'Check hierarchy demoted': text.replace('### JA-EX-01 —', '#### JA-EX-01 —'),
            'Activity bodies disagree with index order': text.replace(activity_one + activity_two,
                                                                       activity_two + activity_one),
            'index rows reordered': text.replace(rows[0] + '\n' + rows[1], rows[1] + '\n' + rows[0]),
            'Activity anchors point to swapped headings': text.replace('id="activity-1"', 'id="swapped"')
                .replace('id="activity-2"', 'id="activity-1"').replace('id="swapped"', 'id="activity-2"'),
            'unresolved candidate moved outside approval': text.replace(unresolved, '').replace(
                '<a id="ja-ex-03"></a>', unresolved + '<a id="ja-ex-03"></a>'),
            'unresolved item kind lost': text.replace(self.Q01_KIND + '\n', '', 1),
            'unresolved index label lost': text.replace('未決事項 [JA-EX-Q01]', '[JA-EX-Q01]'),
            'shared full body duplicated in purchase': text.replace('<a id="ja-ex-05"></a>',
                                                                     shared + '<a id="ja-ex-05"></a>'),
            'shared purchase body reference lost but index retained': text.replace(self.SHARED_REFERENCE, ''),
            'unsafe whole Check folding': text.replace('### JA-EX-01 —', '<details>\n### JA-EX-01 —'),
        }
        for name, mutated in mutations.items():
            with self.subTest(mutation=name):
                self.assertNotEqual(mutated, text)
                with self.assertRaises(AssertionError):
                    self.assert_activity_layout(mutated)

    def test_saved_example_folds_all_supplements_and_keeps_questions_visible(self):
        self.assert_supplement_folding(self.example)

    def test_supplement_contract_rejects_unsafe_folding(self):
        text = self.example
        first = re.search(r'^<details>\n.*?^</details>', text, re.M | re.S)[0]
        summary = '<summary>JA-EX-01 の根拠・関連業務・テスト証拠</summary>'
        q01 = text[text.index('<a id="ja-ex-q01">'):text.index('<a id="activity-3">')].strip()
        q01_support = q01[q01.index('<details>'):]
        q01_summary = '<summary>' + self.Q01_LABEL + '</summary>'

        def fold(content):
            return '<details>\n<summary>補足</summary>\n\n' + content + '\n\n</details>'

        mutations = {
            'default open': text.replace('<details>', '<details open>', 1),
            'false open attribute still opens HTML': text.replace('<details>', '<details open="false">', 1),
            'mixed-case open attribute': text.replace('<details>', '<details OPEN>', 1),
            'details attribute': text.replace('<details>', '<details class="supplement">', 1),
            'summary hidden attribute': text.replace('<summary>', '<summary hidden>', 1),
            'opening tag malformed': text.replace('<details>', '<details', 1),
            'closing tag missing': text.replace('</details>', '', 1),
            'summary closing tag missing': text.replace('</summary>', '', 1),
            'stray closing tag': text + '\n</details>\n',
            'summary separated from details': text.replace('<details>\n<summary>', '<details>\n補足\n<summary>', 1),
            'Markdown blank after summary missing': text.replace(summary + '\n\n', summary + '\n', 1),
            'Markdown blank before closing missing': text.replace('\n\n</details>', '\n</details>', 1),
            'Markdown blank after closing missing': text.replace('</details>\n\n', '</details>\n', 1),
            'supplement nested': text.replace(first, fold(first), 1),
            'inline nested tags': text.replace('- AI確度：高', '- AI確度：<details><summary>高</summary></details>', 1),
            'supplement label assigned to another ID': text.replace(summary, summary.replace('01', '02'), 1),
            'supplement duplicated': text.replace(first, first + '\n\n' + first, 1),
            'normal supplement unfolded': text.replace(first, first.replace('<details>\n' + summary,
                '#### JA-EX-01 の根拠・関連業務・テスト証拠').replace('\n\n</details>', ''), 1),
            'unresolved entire item hidden': text.replace(q01, fold(q01), 1),
            # Q01 support folding is now required. The old prohibition on
            # folding it is superseded, while unsafe wrappers remain invalid.
            'unresolved support nested': text.replace(q01_support, fold(q01_support), 1),
            'unresolved support default open': text.replace(q01_support,
                q01_support.replace('<details>', '<details open>', 1), 1),
            'unresolved support unfolded': text.replace(q01_support, q01_support.replace(
                '<details>\n' + q01_summary, '#### ' + self.Q01_LABEL)
                .replace('\n\n</details>', ''), 1),
            'unresolved question hidden': text.replace(self.QUESTION, fold(self.QUESTION), 1),
            'unresolved options and effects hidden': text.replace(self.OPTIONS, fold(self.OPTIONS), 1),
            'unresolved item kind hidden': text.replace(self.Q01_KIND, fold(self.Q01_KIND), 1),
            'shared reference hidden': text.replace(self.SHARED_REFERENCE, fold(self.SHARED_REFERENCE), 1),
        }
        for check_id in ['JA-EX-01', 'JA-EX-Q01']:
            title, condition, result, _ = self.ITEMS[check_id]
            state = '要確認' if check_id == 'JA-EX-Q01' else '未レビュー'
            for label, content in [('condition', '- 条件：' + condition),
                                   ('expected result', '- 期待結果：' + result),
                                   ('human review state', '- 人間レビュー状態：' + state),
                                   ('Check heading', f'### {check_id} — {title}')]:
                mutations[f'{check_id} {label} hidden'] = text.replace(content, fold(content), 1)
        for label, content in [('condition bullet', '  - 品名'),
                               ('Activity heading', '## ' + self.ACTIVITIES[0]),
                               ('Activity anchor', '<a id="activity-1"></a>'),
                               ('Check anchor', '<a id="ja-ex-01"></a>')]:
            mutations[label + ' hidden'] = text.replace(content, fold(content), 1)
        # Keep otherwise valid supplement syntax so projection must detect an
        # anchor moved into its body, rather than only rejecting malformed tags.
        anchor = '<a id="ja-ex-01"></a>'
        mutations['Check anchor moved inside support line'] = text.replace(anchor, '', 1).replace(
            '- 関連業務：', '- 関連業務：' + anchor, 1)
        for label, content in [('unresolved kind', self.Q01_KIND),
                               ('unresolved question', self.QUESTION),
                               ('unresolved alternatives and effects', self.OPTIONS),
                               ('unresolved Check anchor', '<a id="ja-ex-q01"></a>')]:
            # Valid five-field Q01 support syntax must not hide a pending
            # decision or anchor merely by appending it to an allowed field.
            hidden = q01.replace(content + '\n', '', 1).replace(
                '- 関連業務：', '- 関連業務：' + content, 1)
            mutations[label + ' moved inside support line'] = text.replace(q01, hidden, 1)
        for name, mutated in mutations.items():
            with self.subTest(mutation=name):
                self.assertNotEqual(mutated, text)
                with self.assertRaises(AssertionError):
                    self.assert_supplement_folding(mutated)

    def test_baseline_audit_rejects_each_primary_or_support_line_loss(self):
        text = self.example
        for match in re.finditer(r'^### (JA-EX-\w+) — (.*?)(?=^#{1,3} |\Z)', text, re.M | re.S):
            check_id, body = match.groups()
            # Delete each complete primary/support field and each condition
            # bullet and supplement label in turn, including text the earlier
            # meaning oracle samples. Summary labels replace all six H4s.
            for line in body.splitlines():
                if not re.match(r'^(?:- |  - |#### |<summary>)', line):
                    continue
                with self.subTest(check_id=check_id, lost_line=line):
                    mutated = text[:match.start(2)] + body.replace(line, '', 1) + text[match.end(2):]
                    self.assertNotEqual(mutated, text)
                    with self.assertRaises(AssertionError):
                        self.assert_baseline_content_preserved(mutated)
        first = '- AI確度：高。根拠から期待結果を読み取れる確かさであり、人間の確認を代わりに行うものではない。'
        second = '- AI確度：要精査'
        swapped = text.replace(first, '__FIRST_SUPPORT__').replace(second, first).replace('__FIRST_SUPPORT__', second)
        # A whole-document text comparison alone would miss this reassignment.
        self.assertCountEqual(self.content_lines(swapped), self.content_lines(text))
        with self.assertRaises(AssertionError):
            self.assert_baseline_content_preserved(swapped)

    def test_saved_japanese_example_preserves_items_questions_and_navigation(self):
        self.assert_original_example(self.example)

    def test_pinned_source_and_line_evidence_match_readable_pinned_design(self):
        # Offline content/line checks; this does not test GitHub availability.
        self.assert_source_design_unchanged(self.design)
        self.assert_source_design_unchanged((ROOT / self.SOURCE_PATH).read_bytes().decode('utf-8'))
        lines = self.design.splitlines()
        for start, end in re.findall(re.escape(self.SOURCE) + r'#L(\d+)-L(\d+)', self.example):
            self.assertTrue(1 <= int(start) <= int(end) <= len(lines))
        for span, evidence in [('L61-L95', '購入要求が `submitted` の購入申請として記録される。'),
                               ('L109-L140', '対象購入申請が `approved` になる。'),
                               ('L154-L187', '対象購入申請が `rejected` になる。'),
                               ('L183-L187', '購買担当者の購入対象にはならない。'),
                               ('L201-L234', '対象購入申請が `purchased` になる。'),
                               ('L248-L259', '申請金額によって承認者や承認段階が変わる場合の扱い')]:
            start, end = map(int, re.findall(r'\d+', span))
            self.assertIn(self.SOURCE + '#' + span, self.example)
            self.assertIn(evidence, '\n'.join(lines[start - 1:end]))

    def test_example_contract_rejects_representative_losses_and_inventions(self):
        text = self.example
        mutations = {
            'Japanese headings with English field bodies': re.sub(
                r'^- (条件|期待結果|根拠|確認事項|テスト証拠)：.*$', r'- \1：English body.', text, flags=re.M),
            'one English expected result': text.replace('対象購入申請が `approved` になる。',
                                                        'The request becomes `approved`.'),
            'literal business state changed': text.replace('`rejected`', '`approved`'),
            'stable ID replaced': text.replace('JA-EX-04', 'JA-EX-104'),
            'human confirmation invented': text.replace('人間レビュー状態：未レビュー',
                                                         '人間レビュー状態：確認済み', 1),
            'source revision changed': text.replace(self.SOURCE_REVISION, '0' * 40),
            'source evidence mislinked': text.replace('#L183-L187', '#L109-L140'),
            'question removed': text.replace(self.QUESTION, ''),
            'unresolved outcome decided': text.replace(self.ITEMS['JA-EX-Q01'][2],
                                                       '10万円以上の申請は部長の承認で確定する。'),
            'shared primary item duplicated': text + '\n### JA-EX-04 — 却下済みの申請は購買対象にならない\n',
            'shared Activity reference removed': text.replace('共有項目 [JA-EX-04](#ja-ex-04)', ''),
            'navigation treated as confirmation': text.replace('項目の確認状況を表すものではありません。',
                                                                  '項目の確認が完了したことを表します。'),
        }
        for name, mutated in mutations.items():
            with self.subTest(mutation=name):
                self.assertNotEqual(mutated, text)
                with self.assertRaises(AssertionError):
                    self.assert_original_example(mutated)


if __name__ == '__main__':
    unittest.main()
