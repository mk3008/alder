import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {validate} from '../../tools/document_storage/core.mjs';

const authorityPath='verification/test-spec-check-samples.check-items.json';
const authority=readFileSync(authorityPath),hash=value=>createHash('sha256').update(value).digest('hex');
const authHash='e9a3336bf8bdffefcbd2adafa3d139d4304451ebbd02389cf812ba7eb8d42f3b',expected=JSON.parse(authority).checks.map(item=>item.id),covered=new Set();assert.equal(hash(authority),authHash);
assert.deepEqual(expected,['SPEC-CHECK-LINK-001','SPEC-CHECK-LINK-002','SPEC-CHECK-LINK-003','SPEC-CHECK-LINK-004','SPEC-CHECK-LINK-005','SPEC-CHECK-LINK-006']);
const legacy=JSON.parse(readFileSync('../work/concept-review/issue-133/versions/purchase-v3-beta-function-preview.json','utf8'));
const demo=JSON.parse(readFileSync('../work/concept-review/issue-133/versions/purchase-v3-beta-test-spec-preview.json','utf8'));
const pkg=structuredClone(legacy),model=pkg.documents.find(d=>d.kind==='conceptModel'),bd=pkg.documents.find(d=>d.kind==='businessDesign');
const checkDoc=structuredClone(demo.documents.find(d=>d.kind==='checkItems'));pkg.documents.push(checkDoc);model.schemaVersion='0.2';
for(const group of model.reviewGroups){
 for(const capability of group.capabilities){
  const id=capability.id==='save-draft'?'request-draft':capability.id==='prepare-approved-requests'?'handoff-batch':null;
  capability.samples=capability.samples.filter(sample=>sample.id===id);
  for(const sample of capability.samples)sample.checkIds=[capability.id==='save-draft'?'preview-check-draft':'preview-check-handoff'];
 }
 const present=new Set(group.capabilities.flatMap(cap=>cap.samples.map(sample=>sample.id)));
 for(const statement of group.structureStatements)statement.sampleIds=statement.sampleIds.filter(id=>present.has(id));
}
// A second Check and scene exercise many-to-many references; this is a technical fixture only.
const draft=model.reviewGroups.find(g=>g.id==='group-request').capabilities.find(c=>c.id==='save-draft');
const second=structuredClone(checkDoc.items.find(item=>item.id==='preview-check-draft'));
second.id='fixture-extra-check';second.checkId='FIXTURE-03';second.title='別の業務にも関係する確認';second.reviewState='要確認';second.sectionId='preview-section-handoff';
second.fields={guarantee:[{kind:'reference',targetId:'fixture-shared-guarantee',label:'共通の保証'}]};
checkDoc.guarantees.push({id:'fixture-shared-guarantee',sectionId:second.sectionId,title:'共通の保証',blocks:[{kind:'prose',content:[{kind:'text',value:'参照された共通の期待結果'}]},{kind:'example',exampleId:'fixture-shared-example'}]});
checkDoc.examples.push({id:'fixture-shared-example',guaranteeId:'fixture-shared-guarantee',columns:['入力','結果'],rows:[[[{kind:'text',value:'入力例'}],[{kind:'text',value:'結果例'}]]]});
checkDoc.items.push(second);checkDoc.index.find(row=>row.checkIds.includes('preview-check-handoff')).checkIds.push(second.id);
draft.samples[0].checkIds.push(second.id);const other=structuredClone(draft.samples[0]);other.id='fixture-second-scene';other.name='もう一つの場面';other.checkIds=['preview-check-draft'];draft.samples.push(other);
validate(pkg);covered.add('SPEC-CHECK-LINK-001');
const apply=bd.activities.find(a=>a.name==='備品購入を申請する').id;
const key=`fn:${apply}:group-request:save-draft`;
const unbound=structuredClone(demo),unboundDoc=unbound.documents.find(d=>d.kind==='checkItems');
unboundDoc.guarantees.push({id:'unbound-guarantee',sectionId:'preview-section-request',title:'未接続の例',blocks:[{kind:'prose',content:[{kind:'text',value:'関連未確定'}]},{kind:'example',exampleId:'unbound-example'}]});
unboundDoc.examples.push({id:'unbound-example',guaranteeId:'unbound-guarantee',columns:['例'],rows:[[[{kind:'text',value:'表示されてはいけない孤立例'}]]]});validate(unbound);
async function bundle(raw){return (await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text','.json':'text'},plugins:[{name:'fixture',setup(b){b.onLoad({filter:/business-design\.json$/},()=>({contents:JSON.stringify(raw),loader:'text'}));}}]})).outputFiles[0].text;}
const [code,oldCode,unboundCode]=await Promise.all([bundle(pkg),bundle(legacy),bundle(unbound)]),windows=[];
async function open(script){
 const w=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/check-samples',runScripts:'outside-only',pretendToBeVisual:true}).window;windows.push(w);
 w.indexedDB=new IDBFactory();w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLElement.prototype.setPointerCapture=()=>{};
 w.eval(script);const $=s=>w.document.querySelector(s),until=async fn=>{for(let i=0;i<500&&!fn();i++)await new Promise(r=>setTimeout(r,10));assert.ok(fn(),'expected app state');};
 await until(()=>!!$('#open')&&!$('#open').disabled);$('#open-sample').click();await until(()=>w.document.querySelectorAll('.node').length>0&&!!$('[data-explorer-key="group:tests"]'));
 return {w,$,entry:id=>$('[data-explorer-key="'+id+'"]')};
}
try{
 const app=await open(code);app.entry('tests:'+key).click();const root=()=>app.$('#tests-workspace'),picker=()=>root().querySelector('select');
 assert.match(root().textContent,/下書き保存/);assert.match(root().textContent,/入力途中の下書きを保存できる/);assert.match(root().textContent,/確認が必要です/);assert.match(root().textContent,/入力途中の内容を下書きとして保存できる/);assert.match(root().textContent,/参照された共通の期待結果/);assert.match(root().textContent,/結果例/);
 assert.equal(root().querySelector('[data-data-example]').dataset.dataExample,'request-draft');covered.add('SPEC-CHECK-LINK-002');
 const sharedCheck=checkDoc.items.find(item=>item.id==='preview-check-draft');
 assert.equal(root().querySelectorAll('[data-check-id]').length,2);assert.match(root().querySelector(`[data-check-id="${sharedCheck.checkId}"] h3`).textContent,new RegExp(`^${sharedCheck.checkId} · `));assert.equal(second.reviewState,'要確認');covered.add('SPEC-CHECK-LINK-003');
 assert.deepEqual([...picker().options].map(o=>o.value),['request-draft','fixture-second-scene']);
 assert(root().querySelector('td[data-sample-key]'));picker().value='fixture-second-scene';picker().dispatchEvent(new app.w.Event('change'));
 assert.equal(root().querySelector('[data-data-example]').dataset.dataExample,'fixture-second-scene');assert.equal(root().querySelectorAll('[data-check-id]').length,1);assert.match(root().querySelector(`[data-check-id="${sharedCheck.checkId}"] h3`).textContent,new RegExp(`^${sharedCheck.checkId} · `));covered.add('SPEC-CHECK-LINK-005');
 const old=await open(oldCode);assert.equal(old.entry('tests:'+key),null);assert(!legacy.documents.some(d=>d.kind==='checkItems'));covered.add('SPEC-CHECK-LINK-004');
 const oldCheck=await open(unboundCode);oldCheck.entry('tests:checks:'+apply).click();const details=[...oldCheck.$('#tests-workspace').querySelectorAll('details')].find(item=>item.querySelector('summary')?.textContent==='未接続の例');assert(details);details.open=true;details.dispatchEvent(new oldCheck.w.Event('toggle'));assert.doesNotMatch(oldCheck.$('#tests-workspace').textContent,/表示されてはいけない孤立例/);
 assert.equal(pkg.documents.filter(doc=>doc.kind==='businessDesign').length,1);assert.equal(pkg.documents.filter(doc=>doc.kind==='checkItems').length,1);assert.equal(checkDoc.items.find(item=>item.id===second.id).reviewState,'要確認');covered.add('SPEC-CHECK-LINK-006');
 assert.deepEqual([...covered].sort(),expected.sort());assert.equal(hash(readFileSync(authorityPath)),authHash);
 console.log(JSON.stringify({passed:[...covered],scope:'actual DOM with technical Check fixture; semantic correspondence and human review not established'}));
}finally{for(const w of windows)w.close();}
