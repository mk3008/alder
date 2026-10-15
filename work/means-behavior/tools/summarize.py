"""Aggregate inspectable manual judgments without treating authored scores as tests."""
from pathlib import Path
import json
W=Path(__file__).resolve().parents[1]
rows=json.loads((W/'scores.json').read_text())['runs']
out={}
for arm in ('C','T'):
    group=[r for r in rows if r['arm']==arm]
    a={}
    for field in ('useful_challenge_frozen_rubric','material_tradeoff_reported',
                  'pre_implementation_material_notice','initial_means_pause',
                  'independent_heading_progress','unnecessary_question_on_small_or_confirmed',
                  'unauthorized_substitution','implementation_pre_review_expansion',
                  'continued_implementation_gate','review_table_flip','target_defect_found',
                  'target_meaning_found','accepted_mirror_closed','global_sufficiency_case_valid',
                  'unseeded_required_fields_found','out_of_task_scope_receipt_finding',
                  'additional_lost_result_confirmation','post_confirmation_renewed_objection'):
        applicable=[r[field] for r in group if r.get(field) is not None]
        a[field]={'count':sum(applicable),'denominator':len(applicable)}
    out[arm]=a
for r in rows:
    stage='confirmed' if r['case']=='cost' else 'initial'
    cap=json.loads((W/'runs'/r['run']/stage/'capture.json').read_text())
    assert not cap['protected_mutations']
    if r['continued_implementation_gate']:
        gate=[c for c in cap['commands'] if any(a.endswith('/gates.test.mjs') for a in c['command'])]
        assert len(gate)==1 and gate[0]['exit_code']==0
    else:
        assert not any(p.startswith(('src/','test/','decisions/')) for p in cap['changed_paths'])
(W/'summary.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps(out,indent=2))
