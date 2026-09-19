"""Render the human-readable mapping from the single mapping record."""
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[2]
m = json.loads((Path(__file__).parent / 'mapping.json').read_text())
remote = 'https://github.com/mk3008/alder/blob/' + m['implementation_revision'] + '/'
def link(ref):
    lo, hi = ref['lines']
    return f"[{ref['symbol']}]({remote}{ref['path']}#L{lo}-L{hi})"
labels = {'mapped':'mapped（記載条項のみ）','implementation_gap':'実装対応差','missing_check_test':'既存検査証拠の不足/部分対応','ambiguous_mapping':'人間確認が必要'}
lines = ['# Business / Interface / Check / Test / Code 対応例', '',
    '正本は[resolved設計](../../work/behavior-derivation/stage2/inputs/meeting-room.md)、Checkは[同版のc3初稿](../../work/behavior-derivation/stage4/outputs/meeting-room-c3.md)。コードと既存テストはM1/M2承認前の固定版。行番号・版・所属の正本は[mapping.json](../../work/functional-interface/mapping.json)。この文書は同じJSONから生成する。', '',
    '**24 Checkの所属は整理したが、意味の詳細評価は12条項に限定した。mappedはCheck全文の検証完了を意味しない。**', '', '## Checkの所属', '', '| Check | 主担当 | 接続・共有制約の関連先 |', '| --- | --- | --- |']
for a in m['assignments']:
    lines.append(f"| {a['check']} | {a['primary']} | {', '.join(a['related']) or '—'} |")
lines += ['', '## 意味を照合した条項', '']
for c in m['claims']:
    lines += [f"### {c['id']} — {c['claim']}", '',
        f"- 対応: {', '.join(c['interfaces'])} → {', '.join(c['checks'])}。Business根拠: " + ', '.join(f'L{a}–{b}' for a,b in c['business_lines']) + '。',
        f"- 判定: **{labels[c['status']]}**。",
        '- 実装: ' + (' / '.join(link(r) for r in c['implementation']) or ('未承認候補のため確定した実装対応を評価しない。' if c['status'] == 'ambiguous_mapping' else '満たす利用者経路を確認できない。')),
        '- 既存テスト: ' + (' / '.join(link(r) for r in c['tests']) or '対応する確定検査なし。'),
        '- アサーション/観測: ' + c['test_assertions'], '- 範囲と注意: ' + c['limit']]
    if c.get('rejected_candidates'):
        lines.append('- 不採用の対応候補: ' + ' / '.join(link(r) for r in c['rejected_candidates']))
    lines.append('')
lines += ['## コードからの逆引き', '', '| コード | 扱い | 根拠・対応先 |', '| --- | --- | --- |']
for r in m['reverse_samples']:
    lines.append(f"| {link(r['code'])} | {r['classification']} | {r['basis']} |")
lines += ['', '確認した入口・支援処理では、根拠不明の独立した業務能力（orphan implementation）は確定しなかった。全行の網羅を主張せず、技術支援を業務Interfaceへ無理に昇格させない。', '']
(ROOT / 'docs/functional-interface/mapping.md').write_text('\n'.join(lines))
