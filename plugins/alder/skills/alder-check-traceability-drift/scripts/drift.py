"""Read-only, standard-library research PoC. No approval/baseline-write command."""
import argparse
import hashlib
import json
import re
from pathlib import Path


def fingerprint(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True,
                                     separators=(',', ':')).encode()).hexdigest()


def items(path):
    """Restricted fixture format: H1 title followed by H2 stable-ID sections.

    Hash the complete section, including its title. Only CRLF is normalized;
    prose whitespace may be meaningful. Section order is not part of identity.
    """
    text = path.read_bytes().decode('utf-8').replace('\r\n', '\n')
    parts = re.split(r'^## ([A-Z]+-[0-9]+)\n', text, flags=re.M)
    if not re.fullmatch(r'# [^\n]+\n\s*', parts[0]) or len(parts) == 1:
        raise ValueError(f'{path.name}: expected H1 title and stable-ID H2 sections')
    result = {}
    for key, body in zip(parts[1::2], parts[2::2]):
        if key in result or not body.strip() or re.search(r'^## ', body, re.M):
            raise ValueError(f'{path.name}: duplicate, empty or invalid section {key}')
        result[key] = body
    return result


def unique_object(pairs):
    value = {}
    for key, item in pairs:
        if key in value:
            raise ValueError(f'duplicate JSON key: {key}')
        value[key] = item
    return value


def read_metadata(path):
    return json.loads(path.read_text(encoding='utf-8'), object_pairs_hook=unique_object)


def validate(meta):
    if set(meta) != {'version', 'check_sources', 'test_checks'} or meta['version'] != 1:
        raise ValueError('expected version 1, check_sources and test_checks only')
    for name in ('check_sources', 'test_checks'):
        if not isinstance(meta[name], dict):
            raise ValueError(f'{name} must be an object')
        for owner, edges in meta[name].items():
            if not owner or not isinstance(edges, dict) or not edges:
                raise ValueError(f'{owner}: expected nonempty relation object')
            if any(not target or not isinstance(pin, str) or
                   not re.fullmatch('[0-9a-f]{64}', pin) for target, pin in edges.items()):
                raise ValueError(f'{owner}: invalid target or SHA-256 pin')


def check_fingerprint(body):
    # Tests verify the Check's expectation, not its source-review history.
    return fingerprint(body)


def detect(business, checks, meta, test_ids):
    validate(meta)
    stale_checks, stale_tests = {}, {}
    candidates = []
    for check in sorted(set(checks) | set(meta['check_sources'])):
        reasons = []
        if check not in checks:
            reasons.append('missing_check')
        edges = meta['check_sources'].get(check, {})
        if not edges:
            reasons.append('missing_source_mapping')
        for source, pin in sorted(edges.items()):
            if source not in business:
                reasons.append(f'missing_source:{source}')
            elif fingerprint(business[source]) != pin:
                reasons.append(f'source_changed:{source}')
        if reasons:
            stale_checks[check] = reasons
    for test, edges in sorted(meta['test_checks'].items()):
        reasons = []
        if test not in test_ids:
            reasons.append('missing_test')
        for check, pin in sorted(edges.items()):
            if check not in checks:
                reasons.append(f'missing_check:{check}')
            elif check in stale_checks:
                reasons.append(f'upstream_stale:{check}')
            elif check_fingerprint(checks[check]) != pin:
                reasons.append(f'check_changed:{check}')
        if reasons:
            stale_tests[test] = reasons
    used_sources = {source for edges in meta['check_sources'].values() for source in edges}
    used_checks = {check for edges in meta['test_checks'].values() for check in edges}
    for source in sorted(set(business) - used_sources):
        candidates.append(f'unmapped_source:{source}')
    for check in sorted(set(checks) - used_checks):
        candidates.append(f'missing_test_mapping:{check}')
    return {'stale_checks': stale_checks, 'stale_tests': stale_tests,
            'mapping_candidates': candidates}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('business', type=Path)
    parser.add_argument('checks', type=Path)
    parser.add_argument('metadata', type=Path)
    parser.add_argument('inventory', type=Path, help='JSON list of discovered runner test IDs')
    args = parser.parse_args()
    try:
        inventory = json.loads(args.inventory.read_text())
        if (not isinstance(inventory, list) or
                any(not isinstance(item, str) or not item for item in inventory) or
                len(inventory) != len(set(inventory))):
            raise ValueError('test inventory must contain unique nonempty string IDs')
        result = detect(items(args.business), items(args.checks),
                        read_metadata(args.metadata), set(inventory))
    except (ValueError, OSError, TypeError) as error:
        parser.exit(2, f'invalid input: {error}\n')
    print(json.dumps(result, indent=2))
    return 1 if any(result.values()) else 0


if __name__ == '__main__':
    raise SystemExit(main())
