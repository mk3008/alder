"""Run a pilot snapshot in a fresh disposable PostgreSQL schema; preserve logs."""
import argparse
import hashlib
import os
from pathlib import Path
import subprocess
import sys
import uuid


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('snapshot', type=Path)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[2]
    snapshot = args.snapshot.resolve()
    snapshot.relative_to(root / 'work/workflow-validation/runs')
    args.output.mkdir(parents=True, exist_ok=True)
    base = root / 'work/workflow-validation'
    sql_files = [base / 'frozen/ddl.sql'] + [snapshot / f for f in (
        'report_equipment_fault.sql', 'maintenance_lifecycle.sql', 'equipment_safety.sql')]
    stages = [snapshot / f'stage{i}-acceptance.sql' for i in range(1, 5)
              if (snapshot / f'stage{i}-acceptance.sql').exists()]
    if len(stages) not in (3, 4):
        raise ValueError('Expected cumulative Stage 1–3 or Stage 1–4 snapshot')
    sql_files += stages
    container = os.environ.get('ALDER_POSTGRES_CONTAINER')
    command = (['docker', 'exec', '-i', container, 'psql', '-U', 'postgres', '-d', 'postgres']
               if container else ['psql'])
    command += ['-X', '--set', 'ON_ERROR_STOP=1', '--echo-all']
    schema = 'alder_' + uuid.uuid4().hex
    inputs = sql_files + [Path(__file__).resolve(), root / 'docs/workflow-validation/pilot/DECISIONS.md']
    inputs += [base / 'frozen' / name for name in (
        'stage1-packet.md', 'stage1-acceptance-v3.md', 'stage2-packet.md',
        'stage2-acceptance-v2.md', 'stage2-acceptance-v3.md', 'stage2-acceptance-v4.md',
        'stage3-packet.md', 'stage3-acceptance.md', 'stage3-acceptance-v2.md')]
    if len(stages) == 4:
        inputs += [base / 'frozen/stage4-packet.md', base / 'frozen/stage4-acceptance.md']
    metadata = [f'head={subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=root, text=True).strip()}',
                f'schema={schema}', f'snapshot={snapshot.relative_to(root)}']
    metadata += [f'{hashlib.sha256(p.read_bytes()).hexdigest()}  {p.relative_to(root)}' for p in inputs]
    (args.output / 'inputs.sha256').write_text('\n'.join(metadata) + '\n')
    sql = f'''CREATE SCHEMA "{schema}";
SET search_path TO "{schema}";
SELECT version(), current_database(), current_user, pg_backend_pid(), current_schema(), clock_timestamp();
SHOW lc_ctype;
SHOW lc_collate;
'''
    sql += '\n'.join(p.read_text(encoding='utf-8-sig') for p in sql_files)
    passed = False
    try:
        result = subprocess.run(command, input=sql, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        (args.output / 'acceptance-evidence.log').write_text(result.stdout)
        print(result.stdout)
        markers = ['STAGE1_ACCEPTANCE_V3_PASS', 'STAGE2_CUMULATIVE_ACCEPTANCE_V4_PASS',
                   'STAGE3_CUMULATIVE_ACCEPTANCE_V2_PASS']
        if len(stages) == 4:
            markers.append('STAGE4_CUMULATIVE_ACCEPTANCE_PASS')
        # Match result rows, not echoed SQL containing a marker.
        passed = result.returncode == 0 and all(
            any(line.startswith(marker + '|') for line in result.stdout.splitlines()) for marker in markers)
    finally:
        cleanup = subprocess.run(command + ['--tuples-only', '--no-align'], input=f'''
DROP SCHEMA IF EXISTS "{schema}" CASCADE;
SELECT 'cleanup_schema_remaining', count(*) FROM information_schema.schemata WHERE schema_name='{schema}';
''', text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        (args.output / 'cleanup.log').write_text(cleanup.stdout)
        print(cleanup.stdout)
        passed = passed and cleanup.returncode == 0 and 'cleanup_schema_remaining|0' in cleanup.stdout.splitlines()
    return 0 if passed else 1


if __name__ == '__main__':
    sys.exit(main())
