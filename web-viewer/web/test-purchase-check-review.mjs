import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {validate} from '../../tools/document_storage/core.mjs';

const source=JSON.parse(readFileSync('../work/concept-review/issue-133/versions/purchase-v3-beta-function-preview.json','utf8'));
// Preserve the original all-scene legacy contract independently of the new
// explicit split presentation, whose decision/result cases have their own test.
const pkg=JSON.parse(readFileSync('../work/concept-review/issue-133/versions/purchase-v4-check-review.json','utf8'));
for(const group of pkg.documents.find(doc=>doc.kind==='conceptModel').reviewGroups)for(const cap of group.capabilities)delete cap.testSpecification;
const oldChecks=pkg.documents.find(doc=>doc.kind==='checkItems');oldChecks.guarantees=oldChecks.guarantees.filter(g=>!g.id.startsWith('decision-'));oldChecks.examples=oldChecks.examples.filter(e=>!e.id.startsWith('decision-'));
validate(pkg);
const bd=pkg.documents.find(doc=>doc.kind==='businessDesign'),model=pkg.documents.find(doc=>doc.kind==='conceptModel'),doc=pkg.documents.find(doc=>doc.kind==='checkItems');
const oldModel=source.documents.find(d=>d.kind==='conceptModel'),all=group=>group.capabilities.flatMap(cap=>cap.samples);
const originals=oldModel.reviewGroups.flatMap(all),samples=model.reviewGroups.flatMap(all);
assert.equal(bd.activities.length,5);assert.equal(doc.items.length,31);assert.equal(samples.length,31);
assert(originals.every(old=>samples.some(sample=>sample.id===old.id)),'all original scenes remain available');
assert(doc.items.every(item=>['未レビュー','要確認'].includes(item.reviewState)),'drafts are not marked approved');
assert(doc.items.every(item=>!item.fields.testEvidence),'no Test evidence is manufactured');
assert(doc.items.every(item=>samples.some(sample=>sample.checkIds.includes(item.id))),'every Check has a reviewable example');
assert(samples.every(sample=>sample.checkIds.length&&sample.checkIds.every(id=>doc.items.some(item=>item.id===id))),'every example refers to an actual Check');
const bundle=await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text','.json':'text'},plugins:[{name:'purchase-review',setup(b){b.onLoad({filter:/business-design\.json$/},()=>({contents:JSON.stringify(pkg),loader:'text'}));}}]});
const w=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/purchase',runScripts:'outside-only',pretendToBeVisual:true}).window;
w.indexedDB=new IDBFactory();w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLElement.prototype.setPointerCapture=()=>{};
const $=s=>w.document.querySelector(s),entry=key=>$(`[data-explorer-key="${key}"]`),until=async fn=>{for(let i=0;i<500&&!fn();i++)await new Promise(r=>setTimeout(r,10));assert.ok(fn(),'expected app state');};
try{
 w.eval(bundle.outputFiles[0].text);await until(()=>!!$('#open')&&!$('#open').disabled);$('#open-sample').click();await until(()=>w.document.querySelectorAll('.node').length>0&&entry('group:tests'));
 let scenes=0;const seen=new Set(),byId=new Map(doc.items.map(item=>[item.id,item]));
 for(const view of model.presentation.activityViews){
  const activityId=view.activityId,visible=new Set();
  for(const ref of view.testSpecificationFunctions??[]){
   const group=model.reviewGroups.find(g=>g.id===ref.groupId),cap=group.capabilities.find(c=>c.id===ref.capabilityId);
   const key=`fn:${activityId}:${group.id}:${cap.id}`,button=entry('tests:'+key);assert(button,`missing function ${ref.name}`);button.click();
   const picker=()=>$('#tests-workspace select'),expected=cap.samples.filter(sample=>sample.checkIds.some(id=>doc.index.some(row=>row.activityId===activityId&&row.checkIds.includes(id))));
   assert.deepEqual([...picker().options].map(option=>option.value),expected.map(sample=>sample.id));
   for(const sample of expected){
    picker().value=sample.id;picker().dispatchEvent(new w.Event('change'));const panel=$('#tests-workspace');assert.equal(panel.querySelector('[data-data-example]').dataset.dataExample,sample.id);
    const cards=[...panel.querySelectorAll('[data-element-id]')];assert.deepEqual(cards.map(card=>card.dataset.elementId),sample.checkIds);
    for(const card of cards){const check=byId.get(card.dataset.elementId);assert.match(card.textContent,new RegExp(check.checkId));assert(card.textContent.includes(check.fields.condition[0].value));assert(card.textContent.includes(check.fields.expectedResult[0].value));visible.add(check.id);seen.add(check.id);}
    assert(panel.querySelector('table'),'the sample has a visible table');scenes++;
   }
  }
  const expectedIds=doc.index.filter(row=>row.activityId===activityId).flatMap(row=>row.checkIds);assert.deepEqual([...visible].sort(),[...new Set(expectedIds)].sort(),`activity ${activityId} loses no Check`);
  assert.equal(entry('tests:checks:'+activityId),null);assert.equal(entry('tests:remaining:'+activityId),null);
 }
 assert.deepEqual([...seen].sort(),doc.items.map(item=>item.id).sort());assert.equal(scenes,31);
 const apply=bd.activities.find(a=>a.name==='備品購入を申請する').id;
 const key=cap=>`tests:fn:${apply}:group-request:${cap}`;entry(key('save-draft')).click();assert.equal($('#tests-workspace select').options.length,4);entry(key('submit-request')).click();assert.equal($('#tests-workspace select').options.length,4);
 console.log(JSON.stringify({checks:seen.size,scenes,activities:bd.activities.length,originalScenes:originals.length,scope:'actual purchase review JSON in Viewer DOM; business approval is not inferred'}));
}finally{w.close();}
