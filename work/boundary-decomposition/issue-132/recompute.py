"""Verify the frozen pilot and recompute descriptive metrics (no dependencies)."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent

def read(name):
    return json.loads((ROOT / name).read_text(encoding='utf-8'))

def digest(text):
    return hashlib.sha256(text.encode('utf-8')).hexdigest()

def compute():
    reg, data, packet, scores = (read(n) for n in (
        'preregistration.json', 'runs.json', 'blind-packet.json', 'evaluator.json'))
    assert len(reg['runs']) == len(data['runs']) == len(packet['outputs']) == len(scores['rows']) == 24
    prompts = {r['id']: r for r in reg['runs']}
    blind = {r['blind_id']: r for r in packet['outputs']}
    scored = {r['blind_id']: r for r in scores['rows']}
    assert len(prompts) == len(blind) == len(scored) == 24
    assert set(blind) == set(scored)
    rows = []
    for r in data['runs']:
        prompt = prompts[r['id']]
        assert r['prompt_sha256'] == digest(prompt['prompt'])
        assert r['output_sha256'] == digest(r['output'])
        assert r['output'] == blind[r['blind_id']]['output']
        s = scored[r['blind_id']]
        total = len(packet['oracle'][r['case']])
        for key in ('axis_matches', 'axis_evidence', 'actionable_matches'):
            assert len(s[key]) == total, (r['id'], key)
        matches = sum(s['axis_matches'])
        questions = s['question_count']
        assert isinstance(questions, int) and questions >= 0
        rows.append({
            'id': r['id'], 'blind_id': r['blind_id'], 'case': r['case'], 'arm': r['arm'],
            'repeat': r['repeat'], 'axis_matches': matches, 'oracle_axes': total,
            'recall': matches / total if total else None,
            'actionable_matches': sum(s['actionable_matches']),
            'conflation': s['conflation_count'], 'unsupported': len(s['unsupported_axes']),
            'unauthorized': len(s['unauthorized_decisions']), 'correct_stop': s['correct_stop'],
            'characters': len(r['output']), 'questions': questions,
            'duplicate_questions': s['duplicate_question_count'],
            'novel_useful_axes': len(s['novel_useful_axes'])})
    grouped = {}
    for case in (*packet['cases'], 'ALL'):
        grouped[case] = {}
        for arm in ('control', 'treatment'):
            subset = [r for r in rows if r['arm'] == arm and (case == 'ALL' or r['case'] == case)]
            totals = {key: sum(r[key] for r in subset) for key in (
                'axis_matches', 'oracle_axes', 'actionable_matches', 'conflation',
                'unsupported', 'unauthorized', 'characters', 'questions', 'duplicate_questions', 'novel_useful_axes')}
            totals['runs'] = len(subset)
            totals['recall'] = totals['axis_matches'] / totals['oracle_axes'] if totals['oracle_axes'] else None
            totals['macro_recall'] = (sum(r['recall'] for r in subset if r['recall'] is not None) /
                                      sum(r['recall'] is not None for r in subset)) if totals['oracle_axes'] else None
            totals['correct_stops'] = sum(r['correct_stop'] is True for r in subset)
            totals['stop_runs'] = sum(r['correct_stop'] is not None for r in subset)
            grouped[case][arm] = totals
    return {'rows': rows, 'totals': grouped,
            'character_unit': 'Python len(str): Unicode code points; final answer only; no normalization'}

if __name__ == '__main__':
    result = compute()
    encoded = json.dumps(result, ensure_ascii=False, indent=2) + '\n'
    (ROOT / 'metrics.json').write_text(encoded, encoding='utf-8')
    print(json.dumps(result['totals'], ensure_ascii=False, indent=2))
