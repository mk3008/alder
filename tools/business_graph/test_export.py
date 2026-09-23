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
    return f'''# Activity {node_id}

## Scope

true

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

- person — Question
- record — Existing context

### Procedure

1. Read and explain the question.

### Output

- record — Explanation
- person — Notification

## Result

The request is explained, so the person can decide the next action.
'''


PREAMBLE = '# Design\n\n'
OBJECTS = '# Object person\n\n## Icon\n\nusers\n\n# Object record\n\n(generic icon)\n\n'
SOURCE = PREAMBLE + OBJECTS + activity()


class ExportTests(unittest.TestCase):
    def test_object_information_is_source_only_and_validated(self):
        source = SOURCE.replace('## Icon\n\nusers', '## Icon\n\nusers\n\n## Information\n\n- Question\n- Context')
        self.assertEqual(parse_design(source), parse_design(SOURCE))
        generic = SOURCE.replace('# Object record\n\n(generic icon)',
                                 '# Object record\n\n## Icon\n\n(generic icon)\n\n## Information\n\n- Existing context')
        self.assertEqual(parse_design(generic), parse_design(SOURCE))
        for invalid in ('## Information\n\n', '## Information\n\nContext',
                        '## Information\n\n- Question\nContext'):
            with self.subTest(invalid=invalid), self.assertRaises(DesignError):
                parse_design(SOURCE.replace('## Icon\n\nusers', '## Icon\n\nusers\n\n' + invalid))
        with self.assertRaises(DesignError):
            parse_design(SOURCE.replace('## Icon\n\nusers', '## Information\n\n- Question\n\n## Icon\n\nusers'))

    def test_distinct_who_object_and_all_fields(self):
        graph = parse_design(SOURCE)
        nodes = {node['id']: node for node in graph['nodes']}
        self.assertEqual(nodes['read'], {
            'id': 'read', 'type': 'business', 'name': 'read', 'scope': True,
            'why': 'Determine the next action.',
            'when': 'A request arrives.', 'who': 'Analyst', 'where': 'Not specified.',
            'result': 'The request is explained, so the person can decide the next action.',
        })
        self.assertEqual(nodes['record']['icon'], 'box')
        self.assertEqual(nodes['person']['type'], 'object')
        self.assertEqual({(r['kind'], r['from'], r['to'], r['label']) for r in graph['relations']}, {
            ('input', 'person', 'read', 'Question'),
            ('input', 'record', 'read', 'Existing context'),
            ('output', 'read', 'record', 'Explanation'),
            ('output', 'read', 'person', 'Notification'),
        })

    def test_result_is_required_prose_in_source_and_graph(self):
        graph = parse_design(SOURCE)
        business = next(n for n in graph['nodes'] if n['type'] == 'business')
        original = business['result']
        self.assertIn('decide the next action', render(graph))
        for invalid in (SOURCE.replace('## Result\n\n' + original, ''),
                        SOURCE.replace(original, '   '),
                        SOURCE.replace('## Result\n\n' + original, '').replace('## How', '## Result\n\n' + original + '\n\n## How')):
            with self.subTest(source=invalid), self.assertRaises(DesignError):
                parse_design(invalid)
        for invalid in (None, '', 1, ['next action']):
            candidate = copy.deepcopy(graph)
            target = next(n for n in candidate['nodes'] if n['type'] == 'business')
            if invalid is None:
                del target['result']
            else:
                target['result'] = invalid
            with self.subTest(graph=invalid), self.assertRaises(DesignError):
                validate_graph(candidate)
        revised = SOURCE.replace(original, 'The issue is resolved, so follow-up work can begin.')
        changed = parse_design(revised)
        self.assertEqual(changed['relations'], graph['relations'])
        self.assertEqual(next(n for n in changed['nodes'] if n['type'] == 'business')['result'],
                         'The issue is resolved, so follow-up work can begin.')
    def test_activity_scope_preserves_adjacent_business_and_transfers(self):
        source = SOURCE.replace('## Scope\n\ntrue', '## Scope\n\nfalse')
        graph = parse_design(source)
        node = next(n for n in graph['nodes'] if n['id'] == 'read')
        self.assertIs(node['scope'], False)
        self.assertEqual(graph['relations'], parse_design(SOURCE)['relations'])
        self.assertNotIn('scope', graph)
        graph['scope'] = 'Document boundary'
        validate_graph(graph)
        for value in ('', ' ', 'false', 'true', 0, 1, None, {}):
            invalid = copy.deepcopy(graph)
            next(n for n in invalid['nodes'] if n['id'] == 'read')['scope'] = value
            with self.subTest(value=value), self.assertRaises(DesignError):
                validate_graph(invalid)
        for bad in (SOURCE.replace('## Scope\n\ntrue\n\n', ''),
                    SOURCE.replace('## Scope\n\ntrue', '## Scope\n\n'),
                    source.replace('## Scope', '## Scope\n\nA\n\n## Scope'),
                    SOURCE.replace('## Who', '## Scope\n\nOutside\n\n## Who'),
                    SOURCE.replace('## Icon', '## Scope\n\nOutside\n\n## Icon')):
            with self.subTest(source=bad), self.assertRaises(DesignError):
                parse_design(bad)

    def test_required_boolean_scope_rejects_missing_or_coerced_values(self):
        for value in ('True', 'FALSE', '0', '1', '対象内', '"false"'):
            with self.subTest(value=value), self.assertRaises(DesignError):
                parse_design(SOURCE.replace('## Scope\n\ntrue', '## Scope\n\n' + value))
        graph = parse_design(SOURCE)
        next(n for n in graph['nodes'] if n['type'] == 'business').pop('scope')
        with self.assertRaises(DesignError):
            validate_graph(graph)
        graph = parse_design(SOURCE)
        next(n for n in graph['nodes'] if n['type'] == 'object')['scope'] = True
        with self.assertRaises(DesignError):
            validate_graph(graph)

    def test_check_design_review_exchange_and_return(self):
        graph = parse_design(DESIGN.read_text())
        work = '検査項目の設計'
        node = next(n for n in graph['nodes'] if n['id'] == work)
        self.assertEqual(node['when'], '業務設計書の合意完了')
        self.assertEqual({(r['kind'], r['from'], r['to'], r['label'])
                          for r in graph['relations']
                          if r['kind'] in ('input', 'output') and work in (r['from'], r['to'])}, {
            ('input', '業務設計書', work, '業務要件 / 期待結果'),
            ('input', 'Alder: 検査項目設計ナレッジ', work, '検査項目の導出・レビュー・追跡関係の確認観点'),
            ('input', '依頼者', work, '検査項目レビュー結果'),
            ('output', work, '検査項目', '期待結果 / レビュー状態 / 業務設計書との対応 / 検証不足'),
            ('output', work, '依頼者', '検査項目案 / レビュー依頼 / 確認事項'),
        })
        returns = [r for r in graph['relations'] if r['kind'] == 'business-exception'
                   and r['from'] == work]
        self.assertEqual(len(returns), 1)
        self.assertEqual(returns[0]['to'], '業務設計')
        self.assertIn('業務上の意味・条件・保証', returns[0]['label'])
        check_source = DESIGN.read_text().split('# Activity 検査項目の設計\n', 1)[1].split('# Activity 実装\n', 1)[0]
        procedure, exception = check_source.split('### Exception\n', 1)
        self.assertNotIn('業務上の意味・条件・保証の修正や未決事項', procedure)
        self.assertIn('業務上の意味・条件・保証の修正や未決事項', exception)
        self.assertIn('業務設計へ戻す', exception)

    def test_check_artifact_replaces_duplicate_test_plan(self):
        graph = parse_design(DESIGN.read_text())
        self.assertNotIn('テスト計画', {n['id'] for n in graph['nodes']})
        for target in ('実装',):
            edges = [r for r in graph['relations'] if r['kind'] == 'input'
                     and r['from'] == '検査項目' and r['to'] == target]
            self.assertEqual(len(edges), 1)
            self.assertIn('期待結果', edges[0]['label'])
        implementation = DESIGN.read_text().split('# Activity 実装\n', 1)[1].split('# Activity 同期漏れ検査\n', 1)[0]
        self.assertIn('コードと実行可能なテストを作成・更新する', implementation)
        self.assertNotIn('検査項目に記録', implementation)
        self.assertNotIn('判断記録へ残す', implementation)
        self.assertFalse(next(n for n in graph['nodes'] if n['id'] == '実装')['scope'])
        graph_edges = {(r['kind'], r['from'], r['to']) for r in graph['relations']}
        self.assertEqual({r['to'] for r in graph['relations']
                          if r['kind'] == 'output' and r['from'] == '実装'}, {'コード', 'テスト'})
        self.assertNotIn(('output', '実装', '検査項目'), graph_edges)
        self.assertNotIn(('output', '実装', '判断記録'), graph_edges)
        self.assertNotIn(('input', '検査項目', 'テスト・検証'), graph_edges)
        self.assertEqual({r['to'] for r in graph['relations']
                          if r['kind'] == 'business-exception' and r['from'] == '実装'},
                         {'業務設計'})

    def test_system_requirements_handoff(self):
        graph = parse_design(DESIGN.read_text())
        edges = {(r['kind'], r['from'], r['to'], r['label']) for r in graph['relations']}
        self.assertEqual({r for r in edges if 'システム設計' in r[1:3]}, {
            ('input', '業務設計書', 'システム設計', '業務要件'),
            ('output', 'システム設計', 'システム要件書', '技術要件'),
        })
        self.assertIn(('input', '業務設計書', '実装', '業務要件'), edges)
        self.assertIn(('input', 'システム要件書', '実装', '技術要件'), edges)

    def test_visible_name_rename_updates_identity_and_connections(self):
        with self.assertRaisesRegex(DesignError, 'dangling relation'):
            parse_design(SOURCE.replace('# Object person', '# Object 依頼者'))
        renamed = parse_design(SOURCE.replace('# Activity read', '# Activity 依頼確認')
                               .replace('# Object person', '# Object 依頼者')
                               .replace('person —', '依頼者 —'))
        nodes = {n['id']: n for n in renamed['nodes']}
        self.assertEqual(nodes['依頼確認']['name'], '依頼確認')
        self.assertEqual(nodes['依頼者']['name'], '依頼者')
        self.assertIn({'kind': 'input', 'from': '依頼者', 'to': '依頼確認',
                       'label': 'Question'}, renamed['relations'])
        self.assertNotIn('what', nodes['依頼確認'])

    def test_human_source_needs_no_machine_annotations(self):
        self.assertNotIn('<!--', SOURCE)
        graph = parse_design(SOURCE)
        self.assertTrue(all(n['id'] == n['name'] for n in graph['nodes']))
        with self.assertRaises(DesignError):
            parse_design(SOURCE.replace('## Who', '<!-- alder-id: hidden -->\n\n## Who'))

    def test_visible_japanese_names_spaces_and_colons(self):
        source = SOURCE.replace('# Object person', '# Object Alder: 業務ナレッジ')
        source = source.replace('person —', 'Alder: 業務ナレッジ —')
        source = source.replace('# Activity read', '# Activity 業務 設計')
        source += '\n# Graph exceptions\n\n- object-exception record → Alder: 業務ナレッジ — 参照\n'
        graph = parse_design(source)
        self.assertIn({'kind': 'input', 'from': 'Alder: 業務ナレッジ',
                       'to': '業務 設計', 'label': 'Question'}, graph['relations'])
        self.assertIn({'kind': 'object-exception', 'from': 'record',
                       'to': 'Alder: 業務ナレッジ', 'label': '参照'}, graph['relations'])

    def test_visible_icon_edit_preserves_correlations(self):
        original = parse_design(SOURCE)
        revised = parse_design(SOURCE.replace('users', 'user-round'))
        self.assertEqual(original['relations'], revised['relations'])
        self.assertEqual([n['id'] for n in original['nodes']], [n['id'] for n in revised['nodes']])
        self.assertEqual(next(n for n in revised['nodes'] if n['id'] == 'person')['icon'], 'user-round')

    def test_reserved_name_delimiters_and_hidden_metadata_fail(self):
        for name in ('bad — name', 'bad → name'):
            with self.subTest(name=name), self.assertRaises(DesignError):
                parse_design(SOURCE.replace('# Activity read', '# Activity ' + name))
        for hidden in ('<!-- alder-business-graph: 1 -->', '<!-- fingerprint: abc -->'):
            with self.subTest(hidden=hidden), self.assertRaises(DesignError):
                parse_design(PREAMBLE + hidden + '\n' + OBJECTS + activity())

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
        graph = parse_design(SOURCE.replace('- record — Existing context', '- record — Existing context\n- record — History'))
        self.assertEqual(len(graph['relations']), 5)

    def test_explicit_exception_kinds(self):
        source = SOURCE + '\n' + activity('approve') + '''
# Graph exceptions

- business-exception approve → read — Return if unclear
- object-exception record → person — Exceptional association
'''
        graph = parse_design(source)
        self.assertIn({'kind': 'business-exception', 'from': 'approve', 'to': 'read', 'label': 'Return if unclear'}, graph['relations'])
        self.assertIn({'kind': 'object-exception', 'from': 'record', 'to': 'person', 'label': 'Exceptional association'}, graph['relations'])

    def test_exception_when_projects_only_as_incoming_exception(self):
        source = SOURCE.replace('## Who', '## Exception When\n\n- approve — Return on ambiguity\n\n## Who')
        graph = parse_design(source + '\n' + activity('approve'))
        node = next(n for n in graph['nodes'] if n['id'] == 'read')
        self.assertEqual(node['when'], 'A request arrives.')
        self.assertNotIn('exception_when', node)
        self.assertIn({'kind': 'business-exception', 'from': 'approve', 'to': 'read',
                       'label': 'Return on ambiguity'}, graph['relations'])
        global_source = SOURCE + '\n' + activity('approve') + '\n# Graph exceptions\n\n- business-exception approve → read — Return on ambiguity\n'
        self.assertEqual(graph, parse_design(global_source))

    def test_how_exception_is_optional_prose_not_an_extra_relation(self):
        exception = '### Exception\n\n- If the answer is unclear, return to read.\n\n'
        source = SOURCE.replace('### Output', exception + '### Output')
        self.assertEqual(parse_design(SOURCE), parse_design(source))
        self.assertNotIn('exception', next(n for n in parse_design(source)['nodes'] if n['type'] == 'business'))
        for bad in (SOURCE.replace('### Output', '### Exception\n\n### Output'),
                    SOURCE.replace('### Input', exception + '### Input'),
                    SOURCE.replace('### Output', exception + exception + '### Output'),
                    SOURCE.replace('### Output', '### Output\n\n- record — Explanation\n\n' + exception)):
            with self.subTest(bad=bad), self.assertRaises(DesignError):
                parse_design(bad)

    def test_exception_when_rejects_invalid_or_duplicate_declarations(self):
        for body in ('', '- absent — Missing source', '- person — Wrong endpoint',
                     '- read — ', 'Unstructured trigger', '- read — Repeat\n- read — Repeat'):
            with self.subTest(body=body), self.assertRaises(DesignError):
                parse_design(SOURCE.replace('## Who', '## Exception When\n\n' + body + '\n\n## Who'))
        source = SOURCE.replace('## Who', '## Exception When\n\n- read — Repeat\n\n## Who')
        with self.assertRaisesRegex(DesignError, 'duplicate relation'):
            parse_design(source + '\n# Graph exceptions\n\n- business-exception read → read — Repeat\n')
        with self.assertRaises(DesignError):
            parse_design(SOURCE.replace('## Where', '## Exception When\n\n- read — Return\n\n## Where'))

    def test_scope_is_preserved_once(self):
        graph = parse_design(SOURCE + '\n# Scope\n\nCurrent work only.\n\nNo future work.\n')
        self.assertEqual(graph['scope'], 'Current work only.\n\nNo future work.')
        self.assertTrue(all(node['scope'] is True for node in graph['nodes'] if node['type'] == 'business'))
        self.assertTrue(all('scope' not in node for node in graph['nodes'] if node['type'] == 'object'))

    def test_procedure_excluded_and_fenced_headings_not_nodes(self):
        revised = SOURCE.replace('1. Read and explain the question.',
                                 'A different procedure.\n\n```markdown\n# Activity fake — Ignored\n## What\ntext\n```')
        self.assertEqual(parse_design(SOURCE), parse_design(revised))
        self.assertNotIn('procedure', render(parse_design(revised)).lower())

    def test_determinism_reordering_line_endings_and_unicode(self):
        source = SOURCE + '\n' + activity('approve', '担当者')
        reordered = PREAMBLE + activity('approve', '担当者') + '\n' + activity() + '\n' + OBJECTS
        reordered = reordered.replace('- person — Question\n- record — Existing context',
                                      '- record — Existing context\n- person — Question')
        expected = render(parse_design(source))
        self.assertEqual(expected, render(parse_design(source)))
        self.assertEqual(expected, render(parse_design(reordered.replace('\n', '\r\n'))))
        self.assertIn('担当者', expected)
        self.assertTrue(expected.endswith('\n'))

    def test_exception_order_does_not_change_bytes(self):
        a = '- object-exception record → person — A'
        b = '- object-exception person → record — B'
        prefix = SOURCE + '\n# Graph exceptions\n\n'
        self.assertEqual(render(parse_design(prefix + a + '\n' + b)),
                         render(parse_design(prefix + b + '\n' + a)))

    def test_duplicate_ids_across_and_within_node_types(self):
        for extra in (activity(), '# Object read\n\n(generic icon)\n',
                      '# Object record\n\n(generic icon)\n'):
            with self.subTest(extra=extra), self.assertRaisesRegex(DesignError, 'duplicate node ID'):
                parse_design(SOURCE + '\n' + extra)

    def test_missing_reference_fails(self):
        with self.assertRaisesRegex(DesignError, 'dangling relation'):
            parse_design(SOURCE.replace('record —', 'missing —'))

    def test_all_relation_endpoint_combinations(self):
        base = parse_design(SOURCE)
        base['nodes'].append(dict(next(n for n in base['nodes'] if n['id'] == 'read'), id='other-business', name='other-business'))
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
        source = SOURCE.replace('- person — Question\n- record — Existing context', '(none)')
        self.assertEqual(len(parse_design(source)['relations']), 2)
        with self.assertRaises(DesignError):
            parse_design(source.replace('(none)', ''))

    def test_malformed_source_is_not_partially_exported(self):
        bad = [SOURCE.replace('# Design', '# Activity Wrong title'),
               SOURCE.replace('## Why', '## Purpose'),
               SOURCE.replace('## Why', '## What'),
               SOURCE.replace('## When\n\nA request arrives.', ''),
               SOURCE.replace('## How\n', '## How\nUnprojected prose\n'),
               SOURCE.replace('- person — Question', 'The person asks a question.'),
               SOURCE.replace('- person — Question', '- person — '),
               SOURCE + '\n# Unknown\n\nA hidden activity.\n',
               SOURCE + '\n# Graph exceptions\n\n- business-exception read → read — \n',
               SOURCE + '\n```\nUnclosed fence',
               SOURCE.replace('## Why\n\nDetermine the next action.', '## Why\n\nDetermine the next action.\n\n### Extra\nHidden'),
               SOURCE + '\n# Scope\n\nA\n\n# Scope\n\nB\n']
        for source in bad:
            with self.subTest(source=source), self.assertRaises(DesignError):
                parse_design(source)

    def test_business_design_io_matches_human_review(self):
        graph = parse_design(DESIGN.read_text())
        work = '業務設計'
        actual = {(r['kind'], r['from'], r['to'], r['label']) for r in graph['relations']
                  if r['kind'] in ('input', 'output') and work in (r['from'], r['to'])}
        self.assertEqual(actual, {
            ('input', '依頼者', work, 'システム要件 / レビュー結果'),
            ('input', 'Alder: 業務相関ナレッジ', work, '状態遷移・前後業務の確認観点'),
            ('input', 'Alder: 業務ナレッジ', work, '業務手順・条件・考慮事項の確認観点'),
            ('output', work, '業務設計書', '業務要件 / 期待結果 / 未決事項'),
            ('output', work, '判断記録', '判断内容 / 結果'),
            ('output', work, '依頼者', '業務設計案 / レビュー依頼 / 確認事項'),
        })
        names = {n['id']: n['name'] for n in graph['nodes']}
        self.assertEqual(names['Alder: 業務相関ナレッジ'], 'Alder: 業務相関ナレッジ')
        self.assertEqual(names['Alder: 業務ナレッジ'], 'Alder: 業務ナレッジ')
        self.assertEqual({r['from'] for r in graph['relations']
                          if r['kind'] == 'business-exception' and r['to'] == work},
                         {'実装', '検査項目の設計'})

    def test_hidden_markdown_link_definition_is_rejected(self):
        with self.assertRaises(DesignError):
            parse_design(SOURCE.replace('- person — Question', '- [person]: Question'))

    def test_self_design_projection_and_regeneration(self):
        graph = parse_design(DESIGN.read_text())
        self.assertEqual(render(graph), EXAMPLE.read_text())
        nodes = {n['id']: n for n in graph['nodes']}
        self.assertEqual({n['id'] for n in nodes.values() if n['type'] == 'business'}, {
            '業務設計', '検査項目の設計', 'システム設計', '実装',
            '同期漏れ検査', '業務グラフ出力',
        })
        self.assertEqual({n['id'] for n in nodes.values()
                          if n['type'] == 'business' and not n['scope']},
                         {'システム設計', '実装'})
        self.assertEqual(len(nodes), 19)
        self.assertEqual(len(graph['relations']), 29)
        self.assertFalse({'研究の証拠と採否判断', 'プルリクエスト・リリース',
                          '検証結果', 'レビュー結果',
                          'Alder: 業務設計品質レビュー知識'} & nodes.keys())
        linked = {r[endpoint] for r in graph['relations'] for endpoint in ('from', 'to')}
        self.assertTrue({n['id'] for n in nodes.values() if n['type'] == 'object'} <= linked)
        self.assertIs(nodes['システム設計']['scope'], False)
        self.assertEqual(nodes['システム設計']['when'], '技術検討の依頼')
        self.assertTrue(all('scope' in n for n in nodes.values() if n['type'] == 'business'))
        self.assertEqual({r['from'] for r in graph['relations']
                          if r['kind'] == 'input' and r['to'] == 'システム設計'},
                         {'業務設計書'})
        self.assertFalse(any(r['kind'] == 'business-exception' and r['to'] == 'システム設計'
                             for r in graph['relations']))
        self.assertEqual(nodes['依頼者']['type'], 'object')
        self.assertEqual('業務設計者', nodes['業務設計']['who'])
        self.assertEqual('目的・変更要求を受領したとき', nodes['業務設計']['when'])
        self.assertEqual('規定なし', nodes['業務設計']['where'])
        self.assertIn('責任を持つ人間の業務設計者が意味を確認する', DESIGN.read_text())
        self.assertEqual('業務設計書・検査項目・テストの対応関係に同期漏れの疑いが生じたとき',
                         nodes['同期漏れ検査']['when'])
        self.assertIn('疑いが生じたときだけ使う任意の診断', DESIGN.read_text())
        self.assertFalse(any(r['kind'] == 'object-exception' for r in graph['relations']))
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
            source.write_text(SOURCE.replace('record —', 'missing —'))
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
