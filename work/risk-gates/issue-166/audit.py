"""Validate saved research evidence, not production behavior or risk accuracy."""
import hashlib,json,pathlib
p=pathlib.Path(__file__).parent
cases=json.loads((p/'inputs/cases.json').read_text())
manifest=json.loads((p/'manifest.json').read_text())
expected={c['id'] for c in cases}
assert len(expected)==12
for name,digest in manifest['input_sha256'].items():
 assert hashlib.sha256((p/'inputs'/name).read_bytes()).hexdigest()==digest,name
for run in manifest['runs']:
 raw=json.loads((p/run['raw']).read_text())
 rows=raw if isinstance(raw,list) else raw.get('cases',raw.get('results',[]))
 assert len(rows)==12 and {r['id'] for r in rows}==expected,run['run']
 for row in rows:
  for key in ['risk_reason','additional_human_gate','gate_target_and_timing','existing_gate','automatic_only_reason','uncertainties','actual_human_decision','automatic_verification']:
   assert key in row,(run['run'],row['id'],key)
  assert row['additional_human_gate'] in ['required','not_required','unresolved']
  if run['run'].startswith('label'):assert row['risk_label'] in ['Low','Medium','High']
 print(run['run'], {r['id']:r['additional_human_gate'] for r in rows})
print('PASS: four saved outputs, 48 case decisions, required fields and pinned input hashes. Semantic scores require the authored audit.')
