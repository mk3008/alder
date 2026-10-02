"""Render per-slot descriptive tables from checked aggregation, without judging semantics."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OUT = ROOT / 'evaluation-result'


def value(x):
    if isinstance(x, dict) and 'meaning' in x:
        return x['meaning'].replace('|', '\\|').replace('\n', ' ')
    return 'NA' if x is None else str(x)


def fraction(row, numerator, denominator):
    return 'NA' if row[numerator] is None or not row[denominator] else f'{row[numerator]}/{row[denominator]}'


rows = json.loads((OUT / 'unblinded-scores.json').read_text())
availability = json.loads((OUT / 'availability.json').read_text())
lines = ['## 完了・利用可能性', '',
         '| 手法 | Stage | 予定 | 技術的完了 | strict有効 | source-clean探索有効 |',
         '|---|---|---:|---:|---:|---:|']
for row in availability['eligibility_counts']:
    lines.append(f"| {row['arm']} | {row['stage']} | {row['planned']} | {row['technical_complete']} | {row['strict_primary_eligible']} | {row['source_clean_exploratory_eligible']} |")
lines += ['', 'strictのguard許可は両手法で非対称だった。上の有効率を手法品質へ換算しない。技術的完了と厳密な条件遵守も同一ではない。', '',
          '## 探索観測の各資料', '',
          '以下はsource-clean探索資料の記述値。strict列は原wrapper条件でも有効だった資料を示す。NAは適用外または根拠を確定できない指標であり、0点ではない。原採点・引用根拠・未確定metric名はJSONで追跡できる。']
for stage in ['s1', 's2', 's3']:
    lines += ['', '### ' + stage, '']
    if stage == 's1':
        lines += ['| case | rep | 手法 | ID | strict | 未決発見 | 回答可能な質問 | source保持 | 無断決定 | 補完 | 再質問 | C4停止 |',
                  '|---|---:|---|---|---|---|---|---|---:|---:|---:|---|']
    elif stage == 's2':
        lines += ['| case | rep | 手法 | ID | strict | 回答後保持 | 無断決定 | 補完 | 未決漏出 |',
                  '|---|---:|---|---|---|---|---:|---:|---:|']
    else:
        lines += ['| case | rep | 手法 | ID | strict | 下流保持 | probe独自発明 | 無断決定 | 補完 | 未決漏出 |',
                  '|---|---:|---|---|---|---|---:|---:|---:|---:|']
    for r in sorted((r for r in rows if r['stage'] == stage), key=lambda r: (r['case'], r['replicate'], r['arm'])):
        cells = [r['case'], r['replicate'], r['arm'], r['blind_id'], 'yes' if r['strict_primary_eligible'] else 'no']
        if stage == 's1':
            cells += [fraction(r, 'unknown_found', 'unknown_total'), fraction(r, 'actionable_found', 'unknown_total'),
                      fraction(r, 'source_preserved', 'source_total'), value(r['unauthorized_decisions']),
                      value(r['unsupported_additions']), value(r['redundant_questions']), value(r['correct_stop'])]
        elif stage == 's2':
            cells += [fraction(r, 'post_answer_preserved', 'post_answer_total'), value(r['unauthorized_decisions']),
                      value(r['unsupported_additions']), value(r['unresolved_leakage'])]
        else:
            cells += [fraction(r, 'downstream_preserved', 'downstream_total'), value(r['probe_inventions']),
                      value(r['unauthorized_decisions']), value(r['unsupported_additions']), value(r['unresolved_leakage'])]
        lines.append('| ' + ' | '.join(map(str, cells)) + ' |')
lines += ['', '### C5 資料のhandoff readiness', '',
          '| rep | Stage | 手法 | ID | architecture追加必須 | 未承認architecture昇格 | readiness | 実装動作 |',
          '|---:|---|---|---|---|---:|---|---|']
for r in sorted((r for r in rows if r['case'] == 'C5'), key=lambda r: (r['replicate'], r['stage'], r['arm'])):
    cells = [r['replicate'], r['stage'], r['arm'], r['blind_id'], value(r['architecture_input_required']),
             value(r['unapproved_architecture_promotion']), value(r['handoff_readiness']), r['implementation_viability']]
    lines.append('| ' + ' | '.join(map(str, cells)) + ' |')
lines += ['', '## 出力量', '',
          '| case | rep | 手法 | s1 artifact bytes/files | s1 response bytes | s2 artifact bytes/files | s2 response bytes | s3 probe response bytes |',
          '|---|---:|---|---|---:|---|---:|---:|']
by_run = {}
for r in rows:
    by_run.setdefault((r['case'], r['replicate'], r['arm']), {})[r['stage']] = r
for (case, replicate, arm), stages in sorted(by_run.items()):
    cells = [case, replicate, arm]
    for stage in ['s1', 's2']:
        r = stages.get(stage)
        cells += [f"{r['artifact_bytes']}/{r['artifact_files']}" if r else 'NA', r['response_bytes'] if r else 'NA']
    cells += [stages['s3']['response_bytes'] if 's3' in stages else 'NA']
    lines.append('| ' + ' | '.join(map(str, cells)) + ' |')
lines += ['', 'UTF-8 byte数。artifactとresponseには重複する本文があり、合算を意味量や品質点にしない。RDRAのs1/s2 artifactは完成した中間・最終資料を含む。s3はprobeのresponse本文。raw tool logやretry証跡の総量とは異なる。', '',
          '## paired資料の範囲', '', '| 分析 | s1 | s2 | s3 |', '|---|---:|---:|---:|']
for label, name in [('strict', 'strict-primary-paired-scores.json'), ('source-clean探索', 'exploratory-paired-scores.json')]:
    pairs = json.loads((OUT / name).read_text())
    lines.append('| ' + label + ' | ' + ' | '.join(str(sum(x['stage'] == s for x in pairs)) for s in ['s1', 's2', 's3']) + ' |')
lines += ['', '予定のpairは各Stage 10組。欠測・無効・未確定metricを0へ置換しない。総合点・総合勝敗・統計的一般化は行わない。', '']
(OUT / 'RESULT-TABLES.md').write_text('\n'.join(lines))
print(json.dumps({'rows_rendered': len(rows)}, ensure_ascii=False))
