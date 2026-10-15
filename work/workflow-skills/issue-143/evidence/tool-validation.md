# Graph exporter and bounded drift tool validation

## Scope and source

Validation date: 2026-10-04 UTC. Environment: Python 3.12.14, local Linux execution. This is tool/package evidence, not evidence of natural-language routing or script availability in every client.

Canonical authority, scripts and synthetic fixture source: `mk3008/alder` at `a971d60bb64fbc048a871d70dda277c93b680288`. Installed-copy checks use the two new skill directories in the Issue #143 working tree. Their bundled provenance records this fixed source revision; no branch-head lookup was used. Missing canonical `work/traceability-drift` test files were fetched at that exact revision for local validation, without editing their content. They are existing upstream files, not additions to this PR.

Exporter SHA-256: `4f5cf06d2c3795cded69ab751110a11807ea580586b12805e06e175ecd60a9ed`.

Detector SHA-256: `c5db8c5c878be26554f70394fd27a127411f2a10e8a0320ba26259eff6cff75e`.

The evidence below is a summary of observed tool output, not a reconstructed raw transcript. Commands are provided verbatim for reproduction from the repository root after applying the Issue #143 skill additions to the pinned source. Temporary outputs are outside the product inputs and are not committed.

## Canonical regression and scenario commands

```sh
python3 --version
python3 -m unittest discover -s tools/business_graph -p 'test_*.py' -v
python3 -m unittest discover -s work/traceability-drift -p 'test_drift.py' -v
python3 work/traceability-drift/evaluate.py --output /tmp/alder-issue-143-drift-observations.json
```

Observed on the evidence rerun: Python 3.12.14; graph suite 44 tests, `OK`; drift regression suite 12 tests, `OK`; evaluator `26 scenarios passed`. All completed successfully. The evaluator deliberately exercises its own synthetic product tests, including an expected failure and known false-negative cases. It is a research validation command, **not** a product read-only detection/inventory command and is not exposed for that purpose by the skill.

## Installed-copy commands

The following checks execute the actual bundled scripts. Test inventory comes from real unittest discovery over a copied synthetic fixture, without calling a TestRunner or executing its test methods. This fixture-specific adapter is validation scaffolding, not a universal project adapter. Product discovery requires its own supported, inspected, authorized route.

```sh
python3 - <<'PY'
from pathlib import Path
import hashlib
import json
import shutil
import subprocess
import sys
import tempfile

root = Path.cwd()
skills = root / 'plugins/alder/skills'
exporter = skills / 'alder-export-business-graph/scripts/export.py'
detector = skills / 'alder-check-traceability-drift/scripts/drift.py'
assert exporter.read_bytes() == (root / 'tools/business_graph/export.py').read_bytes()
assert detector.read_bytes() == (root / 'work/traceability-drift/drift.py').read_bytes()
assert hashlib.sha256(exporter.read_bytes()).hexdigest() == '4f5cf06d2c3795cded69ab751110a11807ea580586b12805e06e175ecd60a9ed'
assert hashlib.sha256(detector.read_bytes()).hexdigest() == 'c5db8c5c878be26554f70394fd27a127411f2a10e8a0320ba26259eff6cff75e'

with tempfile.TemporaryDirectory() as temporary:
    work = Path(temporary)
    source = root / 'business-design/alder/README.md'
    output = work / 'graph.json'
    run = subprocess.run([sys.executable, str(exporter), str(source), '-o', str(output)], cwd=work, capture_output=True, text=True)
    assert run.returncode == 0, run.stderr
    assert output.read_bytes() == (root / 'business-design/alder/graph.generated.json').read_bytes()
    invalid = work / 'bad.md'
    invalid.write_text('# Bad\n')
    previous = output.read_bytes()
    run = subprocess.run([sys.executable, str(exporter), str(invalid), '-o', str(output)], capture_output=True)
    assert run.returncode == 2
    assert output.read_bytes() == previous
    previous_source = source.read_bytes()
    run = subprocess.run([sys.executable, str(exporter), str(source), '-o', str(source)], capture_output=True)
    assert run.returncode == 2
    assert source.read_bytes() == previous_source

    fixture = work / 'fixture'
    shutil.copytree(root / 'work/traceability-drift/fixture', fixture)
    discovery = '''import json, unittest
loader = unittest.TestLoader()
suite = loader.discover('.')
if loader.errors:
    raise RuntimeError(loader.errors)
def ids(suite):
    for item in suite:
        if isinstance(item, unittest.TestSuite):
            yield from ids(item)
        else:
            yield item.id()
print(json.dumps(list(ids(suite))))
'''
    inventory = work / 'current-inventory.json'
    inventory.write_text(subprocess.check_output([sys.executable, '-c', discovery], cwd=fixture, text=True))
    assert len(json.loads(inventory.read_text())) == 3
    inputs = [fixture / 'business-design.md', fixture / 'checks.md', fixture / 'trace.json', inventory]
    before = {path: path.read_bytes() for path in inputs}
    run = subprocess.run([sys.executable, str(detector), *map(str, inputs)], capture_output=True, text=True)
    assert run.returncode == 0, run.stderr
    assert json.loads(run.stdout) == {'stale_checks': {}, 'stale_tests': {}, 'mapping_candidates': []}
    assert all(path.read_bytes() == content for path, content in before.items())

print('PASS: bundled scripts equal canonical sources and pinned digests')
print('PASS: bundled exporter matches graph fixture; invalid input preserves output; source overwrite refused')
print('PASS: bundled detector uses 3 runner-discovered IDs; empty candidates; all four inputs unchanged')
PY
```

Observed on the evidence rerun: all three `PASS` messages above and exit 0. Export success means structural projection only. Empty drift candidates mean freshness only within the supplied source units, saved relationships and runner inventory; they do not establish human approval, complete mappings, test adequacy or business correctness.

## Skill syntax validation

In this validation environment, both commands completed with `Skill is valid!`:

```sh
python3 /home/agent/.codex/skills/.system/skill-creator/scripts/quick_validate.py plugins/alder/skills/alder-export-business-graph
python3 /home/agent/.codex/skills/.system/skill-creator/scripts/quick_validate.py plugins/alder/skills/alder-check-traceability-drift
```

The validator path is environment-specific and is not a runtime dependency of the packaged skills. Syntax validation does not establish routing quality or behavioral compliance.
