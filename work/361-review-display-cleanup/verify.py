#!/usr/bin/env python3
"""Read-only authority/coverage reconciliation, independent of the renderer.
Pending integration/publication cases are reported, never counted as pass.
"""
import copy,hashlib,json,pathlib,subprocess,sys
root=pathlib.Path(__file__).resolve().parents[2]
folder=root/'work/361-review-display-cleanup'
expected='4b9fc2d3c280aa8c20972fc1a8e7693df7236080da2adf3fe38b0e33a81c5643'
sha=lambda b:hashlib.sha256(b).hexdigest()
raw=(folder/'acceptance.json').read_bytes();assert sha(raw)==expected,'authority bytes changed'
a=json.loads(raw);baseline_bytes=subprocess.check_output(['git','show','21ce2201:work/361-review-display-cleanup/start-baseline.json'],cwd=root);assert (folder/'start-baseline.json').read_bytes()==baseline_bytes,'baseline changed';b=json.loads(baseline_bytes)
for p,h in b['protected'].items():assert sha((root/p).read_bytes())==h,p
allowed={'web-viewer/src/structure-explorer.ts','web-viewer/src/structure-explorer.css','web-viewer/src/structure-review-candidates.ts','web-viewer/src/viewer-shell.css','web-viewer/web/test-structure-copy-heading-browser.mjs','web-viewer/web/test-structure-review-hypotheses.mjs','web-viewer/web/test-structure-review-hypotheses-browser.mjs','web-viewer/web/test-structure-review-integrity.mjs'}
changed=subprocess.check_output(['git','diff','21ce2201','--name-only'],cwd=root).decode().splitlines()
assert all(p in allowed or p.startswith('work/361-review-display-cleanup/') for p in changed),'out-of-scope edit'
old_css=subprocess.check_output(['git','show','21ce2201:web-viewer/src/structure-explorer.css'],cwd=root)
prefix=old_css.split(b'.structure-copy-heading{')[0]
assert (root/'web-viewer/src/structure-explorer.css').read_bytes().startswith(prefix),'unrelated structure CSS changed'
frozen=json.loads(subprocess.check_output(['git','show','fecb6530:work/361-review-display-cleanup/acceptance.json'],cwd=root))
assert a==frozen
pairs=lambda x:{(c['id'],name) for c in x['checks'] for name in c['cases']}
expected_pairs=pairs(frozen)
def coverage(contract,results):
 assert pairs(contract)==expected_pairs,'ID/case missing'
 actual={(r['id'],r['case']) for r in results}
 assert len(actual)==len(results),'duplicate result'
 assert actual==expected_pairs,'result missing'
 assert all(r['status'] in ['pass','pending','fail'] and r['evidence'] for r in results)
rows=json.loads((folder/'results.json').read_text())['results'];coverage(a,rows)
for mutation in ['id','case','result']:
 changed=copy.deepcopy(a);r=copy.deepcopy(rows)
 if mutation=='id':changed['checks'].pop()
 elif mutation=='case':changed['checks'][0]['cases'].pop()
 else:r.pop()
 try:coverage(changed,r)
 except AssertionError:continue
 raise AssertionError('negative not detected: '+mutation)
assert sha(raw+b' ')!=expected
pending=[r['id']+':'+r['case'] for r in rows if r['status']!='pass']
print(json.dumps({'protected':len(b['protected']),'checks':len(a['checks']),'cases':len(expected_pairs),'negativeTests':['authority-byte-change','id-deletion','case-deletion','result-omission'],'pending':pending},ensure_ascii=False))
if '--require-complete' in sys.argv:assert not pending,'incomplete verification'
