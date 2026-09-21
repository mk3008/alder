"""Reproducible bounded experiment; all mutations stay in temporary directories."""
import argparse
from copy import deepcopy
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
from drift import items, fingerprint, check_fingerprint, detect, read_metadata

ROOT = Path(__file__).resolve().parent
FIXTURE = ROOT / 'fixture'
TESTS = {name: f'test_product.BookingTests.test_{name}' for name in ('limit', 'cancel', 'owner')}
RUN_TESTS = '''import io,json,unittest
suite=unittest.defaultTestLoader.discover('.')
def ids(s):
    for x in s:
        if isinstance(x,unittest.TestSuite): yield from ids(x)
        else: yield x.id()
inventory=list(ids(suite))
r=unittest.TextTestRunner(stream=io.StringIO()).run(suite)
print(json.dumps({'ids':inventory,'run':r.testsRun,'failures':len(r.failures),'errors':len(r.errors)}))
'''


def replace(path, before, after):
    text = path.read_text()
    assert before in text, (path, before)
    path.write_text(text.replace(before, after))


def leaves(value, prefix=()):
    if isinstance(value, dict):
        return {key: leaf for name, child in value.items()
                for key, leaf in leaves(child, prefix + (name,)).items()}
    return {prefix: value}


def edited_fields(before, after):
    a, b = leaves(before), leaves(after)
    return sum(a.get(key) != b.get(key) for key in a.keys() | b.keys())


def run_case(name, mutate, expected_checks=(), expected_tests=(), expected_candidates=(),
             expected_product_failures=0):
    with tempfile.TemporaryDirectory() as tmp:
        p = Path(tmp)
        shutil.copytree(FIXTURE, p, dirs_exist_ok=True)
        meta = read_metadata(p / 'trace.json')
        original = deepcopy(meta)
        mutate(p, meta)
        (p / 'trace.json').write_text(json.dumps(meta, indent=2) + '\n')
        product = json.loads(subprocess.check_output([sys.executable, '-c', RUN_TESTS], cwd=p, text=True))
        assert product['errors'] == 0 and product['failures'] == expected_product_failures, (name, product)
        b, c = items(p / 'business-design.md'), items(p / 'checks.md')
        result = detect(b, c, meta, set(product['ids']))
        assert set(result['stale_checks']) == set(expected_checks), (name, result)
        assert set(result['stale_tests']) == set(expected_tests), (name, result)
        assert set(result['mapping_candidates']) == set(expected_candidates), (name, result)
        inventory = p / 'inventory.json'
        inventory.write_text(json.dumps(product['ids']))
        cli = subprocess.run([sys.executable, str(ROOT / 'drift.py'),
                              str(p / 'business-design.md'), str(p / 'checks.md'),
                              str(p / 'trace.json'), str(inventory)], text=True, capture_output=True)
        assert cli.returncode == (1 if any(result.values()) else 0), (name, cli.stderr)
        assert json.loads(cli.stdout) == result
        return {'case': name, 'product_tests': product, 'detection': result,
                'metadata_leaf_edits': edited_fields(original, meta),
                'test_pin_leaf_edits': edited_fields(original['test_checks'], meta['test_checks']),
                'metadata_bytes': (p / 'trace.json').stat().st_size}


def business_change(p, meta):
    replace(p / 'business-design.md', '10 participants; 11', '20 participants; 21')


def check_update(p, meta):
    business_change(p, meta)
    replace(p / 'checks.md', '10 participants and reject 11', '20 participants and reject 21')
    meta['check_sources']['CHECK-01']['BD-01'] = fingerprint(items(p / 'business-design.md')['BD-01'])


def acknowledge_test(p, meta):
    meta['test_checks'][TESTS['limit']]['CHECK-01'] = check_fingerprint(
        items(p / 'checks.md')['CHECK-01'])


def complete_update(p, meta):
    check_update(p, meta)
    replace(p / 'test_product.py', 'accepts(10)', 'accepts(20)')
    replace(p / 'test_product.py', 'accepts(11)', 'accepts(21)')
    replace(p / 'product.py', '<= 10', '<= 20')
    acknowledge_test(p, meta)


def cosmetic_reconfirm(p, meta):
    replace(p / 'business-design.md', 'A booking accepts', 'A reservation accepts')
    meta['check_sources']['CHECK-01']['BD-01'] = fingerprint(items(p / 'business-design.md')['BD-01'])


def reorder(p, meta):
    path = p / 'business-design.md'
    sections = items(path)
    path.write_text('# Synthetic booking design — not approved meeting-room policy\n\n' +
                    ''.join(f'## {key}\n{sections[key]}' for key in reversed(sections)))


def rename_check(p, meta):
    replace(p / 'checks.md', 'CHECK-01', 'CHECK-11')
    meta['check_sources']['CHECK-11'] = meta['check_sources'].pop('CHECK-01')
    edge = meta['test_checks'][TESTS['limit']]
    edge['CHECK-11'] = edge.pop('CHECK-01')


def add_check(p, meta):
    with (p / 'checks.md').open('a') as f:
        f.write('\n## CHECK-04\nGiven a request, reject zero participants.\n')
    # Appending a separator also changes CHECK-03's exact section bytes. Preserve
    # its original body so the measurement isolates adding a new Check.
    replace(p / 'checks.md', 'owner.\n\n## CHECK-04', 'owner.\n## CHECK-04')
    meta['check_sources']['CHECK-04'] = deepcopy(meta['check_sources']['CHECK-01'])
    meta['test_checks'][TESTS['limit']]['CHECK-04'] = check_fingerprint(
        items(p / 'checks.md')['CHECK-04'])


def split_check(p, meta):
    add_check(p, meta)
    replace(p / 'checks.md', 'accept 10 participants and reject 11 participants.', 'accept 10 participants.')
    replace(p / 'checks.md', 'Given a request, reject zero participants.', 'Given a request, reject 11 participants.')
    acknowledge_test(p, meta)
    meta['test_checks'][TESTS['limit']]['CHECK-04'] = check_fingerprint(
        items(p / 'checks.md')['CHECK-04'])


def merge_checks(p, meta):
    replace(p / 'checks.md', '## CHECK-02\n', '')
    del meta['check_sources']['CHECK-02']
    meta['check_sources']['CHECK-01']['BD-02'] = fingerprint(items(p / 'business-design.md')['BD-02'])
    pin = check_fingerprint(items(p / 'checks.md')['CHECK-01'])
    meta['test_checks'][TESTS['limit']]['CHECK-01'] = pin
    meta['test_checks'][TESTS['cancel']] = {'CHECK-01': pin}


def move_test(p, meta):
    (p / 'test_product.py').rename(p / 'test_booking.py')
    meta['test_checks'] = {key.replace('test_product.', 'test_booking.'): value
                           for key, value in meta['test_checks'].items()}


def refactor(p, meta):
    (p / 'product.py').rename(p / 'booking.py')
    replace(p / 'test_product.py', 'from product import', 'from booking import')


def main():
    rows = []
    def run(name, mutate=lambda p, m: None, checks=(), tests=(), candidates=(), failures=0):
        rows.append(run_case(name, mutate, checks, tests, candidates, failures))
    run('baseline')
    run('A_C_business_change_old_checks_tests', business_change, ['CHECK-01'], [TESTS['limit']])
    run('B_section_reorder', reorder)
    run('B_CRLF', lambda p, m: (p / 'business-design.md').write_bytes(
        (p / 'business-design.md').read_bytes().replace(b'\n', b'\r\n')))
    run('B_rephrase_false_positive', lambda p, m: replace(p / 'business-design.md',
        'A booking accepts', 'A reservation accepts'), ['CHECK-01'], [TESTS['limit']])
    run('B_list_reorder_false_positive', lambda p, m: replace(p / 'business-design.md',
        '1 through 10 participants; 11 participants are rejected.',
        '11 participants are rejected; 1 through 10 participants are accepted.'), ['CHECK-01'], [TESTS['limit']])
    run('D_check_updated_test_old', check_update, tests=[TESTS['limit']])
    run('D_source_reconfirmed_check_text_unchanged', cosmetic_reconfirm)
    assert rows[-1]['metadata_leaf_edits'] == 1
    assert rows[-1]['test_pin_leaf_edits'] == 0
    run('complete_update', complete_update)
    def premature(p, m):
        check_update(p, m)
        acknowledge_test(p, m)
    run('blind_acknowledgement_false_negative', premature)
    def test_only(p, m):
        check_update(p, m)
        replace(p / 'test_product.py', 'accepts(10)', 'accepts(20)')
        replace(p / 'test_product.py', 'accepts(11)', 'accepts(21)')
        acknowledge_test(p, m)
    run('updated_test_old_code_runner_catches', test_only, failures=1)
    run('check_text_edit_without_metadata', lambda p, m: replace(p / 'checks.md',
        'accept 10 participants', 'accept 20 participants'), tests=[TESTS['limit']])
    run('deleted_source', lambda p, m: replace(p / 'business-design.md',
        '## BD-01\nA booking accepts 1 through 10 participants; 11 participants are rejected.\n\n', ''),
        ['CHECK-01'], [TESTS['limit']])
    run('new_unmapped_source', lambda p, m: (p / 'business-design.md').write_text(
        (p / 'business-design.md').read_text() + '## BD-04\nBookings need a purpose.\n'),
        candidates=['unmapped_source:BD-04'])
    run('deleted_check', lambda p, m: replace(p / 'checks.md',
        '## CHECK-01\nGiven a booking request, accept 10 participants and reject 11 participants.\n\n', ''),
        ['CHECK-01'], [TESTS['limit']])
    run('missing_source_mapping', lambda p, m: m['check_sources'].pop('CHECK-01'),
        ['CHECK-01'], [TESTS['limit']], ['unmapped_source:BD-01'])
    run('missing_test_mapping', lambda p, m: m['test_checks'].pop(TESTS['limit']),
        candidates=['missing_test_mapping:CHECK-01'])
    run('test_rename_without_mapping', lambda p, m: replace(p / 'test_product.py',
        'def test_limit(', 'def test_capacity('), tests=[TESTS['limit']])
    def rename_test(p, m):
        replace(p / 'test_product.py', 'def test_limit(', 'def test_capacity(')
        m['test_checks'][TESTS['limit'].replace('test_limit', 'test_capacity')] = m['test_checks'].pop(TESTS['limit'])
    run('maintenance_test_rename', rename_test)
    run('maintenance_test_file_move', move_test)
    run('maintenance_check_rename', rename_check)
    run('maintenance_check_add', add_check)
    run('maintenance_check_split', split_check)
    run('maintenance_check_merge', merge_checks)
    run('maintenance_code_refactor', refactor)
    # Missing semantic edges cannot be invented by a hash. This is deliberately
    # the wrong mapping, pinned consistently, to expose the trust boundary.
    def omitted(p, m):
        m['check_sources']['CHECK-01'] = deepcopy(m['check_sources']['CHECK-02'])
        m['check_sources']['CHECK-03']['BD-01'] = fingerprint(items(p / 'business-design.md')['BD-01'])
        acknowledge_test(p, m)
        m['test_checks'][TESTS['owner']]['CHECK-03'] = check_fingerprint(
            items(p / 'checks.md')['CHECK-03'])
        business_change(p, m)
    run('wrong_mapping_false_negative_for_CHECK_01', omitted, ['CHECK-03'], [TESTS['owner']])
    # Compare baseline whole-file pin against the same localized edit.
    with tempfile.TemporaryDirectory() as tmp:
        p = Path(tmp)
        shutil.copytree(FIXTURE, p, dirs_exist_ok=True)
        before = fingerprint((p / 'business-design.md').read_text())
        business_change(p, {})
        whole_stale = 3 if before != fingerprint((p / 'business-design.md').read_text()) else 0
    report = {'base_commit': '90dd8985cc8f4e0391b772bbba570ac8110bf04e',
              'environment': {'python': sys.version.split()[0]},
              'scope': 'synthetic three-rule fixture; no human-time or field defect-rate measurement',
              'baseline': {'business_items': 3, 'checks': 3, 'tests': 3, 'edges': 6,
                           'fingerprint_hex_bytes': 6 * 64,
                           'metadata_bytes': (FIXTURE / 'trace.json').stat().st_size},
              'localized_edit': {'whole_file_stale_checks': whole_stale, 'item_stale_checks': 1},
              'cases': rows}
    parser = argparse.ArgumentParser()
    parser.add_argument('--output', type=Path)
    args = parser.parse_args()
    encoded = json.dumps(report, ensure_ascii=False, indent=2) + '\n'
    if args.output:
        args.output.write_text(encoded)
    else:
        print(encoded, end='')
    print(f'{len(rows)} scenarios passed', file=sys.stderr)


if __name__ == '__main__':
    main()
