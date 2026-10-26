"""Synthetic negative controls, not agent success-rate measurements."""
import copy
import hashlib
import json
from pathlib import Path
import tempfile
import unittest

from tools.draft_skill_pilot import FIXTURE, ROOT, SKILLS, digest, package, validate_and_score


class DraftSkillPilotTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        (self.root / 'output.json').write_text('{"synthetic": true}')
        (self.root / 'trace.md').write_text('Synthetic review trace; not a real execution.')
        self.oracle = json.loads((FIXTURE / 'evaluator/normal.json').read_text())
        self.record = {
            'case': 'normal', 'source_revision': self.oracle['source_revision'],
            'executor_id': 'synthetic-worker',
            'evaluator': {'id': 'synthetic-evaluator', 'independent_of_executor': True},
            'execution_status': 'RUN', 'input_integrity': 'verified',
            'output_evidence': 'output',
            'evidence': {key: {'path': path, 'sha256': digest(self.root / path)}
                         for key, path in [('output', 'output.json'), ('trace', 'trace.md')]},
            'requirements': [{'id': r['id'], 'status': 'met', 'evidence': ['output', 'trace'],
                              'rationale': 'Synthetic evaluator judgment for gate tests only.'}
                             for r in self.oracle['requirements']],
            'review': {'status': 'completed', 'independence': 'same_agent', 'evidence': 'trace',
                       'reviewed_output_sha256': digest(self.root / 'output.json')},
            'observations': dict.fromkeys(['steps', 'seconds', 'retries', 'cost'], 'unknown'),
            'findings': [],
        }

    def score(self):
        return validate_and_score(self.oracle, self.record, self.root)['outcome']

    def row(self, name):
        return next(r for r in self.record['requirements'] if r['id'] == name)

    def test_frozen_sources_and_oracles(self):
        frozen = json.loads((FIXTURE / 'frozen.json').read_text())
        actual = {str(p.relative_to(FIXTURE)): digest(p) for p in FIXTURE.rglob('*')
                  if p.is_file() and p.name != 'frozen.json'}
        self.assertEqual(frozen['files'], actual)
        self.assertEqual(len(list((FIXTURE / 'worker').glob('*.md'))), 3)
        for case in ('normal', 'undecided', 'review_unavailable'):
            oracle = json.loads((FIXTURE / 'evaluator' / (case + '.json')).read_text())
            self.assertEqual(oracle['source_revision'], frozen['source_revision'])
            self.assertEqual(len({r['id'] for r in oracle['requirements']}), len(oracle['requirements']))

    def test_package_exact_allowlist_excludes_oracle_and_previous_outputs(self):
        destination = self.root / 'bundle'
        manifest = package('normal', destination)
        expected = {'task.md', 'AGENTS.md', 'plugins/alder/plugin.json'}
        for name in SKILLS:
            source = ROOT / 'plugins/alder/skills' / name
            expected.update('plugins/alder/skills/' + name + '/' + str(p.relative_to(source))
                            for p in source.rglob('*') if p.is_file())
        self.assertEqual(set(manifest), expected)
        self.assertEqual({str(p.relative_to(destination)) for p in destination.rglob('*') if p.is_file()},
                         expected | {'input-manifest.json'})
        for path, sha in manifest.items():
            self.assertEqual(digest(destination / path), sha)
        with self.assertRaises(ValueError):
            package('../../evaluator/normal', self.root / 'bad')

    def test_complete_synthetic_record(self):
        self.assertEqual(self.score(), 'PASS')

    def test_fabricated_business_fact_fails_despite_other_passes(self):
        self.row('no_invention')['status'] = 'unmet'
        self.row('no_invention')['rationale'] = 'Negative control: unsupported approval/fee asserted.'
        self.assertEqual(self.score(), 'FAIL')

    def test_undecided_becomes_decided_is_critical_failure(self):
        self.oracle = json.loads((FIXTURE / 'evaluator/undecided.json').read_text())
        self.record['case'] = 'undecided'
        self.row('normal_handoff')['id'] = 'undecided'
        self.row('undecided')['status'] = 'unmet'
        self.assertEqual(self.score(), 'FAIL')

    def test_partial_critical_is_not_pass(self):
        self.row('facts')['status'] = 'partial'
        self.assertEqual(self.score(), 'FAIL')

    def test_unknown_is_not_manufactured_pass(self):
        self.row('facts')['status'] = 'unknown'
        self.row('facts')['evidence'] = []
        self.assertEqual(self.score(), 'INCONCLUSIVE')

    def test_unperformed_or_failed_review_cannot_pass_even_with_all_met(self):
        for status in ('not_run', 'failed', 'unknown'):
            with self.subTest(status=status):
                self.record['review']['status'] = status
                self.assertEqual(self.score(), 'INCOMPLETE')

    def test_old_review_cannot_cover_changed_output(self):
        self.record['review']['reviewed_output_sha256'] = '0' * 64
        with self.assertRaisesRegex(ValueError, 'not reviewed'):
            self.score()

    def test_leaked_oracle_invalidates_perfect_score(self):
        self.record['input_integrity'] = 'leaked'
        self.assertEqual(self.score(), 'INVALID')

    def test_unverified_input_cannot_pass(self):
        self.record['input_integrity'] = 'unknown'
        self.assertEqual(self.score(), 'INCONCLUSIVE')

    def test_self_report_is_rejected(self):
        self.record['evaluator']['independent_of_executor'] = False
        with self.assertRaisesRegex(ValueError, 'self-report'):
            self.score()

    def test_missing_or_changed_evidence_is_rejected(self):
        (self.root / 'output.json').write_text('changed')
        with self.assertRaisesRegex(ValueError, 'missing/changed'):
            self.score()

    def test_unsupported_metrics_are_rejected(self):
        self.record['observations']['cost'] = 0
        with self.assertRaisesRegex(ValueError, 'unknown'):
            self.score()

    def test_missing_duplicate_and_unevidenced_judgments_are_rejected(self):
        original = copy.deepcopy(self.record['requirements'])
        variants = [original[:-1], original + [original[0]],
                    [dict(r, evidence=[]) for r in original]]
        for rows in variants:
            self.record['requirements'] = rows
            with self.assertRaises(ValueError):
                self.score()

    def test_not_run_has_no_score(self):
        self.record['execution_status'] = 'NOT_RUN'
        self.record['reason'] = 'No independent executor available'
        self.assertEqual(self.score(), 'NOT_RUN')


if __name__ == '__main__':
    unittest.main()
