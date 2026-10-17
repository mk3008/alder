#!/usr/bin/env python3
"""Verify frozen evidence integrity, not Business Design correctness."""
from pathlib import Path
import hashlib, json, re

ROOT = Path(__file__).resolve().parent

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

checks = {}
frozen = json.loads((ROOT/'provenance/input-freeze.json').read_text())
checks['all_prerun_file_hashes_match'] = all(sha(ROOT/p) == h for p,h in frozen['files'].items())
source = (ROOT/'inputs/transcript.txt').read_text()
turns = re.findall(r'^T\d{3}', source, re.M)
checks['sequential_turn_ids'] = turns == [f'T{i:03d}' for i in range(1, len(turns)+1)]
checks['input_equals_preparation'] = sha(ROOT/'inputs/transcript.txt') == sha(ROOT/'preparation/transcript.txt')
ledger = json.loads((ROOT/'preparation/observability.json').read_text())
ids = [e['id'] for e in ledger['elements']]
checks['unique_oracle_ids'] = len(ids) == len(set(ids))
checks['oracle_sources_exist'] = all(t in turns for e in ledger['elements'] for t in e['source_turns'])
checks['ledger_source_hash_matches'] = ledger['input_sha256'] == sha(ROOT/'inputs/transcript.txt')
checks['package_release_comparison_passed'] = all(e['release_byte_equal'] for e in json.loads((ROOT/'provenance/package-manifest.json').read_text())['files'])
if (ROOT/'raw/output-freeze.json').exists():
    raw = json.loads((ROOT/'raw/output-freeze.json').read_text())
    checks['all_first_output_hashes_match'] = all(sha(ROOT/p) == h for p,h in raw['files'].items())
    checks['raw_frozen_after_input'] = raw['frozen_at_utc'] > frozen['frozen_at_utc']
    reads = [json.loads(l) for l in (ROOT/'raw/reads.jsonl').read_text().splitlines() if l.strip()]
    checks['logged_reads_match_permitted_inputs'] = all((ROOT/'inputs'/e['path']).is_file() and sha(ROOT/'inputs'/e['path']) == e['sha256'] for e in reads)
    checks['no_logged_read_path_escape'] = all((ROOT/'inputs'/e['path']).resolve().is_relative_to((ROOT/'inputs').resolve()) for e in reads)
    checks['transcript_read_logged'] = any(e['path']=='transcript.txt' for e in reads)
    checks['skill_read_logged'] = any(e['path']=='package/skills/alder-draft-business-design/SKILL.md' for e in reads)
    checks['adoption_required_section_logged'] = any(e['path']=='package/skills/alder-draft-business-design/references/adoption.md' and e['start_line']<=15 and e['end_line']>=177 for e in reads)
    checks['structure_read_logged'] = any(e['path']=='package/skills/alder-review-business-design/references/business-design-structure.ja.md' and e['start_line']==1 and e['end_line']==e['total_lines'] for e in reads)
    checks['graph_profile_read_logged'] = any(e['path']=='package/skills/alder-draft-business-design/references/business-graph.md' and e['start_line']==1 and e['end_line']>=128 for e in reads)
if (ROOT/'evaluation/mapping.json').exists():
    mapping = json.loads((ROOT/'evaluation/mapping.json').read_text())
    rows = mapping['elements'] if isinstance(mapping, dict) else mapping
    checks['all_oracle_ids_evaluated'] = set(ids)=={r['id'] for r in rows}
report = {'checks':checks,'all_passed':all(checks.values()),'turn_count':len(turns),'oracle_elements':len(ids),
          'limits':['Hash/read-log checks do not establish semantic correctness or absence of unlogged reads.',
                    'Effective model/reasoning and complete runtime context are not independently attested.']}
print(json.dumps(report, ensure_ascii=False, indent=2))
raise SystemExit(0 if report['all_passed'] else 1)
