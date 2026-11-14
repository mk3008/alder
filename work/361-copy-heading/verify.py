"""Read-only acceptance/byte/result reconciliation, separate from implementation."""
import pathlib,subprocess,json,hashlib,sys,copy
root=pathlib.Path(__file__).resolve().parents[2];prep='fc6ad41f';start='94dde496cbec339b1ac29f224ffa1f54b732c4e4'
def git(*args):return subprocess.check_output(['git','-C',str(root),*args])
def sha(b):return hashlib.sha256(b).hexdigest()
def equal(a,b):assert a==b

def reject(fn):
 try:fn()
 except AssertionError:return
 raise AssertionError('negative example accepted')
frozen=json.loads(git('show',prep+':work/361-copy-heading/frozen.json'))
for p in ['acceptance.json','payloads.json','frozen.json']:
 equal((root/'work/361-copy-heading'/p).read_bytes(),git('show',prep+':work/361-copy-heading/'+p))
authority=json.loads(git('show',prep+':work/361-copy-heading/acceptance.json'));expected=[(c['id'],case) for c in authority['checks'] for case in c['cases']]
for p,h in frozen['protected'].items():equal(sha((root/p).read_bytes()),h)
prior=git('ls-tree','-r','--name-only',start,'--','web-viewer/web').decode().splitlines();prior=[p for p in prior if p.endswith(('.mjs','.json'))]
batch=subprocess.check_output(['git','-C',str(root),'cat-file','--batch'],input=''.join(start+':'+p+'\n' for p in prior).encode());offset=0;adapters=[]
for p in prior:
 end=batch.index(b'\n',offset);header=batch[offset:end].split();assert header[1]==b'blob';n=int(header[2]);offset=end+1;before=batch[offset:offset+n];offset+=n+1;current=(root/p).read_bytes()
 if current==before:continue
 s=current.decode()
 for v in ['dt','item','node']:s=s.replace(f"({v}.querySelector('.structure-detail-caption')?.textContent??{v}.textContent)===label",f'{v}.textContent===label')
 s=s.replace(".map(item=>item.querySelector('.structure-detail-caption')?.textContent??item.textContent);",'.map(item=>item.textContent);')
 s=s.replace(" const detailText=()=>{const copy=detail.cloneNode(true);copy.querySelector('.structure-copy-actions')?.remove();return copy.textContent;};\n",'').replace('assert.match(detailText(),/論理名id/)','assert.match(detail.textContent,/論理名id/)')
 s=s.replace("import {verifyStructureCopyHeading} from './test-structure-copy-heading-browser.mjs';\n",'').replace(',copyHeading:await verifyStructureCopyHeading(browser)','')
 equal(s.encode(),before);adapters.append(p)
assert len(adapters)==8,(adapters,'only eight planned accessor/additive browser adapters')
source=(root/'web-viewer/src/structure-explorer.ts').read_text();old=git('show',start+':web-viewer/src/structure-explorer.ts').decode()
equal(source.split('function addCopyActions')[0],old.split('function addCopyActions')[0]);marker='/** The DOM is lazy per path.';equal(source[source.index(marker):],old[old.index(marker):])
node=json.loads((root/'work/361-copy-heading/node-results.json').read_text())['copyHeadingNode'];nodecases={x['case'] for x in node['results'] if x['status']=='pass'}
browser=json.loads((root/'work/361-copy-heading/browser-results.json').read_text());binding=json.loads((root/'work/361-copy-heading/browser-binding.json').read_text())
equal(sha((root/'work/361-copy-heading/browser-results.json').read_bytes()),binding['resultsSha256'])
for p,h in binding['sourceSha256'].items():equal(sha((root/p).read_bytes()),h)
for p,h in binding['servedBuildSha256'].items():equal(sha((root/'web-viewer/dist'/p).read_bytes()),h)
rows={(r['kind'],r['width']):r for r in browser['results']};equal(set(rows),{(k,w) for k in ['structure','attribute','long-name'] for w in [1280,393]})
assert all(r['pageErrors']==[] for r in rows.values());equal(rows['structure',393]['denied'],'denied')
ci=json.loads(pathlib.Path(sys.argv[1]).read_text()) if len(sys.argv)>1 else None
if ci:
 equal(ci['candidate'],git('rev-parse','HEAD').decode().strip());assert all(x['conclusion']=='success' for x in ci['jobs']);assert len(ci['jobs'])==5;assert ci['chrome']=={'passed':55,'missing':0,'duplicate':0,'unknown':0};equal(ci['publicManifestSha256'],'9f3d4aeb93e2cd1fe34929e80ae6374aef2322969ddbad8d2f46217f568329ad')
results=[]
for id,case in expected:
 evidence=[];status='pass'
 if id=='COPY-HEADING-001' or id=='COPY-HEADING-002' or case in ('denied','unavailable'):
  assert case in nodecases,case;evidence=['test-structure-copy-heading.mjs:'+case]
 elif id=='COPY-HEADING-003':
  w=int(case.split('-')[-1]);assert all(rows[k,w]['touch' if case.startswith('touch') else 'keyboard'] for k in ['structure','attribute']);evidence=['native clipboard '+case]
 elif id=='COPY-HEADING-004':
  if case=='wrapped-controls':
   r=rows['structure',393]['wrapped'];assert r['buttons'][1]['top']>=r['buttons'][0]['bottom'];evidence=['393px viewport / 220px heading constraint']
  else:
   k,w=case.rsplit('-',1);r=rows[k,int(w)]['geometry'];assert r['value']['top']>=r['heading']['bottom']-1;assert r['scroll']<=r['client'];assert r['nextCaption']['top']>=r['value']['bottom']+12;evidence=['actual browser '+case]
 elif case=='frozen-authorities-and-data':evidence=['protected bytes and unchanged graph/explorer processing']
 elif case=='existing-assertions':evidence=['eight adapters reverse exactly to original test bytes; all remaining tests byte unchanged']
 elif case in ('full-ci','fixed-preview-unmodified'):
  status='pass' if ci else 'pending-ci';evidence=['CI '+str(ci['run'])] if ci else ['not yet verified on final remote head']
 else:raise AssertionError('unmapped case '+case)
 results.append({'id':id,'case':case,'status':status,'evidence':evidence})
def coverage(actual):
 equal(sorted((x['id'],x['case']) for x in actual),sorted(expected));assert len(actual)==len(expected);assert all(x['status'] in ('pass','pending-ci') for x in actual)
coverage(results);reject(lambda:coverage(results[1:]));reject(lambda:coverage(results+[results[0]]));bad=copy.deepcopy(results);bad[0]['status']='fail';reject(lambda:coverage(bad))
for change in ('id','case'):
 bad=copy.deepcopy(authority)
 if change=='id':bad['checks'].pop()
 else:bad['checks'][0]['cases'].pop()
 reject(lambda:equal(json.dumps(bad).encode(),git('show',prep+':work/361-copy-heading/acceptance.json')))
for p,h in frozen['protected'].items():equal(sha((root/p).read_bytes()),h)
print(json.dumps({'candidate':git('rev-parse','HEAD').decode().strip(),'preparation':git('rev-parse',prep).decode().strip(),'authoritySha256':frozen['acceptanceSha256'],'protectedFiles':len(frozen['protected']),'priorTests':len(prior),'testAdapters':adapters,'ids':len(authority['checks']),'cases':len(expected),'negativeExamples':'deleted ID/case, missing/duplicate/failed result rejected','results':results,'scope':'Same-agent separate read-only reconciliation; no independent Agent claim; pending cases are not pass.'},ensure_ascii=False,indent=2))
