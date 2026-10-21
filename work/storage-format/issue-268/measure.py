"""Reproduce fixtures, CPU benchmarks, fixed-edit diffs and localhost transport checks."""
import copy
import difflib
import hashlib
import http.server
import io
import json
import os
import platform
import statistics
import subprocess
import tempfile
import threading
import time
import urllib.request
from pathlib import Path
import poc

FORMATS=('md','json','jsonl')
RESULTS=poc.HERE/'results'


def measure(fn, repeats=9, warmups=2):
    for _ in range(warmups):
        fn()
    samples=[]
    cpu_samples=[]
    for _ in range(repeats):
        start=time.perf_counter_ns()
        cpu_start=time.process_time_ns()
        fn()
        samples.append((time.perf_counter_ns()-start)/1e6)
        cpu_samples.append((time.process_time_ns()-cpu_start)/1e6)
    return dict(median_ms=statistics.median(samples), min_ms=min(samples), max_ms=max(samples), samples_ms=samples,cpu_median_ms=statistics.median(cpu_samples),cpu_samples_ms=cpu_samples)


def synthetic(count):
    original=poc.from_markdown((poc.HERE/'inputs/purchase.md').read_text())
    keep=[r for r in original['records'] if r['kind'] not in ('activity',) and r['heading']!='# Findings']
    activity=next(r for r in original['records'] if r['kind']=='activity')
    for i in range(count):
        r=copy.deepcopy(activity)
        r.update(id=f'activity-{i:04d}',heading=f'# Activity 合成申請{i:04d}')
        keep.append(r)
    original.update(records=keep,recordCount=len(keep),documentRevision=f'synthetic-{count}')
    poc.validate(original)
    return original


def scan_jsonl(text, identifier):
    # No global validation and no dependency closure: latency only for untrusted record preview.
    for line in io.StringIO(text):
        r=poc.strict_json(line)
        if r.get('id')==identifier:
            return r
    raise ValueError(identifier)


def edit_cases(original):
    cases={}
    b=copy.deepcopy(original)
    r=next(r for r in b['records'] if r['kind']=='activity')
    pos=r['body'].index('## Why\n')+2
    r['body'][pos]=r['body'][pos].rstrip('\n')+'（PoCの編集例）\n'
    cases['activity-why']=b
    b=copy.deepcopy(original)
    next(r for r in b['records'] if r['heading']=='# Object 購入用CSV')['heading']='# Object 購買CSV'
    cases['rename-object']=b
    b=copy.deepcopy(original)
    r=next(r for r in b['records'] if r['kind']=='activity')
    target=next(r['id'] for r in b['records'] if r['heading']=='# Object 購入用CSV')
    pos=r['body'].index('## Result\n')
    r['body'][pos:pos]=[dict(ref=target,label='PoCでのみ追加した出力関係'),'\n']
    cases['add-relation']=b
    b=copy.deepcopy(original)
    r=next(r for r in b['records'] if r['id']=='JA-EX-01')
    r['body']=[x.replace('人間レビュー状態：未レビュー','人間レビュー状態：要確認') for x in r['body']]
    cases['check-state']=b
    return cases


def main(only_evidence=False):
    RESULTS.mkdir(exist_ok=True)
    b=poc.write_fixtures()
    metadata=dict(python=platform.python_version(),platform=platform.platform(),cpu=platform.processor(),
                  logicalCpus=os.cpu_count(),clock='perf_counter_ns',repeats=9,warmups=2,
                  units='milliseconds / UTF-8 bytes',timestampUtc=time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),
                  implementationSha256={p:hashlib.sha256((poc.HERE/p).read_bytes()).hexdigest() for p in ('poc.py','measure.py')},
                  note='single process, no browser/LLM/render/network in CPU samples; no memory/RSS measurements')
    rows=[]
    for count in (() if only_evidence else (5,50,100,500,1000)):
        canonical=synthetic(count)
        expected=poc.validate(canonical)[0]
        for fmt in FORMATS:
            text=poc.encode(canonical,fmt)
            parsed=poc.decode(text,fmt)
            assert poc.validate(parsed)[0]==expected
            identifier=next(r['id'] for r in reversed(parsed['records']) if r['kind']=='activity')
            cached=poc.index(parsed)
            row=dict(activities=count,format=fmt,bytes=len(text.encode()),maxLineBytes=max(len(l.encode()) for l in text.splitlines()),
                     syntax=measure(lambda:poc.decode(text,fmt)),
                     index=measure(lambda:poc.index(parsed)),
                     fullValidated=measure(lambda:poc.load(text,fmt)),
                     coldSelected=measure(lambda:poc.select(poc.load(text,fmt),identifier)),
                     cachedLookup=measure(lambda:[cached[identifier] for _ in range(1000)]),
                     lookupBatchSize=1000)
            if fmt=='jsonl':
                row['untrustedScanFirst']=measure(lambda:scan_jsonl(text,next(r['id'] for r in parsed['records'] if r['kind']=='activity')))
                row['untrustedScanLast']=measure(lambda:scan_jsonl(text,identifier))
            rows.append(row)
        print(f'measured {count} Activities',flush=True)
    if not only_evidence:
        (RESULTS/'benchmark.json').write_text(poc.json_text(dict(environment=metadata,rows=rows),2)+'\n')
    diffs=[]
    for task,edited in edit_cases(b).items():
        poc.validate(edited)
        changed=[r['id'] for r,old in zip(edited['records'],b['records']) if r!=old]
        assert len(changed)==1
        for fmt in FORMATS:
            before,after=poc.encode(b,fmt),poc.encode(edited,fmt)
            restored=poc.load(after,fmt)
            assert poc.render_document(restored,'purchase')==poc.render_document(edited,'purchase')
            assert poc.render_document(restored,'checks')==poc.render_document(edited,'checks')
            patch=list(difflib.unified_diff(before.splitlines(True),after.splitlines(True),fromfile=f'before.{fmt}',tofile=f'after.{fmt}'))
            removed=[l for l in patch if l.startswith('-') and not l.startswith('---')]
            added=[l for l in patch if l.startswith('+') and not l.startswith('+++')]
            (RESULTS/f'{task}.{fmt}.patch').write_text(''.join(patch))
            with tempfile.TemporaryDirectory() as temp:
                left,right=Path(temp)/('before.'+fmt),Path(temp)/('after.'+fmt)
                left.write_text(before)
                right.write_text(after)
                gitdiff=subprocess.run(['git','diff','--no-index','--numstat',str(left),str(right)],capture_output=True,text=True)
                assert gitdiff.returncode==1,gitdiff.stderr
                git_added,git_removed=map(int,gitdiff.stdout.split('\t')[:2])
            diffs.append(dict(gitAddedLines=git_added,gitRemovedLines=git_removed,task=task,format=fmt,changedRecordIDs=changed,addedLines=len(added),removedLines=len(removed),
                              replacedLineBytes=sum(len(l.encode()) for l in added+removed),patchBytes=len(''.join(patch).encode()),
                              unintendedRecordChanges=0,editMethod='deterministic transformation; not an independent AI editing trial'))
    (RESULTS/'edits.json').write_text(poc.json_text(diffs,2)+'\n')
    class Handler(http.server.SimpleHTTPRequestHandler):
        def __init__(self,*args,**kwargs):
            super().__init__(*args,directory=str(poc.HERE/'fixtures'),**kwargs)
        def log_message(self,*args):
            pass
    server=http.server.ThreadingHTTPServer(('127.0.0.1',0),Handler)
    thread=threading.Thread(target=server.serve_forever,daemon=True)
    thread.start()
    transport=[]
    try:
        for fmt in FORMATS:
            path=poc.HERE/f'fixtures/purchase.{fmt}'
            data=path.read_bytes()
            with urllib.request.urlopen(f'http://127.0.0.1:{server.server_port}/purchase.{fmt}') as response:
                received=response.read()
                content_type=response.headers['Content-Type']
            assert received==data
            assert poc.load(received.decode(),fmt)==b
            transport.append(dict(format=fmt,bytes=len(data),sha256=hashlib.sha256(data).hexdigest(),
                                  localRead=measure(path.read_bytes),localhostUrlRoundTrip='passed',contentType=content_type,
                                  browserCORS='unverified',externalHTTPS='unverified',authenticatedURL='unverified'))
    finally:
        server.shutdown()
        server.server_close()
    (RESULTS/'transport.json').write_text(poc.json_text(transport,2)+'\n')


if __name__=='__main__':
    import sys
    main(only_evidence="--evidence-only" in sys.argv)
