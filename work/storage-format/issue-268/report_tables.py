"""Render measured tables into the Japanese report; does not rerun benchmarks."""
from pathlib import Path
import json
import re
import poc

p=poc.HERE
b=json.loads((p/'results/benchmark.json').read_text())
rows=b['rows']
lines=['代表ファイル（BD＋Check、32レコード）のUTF-8容量：','', '| 方式 | bytes | 最長行 bytes |','| --- | ---: | ---: |']
for fmt in ('md','json','jsonl'):
 data=(p/f'fixtures/purchase.{fmt}').read_bytes()
 lines.append(f'| {fmt} | {len(data):,} | {max(map(len,data.splitlines())):,} |')
lines+=['','合成入力の中央値。全体検査の括弧内は9回の最小〜最大。単位は容量がbytes、時間がms。','', '| Activity数 | 方式 | bytes | 構文解析 | 索引構築 | 全体検査（範囲） |','| ---: | --- | ---: | ---: | ---: | ---: |']
for r in rows:
 f=r['fullValidated']
 lines.append(f"| {r['activities']} | {r['format']} | {r['bytes']:,} | {r['syntax']['median_ms']:.3f} | {r['index']['median_ms']:.4f} | {f['median_ms']:.2f} ({f['min_ms']:.2f}〜{f['max_ms']:.2f}) |")
lines+=['','1,000 Activityの部分取得。索引検索は解析済み辞書への1,000回の検索を1バッチとして測定。','', '| 方式 | 全体検査後の末尾抽出 ms | 索引検索1,000回 ms | 未信頼の先頭逐次探索 ms | 未信頼の末尾逐次探索 ms |','| --- | ---: | ---: | ---: | ---: |']
for r in rows:
 if r['activities']!=1000: continue
 first=f"{r['untrustedScanFirst']['median_ms']:.3f}" if 'untrustedScanFirst' in r else '—'
 last=f"{r['untrustedScanLast']['median_ms']:.3f}" if 'untrustedScanLast' in r else '—'
 lines.append(f"| {r['format']} | {r['coldSelected']['median_ms']:.2f} | {r['cachedLookup']['median_ms']:.4f} | {first} | {last} |")
lines+=['',f"環境：Python {b['environment']['python']}、{b['environment']['platform']}、論理CPU {b['environment']['logicalCpus']}。実測日（UTC）：{b['environment']['timestampUtc']}。",'', '測定順は各規模でMD→JSON→JSONL、指標ごとの逐次実行である。共有実行環境の負荷や順序の影響を除去できず、全体検査と抽出の中央値が前後する場合もある。CPU時間も生データに併記した。速度の一般優位や本番の応答時間は結論しない。', '', '1,000 Activityでは全方式が現行Viewerの2MiB上限を超える。500 Activityでは整形JSONが上限を超える。この負荷試験はPoCのparserを直接呼んだもので、現行Viewerで開ける規模の保証ではない。']
measured='\n'.join(lines)
edits=json.loads((p/'results/edits.json').read_text())
lines=['| 課題 | 方式 | Git追加行 | Git削除行 | 変更行の合計bytes |','| --- | --- | ---: | ---: | ---: |']
for r in edits:
 lines.append(f"| {r['task']} | {r['format']} | {r['gitAddedLines']} | {r['gitRemovedLines']} | {r['replacedLineBytes']:,} |")
edit='\n'.join(lines)
report=(p/'REPORT.ja.md').read_text()
for key,value in [('MEASURED_TABLES',measured),('EDIT_TABLE',edit)]:
 pattern=r'<!-- '+key+r'(?:_START -->.*?<!-- '+key+r'_END)? -->'
 replacement='<!-- '+key+'_START -->\n\n'+value+'\n\n<!-- '+key+'_END -->'
 report,n=re.subn(pattern,lambda _:replacement,report,flags=re.S)
 assert n==1,(key,n)
(p/'REPORT.ja.md').write_text(report)
print('report tables updated')
