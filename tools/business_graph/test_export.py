"""Behavioral/contract regressions for Issue #79. No third-party dependencies."""

import copy
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

from export import DesignError, parse_design, render, validate_graph

ROOT = Path(__file__).resolve().parents[2]
CLI = ROOT / 'tools/business_graph/export.py'
DESIGN = ROOT / 'business-design/alder/README.md'
EXAMPLE = ROOT / 'business-design/alder/graph.generated.json'


def activity(node_id='read', who='Analyst'):
    return f'''# Activity Read a request

<!-- alder-id: {node_id} -->

## Why

Determine the next action.

## When

A request arrives.

## Who

{who}

## Where

Not specified.

## How

### Input

- [person] — Question
- [record] — Existing context

### Procedure

1. Read and explain the question.

### Output

- [record] — Explanation
- [person] — Notification
'''


PREAMBLE = '# Design\n\n<!-- alder-business-graph: 1 -->\n\n'
OBJECTS = '# Object External person\n\n<!-- alder-id: person -->\n\n## Icon\n\nusers\n\n# Object Record\n\n<!-- alder-id: record -->\n\n(generic icon)\n\n'
SOURCE = PREAMBLE + OBJECTS + activity()


class ExportTests(unittest.TestCase):
    def test_distinct_who_object_and_all_fields(self):
        graph = parse_design(SOURCE)
        nodes = {node['id']: node for node in graph['nodes']}
        self.assertEqual(nodes['read'], {
            'id': 'read', 'type': 'business', 'name': 'Read a request',
            'why': 'Determine the next action.',
            'when': 'A request arrives.', 'who': 'Analyst', 'where': 'Not specified.',
        })
        self.assertEqual(nodes['record']['icon'], 'box')
        self.assertEqual(nodes['person']['type'], 'object')
        self.assertEqual({(r['kind'], r['from'], r['to'], r['label']) for r in graph['relations']}, {
            ('input', 'person', 'read', 'Question'),
            ('input', 'record', 'read', 'Existing context'),
            ('output', 'read', 'record', 'Explanation'),
            ('output', 'read', 'person', 'Notification'),
        })

    def test_display_rename_preserves_identity_and_connections(self):
        original = parse_design(SOURCE)
        renamed = parse_design(SOURCE.replace('# Activity Read a request', '# Activity 依頼確認')
                               .replace('# Object External person', '# Object 依頼者'))
        self.assertEqual(original['relations'], renamed['relations'])
        self.assertEqual([n['id'] for n in original['nodes']], [n['id'] for n in renamed['nodes']])
        nodes = {n['id']: n for n in renamed['nodes']}
        self.assertEqual(nodes['read']['name'], '依頼確認')
        self.assertEqual(nodes['person']['name'], '依頼者')
        self.assertNotIn('what', nodes['read'])

    def test_identity_annotation_is_required_and_unambiguous(self):
        for node_id in ('read', 'person', 'record'):
            marker = f'<!-- alder-id: {node_id} -->'
            for replacement in ('', '<!-- alder-id: Bad ID -->',
                                marker + '\n' + marker, marker + ' trailing text'):
                with self.subTest(node_id=node_id, replacement=replacement), self.assertRaises(DesignError):
                    parse_design(SOURCE.replace(marker, replacement))
        old_heading = SOURCE.replace('# Activity Read a request\n\n<!-- alder-id: read -->',
                                     '# Activity read — Read a request')
        with self.assertRaises(DesignError):
            parse_design(old_heading)

    def test_duplicate_what_is_rejected_in_source_and_json(self):
        with self.assertRaises(DesignError):
            parse_design(SOURCE.replace('## Why', '## What\n\nRead a request\n\n## Why'))
        graph = parse_design(SOURCE)
        next(n for n in graph['nodes'] if n['type'] == 'business')['what'] = 'Read a request'
        with self.assertRaises(DesignError):
            validate_graph(graph)

    def test_shared_role_can_filter_multiple_activities(self):
        graph = parse_design(SOURCE + '\n' + activity('approve'))
        self.assertEqual({n['id'] for n in graph['nodes'] if n.get('who') == 'Analyst'},
                         {'read', 'approve'})

    def test_many_inputs_outputs_and_shared_object_labels(self):
        other = activity('approve').replace('Existing context', 'Evidence for approval')
        graph = parse_design(SOURCE + '\n' + other)
        self.assertEqual(len(graph['relations']), 8)
        self.assertEqual([(r['to'], r['label']) for r in graph['relations'] if r['from'] == 'record'],
                         [('approve', 'Evidence for approval'), ('read', 'Existing context')])
        # Same business may read distinct content from the same object, too.
        graph = parse_design(SOURCE.replace('- [record] — Existing context', '- [record] — Existing context\n- [record] — History'))
        self.assertEqual(len(graph['relations']), 5)

    def test_explicit_exception_kinds(self):
        source = SOURCE + '\n' + activity('approve') + '''
# Graph exceptions

- business-exception approve -> read: Return if unclear
- object-exception record -> person: Exceptional association
'''
        graph = parse_design(source)
        self.assertIn({'kind': 'business-exception', 'from': 'approve', 'to': 'read', 'label': 'Return if unclear'}, graph['relations'])
        self.assertIn({'kind': 'object-exception', 'from': 'record', 'to': 'person', 'label': 'Exceptional association'}, graph['relations'])

    def test_scope_is_preserved_once(self):
        graph = parse_design(SOURCE + '\n# Scope\n\nCurrent work only.\n\nNo future work.\n')
        self.assertEqual(graph['scope'], 'Current work only.\n\nNo future work.')
        self.assertTrue(all('scope' not in node for node in graph['nodes']))

    def test_procedure_excluded_and_fenced_headings_not_nodes(self):
        revised = SOURCE.replace('1. Read and explain the question.',
                                 'A different procedure.\n\n```markdown\n# Activity fake — Ignored\n## What\ntext\n```')
        self.assertEqual(parse_design(SOURCE), parse_design(revised))
        self.assertNotIn('procedure', render(parse_design(revised)).lower())

    def test_determinism_reordering_line_endings_and_unicode(self):
        source = SOURCE + '\n' + activity('approve', '担当者')
        reordered = PREAMBLE + activity('approve', '担当者') + '\n' + activity() + '\n' + OBJECTS
        reordered = reordered.replace('- [person] — Question\n- [record] — Existing context',
                                      '- [record] — Existing context\n- [person] — Question')
        expected = render(parse_design(source))
        self.assertEqual(expected, render(parse_design(source)))
        self.assertEqual(expected, render(parse_design(reordered.replace('\n', '\r\n'))))
        self.assertIn('担当者', expected)
        self.assertTrue(expected.endswith('\n'))

    def test_exception_order_does_not_change_bytes(self):
        a = '- object-exception record -> person: A'
        b = '- object-exception person -> record: B'
        prefix = SOURCE + '\n# Graph exceptions\n\n'
        self.assertEqual(render(parse_design(prefix + a + '\n' + b)),
                         render(parse_design(prefix + b + '\n' + a)))

    def test_duplicate_ids_across_and_within_node_types(self):
        for extra in (activity(), '# Object Collision\n\n<!-- alder-id: read -->\n\n(generic icon)\n',
                      '# Object Collision\n\n<!-- alder-id: record -->\n\n(generic icon)\n'):
            with self.subTest(extra=extra), self.assertRaisesRegex(DesignError, 'duplicate node ID'):
                parse_design(SOURCE + '\n' + extra)

    def test_missing_reference_fails(self):
        with self.assertRaisesRegex(DesignError, 'dangling relation'):
            parse_design(SOURCE.replace('[record]', '[missing]'))

    def test_all_relation_endpoint_combinations(self):
        base = parse_design(SOURCE)
        base['nodes'].append(dict(next(n for n in base['nodes'] if n['id'] == 'read'), id='other-business'))
        allowed = {'input': ('person', 'read'), 'output': ('read', 'person'),
                   'business-exception': ('read', 'other-business'), 'object-exception': ('person', 'record')}
        pairs = [('person', 'read'), ('read', 'person'), ('read', 'other-business'), ('person', 'record')]
        for kind, expected in allowed.items():
            for source, target in pairs:
                graph = copy.deepcopy(base)
                graph['relations'] = [{'kind': kind, 'from': source, 'to': target, 'label': 'Meaning'}]
                with self.subTest(kind=kind, source=source, target=target):
                    if (source, target) == expected:
                        validate_graph(graph)
                    else:
                        with self.assertRaisesRegex(DesignError, 'endpoints'):
                            validate_graph(graph)

    def test_every_relation_requires_nonempty_label(self):
        for kind in ('input', 'output', 'business-exception', 'object-exception'):
            for label in ('', '  ', None, 3, []):
                graph = parse_design(SOURCE)
                graph['relations'] = [{'kind': kind, 'from': 'person', 'to': 'record', 'label': label}]
                with self.subTest(kind=kind, label=label), self.assertRaisesRegex(DesignError, 'label'):
                    validate_graph(graph)

    def test_invalid_shapes_versions_and_unknown_fields(self):
        base = parse_design(SOURCE)
        invalid = [None, [], {}, dict(base, version=True), dict(base, version=2),
                   dict(base, procedure='hidden policy'), dict(base, nodes=[]),
                   dict(base, nodes={}), dict(base, relations={}), dict(base, scope=' ')]
        for key, value in [('type', 'group'), ('id', 'Bad ID'), ('who', []), ('why', ''), ('procedure', 'hidden')]:
            graph = copy.deepcopy(base)
            next(n for n in graph['nodes'] if n['type'] == 'business')[key] = value
            invalid.append(graph)
        for key, value in [('kind', 'data'), ('from', 'absent'), ('to', 'absent'), ('layout', {})]:
            graph = copy.deepcopy(base)
            graph['relations'][0][key] = value
            invalid.append(graph)
        for graph in invalid:
            with self.subTest(graph=graph), self.assertRaises(DesignError):
                validate_graph(graph)

    def test_duplicate_relations_rejected(self):
        graph = parse_design(SOURCE)
        graph['relations'].append(dict(graph['relations'][0]))
        with self.assertRaisesRegex(DesignError, 'duplicate relation'):
            validate_graph(graph)

    def test_icon_fallback_and_invalid_explicit_icons(self):
        for contents in ('## Icon\n\n', '## Icon\n\nFile Text', '## Icon\n\nfile_text'):
            with self.subTest(contents=contents), self.assertRaises(DesignError):
                parse_design(SOURCE.replace('(generic icon)', contents))
        graph = parse_design(SOURCE)
        del graph['nodes'][0]['icon']
        with self.assertRaises(DesignError):
            validate_graph(graph)

    def test_empty_io_must_be_explicit(self):
        source = SOURCE.replace('- [person] — Question\n- [record] — Existing context', '(none)')
        self.assertEqual(len(parse_design(source)['relations']), 2)
        with self.assertRaises(DesignError):
            parse_design(source.replace('(none)', ''))

    def test_malformed_source_is_not_partially_exported(self):
        bad = [SOURCE.replace('<!-- alder-business-graph: 1 -->', ''),
               SOURCE.replace('<!-- alder-business-graph: 1 -->', '<!-- alder-business-graph: 2 -->'),
               SOURCE.replace('## Why', '## Purpose'),
               SOURCE.replace('## Why', '## What'),
               SOURCE.replace('## When\n\nA request arrives.', ''),
               SOURCE.replace('## How\n', '## How\nUnprojected prose\n'),
               SOURCE.replace('- [person] — Question', 'The person asks a question.'),
               SOURCE.replace('- [person] — Question', '- [person] — '),
               SOURCE + '\n# Unknown\n\nA hidden activity.\n',
               SOURCE + '\n# Graph exceptions\n\n- business-exception read -> read: \n',
               SOURCE + '\n```\nUnclosed fence',
               SOURCE.replace('## Why\n\nDetermine the next action.', '## Why\n\nDetermine the next action.\n\n### Extra\nHidden'),
               SOURCE + '\n# Scope\n\nA\n\n# Scope\n\nB\n']
        for source in bad:
            with self.subTest(source=source), self.assertRaises(DesignError):
                parse_design(source)

    def test_business_design_io_matches_human_review(self):
        graph = parse_design(DESIGN.read_text())
        work = 'business-design-work'
        actual = {(r['kind'], r['from'], r['to'], r['label']) for r in graph['relations']
                  if r['kind'] in ('input', 'output') and work in (r['from'], r['to'])}
        self.assertEqual(actual, {
            ('input', 'requester', work, 'システム要件 / フィードバック'),
            ('input', 'business-correlation-knowledge', work, '状態遷移フィードバック'),
            ('input', 'business-knowledge', work, '考慮漏れフィードバック'),
            ('output', work, 'business-design', 'スコープ、業務手順、業務相関'),
            ('output', work, 'decisions', '判断 / 結果'),
        })
        names = {n['id']: n['name'] for n in graph['nodes']}
        self.assertEqual(names['business-correlation-knowledge'], 'Alder: 業務相関ナレッジ')
        self.assertEqual(names['business-knowledge'], 'Alder: 業務ナレッジ')
        self.assertEqual({r['from'] for r in graph['relations']
                          if r['kind'] == 'business-exception' and r['to'] == work},
                         {'implementation', 'fresh-review'})

    def test_hidden_markdown_link_definition_is_rejected(self):
        with self.assertRaises(DesignError):
            parse_design(SOURCE.replace('- [person] — Question', '- [person]: Question'))

    def test_self_design_projection_and_regeneration(self):
        graph = parse_design(DESIGN.read_text())
        self.assertEqual(render(graph), EXAMPLE.read_text())
        nodes = {n['id']: n for n in graph['nodes']}
        self.assertEqual({n['id'] for n in nodes.values() if n['type'] == 'business'}, {
            'business-design-work', 'system-design', 'check-design', 'test-design', 'implementation',
            'drift-inspection', 'verification-work', 'fresh-review', 'research-evaluation',
            'delivery-work', 'graph-export',
        })
        self.assertEqual(nodes['requester']['type'], 'object')
        self.assertEqual('業務設計者', nodes['business-design-work']['who'])
        self.assertIn('責任を持つ人間の業務設計者が意味を確認する', DESIGN.read_text())
        self.assertIn('任意試行の利用時', nodes['drift-inspection']['when'])
        self.assertIn({'kind': 'object-exception', 'from': 'tests', 'to': 'code',
                       'label': 'テストは実行によってコードを検証する。Checkとコードの位置対応を維持するものではない'}, graph['relations'])
        self.assertTrue(any(r['kind'] == 'business-exception' for r in graph['relations']))
        self.assertTrue(all('procedure' not in node for node in nodes.values()))

    def run_cli(self, *args, cwd=None):
        return subprocess.run([sys.executable, str(CLI), *map(str, args)], cwd=cwd,
                              text=True, encoding='utf-8', capture_output=True)

    def test_cli_stdout_file_and_different_working_directory(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / 'graph.json'
            stdout = self.run_cli(DESIGN, cwd=directory)
            self.assertEqual(stdout.returncode, 0, stdout.stderr)
            self.assertEqual(stdout.stdout, EXAMPLE.read_text())
            saved = self.run_cli(DESIGN, '-o', output, cwd=directory)
            self.assertEqual(saved.returncode, 0, saved.stderr)
            self.assertEqual(saved.stdout, '')
            self.assertEqual(output.read_text(), stdout.stdout)

    def test_cli_invalid_input_preserves_existing_output(self):
        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory) / 'design.md'
            output = Path(directory) / 'graph.json'
            source.write_text(SOURCE.replace('[record]', '[missing]'))
            output.write_text('previous valid result')
            result = self.run_cli(source, '-o', output)
            self.assertEqual(result.returncode, 2)
            self.assertEqual(result.stdout, '')
            self.assertIn('dangling relation', result.stderr)
            self.assertEqual(output.read_text(), 'previous valid result')
            self.assertEqual({p.name for p in Path(directory).iterdir()}, {'design.md', 'graph.json'})

    def test_cli_cannot_overwrite_source_or_alias(self):
        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory) / 'design.md'
            source.write_text(SOURCE)
            symlink = Path(directory) / 'symbolic.md'
            symlink.symlink_to(source)
            hardlink = Path(directory) / 'hard.md'
            hardlink.hardlink_to(source)
            for output in (source, symlink, hardlink):
                result = self.run_cli(source, '-o', output)
                self.assertEqual(result.returncode, 2, result.stderr)
                self.assertIn('must not overwrite', result.stderr)
                self.assertEqual(source.read_text(), SOURCE)

    def test_cli_io_and_encoding_errors_are_diagnostics(self):
        with tempfile.TemporaryDirectory() as directory:
            missing = Path(directory) / 'missing.md'
            invalid = Path(directory) / 'invalid.md'
            invalid.write_bytes(b'\xff')
            for args in ((missing,), (invalid,), (DESIGN, '-o', missing / 'graph.json')):
                result = self.run_cli(*args)
                self.assertEqual(result.returncode, 2)
                self.assertEqual(result.stdout, '')
                self.assertIn('business-graph:', result.stderr)
                self.assertNotIn('Traceback', result.stderr)


if __name__ == '__main__':
    unittest.main()
