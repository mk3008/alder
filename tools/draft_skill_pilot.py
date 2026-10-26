"""Offline pilot packaging and evaluator-record validation; never calls an LLM.

Semantic judgments belong to a separate evaluator inspecting the actual artifacts.
This module checks the evidence envelope, not Japanese business meaning.
"""
import argparse
import hashlib
import json
from pathlib import Path
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[1]
FIXTURE = ROOT / 'tools/fixtures/draft-skill-pilot'
SKILLS = ('alder-draft-business-design', 'alder-review-business-design',
          'alder-manage-json-documents')


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def package(case, destination):
    """Export positive allowlist only. No oracle, scores, tests, or earlier outputs."""
    if case not in ('normal', 'undecided', 'review_unavailable'):
        raise ValueError('unknown case')
    source = FIXTURE / 'worker' / (case + '.md')
    if not source.is_file() or destination.exists():
        raise ValueError('unknown case or destination already exists')
    destination.mkdir(parents=True)
    shutil.copyfile(source, destination / 'task.md')
    shutil.copyfile(ROOT / 'AGENTS.md', destination / 'AGENTS.md')
    target = destination / 'plugins/alder'
    target.mkdir(parents=True)
    shutil.copyfile(ROOT / 'plugins/alder/plugin.json', target / 'plugin.json')
    for name in SKILLS:
        shutil.copytree(ROOT / 'plugins/alder/skills' / name, target / 'skills' / name)
    manifest = {str(p.relative_to(destination)): digest(p)
                for p in sorted(destination.rglob('*')) if p.is_file()}
    revision = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip()
    (destination / 'input-manifest.json').write_text(json.dumps({
        'source_revision': revision, 'case': case, 'files': manifest,
    }, ensure_ascii=False, indent=2) + '\n')
    return manifest


def validate_and_score(oracle, record, evidence_root):
    """Fail closed on missing/unknown critical evidence; no worker self-scores."""
    def require(condition, reason):
        if not condition:
            raise ValueError(reason)

    require(record['case'] == oracle['case'], 'case mismatch')
    require(record['evaluator']['independent_of_executor'] is True,
            'executor self-report is not evaluation')
    require(record['evaluator']['id'] != record['executor_id'], 'same evaluator/executor')
    require(record['input_integrity'] in ('verified', 'leaked', 'unknown'), 'input integrity')
    require(record['execution_status'] in ('RUN', 'NOT_RUN'), 'execution status')
    if record['execution_status'] == 'NOT_RUN':
        require(bool(record['reason']), 'NOT_RUN requires reason')
        return {'outcome': 'NOT_RUN', 'requirements': {}, 'critical_unmet': []}
    require(record['source_revision'] == oracle['source_revision'], 'revision mismatch')
    refs = record['evidence']
    for key, ref in refs.items():
        path = (evidence_root / ref['path']).resolve()
        require(path.is_relative_to(evidence_root.resolve()), 'evidence outside root')
        require(path.is_file() and digest(path) == ref['sha256'], 'missing/changed evidence: ' + key)
    require(record['output_evidence'] in refs, 'output evidence missing')
    expected = {item['id']: item for item in oracle['requirements']}
    rows = record['requirements']
    require(len(rows) == len(expected) and {r['id'] for r in rows} == set(expected),
            'requirements missing, duplicate or extra')
    for row in rows:
        require(row['status'] in ('met', 'partial', 'unmet', 'unknown'), 'invalid status')
        require(bool(row['rationale']), 'missing rationale')
        require(all(ref in refs for ref in row['evidence']), 'unknown evidence reference')
        require(row['status'] == 'unknown' or bool(row['evidence']), 'judgment without evidence')
    review = record['review']
    require(review['status'] in ('completed', 'not_run', 'failed', 'unknown'), 'review status')
    require(review['independence'] in ('independent', 'same_agent', 'unknown'), 'review independence')
    if review['status'] == 'completed':
        require(review['evidence'] in refs, 'review evidence missing')
        require(review['reviewed_output_sha256'] == refs[record['output_evidence']]['sha256'],
                'latest output was not reviewed')
    for metric in ('steps', 'seconds', 'retries', 'cost'):
        value = record['observations'][metric]
        require(value == 'unknown' or (isinstance(value, dict) and value['evidence'] in refs),
                'unobserved metric must be unknown')
    for finding in record['findings']:
        require(all(finding.get(k) for k in ('issue', 'evidence', 'cause_hypothesis', 'general_fix_rule')),
                'separate issue/evidence/cause/fix')
        require(all(ref in refs for ref in finding['evidence']), 'finding evidence missing')
    critical = [r['id'] for r in rows if expected[r['id']]['critical'] and r['status'] in ('unmet', 'partial')]
    if record['input_integrity'] == 'leaked':
        outcome = 'INVALID'
    elif critical:
        outcome = 'FAIL'
    elif record['input_integrity'] == 'unknown' or any(r['status'] == 'unknown' for r in rows):
        outcome = 'INCONCLUSIVE'
    elif review['status'] != 'completed':
        outcome = 'INCOMPLETE'
    elif any(r['status'] != 'met' for r in rows):
        outcome = 'PARTIAL'
    else:
        outcome = 'PASS'
    return {'outcome': outcome, 'critical_unmet': critical,
            'requirements': {r['id']: r['status'] for r in rows}}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest='command', required=True)
    bundle = sub.add_parser('package')
    bundle.add_argument('case')
    bundle.add_argument('destination', type=Path)
    score = sub.add_parser('score')
    score.add_argument('oracle', type=Path)
    score.add_argument('record', type=Path)
    score.add_argument('evidence_root', type=Path)
    args = parser.parse_args()
    if args.command == 'package':
        package(args.case, args.destination)
    else:
        print(json.dumps(validate_and_score(json.loads(args.oracle.read_text()),
                         json.loads(args.record.read_text()), args.evidence_root), indent=2))


if __name__ == '__main__':
    main()
